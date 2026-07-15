import type { Assumptions, PriceOverrides } from '../types'
import { STORE_PREFIX } from './store'

interface Selection {
  llmId: string
  sttId: string
  ttsId: string
}

interface SharePayload {
  v: 1
  sel: Selection
  a: Assumptions
  fx: number
  ov?: PriceOverrides
}

function toBase64Url(s: string): string {
  const bytes = new TextEncoder().encode(s)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(s: string): string {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}

/** Build a URL that reproduces the current view, custom prices included. */
export function buildShareUrl(sel: Selection, a: Assumptions, fx: number, ov: PriceOverrides): string {
  const hasOverrides = Object.keys(ov.llm).length + Object.keys(ov.stt).length + Object.keys(ov.tts).length > 0
  const payload: SharePayload = { v: 1, sel, a, fx, ...(hasOverrides ? { ov } : {}) }
  return `${location.origin}${location.pathname}#s=${toBase64Url(JSON.stringify(payload))}`
}

/**
 * If the page was opened via a share link, persist the shared state to
 * localStorage (before React reads it) and strip the hash. Shared overrides
 * are MERGED over the recipient's own — shared values win per model, so the
 * recipient sees the sender's exact numbers without losing unrelated
 * overrides of their own.
 */
export function consumeShareUrl(): void {
  const match = window.location.hash.match(/^#s=(.+)$/)
  if (!match) return
  try {
    const payload = JSON.parse(fromBase64Url(match[1])) as SharePayload
    if (payload.v !== 1) return
    if (payload.sel) localStorage.setItem(STORE_PREFIX + 'selection', JSON.stringify(payload.sel))
    if (payload.a) localStorage.setItem(STORE_PREFIX + 'assumptions', JSON.stringify(payload.a))
    if (typeof payload.fx === 'number' && payload.fx > 0) {
      localStorage.setItem(STORE_PREFIX + 'usdInr', JSON.stringify(payload.fx))
    }
    if (payload.ov) {
      let existing = { llm: {}, stt: {}, tts: {} }
      try {
        existing = { ...existing, ...JSON.parse(localStorage.getItem(STORE_PREFIX + 'overrides') ?? '{}') }
      } catch {
        // corrupted local overrides — replace with the shared ones
      }
      const merged = {
        llm: { ...existing.llm, ...payload.ov.llm },
        stt: { ...existing.stt, ...payload.ov.stt },
        tts: { ...existing.tts, ...payload.ov.tts },
      }
      localStorage.setItem(STORE_PREFIX + 'overrides', JSON.stringify(merged))
    }
  } catch {
    // malformed share link — fall through to normal state
  }
  history.replaceState(null, '', window.location.pathname + window.location.search)
}
