import { motion } from 'motion/react';
import { Award, GraduationCap, ExternalLink } from 'lucide-react';
import { WordByWord } from './WordByWord';

export function NcetSection() {
  return (
    <section className="py-20 bg-[#07111F] text-white border-t border-white/10 relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest bg-white/5 border border-white/10 text-teal-300 mb-5">
            <GraduationCap className="size-4 text-teal-400" />
            <span>Academic Research &amp; Innovation</span>
          </div>

          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
            BUILT AT
          </p>

          <WordByWord
            text="Nagarjuna College of Engineering & Technology (NCET)"
            as="h2"
            className="mt-3 text-2xl sm:text-3xl font-bold font-display text-slate-100 justify-center text-center"
            delay={0.1}
          />

          <WordByWord
            text="Best Engineering College in Bangalore | NAAC A+ Accredited"
            as="p"
            className="mt-3 text-sm sm:text-base font-medium text-teal-300/90 justify-center text-center"
            delay={0.3}
          />

          <p className="mt-4 text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            Engineered as an autonomous clinical workflow intelligence platform, combining multi-agent healthcare orchestration with zero-lapse prescription management.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-300 font-mono">
              <Award className="size-4 text-teal-400" />
              NAAC A+ Accredited Institution
            </span>
            <span>•</span>
            <span className="text-slate-400 font-mono">Bengaluru, India</span>
            <span>•</span>
            <a
              href="https://ncet.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 underline underline-offset-4 font-mono transition"
            >
              <span>ncet.co.in</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
