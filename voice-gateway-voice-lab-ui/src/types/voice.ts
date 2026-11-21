export type Gender = 'female' | 'male'
export type ModelVersion = 'Bulbul v3' | 'Bulbul v4'

export interface Voice {
  id: string
  displayName: string
  gender: Gender
  languageCode: string
  languageName: string
  model: ModelVersion
  mock?: boolean
}

export interface VoiceParameters {
  pace: number
  pitch: number
  loudness: number
  temperature: number
}

export interface VoiceConfig {
  languageCode: string
  genderFilter: 'all' | 'female' | 'male'
  voiceId: string
  model: ModelVersion
  parameters: VoiceParameters
}
