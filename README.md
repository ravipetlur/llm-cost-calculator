# Voice AI Cost Calculator

Estimates the **per-minute cost of a voice bot call** across the LLM + STT + TTS stack, so customer quotes reflect actual unit economics instead of a rough top-down number.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
```

For a production build served locally:

```sh
npm start          # builds and serves at http://localhost:4173
```

## How the model works

Everything is normalized to **one minute of call**:

| Component | Model | Defaults |
|---|---|---|
| LLM | bot turns × (input words + output words) × tokens/word × per-token rate | 5 calls/min, 2,500 words in / 500 words out per call, 1.33 tokens/word |
| STT | billed audio seconds ÷ 60 × per-minute rate | 60s (full call streamed) |
| TTS | spoken seconds × chars/sec × (1 − cache hit rate) × per-char rate | 30s spoken, 15 chars/sec, 50% cache |
| Fixed | flat $/min adder (telephony, infra, margin) | $0 |

Every assumption is editable in the **Call assumptions** panel. The headline shows $/min, plus per-call and per-1,000-minute figures.

## Pricing data

Default list prices live in [src/data/pricing.ts](src/data/pricing.ts) with source URLs and an as-of date. Use the **Settings** pane (gear icon) to override any rate with contracted/enterprise pricing — overrides persist in localStorage and show a `custom` badge; reset per row or all at once.

## Stack

Vite + React + TypeScript + Tailwind CSS. Fully client-side — no backend, no API keys, nothing leaves the browser.
