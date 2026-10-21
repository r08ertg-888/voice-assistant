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

const ALEX_SYSTEM_INSTRUCTION = `You are Alex, the executive voice representative for Robert Gammer.
Your voice persona is a deep, resonant, sophisticated male voice with an articulate American accent.
You speak on behalf of Robert Gammer with poise, calm authority, elegance, and warm discretion.

Key details about Robert Gammer:
- Identity: Distinguished senior executive, strategic advisor, board trustee, and venture leader.
- Core Focus: Enterprise AI strategy, strategic corporate positioning, organizational transformation, and venture capital stewardship.
- Guiding Philosophy: "Discipline precedes scale. Leverage clarity, build enduring value, and temper ambition with architectural rigor."
- Client Engagements: Advises institutional leadership, private equity backed enterprises, high-growth founders, and corporate boards across North America and Europe.
- Email contact: R08ERTG@gmail.com.

Speaking Rules:
1. Speak in first person as Alex representing Robert ("Robert often notes...", "On Robert's behalf, I can share...", "Robert's advisory practice focuses on...").
2. Your spoken tone is deep, measured, intellectual, and natural.
3. Keep spoken replies concise and conversational—ideally 2 to 4 sentences, perfectly suited for audio listening. Avoid markdown lists, asterisks, bullet points, or complex symbols in speech, as your output will be spoken aloud to the listener.
4. If someone wants to schedule a consultation or send a message to Robert, warmly invite them to dictate their message or use the consultation inquiry form, and reassure them that Robert reviews all inquiries directly.`;

function getKnowledgeBaseResponse(message: string): string {
  const q = (message || '').toLowerCase();
  if (q.includes('background') || q.includes('who is') || q.includes('brief') || q.includes('profile')) {
    return "Robert Gammer is a senior executive, board trustee, and strategic advisor with over two decades of institutional leadership. He advises corporate executive committees and venture syndicates on structural transformation, enterprise AI integration, and long-term capital allocation.";
  }
  if (q.includes('philosophy') || q.includes('discipline') || q.includes('scale') || q.includes('approach')) {
    return "Robert's guiding philosophy is that discipline must always precede scale. In an era saturated with algorithmic excitement, he emphasizes architectural clarity, sovereign data moats, and durable governance over vanity metrics.";
  }
  if (q.includes('ai') || q.includes('artificial intelligence') || q.includes('enterprise ai') || q.includes('tech')) {
    return "On Enterprise AI, Robert guides leadership teams past surface-level experiments into deep operational integration. His focus is on establishing proprietary data flywheels, rigorous compliance safeguards, and clear return on invested capital.";
  }
  if (q.includes('consult') || q.includes('meet') || q.includes('schedul') || q.includes('contact') || q.includes('email') || q.includes('book')) {
    return "Robert accepts a strictly limited number of advisory appointments each quarter. You may submit your inquiry brief directly through our consultation channel, and Robert reviews all confidential messages personally at R08ERTG@gmail.com.";
  }
  if (q.includes('service') || q.includes('engagement') || q.includes('retain') || q.includes('practice') || q.includes('board')) {
    return "Robert's advisory practice operates across three distinct structures: Retained Board and Executive Trustee mandates, high-impact six-to-eight week Strategic AI Sprints, and confidential M&A technical due diligence.";
  }
  return "As Robert Gammer's representative, I am here to discuss his executive advisory mandates, corporate governance perspectives, or register a consultation request on your behalf. How may I direct our discussion?";
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!hasValidGeminiKey()) {
    const text = getKnowledgeBaseResponse(message);
    return res.json({ text, alexVoice: 'Fenrir' });
  }

  try {
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-6)) {
        if (turn.sender === 'user' && turn.text) {
          contents.push({ role: 'user', parts: [{ text: turn.text }] });
        } else if (turn.sender === 'alex' && turn.text) {
          contents.push({ role: 'model', parts: [{ text: turn.text }] });
        }
      }
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: ALEX_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text?.trim() || getKnowledgeBaseResponse(message);
    return res.json({ text: replyText, alexVoice: 'Fenrir' });
  } catch (error: any) {
    console.warn('Gemini chat error in serverless handler:', error?.message);
    const replyText = getKnowledgeBaseResponse(message);
    return res.json({
      text: replyText,
      alexVoice: 'Fenrir',
      note: 'Rendered via executive representative knowledge base',
    });
  }
}
