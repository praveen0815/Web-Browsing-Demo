import { useState } from 'react'
import { Copy, Plus, Play, X } from 'lucide-react'

interface ModelCardProps {
  title: string
  provider: string
  model: string
  providerOptions: string[]
  modelOptions: string[]
  temperature: number
  mayaGuards: boolean
  trim: boolean
  status: string
  onRemove?: () => void
}

function ModelCard({
  title,
  provider,
  model,
  providerOptions,
  modelOptions,
  temperature,
  mayaGuards,
  trim,
  status,
  onRemove,
}: ModelCardProps) {
  const [temperatureValue, setTemperatureValue] = useState(temperature)

  return (
    <section className="llm-model-card">
      <div className="llm-card-heading">
        <strong>{title}</strong>
        <div>
          <button type="button" title="Copy configuration"><Copy size={15} /></button>
          {onRemove && <button type="button" title="Remove model" onClick={onRemove}><X size={15} /></button>}
        </div>
      </div>
      <div className="llm-field-grid">
        <label>
          <span>Provider</span>
          <select defaultValue={provider}>
            {providerOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Model</span>
          <select defaultValue={model}>
            {modelOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
      </div>
      <label className="llm-temperature">
        <span>Temperature</span>
        <div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={temperatureValue}
            onChange={(event) => setTemperatureValue(Number(event.target.value))}
          />
          <output>{temperatureValue.toFixed(temperatureValue === 0.5 ? 1 : 1)}</output>
        </div>
      </label>
      <div className="llm-field-grid llm-short-fields">
        <label>
          <span>Max tokens</span>
          <input type="number" defaultValue={150} min={1} />
        </label>
        <label>
          <span>Trim to (sentences / words)</span>
          <div className="llm-two-inputs">
            <input type="number" defaultValue={2} min={0} />
            <input type="number" defaultValue={45} min={0} />
          </div>
        </label>
      </div>
      <div className="llm-checkboxes">
        <label><input type="checkbox" defaultChecked={mayaGuards} /> Maya guards</label>
        <label><input type="checkbox" defaultChecked={trim} /> trim</label>
        <label><input type="checkbox" /> fall back to Claude if empty</label>
      </div>
      <p className="llm-status">{status}</p>
    </section>
  )
}

export function LlmReplies() {
  const [customerTurn, setCustomerTurn] = useState('मेरी EMI कितनी है?')
  const [conversation, setConversation] = useState('Hello')
  const [customerData, setCustomerData] = useState(
    `ACCOUNT_DATA (use ONLY these exact figures, never invent numbers):
- Customer: Karan Dixit (ID: 79592091)
- Personal loan: EMI INR 800 due 5 December 2026, outstanding INR 245000

NOT_ON_FILE_FOR_THIS_CUSTOMER - account balance, card details. If the customer asks about these, say in one short line that you don't have it right now and suggest the call branch or never suggest state and figure for it.`,
  )
  const [modelCards, setModelCards] = useState([true, true])
  const [runCount, setRunCount] = useState(1)

  const runModels = () => {
    setModelCards((cards) => cards.map((card) => card))
  }

  return (
    <div className="llm-page">
      <div className="llm-primary-grid">
        <div className="llm-main-fields">
          <label>
            <span>Customer says</span>
            <small>(the user turn the model must answer)</small>
            <textarea value={customerTurn} onChange={(event) => setCustomerTurn(event.target.value)} />
          </label>
          <div className="llm-quick-lines">
            <label>
              <span>Quick lines</span>
              <select defaultValue="मेरी EMI कितनी है?">
                <option>मेरी EMI कितनी है?</option>
                <option>Account EMI due date</option>
                <option>Outstanding loan amount</option>
              </select>
            </label>
            <label>
              <span>Customer data (grounding)</span>
              <select defaultValue="EMI due">
                <option>EMI due</option>
                <option>Loan details</option>
              </select>
            </label>
            <label>
              <span>Speak replies with</span>
              <select defaultValue="don't speak">
                <option>don't speak</option>
                <option>Hindi</option>
                <option>English</option>
              </select>
            </label>
          </div>
          <label>
            <span>Conversation so far</span>
            <small>(optional — lines starting "U:" and "A:"; must start with U)</small>
            <textarea value={conversation} onChange={(event) => setConversation(event.target.value)} />
          </label>
        </div>
        <label className="llm-account-data">
          <span>Account data block sent to the model</span>
          <small>(editable)</small>
          <textarea value={customerData} onChange={(event) => setCustomerData(event.target.value)} />
        </label>
      </div>

      <div className="llm-runs">
        <label>
          <span>Runs per model</span>
          <input type="number" min={1} value={runCount} onChange={(event) => setRunCount(Number(event.target.value))} />
        </label>
        <button className="llm-run-button" type="button" onClick={runModels}><Play size={15} /> Run all models</button>
        <button className="llm-add-button" type="button" onClick={() => setModelCards((cards) => [...cards, true])}>
          <Plus size={15} /> Model
        </button>
      </div>

      <p className="llm-info">
        Each model gets Maya&apos;s real system prompt for this language. &quot;Maya guards&quot; = grounding / script / language checks used on the Sarvam path.
        &quot;Trim&quot; = Maya&apos;s short-reply backstop (max sentences / words).
      </p>

      <div className="llm-model-grid">
        {modelCards.map((_, index) => (
          index === 0 ? (
            <ModelCard
              key="maya"
              title="Maya live (Sarvam)"
              provider="Sarvam"
              model="sarvam-105b-conversations"
              providerOptions={['Sarvam']}
              modelOptions={['sarvam-105b-conversations']}
              temperature={0.5}
              mayaGuards
              trim
              status="not run yet"
              onRemove={modelCards.length > 1 ? () => setModelCards((cards) => cards.filter((__, cardIndex) => cardIndex !== index)) : undefined}
            />
          ) : (
            <ModelCard
              key={`claude-${index}`}
              title={index === 1 ? 'Claude (Maya fallback)' : `Model ${index + 1}`}
              provider="Claude (Bedrock)"
              model="anthropic.claude-haiku-4-5-20251001-v1:0"
              providerOptions={['Claude (Bedrock)', 'Sarvam']}
              modelOptions={['anthropic.claude-haiku-4-5-20251001-v1:0']}
              temperature={0.8}
              mayaGuards={false}
              trim
              status="not run yet"
              onRemove={() => setModelCards((cards) => cards.filter((__, cardIndex) => cardIndex !== index))}
            />
          )
        ))}
      </div>
    </div>
  )
}
