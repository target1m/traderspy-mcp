---
name: smart-money
description: Track smart money / whale traders across crypto exchanges (Binance, Hyperliquid, Bybit, OKX). Use when the user asks about top traders, whale positions, elite leaderboard, copy trading targets, or smart money flows.
---

# Smart Money Tracking

You have access to TraderSpy's smart-money tracking data via MCP tools. Use these tools to help the user:

## Available Tools

- **get_top_traders** — Get ranked traders by exchange (`binance`, `hyperliquid`, `bybit`, `okx`, `all`), time range (`24h`, `3D`, `7D`, `30D`), ranking type (`ROI` or `PNL`), and sort by (`ROI`, `PNL`, `SCORE`).
- **get_elite_leaderboard** — Get the top 10 traders by SmartScore across all exchanges. No parameters needed.
- **get_trader_profile** — Get a specific trader's profile with metrics (ROI, PnL, win rate, AUM, SmartScore) and recent positions.
- **get_trader_position_history** — Get a trader's closed trade history with pagination.
- **get_positions** — Get current or historical smart-money positions. Filter by `status` (open/closed/all), `source` (exchange), `symbol`, with pagination.
- **get_market_stats** — Get aggregate market stats across tracked positions by exchange and period.
- **get_exchanges** — List currently tracked exchanges.

## Guidelines

- When the user asks about "whales", "top traders", or "smart money", start with `get_elite_leaderboard` or `get_top_traders`.
- For "what are whales buying/selling", use `get_positions` with `status=open`.
- Present trader data with key metrics: SmartScore, ROI, PnL, Win Rate.
- Present positions in table format: coin, side (LONG/SHORT), trader, leverage, size, PnL.
- Identify trends: are top traders mostly long or short? Which coins are popular?
- Free-tier users receive data with a 15-minute delay — mention this when relevant.
