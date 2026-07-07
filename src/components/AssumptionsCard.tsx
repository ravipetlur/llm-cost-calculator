import type { Assumptions } from '../types'
import { DEFAULT_ASSUMPTIONS } from '../types'
import { Card, NumberField } from './fields'

interface Props {
  assumptions: Assumptions
  onAssumptions: (a: Assumptions) => void
}

export function AssumptionsCard({ assumptions: a, onAssumptions }: Props) {
  const set = (patch: Partial<Assumptions>) => onAssumptions({ ...a, ...patch })

  return (
    <Card
      title="Call assumptions"
      action={
        <button
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
          onClick={() =>
            onAssumptions({
              ...DEFAULT_ASSUMPTIONS,
              fixedPerMin: a.fixedPerMin,
              ttsCacheHitRate: a.ttsCacheHitRate,
              llmCacheHitRate: a.llmCacheHitRate,
            })
          }
        >
          Reset
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <NumberField label="Bot turns / min" value={a.botTurns} onChange={(v) => set({ botTurns: v })} />
        <NumberField label="User turns / min" value={a.userTurns} onChange={(v) => set({ userTurns: v })} />
        <NumberField label="Input words / LLM call" value={a.inputWordsPerCall} onChange={(v) => set({ inputWordsPerCall: v })} step={100} />
        <NumberField label="Output words / LLM call" value={a.outputWordsPerCall} onChange={(v) => set({ outputWordsPerCall: v })} step={50} />
        <NumberField label="Tokens per word" value={a.tokensPerWord} onChange={(v) => set({ tokensPerWord: v })} step={0.01} hint="≈1.33 for English" />
        <NumberField label="STT sec billed / min" value={a.sttSecondsPerMin} onChange={(v) => set({ sttSecondsPerMin: v })} max={60} hint="60 = full call streamed" />
        <NumberField label="TTS sec spoken / min" value={a.ttsSecondsPerMin} onChange={(v) => set({ ttsSecondsPerMin: v })} max={60} />
        <NumberField label="TTS chars / second" value={a.ttsCharsPerSecond} onChange={(v) => set({ ttsCharsPerSecond: v })} hint="≈15 at a normal pace" />
        <NumberField label="Avg call length" value={a.callMinutes} onChange={(v) => set({ callMinutes: v })} suffix="min" />
      </div>
    </Card>
  )
}
