import type { Assumptions, LLMModel, STTModel, TTSModel } from '../types'
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

      <Card title="Caching">
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">TTS cache hit rate</span>
            </div>
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
            <p className="mt-1 text-[11px] text-slate-400">
              Share of bot speech served from cache (greetings, common phrases) — not billed by the TTS provider.
            </p>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">LLM prefill cache hit rate</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={Math.round(a.llmCacheHitRate * 100)}
                onChange={(e) => set({ llmCacheHitRate: Number(e.target.value) / 100 })}
                className="w-full accent-indigo-600"
              />
              <span className="w-12 text-right text-sm font-semibold text-slate-700">
                {Math.round(a.llmCacheHitRate * 100)}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {llm && llm.cachedInputPerM === undefined ? (
                <span className="font-medium text-amber-600">
                  {llm.name} publishes no cached-input price — this slider has no effect for it.
                </span>
              ) : (
                <>
                  Share of input tokens (system prompt, conversation history) billed at the provider's cached rate
                  {llm?.cachedInputPerM !== undefined &&
                    ` ($${llm.cachedInputPerM}/M vs $${llm.inputPerM}/M for ${llm.name})`}
                  .
                </>
              )}
            </p>
          </div>
        </div>
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
    </div>
  )
}
