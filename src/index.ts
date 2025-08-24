import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { DragonSwapV1Service } from './services/dragonswap-v1.js';
import { DRAGONSWAP_V1_CONFIG, DRAGONSWAP_V1_TEST_CONFIG } from './config/constants.js';

export const configSchema = z.object({
  privateKey: z.string().describe('Private key for signing transactions').optional(),
});

const listPoolsSchema = z.object({
  limit: z.number().min(1).max(200).default(50).describe('Maximum number of pools to return.'),
});

const getQuoteSchema = z.object({
  tokenIn: z.string().describe('Address of the input token.'),
  tokenOut: z.string().describe('Address of the output token.'),
  amountIn: z.string().describe('Amount of input token (in token units, not wei).'),
});

const executeSwapSchema = z.object({
  tokenIn: z.string().describe('Address of the input token.'),
  tokenOut: z.string().describe('Address of the output token.'),
  amountIn: z.string().describe('Amount of input token (in token units, not wei).'),
});

const wrapSeiSchema = z.object({
  amount: z.string().describe('Amount of SEI to wrap (in SEI units, not wei).'),
});

const approveWseiSchema = z.object({
  amount: z.string().describe('Amount of wSEI to approve for spending.'),
});

export default function ({ config }: { config: z.infer<typeof configSchema> }) {
  const dragonSwapService = new DragonSwapV1Service(DRAGONSWAP_V1_TEST_CONFIG, config.privateKey);

  const server = new McpServer({
    name: 'dragonswap-v1',
    version: '1.0.0',
    description: 'Interact with DragonSwap V1 on the SEI blockchain.',
  });

  server.tool(
    'list_pools',
    'List available liquidity pools on DragonSwap V1.',
    listPoolsSchema.shape,
    async (args: z.infer<typeof listPoolsSchema>) => {
      try {
        const { limit } = args;
        const pools = await dragonSwapService.getAllPools();
        const limitedPools = pools.slice(0, limit);
        return {
          content: [{ type: 'text', text: JSON.stringify(limitedPools, null, 2) }],
        };
      } catch (e: any) {
        return { isError: true, content: [{ type: 'text', text: e.message }] };
      }
    }
  );

  server.tool(
    'get_quote',
    'Get a quote for swapping tokens on DragonSwap V1.',
    getQuoteSchema.shape,
    async (args: z.infer<typeof getQuoteSchema>) => {
      try {
        const { tokenIn, tokenOut, amountIn } = args;
        const amountOut = await dragonSwapService.getQuote(tokenIn, tokenOut, amountIn);
        return {
          content: [{ type: 'text', text: `Quote: ${amountIn} of ${tokenIn} will get you approximately ${amountOut} of ${tokenOut}` }],
        };
      } catch (e: any) {
        return { isError: true, content: [{ type: 'text', text: e.message }] };
      }
    }
  );

  server.tool(
    'execute_swap',
    'Execute a swap on DragonSwap V1.',
    executeSwapSchema.shape,
    async (args: z.infer<typeof executeSwapSchema>) => {
      try {
        const { tokenIn, tokenOut, amountIn } = args;
        const txHash = await dragonSwapService.executeSwap(tokenIn, tokenOut, amountIn);
        return {
          content: [{ type: 'text', text: `Swap executed successfully. Transaction hash: ${txHash}` }],
        };
      } catch (e: any) {
        return { isError: true, content: [{ type: 'text', text: e.message }] };
      }
    }
  );

  server.tool(
    'wrap_sei',
    'Wrap native SEI into wSEI.',
    wrapSeiSchema.shape,
    async (args: z.infer<typeof wrapSeiSchema>) => {
      try {
        const { amount } = args;
        const txHash = await dragonSwapService.wrapSei(amount);
        return {
          content: [{ type: 'text', text: `Successfully wrapped ${amount} SEI. Transaction hash: ${txHash}` }],
        };
      } catch (e: any) {
        return { isError: true, content: [{ type: 'text', text: e.message }] };
      }
    }
  );

  server.tool(
    'approve_wsei',
    'Approve the DragonSwap router to spend your wSEI.',
    approveWseiSchema.shape,
    async (args: z.infer<typeof approveWseiSchema>) => {
      try {
        const { amount } = args;
        const txHash = await dragonSwapService.approveWsei(amount);
        return {
          content: [{ type: 'text', text: `Successfully approved ${amount} wSEI for spending. Transaction hash: ${txHash}` }],
        };
      } catch (e: any) {
        return { isError: true, content: [{ type: 'text', text: e.message }] };
      }
    }
  );

  return server.server;
}
