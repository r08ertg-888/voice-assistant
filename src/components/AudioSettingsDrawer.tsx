import React from 'react';
import { X, Sliders, Volume2, Mic, Sparkles } from 'lucide-react';
import { VoiceSettings } from '../types';
import { speakWebSpeech } from '../utils/audio';

interface AudioSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onUpdate: (updated: Partial<VoiceSettings>) => void;
}

export const AudioSettingsDrawer: React.FC<AudioSettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdate,
}) => {
  if (!isOpen) return null;

  const testVoiceSample = () => {
    const sampleText =
      "Greetings. I am Alex, executive voice representative for Robert Gammer. I speak in a measured, deep American baritone to articulate strategic direction and governance.";
    speakWebSpeech(sampleText, settings.pitch, settings.rate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/80">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-stone-800" />
            <h3 className="font-serif font-semibold text-stone-900 text-lg">
              Alex Vocal Architecture
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs sm:text-sm">
          {/* Voice Engine */}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-2">
              Voice Synthesis Engine
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => onUpdate({ engine: 'gemini' })}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  settings.engine === 'gemini'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Gemini Studio TTS (Fenrir)
              </button>
              <button
                type="button"
                onClick={() => onUpdate({ engine: 'browser' })}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  settings.engine === 'browser'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                System Deep Male Voice
              </button>
            </div>
          </div>

          {/* Voice Character Selection for Gemini */}
          {settings.engine === 'gemini' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-2">
                Prebuilt Model Voice
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdate({ voiceName: 'Fenrir' })}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    settings.voiceName === 'Fenrir'
                      ? 'border-stone-900 bg-stone-50 font-medium text-stone-900'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <div className="font-semibold text-xs">Fenrir (Default)</div>
                  <div className="text-[11px] text-stone-500">Deep, resonant, authoritative baritone</div>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate({ voiceName: 'Charon' })}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    settings.voiceName === 'Charon'
                      ? 'border-stone-900 bg-stone-50 font-medium text-stone-900'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <div className="font-semibold text-xs">Charon</div>
                  <div className="text-[11px] text-stone-500">Deep, calm, measured cadence</div>
                </button>
              </div>
            </div>
          )}

          {/* Pitch Tuning */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-stone-700">
                Vocal Depth (Pitch)
              </label>
              <span className="text-xs font-mono tabular-nums text-stone-500">
                {settings.pitch.toFixed(2)} (Deep Male)
              </span>
            </div>
            <input
              type="range"
              min="0.65"
              max="1.1"
              step="0.02"
              value={settings.pitch}
              onChange={(e) => onUpdate({ pitch: parseFloat(e.target.value) })}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>Deep Bass (0.65)</span>
              <span>Baritone (0.82)</span>
              <span>Tenor (1.10)</span>
            </div>
          </div>

          {/* Cadence / Rate Tuning */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-stone-700">
                Speaking Cadence (Pace)
              </label>
              <span className="text-xs font-mono tabular-nums text-stone-500">
                {settings.rate.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.2"
              step="0.02"
              value={settings.rate}
              onChange={(e) => onUpdate({ rate: parseFloat(e.target.value) })}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>Measured (0.75x)</span>
              <span>Executive (0.94x)</span>
              <span>Brisk (1.20x)</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-2 space-y-3 border-t border-stone-100">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-stone-700">Auto-speak responses aloud</span>
              <input
                type="checkbox"
                checked={settings.autoSpeak}
                onChange={(e) => onUpdate({ autoSpeak: e.target.checked })}
                className="w-4 h-4 accent-stone-900 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-stone-700">Hands-free dialogue flow</span>
              <input
                type="checkbox"
                checked={settings.handsFree}
                onChange={(e) => onUpdate({ handsFree: e.target.checked })}
                className="w-4 h-4 accent-stone-900 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Test Voice Button */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={testVoiceSample}
              className="flex items-center gap-1.5 text-xs text-stone-800 hover:text-stone-950 font-medium border border-stone-300 hover:border-stone-800 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Preview Voice Sample</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
