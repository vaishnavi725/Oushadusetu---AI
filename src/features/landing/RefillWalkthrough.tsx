import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/format';
import { RefillConsole } from './RefillConsole';
import { REFILL_SCENES } from './refill-scenes';

export function RefillWalkthrough() {
  const [index, setIndex] = useState(1);
  const [approved, setApproved] = useState(false);
  const scene = REFILL_SCENES[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setIndex((current) => Math.min(REFILL_SCENES.length - 1, current + 1));
      if (event.key === 'ArrowLeft') setIndex((current) => Math.max(0, current - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const approve = () => {
    setApproved(true);
    setIndex(2);
    window.setTimeout(() => setApproved(false), 2800);
  };

  return (
    <section id="platform" className="relative scroll-mt-24 border-t border-slate-200 bg-white py-24 text-slate-900">
      <div className="mx-auto grid max-w-[1280px] items-start gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-800">The refill, as a state machine</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Pending is not an answer.
          </h2>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-slate-600">
            Walk one prescription from request to resolution. Each state names the blocker, the owner, and the next action. AI prepares the work. A person still approves the clinical decision.
          </p>

          <ol className="mt-8 space-y-2">
            {REFILL_SCENES.map((item, itemIndex) => {
              const active = itemIndex === index;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors',
                      active ? 'border-teal-200 bg-teal-50/70' : 'border-transparent hover:bg-slate-50',
                    )}
                  >
                    <span className={cn('grid size-7 shrink-0 place-items-center rounded-full font-mono text-[11px]', active ? 'bg-teal-800 text-white' : 'bg-slate-100 text-slate-500')}>
                      {itemIndex + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium text-slate-950">{item.state}</span>
                      <span className="block truncate text-[12px] text-slate-500">{item.blocker}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-4 text-[12px] text-slate-500">Arrow keys move between states.</p>
        </div>

        <div>
          <RefillConsole scene={scene} />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {scene.human ? (
              <button
                type="button"
                onClick={approve}
                className="inline-flex items-center gap-2 rounded-full bg-teal-800 px-5 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Approve as {scene.owner}
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIndex((current) => (current + 1) % REFILL_SCENES.length)}
                className="inline-flex items-center gap-2 rounded-full bg-teal-800 px-5 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Advance this refill
                <ArrowRight className="size-4" />
              </button>
            )}
            <span className="text-[13px] text-slate-500">{scene.human ? 'This step stays with a clinician.' : 'Prepared automatically. Nothing is sent until a person confirms.'}</span>
          </div>

          <AnimatePresence>
            {approved && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-900"
                role="status"
              >
                <CheckCircle2 className="size-4" aria-hidden />
                Dr. Rao approved · 09:14 · written to the audit log
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
