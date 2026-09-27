import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  HeartPulse,
  Pill,
  Radio,
  Shield,
  Sparkles,
  Users,
  Zap,
  Check,
  Send,
  Database,
} from 'lucide-react';
import type { CaseSummary } from '@shared/dto.ts';
import { STATUS_LABELS } from '@shared/domain/diagnosis.ts';
import { useAuth } from '@/app/auth-context';
import {
  refillService,
  patientService,
  prescriptionService,
  proactiveRiskService,
  aiDecisionService,
  agentActionService,
} from '@/services';
import { cn } from '@/lib/format';
import { Card, PageHeader } from '@/components/ui/Layout';
import { ErrorState } from '@/components/ui/States';

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: 0.05 * i, ease: 'easeOut' as const },
});

export default function DashboardPage() {
  const { user } = useAuth();
  const [proactiveActions, setProactiveActions] = useState<Record<string, 'pending' | 'reviewed' | 'dispatched'>>({});

  // 1. Refill cases
  const casesQ = useQuery({ queryKey: ['cases', 'all'], queryFn: () => refillService.listCases({}) });
  // 2. Proactive risks
  const proactiveRisksQ = useQuery({ queryKey: ['proactive-risks'], queryFn: () => proactiveRiskService.listProactiveRisks() });
  // 3. Patients
  const patientsQ = useQuery({ queryKey: ['patients'], queryFn: () => patientService.listPatients() });
  // 4. Prescriptions
  const prescriptionsQ = useQuery({ queryKey: ['prescriptions'], queryFn: () => prescriptionService.listPrescriptions() });
  // 5. AI Decisions
  const decisionsQ = useQuery({ queryKey: ['ai-decisions'], queryFn: () => aiDecisionService.listAiDecisions() });
  // 6. Agent Actions
  const actionsQ = useQuery({ queryKey: ['agent-actions'], queryFn: () => agentActionService.listAgentActions() });

  const cases: CaseSummary[] = casesQ.data?.data ?? [];
  const proactiveRisks = proactiveRisksQ.data ?? [];
  const decisions = decisionsQ.data ?? [];
  const actions = actionsQ.data ?? [];

  // Metrics computation
  const openCases = useMemo(() => cases.filter((c) => !['CLOSED', 'CANCELLED', 'DISPENSED'].includes(c.status)), [cases]);
  const criticalCases = useMemo(() => openCases.filter((c) => c.priority === 'URGENT' || c.status === 'WAITING_ON_PROVIDER'), [openCases]);
  const waitingProvider = useMemo(() => cases.filter((c) => c.status === 'WAITING_ON_PROVIDER'), [cases]);
  const waitingPatient = useMemo(() => cases.filter((c) => c.status === 'WAITING_ON_PATIENT_VISIT' || c.status === 'WAITING_ON_INFO'), [cases]);
  const escalatedCases = useMemo(() => openCases.filter((c) => c.slaState === 'breached' || c.escalationLevel > 0), [openCases]);
  const resolvedCases = useMemo(() => cases.filter((c) => ['CLOSED', 'CANCELLED', 'DISPENSED', 'APPROVED'].includes(c.status)), [cases]);
  const preventedCount = useMemo(() => proactiveRisks.filter((r) => r.prevented_lapse).length + resolvedCases.length, [proactiveRisks, resolvedCases]);

  const handleReviewProactive = (id: string) => {
    setProactiveActions((prev) => ({
      ...prev,
      [id]: prev[id] === 'reviewed' ? 'dispatched' : 'reviewed',
    }));
  };

  if (casesQ.isPending) return <DashboardSkeleton />;
  if (casesQ.isError) return <ErrorState title="Couldn't load dashboard" error={casesQ.error} onRetry={() => void casesQ.refetch()} />;

  const isSupabaseLive = import.meta.env.VITE_USE_MOCKS === 'false';

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <PageHeader
        eyebrow="OushadhaSetu Clinical Hub"
        title={
          <div className="flex items-baseline gap-3">
            <span className="font-light text-[#F5FAFF]">OushadhaSetu</span> <span className="font-bold text-[#00D9FF] drop-shadow-[0_0_12px_rgba(0,217,255,0.4)]">Dashboard</span>
            {isSupabaseLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 text-[11px] font-bold">
                <Database className="size-3" /> Supabase Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#06245A] border border-[rgba(0,217,255,0.2)] text-[#A2C0E8] px-2.5 py-0.5 text-[11px] font-bold">
                Mock Mode
              </span>
            )}
          </div>
        }
        description={`Autonomous refill orchestration and adherence resolution for ${user?.orgName ?? 'Clinic'}.`}
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/command-center"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[rgba(0,217,255,0.25)] bg-[#06245A]/70 px-4 text-sm font-medium text-[#F5FAFF] shadow-sm backdrop-blur-md transition hover:border-[#00D9FF] hover:text-[#00D9FF]"
            >
              <Bot className="size-4 text-[#00D9FF]" />
              <span>AI Command Center</span>
            </Link>
            <Link
              to="/cases/new"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#087BFF] to-[#0066e6] px-4 text-sm font-semibold text-[#F5FAFF] shadow-[0_4px_16px_rgba(0,217,255,0.35)] transition hover:from-[#00D9FF] hover:to-[#087BFF] hover:text-[#03132F]"
            >
              <span>+ Log Refill Request</span>
            </Link>
          </div>
        }
      />

      {/* Database Telemetry Quick Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-[rgba(0,217,255,0.25)] bg-[#06245A]/60 backdrop-blur-md text-[12.5px] text-[#F5FAFF] font-medium shadow-[0_4px_16px_rgba(3,19,47,0.5)]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5 text-[#00D9FF]" /> Patients: <strong className="text-[#F5FAFF]">{patientsQ.data?.length ?? 0}</strong>
          </span>
          <span className="text-[#1e3a6d]">|</span>
          <span className="flex items-center gap-1.5">
            <Pill className="size-3.5 text-[#4DA3FF]" /> Prescriptions: <strong className="text-[#F5FAFF]">{prescriptionsQ.data?.length ?? 0}</strong>
          </span>
          <span className="text-[#1e3a6d]">|</span>
          <span className="flex items-center gap-1.5">
            <Brain className="size-3.5 text-[#00D9FF]" /> AI Decisions: <strong className="text-[#F5FAFF]">{decisions.length}</strong>
          </span>
          <span className="text-[#1e3a6d]">|</span>
          <span className="flex items-center gap-1.5">
            <Zap className="size-3.5 text-amber-400" /> Agent Actions: <strong className="text-[#F5FAFF]">{actions.length}</strong>
          </span>
        </div>
        <span className="text-[11.5px] text-[#749BC9] font-normal">
          Refill Cases Source: <strong className="text-[#00D9FF]">{isSupabaseLive ? 'PostgreSQL (Supabase)' : 'Mock Engine'}</strong>
        </span>
      </div>

      {/* 8 Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-8">
        <KpiCard
          label="Active Refills"
          value={openCases.length}
          icon={<Activity className="size-4" />}
          tone="brand"
          idx={0}
        />
        <KpiCard
          label="Critical Refills"
          value={criticalCases.length}
          icon={<AlertTriangle className="size-4" />}
          tone="bad"
          idx={1}
        />
        <KpiCard
          label="Proactive Risks"
          value={proactiveRisks.length}
          icon={<Radio className="size-4" />}
          tone="warn"
          idx={2}
        />
        <KpiCard
          label="Waiting Provider"
          value={waitingProvider.length}
          icon={<HeartPulse className="size-4" />}
          tone="brand"
          idx={3}
        />
        <KpiCard
          label="Waiting Patient"
          value={waitingPatient.length}
          icon={<Users className="size-4" />}
          tone="neutral"
          idx={4}
        />
        <KpiCard
          label="Escalated"
          value={escalatedCases.length}
          icon={<Zap className="size-4" />}
          tone="bad"
          idx={5}
        />
        <KpiCard
          label="Resolved"
          value={resolvedCases.length}
          icon={<CheckCircle2 className="size-4" />}
          tone="ok"
          idx={6}
        />
        <KpiCard
          label="Prevented Lapses"
          value={preventedCount}
          icon={<Shield className="size-4" />}
          tone="ok"
          idx={7}
        />
      </div>

      {/* AI Orchestration Surveillance Banner */}
      <motion.div
        {...fadeUp(2)}
        className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 via-white to-blue-50/60 p-5 shadow-xs"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/30">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-ink-900">
                  Oushadha AI Copilot Surveillance Active
                </h3>
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-semibold text-teal-900">
                  6 Autonomous Agents
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-600 max-w-2xl">
                Continuous background surveillance scans incoming requests, prevents silent lapse risks, and prepares provider action pathways.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              to="/proactive-risk"
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-300 bg-white px-3.5 py-2 text-xs font-semibold text-teal-900 hover:bg-teal-50 transition"
            >
              <Radio className="size-3.5 text-teal-700" /> Silent-Lapse Feed
            </Link>
            <Link
              to="/command-center"
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-800 transition"
            >
              Inspect Agents <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Critical Alerts & Proactive Risks */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Critical Refill Alerts */}
        <motion.div {...fadeUp(3)}>
          <Card className="h-full p-5 rounded-2xl border border-line">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
                  <AlertTriangle className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-900">Critical Refill Alerts</h3>
                  <p className="text-[11px] text-ink-500">Require immediate physician or staff intervention</p>
                </div>
              </div>
              <Link to="/queue" className="text-xs font-semibold text-teal-700 hover:underline">
                View all queue →
              </Link>
            </div>

            {criticalCases.length === 0 ? (
              <p className="py-8 text-center text-xs text-ink-400">No critical refills pending review.</p>
            ) : (
              <div className="space-y-2.5">
                {criticalCases.slice(0, 5).map((c) => (
                  <Link
                    key={c.id}
                    to={`/cases/${c.id}`}
                    className="flex items-center justify-between rounded-xl border border-line bg-slate-50/50 p-3 transition hover:border-teal-300 hover:bg-white hover:shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-2xs border border-line text-ink-700">
                        <Pill className="size-4 text-rose-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-ink-900">{c.medication}</p>
                        <p className="text-[11px] text-ink-500">
                          {c.patientName} · {STATUS_LABELS[c.status]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        URGENT
                      </span>
                      <ArrowRight className="size-3.5 text-ink-400" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Proactive Lapse Risks */}
        <motion.div {...fadeUp(4)}>
          <Card className="h-full p-5 rounded-2xl border border-line">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                  <Radio className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-900">Proactive Lapse Risks</h3>
                  <p className="text-[11px] text-ink-500">Patients approaching runout with no refill request</p>
                </div>
              </div>
              <Link to="/proactive-risk" className="text-xs font-semibold text-teal-700 hover:underline">
                View all risks →
              </Link>
            </div>

            <div className="space-y-3">
              {proactiveRisks.slice(0, 3).map((pr) => {
                const actionState = proactiveActions[pr.id] ?? (pr.outreach_status === 'COMPLETED' ? 'dispatched' : 'pending');
                const riskLevel = pr.days_remaining <= 2 || pr.risk_score >= 85 ? 'HIGH RISK' : 'MODERATE RISK';
                return (
                  <div
                    key={pr.id}
                    className="rounded-xl border border-teal-100 bg-gradient-to-br from-white to-slate-50/80 p-4 transition hover:border-teal-300 hover:shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-ink-900">{pr.patientName}</span>
                          <span className="rounded-full bg-teal-100/70 border border-teal-200 px-2 py-0.5 text-[10.5px] font-bold text-teal-900">
                            Risk Score: {pr.risk_score}%
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs font-semibold text-teal-800">{pr.medicationName}</p>
                      </div>
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide',
                          riskLevel === 'HIGH RISK'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        )}
                      >
                        {riskLevel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-ink-400 text-[10.5px] font-medium block">SUPPLY STATUS</span>
                        <strong className="text-rose-700 font-bold">{pr.days_remaining} days remaining</strong>
                      </div>
                      <div>
                        <span className="text-ink-400 text-[10.5px] font-medium block">HISTORICAL PROCESS</span>
                        <span className="text-ink-700 font-medium">Historical refill lag: {pr.historical_refill_lag_days} days</span>
                      </div>
                    </div>

                    <p className="text-xs text-ink-700 italic bg-amber-50/70 border border-amber-200/60 rounded-md px-2.5 py-1.5 leading-snug">
                      &ldquo;Patient may run out before the expected refill processing time.&rdquo;
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-line">
                      <span className="text-xs text-ink-600">
                        Action: <strong className="text-ink-900 font-semibold">{pr.recommended_action}</strong>
                      </span>
                      {actionState === 'dispatched' ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                          <Check className="size-3" /> Outreach Dispatched
                        </span>
                      ) : actionState === 'reviewed' ? (
                        <button
                          type="button"
                          onClick={() => handleReviewProactive(pr.id)}
                          className="flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-teal-800 transition"
                        >
                          <Send className="size-3" /> Approve Outreach
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleReviewProactive(pr.id)}
                          className="rounded-lg border border-teal-300 bg-white px-3 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-50 transition shadow-2xs"
                        >
                          Review Risk
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* AI Decisions & Agent Activity Live Stream */}
      <motion.div {...fadeUp(5)}>
        <Card className="p-5 rounded-2xl border border-line">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Brain className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink-900">Recent AI Decisions & Autonomous Agent Activity</h3>
                <p className="text-[11px] text-ink-500">Live decision stream recorded by OushadhaSetu agents</p>
              </div>
            </div>
            <Link to="/command-center" className="text-xs font-semibold text-teal-700 hover:underline">
              Command Center →
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {decisions.slice(0, 3).map((d) => (
              <div key={d.id} className="p-3.5 rounded-xl border border-line bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-[11.5px]">
                  <span className="font-bold text-teal-900">{d.agent_name}</span>
                  <span className="font-semibold text-ink-500">{d.confidence}% Confidence</span>
                </div>
                <p className="text-xs text-ink-800 font-medium">{d.recommendation}</p>
                <p className="text-[11px] text-ink-500 line-clamp-2">{d.reasoning}</p>
                <div className="pt-2 border-t border-line flex items-center justify-between text-[10.5px]">
                  <span className="font-mono text-ink-400">Status: {d.human_approval_status}</span>
                  <span className="text-teal-700 font-semibold">{d.decision_type}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
  tone,
  idx,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: 'brand' | 'bad' | 'warn' | 'ok' | 'neutral';
  idx: number;
}) {
  const tones = {
    brand: 'text-[#00D9FF] bg-[#06245A]/70 border-[rgba(0,217,255,0.25)]',
    bad: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
    warn: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    ok: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    neutral: 'text-[#A2C0E8] bg-[#06245A]/50 border-[rgba(77,163,255,0.2)]',
  };

  return (
    <motion.div {...fadeUp(idx)} className="h-full">
      <Card className={cn('flex flex-col justify-between p-3.5 rounded-2xl border transition hover:shadow-[0_0_18px_rgba(0,217,255,0.2)]', tones[tone])}>
        <div className="flex items-center justify-between">
          <span className="p-1.5 rounded-lg bg-[#03132F]/80 border border-[rgba(0,217,255,0.2)] shadow-sm text-[#00D9FF]">{icon}</span>
        </div>
        <div className="mt-2.5">
          <p className="text-[22px] font-bold text-[#F5FAFF] leading-none">{value}</p>
          <p className="mt-1 text-[11px] font-medium text-[#749BC9] truncate" title={label}>
            {label}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-14 w-64 bg-slate-200 rounded-xl animate-pulse" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-200 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
