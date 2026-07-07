import type { Assumptions } from '../types'

export interface UseCase {
  id: string
  emoji: string
  name: string
  description: string
  patch: Partial<Assumptions>
}

/**
 * Preset call profiles (India-focused). Applying one overlays its patch on
 * the current assumptions — provider selection and fixed cost are untouched.
 */
export const USE_CASES: UseCase[] = [
  {
    id: 'inbound-banking',
    emoji: '🏦',
    name: 'Inbound banking support',
    description: 'Account queries, card blocks — dynamic conversations, no prefill reuse',
    patch: {
      botTurns: 5,
      userTurns: 5,
      inputWordsPerCall: 2500,
      outputWordsPerCall: 500,
      ttsCacheHitRate: 0.3,
      llmCacheHitRate: 0,
      callMinutes: 5,
    },
  },
  {
    id: 'outbound-loan',
    emoji: '📞',
    name: 'Outbound loan offer',
    description: 'Scripted pitch with personalization — heavy TTS and prompt reuse',
    patch: {
      botTurns: 4,
      userTurns: 4,
      inputWordsPerCall: 2000,
      outputWordsPerCall: 400,
      ttsCacheHitRate: 0.8,
      llmCacheHitRate: 0.65,
      callMinutes: 4,
    },
  },
  {
    id: 'emi-reminder',
    emoji: '💳',
    name: 'EMI / collections reminder',
    description: 'Short scripted reminder with a payment nudge',
    patch: {
      botTurns: 3,
      userTurns: 3,
      inputWordsPerCall: 1500,
      outputWordsPerCall: 300,
      ttsCacheHitRate: 0.85,
      llmCacheHitRate: 0.7,
      callMinutes: 2,
    },
  },
  {
    id: 'order-status',
    emoji: '📦',
    name: 'E-commerce order status',
    description: 'Where-is-my-order — templated answers around live data',
    patch: {
      botTurns: 4,
      userTurns: 4,
      inputWordsPerCall: 2000,
      outputWordsPerCall: 400,
      ttsCacheHitRate: 0.7,
      llmCacheHitRate: 0.5,
      callMinutes: 3,
    },
  },
  {
    id: 'telecom-support',
    emoji: '📱',
    name: 'Telecom support (inbound)',
    description: 'Plan, billing and network issues — long, varied conversations',
    patch: {
      botTurns: 6,
      userTurns: 6,
      inputWordsPerCall: 3000,
      outputWordsPerCall: 600,
      ttsCacheHitRate: 0.2,
      llmCacheHitRate: 0.15,
      callMinutes: 7,
    },
  },
  {
    id: 'clinic-appointment',
    emoji: '🏥',
    name: 'Clinic appointment booking',
    description: 'Slot check and confirmation — semi-scripted flow',
    patch: {
      botTurns: 4,
      userTurns: 4,
      inputWordsPerCall: 1800,
      outputWordsPerCall: 350,
      ttsCacheHitRate: 0.6,
      llmCacheHitRate: 0.4,
      callMinutes: 3,
    },
  },
]
