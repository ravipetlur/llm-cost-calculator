import type { ReactNode } from 'react'

export function Card({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

interface NumberFieldProps {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
  prefix?: string
  suffix?: string
  hint?: string
}

export function NumberField({ label, value, onChange, step = 1, min = 0, max, prefix, suffix, hint }: NumberFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <span className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
        {prefix && <span className="text-sm text-slate-400">{prefix}</span>}
        <input
          type="number"
          className="w-full min-w-0 text-sm text-slate-900 outline-none"
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={(e) => {
            const v = e.target.valueAsNumber
            if (!Number.isNaN(v)) onChange(v)
          }}
        />
        {suffix && <span className="text-xs whitespace-nowrap text-slate-400">{suffix}</span>}
      </span>
      {hint && <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>}
    </label>
  )
}

interface SelectFieldProps<T extends { id: string; provider: string; name: string; preview?: boolean }> {
  label: string
  options: T[]
  value: string
  onChange: (id: string) => void
  detail?: string
}

export function SelectField<T extends { id: string; provider: string; name: string; preview?: boolean }>({
  label,
  options,
  value,
  onChange,
  detail,
}: SelectFieldProps<T>) {
  const providers = [...new Set(options.map((o) => o.provider))]
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <select
        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {providers.map((p) => (
          <optgroup key={p} label={p}>
            {options
              .filter((o) => o.provider === p)
              .map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                  {o.preview && !o.name.toLowerCase().includes('preview') ? ' · preview' : ''}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
      {detail && <span className="mt-1 block text-[11px] text-slate-400">{detail}</span>}
    </label>
  )
}

export function CustomBadge() {
  return (
    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
      custom
    </span>
  )
}

export function PreviewBadge() {
  return (
    <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">
      preview
    </span>
  )
}
