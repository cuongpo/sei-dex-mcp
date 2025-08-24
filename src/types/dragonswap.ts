export interface DragonSwapConfig {
  factoryAddress: string;
  multicallAddress: string;
  quoterV2Address: string;
  swapRouter02Address: string;
  nonfungiblePositionManagerAddress: string;
  rpcUrl: string;
  chainId: number;
}


export type DragonSwapV1Config = {
  factoryAddress: string;
  routerAddress: string;
  wseiAddress: string;
  rpcUrl: string;
  chainId: number;
};
export interface Pool {
  id: string;
  token0: Token;
  token1: Token;
  fee: number;
  tickSpacing: number;
  liquidity: string;
  sqrtPriceX96: string;
  tick: number;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}

export interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  fee: number;
  recipient: string;
  deadline: number;
  amountIn: string;
  amountOutMinimum: string;
  sqrtPriceLimitX96: string;
}

export interface QuoteParams {
  tokenIn: string;
  tokenOut: string;
  fee: number;
  amountIn: string;
  sqrtPriceLimitX96?: string;
}

export interface QuoteResult {
  amountOut: string;
  sqrtPriceX96After: string;
  initializedTicksCrossed: number;
  gasEstimate: string;
}

export interface PoolInfo {
  address: string;
  token0: Token;
  token1: Token;
  fee: number;
  tickSpacing: number;
  liquidity: string;
  sqrtPriceX96: string;
  tick: number;
  tvl: string;
  volume24h: string;
  feesGenerated24h: string;
}

export interface Position {
  tokenId: string;
  owner: string;
  token0: Token;
  token1: Token;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
  feeGrowthInside0LastX128: string;
  feeGrowthInside1LastX128: string;
  tokensOwed0: string;
  tokensOwed1: string;
}
