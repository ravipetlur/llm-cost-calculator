import { LLM_MODELS, PRICING_AS_OF, STT_MODELS, TTS_MODELS } from '../data/pricing'
import type { PriceOverrides } from '../types'
import { EMPTY_OVERRIDES } from '../types'
import { CustomBadge, PreviewBadge } from './fields'

interface Props {
  open: boolean
  onClose: () => void
  overrides: PriceOverrides
  onOverrides: (o: PriceOverrides) => void
  usdInr: number
  onUsdInr: (v: number) => void
}

export function SettingsPane({ open, onClose, overrides, onOverrides, usdInr, onUsdInr }: Props) {
  const setLLM = (id: string, field: 'inputPerM' | 'outputPerM', v: number | undefined) => {
    const entry = { ...overrides.llm[id], [field]: v }
    const llm = { ...overrides.llm }
    if (entry.inputPerM === undefined && entry.outputPerM === undefined) delete llm[id]
    else llm[id] = entry
    onOverrides({ ...overrides, llm })
  }
  const setSTT = (id: string, v: number | undefined) => {
    const stt = { ...overrides.stt }
    if (v === undefined) delete stt[id]
    else stt[id] = { perMinute: v }
    onOverrides({ ...overrides, stt })
  }
  const setTTS = (id: string, v: number | undefined) => {
    const tts = { ...overrides.tts }
    if (v === undefined) delete tts[id]
    else tts[id] = { per1kChars: v }
    onOverrides({ ...overrides, tts })
  }

  const anyOverride =
    Object.keys(overrides.llm).length + Object.keys(overrides.stt).length + Object.keys(overrides.tts).length > 0

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-slate-900/30" onClick={onClose} />}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-lg transform overflow-y-auto bg-white shadow-2xl transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Pricing settings</h2>
            <p className="text-xs text-slate-400">
              List prices as of {PRICING_AS_OF}. Override any rate with your contracted price.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {anyOverride && (
              <button
                className="text-xs font-medium text-rose-600 hover:text-rose-800"
                onClick={() => onOverrides(EMPTY_OVERRIDES)}
              >
                Reset all
              </button>
            )}
            <button
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-slate-500 hover:bg-slate-50"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-8 px-6 py-6">
          <section>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">Currency</h3>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
              <span>
                <span className="block text-sm font-medium text-slate-800">USD → INR rate</span>
                <span className="block text-[11px] text-slate-400">Display only — all list prices stay in USD</span>
              </span>
              <input
                type="number"
                className="w-24 rounded-md border border-slate-300 px-2 py-1 text-right text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={usdInr}
                step={0.25}
                min={1}
                onChange={(e) => {
                  const v = e.target.valueAsNumber
                  if (!Number.isNaN(v) && v > 0) onUsdInr(v)
                }}
              />
            </label>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              LLM — $ per 1M tokens
            </h3>
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {LLM_MODELS.map((m) => {
                const o = overrides.llm[m.id]
                return (
                  <div key={m.id} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium text-slate-800">{m.name}</span>
                        {m.preview && <PreviewBadge />}
                        {o && <CustomBadge />}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {m.provider} · list ${m.inputPerM} in / ${m.outputPerM} out
                      </div>
                    </div>
                    <PriceInput label="in" value={o?.inputPerM} placeholder={m.inputPerM} onChange={(v) => setLLM(m.id, 'inputPerM', v)} />
                    <PriceInput label="out" value={o?.outputPerM} placeholder={m.outputPerM} onChange={(v) => setLLM(m.id, 'outputPerM', v)} />
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              STT — $ per minute of audio
            </h3>
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {STT_MODELS.map((m) => {
                const o = overrides.stt[m.id]
                return (
                  <div key={m.id} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium text-slate-800">{m.name}</span>
                        {m.preview && <PreviewBadge />}
                        {o && <CustomBadge />}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {m.provider} · list ${m.perMinute}/min{m.notes ? ` · ${m.notes}` : ''}
                      </div>
                    </div>
                    <PriceInput label="$/min" value={o?.perMinute} placeholder={m.perMinute} onChange={(v) => setSTT(m.id, v)} />
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              TTS — $ per 1k characters
            </h3>
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {TTS_MODELS.map((m) => {
                const o = overrides.tts[m.id]
                return (
                  <div key={m.id} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium text-slate-800">{m.name}</span>
                        {m.preview && <PreviewBadge />}
                        {o && <CustomBadge />}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {m.provider} · list ${m.per1kChars}/1k{m.notes ? ` · ${m.notes}` : ''}
                      </div>
                    </div>
                    <PriceInput label="$/1k" value={o?.per1kChars} placeholder={m.per1kChars} onChange={(v) => setTTS(m.id, v)} />
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </aside>
    </>
  )
}

function PriceInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: number | undefined
  placeholder: number
  onChange: (v: number | undefined) => void
}) {
  return (
    <label className="flex items-center gap-1">
      <span className="text-[10px] text-slate-400">{label}</span>
      <input
        type="number"
        className={`w-20 rounded-md border px-1.5 py-1 text-right text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
          value !== undefined ? 'border-amber-300 bg-amber-50 font-semibold text-amber-900' : 'border-slate-300 text-slate-700'
        }`}
        value={value ?? ''}
        placeholder={String(placeholder)}
        step={0.001}
        min={0}
        onChange={(e) => {
          const v = e.target.valueAsNumber
          onChange(Number.isNaN(v) ? undefined : v)
        }}
      />
    </label>
  )
}
