import React from 'react';
import { Briefcase, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface AdvisoryServicesProps {
  onOpenConsultation: (serviceName?: string) => void;
  onAskAlex: (prompt: string) => void;
}

export const AdvisoryServices: React.FC<AdvisoryServicesProps> = ({
  onOpenConsultation,
  onAskAlex,
}) => {
  const services = [
    {
      num: '01',
      title: 'Retained Board & Executive Trustee',
      focus: 'Independent Board Governance · Audit & Risk · Strategic Positioning',
      description:
        'Long-term strategic counsel for enterprise boards, executive chairs, and sovereign investment committees navigating high-stakes inflection points.',
      duration: 'Annual Mandate',
      deliverables: ['Quarterly Board Oversight', 'Executive Succession Strategy', 'Enterprise Risk Matrices'],
    },
    {
      num: '02',
      title: 'Enterprise AI Strategic Sprint',
      focus: 'Architecture Blueprint · Proprietary Data Moats · Capital Justification',
      description:
        'A focused 6-to-8 week diagnostic and structural blueprint for C-suite leadership teams seeking defensible, revenue-generating AI deployment.',
      duration: '6–8 Weeks',
      deliverables: ['Architectural Readiness Audit', 'Vendor Independence Roadmap', 'Board Presentation Package'],
    },
    {
      num: '03',
      title: 'Confidential M&A & Venture Due Diligence',
      focus: 'Technical Due Diligence · Post-Merger Realization · Synergies',
      description:
        'Discreet advisory for private equity funds and corporate development teams evaluating high-valuation acquisitions and technical defensibility.',
      duration: 'Engagement-Based',
      deliverables: ['Technical Defensibility Report', 'Synergy Realization Model', 'Executive Risk Briefing'],
    },
  ];

  return (
    <section id="advisory" className="py-16 lg:py-24 border-t border-stone-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 mb-2">
            <span>Engagement Models</span>
            <span aria-hidden="true">·</span>
            <span>Private Advisory</span>
            <span aria-hidden="true">·</span>
            <span>Confidential</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-stone-900 tracking-tight mb-4" style={{ textWrap: 'balance' }}>
            Advisory Practices & Retainers
          </h2>
          <p className="text-stone-600 font-light text-base sm:text-lg leading-relaxed">
            Robert accepts a strictly limited number of advisory appointments each fiscal year to ensure uncompromising depth of counsel and executive focus.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-6">
          {services.map((svc) => (
            <div
              key={svc.num}
              className="p-8 sm:p-10 rounded-2xl border border-stone-200/90 hover:border-stone-400/90 transition-all bg-[#FAF9F5]/40 hover:bg-[#FAF9F5] flex flex-col lg:flex-row lg:items-center justify-between gap-8"
            >
              <div className="lg:max-w-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-serif italic text-xl text-stone-400">{svc.num}.</span>
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-stone-900">
                    {svc.title}
                  </h3>
                </div>

                <div className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                  {svc.focus}
                </div>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
                  {svc.description}
                </p>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 pt-2 text-xs text-stone-500">
                  <span className="font-medium text-stone-700">Key Outcomes:</span>
                  {svc.deliverables.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1">
                      <span aria-hidden="true">·</span>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
                <div className="text-xs font-mono text-stone-500 tabular-nums">
                  {svc.duration}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAskAlex(`Tell me about Robert's ${svc.title} engagement model.`)}
                    className="px-3.5 py-2 text-xs rounded-lg border border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                  >
                    Ask Alex
                  </button>
                  <button
                    onClick={() => onOpenConsultation(svc.title)}
                    className="px-4 py-2 text-xs rounded-lg bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Request Briefing</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Executive Attribution Quote */}
        <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-[#FAF9F5] border border-stone-200/80">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <blockquote className="font-serif italic text-lg sm:text-xl text-stone-800 leading-relaxed">
              &ldquo;Robert brought an unprecedented level of calm rigor to our boardroom when restructuring our enterprise AI initiatives. His counsel removed the speculative fog and replaced it with measurable execution.&rdquo;
            </blockquote>
            <div className="text-xs uppercase tracking-widest text-stone-600 font-medium">
              Evelyn Vance · Managing Partner · Meridian Capital Syndicate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
