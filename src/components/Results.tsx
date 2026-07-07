import type { CostBreakdown } from '../lib/calc'
import { fmtINR, fmtNum, fmtUSD } from '../lib/calc'
import type { Assumptions, LLMModel, STTModel, TTSModel } from '../types'
import { Card } from './fields'

interface Props {
  breakdown: CostBreakdown
  llm: LLMModel
  stt: STTModel
  tts: TTSModel
  assumptions: Assumptions
  usdInr: number
}

const SEGMENTS = [
  { key: 'llm', label: 'LLM', color: 'bg-indigo-500', text: 'text-indigo-600' },
  { key: 'stt', label: 'STT', color: 'bg-emerald-500', text: 'text-emerald-600' },
  { key: 'tts', label: 'TTS', color: 'bg-amber-500', text: 'text-amber-600' },
  { key: 'fixed', label: 'Fixed', color: 'bg-slate-400', text: 'text-slate-500' },
] as const

export function Results({ breakdown: b, llm, stt, tts, assumptions: a, usdInr }: Props) {
  const costs: Record<(typeof SEGMENTS)[number]['key'], number> = {
    llm: b.llm.cost,
    stt: b.stt.cost,
    tts: b.tts.cost,
    fixed: b.fixed,
  }
  const total = b.totalPerMin

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-slate-500">Estimated cost per minute</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-5xl font-bold tracking-tight text-slate-900">{fmtUSD(total)}</span>
              <span className="text-2xl font-semibold text-slate-400">({fmtINR(total, usdInr)})</span>
            </div>
          </div>
          <div className="flex gap-8 text-right">
            <div>
              <div className="text-xs text-slate-400">per {a.callMinutes}-min call</div>
              <div className="text-xl font-semibold text-slate-700">{fmtUSD(total * a.callMinutes, 3)}</div>
              <div className="text-xs text-slate-400">({fmtINR(total * a.callMinutes, usdInr)})</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">per 1,000 minutes</div>
              <div className="text-xl font-semibold text-slate-700">{fmtUSD(total * 1000, 2)}</div>
              <div className="text-xs text-slate-400">({fmtINR(total * 1000, usdInr)})</div>
            </div>
          </div>
        </div>

        {total > 0 && (
          <>
            <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
              {SEGMENTS.filter((s) => costs[s.key] > 0).map((s) => (
                <div key={s.key} className={s.color} style={{ width: `${(costs[s.key] / total) * 100}%` }} />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
              {SEGMENTS.map((s) => (
                <div key={s.key} className="flex items-center gap-1.5 text-xs">
                  <span className={`h-2 w-2 rounded-full ${s.color}`} />
                  <span className="font-medium text-slate-600">{s.label}</span>
                  <span className="text-slate-400">
                    {fmtUSD(costs[s.key])} · {((costs[s.key] / total) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailCard
          label="LLM"
          accent="text-indigo-600"
          name={`${llm.provider} · ${llm.name}`}
          cost={b.llm.cost}
          usdInr={usdInr}
          rows={[
            ['LLM calls / min', String(b.llm.calls)],
            ['Input tokens / min', fmtNum(b.llm.tokensIn)],
            ['Output tokens / min', fmtNum(b.llm.tokensOut)],
            ['Prefill cache hit', `${Math.round(b.llm.cacheApplied * 100)}%`],
            ['Blended input rate', `$${b.llm.blendedInputPerM.toFixed(3)}/M`],
            ['Rate', `$${llm.inputPerM}/M in · $${llm.outputPerM}/M out`],
          ]}
        />
        <DetailCard
          label="Speech-to-Text"
          accent="text-emerald-600"
          name={`${stt.provider} · ${stt.name}`}
          cost={b.stt.cost}
          usdInr={usdInr}
          rows={[
            ['Audio billed / min', `${b.stt.billedSeconds}s`],
            ['Rate', `$${stt.perMinute}/min`],
          ]}
        />
        <DetailCard
          label="Text-to-Speech"
          accent="text-amber-600"
          name={`${tts.provider} · ${tts.name}`}
          cost={b.tts.cost}
          usdInr={usdInr}
          rows={[
            ['Characters / min', fmtNum(b.tts.totalChars)],
            ['Billed after cache', fmtNum(b.tts.billedChars)],
            ['Cache hit rate', `${Math.round(a.ttsCacheHitRate * 100)}%`],
            ['Rate', `$${tts.per1kChars}/1k chars`],
          ]}
        />
        <DetailCard
          label="Fixed"
          accent="text-slate-500"
          name="Telephony / infra / margin"
          cost={b.fixed}
          usdInr={usdInr}
          rows={[['Added per minute', fmtUSD(b.fixed)]]}
        />
      </div>
    </div>
  )
}

function DetailCard({
  label,
  accent,
  name,
  cost,
  usdInr,
  rows,
}: {
  label: string
  accent: string
  name: string
  cost: number
  usdInr: number
  rows: [string, string][]
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-xs font-semibold tracking-wide uppercase ${accent}`}>{label}</div>
          <div className="mt-0.5 text-sm font-medium text-slate-800">{name}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-slate-900">{fmtUSD(cost)}</div>
          <div className="text-xs text-slate-400">({fmtINR(cost, usdInr)})</div>
        </div>
      </div>
      <dl className="mt-3 space-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs">
            <dt className="text-slate-400">{k}</dt>
            <dd className="font-medium text-slate-600">{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
