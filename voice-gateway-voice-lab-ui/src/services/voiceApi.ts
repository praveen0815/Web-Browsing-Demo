import axios from 'axios'
import { mockVoices } from '../data/mockVoices'
import type { Voice, VoiceConfig } from '../types/voice'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_MODE = import.meta.env.VITE_VOICE_API_MODE || 'mock'
const mockEnabled = API_MODE === 'mock'

const client = axios.create({ baseURL: BASE_URL })

export const voiceApi = {
  async getVoices(): Promise<Voice[]> {
    if (mockEnabled) return mockVoices
    const { data } = await client.get('/v1/voices')
    return data.voices ?? data
  },

  async preview(voiceId: string, text: string, parameters: VoiceConfig['parameters']): Promise<Blob> {
    if (mockEnabled) {
      await new Promise((resolve) => setTimeout(resolve, 650))
      throw new Error('Mock preview: no audio service is configured. Connect the backend preview API.')
    }
    const { data } = await client.post('/v1/voices/preview', { voiceId, text, parameters }, { responseType: 'blob' })
    return data
  },

  async getConfig(): Promise<VoiceConfig | null> {
    if (mockEnabled) return null
    const { data } = await client.get('/v1/voices/config')
    return data
  },

  async saveConfig(config: VoiceConfig): Promise<VoiceConfig> {
    if (mockEnabled) {
      await new Promise((resolve) => setTimeout(resolve, 450))
      return config
    }
    const { data } = await client.put('/v1/voices/config', config)
    return data
  },
}
