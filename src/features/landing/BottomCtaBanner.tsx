import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export function BottomCtaBanner() {
  return (
    <section className="relative overflow-hidden border-t border-slate-200 bg-white py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-teal-100/70 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-[1280px] px-4 text-center sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="mx-auto max-w-3xl">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-teal-800 uppercase">
            Resolution engine
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Keep every refill moving.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Turn a fragmented refill workflow into one visible path, with a named owner and a next action.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex min-w-[220px] items-center justify-center gap-2.5 rounded-full bg-teal-800 px-8 py-4 text-base font-semibold text-white transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Open the command center</span>
              <ArrowRight className="size-5" />
            </Link>
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
            >
              Request clinic access
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 text-teal-800">
              <ShieldCheck className="size-4" />
              Built for HIPAA workflows
            </span>
            <span>No EHR migration required</span>
            <span>Human approval on clinical decisions</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
