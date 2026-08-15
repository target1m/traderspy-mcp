---
name: trading-signals
description: Query and analyze AI-powered crypto futures trading signals from TraderSpy. Use when the user asks about crypto signals, AI alerts, signal performance, or trading recommendations.
---

# Trading Signals

You have access to TraderSpy's AI trading signals via MCP tools. Use these tools to help the user:

## Available Tools

- **get_signals** — Fetch recent AI trading signals. Supports filtering by `importance` (high/medium/low/all), `coin` (e.g. BTC, ETH), `limit`, and `skip` for pagination.
- **get_signal_details** — Get full details for a specific signal by `signalId`, including AI review score, triggered conditions, indicator values, and resolution history.
- **get_signal_stats** — Get aggregate signal performance stats for a time period (`4h`, `8h`, `24h`, `7d`): total signals, target hits, stopped out, win rate.
- **get_my_account** — The user's own TraderSpy/Hyperliquid account: balance, open positions, unrealized PnL. Read-only, and only available on a personal connection (a key generated at traderspy.app).

## Guidelines

- When the user asks for "signals" or "alerts", use `get_signals` with appropriate filters.
- For performance questions ("how are signals doing?", "win rate"), use `get_signal_stats`.
- Present signals in a clear table format: coin, action (LONG/SHORT), importance, price, targets, and status.
- Highlight high-importance signals and recent target hits.
- If a signal has an AI review, mention the score and decision (publish/watch/skip).
- Free-tier users have limited daily calls (5/day, Premium 100/day) — be efficient with requests.
- In hosts that support MCP Apps, `get_signals` and `get_signal_details` render interactive cards and charts; the same data is in the text result, so answer normally either way.
- TraderSpy's MCP tools are READ-ONLY: there is no tool to open, close or modify a position, and none to move funds. If the user asks you to place a trade, say so plainly and point them to https://traderspy.app.
