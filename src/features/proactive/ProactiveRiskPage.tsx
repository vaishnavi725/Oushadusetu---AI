import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, CheckCircle2, Clock, Radio, Send, ShieldCheck } from 'lucide-react';
import { proactiveRiskService, type ProactiveRiskRecord } from '@/services/proactiveRiskService';
import { cn } from '@/lib/format';
import { Card, PageHeader } from '@/components/ui/Layout';
import { Input, Select } from '@/components/ui/Field';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.06 * i, ease: 'easeOut' as const },
});

export default function ProactiveRiskPage() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const qc = useQueryClient();

  const risksQ = useQuery({
    queryKey: ['proactive-risks'],
    queryFn: () => proactiveRiskService.listProactiveRisks(),
  });

  const updateOutreachMut = useMutation({
    mutationFn: async ({ id, status, prevented }: { id: string; status: 'PENDING' | 'SENT' | 'COMPLETED'; prevented: boolean }) => {
      await proactiveRiskService.updateRiskOutreach(id, status, prevented);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['proactive-risks'] });
    },
  });

  const proactive: ProactiveRiskRecord[] = risksQ.data ?? [];

  const filtered = useMemo(() => {
    let list = proactive;
    if (riskFilter !== 'all') list = list.filter((c) => c.risk_level === riskFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.patientName.toLowerCase().includes(q) || c.medicationName.toLowerCase().includes(q));
    }
    return list;
  }, [proactive, riskFilter, search]);

  const criticalCount = proactive.filter((c) => c.risk_level === 'CRITICAL').length;
  const highCount = proactive.filter((c) => c.risk_level === 'HIGH').length;
  const preventedCount = proactive.filter((c) => c.prevented_lapse).length;
  const avgDays = proactive.length
    ? Math.round(proactive.reduce((a, c) => a + c.days_remaining, 0) / proactive.length)
    : 0;

  if (risksQ.isPending) return <ProactiveSkeleton />;
  if (risksQ.isError) return <ErrorState title="Couldn't load risk data" error={risksQ.error} onRetry={() => void risksQ.refetch()} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Proactive Intelligence"
        title={<>Silent-Lapse <span className="font-bold text-[#00D9FF]">Prevention</span></>}
        description="Patients who may run out of medication before requesting a refill. OushadhaSetu connects to Supabase proactive_risks to detect lapses before they happen."
        actions={
          <Link to="/command-center" className="inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-500/30 bg-[#06245A]/70 px-4 text-sm font-semibold text-[#F5FAFF] shadow-md transition hover:border-[#00D9FF] hover:text-[#00D9FF]">
            ← AI Command Center
          </Link>
        }
      />

      {/* KPI Bar */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <motion.div {...fadeUp(0)} className="surface p-4 text-center rounded-2xl border border-rose-500/40 bg-[#06245A]/85">
          <p className="text-[32px] font-bold text-rose-300 leading-none">{criticalCount}</p>
          <p className="mt-2 text-[12px] font-bold text-rose-200 uppercase tracking-wider">Critical Risk</p>
        </motion.div>
        <motion.div {...fadeUp(1)} className="surface p-4 text-center rounded-2xl border border-amber-500/40 bg-[#06245A]/85">
          <p className="text-[32px] font-bold text-amber-300 leading-none">{highCount}</p>
          <p className="mt-2 text-[12px] font-bold text-amber-200 uppercase tracking-wider">High Risk</p>
        </motion.div>
        <motion.div {...fadeUp(2)} className="surface p-4 text-center rounded-2xl border border-emerald-500/40 bg-[#06245A]/85">
          <p className="text-[32px] font-bold text-emerald-300 leading-none">{preventedCount}</p>
          <p className="mt-2 text-[12px] font-bold text-emerald-200 uppercase tracking-wider">Prevented Lapses</p>
        </motion.div>
        <motion.div {...fadeUp(3)} className="surface p-4 text-center rounded-2xl border border-cyan-500/40 bg-[#06245A]/85">
          <p className="text-[32px] font-bold text-[#00D9FF] leading-none">{avgDays}d</p>
          <p className="mt-2 text-[12px] font-bold text-[#B8C7D9] uppercase tracking-wider">Avg Days Left</p>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="p-4 rounded-2xl border border-cyan-500/30 bg-[#06245A]/80">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input label="Search" placeholder="Search patient or medication…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="w-44">
            <Select label="Risk Level" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* AI Proactive Banner */}
      <motion.div {...fadeUp(4)} className="rounded-2xl border border-cyan-500/30 bg-[#06245A]/90 p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <Brain className="mt-0.5 size-5 text-[#00D9FF] shrink-0" />
          <div>
            <p className="text-[15px] font-bold text-[#F5FAFF]">Supabase Proactive Intelligence Stream</p>
            <p className="mt-1 text-[13.5px] text-[#B8C7D9] leading-relaxed">
              When <strong className="text-[#F5FAFF]">Days Remaining &lt; Historical Refill Lag</strong>, the Proactive Risk Agent marks a silent-lapse risk in Supabase.
              Clinicians review and initiate patient outreach with a single click.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Radio className="size-6" />} title="No risks found" description={search || riskFilter !== 'all' ? 'Try adjusting your filters.' : 'All patients are on track.'} />
      ) : (
        <motion.div {...fadeUp(5)}>
          <Card className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#06245A]/90 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cyan-500/30 bg-[#03132F]/80 text-left text-[12px] font-bold uppercase tracking-wider text-[#B8C7D9]">
                    <th className="px-5 py-3.5">Patient</th>
                    <th className="px-5 py-3.5">Medication</th>
                    <th className="px-4 py-3.5 text-center">Days Remaining</th>
                    <th className="px-4 py-3.5 text-center">Hist. Lag</th>
                    <th className="px-4 py-3.5 text-center">Risk Score</th>
                    <th className="px-4 py-3.5">Risk Level</th>
                    <th className="px-5 py-3.5">Risk Reason</th>
                    <th className="px-5 py-3.5">Recommended Action</th>
                    <th className="px-4 py-3.5">Outreach Status</th>
                    <th className="px-4 py-3.5 text-center">Prevented Lapse</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.02 * i }}
                      className={cn('transition hover:bg-slate-50/80', c.risk_level === 'CRITICAL' && 'bg-rose-50/20')}
                    >
                      <td className="px-5 py-3.5 font-semibold text-ink-900 whitespace-nowrap">{c.patientName}</td>
                      <td className="px-5 py-3.5 text-ink-800 font-medium whitespace-nowrap">{c.medicationName}</td>
                      <td className="px-4 py-3.5 text-center tabular-nums">
                        <span className={cn('rounded-full px-2.5 py-0.5 text-[11.5px] font-bold',
                          c.days_remaining <= 2 ? 'bg-rose-100 text-rose-800' :
                          c.days_remaining <= 5 ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        )}>
                          {c.days_remaining} days
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center tabular-nums text-ink-600 font-medium">{c.historical_refill_lag_days} days</td>
                      <td className="px-4 py-3.5 text-center tabular-nums font-bold text-teal-900">{c.risk_score}%</td>
                      <td className="px-4 py-3.5">
                        <RiskBadge risk={c.risk_level} />
                      </td>
                      <td className="max-w-[220px] px-5 py-3.5 text-[12.5px] text-ink-600 line-clamp-2" title={c.risk_reason}>
                        {c.risk_reason}
                      </td>
                      <td className="max-w-[220px] px-5 py-3.5 text-[12.5px] text-teal-900 font-medium">
                        {c.recommended_action}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                          c.outreach_status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          c.outreach_status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                          c.outreach_status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        )}>
                          {c.outreach_status === 'COMPLETED' ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                          {c.outreach_status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {c.prevented_lapse ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11.5px] font-bold text-emerald-800">
                            <ShieldCheck className="size-3.5" /> Prevented
                          </span>
                        ) : (
                          <span className="text-[11.5px] text-ink-400 font-medium">At Risk</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {c.outreach_status !== 'COMPLETED' ? (
                          <button
                            type="button"
                            onClick={() => updateOutreachMut.mutate({ id: c.id, status: 'COMPLETED', prevented: true })}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white px-3 py-1.5 text-[12px] font-semibold shadow-xs transition"
                          >
                            <Send className="size-3" /> Initiate Outreach
                          </button>
                        ) : (
                          <span className="text-[12px] font-medium text-emerald-700">Outreach Sent</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const style = {
    CRITICAL: 'bg-rose-100 text-rose-800 border border-rose-200',
    HIGH: 'bg-amber-100 text-amber-800 border border-amber-200',
    MEDIUM: 'bg-blue-100 text-blue-800 border border-blue-200',
    LOW: 'bg-slate-100 text-slate-700 border border-slate-200',
  }[risk] ?? 'bg-slate-100 text-slate-700';
  return <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider', style)}>{risk}</span>;
}

function ProactiveSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Loading proactive risk data">
      <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-8 w-64" /></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="surface space-y-2 p-4"><Skeleton className="mx-auto h-8 w-12" /><Skeleton className="mx-auto h-3 w-20" /></div>)}
      </div>
      <div className="surface p-5"><Skeleton className="h-64" /></div>
    </div>
  );
}
