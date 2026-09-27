import { useRef, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Lock, ScrollText, Search, X } from 'lucide-react';
import type { PageParams } from '@shared/dto.ts';
import { useAuth } from '@/app/auth-context';
import { ApiError, refillService } from '@/services';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { Pagination } from '@/components/ui/Layout';
import { EmptyState, ErrorState, SkeletonRows } from '@/components/ui/States';
import { cn, formatDateTime, timeAgo } from '@/lib/format';
import { Callout, fadeUp, SectionHeader } from './components';

const LIMIT = 25;

export default function AuditLogPage() {
  const { runWithStepUp } = useAuth();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  // After the user dismisses the step-up prompt, background refetches must not re-open it; "Try again" re-enables it.
  const allowPrompt = useRef(true);

  const audit = useQuery({
    queryKey: ['audit', page],
    queryFn: async () => {
      const params: PageParams = { page, limit: LIMIT };
      const fetcher = () => refillService.listAuditLogs(params);
      try {
        return await (allowPrompt.current ? runWithStepUp(fetcher) : fetcher());
      } catch (err) {
        if (err instanceof ApiError && err.code === 'MFA_REQUIRED') allowPrompt.current = false;
        throw err;
      }
    },
    placeholderData: keepPreviousData,
  });

  const retry = () => {
    allowPrompt.current = true;
    void audit.refetch();
  };

  const rows = audit.data?.data ?? [];
  const needle = filter.trim().toLowerCase();
  const visible = needle ? rows.filter((r) => r.action.toLowerCase().includes(needle)) : rows;
  const total = audit.data?.meta.total ?? 0;
  const mfaNeeded = audit.error instanceof ApiError && audit.error.code === 'MFA_REQUIRED';

  return (
    <div>
      <SectionHeader title="Audit log" description="Who did what, and when — across your organisation." />
      <motion.div {...fadeUp(1)}>
        <Callout icon={<Lock className="size-4" />} tone="brand" className="mb-5">
          Append-only. Every view of patient data is recorded.
        </Callout>
      </motion.div>

      {audit.isPending ? (
        <SkeletonRows rows={6} />
      ) : audit.isError ? (
        <ErrorState title={mfaNeeded ? 'Verification needed' : "Couldn't load the audit log"} error={audit.error} onRetry={retry} />
      ) : total === 0 ? (
        <EmptyState icon={<ScrollText className="size-6" aria-hidden />} title="No audit entries yet" description="Sign-ins, case views and admin changes will appear here as they happen." />
      ) : (
        <motion.div {...fadeUp(2)} className={cn('transition-opacity', audit.isFetching && audit.isPlaceholderData && 'opacity-60')}>
          <div className="mb-4 max-w-sm">
            <Input
              label="Filter by action"
              placeholder="e.g. case.view"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              leading={<Search className="size-4" aria-hidden />}
              hint="Filters the entries on this page."
              type="search"
            />
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon={<Search className="size-6" aria-hidden />}
              title="No matching entries on this page"
              description={`Nothing on page ${page} has an action containing “${filter.trim()}”.`}
              action={
                <Button variant="secondary" icon={<X className="size-4" aria-hidden />} onClick={() => setFilter('')}>
                  Clear filter
                </Button>
              }
            />
          ) : (
            <>
              <div className="surface hidden overflow-hidden md:block border border-cyan-500/30 bg-[#06245A]/90">
                <table className="w-full table-fixed text-sm">
                  <caption className="sr-only">Audit log entries, page {page}</caption>
                  <thead>
                    <tr className="border-b border-cyan-500/30 bg-[#03132F]/80 text-left text-[12px] font-bold uppercase tracking-wider text-[#B8C7D9]">
                      <th scope="col" className="w-[17%] px-4 py-3 font-bold">Time</th>
                      <th scope="col" className="w-[19%] px-4 py-3 font-bold">Actor</th>
                      <th scope="col" className="w-[25%] px-4 py-3 font-bold">Action</th>
                      <th scope="col" className="w-[25%] px-4 py-3 font-bold">Entity</th>
                      <th scope="col" className="w-[14%] px-4 py-3 font-bold">Request ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((r) => (
                      <tr key={r.id} className="border-b border-cyan-500/20 align-top transition-colors last:border-0 hover:bg-[#06245A]/70 odd:bg-[#06245A]/30 even:bg-[#03132F]/40">
                        <td className="px-4 py-3 text-[#B8C7D9] text-[13px] font-medium">
                          <time dateTime={r.createdAt} title={timeAgo(r.createdAt)}>
                            {formatDateTime(r.createdAt)}
                          </time>
                        </td>
                        <td className="truncate px-4 py-3 font-bold text-[#F5FAFF] text-[14px]" title={r.actorName}>
                          {r.actorName}
                        </td>
                        <td className="px-4 py-3">
                          <code className="break-all rounded-md bg-[#03132F] border border-cyan-500/40 px-2 py-0.5 font-mono text-[12.5px] font-bold text-[#00D9FF]">{r.action}</code>
                        </td>
                        <td className="px-4 py-3 text-[#B8C7D9] text-[13.5px]">
                          <span className="break-words font-medium text-[#F5FAFF]">{r.entity}</span>
                          {r.entityId && <span className="block truncate font-mono text-[12px] text-[#00D9FF]" title={r.entityId}>{r.entityId}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <code className="font-mono text-[12.5px] font-semibold text-[#00D9FF]" title={r.requestId}>
                            {r.requestId.slice(0, 8)}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="space-y-2.5 md:hidden" aria-label={`Audit log entries, page ${page}`}>
                {visible.map((r) => (
                  <li key={r.id} className="surface p-4 border border-cyan-500/25 bg-[#06245A]/85 rounded-xl">
                    <div className="flex items-start justify-between gap-3">
                      <code className="min-w-0 break-all rounded-md bg-[#03132F] border border-cyan-500/30 px-2 py-0.5 font-mono text-[12.5px] font-bold text-[#00D9FF]">{r.action}</code>
                      <time dateTime={r.createdAt} className="shrink-0 text-[12px] font-medium text-[#B8C7D9]">
                        {formatDateTime(r.createdAt)}
                      </time>
                    </div>
                    <dl className="mt-2.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-[13.5px]">
                      <dt className="text-[#B8C7D9] font-medium">Actor</dt>
                      <dd className="truncate font-bold text-[#F5FAFF]">{r.actorName}</dd>
                      <dt className="text-[#B8C7D9] font-medium">Entity</dt>
                      <dd className="truncate text-[#F5FAFF]">
                        {r.entity}
                        {r.entityId && <span className="ml-1 font-mono text-[11.5px] text-[#00D9FF]">{r.entityId}</span>}
                      </dd>
                      <dt className="text-[#B8C7D9] font-medium">Request</dt>
                      <dd className="font-mono text-[12px] text-[#00D9FF]">{r.requestId.slice(0, 8)}</dd>
                    </dl>
                  </li>
                ))}
              </ul>
            </>
          )}

          <Pagination
            page={page}
            limit={LIMIT}
            total={total}
            onPage={(p) => {
              setPage(p);
              window.scrollTo?.({ top: 0, behavior: 'smooth' });
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
