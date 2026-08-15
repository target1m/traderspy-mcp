# Plug Smart Money Into Claude: A 60-Second Setup With TraderSpy MCP

Most "AI for crypto" articles are vapor. This one is a wiring guide.

If you use Claude Code (or Claude on the desktop / ChatGPT) and you trade crypto futures, you can connect Claude directly to a live data feed of AI signals, whale positions, top-trader leaderboards, real-time prices, candles, and technical indicators — without writing a single line of integration code.

The bridge is **MCP** (Model Context Protocol), and the plugin is **[TraderSpy MCP](https://github.com/target1m/traderspy-mcp)**.

This post walks through what it does, how to connect it in under a minute, and a few prompts to get value on day one.

---

## Why this matters

Out of the box, an LLM doesn't know what BTC is doing right now. It doesn't know which traders are crushing it on Hyperliquid this week. It can't pull a 4h MACD on SOLUSDT, and it certainly can't tell you whether elite traders are net long or short.

Without external data, every "should I long ETH?" answer is hallucination dressed in confidence.

MCP fixes that. It's a standardized protocol for letting models call real tools — fetching live data, computing indicators, querying a leaderboard — over a typed, auth'd interface. Anthropic ships native MCP support in Claude Code; OpenAI now supports it in ChatGPT; Cursor and Windsurf support it too.

TraderSpy's MCP server exposes 15 read-only tools, all hitting production data:

**Signals**
- `get_signals` — recent AI futures signals, filterable by coin and importance
- `get_signal_details` — full signal payload + AI review score
- `get_signal_stats` — win rate, hits, stops over a time window

**Smart money**
- `get_top_traders` — ranked by ROI / PnL / SmartScore across Binance, Hyperliquid, Bybit, OKX
- `get_elite_leaderboard` — top 10 by SmartScore (a weighted blend of PnL, win rate, ROI, consistency, longevity, depth)
- `get_trader_profile` — one trader's full stats + open positions
- `get_trader_position_history` — closed-trade ledger
- `get_positions` — live or historical positions with filters
- `get_market_stats` — aggregate sentiment per exchange / period
- `get_exchanges` — what's tracked

**Market data**
- `get_price` — real-time price + 24h stats for up to 20 symbols
- `get_candles` — OHLCV (1m → 1d), up to 500 candles
- `get_technical_indicators` — RSI, MACD, EMA, SMA, Bollinger, ATR, ADX, Stochastic, OBV, VWAP, CCI, MFI, Williams %R
- `get_tracked_symbols` — what data is available

**Your account**
- `get_my_account` — your own Hyperliquid balance, open positions and unrealized PnL

The tools are read-only. The plugin can't trade for you. It can't move funds. It can only *answer questions*.

---

## Connecting to Claude Code (the fastest path)

Claude Code is Anthropic's CLI / IDE harness — `claude` in your terminal. It has a plugin marketplace built in, and TraderSpy ships as a first-class plugin.

Inside any Claude Code session, run:

```
/plugin marketplace add target1m/traderspy-mcp
/plugin install traderspy@traderspy-mcp
```

That's it. Claude Code pulls the plugin metadata from the GitHub repo, registers the MCP server endpoint (`https://mcp.traderspy.app/mcp`), and loads two skills (`smart-money`, `trading-signals`, plus `market-data` as of v1.1.0) that teach Claude *when* to reach for which tool.

The first time Claude calls a TraderSpy tool, you'll be redirected to an OAuth login. Sign in with your TraderSpy account — no API keys, no copy-pasting tokens, no `.env` editing. The token is stored locally and refreshed automatically.

If you'd rather skip the plugin layer and just register the raw MCP server, that works too:

```bash
claude mcp add --transport http traderspy https://mcp.traderspy.app/mcp
```

This gives you the tools but not the bundled skills (the prompt-engineered guidance that makes Claude pick the right tool for the right question).

---

## Connecting to ChatGPT

ChatGPT supports MCP servers as **Connected Apps**:

1. Open ChatGPT → Settings → **Connected Apps**
2. Click **Add MCP Server**
3. Paste: `https://mcp.traderspy.app/mcp`
4. Complete the OAuth flow

Done. The tools become available in any ChatGPT conversation — though without ChatGPT-side skill support, you may need to nudge it ("use the TraderSpy tools to…").

Cursor, Windsurf, and any other MCP-compatible client follow the same pattern: add an HTTP server entry pointing at `https://mcp.traderspy.app/mcp`, complete OAuth on first use.

---

## What it actually feels like

The point of an MCP plugin isn't the tool list — it's that you stop thinking about tools at all. You ask normal questions and Claude reaches for the right data on its own.

A few real prompts that work:

> **"What are the top crypto signals right now, and which ones already hit TP1?"**
>
> Claude calls `get_signals` with `importance=high`, then `get_signal_stats` for context, and gives you a table.

> **"Show me what the top 5 Hyperliquid traders are holding right now."**
>
> `get_top_traders` with `source=hyperliquid`, then `get_positions` filtered to those traders.

> **"Is BTCUSDT overbought on the 4h?"**
>
> `get_technical_indicators` with `symbol=BTCUSDT`, `interval=4h`, `indicators=[rsi, macd, bollinger]`. Claude interprets the numbers, doesn't just dump them.

> **"Are smart-money traders net long or short on ETH this week?"**
>
> `get_market_stats` with the right period and symbol, plus a sanity check against `get_positions`.

> **"Pull a trader profile for [trader address] and tell me whether their last 30 trades show positive expectancy."**
>
> `get_trader_profile` + `get_trader_position_history`, then Claude does the math.

The interesting part is composition. Claude chains tools without being asked. "Find the top BTC long position from a trader with >70% win rate" naturally becomes `get_top_traders` → filter → `get_trader_profile` → `get_positions` → answer.

---

## Plans and rate limits

The MCP server is rate-limited per-account on a daily quota:

| Plan | Daily calls | Data freshness |
|------|------------|----------------|
| Free | 5 / day    | Real-time |
| Pro  | 100 / day  | Real-time |

Free is enough to test the integration, not enough to drive a workflow. Pro is the realistic tier if you're using this in actual research. Either way, no credit card is required to start — sign up at [traderspy.app](https://traderspy.app), connect, and you're live.

---

## Troubleshooting

**OAuth loop / token expired:** In Claude Code, run `/plugin uninstall traderspy-mcp@traderspy` and reinstall. The OAuth flow re-runs cleanly.

**"Tool not found":** You're probably on plugin v1.0.0 from before the market-data tools shipped. Update with `/plugin update traderspy-mcp@traderspy` — v1.1.0 adds `get_price`, `get_candles`, `get_technical_indicators`, `get_tracked_symbols`.

**Symbol returns no data:** TraderSpy uses Binance Futures naming — `BTCUSDT`, not `BTC/USD`. Run `get_tracked_symbols` (or just ask Claude "what symbols are tracked?") to confirm coverage.

**Rate limit hit on Free:** This is intentional. Three calls vanishes fast on a multi-step question. Upgrade or batch — `get_price` accepts up to 20 symbols in one call, and `get_technical_indicators` accepts up to 13 indicators per call.

---

## Why I built it

I wanted my crypto research workflow inside the same tool I write code in. Tab-switching between TradingView, an exchange, a leaderboard site, and a chat is friction; asking Claude "is anyone smart still long ETH after that liquidation cascade?" and getting a real, sourced answer is not.

MCP is the cleanest way to expose live data to a model without inventing your own protocol. TraderSpy MCP is the result — a thin, read-only layer over a production data pipeline (8 backend services, real-time WebSocket feeds, smart-money tracking across four exchanges) — packaged so any MCP-aware client can plug in.

If you trade crypto and you're already living in Claude or ChatGPT, the install is two commands. The marginal value of asking your assistant about market state with real data behind it is, frankly, hard to overstate once you've used it for a week.

---

**Links**

- Plugin source: [github.com/target1m/traderspy-mcp](https://github.com/target1m/traderspy-mcp)
- Sign up: [traderspy.app](https://traderspy.app)
- Server endpoint: `https://mcp.traderspy.app/mcp`
- Support: support@traderspy.app
