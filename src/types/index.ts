export interface ChatMessage {
  id: string;
  sender: 'user' | 'alex';
  text: string;
  timestamp: string;
  audioBase64?: string;
  isAudioPlaying?: boolean;
}

export type VoiceStatus = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

export interface VoiceSettings {
  engine: 'gemini' | 'browser';
  voiceName: string; // 'Fenrir' | 'Charon' for Gemini, system voice for browser
  pitch: number; // 0.5 to 1.5, default 0.82 for deep tone
  rate: number; // 0.8 to 1.2, default 0.95 for measured cadence
  autoSpeak: boolean;
  handsFree: boolean;
}

export interface ConsultationForm {
  name: string;
  email: string;
  organization: string;
  topic: string;
  message: string;
  timeframe: string;
}
