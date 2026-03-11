# TraderSpy MCP Plugin for Claude Code

Connect Claude to [TraderSpy](https://traderspy.app)'s smart-money tracking and AI trading signal data.

## Features

- **AI Trading Signals** — Real-time AI-powered crypto futures signals with importance levels, targets, and performance stats
- **Smart Money Tracking** — Track whale/elite trader positions across Binance, Hyperliquid, Bybit, and OKX
- **Elite Leaderboard** — Top traders ranked by SmartScore (weighted: PnL, win rate, ROI, consistency)
- **Live Positions** — See what top traders are trading right now
- **Market Stats** — Aggregate market statistics across tracked exchanges

## Installation

### From Marketplace

```bash
# Add the TraderSpy marketplace
/plugin marketplace add target1m/traderspy-mcp

# Install the plugin
/plugin install traderspy-mcp@traderspy
```

### Direct

```bash
# Or add the MCP server directly
claude mcp add --transport http traderspy https://mcp.traderspy.app/mcp
```

## Authentication

The plugin works in **two modes**:

1. **Anonymous (no auth)** — Start using immediately with free-tier limits (3 tool calls/day, 15-min data delay)
2. **Authenticated** — Sign up at [traderspy.app](https://traderspy.app), get an API key from Settings, and get higher limits (100 calls/day, real-time data)

To authenticate, set your API key:

```bash
claude mcp add --transport http traderspy https://mcp.traderspy.app/mcp \
  --header "Authorization: Bearer mcp_YOUR_API_KEY"
```

Or use OAuth (browser login flow):

```bash
# The plugin will prompt for OAuth login automatically when needed
/mcp
```

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

## Local Development

To point the plugin at a local MCP server:

```bash
export TRADERSPY_MCP_URL=http://localhost:3100/mcp
```

## Example Prompts

- "What are the top crypto signals right now?"
- "Show me the elite trader leaderboard"
- "What are whales buying on Binance?"
- "Get the signal performance stats for the last 24 hours"
- "Show me BTC positions from top traders"
