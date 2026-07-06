import { useState } from 'react'
import { ConfigPanel } from './components/ConfigPanel'
import { Results } from './components/Results'
import { SettingsPane } from './components/SettingsPane'
import { DEFAULT_SELECTION, LLM_MODELS, PRICING_AS_OF, STT_MODELS, TTS_MODELS } from './data/pricing'
import { calculate } from './lib/calc'
import { useStoredState } from './lib/store'
import type { PriceOverrides } from './types'
import { DEFAULT_ASSUMPTIONS, EMPTY_OVERRIDES } from './types'

export default function App() {
  const [selection, setSelection] = useStoredState('selection', DEFAULT_SELECTION)
  const [assumptions, setAssumptions] = useStoredState('assumptions', DEFAULT_ASSUMPTIONS)
  const [overrides, setOverrides] = useStoredState<PriceOverrides>('overrides', EMPTY_OVERRIDES)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // apply price overrides on top of list prices
  const llms = LLM_MODELS.map((m) => ({ ...m, ...overrides.llm[m.id] }))
  const stts = STT_MODELS.map((m) => ({ ...m, ...overrides.stt[m.id] }))
  const ttss = TTS_MODELS.map((m) => ({ ...m, ...overrides.tts[m.id] }))

  // fall back to defaults if a stored id no longer exists after a pricing update
  const llm = llms.find((m) => m.id === selection.llmId) ?? llms.find((m) => m.id === DEFAULT_SELECTION.llmId) ?? llms[0]
  const stt = stts.find((m) => m.id === selection.sttId) ?? stts.find((m) => m.id === DEFAULT_SELECTION.sttId) ?? stts[0]
  const tts = ttss.find((m) => m.id === selection.ttsId) ?? ttss.find((m) => m.id === DEFAULT_SELECTION.ttsId) ?? ttss[0]

  const breakdown = calculate(llm, stt, tts, assumptions)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Voice AI Cost Calculator</h1>
            <p className="text-xs text-slate-400">
              Per-minute cost of a voice bot call · list prices as of {PRICING_AS_OF}
            </p>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Settings
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[400px_1fr]">
        <ConfigPanel
          llms={llms}
          stts={stts}
          ttss={ttss}
          llmId={llm.id}
          sttId={stt.id}
          ttsId={tts.id}
          onSelect={(kind, id) => setSelection({ ...selection, [kind]: id })}
          assumptions={assumptions}
          onAssumptions={setAssumptions}
        />
        <Results breakdown={breakdown} llm={llm} stt={stt} tts={tts} assumptions={assumptions} />
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-8 text-[11px] text-slate-400">
        Estimates only. All prices are public pay-as-you-go list rates unless overridden in Settings — verify against
        your provider contracts before quoting a customer.
      </footer>

      <SettingsPane
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        overrides={overrides}
        onOverrides={setOverrides}
      />
    </div>
  )
}
