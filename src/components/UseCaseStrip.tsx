import { USE_CASES } from '../data/useCases'
import type { Assumptions } from '../types'

interface Props {
  assumptions: Assumptions
  onAssumptions: (a: Assumptions) => void
}

export function UseCaseStrip({ assumptions: a, onAssumptions }: Props) {
  const active = USE_CASES.find((u) =>
    Object.entries(u.patch).every(([k, v]) => a[k as keyof Assumptions] === v),
  )

  return (
    <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">Use case</span>
        {USE_CASES.map((u) => {
          const isActive = u.id === active?.id
          return (
            <button
              key={u.id}
              onClick={() => onAssumptions({ ...a, ...u.patch })}
              title={u.description}
              className={`rounded-full border px-2.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {u.emoji} {u.name}
            </button>
          )
        })}
      </div>
      <p className="mt-1.5 text-[11px] text-slate-400">
        {active
          ? `${active.description} — the preset sets turns, words and cache rates; tweak anything below.`
          : 'Custom assumptions in effect — pick a preset to start from a typical call profile.'}
      </p>
    </section>
  )
}
