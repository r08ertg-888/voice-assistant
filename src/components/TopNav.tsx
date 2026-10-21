import React from 'react';
import { Mic, Volume2 } from 'lucide-react';

interface TopNavProps {
  onOpenVoice: () => void;
  onOpenConsultation: () => void;
  isVoiceActive: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenVoice,
  onOpenConsultation,
  isVoiceActive,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 lg:px-12 py-4">
        {/* Zone 1: Wordmark */}
        <a
          href="#"
          className="text-xl sm:text-2xl font-serif tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
        >
          Robert Gammer
        </a>

        {/* Zone 2: 4-5 Clean single-line text links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <a
            href="#voice-chamber"
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Voice Chamber
          </a>
          <a
            href="#profile"
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Executive Profile
          </a>
          <a
            href="#pillars"
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Strategic Pillars
          </a>
          <a
            href="#advisory"
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Advisory Practice
          </a>
          <button
            onClick={onOpenConsultation}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Direct Inquiry
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenVoice}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              isVoiceActive
                ? 'bg-stone-900 text-stone-100 shadow-sm'
                : 'border border-stone-300 text-stone-800 hover:border-stone-900 hover:bg-stone-900 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Speak with Alex</span>
          </button>
        </div>
      </div>
    </header>
  );
};
