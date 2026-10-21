import React from 'react';
import { Mail, Mic, Shield } from 'lucide-react';

interface FooterProps {
  onOpenConsultation: () => void;
  onOpenVoice: () => void;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenConsultation,
  onOpenVoice,
  onOpenSettings,
}) => {
  return (
    <footer className="border-t border-stone-200/80 bg-[#FAF9F5] text-stone-700 py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-stone-200/80">
          {/* Brand & Representative Column (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="text-2xl font-serif tracking-tight text-stone-900 font-medium">
              Robert Gammer
            </div>
            <p className="text-sm text-stone-600 leading-relaxed font-light max-w-sm">
              Strategic board advisory, enterprise AI architecture, and venture stewardship. Represented in voice by Alex with deep American baritone cadence.
            </p>
            <div className="text-xs text-stone-500 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-stone-600" />
              <a
                href="mailto:R08ERTG@gmail.com"
                className="hover:text-stone-950 underline underline-offset-2 transition-colors font-mono"
              >
                R08ERTG@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Nav (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs uppercase tracking-widest text-stone-900 font-semibold">
              Advisory Mandates
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
              <li>
                <a href="#profile" className="hover:text-stone-950 transition-colors">
                  Executive Dossier
                </a>
              </li>
              <li>
                <a href="#pillars" className="hover:text-stone-950 transition-colors">
                  Strategic Pillars
                </a>
              </li>
              <li>
                <a href="#advisory" className="hover:text-stone-950 transition-colors">
                  Board & Retainer Models
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenConsultation}
                  className="hover:text-stone-950 transition-colors text-left cursor-pointer"
                >
                  Direct Inquiry Submission
                </button>
              </li>
            </ul>
          </div>

          {/* Alex Vocal Architecture (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs uppercase tracking-widest text-stone-900 font-semibold">
              Voice Representative System
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Alex operates as Robert Gammer&apos;s executive interface, synthesizing strategic inquiries with deep vocal resonance and confidential intake.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenVoice}
                className="text-xs px-3.5 py-1.5 rounded-lg border border-stone-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
              >
                Launch Voice Session
              </button>
              <button
                onClick={onOpenSettings}
                className="text-xs px-3.5 py-1.5 rounded-lg border border-stone-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
              >
                Audio Settings
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-light">
          <div>
            © {new Date().getFullYear()} Robert Gammer. Executive Representation by Alex.
          </div>
          <div className="flex items-center gap-4 text-stone-500">
            <span>Confidential & Proprietary</span>
            <span aria-hidden="true">·</span>
            <span>All Consultations by Appointment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
