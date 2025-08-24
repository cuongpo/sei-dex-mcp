import { DragonSwapConfig, DragonSwapV1Config } from '../types/dragonswap.js';

// Production environment (pacific-1) contract addresses
export const DRAGONSWAP_V2_CONFIG: DragonSwapConfig = {
  factoryAddress: '0x179D9a5592Bc77050796F7be28058c51cA575df4',
  multicallAddress: '0x2183BB693DFb41047f3812975b511e272883CfAA',
  quoterV2Address: '0x38F759cf0Af1D0dcAEd723a3967A3B658738eDe9',
  swapRouter02Address: '0x11DA6463D6Cb5a03411Dbf5ab6f6bc3997Ac7428',
  nonfungiblePositionManagerAddress: '0xa7FDcBe645d6b2B98639EbacbC347e2B575f6F70',
  rpcUrl: 'https://evm-rpc.sei-apis.com',
  chainId: 1329, // SEI Pacific-1 chain ID
};

// Test environment contract addresses (for development)
export const DRAGONSWAP_V2_TEST_CONFIG: DragonSwapConfig = {
  factoryAddress: '0x0bcea088e977a03113a880cF7c5b6165D8304B16',
  multicallAddress: '0xf1DC77C0714ceCd722028DFfC18A5A50EFe9d2ba',
  quoterV2Address: '0x58F738F3A2B4e9e0217f948eF07324d15eBF0b9a',
  swapRouter02Address: '0x4c0b142FA93fF118474f69568953a2966f31a627',
  nonfungiblePositionManagerAddress: '0xCB796653533a4C0982D7C698932e2008A32209AA',
  rpcUrl: 'https://evm-rpc.atlantic-2.seinetwork.io',
  chainId: 713715, // SEI Atlantic-2 testnet chain ID
};

// Common fee tiers used in Uniswap V3 / DragonSwap V2
export const FEE_TIERS = {
  LOWEST: 100,    // 0.01%
  LOW: 500,       // 0.05%
  MEDIUM: 3000,   // 0.3%
  HIGH: 10000,    // 1%
} as const;

// Tick spacing for different fee tiers
export const TICK_SPACINGS = {
  [FEE_TIERS.LOWEST]: 1,
  [FEE_TIERS.LOW]: 10,
  [FEE_TIERS.MEDIUM]: 60,
  [FEE_TIERS.HIGH]: 200,
} as const;

// Common token addresses on SEI
export const COMMON_TOKENS = {
  WSEI: '0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7',
  USDC: '0x3894085Ef7Ff0f0aeDf52E2A2704928d259C2129',
  USDT: '0xB75D0B03c06A926e488e2659DF1A861F860bD3d1',
  // Add more common tokens as needed
} as const;

// Maximum values for safety checks
export const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const MAX_UINT128 = '0xffffffffffffffffffffffffffffffff';

// Default deadline for transactions (20 minutes from now)
export const DEFAULT_DEADLINE_MINUTES = 20;

// Slippage tolerance (in basis points)
export const DEFAULT_SLIPPAGE_TOLERANCE = 50; // 0.5%

// Production environment (pacific-1) contract addresses
export const DRAGONSWAP_V1_CONFIG: DragonSwapV1Config = {
  factoryAddress: '0x71f6b49ae1558357bBb5A6074f1143c46cBcA03d',
  routerAddress: '0xa4cF2F53D1195aDDdE9e4D3aCa54f556895712f2',
  wseiAddress: '0x027D2E627209f1cebA52ADc8A5aFE9318459b44B',
  rpcUrl: 'https://evm-rpc.sei-apis.com',
  chainId: 1329, // SEI Pacific-1 chain ID
};

// Test environment contract addresses (for development)
export const DRAGONSWAP_V1_TEST_CONFIG: DragonSwapV1Config = {
  factoryAddress: '0xeE6Ad607238f8d2C63767245d78520F06c303D31',
  routerAddress: '0x527b42CA5e11370259EcaE68561C14dA415477C8',
  wseiAddress: '0xF8EB55EC97B59d91fe9E91A1d61147e0d2A7b6F7',
  rpcUrl: 'https://evm-rpc.atlantic-2.seinetwork.io',
  chainId: 713715, // SEI Atlantic-2 testnet chain ID
};
