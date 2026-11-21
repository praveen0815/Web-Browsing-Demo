import { ArrowRight, Languages } from 'lucide-react'
import type { Voice } from '../types/voice'

interface Props {
  voices: Voice[]
  selections: Record<string, Voice | null>
  onSwitch: (languageCode: 'hi-IN' | 'ta-IN') => void
  status: string
}

export function VoiceSwitchDemo({ voices, selections, onSwitch, status }: Props) {
  const hindi = voices.find((voice) => voice.languageCode === 'hi-IN')
  const tamil = voices.find((voice) => voice.languageCode === 'ta-IN')
  return (
    <section className="panel switch-demo">
      <div className="section-heading"><span className="step">6</span><h2>Dynamic Voice Switching</h2></div>
      <div className="switch-flow">
        <button onClick={() => onSwitch('hi-IN')}>
          <span>Hindi</span><b>{selections['hi-IN']?.displayName || hindi?.displayName || 'No mock voice'}</b>
        </button>
        <ArrowRight size={18} />
        <button onClick={() => onSwitch('ta-IN')}>
          <span>Tamil</span><b>{selections['ta-IN']?.displayName || tamil?.displayName || 'No mock voice'}</b>
        </button>
      </div>
      <div className="next-response"><Languages size={17} /><span>{status}</span></div>
    </section>
  )
}
