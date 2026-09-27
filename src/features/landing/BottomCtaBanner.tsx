import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function BottomCtaBanner() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#090D16] via-[#06080E] to-[#04060A] text-white relative overflow-hidden border-t border-slate-800/80">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-[0_0_20px_rgba(34,211,238,0.2)] mb-5">
            <Zap className="size-3.5 text-cyan-400 fill-current" />
            Keep Every Refill Moving
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-slate-100 leading-tight">
            Ready to Stream Refills <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Without a Single Stalled Dose?
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate phone tag, prevent silent treatment gaps, and automate multi-stakeholder refill approvals with OushadhaSetu.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:from-cyan-300 hover:to-teal-200 shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] transition-all duration-300 hover:scale-[1.04] active:scale-[0.96] min-w-[220px]"
            >
              <span>Start the Refill Flow</span>
              <ArrowRight className="size-5" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center px-7 py-4 rounded-full text-base font-semibold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all duration-200"
            >
              Sign In to Practice Portal
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400/90">
              <ShieldCheck className="size-4" />
              HIPAA Certified &amp; BAA Guaranteed
            </span>
            <span>•</span>
            <span>Zero EHR Migration Required</span>
            <span>•</span>
            <span>Real-time FHIR Ingestion</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
