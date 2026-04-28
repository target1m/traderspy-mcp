# TraderSpy MCP — Crypto Smart Money & AI Signals

Connect

## Features

- **AI Trading Signals** — Real-time AI-powered crypto futures signals with entry/exit targets, stop loss, and confidence scores
- **Smart Money Tracking** — Track whale/elite trader positions across Binance, Hyperliquid, Bybit, and OKX
- **Elite Leaderboard** — Top traders ranked by SmartScore (weighted: PnL, win rate, ROI, consistency)
- **Live Positions** — See what top traders are trading right now
- **Market Stats** — Aggregate market statistics across tracked exchanges
- **Market Data** — Real-time prices, OHLCV candles, and 13 technical indicators (RSI, MACD, EMA, Bollinger Bands, ATR, ADX, Stochastic, OBV, VWAP, CCI, MFI, Williams %R, SMA)

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

### Signals

| Tool | Description |
|------|-------------|
| `get_signals` | Recent AI trading signals with filtering |
| `get_signal_details` | Full signal details with AI review |
| `get_signal_stats` | Signal performance statistics |

### Smart Money

| Tool | Description |
|------|-------------|
| `get_top_traders` | Ranked traders by exchange and metrics |
| `get_elite_leaderboard` | Top 10 by SmartScore |
| `get_trader_profile` | Trader profile with metrics and positions |
| `get_trader_position_history` | Trader's closed trade history |
| `get_positions` | Live and historical positions |
| `get_market_stats` | Aggregate market statistics |
| `get_exchanges` | List of tracked exchanges |

### Market Data

| Tool | Description |
|------|-------------|
| `get_price` | Real-time price, 24h high/low, volume, and change% for one or more symbols |
| `get_candles` | OHLCV candles (1m, 5m, 15m, 1h, 4h, 1d) for charting and analysis |
| `get_technical_indicators` | Compute RSI, MACD, EMA, SMA, Bollinger, ATR, ADX, Stochastic, OBV, VWAP, CCI, MFI, Williams %R |
| `get_tracked_symbols` | List all crypto futures symbols with real-time data available |

## Example Prompts

- "What are the top crypto signals right now?"
- "Show me the elite trader leaderboard"
- "What are whales buying on Binance?"
- "Get the signal performance stats for the last 24 hours"
- "Show me BTC positions from top traders"
- "Who are the most profitable traders on Hyperliquid this week?"
- "What's the overall market sentiment — are more traders long or short on BTC?"
- "What's the current price of BTC and ETH?"
- "Show me the last 100 1h candles for SOLUSDT"
- "Compute RSI and MACD for BTCUSDT on the 4h timeframe"
- "Which symbols does TraderSpy track?"

## Links

- [TraderSpy](https://traderspy.app) — Main platform
- [GitHub](https://github.com/target1m/traderspy-mcp) — Plugin source code
- [Support](mailto:support@traderspy.app) — Contact us
