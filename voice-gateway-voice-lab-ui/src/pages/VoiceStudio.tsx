import { useEffect, useMemo, useState } from 'react'
import { Activity, FlaskConical } from 'lucide-react'
import { LanguageSelector } from '../components/LanguageSelector'
import { VoiceCatalogue } from '../components/VoiceCatalogue'
import { VoiceParameters } from '../components/VoiceParameters'
import { VoicePreview } from '../components/VoicePreview'
import { ConfigurationSummary } from '../components/ConfigurationSummary'
import { VoiceSwitchDemo } from '../components/VoiceSwitchDemo'
import { LlmReplies } from '../components/LlmReplies'
import { MOCK_DATA_NOTICE } from '../data/mockVoices'
import { voiceApi } from '../services/voiceApi'
import type { Voice, VoiceParameters as Params } from '../types/voice'

const defaultParameters: Params = { pace: 1, pitch: 0, loudness: 1, temperature: 0.3 }

export function VoiceStudio() {
  const [activeTab, setActiveTab] = useState<'voices' | 'llm'>('voices')
  const [voices, setVoices] = useState<Voice[]>([])
  const [languageCode, setLanguageCode] = useState('en-IN')
  const [gender, setGender] = useState<'all' | 'female' | 'male'>('all')
  const [selected, setSelected] = useState<Voice | null>(null)
  const [parameters, setParameters] = useState<Params>(defaultParameters)
  const [text, setText] = useState('Namaste! Welcome to Maya Customer360 voice gateway.')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [selections, setSelections] = useState<Record<string, Voice | null>>({})
  const [switchStatus, setSwitchStatus] = useState('No language switch has been demonstrated yet.')

  useEffect(() => {
    voiceApi.getVoices().then((catalogue) => {
      setVoices(catalogue)
      const initial = catalogue.find((voice) => voice.languageCode === 'en-IN') || null
      setSelected(initial)
      setSelections((current) => ({ ...current, 'en-IN': initial }))
    }).catch(() => setPreviewError('Unable to load the voice catalogue.'))
  }, [])

  const languageVoices = useMemo(
    () => voices.filter((voice) => voice.languageCode === languageCode),
    [voices, languageCode],
  )

  const changeLanguage = (code: string) => {
    setLanguageCode(code)
    const stored = selections[code]
    const fallback = stored || voices.find((voice) => voice.languageCode === code) || null
    setSelected(fallback)
  }

  const selectVoice = (voice: Voice) => {
    setSelected(voice)
    setSelections((current) => ({ ...current, [voice.languageCode]: voice }))
  }

  const changeParameter = (key: keyof Params, value: number) => {
    setParameters((current) => ({ ...current, [key]: value }))
  }

  const handlePreview = async () => {
    if (!selected) return
    setPreviewLoading(true)
    setPreviewError('')
    const supported = selected.model === 'Bulbul v3'
      ? { pace: parameters.pace, temperature: parameters.temperature }
      : { pace: parameters.pace, pitch: parameters.pitch, loudness: parameters.loudness }
    try {
      const blob = await voiceApi.preview(selected.id, text, { ...defaultParameters, ...supported })
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      setAudioUrl(URL.createObjectURL(blob))
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Preview failed.')
    } finally {
      setPreviewLoading(false)
    }
  }

  const saveConfiguration = async () => {
    if (!selected) return
    setSaving(true)
    setSaveMessage('')
    try {
      await voiceApi.saveConfig({
        languageCode,
        genderFilter: gender,
        voiceId: selected.id,
        model: selected.model,
        parameters,
      })
      setSaveMessage('Configuration saved in mock mode.')
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const reset = () => {
    setGender('all')
    setParameters(defaultParameters)
    setSaveMessage('')
  }

  const switchLanguage = (code: 'hi-IN' | 'ta-IN') => {
    const stored = selections[code] || voices.find((voice) => voice.languageCode === code) || null
    setLanguageCode(code)
    setGender('all')
    setSelected(stored)
    setSelections((current) => ({ ...current, [code]: stored }))
    setSwitchStatus(stored
      ? `Next TTS response will use ${stored.displayName} (${stored.model}) for ${code}.`
      : `No mock voice is available for ${code}.`)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><Activity size={19} /></span><span>InTalksAI</span></div>
        <span className="environment"><i /> Local demo</span>
      </header>
      <nav className="studio-tabs" aria-label="Studio sections">
        <button className={activeTab === 'voices' ? 'active' : ''} onClick={() => setActiveTab('voices')}>Voices (TTS)</button>
        <button className={activeTab === 'llm' ? 'active' : ''} onClick={() => setActiveTab('llm')}>LLM Replies</button>
      </nav>
      <div className="content">
        {activeTab === 'llm' ? <LlmReplies /> : (
        <>
        <div className="page-header">
          <div><p className="eyebrow"><FlaskConical size={14} /> Customer360 Voice Gateway</p><h1>Voice Management Studio</h1><p>Configure, test and manage AI voices for Maya.</p></div>
          <span className="mock-badge">{MOCK_DATA_NOTICE}</span>
        </div>
        <LanguageSelector voices={voices} selected={languageCode} onChange={changeLanguage} />
        <VoiceCatalogue voices={languageVoices} gender={gender} selected={selected} onGenderChange={setGender} onSelect={selectVoice} />
        <div className="lower-grid">
          <VoiceParameters voice={selected} values={parameters} onChange={changeParameter} />
          <VoicePreview text={text} onTextChange={setText} onPreview={handlePreview}
            loading={previewLoading} error={previewError} audioUrl={audioUrl} />
        </div>
        <ConfigurationSummary languageCode={languageCode} gender={gender} voice={selected}
          parameters={parameters} onSave={saveConfiguration} onReset={reset} saving={saving} message={saveMessage} />
        <VoiceSwitchDemo voices={voices} selections={selections} onSwitch={switchLanguage} status={switchStatus} />
        </>
        )}
      </div>
    </main>
  )
}
