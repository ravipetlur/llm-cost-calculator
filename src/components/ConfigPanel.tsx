import type { Assumptions, LLMModel, STTModel, TTSModel } from '../types'
import { DEFAULT_ASSUMPTIONS } from '../types'
import { Card, NumberField, SelectField } from './fields'

interface Props {
  llms: LLMModel[]
  stts: STTModel[]
  ttss: TTSModel[]
  llmId: string
  sttId: string
  ttsId: string
  onSelect: (kind: 'llmId' | 'sttId' | 'ttsId', id: string) => void
  assumptions: Assumptions
  onAssumptions: (a: Assumptions) => void
}

export function ConfigPanel({ llms, stts, ttss, llmId, sttId, ttsId, onSelect, assumptions, onAssumptions }: Props) {
  const a = assumptions
  const set = (patch: Partial<Assumptions>) => onAssumptions({ ...a, ...patch })

  const llm = llms.find((m) => m.id === llmId)
  const stt = stts.find((m) => m.id === sttId)
  const tts = ttss.find((m) => m.id === ttsId)

  return (
    <div className="space-y-4">
      <Card title="Provider stack">
        <div className="space-y-4">
          <SelectField
            label="LLM"
            options={llms}
            value={llmId}
            onChange={(id) => onSelect('llmId', id)}
            detail={llm && `$${llm.inputPerM}/M input · $${llm.outputPerM}/M output tokens`}
          />
          <SelectField
            label="Speech-to-Text"
            options={stts}
            value={sttId}
            onChange={(id) => onSelect('sttId', id)}
            detail={stt && `$${stt.perMinute}/min of audio`}
          />
          <SelectField
            label="Text-to-Speech"
            options={ttss}
            value={ttsId}
            onChange={(id) => onSelect('ttsId', id)}
            detail={tts && `$${tts.per1kChars}/1k characters`}
          />
        </div>
      </Card>

      <Card title="TTS caching">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={Math.round(a.ttsCacheHitRate * 100)}
            onChange={(e) => set({ ttsCacheHitRate: Number(e.target.value) / 100 })}
            className="w-full accent-indigo-600"
          />
          <span className="w-12 text-right text-sm font-semibold text-slate-700">
            {Math.round(a.ttsCacheHitRate * 100)}%
          </span>
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400">
          Share of bot speech served from cache (greetings, common phrases) — not billed by the TTS provider.
        </p>
      </Card>

      <Card title="Fixed cost">
        <NumberField
          label="Added cost per minute"
          value={a.fixedPerMin}
          onChange={(v) => set({ fixedPerMin: v })}
          step={0.001}
          prefix="$"
          suffix="/min"
          hint="Telephony, infra, margin — added on top of the AI stack."
        />
      </Card>

      <Card
        title="Call assumptions"
        action={
          <button
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
            onClick={() => onAssumptions({ ...DEFAULT_ASSUMPTIONS, fixedPerMin: a.fixedPerMin, ttsCacheHitRate: a.ttsCacheHitRate })}
          >
            Reset
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-3">
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
    </div>
  )
}
