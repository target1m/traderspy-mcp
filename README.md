# TraderSpy MCP — Crypto Smart Money & AI Signals

[![smithery badge](https://smithery.ai/badge/traderspy/traderspy)](https://smithery.ai/servers/traderspy/traderspy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/target1m/traderspy-mcp/blob/master/LICENSE)

Connect Claude, Claude Code, ChatGPT, Grok or any MCP client to TraderSpy's live crypto futures data:
AI signals, whale positioning, market data and your own account — with one URL.

**Every tool is read-only.** The connector cannot place, close or modify an order, and it has no
withdrawal or transfer tool. It answers questions; you place your trades yourself.

## Features

- **AI Trading Signals** — Real-time AI-powered crypto futures signals with entry/exit targets, stop loss, and confidence scores
- **Smart Money Tracking** — Track whale/elite trader positions across Binance, Hyperliquid, Bybit, and OKX
- **Elite Leaderboard** — Top traders ranked by SmartScore (weighted: PnL, win rate, ROI, consistency)
- **Live Positions** — See what top traders are trading right now
- **Market Stats** — Aggregate market statistics across tracked exchanges
- **Market Data** — Real-time prices, OHLCV candles, and 19 technical indicators (RSI, MACD, EMA, SMA, Bollinger Bands, ATR, ADX, Stochastic, OBV, VWAP, CCI, MFI, Williams %R, ROC, SuperTrend, Ichimoku, Keltner Channels, pivot points, swing support/resistance) with previous-bar direction, configurable periods, up to 3 timeframes per call and a plain-language summary; funding rate, open interest and long/short positioning for Binance perpetuals
- **Your Own Account** — Read your Hyperliquid balance, open positions and unrealized PnL (personal key required)
- **Interactive Views** — In hosts that support MCP Apps, `get_signals` and `get_signal_details` render signal cards and charts instead of plain text

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
/plugin install traderspy@traderspy-mcp
```

### ChatGPT

1. Go to [ChatGPT](https://chatgpt.com) → Settings → Connected Apps
2. Click **"Add MCP Server"**
3. Enter the server URL:
   ```
   https://mcp.traderspy.app/mcp
   ```
4. Complete the OAuth login flow to connect your TraderSpy account

### Grok (xAI)

1. Open [grok.com/connectors](https://grok.com/connectors) → **New Connector** → **Custom**
2. Paste your personal connector URL (the key is embedded, so no extra authentication is needed):
   ```
   https://mcp.traderspy.app/mcp?token=mcp_YOUR_KEY
   ```
3. Grok reads the tool list and TraderSpy is available in your next chat

From the terminal, Grok Build takes the same URL:

```bash
grok mcp add --transport http traderspy "https://mcp.traderspy.app/mcp?token=mcp_YOUR_KEY"
```

The same endpoint also works as a remote MCP tool in the xAI API. Grok supports Streamable HTTP and
SSE only — both of which this server speaks.

### Cursor

Add TraderSpy to your Cursor MCP config (`.cursor/mcp.json`):

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

### Cline

Add TraderSpy to `cline_mcp_settings.json`:

```json
{
  "mcpServers": {
    "traderspy": {
      "type": "streamableHttp",
      "url": "https://mcp.traderspy.app/mcp",
      "headers": {
        "Authorization": "Bearer mcp_YOUR_KEY"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

`type` must be exactly `streamableHttp` — `streamable-http` or a missing `type` falls back to SSE
and the server answers 405. Full walkthrough, including how to get the key and how to verify the
connection: [llms-install.md](llms-install.md).

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

Two ways to connect, both tied to your TraderSpy account:

- **Personal URL (recommended)** — generate it at [traderspy.app/mcp](https://traderspy.app/mcp) or in
  Settings. The key is embedded in the URL (`https://mcp.traderspy.app/mcp?token=mcp_...`), so hosts
  that ask for authentication can be left on "None". Shown once, revocable any time.
- **OAuth** — supported for clients that drive the OAuth flow themselves.

Treat the personal URL like a password: it grants read access to your account data. If it leaks,
revoke it on the same page and generate a new one.

| Plan | Daily Limit | Data |
|------|------------|------|
| Free | 5 calls/day | Real-time |
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
| `get_derivatives` | Funding rate (current, 24h/3d avg, annualized), open interest (24h/4h change, OI×price regime), top-trader + all-account long/short ratios, taker flow — up to 5 Binance perpetuals |
| `get_technical_indicators` | 19 indicators (RSI, MACD, EMA, SMA, Bollinger Bands, ATR, ADX, Stochastic, OBV, VWAP, CCI, MFI, Williams %R, ROC, SuperTrend, Ichimoku, Keltner Channels, pivot points, swing support/resistance) — multi-timeframe (`intervals`, up to 3), custom `periods`, `history` series, per-timeframe `summary` + `confluence` |
| `get_tracked_symbols` | List all crypto futures symbols with real-time data available |

### Your Account

| Tool | Description |
|------|-------------|
| `get_my_account` | Your Hyperliquid balance, open positions and unrealized PnL (read-only, personal key required) |

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
- "Show my TraderSpy account — balance, open positions and PnL"

## Links

- [TraderSpy](https://traderspy.app) — Main platform
- [GitHub](https://github.com/target1m/traderspy-mcp) — Plugin source code
- [Privacy Policy](https://traderspy.app/privacy-policy) — How your data is handled
- [Support](mailto:support@traderspy.app) — Contact us

## License

[MIT](LICENSE) © TraderSpy
