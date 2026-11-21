import { RotateCcw, Save } from 'lucide-react'
import type { Voice, VoiceParameters as Params } from '../types/voice'

interface Props {
  languageCode: string
  gender: 'all' | 'female' | 'male'
  voice: Voice | null
  parameters: Params
  onSave: () => void
  onReset: () => void
  saving: boolean
  message: string
}

export function ConfigurationSummary({ languageCode, gender, voice, parameters, onSave, onReset, saving, message }: Props) {
  const rows = [
    ['Selected language', languageCode],
    ['Gender filter', gender.charAt(0).toUpperCase() + gender.slice(1)],
    ['Selected voice', voice?.displayName || 'None'],
    ['Model', voice?.model || '—'],
  ]
  return (
    <section className="panel summary">
      <div className="section-heading"><span className="step">5</span><h2>Configuration Summary</h2></div>
      <dl>{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <div className="parameter-summary">
        <span>Pace <b>{parameters.pace.toFixed(2)}</b></span>
        <span>Pitch <b>{parameters.pitch.toFixed(2)}</b></span>
        <span>Loudness <b>{parameters.loudness.toFixed(2)}</b></span>
        <span>Temperature <b>{parameters.temperature.toFixed(2)}</b></span>
      </div>
      <div className="summary-actions">
        <button className="primary-button" onClick={onSave} disabled={saving || !voice}><Save size={17} />{saving ? 'Saving...' : 'Save Configuration'}</button>
        <button className="secondary-button" onClick={onReset}><RotateCcw size={17} />Reset</button>
      </div>
      {message && <p className="success-message">{message}</p>}
    </section>
  )
}
