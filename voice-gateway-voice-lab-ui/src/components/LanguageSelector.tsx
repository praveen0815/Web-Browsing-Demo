import type { Voice } from '../types/voice'

interface Props {
  voices: Voice[]
  selected: string
  onChange: (code: string) => void
}

const languages = [
  ['English (India)', 'en-IN'], ['Hindi', 'hi-IN'], ['Tamil', 'ta-IN'],
  ['Kannada', 'kn-IN'], ['Marathi', 'mr-IN'], ['Odia', 'od-IN'],
  ['Telugu', 'te-IN'], ['Malayalam', 'ml-IN'], ['Bengali', 'bn-IN'],
  ['Gujarati', 'gu-IN'], ['Punjabi', 'pa-IN'],
] as const

export function LanguageSelector({ voices, selected, onChange }: Props) {
  return (
    <section className="panel">
      <div className="section-heading"><span className="step">1</span><h2>Language</h2></div>
      <div className="language-grid">
        {languages.map(([name, code]) => {
          const available = voices.some((voice) => voice.languageCode === code)
          return (
            <button key={code} className={`language-option ${selected === code ? 'active' : ''}`} onClick={() => onChange(code)}>
              <span>{name}</span><small>{code}</small>
              {!available && <em>No voices</em>}
            </button>
          )
        })}
      </div>
    </section>
  )
}
