import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
    timeout: 10000,
  },
});

const hasValidGeminiKey = (): boolean => {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key !== 'MY_GEMINI_API_KEY' && key.trim().length > 10);
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voice = 'Fenrir' } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  if (!hasValidGeminiKey()) {
    return res.status(200).json({
      available: false,
      useWebSpeech: true,
      message: 'No external Gemini API key. Synthesizing voice with deep baritone Web Speech API.',
    });
  }

  try {
    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 500),
              // @ts-ignore
              speechMetadata: {
                style: 'Deep, resonant, sophisticated male voice with an articulate American accent',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return res.json({
        available: true,
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
        voiceName: voice,
      });
    }

    return res.json({
      available: false,
      useWebSpeech: true,
    });
  } catch (error: any) {
    console.warn('TTS error in serverless handler:', error?.message);
    return res.status(200).json({
      available: false,
      useWebSpeech: true,
      error: error?.message,
    });
  }
}
