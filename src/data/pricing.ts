import type { LLMModel, STTModel, TTSModel } from '../types'

/**
 * Default list prices in USD, standard pay-as-you-go public rates,
 * researched and cross-verified against official vendor pricing pages.
 * Override any of these in Settings for enterprise/contracted rates.
 *
 * Excluded: models with no published price (GPT-5.4-cyber, Qwen3-VL 32B),
 * out-of-scope verticals (Gemini Robotics-ER, Google medical STT), and
 * legacy existing-deployments-only rates (Deepgram Enhanced/Base).
 *
 * Gemini TTS is token-billed; per-1k-char rates are derived assuming
 * 1k chars ≈ 250 text tokens ≈ 66.7s of speech ≈ 1,667 audio tokens
 * (Google: 25 audio tokens/sec). Gemini STT rates are derived from
 * audio-input tokens (32 tokens/sec); transcript output tokens add
 * roughly $0.0001–0.002/min extra depending on the model.
 *
 * Sarvam quotes INR-native prices (kept in notes); USD figures are
 * converted at 95.3 INR/USD (early-July 2026 spot).
 */
export const PRICING_AS_OF = '2026-07-15'

export const LLM_MODELS: LLMModel[] = [
  // OpenAI — https://developers.openai.com/api/docs/pricing
  { id: 'openai-gpt-5-6-sol', provider: 'OpenAI', name: 'GPT-5.6 Sol', inputPerM: 5, outputPerM: 30, cachedInputPerM: 0.5, notes: 'Current flagship (gpt-5.6 alias); 1M-token context', sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-5.6-sol' },
  { id: 'openai-gpt-5-6-terra', provider: 'OpenAI', name: 'GPT-5.6 Terra', inputPerM: 2.5, outputPerM: 15, cachedInputPerM: 0.25, notes: 'Mid-tier of the 5.6 family; 1M-token context', sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-5.6-terra' },
  { id: 'openai-gpt-5-6-luna', provider: 'OpenAI', name: 'GPT-5.6 Luna', inputPerM: 1, outputPerM: 6, cachedInputPerM: 0.1, notes: 'High-volume tier of the 5.6 family; 1M-token context', sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-5.6-luna' },
  { id: 'openai-gpt-5-5', provider: 'OpenAI', name: 'GPT-5.5', inputPerM: 5, outputPerM: 30, cachedInputPerM: 0.5, notes: 'Superseded as flagship by GPT-5.6 Sol; same rates', sourceUrl: 'https://developers.openai.com/api/docs/pricing' },
  { id: 'openai-gpt-5-5-pro', provider: 'OpenAI', name: 'GPT-5.5 pro', inputPerM: 30, outputPerM: 180, sourceUrl: 'https://developers.openai.com/api/docs/pricing' },
  { id: 'openai-gpt-5-4', provider: 'OpenAI', name: 'GPT-5.4', inputPerM: 2.5, outputPerM: 15, cachedInputPerM: 0.25, sourceUrl: 'https://developers.openai.com/api/docs/pricing' },
  { id: 'openai-gpt-5-4-mini', provider: 'OpenAI', name: 'GPT-5.4 mini', inputPerM: 0.75, outputPerM: 4.5, cachedInputPerM: 0.075, sourceUrl: 'https://developers.openai.com/api/docs/pricing' },
  { id: 'openai-gpt-5-4-nano', provider: 'OpenAI', name: 'GPT-5.4 nano', inputPerM: 0.2, outputPerM: 1.25, cachedInputPerM: 0.02, sourceUrl: 'https://developers.openai.com/api/docs/pricing' },
  { id: 'openai-gpt-5-4-pro', provider: 'OpenAI', name: 'GPT-5.4 pro', inputPerM: 30, outputPerM: 180, sourceUrl: 'https://developers.openai.com/api/docs/pricing' },
  { id: 'openai-gpt-5-3-codex', provider: 'OpenAI', name: 'GPT-5.3-Codex', inputPerM: 1.75, outputPerM: 14, cachedInputPerM: 0.175, notes: 'Agentic coding model', sourceUrl: 'https://developers.openai.com/api/docs/pricing' },
  { id: 'openai-chat-latest', provider: 'OpenAI', name: 'chat-latest', inputPerM: 5, outputPerM: 30, cachedInputPerM: 0.5, notes: 'Alias tracking the ChatGPT production model; same rates as GPT-5.5', sourceUrl: 'https://developers.openai.com/api/docs/pricing' },
  { id: 'openai-gpt-5', provider: 'OpenAI', name: 'GPT-5', inputPerM: 1.25, outputPerM: 10, cachedInputPerM: 0.125, notes: 'API shutdown 2026-12-11', sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-5' },
  { id: 'openai-gpt-5-mini', provider: 'OpenAI', name: 'GPT-5 mini', inputPerM: 0.25, outputPerM: 2, cachedInputPerM: 0.025, notes: 'API shutdown 2026-12-11', sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-5-mini' },
  { id: 'openai-gpt-5-nano', provider: 'OpenAI', name: 'GPT-5 nano', inputPerM: 0.05, outputPerM: 0.4, cachedInputPerM: 0.005, notes: 'API shutdown 2026-12-11', sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-5-nano' },
  { id: 'openai-gpt-4-1', provider: 'OpenAI', name: 'GPT-4.1', inputPerM: 2, outputPerM: 8, cachedInputPerM: 0.5, sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-4.1' },
  { id: 'openai-gpt-4-1-mini', provider: 'OpenAI', name: 'GPT-4.1 mini', inputPerM: 0.4, outputPerM: 1.6, cachedInputPerM: 0.1, sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-4.1-mini' },
  { id: 'openai-gpt-4-1-nano', provider: 'OpenAI', name: 'GPT-4.1 nano', inputPerM: 0.1, outputPerM: 0.4, cachedInputPerM: 0.025, notes: 'API shutdown 2026-10-23', sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-4.1-nano' },
  { id: 'openai-gpt-4o', provider: 'OpenAI', name: 'GPT-4o', inputPerM: 2.5, outputPerM: 10, cachedInputPerM: 1.25, sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-4o' },
  { id: 'openai-gpt-4o-mini', provider: 'OpenAI', name: 'GPT-4o mini', inputPerM: 0.15, outputPerM: 0.6, cachedInputPerM: 0.075, sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-4o-mini' },
  { id: 'openai-o3', provider: 'OpenAI', name: 'o3', inputPerM: 2, outputPerM: 8, cachedInputPerM: 0.5, notes: 'API shutdown 2026-12-11', sourceUrl: 'https://developers.openai.com/api/docs/models/o3' },
  { id: 'openai-o3-pro', provider: 'OpenAI', name: 'o3-pro', inputPerM: 20, outputPerM: 80, notes: 'API shutdown 2026-12-11', sourceUrl: 'https://developers.openai.com/api/docs/models/o3-pro' },
  { id: 'openai-o4-mini', provider: 'OpenAI', name: 'o4-mini', inputPerM: 1.1, outputPerM: 4.4, cachedInputPerM: 0.275, notes: 'API shutdown 2026-10-23', sourceUrl: 'https://developers.openai.com/api/docs/models/o4-mini' },
  { id: 'openai-o3-deep-research', provider: 'OpenAI', name: 'o3-deep-research', inputPerM: 10, outputPerM: 40, cachedInputPerM: 2.5, notes: 'Deep-research model; API shutdown 2026-07-23', sourceUrl: 'https://developers.openai.com/api/docs/models/o3-deep-research' },
  { id: 'openai-o4-mini-deep-research', provider: 'OpenAI', name: 'o4-mini-deep-research', inputPerM: 2, outputPerM: 8, cachedInputPerM: 0.5, notes: 'Deep-research model; API shutdown 2026-07-23', sourceUrl: 'https://developers.openai.com/api/docs/models/o4-mini-deep-research' },
  { id: 'openai-computer-use-preview', provider: 'OpenAI', name: 'computer-use-preview', inputPerM: 3, outputPerM: 12, preview: true, notes: 'Computer-use agent model; API shutdown 2026-07-23', sourceUrl: 'https://developers.openai.com/api/docs/models/computer-use-preview' },

  // Google Gemini — https://ai.google.dev/gemini-api/docs/pricing (paid tier, text; base ≤200k tier)
  { id: 'google-gemini-3-5-flash', provider: 'Google Gemini', name: 'Gemini 3.5 Flash', inputPerM: 1.5, outputPerM: 9, cachedInputPerM: 0.15, sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-omni-flash-preview', provider: 'Google Gemini', name: 'Gemini Omni Flash', inputPerM: 1.5, outputPerM: 9, preview: true, notes: 'Omni multimodal; video output $17.50/1M priced separately', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-3-1-pro-preview', preview: true, provider: 'Google Gemini', name: 'Gemini 3.1 Pro Preview', inputPerM: 2, outputPerM: 12, cachedInputPerM: 0.2, notes: 'Prompts ≤200k tokens; $4/$18 above', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-3-1-flash-lite', provider: 'Google Gemini', name: 'Gemini 3.1 Flash-Lite', inputPerM: 0.25, outputPerM: 1.5, cachedInputPerM: 0.025, sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-3-flash-preview', preview: true, provider: 'Google Gemini', name: 'Gemini 3 Flash Preview', inputPerM: 0.5, outputPerM: 3, cachedInputPerM: 0.05, sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-2-5-pro', provider: 'Google Gemini', name: 'Gemini 2.5 Pro', inputPerM: 1.25, outputPerM: 10, cachedInputPerM: 0.125, notes: 'Prompts ≤200k tokens; $2.50/$15 above', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-2-5-flash', provider: 'Google Gemini', name: 'Gemini 2.5 Flash', inputPerM: 0.3, outputPerM: 2.5, cachedInputPerM: 0.03, sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-2-5-flash-lite', provider: 'Google Gemini', name: 'Gemini 2.5 Flash-Lite', inputPerM: 0.1, outputPerM: 0.4, cachedInputPerM: 0.01, sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-2-5-computer-use-preview', provider: 'Google Gemini', name: 'Gemini 2.5 Computer Use', inputPerM: 1.25, outputPerM: 10, preview: true, notes: 'Browser/computer-use agent; ≤200k tokens, $2.50/$15 above', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },

  // Groq — https://groq.com/pricing (both Qwen models are Preview on GroqCloud)
  { id: 'groq-qwen3-6-27b', preview: true, provider: 'Groq', name: 'Qwen 3.6 27B', inputPerM: 0.6, outputPerM: 3, notes: 'Preview model on GroqCloud; ~500 tok/s', sourceUrl: 'https://groq.com/pricing' },
  { id: 'groq-qwen3-32b', preview: true, provider: 'Groq', name: 'Qwen3 32B', inputPerM: 0.29, outputPerM: 0.59, notes: 'Preview model on GroqCloud', sourceUrl: 'https://groq.com/pricing' },

  // Sarvam AI — https://www.sarvam.ai/api-pricing (INR-native, converted at 95.3)
  { id: 'sarvam-105b', provider: 'Sarvam', name: 'Sarvam-105B', inputPerM: 0.042, outputPerM: 0.168, cachedInputPerM: 0.026, notes: '₹4 in / ₹16 out / ₹2.5 cached per 1M tokens; flagship', sourceUrl: 'https://www.sarvam.ai/api-pricing' },
  { id: 'sarvam-30b', provider: 'Sarvam', name: 'Sarvam-30B', inputPerM: 0.026, outputPerM: 0.105, cachedInputPerM: 0.016, notes: '₹2.5 in / ₹10 out / ₹1.5 cached per 1M tokens', sourceUrl: 'https://www.sarvam.ai/api-pricing' },
]

export const STT_MODELS: STTModel[] = [
  // Google Cloud Speech-to-Text — https://cloud.google.com/speech-to-text/pricing
  { id: 'google-chirp-2', provider: 'Google', name: 'Chirp 2 (Speech-to-Text v2)', perMinute: 0.016, notes: 'First 500k min/mo; volume tiers down to $0.004/min', sourceUrl: 'https://cloud.google.com/speech-to-text/pricing' },
  { id: 'google-chirp-3', provider: 'Google', name: 'Chirp 3 (Speech-to-Text v2)', perMinute: 0.016, notes: 'Same V2 standard recognition rate as Chirp 2', sourceUrl: 'https://cloud.google.com/speech-to-text/pricing' },
  { id: 'google-chirp', provider: 'Google', name: 'Chirp (first-gen)', perMinute: 0.016, notes: 'Billed under the same V2 standard recognition SKU and volume tiers', sourceUrl: 'https://cloud.google.com/speech-to-text/pricing' },
  { id: 'google-stt-v2-dynamic-batch', provider: 'Google', name: 'STT v2 Dynamic Batch', perMinute: 0.003, notes: 'Non-realtime (~24h) batch for any v2 standard model incl. Chirp', sourceUrl: 'https://cloud.google.com/speech-to-text/pricing' },
  { id: 'google-stt-v1-standard', provider: 'Google', name: 'STT v1 Standard (legacy)', perMinute: 0.024, notes: '$0.016/min with data-logging opt-in; first 60 min/mo free', sourceUrl: 'https://cloud.google.com/speech-to-text/pricing' },

  // Gemini API audio transcription — derived from audio-input token rates (32 tok/s); output tokens extra
  { id: 'google-gemini-3-5-flash-stt', provider: 'Google Gemini', name: 'Gemini 3.5 Flash transcription', perMinute: 0.00288, notes: 'Derived: $1.50/1M audio-in tokens; transcript output adds ~$0.0018/min', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-3-flash-preview-stt', provider: 'Google Gemini', name: 'Gemini 3 Flash transcription', perMinute: 0.00192, preview: true, notes: 'Derived: $1.00/1M audio-in tokens; output extra', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-3-1-flash-lite-stt', provider: 'Google Gemini', name: 'Gemini 3.1 Flash-Lite transcription', perMinute: 0.00096, notes: 'Derived: $0.50/1M audio-in tokens; cheapest current-gen Gemini STT', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-2-5-flash-stt', provider: 'Google Gemini', name: 'Gemini 2.5 Flash transcription', perMinute: 0.00192, notes: 'Derived: $1.00/1M audio-in tokens; output extra', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-2-5-flash-lite-stt', provider: 'Google Gemini', name: 'Gemini 2.5 Flash-Lite transcription', perMinute: 0.000576, notes: 'Derived: $0.30/1M audio-in tokens; output extra', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },

  // Deepgram — https://deepgram.com/pricing (streaming rates are limited-time promos)
  { id: 'deepgram-nova-3', provider: 'Deepgram', name: 'Nova-3 (streaming)', perMinute: 0.0048, notes: 'Limited-time promo streaming rate; standard $0.0077/min', sourceUrl: 'https://deepgram.com/pricing' },
  { id: 'deepgram-nova-3-multilingual', provider: 'Deepgram', name: 'Nova-3 Multilingual (streaming)', perMinute: 0.0058, notes: 'Promo rate; list $0.0092/min; auto language detection', sourceUrl: 'https://deepgram.com/pricing' },
  { id: 'deepgram-flux', provider: 'Deepgram', name: 'Flux (conversational, English)', perMinute: 0.0065, notes: 'Promo streaming rate; built for voice agents', sourceUrl: 'https://deepgram.com/pricing' },
  { id: 'deepgram-flux-multilingual', provider: 'Deepgram', name: 'Flux Multilingual (conversational)', perMinute: 0.0078, notes: 'Streaming-only; turn detection + interruption handling', sourceUrl: 'https://deepgram.com/pricing' },
  { id: 'deepgram-nova-3-prerecorded', provider: 'Deepgram', name: 'Nova-3 (pre-recorded/batch)', perMinute: 0.0043, notes: 'Multilingual pre-recorded $0.0052/min', sourceUrl: 'https://deepgram.com/pricing' },
  { id: 'deepgram-whisper-cloud', provider: 'Deepgram', name: 'Whisper Large (pre-recorded only)', perMinute: 0.0048, notes: 'Not offered for streaming', sourceUrl: 'https://deepgram.com/pricing' },
  { id: 'deepgram-nova-2', provider: 'Deepgram', name: 'Nova-2 (streaming, legacy)', perMinute: 0.00583, notes: '$0.35/hr; Deepgram recommends Nova-3 for new projects', sourceUrl: 'https://deepgram.com/pricing' },

  // Azure AI Speech — https://azure.microsoft.com/en-us/pricing/details/speech/ (East US)
  { id: 'azure-stt-standard', provider: 'Azure', name: 'Azure STT (standard realtime)', perMinute: 0.0167, notes: '$1.00 per audio hour, East US; commitment tiers cheaper', sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/speech/' },
  { id: 'azure-fast-transcription', provider: 'Azure', name: 'Fast Transcription (file)', perMinute: 0.006, notes: '$0.36/hr; synchronous faster-than-realtime file transcription', sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/speech/' },
  { id: 'azure-batch-transcription', provider: 'Azure', name: 'Batch transcription', perMinute: 0.003, notes: '$0.18/hr; async batch of stored audio', sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/speech/' },
  { id: 'azure-custom-speech-realtime', provider: 'Azure', name: 'Custom Speech (realtime)', perMinute: 0.02, notes: '$1.20/hr + endpoint hosting ~$1.29/day', sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/speech/' },

  // Sarvam AI — endpoint-priced ₹30/hr regardless of model; billed per second
  { id: 'sarvam-saaras-v3', provider: 'Sarvam', name: 'Saaras v3 (STT)', perMinute: 0.0052, notes: '₹30/hr billed per second; same price for streaming and batch', sourceUrl: 'https://www.sarvam.ai/api-pricing' },
  { id: 'sarvam-saarika-v2-5', provider: 'Sarvam', name: 'Saarika v2.5 (STT, legacy)', perMinute: 0.0052, notes: '₹30/hr; deprecation announced — Sarvam recommends Saaras v3', sourceUrl: 'https://docs.sarvam.ai/api-reference-docs/speech-to-text/transcribe' },
  { id: 'sarvam-stt-diarization', provider: 'Sarvam', name: 'STT + Diarization', perMinute: 0.0079, notes: '₹45/hr (+₹15/hr for speaker identification)', sourceUrl: 'https://www.sarvam.ai/api-pricing' },
  { id: 'sarvam-saaras-translate', provider: 'Sarvam', name: 'Saaras STT-translate', perMinute: 0.0052, notes: '₹30/hr; transcribe + translate in one call; ₹45/hr with diarization', sourceUrl: 'https://www.sarvam.ai/api-pricing' },

  // Soniox — token-billed; per-minute derived from Soniox's published conversions (30k audio-in + 15k text-out tokens/hr)
  { id: 'soniox-stt-rt-v5', provider: 'Soniox', name: 'stt-rt-v5 (real-time streaming)', perMinute: 0.002, notes: '$0.12/hr exact; diarization, language ID and 60+ language translation bundled', sourceUrl: 'https://soniox.com/pricing' },
  { id: 'soniox-stt-async-v5', provider: 'Soniox', name: 'stt-async-v5 (batch/file)', perMinute: 0.00163, notes: '$0.0975/hr exact (~$0.10 headline); diarization and translation included', sourceUrl: 'https://soniox.com/pricing' },
]

export const TTS_MODELS: TTSModel[] = [
  // Azure AI Speech — East US
  { id: 'azure-neural', provider: 'Azure', name: 'Azure Neural TTS', per1kChars: 0.015, notes: '$15/1M chars, East US; commitment tiers down to $6/1M', sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/speech/' },
  { id: 'azure-neural-hd', provider: 'Azure', name: 'Azure Neural HD TTS', per1kChars: 0.022, notes: '$22/1M chars, East US (cut from $30 in Mar 2026)', sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/speech/' },

  // ElevenLabs — direct API usage-based rates
  { id: 'elevenlabs-flash', provider: 'ElevenLabs', name: 'ElevenLabs Flash / Turbo', per1kChars: 0.05, notes: 'Flat $0.05/1k API rate at every plan tier (billed in USD, not credits)', sourceUrl: 'https://elevenlabs.io/pricing/api' },
  { id: 'elevenlabs-multilingual', provider: 'ElevenLabs', name: 'ElevenLabs Multilingual v2/v3', per1kChars: 0.1, notes: 'Flat $0.10/1k API rate at every plan tier; Eleven v3 same rate', sourceUrl: 'https://elevenlabs.io/pricing/api' },

  // Cartesia — effective Scale-plan rates (1 credit/char)
  { id: 'cartesia-sonic', provider: 'Cartesia', name: 'Cartesia Sonic 3.5', per1kChars: 0.0374, notes: 'Scale plan effective rate ($299/mo ÷ 8M credits); Pro $0.05/1k', sourceUrl: 'https://www.cartesia.ai/pricing' },
  { id: 'cartesia-sonic-turbo', provider: 'Cartesia', name: 'Cartesia Sonic Turbo', per1kChars: 0.0374, notes: 'Ultra-low latency (~40ms); same 1 credit/char rate as Sonic 3.5', sourceUrl: 'https://www.cartesia.ai/pricing' },

  // Gemini TTS — token-billed; effective $/1k chars derived (see file header)
  { id: 'google-gemini-3-1-flash-tts-preview', provider: 'Google Gemini', name: 'Gemini 3.1 Flash TTS', per1kChars: 0.0336, preview: true, notes: 'Derived: $1/1M text-in + $20/1M audio-out tokens; batch mode 50% off', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-2-5-pro-tts', provider: 'Google Gemini', name: 'Gemini 2.5 Pro TTS', per1kChars: 0.0336, preview: true, notes: 'Derived: $1/1M text-in + $20/1M audio-out tokens; multi-speaker capable', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-2-5-flash-tts', provider: 'Google Gemini', name: 'Gemini 2.5 Flash TTS', per1kChars: 0.0168, preview: true, notes: 'Derived: $0.50/1M text-in + $10/1M audio-out tokens', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-2-5-flash-lite-tts', provider: 'Google Gemini', name: 'Gemini 2.5 Flash-Lite TTS', per1kChars: 0.0168, preview: true, notes: 'Same token rates as 2.5 Flash TTS', sourceUrl: 'https://cloud.google.com/text-to-speech/pricing' },
  { id: 'google-gemini-2-5-flash-native-audio', provider: 'Google Gemini', name: 'Gemini 2.5 Flash Native Audio (Live)', per1kChars: 0.0201, preview: true, notes: 'Conversational Live API model, not batch TTS; $12/1M audio-out tokens', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },
  { id: 'google-gemini-3-1-flash-live', provider: 'Google Gemini', name: 'Gemini 3.1 Flash Live', per1kChars: 0.0202, preview: true, notes: 'Conversational Live API model; $0.75/1M text-in + $12/1M audio-out tokens', sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing' },

  // Google Cloud Text-to-Speech — per-character billing
  { id: 'google-cloud-tts-chirp3-hd', provider: 'Google Cloud', name: 'Chirp 3: HD voices', per1kChars: 0.03, notes: '$30/1M chars; free tier 1M chars/mo; current flagship voice line', sourceUrl: 'https://cloud.google.com/text-to-speech/pricing' },
  { id: 'google-cloud-tts-instant-custom', provider: 'Google Cloud', name: 'Instant custom voice', per1kChars: 0.06, notes: '$60/1M chars; instantly-cloned custom voices; no free tier', sourceUrl: 'https://cloud.google.com/text-to-speech/pricing' },
  { id: 'google-cloud-tts-studio', provider: 'Google Cloud', name: 'Studio voices (legacy)', per1kChars: 0.16, notes: '$160/1M chars; free tier 1M chars/mo', sourceUrl: 'https://cloud.google.com/text-to-speech/pricing' },
  { id: 'google-cloud-tts-neural2', provider: 'Google Cloud', name: 'Neural2 voices (legacy)', per1kChars: 0.016, notes: '$16/1M chars; free tier 1M chars/mo', sourceUrl: 'https://cloud.google.com/text-to-speech/pricing' },
  { id: 'google-cloud-tts-polyglot', provider: 'Google Cloud', name: 'Polyglot voices', per1kChars: 0.016, preview: true, notes: 'Same $16/1M rate as Neural2', sourceUrl: 'https://cloud.google.com/text-to-speech/pricing' },
  { id: 'google-cloud-tts-wavenet', provider: 'Google Cloud', name: 'WaveNet voices (legacy)', per1kChars: 0.004, notes: '$4/1M chars; free tier 4M chars/mo', sourceUrl: 'https://cloud.google.com/text-to-speech/pricing' },
  { id: 'google-cloud-tts-standard', provider: 'Google Cloud', name: 'Standard voices (legacy)', per1kChars: 0.004, notes: '$4/1M chars; cheapest Google TTS; free tier 4M chars/mo', sourceUrl: 'https://cloud.google.com/text-to-speech/pricing' },

  // Sarvam AI — INR-native, converted at 95.3
  { id: 'sarvam-bulbul-v2', provider: 'Sarvam', name: 'Bulbul v2', per1kChars: 0.0157, notes: '₹15/10k chars; REST + WebSocket streaming at the same price', sourceUrl: 'https://www.sarvam.ai/api-pricing' },
  { id: 'sarvam-bulbul-v3', provider: 'Sarvam', name: 'Bulbul v3', per1kChars: 0.0315, preview: true, notes: '₹30/10k chars, beta pricing; 11 Indian languages', sourceUrl: 'https://docs.sarvam.ai/api-reference-docs/pricing' },

  // Soniox — token-billed; derived at Soniox's own conversions (1 char ≈ 0.3 text tokens, 1k chars ≈ 600 audio-out tokens)
  { id: 'soniox-tts-rt-v1', provider: 'Soniox', name: 'tts-rt-v1 (real-time)', per1kChars: 0.0141, notes: 'Derived: $4/1M text-in + $21.50/1M audio-out tokens (~$0.70/hr of speech); 60+ languages', sourceUrl: 'https://soniox.com/pricing' },
]

export const DEFAULT_SELECTION = {
  llmId: 'openai-gpt-5-4-mini',
  sttId: 'deepgram-nova-3',
  ttsId: 'elevenlabs-flash',
}
