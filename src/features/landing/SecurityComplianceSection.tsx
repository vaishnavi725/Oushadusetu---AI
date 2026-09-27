import { ShieldCheck, Lock, Stethoscope, Database, Eye } from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: 'HIPAA & HITECH Certified',
    description: 'Full business associate agreement (BAA), continuous vulnerability testing, and end-to-end encrypted protected health information (PHI).',
  },
  {
    icon: Stethoscope,
    title: 'Human-in-the-Loop Safeguards',
    description: 'AI strictly serves as decision support. Consequential changes to dosage, medication switches, or discontinuations mandate physician verification.',
  },
  {
    icon: Database,
    title: 'HL7 & FHIR R4 Ready',
    description: 'Bi-directional interoperability with Epic, Cerner, AthenaHealth, NextGen, and community pharmacy management systems.',
  },
  {
    icon: Eye,
    title: 'Immutable Audit Trail',
    description: 'Every recommendation, confidence score, stakeholder notification, and state transition is cryptographically logged for full clinical transparency.',
  },
];

export function SecurityComplianceSection() {
  return (
    <section id="about" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-1/4 size-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 size-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-teal-900/60 text-teal-300 border border-teal-700/50">
            <Lock className="size-3.5" />
            Institutional Trust &amp; Governance
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
            Built for Enterprise Healthcare Security
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Engineered from day one for hospital networks, large multispecialty practices, and high-volume pharmacy chains.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/70 hover:border-teal-500/60 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="size-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
                  <item.icon className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white font-display">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">{item.description}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-700/50 text-[11px] font-mono text-teal-400">
                Verified Compliant
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
