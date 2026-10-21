import React from 'react';
import { ArrowUpRight, Compass, ShieldCheck, Cpu } from 'lucide-react';

interface ExecutiveDossierProps {
  onOpenConsultation: (topic?: string) => void;
  onAskAlex: (prompt: string) => void;
}

export const ExecutiveDossier: React.FC<ExecutiveDossierProps> = ({
  onOpenConsultation,
  onAskAlex,
}) => {
  return (
    <section id="profile" className="py-16 lg:py-24 border-t border-stone-200/80 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 mb-2">
              <span>Executive Dossier</span>
              <span aria-hidden="true">·</span>
              <span>Leadership Profile</span>
              <span aria-hidden="true">·</span>
              <span>Advisory Practice</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-900 tracking-tight" style={{ textWrap: 'balance' }}>
              Strategic Vision & Stewardship
            </h2>
          </div>
          <div className="text-sm text-stone-600 max-w-md font-light leading-relaxed">
            Represented by Alex for boardroom consultations, strategic capital syndicates, and executive appointments.
          </div>
        </div>

        {/* Split Hero: Left Column Profile & Philosophy, Right Column Editorial Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-20">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <blockquote className="text-2xl sm:text-3xl font-serif italic text-stone-900 leading-snug">
                &ldquo;Discipline precedes scale. True executive advantage is not found in algorithmic noise, but in architectural clarity and enduring governance.&rdquo;
              </blockquote>

              <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-light">
                Robert Gammer serves as an executive advisor, institutional trustee, and venture strategist. Over more than two decades, Robert has guided corporate executive committees, private equity partners, and sovereign tech initiatives through structural transitions—aligning enterprise strategy with defensible technological leverage.
              </p>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                His advisory engagements focus on critical pivot points: the governance of sovereign AI infrastructures, capital structuring under macroeconomic volatility, and the stewardship of leadership teams navigating high-stakes industry transformations.
              </p>
            </div>

            {/* Quick Voice Inquiries regarding Robert */}
            <div className="pt-6 border-t border-stone-200">
              <div className="text-xs uppercase tracking-wider text-stone-500 mb-3 font-medium">
                Ask Alex to Elaborate
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onAskAlex("Explain Robert Gammer's philosophy on discipline preceding scale.")}
                  className="text-xs px-3.5 py-2 rounded-lg border border-stone-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer text-stone-800"
                >
                  Philosophy of Scale & Discipline →
                </button>
                <button
                  onClick={() => onAskAlex("What is Robert's approach to sovereign enterprise AI governance?")}
                  className="text-xs px-3.5 py-2 rounded-lg border border-stone-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer text-stone-800"
                >
                  Sovereign AI Governance →
                </button>
              </div>
            </div>
          </div>

          {/* Right Column Portrait (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden bg-stone-200 border border-stone-300/80 shadow-sm aspect-4/3 lg:aspect-auto lg:h-full min-h-[380px]">
              <img
                src="/src/assets/images/robert_gammer_portrait_1792572392082.jpg"
                alt="Robert Gammer - Executive Portrait"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Resilient zero-broken-image fallback
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.classList.add('flex', 'items-center', 'justify-center', 'p-8', 'text-center');
                    parent.innerHTML = `
                      <div class="space-y-3">
                        <div class="w-16 h-16 rounded-full bg-stone-300 mx-auto flex items-center justify-center font-serif text-2xl font-bold text-stone-700">RG</div>
                        <h4 class="font-serif text-xl font-semibold text-stone-900">Robert Gammer</h4>
                        <p class="text-xs text-stone-500 max-w-xs">Executive Strategic Advisor · Institutional Leadership</p>
                      </div>
                    `;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 text-white pointer-events-none">
                <div className="text-lg font-serif font-medium">Robert Gammer</div>
                <div className="text-xs text-stone-300 font-light">Senior Executive & Strategic Advisor</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Strategic Pillars */}
        <div id="pillars" className="pt-8">
          <div className="text-xs uppercase tracking-widest text-stone-500 mb-8 font-medium">
            Strategic Pillars & Mandates
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 01 */}
            <div className="p-8 rounded-2xl bg-white border border-stone-200/90 hover:border-stone-400 transition-colors shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif italic text-2xl text-stone-400">01.</span>
                  <ShieldCheck className="w-5 h-5 text-stone-700" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-3">
                  Architectural Governance
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed font-light">
                  Aligning corporate board fiduciary duties with exponential technological risks. Developing defensible frameworks for oversight, compliance, and enterprise resilience.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Board Advisory</span>
                <span className="font-mono tabular-nums">Mandate A</span>
              </div>
            </div>

            {/* Pillar 02 */}
            <div className="p-8 rounded-2xl bg-white border border-stone-200/90 hover:border-stone-400 transition-colors shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif italic text-2xl text-stone-400">02.</span>
                  <Cpu className="w-5 h-5 text-stone-700" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-3">
                  Enterprise AI Integration
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed font-light">
                  Moving past cosmetic pilot programs to deeply integrated operational intelligence. Structuring proprietary data flywheels and high-margin automated workflows.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Operational Moats</span>
                <span className="font-mono tabular-nums">Mandate B</span>
              </div>
            </div>

            {/* Pillar 03 */}
            <div className="p-8 rounded-2xl bg-white border border-stone-200/90 hover:border-stone-400 transition-colors shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif italic text-2xl text-stone-400">03.</span>
                  <Compass className="w-5 h-5 text-stone-700" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-stone-900 mb-3">
                  High-Stakes Capital Allocation
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed font-light">
                  Advising venture syndicates and sovereign funds on asymmetric bets, M&A integrations, and capital deployment where execution risk dictates return profiles.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Venture Stewardship</span>
                <span className="font-mono tabular-nums">Mandate C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
