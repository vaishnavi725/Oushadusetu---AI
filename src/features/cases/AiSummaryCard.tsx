import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Link2, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { refillService } from '@/services';
import { ApiError } from '@/services/errors';
import { Skeleton } from '@/components/ui/States';
import { cn } from '@/lib/format';

/** AI-3 provider summary: ≤ 3 bullets, each citing its source records. Plain text only; read-only aid. */
export function AiSummaryCard({ caseId, version, onSourceClick }: { caseId: string; version: number; onSourceClick?: (ref: string) => void }) {
  const q = useQuery({ queryKey: ['ai', 'summary', caseId, version], queryFn: () => refillService.getCaseSummary(caseId), retry: false, staleTime: 5 * 60_000 });
  const [feedback, setFeedback] = useState<'accepted' | 'rejected' | null>(null);
  const vote = (o: 'accepted' | 'rejected') => {
    if (!q.data) return;
    setFeedback(o);
    void refillService.recordAiOutcome(q.data.suggestionId, o);
  };
  return (
    <section aria-labelledby="ai-summary" className="relative overflow-hidden rounded-[var(--radius-card)] border border-cyan-500/30 bg-[#06245A]/90 backdrop-blur-md p-5 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <h3 id="ai-summary" className="flex items-center gap-2 text-[16px] font-bold text-[#F5FAFF]">
          <Sparkles className="size-4 text-[#00D9FF]" aria-hidden /> Case summary
        </h3>
        <span className="rounded-full bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-0.5 text-[11px] font-bold text-[#00D9FF]">{q.data?.mock ? 'Demo AI (mock)' : 'AI'}</span>
      </div>
      {q.isLoading && (
        <div className="mt-3 space-y-2" aria-busy>
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
          <Skeleton className="h-3.5 w-4/6" />
        </div>
      )}
      {q.isError && (
        <p className="mt-3 text-sm text-[#B8C7D9]">
          Summary unavailable{q.error instanceof ApiError && q.error.code === 'AI_UNAVAILABLE' ? ' — AI assist is offline' : ''}. Use the records below; nothing is blocked.
        </p>
      )}
      {q.data && (
        <>
          <ul className="mt-3 space-y-2.5">
            {q.data.bullets.map((b, i) => (
              <motion.li key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex gap-2.5 text-[14.5px] leading-relaxed text-[#F5FAFF]">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]" aria-hidden />
                <span>
                  {b.text}{' '}
                  {b.sourceRefs.map((s) => (
                    <button
                      key={s.ref}
                      type="button"
                      onClick={() => onSourceClick?.(s.ref)}
                      className="ml-0.5 inline-flex items-center gap-1 rounded bg-[#03132F] border border-cyan-500/40 px-2 py-0.5 align-middle text-[11.5px] font-bold text-[#00D9FF] hover:bg-[#06245A]"
                      title={`Source: ${s.ref}`}
                    >
                      <Link2 className="size-3" aria-hidden />
                      {s.label}
                    </button>
                  ))}
                </span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-cyan-500/20 pt-3">
            <p className="text-[12px] text-[#B8C7D9]">Suggestion only — decide from the source records. {q.data.promptVersion}</p>
            <div className="flex gap-1" role="group" aria-label="Was this summary helpful?">
              <button type="button" onClick={() => vote('accepted')} aria-pressed={feedback === 'accepted'} className={cn('rounded-md p-1.5 text-[#B8C7D9] hover:bg-emerald-950/40 hover:text-emerald-300', feedback === 'accepted' && 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40')} aria-label="Helpful">
                <ThumbsUp className="size-4" />
              </button>
              <button type="button" onClick={() => vote('rejected')} aria-pressed={feedback === 'rejected'} className={cn('rounded-md p-1.5 text-[#B8C7D9] hover:bg-rose-950/40 hover:text-rose-300', feedback === 'rejected' && 'bg-rose-950/60 text-rose-300 border border-rose-500/40')} aria-label="Not helpful">
                <ThumbsDown className="size-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
