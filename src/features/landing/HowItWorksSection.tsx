import { motion } from 'motion/react';
import {
  Activity,
  Bot,
  CheckCircle2,
  Send,
  Stethoscope,
} from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Silent Lapse Prediction',
    icon: Activity,
    badge: 'Proactive Signal',
    description:
      'Continuous telemetry tracks fill patterns, days-of-supply remaining, and historical lag to detect imminent lapses 7-14 days before medication runs out.',
    tag: 'ML Adherence Engine',
  },
  {
    number: '02',
    title: 'Multi-Agent Clinical Intake',
    icon: Bot,
    badge: 'AI Pre-Assessment',
    description:
      'Specialized AI agents pull EHR context, review pending lab requirements (e.g. A1c, lipid panel, serum creatinine), and verify formulary rules in seconds.',
    tag: 'Autonomous Verification',
  },
  {
    number: '03',
    title: 'Human-in-the-Loop Approval',
    icon: Stethoscope,
    badge: 'Clinician Safety',
    description:
      'Prescribers receive a concise, explainable clinical dossier with the recommended action. One tap approves new prescriptions without fax or phone tag.',
    tag: 'Licensed MD Sign-off',
  },
  {
    number: '04',
    title: 'Closed-Loop Fulfillment',
    icon: Send,
    badge: 'Pharmacy Sync',
    description:
      'Direct NCPDP / FHIR integration transmits the authorized order to the patient’s preferred pharmacy, triggering automated SMS confirmation to the patient.',
    tag: 'Zero Patient Anxiety',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200">
            <CheckCircle2 className="size-3.5 text-teal-600" />
            End-to-End Orchestration Flow
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight font-display">
            How OushadhaSetu Bridges the Refill Divide
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From algorithmic early warning to verified pharmacy dispense, four coordinated layers ensure zero patients fall through healthcare cracks.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-3xl p-6 bg-slate-50/70 border border-slate-200/70 hover:border-teal-400 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                  <span className="text-xs font-bold text-teal-700 font-mono tracking-wider">
                    STEP {step.number}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-teal-100/70 text-teal-800">
                    {step.badge}
                  </span>
                </div>

                <div className="mt-5 size-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="size-6" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                  {step.title}
                </h3>

                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="text-teal-700 font-semibold">{step.tag}</span>
                <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
