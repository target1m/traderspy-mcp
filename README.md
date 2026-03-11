# TraderSpy MCP — Crypto Smart Money & AI Signals

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=traderspy&config=eyJ0cmFkZXJzcHkiOnsidHlwZSI6Imh0dHAiLCJ1cmwiOiJodHRwczovL21jcC50cmFkZXJzcHkuYXBwL21jcCJ9fQ%3D%3D)

Connect your AI coding assistant to [TraderSpy](https://traderspy.app)'s real-time crypto futures intelligence. Track whale positions, get AI trading signals, and monitor elite traders — all from your editor.

## Features

- **AI Trading Signals** — Real-time AI-powered crypto futures signals with entry/exit targets, stop loss, and confidence scores
- **Smart Money Tracking** — Track whale/elite trader positions across Binance, Hyperliquid, Bybit, and OKX
- **Elite Leaderboard** — Top traders ranked by SmartScore (weighted: PnL, win rate, ROI, consistency)
- **Live Positions** — See what top traders are trading right now
- **Market Stats** — Aggregate market statistics across tracked exchanges

## Quick Start

### Claude Code

**Option 1: Add MCP server directly**

```bash
claude mcp add --transport http traderspy https://mcp.traderspy.app/mcp
```

**Option 2: Install as plugin**

Inside Claude Code, run:
```
/plugin marketplace add target1m/traderspy-mcp
/plugin install traderspy-mcp@traderspy
```

### ChatGPT

1. Go to [ChatGPT](https://chatgpt.com) → Settings → Connected Apps
2. Click **"Add MCP Server"**
3. Enter the server URL:
   ```
   https://mcp.traderspy.app/mcp
   ```
4. Complete the OAuth login flow to connect your TraderSpy account

### Cursor

Click the badge above or manually add to your Cursor MCP config (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "traderspy": {
      "type": "http",
      "url": "https://mcp.traderspy.app/mcp"
    }
  }
}
```

### Windsurf / Other MCP Clients

Add the following to your MCP configuration:

```json
{
  "traderspy": {
    "type": "http",
    "url": "https://mcp.traderspy.app/mcp"
  }
}
```

## Authentication

When you first use a tool, you'll be redirected to sign in with your TraderSpy account via OAuth. No API keys needed — just log in and start using.

| Plan | Daily Limit | Data |
|------|------------|------|
| Free | 3 calls/day | Real-time |
| Pro | 100 calls/day | Real-time |

Don't have an account? [Sign up for free](https://traderspy.app) to get started.

## Available Tools

| Tool | Description |
|------|-------------|
| `get_signals` | Recent AI trading signals with filtering |
| `get_signal_details` | Full signal details with AI review |
| `get_signal_stats` | Signal performance statistics |
| `get_top_traders` | Ranked traders by exchange and metrics |
| `get_elite_leaderboard` | Top 10 by SmartScore |
| `get_trader_profile` | Trader profile with metrics and positions |
| `get_trader_position_history` | Trader's closed trade history |
| `get_positions` | Live and historical positions |
| `get_market_stats` | Aggregate market statistics |
| `get_exchanges` | List of tracked exchanges |

## Example Prompts

- "What are the top crypto signals right now?"
- "Show me the elite trader leaderboard"
- "What are whales buying on Binance?"
- "Get the signal performance stats for the last 24 hours"
- "Show me BTC positions from top traders"
- "Who are the most profitable traders on Hyperliquid this week?"
- "What's the overall market sentiment — are more traders long or short on BTC?"

## Links

- [TraderSpy](https://traderspy.app) — Main platform
- [GitHub](https://github.com/target1m/traderspy-mcp) — Plugin source code
- [Support](mailto:support@traderspy.app) — Contact us
