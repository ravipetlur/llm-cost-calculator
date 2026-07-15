# Voice AI Cost Calculator

Estimates the **per-minute cost of a voice bot call** across the LLM + STT + TTS stack, so customer quotes reflect actual unit economics instead of a rough top-down number.

**Live demo:** https://ravipetlur.github.io/llm-cost-calculator/ (auto-deploys from `main` via GitHub Actions)

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
| LLM | bot turns × (input words × blended rate + output words × output rate) × tokens/word — input rate blends the provider's cached-input price by the **prefill cache hit rate** | 5 calls/min, 2,500 words in / 500 words out per call, 1.33 tokens/word, 0% prefill cache |
| STT | billed audio seconds ÷ 60 × per-minute rate | 60s (full call streamed) |
| TTS | spoken seconds × chars/sec × (1 − cache hit rate) × per-char rate | 30s spoken, 15 chars/sec, 50% cache |
| Fixed | flat $/min adder (telephony, infra, margin) | $0 |

Every assumption is editable in the **Call assumptions** panel. The headline shows $/min, plus per-call and per-1,000-minute figures — in USD with INR alongside (FX rate configurable in Settings, display-only).

**Use-case presets** (India-focused: banking support, loan offers, EMI reminders, order status, telecom support, clinic bookings) set typical turns, word counts and both cache rates in one click; everything stays tweakable afterwards. Models with no published cached-input price (e.g. Groq's Qwen models) get no prefill discount, and the UI says so.

## Pricing data

Default list prices live in [src/data/pricing.ts](src/data/pricing.ts) with source URLs and an as-of date. Use the **Settings** pane (gear icon) to override any rate with contracted/enterprise pricing — overrides persist in localStorage and show a `custom` badge; reset per row or all at once.

## Sharing

The **Share** button copies a link that reproduces your exact view — providers, all assumptions, the FX rate, and any custom price overrides (encoded in the URL fragment, so nothing is sent to a server). Opening a shared link applies the sender's state; shared overrides merge over the recipient's own, sender's values winning per model, so the recipient sees the sender's numbers without losing unrelated custom rates.

## Stack

Vite + React + TypeScript + Tailwind CSS. Fully client-side — no backend, no API keys, nothing leaves the browser.
