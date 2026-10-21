import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { VoiceChamber } from './components/VoiceChamber';
import { ExecutiveDossier } from './components/ExecutiveDossier';
import { AdvisoryServices } from './components/AdvisoryServices';
import { ConsultationModal } from './components/ConsultationModal';
import { AudioSettingsDrawer } from './components/AudioSettingsDrawer';
import { Footer } from './components/Footer';
import { VoiceSettings } from './types';
import { CheckCircle2, Sliders, Volume2 } from 'lucide-react';

export default function App() {
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    engine: 'gemini',
    voiceName: 'Fenrir',
    pitch: 0.82,
    rate: 0.94,
    autoSpeak: true,
    handsFree: false,
  });

  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationTopic, setConsultationTopic] = useState('Strategic Board Advisory');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleOpenConsultation = (topic?: string) => {
    if (topic) setConsultationTopic(topic);
    setIsConsultationOpen(true);
  };

  const handleUpdateSettings = (updated: Partial<VoiceSettings>) => {
    setVoiceSettings((prev) => ({ ...prev, ...updated }));
  };

  const handleAskAlex = (prompt: string) => {
    const chamberElement = document.getElementById('voice-chamber');
    if (chamberElement) {
      chamberElement.scrollIntoView({ behavior: 'smooth' });
    }
    // We can also trigger speech input through the chamber UI
    setNotice(`Forwarded inquiry to Alex: "${prompt}"`);
    setTimeout(() => setNotice(null), 4000);
  };

  const scrollToVoice = () => {
    const el = document.getElementById('voice-chamber');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900 font-sans flex flex-col selection:bg-stone-900 selection:text-white">
      {/* Top Bar Navigation */}
      <TopNav
        onOpenVoice={scrollToVoice}
        onOpenConsultation={() => handleOpenConsultation('Executive Representation')}
        isVoiceActive={false}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Floating Quick Settings button on bottom right */}
        <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Configure Alex Voice Audio"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-md text-stone-800 hover:text-stone-950 hover:border-stone-900 text-xs font-medium transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-stone-700" />
            <span className="hidden sm:inline">Voice Engine:</span>
            <span className="font-serif italic text-stone-900">
              {voiceSettings.engine === 'gemini' ? 'Fenrir (Deep Male)' : 'System Voice'}
            </span>
          </button>
        </div>

        {/* Global Floating Toast */}
        {notice && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-stone-100 text-xs py-2.5 px-4 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in border border-stone-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-stone-300" />
            <span>{notice}</span>
          </div>
        )}

        {/* Hero & Interactive Voice Chamber */}
        <VoiceChamber
          onOpenConsultation={handleOpenConsultation}
          voiceSettings={voiceSettings}
          onUpdateSettings={handleUpdateSettings}
        />

        {/* Executive Dossier & Strategic Pillars */}
        <ExecutiveDossier
          onOpenConsultation={handleOpenConsultation}
          onAskAlex={handleAskAlex}
        />

        {/* Advisory Services & Practice Models */}
        <AdvisoryServices
          onOpenConsultation={handleOpenConsultation}
          onAskAlex={handleAskAlex}
        />
      </main>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        initialTopic={consultationTopic}
        onSuccessNotice={(text) => {
          setNotice(text);
          setTimeout(() => setNotice(null), 5000);
        }}
      />

      {/* Audio Settings Drawer */}
      <AudioSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={voiceSettings}
        onUpdate={handleUpdateSettings}
      />

      {/* Professional Footer */}
      <Footer
        onOpenConsultation={() => handleOpenConsultation('Direct Executive Briefing')}
        onOpenVoice={scrollToVoice}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
    </div>
  );
}
