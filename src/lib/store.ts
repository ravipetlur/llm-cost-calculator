import { useEffect, useState } from 'react'

const PREFIX = 'voice-cost-calc:'

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** useState persisted to localStorage. Object values are merged over the
 *  defaults so newly added fields get their default after an app update. */
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      if (raw !== null) {
        const parsed = JSON.parse(raw)
        if (isPlainObject(initial) && isPlainObject(parsed)) {
          return { ...initial, ...parsed }
        }
        return parsed
      }
    } catch {
      // corrupted entry — fall back to defaults
    }
    return initial
  })

  useEffect(() => {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
