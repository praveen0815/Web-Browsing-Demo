import { Check, CircleUserRound } from 'lucide-react'
import type { Voice } from '../types/voice'

interface Props {
  voice: Voice
  selected: boolean
  onSelect: (voice: Voice) => void
}

export function VoiceCard({ voice, selected, onSelect }: Props) {
  return (
    <button className={`voice-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(voice)}>
      <div className="voice-card-top">
        <span className="avatar"><CircleUserRound size={22} /></span>
        {selected && <span className="selected-check"><Check size={14} /></span>}
      </div>
      <strong>{voice.displayName}</strong>
      <code>{voice.id}</code>
      <div className="voice-meta">
        <span className={`gender ${voice.gender}`}>{voice.gender}</span>
        <span>{voice.model}</span>
      </div>
      <small>{voice.languageName} · {voice.languageCode}</small>
    </button>
  )
}
