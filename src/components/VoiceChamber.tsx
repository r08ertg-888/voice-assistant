import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sliders,
  Send,
  MessageSquare,
  Sparkles,
  Check,
} from 'lucide-react';
import { ChatMessage, VoiceStatus, VoiceSettings } from '../types';
import { VoiceVisualizer } from './VoiceVisualizer';
import {
  playWavBase64,
  speakWebSpeech,
  stopAllPlayback,
  getSpeechRecognition,
} from '../utils/audio';

interface VoiceChamberProps {
  onOpenConsultation: (initialTopic?: string) => void;
  voiceSettings: VoiceSettings;
  onUpdateSettings: (settings: Partial<VoiceSettings>) => void;
}

const DEFAULT_SUGGESTIONS = [
  "Brief me on Robert Gammer's background and leadership philosophy.",
  "What is Robert's strategic approach to Enterprise AI governance?",
  "How does Robert structure private board advisory engagements?",
  "I would like to arrange a strategic consultation with Robert.",
];

export const VoiceChamber: React.FC<VoiceChamberProps> = ({
  onOpenConsultation,
  voiceSettings,
  onUpdateSettings,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'alex-welcome',
      sender: 'alex',
      text: "Good day. I am Alex, executive representative for Robert Gammer. I speak on Robert's behalf regarding his strategic advisory practice, enterprise AI architectures, and corporate board stewardship. How may I assist your inquiry today?",
      timestamp: 'Just now',
    },
  ]);

  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [inputText, setInputText] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(true);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const stopAudioRef = useRef<(() => void) | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    const recognition = getSpeechRecognition();
    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isListeningRef.current = true;
        setStatus('listening');
        setRecognitionError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
        if (event.results[0].isFinal) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        isListeningRef.current = false;
        setStatus('idle');
        if (event.error === 'not-allowed') {
          setRecognitionError('Microphone permission was denied. Please allow microphone access in your browser.');
        } else if (event.error !== 'no-speech') {
          setRecognitionError(`Voice input error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        if (status === 'listening') {
          setStatus('idle');
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      stopAllPlayback();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [status]);

  // Scroll transcript into view when messages change
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice playback dispatcher: uses Gemini TTS (Fenrir voice) or deep male Web Speech API
  const speakAlexResponse = async (text: string, messageId: string) => {
    if (!voiceSettings.autoSpeak) return;

    stopAllPlayback();
    setIsAudioPlaying(true);
    setStatus('speaking');
    setCurrentPlayingId(messageId);

    const onFinish = () => {
      setIsAudioPlaying(false);
      setStatus('idle');
      setCurrentPlayingId(null);
      if (voiceSettings.handsFree) {
        // Continuous hands-free listening
        setTimeout(() => startListening(), 600);
      }
    };

    if (voiceSettings.engine === 'gemini') {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voice: voiceSettings.voiceName || 'Fenrir',
          }),
        });
        const data = await res.json();

        if (data.available && data.audioBase64) {
          const stop = await playWavBase64(data.audioBase64, onFinish, () => {
            // Fallback to web speech if audio context fails
            speakWebSpeech(text, voiceSettings.pitch, voiceSettings.rate, onFinish);
          });
          stopAudioRef.current = stop;
          return;
        }
      } catch (err) {
        console.warn('Gemini TTS failed, using browser speech synthesis fallback', err);
      }
    }

    // Web Speech API deep male American voice fallback
    const stopWeb = speakWebSpeech(
      text,
      voiceSettings.pitch, // 0.82 deep tone
      voiceSettings.rate,  // 0.94 measured cadence
      onFinish,
      () => {
        setIsAudioPlaying(true);
        setStatus('speaking');
      }
    );
    stopAudioRef.current = stopWeb;
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || status === 'thinking') return;

    stopAllPlayback();
    setInputText('');
    setRecognitionError(null);

    // Stop listening if active
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      isListeningRef.current = false;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setStatus('thinking');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: [...messages, userMsg].slice(-6),
        }),
      });

      const data = await response.json();
      const replyText = data.text || data.fallbackText || "I am at your service on behalf of Robert Gammer.";

      const alexMsg: ChatMessage = {
        id: `alex-${Date.now()}`,
        sender: 'alex',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, alexMsg]);

      // Speak Alex's response in deep male tone
      await speakAlexResponse(replyText, alexMsg.id);
    } catch (err) {
      console.error('Chat request failed:', err);
      const fallbackMsg: ChatMessage = {
        id: `alex-err-${Date.now()}`,
        sender: 'alex',
        text: "On Robert's behalf, I invite you to leave a direct consultation inquiry or inquire regarding his governance advisory focus.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setStatus('idle');
    }
  };

  const startListening = () => {
    stopAllPlayback();
    if (!recognitionRef.current) {
      setRecognitionError(
        'Speech recognition is not supported in this browser. You can type your question in the text bar below.'
      );
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (e: any) {
      console.warn('Speech recognition restart issue:', e);
      try {
        recognitionRef.current.abort();
        setTimeout(() => recognitionRef.current?.start(), 150);
      } catch {}
    }
  };

  const toggleListening = () => {
    if (status === 'listening' || isListeningRef.current) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      isListeningRef.current = false;
      setStatus('idle');
    } else {
      startListening();
    }
  };

  const handleReplayLast = () => {
    const lastAlexMsg = [...messages].reverse().find((m) => m.sender === 'alex');
    if (lastAlexMsg) {
      speakAlexResponse(lastAlexMsg.text, lastAlexMsg.id);
    }
  };

  const handleInterrupt = () => {
    stopAllPlayback();
    setIsAudioPlaying(false);
    setStatus('idle');
    setCurrentPlayingId(null);
  };

  return (
    <section id="voice-chamber" className="py-12 lg:py-20 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-500 mb-3">
          <span>Executive Representation</span>
          <span aria-hidden="true">·</span>
          <span>Voice Chamber</span>
          <span aria-hidden="true">·</span>
          <span>English (US)</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-stone-900 mb-4" style={{ textWrap: 'balance' }}>
          Meet Alex, Voice Representative for Robert Gammer
        </h1>
        <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
          Speaking in a deep, measured American baritone with strategic clarity.
          Inquire regarding Robert&apos;s corporate governance advisory, enterprise AI stewardship, or arrange a private discussion.
        </p>
      </div>

      {/* Main Chamber Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center Acoustic Stage (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/90 p-8 sm:p-10 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
          {/* Subtle acoustic watermark badge */}
          <div className="w-full flex items-center justify-between text-xs text-stone-500 mb-2 pb-4 border-b border-stone-100">
            <span className="font-serif italic text-sm text-stone-800">Alex · Baritone Vocal Profile</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="tabular-nums font-mono">24kHz Audio</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-800 font-medium">Deep Male Pitch</span>
            </div>
          </div>

          {/* Voice Visualizer Core */}
          <div className="my-2 relative">
            <VoiceVisualizer status={status} isAudioPlaying={isAudioPlaying} />

            {/* Central status prompt */}
            <div className="mt-2 text-xs tracking-wide uppercase font-medium">
              {status === 'speaking' || isAudioPlaying ? (
                <span className="text-stone-900">Alex Speaking · American Baritone</span>
              ) : status === 'listening' ? (
                <span className="text-amber-800 font-semibold animate-pulse">Listening... Speak now</span>
              ) : status === 'thinking' ? (
                <span className="text-stone-600">Formulating Response...</span>
              ) : (
                <span className="text-stone-500">Voice Chamber Ready</span>
              )}
            </div>
          </div>

          {/* Primary Voice Action Button */}
          <div className="mt-6 flex flex-col items-center gap-4 w-full">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleListening}
                aria-label={status === 'listening' ? 'Stop Listening' : 'Speak to Alex'}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
                  status === 'listening'
                    ? 'bg-amber-800 text-white ring-8 ring-amber-800/20 scale-105'
                    : isAudioPlaying
                    ? 'bg-stone-900 text-white ring-4 ring-stone-900/10'
                    : 'bg-stone-900 text-stone-50 hover:bg-stone-800 hover:scale-102'
                }`}
              >
                {status === 'listening' ? (
                  <MicOff className="w-7 h-7 sm:w-8 sm:h-8" />
                ) : (
                  <Mic className="w-7 h-7 sm:w-8 sm:h-8" />
                )}
              </button>

              {/* Stop / Replay secondary buttons */}
              {isAudioPlaying && (
                <button
                  onClick={handleInterrupt}
                  title="Pause / Interrupt Alex"
                  className="w-11 h-11 rounded-full border border-stone-300 text-stone-700 hover:border-stone-900 hover:text-stone-950 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <VolumeX className="w-5 h-5" />
                </button>
              )}

              {!isAudioPlaying && messages.some((m) => m.sender === 'alex') && (
                <button
                  onClick={handleReplayLast}
                  title="Replay Alex's last voice response"
                  className="w-11 h-11 rounded-full border border-stone-200 text-stone-600 hover:border-stone-800 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-xs text-stone-500">
              {status === 'listening'
                ? 'Listening to your microphone... Click again to send.'
                : 'Click the microphone to speak, or use the conversation starters below.'}
            </p>

            {recognitionError && (
              <div className="w-full text-xs text-red-700 bg-red-50/80 border border-red-200/60 rounded-lg p-3 text-left">
                {recognitionError}
              </div>
            )}
          </div>

          {/* Quick Voice Starters */}
          <div className="mt-8 pt-6 border-t border-stone-100 w-full text-left">
            <div className="text-xs uppercase tracking-wider text-stone-500 mb-3 font-medium">
              Curated Voice Inquiries
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEFAULT_SUGGESTIONS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-left text-xs p-3 rounded-xl border border-stone-200/80 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-100/60 transition-all text-stone-800 cursor-pointer"
                >
                  <span className="font-serif italic text-stone-400 mr-1.5">{`0${idx + 1}.`}</span>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right / Transcript & Text Channel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200/90 shadow-xs flex flex-col h-[580px] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-stone-700" />
              <span className="text-sm font-serif font-semibold text-stone-900">
                Auditory Transcript
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span className="tabular-nums font-mono">{messages.length}</span>
              <span>turns</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-[11px] text-stone-500">
                  <span className="font-medium text-stone-800">
                    {msg.sender === 'user' ? 'You' : 'Alex'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-mono">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl max-w-[90%] text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-stone-900 text-stone-50 rounded-br-xs'
                      : 'bg-stone-100/80 text-stone-900 border border-stone-200/60 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Inline audio replay for Alex messages */}
                  {msg.sender === 'alex' && (
                    <div className="mt-2.5 pt-2 border-t border-stone-200/50 flex items-center justify-between text-xs">
                      <button
                        onClick={() => speakAlexResponse(msg.text, msg.id)}
                        className="inline-flex items-center gap-1.5 text-stone-700 hover:text-stone-950 font-medium cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{currentPlayingId === msg.id ? 'Playing Voice...' : 'Listen in Baritone'}</span>
                      </button>

                      {msg.text.toLowerCase().includes('consult') && (
                        <button
                          onClick={() => onOpenConsultation('Executive Advisory Discussion')}
                          className="text-stone-900 underline underline-offset-2 hover:opacity-80 font-medium cursor-pointer"
                        >
                          Book consultation →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>

          {/* Fallback Text Input Bar */}
          <div className="p-4 border-t border-stone-200/80 bg-stone-50/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Alex a question or type voice input..."
                className="flex-1 bg-white border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || status === 'thinking'}
                aria-label="Send message"
                className="bg-stone-900 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-800 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
