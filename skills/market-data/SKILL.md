---
name: market-data
description: Query real-time crypto futures prices, OHLCV candle data, and technical indicators (RSI, MACD, EMA, SMA, Bollinger, ATR, ADX, Stochastic, OBV, VWAP, CCI, MFI, Williams %R, ROC, SuperTrend, Ichimoku, Keltner, pivot points, support/resistance) from TraderSpy. Use when the user asks for prices, charts, candles, or technical analysis on crypto pairs.
---

# Market Data

You have access to TraderSpy's real-time market data and technical analysis via MCP tools. Use these tools to help the user with prices, charts, and indicator-based analysis.

## Available Tools

- **get_price** — Get real-time price, 24h high/low, volume, and 24h change percentage for one or more symbols. Pass `symbols` as an array (e.g. `["BTCUSDT", "ETHUSDT"]`, max 20).
- **get_candles** — Get OHLCV candles for a `symbol` at a given `interval` (`1m`, `5m`, `15m`, `1h`, `4h`, `1d`). Default `limit` is 100 (max 500). Useful for charting, price history, and custom analysis.
- **get_technical_indicators** — Compute one or more indicators for a `symbol`. Supported: `rsi`, `macd`, `ema`, `sma`, `bollinger`, `atr`, `adx`, `stochastic`, `obv`, `vwap`, `cci`, `mfi`, `williamsR`, `roc`, `supertrend`, `ichimoku`, `keltner`, `pivots` (previous-day floor pivots), `levels` (swing support/resistance). Default indicators are `rsi`, `macd`, `ema`, `bollinger`. Pass `intervals` (up to 3, e.g. `["1h","4h","1d"]`) for a multi-timeframe read in ONE call with a `confluence` verdict; `periods` overrides any period (e.g. `{"ema":[9,21,55,200],"rsi":7}`); `history` (default 5) controls the `series` length. Every indicator returns `value`, `previous`, `direction` and, where relevant, `zone`/`crossover`. Each timeframe carries a `summary` (bias, trend, momentum, volatility, notes) — quote its `notes`.
- **get_tracked_symbols** — List all crypto futures symbols currently tracked by TraderSpy with real-time candle data available.

## Guidelines

- For "price of X" or "how much is X", use `get_price` — batch multiple symbols in a single call when possible.
- For "show me a chart" or any historical price questions, use `get_candles` with an appropriate interval (intraday → `15m` or `1h`, swing → `4h` or `1d`).
- For "is X overbought/oversold", "RSI on X", "MACD signal", or any TA question, use `get_technical_indicators` with only the indicators needed. For "where is support/resistance" use `levels` (+ `pivots`); for "which way is the trend on all timeframes" use `intervals: ["1h","4h","1d"]` — one call, not three.
- Symbols use Binance Futures naming (e.g. `BTCUSDT`, `ETHUSDT`, `SOLUSDT`). If the user gives a coin name only, append `USDT`.
- If a symbol returns no data, suggest `get_tracked_symbols` to confirm coverage.
- When presenting indicator output, include the current price and clearly label values (e.g. `RSI(14) = 62.4 — neutral, leaning bullish`).
- Free-tier users have limited daily calls — be efficient and prefer batched/multi-indicator calls over many separate ones.
- TraderSpy's MCP tools are READ-ONLY: there is no tool to open, close or modify a position, and none to move funds. If the user asks you to place a trade, say so plainly and point them to https://traderspy.app.
