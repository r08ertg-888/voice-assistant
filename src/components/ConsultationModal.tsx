import React, { useState, useEffect } from 'react';
import { X, Mic, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { ConsultationForm } from '../types';
import { getSpeechRecognition } from '../utils/audio';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  onSuccessNotice: (text: string) => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'Strategic Board Advisory',
  onSuccessNotice,
}) => {
  const [form, setForm] = useState<ConsultationForm>({
    name: '',
    email: '',
    organization: '',
    topic: initialTopic,
    message: '',
    timeframe: 'Next 2–4 Weeks',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [alexConfirmationText, setAlexConfirmationText] = useState('');

  useEffect(() => {
    if (initialTopic) {
      setForm((prev) => ({ ...prev, topic: initialTopic }));
    }
  }, [initialTopic]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStartDictation = () => {
    const recognition = getSpeechRecognition();
    if (!recognition) {
      alert('Speech recognition is not available in this browser.');
      return;
    }

    try {
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsDictating(true);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setForm((prev) => ({
          ...prev,
          message: prev.message ? `${prev.message} ${text}` : text,
        }));
        setIsDictating(false);
      };

      recognition.onerror = () => {
        setIsDictating(false);
      };

      recognition.onend = () => {
        setIsDictating(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Dictation failed to start', e);
      setIsDictating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(true);
        setAlexConfirmationText(
          data.alexConfirmation ||
            `Thank you, ${form.name}. Your inquiry has been forwarded directly to Robert Gammer at R08ERTG@gmail.com.`
        );
        onSuccessNotice(data.alexConfirmation);
      }
    } catch (err) {
      console.error('Failed to submit consultation', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-stone-200 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-900">
              <CheckCircle2 className="w-8 h-8 text-stone-900" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-stone-900">
              Consultation Registered
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
              {alexConfirmationText}
            </p>
            <div className="text-xs text-stone-400 pt-2">
              Direct representative channel · Alex on behalf of Robert Gammer
            </div>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  onClose();
                }}
                className="px-6 py-2.5 text-xs font-medium uppercase tracking-wider bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Return to Chamber
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 mb-2">
                <span>Direct Executive Inquiry</span>
                <span aria-hidden="true">·</span>
                <span>Confidential</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900">
                Request Advisory Consultation
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 font-light">
                Transmitted directly to Robert Gammer. Alex can also transcribe your voice dictation below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. marcus@syndicate.com"
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Organization / Entity
                  </label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    placeholder="e.g. Meridian Capital"
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Target Timeframe
                  </label>
                  <select
                    value={form.timeframe}
                    onChange={(e) => setForm({ ...form, timeframe: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                  >
                    <option>Immediate / Next 7 Days</option>
                    <option>Next 2–4 Weeks</option>
                    <option>Next Fiscal Quarter</option>
                    <option>Exploratory / Unscheduled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Advisory Focus Area
                </label>
                <input
                  type="text"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  placeholder="e.g. Enterprise AI Strategy, Board Seat, Due Diligence"
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-stone-700">
                    Consultation Brief & Context *
                  </label>
                  <button
                    type="button"
                    onClick={handleStartDictation}
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                      isDictating
                        ? 'border-amber-600 bg-amber-50 text-amber-800 animate-pulse'
                        : 'border-stone-300 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isDictating ? 'Listening...' : 'Dictate by Voice'}</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Summarize the core objectives, institutional context, or topics for Robert's review..."
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl p-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-900 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  Transmitted to: <span className="font-mono">R08ERTG@gmail.com</span>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-medium uppercase tracking-wider bg-stone-900 hover:bg-stone-800 text-white rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Brief</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
