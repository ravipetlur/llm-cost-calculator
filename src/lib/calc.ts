import type { Assumptions, LLMModel, STTModel, TTSModel } from '../types'

export interface CostBreakdown {
  llm: {
    calls: number
    tokensIn: number
    tokensOut: number
    /** input rate after blending cached + uncached tokens, $/1M */
    blendedInputPerM: number
    /** cache rate actually applied (0 when the model has no cached pricing) */
    cacheApplied: number
    cost: number
  }
  stt: { billedSeconds: number; cost: number }
  tts: { totalChars: number; billedChars: number; cost: number }
  fixed: number
  totalPerMin: number
}

/** All figures are per one minute of call. */
export function calculate(
  llm: LLMModel,
  stt: STTModel,
  tts: TTSModel,
  a: Assumptions,
): CostBreakdown {
  const calls = a.botTurns
  const tokensIn = calls * a.inputWordsPerCall * a.tokensPerWord
  const tokensOut = calls * a.outputWordsPerCall * a.tokensPerWord
  // prefill caching only helps when the provider publishes a cached-input rate
  const cacheApplied = llm.cachedInputPerM !== undefined ? a.llmCacheHitRate : 0
  const blendedInputPerM =
    cacheApplied * (llm.cachedInputPerM ?? llm.inputPerM) + (1 - cacheApplied) * llm.inputPerM
  const llmCost = (tokensIn / 1e6) * blendedInputPerM + (tokensOut / 1e6) * llm.outputPerM

  const sttCost = (a.sttSecondsPerMin / 60) * stt.perMinute

  const totalChars = a.ttsSecondsPerMin * a.ttsCharsPerSecond
  const billedChars = totalChars * (1 - a.ttsCacheHitRate)
  const ttsCost = (billedChars / 1000) * tts.per1kChars

  const totalPerMin = llmCost + sttCost + ttsCost + a.fixedPerMin

  return {
    llm: { calls, tokensIn, tokensOut, blendedInputPerM, cacheApplied, cost: llmCost },
    stt: { billedSeconds: a.sttSecondsPerMin, cost: sttCost },
    tts: { totalChars, billedChars, cost: ttsCost },
    fixed: a.fixedPerMin,
    totalPerMin,
  }
}

/** Format a USD amount, keeping enough precision for sub-cent unit costs. */
export function fmtUSD(v: number, maxDigits = 4): string {
  if (v === 0) return '$0.00'
  const digits = v >= 1 ? 2 : maxDigits
  return `$${v.toFixed(digits)}`
}

export function fmtNum(v: number): string {
  return v.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

/** Format a USD amount as INR at the given rate, with Indian digit grouping. */
export function fmtINR(usd: number, rate: number): string {
  const v = usd * rate
  const digits = v >= 100 ? 0 : 2
  return `₹${v.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
}
