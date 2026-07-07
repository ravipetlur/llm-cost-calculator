export interface LLMModel {
  id: string
  provider: string
  name: string
  /** USD per 1M input tokens */
  inputPerM: number
  /** USD per 1M output tokens */
  outputPerM: number
  /** USD per 1M cached input tokens, when published */
  cachedInputPerM?: number
  /** preview / pre-release / experimental model */
  preview?: boolean
  notes?: string
  sourceUrl?: string
}

export interface STTModel {
  id: string
  provider: string
  name: string
  /** USD per minute of audio */
  perMinute: number
  preview?: boolean
  notes?: string
  sourceUrl?: string
}

export interface TTSModel {
  id: string
  provider: string
  name: string
  /** USD per 1,000 characters synthesized */
  per1kChars: number
  preview?: boolean
  notes?: string
  sourceUrl?: string
}

export interface Assumptions {
  /** Bot turns per minute of call — each one is an LLM call + TTS output */
  botTurns: number
  /** User turns per minute of call */
  userTurns: number
  /** Words of prompt/context sent per LLM call */
  inputWordsPerCall: number
  /** Words generated per LLM call */
  outputWordsPerCall: number
  /** Token-per-word conversion (≈1.33 for English) */
  tokensPerWord: number
  /** Seconds of audio billed by STT per minute of call (60 = full stream) */
  sttSecondsPerMin: number
  /** Seconds the bot speaks per minute of call */
  ttsSecondsPerMin: number
  /** Characters per second of synthesized speech (≈15 at normal pace) */
  ttsCharsPerSecond: number
  /** Fraction of TTS served from cache and not billed (0–1) */
  ttsCacheHitRate: number
  /** Fraction of LLM input tokens billed at the provider's cached-input rate (0–1) */
  llmCacheHitRate: number
  /** Fixed $/min adder: telephony, infra, margin */
  fixedPerMin: number
  /** Average call length, used for the per-call figure */
  callMinutes: number
}

export interface LLMOverride {
  inputPerM?: number
  outputPerM?: number
}
export interface STTOverride {
  perMinute?: number
}
export interface TTSOverride {
  per1kChars?: number
}

export interface PriceOverrides {
  llm: Record<string, LLMOverride>
  stt: Record<string, STTOverride>
  tts: Record<string, TTSOverride>
}

export const DEFAULT_ASSUMPTIONS: Assumptions = {
  botTurns: 5,
  userTurns: 5,
  inputWordsPerCall: 2500,
  outputWordsPerCall: 500,
  tokensPerWord: 1.33,
  sttSecondsPerMin: 60,
  ttsSecondsPerMin: 30,
  ttsCharsPerSecond: 15,
  ttsCacheHitRate: 0.5,
  llmCacheHitRate: 0,
  fixedPerMin: 0,
  callMinutes: 5,
}

export const EMPTY_OVERRIDES: PriceOverrides = { llm: {}, stt: {}, tts: {} }
