import type { Voice, VoiceParameters as Params } from '../types/voice'

interface Props {
  voice: Voice | null
  values: Params
  onChange: (key: keyof Params, value: number) => void
}

const sliders: Array<{ key: keyof Params; label: string; min: number; max: number; step: number }> = [
  { key: 'pace', label: 'Pace', min: 0.5, max: 2, step: 0.1 },
  { key: 'pitch', label: 'Pitch', min: -0.5, max: 0.5, step: 0.01 },
  { key: 'loudness', label: 'Loudness', min: 0.1, max: 2.5, step: 0.1 },
  { key: 'temperature', label: 'Temperature', min: 0.01, max: 1, step: 0.01 },
]

export function VoiceParameters({ voice, values, onChange }: Props) {
  const model = voice?.model
  return (
    <section className="panel">
      <div className="section-heading"><span className="step">3</span><h2>Voice Parameters</h2></div>
      <div className="slider-list">
        {sliders.map((slider) => {
          const enabled = model === 'Bulbul v4'
            ? slider.key === 'pace' || slider.key === 'pitch' || slider.key === 'loudness'
            : model === 'Bulbul v3'
              ? slider.key === 'pace' || slider.key === 'temperature'
              : false
          return (
            <label className={`slider-row ${enabled ? '' : 'disabled'}`} key={slider.key}>
              <div><span>{slider.label}</span><output>{values[slider.key].toFixed(slider.key === 'pitch' ? 2 : 2)}</output></div>
              <input type="range" min={slider.min} max={slider.max} step={slider.step} value={values[slider.key]}
                disabled={!enabled} onChange={(event) => onChange(slider.key, Number(event.target.value))} />
            </label>
          )
        })}
      </div>
    </section>
  )
}
