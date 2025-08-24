import { ethers } from 'ethers';
import { DragonSwapV1Config } from '../types/dragonswap.js';

const factoryAbi = [
  'function allPairs(uint256) external view returns (address pair)',
  'function allPairsLength() external view returns (uint256)',
];

const pairAbi = [
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
];

const erc20Abi = [
  'function symbol() external view returns (string)',
  'function decimals() external view returns (uint8)',
  'function approve(address spender, uint256 amount) external returns (bool)',
];

const routerAbi = [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
];

const wseiAbi = ['function deposit() public payable', 'function withdraw(uint wad) public'];

export class DragonSwapV1Service {
  private provider: ethers.JsonRpcProvider;
  private factoryContract: ethers.Contract;
  private routerContractReadOnly: ethers.Contract; // For read operations (quotes)
  private wallet: ethers.Wallet | undefined;
  private routerContract: ethers.Contract | undefined; // For write operations (swaps)

  constructor(private config: DragonSwapV1Config, private privateKey?: string) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.factoryContract = new ethers.Contract(config.factoryAddress, factoryAbi, this.provider);
    this.routerContractReadOnly = new ethers.Contract(config.routerAddress, routerAbi, this.provider);
  }

  private _getWallet(): ethers.Wallet {
    if (this.wallet) {
      return this.wallet;
    }

    if (!this.privateKey || this.privateKey.length !== 64) {
      throw new Error('A valid 64-character private key is not configured. Please provide it in your session configuration.');
    }

    this.wallet = new ethers.Wallet(this.privateKey, this.provider);
    this.routerContract = new ethers.Contract(this.config.routerAddress, routerAbi, this.wallet);
    return this.wallet;
  }

  async getAllPools(): Promise<any[]> {
    const pairCount = await this.factoryContract.allPairsLength();
    const pools: any[] = [];

    for (let i = 0; i < pairCount; i++) {
      try {
        const pairAddress = await this.factoryContract.allPairs(i);
        if (pairAddress === ethers.ZeroAddress) {
          continue;
        }

        const pairContract = new ethers.Contract(pairAddress, pairAbi, this.provider);

        const [token0Address, token1Address, reserves] = await Promise.all([
          pairContract.token0(),
          pairContract.token1(),
          pairContract.getReserves(),
        ]);

        const token0Contract = new ethers.Contract(token0Address, erc20Abi, this.provider);
        const token1Contract = new ethers.Contract(token1Address, erc20Abi, this.provider);

        const [token0Symbol, token1Symbol, token0Decimals, token1Decimals] = await Promise.all([
          token0Contract.symbol(),
          token1Contract.symbol(),
          token0Contract.decimals(),
          token1Contract.decimals(),
        ]);

        pools.push({
          pairAddress,
          token0: {
            address: token0Address,
            symbol: token0Symbol,
            decimals: token0Decimals.toString(),
          },
          token1: {
            address: token1Address,
            symbol: token1Symbol,
            decimals: token1Decimals.toString(),
          },
          reserves: {
            reserve0: reserves.reserve0.toString(),
            reserve1: reserves.reserve1.toString(),
          },
        });
      } catch (error) {
        console.error(`Failed to fetch details for pair at index ${i}. Skipping.`);
      }
    }

    return pools;
  }

  async getQuote(tokenIn: string, tokenOut: string, amountIn: string): Promise<string> {
    const tokenInContract = new ethers.Contract(tokenIn, erc20Abi, this.provider);
    const decimals = await tokenInContract.decimals();
    const parsedAmountIn = ethers.parseUnits(amountIn, decimals);

    const amountsOut = await this.routerContractReadOnly.getAmountsOut(parsedAmountIn, [tokenIn, tokenOut]);

    const tokenOutContract = new ethers.Contract(tokenOut, erc20Abi, this.provider);
    const outDecimals = await tokenOutContract.decimals();

    return ethers.formatUnits(amountsOut[1], outDecimals);
  }

  async executeSwap(tokenIn: string, tokenOut: string, amountIn: string): Promise<string> {
    const wallet = this._getWallet();
    const routerContract = this.routerContract!;
    const tokenInContract = new ethers.Contract(tokenIn, erc20Abi, wallet);
    const decimals = await tokenInContract.decimals();
    const parsedAmountIn = ethers.parseUnits(amountIn, decimals);

    // Approve the router to spend the tokens
    const approveTx = await tokenInContract.approve(this.config.routerAddress, parsedAmountIn);
    await approveTx.wait();

    const amountsOut = await this.routerContractReadOnly.getAmountsOut(parsedAmountIn, [tokenIn, tokenOut]);
    const amountOutMin = (amountsOut[1] * BigInt(99)) / BigInt(100); // 1% slippage tolerance

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    const tx = await routerContract.swapExactTokensForTokens(
      parsedAmountIn,
      amountOutMin,
      [tokenIn, tokenOut],
      wallet.address,
      deadline
    );

    await tx.wait();
    return tx.hash;
  }

  async wrapSei(amount: string): Promise<string> {
    const wallet = this._getWallet();
    console.log(`Attempting to wrap ${amount} SEI`);
    const wseiContract = new ethers.Contract(this.config.wseiAddress, wseiAbi, wallet);
    const valueToWrap = ethers.parseUnits(amount, 6);
    console.log(`Calculated value (in wei, 6 decimals): ${valueToWrap.toString()}`);
    console.log(`wSEI Contract Address: ${this.config.wseiAddress}`);
    console.log(`Signer Address: ${wallet.address}`);

    try {
      const tx = await wseiContract.deposit({
        value: valueToWrap,
      });
      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Transaction confirmed.');
      return tx.hash;
    } catch (error) {
      console.error('Error during wrapSei execution:', error);
      throw error; // Re-throw the error to be caught by the tool handler
    }
  }

  async approveWsei(amount: string): Promise<string> {
    const wallet = this._getWallet();
    const wseiContract = new ethers.Contract(this.config.wseiAddress, erc20Abi, wallet);
    const decimals = await wseiContract.decimals();
    const parsedAmount = ethers.parseUnits(amount, decimals);

    const approveTx = await wseiContract.approve(this.config.routerAddress, parsedAmount);
    await approveTx.wait();
    return approveTx.hash;
  }

}

