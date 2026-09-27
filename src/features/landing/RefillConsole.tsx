import { motion } from 'motion/react';
import { Check, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/format';
import type { RefillScene } from './refill-scenes';

const priorityTone = {
  Critical: 'bg-rose-50 text-rose-700 ring-rose-200',
  Watch: 'bg-amber-50 text-amber-800 ring-amber-200',
  Clear: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
} as const;

export function RefillConsole({
  scene,
  compact = false,
  onPick,
  scenes,
  activeIndex = 0,
}: {
  scene: RefillScene;
  compact?: boolean;
  scenes?: { id: string; state: string }[];
  activeIndex?: number;
  onPick?: (index: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1" aria-hidden>
            <span className="size-2 rounded-full bg-slate-200" />
            <span className="size-2 rounded-full bg-slate-200" />
            <span className="size-2 rounded-full bg-slate-200" />
          </span>
          <span className="text-[12px] font-medium tracking-tight text-slate-600">Command center</span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-teal-700 uppercase">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-600/40" />
            <span className="relative size-1.5 rounded-full bg-teal-600" />
          </span>
          Live
        </span>
      </div>

      <div className={cn('px-4 sm:px-5', compact ? 'py-4' : 'py-5')}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
              {scene.caseId} · {scene.lane}
            </p>
            <motion.h3
              key={scene.state}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn('mt-1 font-display font-semibold tracking-tight text-slate-950', compact ? 'text-[22px]' : 'text-[26px]')}
            >
              {scene.state}
            </motion.h3>
            <p className="mt-1 text-[13px] text-slate-500">
              {scene.med}
              <span className="mx-1.5 text-slate-300">/</span>
              {scene.owner}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1', priorityTone[scene.priority])}>{scene.priority}</span>
            <Confidence value={scene.confidence} />
          </div>
        </div>

        <dl className={cn('grid gap-2', compact ? 'mt-4' : 'mt-5 sm:grid-cols-3')}>
          <Fact label="What is blocking" value={scene.blocker} />
          <Fact label="What is missing" value={scene.missing} />
          <Fact label="Who acts next" value={`${scene.ownerRole} · ${scene.next}`} accent />
        </dl>

        {!compact && (
          <ul className="mt-4 space-y-1.5">
            {scene.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-[13px] leading-snug text-slate-600">
                <Check className="mt-0.5 size-3.5 shrink-0 text-teal-700" aria-hidden />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        )}

        <ol className="mt-4 flex items-center gap-1">
          {scene.timeline.map((event, i) => (
            <li key={`${event.label}-${i}`} className="min-w-0 flex-1">
              <div className={cn('h-1 rounded-full', event.done ? 'bg-teal-600' : 'bg-slate-200')} />
              <p className="mt-1.5 truncate text-[10px] text-slate-500">
                <span className="font-mono text-slate-400">{event.time}</span> {event.label}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {scenes && onPick && (
        <div className="flex flex-wrap gap-1 border-t border-slate-200 px-3 py-2.5">
          {scenes.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onPick(index)}
              aria-pressed={index === activeIndex}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors',
                index === activeIndex ? 'bg-teal-800 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              {item.state}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2.5 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-teal-700" aria-hidden />
          {scene.human ? 'Waiting for a human decision' : 'AI can prepare the next step'}
        </span>
        <span className="font-mono">{scene.days === 0 ? 'Opened today' : `${scene.days}d waiting`}</span>
      </div>
    </div>
  );
}

function Fact({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
      <div className={cn('rounded-xl px-3 py-2.5', accent ? 'bg-teal-50 ring-1 ring-teal-200' : 'bg-slate-50 ring-1 ring-slate-200')}>
      <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">{label}</dt>
      <dd className={cn('mt-1 text-[13px] leading-snug', accent ? 'text-teal-900' : 'text-slate-800')}>{value}</dd>
    </div>
  );
}

function Confidence({ value }: { value: number }) {
  return (
    <div
      className="grid size-12 place-items-center rounded-full"
      style={{ background: `conic-gradient(#0f766e ${value * 3.6}deg, #e2e8f0 0deg)` }}
      aria-label={`${value} percent confidence`}
    >
      <span className="grid size-9 place-items-center rounded-full bg-white font-mono text-[10px] text-teal-900">{value}</span>
    </div>
  );
}
