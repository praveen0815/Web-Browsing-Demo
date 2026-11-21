import { LoaderCircle, Play } from 'lucide-react'

interface Props {
  text: string
  onTextChange: (text: string) => void
  onPreview: () => void
  loading: boolean
  error: string
  audioUrl: string
}

export function VoicePreview({ text, onTextChange, onPreview, loading, error, audioUrl }: Props) {
  return (
    <section className="panel">
      <div className="section-heading"><span className="step">4</span><h2>Voice Preview</h2></div>
      <textarea value={text} onChange={(event) => onTextChange(event.target.value)} maxLength={500}
        placeholder="Enter text to preview..." />
      <button className="primary-button preview-button" onClick={onPreview} disabled={loading}>
        {loading ? <LoaderCircle className="spin" size={18} /> : <Play size={18} />}
        {loading ? 'Generating preview...' : 'Preview Voice'}
      </button>
      {error && <p className="error-message">{error}</p>}
      {audioUrl && <audio controls src={audioUrl} className="audio-player" />}
    </section>
  )
}
