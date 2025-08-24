# MCP DEX SEI

This project is designed to simplify interactions with decentralized exchanges on the SEI blockchain by providing a powerful, agentic toolset.

## Benefits for Users

*   **Simplified DeFi**: Execute complex blockchain operations like wrapping and swapping tokens through simple, natural language commands.
*   **Abstracted Complexity**: No need to manually interact with smart contracts, ABIs, or calculate gas fees. The agent handles all the technical details.

## Benefits for Developers

*   **Focus on Core Logic**: Avoid reinventing the wheel. This framework handles the low-level complexities of blockchain interaction, allowing you to focus on building unique features and trading strategies.
*   **Rapid Prototyping**: Quickly build and test complex DeFi applications and agents.


## Current Features

*   Interact with DragonSwap V1 on the SEI `atlantic-2` testnet.
*   `list_pools`: List available liquidity pools.
*   `get_quote`: Get a swap quote.
*   `execute_swap`: Execute a token swap.
*   `wrap_sei`: Wrap native SEI into wSEI.
*   `approve_wsei`: Approve the DragonSwap router to spend wSEI.


## Demo and Usage

You can find a live demo of this server here: [https://smithery.ai/server/@cuongpo/sei-dex-mcp](https://smithery.ai/server/@cuongpo/sei-dex-mcp)

### Connecting with VS Code

You can connect to this server from VS Code by adding the following to your `.vscode/settings.json` file:

```json
{
  "mcpServers": {
    "sei-dex-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@cuongpo/sei-dex-mcp",
        "--key",
        "your-key",
        "--profile",
        "your profile"
      ]
    }
  }
}
```

Alternatively, you can use the one-click import from the server's demo page: [https://smithery.ai/server/@cuongpo/sei-dex-mcp](https://smithery.ai/server/@cuongpo/sei-dex-mcp)

### Connecting with the TypeScript SDK

You can also connect to the server programmatically using the MCP TypeScript SDK.

**Installation**

```bash
npm install @modelcontextprotocol/sdk
```

**Example**

```typescript
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"

// Construct server URL with authentication
const url = new URL("https://server.smithery.ai/@cuongpo/sei-dex-mcp/mcp")
url.searchParams.set("api_key", "your-api-key")
url.searchParams.set("profile", "your-profile")
const serverUrl = url.toString()

const transport = new StreamableHTTPClientTransport(serverUrl)

// Create MCP client
const client = new Client({
  name: "My App",
  version: "1.0.0"
})
await client.connect(transport)

// List available tools
const tools = await client.listTools()
console.log(`Available tools: ${tools.map(t => t.name).join(", ")}`)
```

## How to Use: Swap SEI for USDT

Here is a step-by-step guide to perform a swap from the native SEI token to a stablecoin like USDT.

### Step 1: Wrap SEI into wSEI

Before you can trade native SEI on a DEX, you must wrap it into an ERC-20 compliant token (wSEI).

**Tool**: `wrap_sei`
**Example**: `wrap_sei with amount: "1"`

### Step 2: Find the wSEI and USDT Token Addresses

Use the `list_pools` tool to find the correct token addresses for wSEI and the desired USDT token on the `atlantic-2` testnet.

**Tool**: `list_pools`
**Example**: `list_pools`

*Look for the wSEI address (`0xF8EB55EC97B59d91fe9E91A1d61147e0d2A7b6F7`) and a corresponding USDT address in a liquidity pool.*

### Step 3: Approve the Router to Spend Your wSEI

You must grant the DragonSwap router permission to spend the wSEI you just wrapped. This is a required step before executing a swap.

**Tool**: `approve_wsei`
**Example**: `approve_wsei with amount: "1"`

### Step 4: Get a Quote for the Swap

Check the estimated return for your swap before executing it.

**Tool**: `get_quote`
**Example**: `get_quote with tokenIn: "<wSEI_ADDRESS>", tokenOut: "<USDT_ADDRESS>", amountIn: "1"`

### Step 5: Execute the Swap

If you are satisfied with the quote, you can execute the trade.

**Tool**: `execute_swap`
**Example**: `execute_swap with tokenIn: "<wSEI_ADDRESS>", tokenOut: "<USDT_ADDRESS>", amountIn: "1"`


## Future Features

*   Expand MCP tools to include:
    *   Add liquidity
    *   Remove liquidity
    *   Lending
*   Expand to other DEXs on the SEI blockchain.


## Use Cases

The agentic nature of this toolset opens up a wide range of powerful automated trading strategies.

*   **News-Driven Trading Bot**: Combine these tools with a news-monitoring agent. When the agent detects positive or negative news about a token, it can automatically execute a swap to capitalize on the information.
*   **Copy Trading**: Monitor the on-chain activity of a successful trader's wallet. When the trader makes a swap, the agent can automatically replicate the trade in your own wallet.