// Audio pipeline and voice synthesis helper for Alex

let globalAudioCtx: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;
let currentAudioElement: HTMLAudioElement | null = null;
let currentAnalyser: AnalyserNode | null = null;

export function getAudioContext(): AudioContext {
  if (!globalAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    globalAudioCtx = new AudioContextClass();
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume().catch(() => {});
  }
  return globalAudioCtx;
}

export function getAnalyser(): AnalyserNode {
  const ctx = getAudioContext();
  if (!currentAnalyser) {
    currentAnalyser = ctx.createAnalyser();
    currentAnalyser.fftSize = 256;
    currentAnalyser.smoothingTimeConstant = 0.8;
  }
  return currentAnalyser;
}

// Stop any currently playing audio
export function stopAllPlayback() {
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
    } catch {}
    currentSourceNode = null;
  }
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Play base64 WAV audio from Gemini TTS
export async function playWavBase64(
  base64Audio: string,
  onEnded?: () => void,
  onError?: (err: any) => void
): Promise<() => void> {
  stopAllPlayback();
  const ctx = getAudioContext();
  const analyser = getAnalyser();

  try {
    const binary = atob(base64Audio);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

    source.connect(analyser);
    analyser.connect(ctx.destination);

    currentSourceNode = source;

    source.onended = () => {
      if (currentSourceNode === source) {
        currentSourceNode = null;
      }
      onEnded?.();
    };

    source.start(0);

    return () => {
      try {
        source.stop();
      } catch {}
    };
  } catch (err) {
    console.warn('Web Audio decode failed, attempting HTMLAudio fallback', err);
    try {
      const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
      currentAudioElement = audio;
      audio.onended = () => {
        currentAudioElement = null;
        onEnded?.();
      };
      audio.onerror = (e) => {
        currentAudioElement = null;
        onError?.(e);
      };
      await audio.play();
      return () => {
        audio.pause();
      };
    } catch (fallbackErr) {
      onError?.(fallbackErr);
      return () => {};
    }
  }
}

// Play speech via Web Speech API with deep male American tone
export function speakWebSpeech(
  text: string,
  pitch = 0.82,
  rate = 0.94,
  onEnded?: () => void,
  onStart?: () => void
): () => void {
  stopAllPlayback();

  if (!('speechSynthesis' in window)) {
    onEnded?.();
    return () => {};
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = Math.max(0.6, Math.min(1.2, pitch)); // deep tone ~0.8
  utterance.rate = Math.max(0.7, Math.min(1.3, rate));   // measured ~0.94

  const voices = window.speechSynthesis.getVoices();

  // Look specifically for English US deep male voices
  const usMaleVoices = voices.filter((v) => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    const isEn = lang.startsWith('en-us') || lang.startsWith('en');
    const isMale = name.includes('male') || name.includes('david') || name.includes('alex') || name.includes('guy') || name.includes('aaron') || name.includes('george') || name.includes('daniel');
    return isEn && isMale;
  });

  const preferredVoice = usMaleVoices[0] || voices.find((v) => v.lang.includes('en-US')) || voices.find((v) => v.lang.startsWith('en')) || null;

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnded?.();
  };

  utterance.onerror = () => {
    onEnded?.();
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

// Web Speech Recognition support detection and constructor
export function getSpeechRecognition(): any {
  if (typeof window === 'undefined') return null;
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  return SpeechRecognition ? new SpeechRecognition() : null;
}
