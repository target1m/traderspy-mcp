#!/usr/bin/env node
// Builds the ChatGPT plugin ZIP for the OpenAI Platform portal (Plugins → TraderSpy → "Upload new
// version") in the Agent Plugins layout, the one OpenAI recommends for new packages:
//
//   traderspy/
//     plugin.json        $schema + identity at the root; listing (interface), review data and release
//                        notes under extensions."com.openai"
//     mcp.json           the remote MCP server (URL only; its OAuth lives on the existing connection)
//     skills/<name>/...  the six skills, as in this repo (discovered from skills/, no manifest field)
//     assets/logo.png, icon.png
//
// Output: dist/chatgpt/traderspy-<version>.zip (dist/ is gitignored).
// Usage:  node scripts/package-chatgpt.mjs [version]       (DEMO_URL=https://… to set the video)
//
// Things the portal enforces that shaped this file (developers.openai.com/plugins/build/plugins,
// …/deploy/submission, …/deploy/submission-errors):
// - The package `name` of an update must equal the existing plugin's. Ours is the id the portal gave
//   the plugin migrated from the 2.0.0 app (asdk_app_6a8175e3…), not "traderspy"
//   (plugin_name_mismatch).
// - Validation is strict ("Extra inputs are not permitted"): the Agent Plugins files REQUIRE `$schema`,
//   the Codex-layout .mcp.json refuses it. Root plugin.json keys are only the ones the schema allows.
// - The MCP server keeps the existing app's connection, so mcp.json declares no auth (see below).
// - A review/publication field left OUT keeps the value saved in the dashboard (demo video, countries,
//   translations); a field present here becomes read-only there. The listing text below mirrors what
//   the dashboard shows, so an upload does not silently rewrite the listing.
// - Reviewer credentials are NOT in the ZIP (`test_credentials` is rejected): they go in
//   Metadata & Skills → Review information → Review details.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const version = process.argv[2] || '3.0.2'; // follows MCP_SERVER_VERSION in the TraderSpy monorepo
const demoUrl = process.env.DEMO_URL || '';

const PACKAGE_NAME = 'app-6a8175e3469081918210ab85e581d827';
// Server key "traderspy": the skills' agents/openai.yaml name it as their MCP dependency.
const MCP_SERVER = 'traderspy';
const MCP_URL = 'https://mcp.traderspy.app/mcp'; // the origin cannot change between versions

const longDescription = [
  'TraderSpy connects ChatGPT to live crypto futures data, so you can ask about the market instead of tab-hopping between exchanges.',
  "Ask what is oversold on the 4h and it screens the 100 most-traded pairs in one go — RSI, EMA distance, MACD crosses, SuperTrend, volume, squeezes. Then ask what usually happened after that setup and it runs the condition over the stored history: how often it fired, the average forward return, the win rate, and the edge over the market's own drift in the same period.",
  'Ask about a single coin and you get what a chart alone does not give you: 19 indicators across up to three timeframes at once with a confluence read, funding rate and open interest (is this rally new longs or short covering?), and where top-performing traders on Binance, Hyperliquid, Bybit and OKX are actually positioned, with a leaderboard scored on PnL, win rate, ROI and consistency.',
  'Ask about the AI signal engine and you get the entry, the take-profit ladder and the stop — plus what happened to earlier signals, not just a direction.',
  'Read-only by design: TraderSpy answers questions with market data. It cannot place, close or modify an order, it has no withdrawal or transfer tool, and it cannot see any user account.',
].join('\n\n');

const positive = [
  {
    description: 'Latest AI signals for one coin',
    prompt: 'What are the latest AI trading signals for SOL?',
    tools_triggered: 'get_signals',
    expected_behavior:
      "Returns SOL's recent AI signals with side, entry, take-profit ladder, stop and resolution status, and the signals card view renders. Presented as market data, not advice.",
  },
  {
    description: 'Top-trader positioning on one exchange',
    prompt: 'Which coins are the top Hyperliquid traders long right now?',
    tools_triggered: 'get_positions',
    expected_behavior:
      'Lists open positions of tracked top traders on Hyperliquid with coin, side, size, entry and unrealised PnL, then summarises which coins they are long.',
  },
  {
    description: 'Multi-timeframe indicator read in one call',
    prompt: 'Give me RSI, MACD and ATR for BTC on 1h, 4h and 1d. Do the timeframes agree?',
    tools_triggered: 'get_technical_indicators',
    expected_behavior:
      'One call with intervals 1h, 4h and 1d returns RSI, MACD and ATR per timeframe plus a confluence verdict, and the technicals chart view renders.',
  },
  {
    description: 'Market screen by a technical condition',
    prompt: 'Which coins are oversold on the 4h right now?',
    tools_triggered: 'screen_symbols',
    expected_behavior:
      'One call screens the most-traded futures pairs for RSI(14) below 30 on the 4h timeframe and lists the matches with their RSI values.',
  },
  {
    description: 'Funding and open interest for one coin',
    prompt: 'Is BTC funding high right now, and is open interest building?',
    tools_triggered: 'get_derivatives',
    expected_behavior:
      'Returns BTCUSDT funding (current, annualized, 24h and 3d average), the open-interest change with its regime label and long/short positioning, with plain-language notes.',
  },
];

const negative = [
  {
    description:
      'Order placement: no tool can place an order. The assistant says TraderSpy is read-only and cannot trade.',
    prompt: 'Buy 1 BTC with 10x leverage on my account.',
  },
  {
    description:
      'Withdrawal: no transfer or withdrawal tool exists. The assistant declines and offers no workaround.',
    prompt: 'Withdraw my USDC to my wallet.',
  },
  {
    description:
      'Personal investment advice: out of scope. The assistant may show market data but does not recommend what to buy.',
    prompt: 'Should I put my savings into SOL?',
  },
];

const releaseNotes = `Three new read-only tools, a deeper technical-analysis tool, six skills, and sign-in with a TraderSpy account instead of a pasted key.

Removed: get_my_account and its account view. TraderSpy no longer offers trading or account balances, so the plugin reads public market data only.

Skills: market-briefing, technical-analysis, market-screener, trading-signals, smart-money and position-check. They tell the assistant which tool answers which question, how to read the fields, and how to present the result as market information rather than advice.

get_derivatives: funding rate (current, annualized, 24h/3d average), open interest with its 4h/24h change and regime, and long/short positioning for Binance USD-M perpetuals, up to 5 symbols per call.

screen_symbols: screens the most-traded futures pairs (up to 100) against up to three conditions in one call, or compares an explicit list of symbols side by side.

backtest_condition: event study for the same conditions on one symbol: occurrences, average and median forward return, win rate, best and worst excursion per horizon, and the edge over the unconditional baseline.

get_signals / get_signal_stats: new optional strategy argument to filter by AI strategy, and the statistics break the period down per strategy.

get_technical_indicators: 19 indicators instead of 13, each with its previous value, direction and a short history, plus divergence, Fibonacci levels, volume profile, squeeze and candle patterns. New optional intervals (up to 3 timeframes in one call, with a confluence verdict), periods, history and symbols (up to 3 pairs in one call). Calls without them answer as before. It also renders a chart view per timeframe.`;

// Root keys are exactly the ones agent-plugins.org/schemas/1.0.0/plugin.schema.json allows
// (additionalProperties: false); everything OpenAI-specific lives under extensions."com.openai".
const manifest = {
  $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
  name: PACKAGE_NAME,
  version,
  description:
    "Read-only crypto futures market data through TraderSpy's hosted MCP server: AI-generated signals, top-trader positions on Hyperliquid, Binance, Bybit and OKX, 19 technical indicators, funding and open interest, a screener and event-study backtests. Includes six skills. No order, transfer or withdrawal tools. Market data and analysis, not financial advice.",
  author: { name: 'TraderSpy', email: 'support@traderspy.app', url: 'https://traderspy.app' },
  homepage: 'https://traderspy.app/mcp',
  repository: 'https://github.com/target1m/traderspy-mcp',
  license: 'MIT',
  keywords: ['crypto', 'trading', 'market-data', 'technical-analysis', 'smart-money', 'hyperliquid', 'binance', 'mcp'],
  extensions: {
    'com.openai': {
      interface: {
        displayName: 'TraderSpy',
        shortDescription: 'Crypto signals and whale data',
        longDescription,
        developerName: 'T1M LLC',
        category: 'Finance',
        websiteURL: 'https://traderspy.app',
        supportURL: 'https://traderspy.app/help-support',
        privacyPolicyURL: 'https://traderspy.app/privacy-policy',
        termsOfServiceURL: 'https://traderspy.app/terms-of-use',
        defaultPrompt: [
          'What are the latest AI trading signals for SOL, and how did the last ten resolve?',
          'Which coins are the top Hyperliquid traders long right now?',
          'Give me RSI, MACD and ATR for BTCUSDT on 1h, 4h and 1d — do the timeframes agree?',
        ],
        brandColor: '#0c0c0e',
        composerIcon: './assets/icon.png',
        logo: './assets/logo.png',
      },
      review: {
        test_cases: { positive, negative },
        ...(demoUrl ? { demo_recording_url: demoUrl } : {}),
        commerce: false,
      },
      publication: { release_notes: releaseNotes },
    },
  },
};

const mcp = {
  $schema: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json',
  mcpServers: {
    // No `extensions."com.openai".auth` here: the plugin keeps the MCP connection of the app it was
    // migrated from, whose OAuth (dynamic client registration) is already set up, and the portal
    // refuses an upload that declares auth for it ("Keep the existing MCP connection … Remove the
    // ZIP's auth override"). Auth is edited on that existing connection in the dashboard.
    [MCP_SERVER]: { type: 'streamable-http', url: MCP_URL },
  },
};

// The portal's final-submission limits, checked here so a bad package never reaches the upload.
const problems = [];
const ui = manifest.extensions['com.openai'].interface;
const oneLine = (s) => typeof s === 'string' && s.trim() !== '' && !/[\r\n]/.test(s);
if (!/^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(manifest.name) || manifest.name.length > 64)
  problems.push('name');
if (!/^\d+\.\d+\.\d+$/.test(version)) problems.push('version is not semver');
if (manifest.description.length > 1024) problems.push('description > 1024');
if (!oneLine(ui.displayName) || ui.displayName.length > 30) problems.push('displayName > 30');
if (!oneLine(ui.shortDescription) || ui.shortDescription.length > 30) problems.push('shortDescription > 30');
if (!ui.longDescription || ui.longDescription.length > 4000) problems.push('longDescription > 4000');
if (!oneLine(ui.developerName) || ui.developerName.length > 80) problems.push('developerName > 80');
if (ui.defaultPrompt.length > 3 || ui.defaultPrompt.some((p) => !oneLine(p) || p.length > 128 || p.includes('@')))
  problems.push('defaultPrompt');
for (const key of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL'])
  if (!/^https:\/\//.test(ui[key] || '') || ui[key].length > 1024) problems.push(`${key} must be https`);
if (positive.length !== 5 || negative.length !== 3) problems.push('needs exactly 5 positive and 3 negative test cases');
for (const t of positive)
  if (!t.description || !t.prompt || !t.tools_triggered || !t.expected_behavior) problems.push(`positive case: ${t.prompt}`);
const skills = ['market-briefing', 'market-screener', 'position-check', 'smart-money', 'technical-analysis', 'trading-signals'];
for (const skill of skills) {
  if (!existsSync(join(root, 'skills', skill, 'SKILL.md'))) problems.push(`skill missing: ${skill}`);
  if (`${manifest.name}:${skill}`.length > 64) problems.push(`plugin-name:skill-name > 64 for ${skill}`);
}
if (problems.length) {
  console.error('Package rejected:\n- ' + problems.join('\n- '));
  process.exit(1);
}

const out = join(root, 'dist/chatgpt');
const pkg = join(out, 'build/traderspy');
rmSync(out, { recursive: true, force: true });
mkdirSync(join(pkg, 'assets'), { recursive: true });
writeFileSync(join(pkg, 'plugin.json'), JSON.stringify(manifest, null, 2) + '\n');
writeFileSync(join(pkg, 'mcp.json'), JSON.stringify(mcp, null, 2) + '\n');
cpSync(join(root, 'skills'), join(pkg, 'skills'), { recursive: true, filter: (src) => !src.endsWith('.DS_Store') });
cpSync(join(root, '.claude-plugin/icon.png'), join(pkg, 'assets/logo.png')); // 1024 px square
cpSync(join(root, 'logo-400.png'), join(pkg, 'assets/icon.png')); // 400 px square

const zip = join(out, `traderspy-${version}.zip`);
execFileSync('zip', ['-qrX', zip, 'traderspy', '-x', '*.DS_Store', '__MACOSX/*'], { cwd: join(out, 'build') });
console.log(`→ ${zip}`);
if (!demoUrl) console.log('  no DEMO_URL: the demo video saved in the dashboard is kept (a missing field is not overwritten).');
