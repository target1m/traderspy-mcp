# Installing the TraderSpy MCP server

This file is written for an AI assistant (Cline, Claude Code, Cursor, …) setting the connector up on
a user's machine. Follow it top to bottom.

## What this is

TraderSpy is a **remote** MCP server. There is nothing to install, clone or build: no npm package, no
Docker image, no local process. You point the client at one HTTPS endpoint.

```
https://mcp.traderspy.app/mcp
```

Transport: Streamable HTTP. All 16 tools are read-only — the connector cannot place, close or modify
an order, and no withdrawal or transfer tool exists.

## Step 1 — get the user's API key

Every tool call requires a personal key. **Do not invent, guess or reuse a key from anywhere.** Ask
the user to generate their own:

1. Sign in at <https://traderspy.app> (a free account is enough).
2. Open <https://traderspy.app/mcp>, or Settings → MCP.
3. Generate the key. It starts with `mcp_` and is shown **once** — the user should copy it now.

Free accounts get 5 tool calls per day, premium 100.

## Step 2 — write the configuration

Add this to Cline's `cline_mcp_settings.json`, replacing `mcp_REPLACE_ME` with the user's key:

```json
{
  "mcpServers": {
    "traderspy": {
      "type": "streamableHttp",
      "url": "https://mcp.traderspy.app/mcp",
      "headers": {
        "Authorization": "Bearer mcp_REPLACE_ME"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

`type` must be exactly `streamableHttp` (camelCase). Writing `streamable-http`, or leaving `type`
out, makes the client fall back to SSE and the server answers 405.

If you are configuring a client that only accepts a bare URL with no auth fields, put the key in the
query string instead — the server treats it as equivalent:

```
https://mcp.traderspy.app/mcp?token=mcp_REPLACE_ME
```

## Step 3 — verify

Reload the MCP servers, then confirm two things:

1. `traderspy` lists **16 tools**. `get_price` is a good smoke test:
   `get_price` with `{"symbols": ["BTCUSDT"]}` should return a live price.
2. If the tool list appears but every call returns `Authentication required` (JSON-RPC `-32001`), the
   key is missing or wrong — `initialize` and `tools/list` work anonymously by design, tool calls do
   not.

## The tools

| Tool | Returns |
| --- | --- |
| `get_signals` | Recent AI signals with entry, take-profit ladder, stop and outcome |
| `get_signal_details` | One signal in full, plus the live price |
| `get_signal_stats` | Aggregate signal performance over a period |
| `get_top_traders` | Ranked smart-money traders per exchange |
| `get_elite_leaderboard` | Cross-exchange elite leaderboard by smart score |
| `get_trader_profile` | One trader's stats and current positioning |
| `get_trader_position_history` | A trader's closed trades |
| `get_positions` | Live smart-money positions |
| `get_market_stats` | Aggregate market statistics |
| `get_exchanges` | Tracked exchanges |
| `get_price` | Live prices, up to 20 symbols per call |
| `get_candles` | OHLCV candles |
| `get_tracked_symbols` | Every tracked pair |
| `get_derivatives` | Funding rate, open interest (24h/4h change + OI×price regime), top-trader/all-account long-short ratios, taker flow — up to 5 Binance perpetuals |
| `get_technical_indicators` | 19 indicators (RSI, MACD, EMA, SMA, Bollinger Bands, ATR, ADX, Stochastic, OBV, VWAP, CCI, MFI, Williams %R, ROC, SuperTrend, Ichimoku, Keltner Channels, pivot points, swing support/resistance); up to 3 timeframes per call, custom periods, previous-bar direction, summary |
| `get_my_account` | The key owner's own Hyperliquid balance, positions and unrealised PnL |

Every tool declares an output schema, so structured results are typed.

## Troubleshooting

- **405 on connect** — `type` is not `streamableHttp`.
- **`Authentication required` on every call** — missing/expired key. The user can revoke and
  regenerate at <https://traderspy.app/mcp>; revoking a key takes effect on the next call.
- **Daily limit reached** — free tier is 5 calls/day. Wait for the reset or upgrade.
- **Empty candles or indicators for a symbol** — that pair is not tracked; call
  `get_tracked_symbols` to see what is.
