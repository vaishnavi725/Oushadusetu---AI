import { motion } from 'motion/react';
import { ShieldCheck, HeartHandshake, Stethoscope, ArrowRight, Sparkles, Building2, UserCheck, Activity } from 'lucide-react';
import { WordByWord } from './WordByWord';

export function AboutSection() {
  const pillars = [
    {
      title: 'Oushadha (Medicine)',
      description: 'Preserving uninterrupted therapy. Preventing silent lapses before patients run out of critical chronic medications.',
      icon: HeartHandshake,
      badge: 'Core Purpose',
    },
    {
      title: 'Setu (Bridge)',
      description: 'Unifying patient, clinic staff, provider, pharmacy, and insurer onto one living state machine — replacing phone tags and faxes.',
      icon: Activity,
      badge: 'Architecture',
    },
    {
      title: 'Human-in-the-Loop Gate',
      description: 'AI extracts, drafts, and triages. Licensed clinicians retain ultimate authority with step-up biometric MFA verification.',
      icon: Stethoscope,
      badge: 'Clinical Safety',
    },
  ];

  const operationalAnswers = [
    { q: 'What is happening now?', a: 'Live deterministic case state' },
    { q: 'What is missing?', a: 'Specific clinical or identity gap' },
    { q: 'What is blocking progress?', a: 'Root-cause triage rule (R1–R10)' },
    { q: 'Who can fix it?', a: 'Named owner with designated role' },
    { q: 'What should happen next?', a: 'Guided next action with urgency' },
    { q: 'Did it happen?', a: 'Immutable cryptographic audit trail' },
  ];

  return (
    <section id="about" className="relative scroll-mt-24 py-24 bg-[#FBF7F2] text-slate-900 border-t border-[#EFE7DE] overflow-hidden">
      {/* Warm Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl rounded-full bg-gradient-to-b from-[#F5E8DC]/60 via-[#F9EFE6]/40 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#F3E5D8]/50 blur-3xl" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#F3E7DC] text-teal-900 border border-[#E8D9CB] mb-4">
            <Sparkles className="size-3.5 text-teal-700" />
            About OushadhaSetu
          </div>

          <WordByWord
            text="The Operating Layer for Prescription Continuity."
            as="h2"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-slate-950 justify-center text-center"
          />

          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Traditional healthcare tools stop at a vague <span className="font-semibold text-slate-900 italic">“Pending approval”</span>. OushadhaSetu turns stuck prescriptions into an active, transparent workflow where every case has one owner, one root cause, and an accountable resolution path.
          </p>
        </div>

        {/* 3 Core Philosophical Pillars */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl bg-white/90 backdrop-blur-sm border border-[#EDE3D6] p-7 shadow-[0_10px_30px_-15px_rgba(180,140,110,0.12)] hover:shadow-[0_16px_36px_-12px_rgba(180,140,110,0.2)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-12 rounded-2xl bg-[#F6EDE2] text-teal-800 flex items-center justify-center shadow-inner">
                      <Icon className="size-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-teal-900 bg-[#F4E9DE] px-2.5 py-1 rounded-full border border-[#E9DACB]">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-950 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F2EAE0] flex items-center gap-2 text-xs font-semibold text-teal-800">
                  <span>Learn workflow impact</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Operational Breakthrough: 6 Questions Solved */}
        <div className="mt-12 rounded-3xl bg-white border border-[#EAE0D3] p-8 sm:p-12 shadow-[0_14px_40px_-20px_rgba(160,120,90,0.15)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-mono uppercase tracking-widest text-teal-800 font-bold">
                Operational Discipline
              </span>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-slate-950">
                Answering What “Pending” Never Could
              </h3>
              <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
                When a refill gets stuck, minutes matter. Instead of chasing staff through back-and-forth faxes or phone trees, OushadhaSetu answers every operational question in real time.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-stone-700">
                  <div className="size-6 rounded-full bg-emerald-100 text-emerald-800 grid place-items-center shrink-0">
                    <UserCheck className="size-3.5" />
                  </div>
                  <span>Deterministic blocker analysis (R1–R10 engine)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-700">
                  <div className="size-6 rounded-full bg-teal-100 text-teal-800 grid place-items-center shrink-0">
                    <ShieldCheck className="size-3.5" />
                  </div>
                  <span>Step-up MFA clinical authorization (AAL2)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-700">
                  <div className="size-6 rounded-full bg-sky-100 text-sky-800 grid place-items-center shrink-0">
                    <Building2 className="size-3.5" />
                  </div>
                  <span>Zero patient login hurdle — tokenized status tracking</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {operationalAnswers.map((item, i) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-[#EDE4D8] bg-[#FAF6F1] p-4 transition-colors hover:bg-white hover:border-teal-300"
                >
                  <p className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-medium">
                    Question 0{i + 1}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {item.q}
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-teal-800">
                    ↳ {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
