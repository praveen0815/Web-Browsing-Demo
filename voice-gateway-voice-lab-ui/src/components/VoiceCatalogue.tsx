import type { Voice } from '../types/voice'
import { GenderFilter } from './GenderFilter'
import { VoiceCard } from './VoiceCard'

interface Props {
  voices: Voice[]
  gender: 'all' | 'female' | 'male'
  selected: Voice | null
  onGenderChange: (gender: 'all' | 'female' | 'male') => void
  onSelect: (voice: Voice) => void
}

export function VoiceCatalogue({ voices, gender, selected, onGenderChange, onSelect }: Props) {
  const filtered = voices.filter((voice) => gender === 'all' || voice.gender === gender)
  return (
    <section className="panel catalogue">
      <div className="section-heading-row">
        <div className="section-heading"><span className="step">2</span><h2>Voice Catalogue</h2></div>
        <GenderFilter selected={gender} onChange={onGenderChange} />
      </div>
      {filtered.length ? (
        <div className="voice-grid">{filtered.map((voice) => (
          <VoiceCard key={voice.id} voice={voice} selected={selected?.id === voice.id} onSelect={onSelect} />
        ))}</div>
      ) : (
        <div className="empty-state">No voices match this language and gender filter.</div>
      )}
    </section>
  )
}
