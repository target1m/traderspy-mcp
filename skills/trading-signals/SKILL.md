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

## Guidelines

- When the user asks for "signals" or "alerts", use `get_signals` with appropriate filters.
- For performance questions ("how are signals doing?", "win rate"), use `get_signal_stats`.
- Present signals in a clear table format: coin, action (LONG/SHORT), importance, price, targets, and status.
- Highlight high-importance signals and recent target hits.
- If a signal has an AI review, mention the score and decision (publish/watch/skip).
- Free-tier users have limited daily calls — be efficient with requests.
