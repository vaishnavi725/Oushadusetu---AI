import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity, AlertTriangle, ArrowRight, Bot, Brain, CheckCircle2, Eye,
  HeartPulse, Layers, MessageSquareMore, Pill, Radio, Shield, ShieldAlert,
  Sparkles, Target, Timer, TrendingUp, Users, Zap,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { CaseSummary } from '@shared/dto.ts';
import { STATUS_LABELS } from '@shared/domain/diagnosis.ts';
import type { CaseStatus } from '@shared/types.ts';
import { useAuth } from '@/app/auth-context';
import { refillService } from '@/services';
import { cn } from '@/lib/format';
import { Card, PageHeader } from '@/components/ui/Layout';
import { Skeleton, ErrorState } from '@/components/ui/States';

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.06 * i, ease: 'easeOut' as const },
});

// ─── Status bucket helpers ──────────────────────────────────────────

const CRITICAL_STATES: CaseStatus[] = ['WAITING_ON_PROVIDER', 'WAITING_ON_INSURANCE'];
const PATIENT_STATES: CaseStatus[] = ['WAITING_ON_PATIENT_VISIT', 'WAITING_ON_INFO'];
const TERMINAL_STATES: CaseStatus[] = ['CLOSED', 'CANCELLED', 'DISPENSED'];

function bucket(cases: CaseSummary[]) {
  const open = cases.filter(c => !TERMINAL_STATES.includes(c.status));
  const critical = open.filter(c => c.priority === 'URGENT' || CRITICAL_STATES.includes(c.status));
  const providerWait = cases.filter(c => c.status === 'WAITING_ON_PROVIDER');
  const patientWait = cases.filter(c => PATIENT_STATES.includes(c.status));
  const insuranceWait = cases.filter(c => c.status === 'WAITING_ON_INSURANCE');
  const escalated = open.filter(c => c.slaState === 'breached');
  const resolved = cases.filter(c => TERMINAL_STATES.includes(c.status));
  const proactive = open.filter(c => c.priority === 'URGENT' || ((c as unknown as { daysSupplyRemaining?: number }).daysSupplyRemaining !== undefined && ((c as unknown as { daysSupplyRemaining?: number }).daysSupplyRemaining ?? 99) <= 7));
  return { open, critical, providerWait, patientWait, insuranceWait, escalated, resolved, proactive };
}

// ─── Recharts colours ───────────────────────────────────────────────

const PIE_COLORS = ['#bb3a33', '#a86411', '#2a768a', '#3a91a6', '#67b0c2', '#1b7f50', '#9fcfdb', '#8a9ea5'];

// ─── Agent mock data ────────────────────────────────────────────────

const AGENTS = [
  { name: 'Intake Agent', status: 'active' as const, label: 'Active', icon: Layers, desc: 'Classifying incoming requests', actions: 42 },
  { name: 'Risk Agent', status: 'monitoring' as const, label: 'Monitoring', icon: Radio, desc: 'Scanning for silent-lapse risk', actions: 38 },
  { name: 'Resolution Agent', status: 'ready' as const, label: 'Ready', icon: Brain, desc: 'Routing blockers to owners', actions: 57 },
  { name: 'Communication Agent', status: 'ready' as const, label: 'Ready', icon: MessageSquareMore, desc: 'Awaiting outreach queue', actions: 29 },
  { name: 'Escalation Agent', status: 'monitoring' as const, label: 'Monitoring', icon: ShieldAlert, desc: 'Monitoring SLA deadlines', actions: 19 },
  { name: 'Audit Agent', status: 'ready' as const, label: 'Ready', icon: Eye, desc: 'Verifying completed actions', actions: 64 },
];

// ─── State machine nodes ────────────────────────────────────────────

const SM_NODES: { label: string; color: string }[] = [
  { label: 'Requested', color: '#3a91a6' },
  { label: 'Pharmacy Review', color: '#67b0c2' },
  { label: 'Provider Approval', color: '#a86411' },
  { label: 'Patient Action', color: '#2d67a8' },
  { label: 'Insurance Blocked', color: '#bb3a33' },
  { label: 'Escalated', color: '#9c2f29' },
  { label: 'Approved', color: '#1b7f50' },
  { label: 'Resolved', color: '#166a43' },
];

// ═══════════════════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════════════════

export default function CommandCenterPage() {
  const { user } = useAuth();
  const casesQ = useQuery({ queryKey: ['cases', 'all'], queryFn: () => refillService.listCases({}) });

  if (casesQ.isPending) return <CenterSkeleton />;
  if (casesQ.isError) return <ErrorState title="Couldn't load command center" error={casesQ.error} onRetry={() => void casesQ.refetch()} />;

  const cases: CaseSummary[] = casesQ.data?.data ?? [];
  const b = bucket(cases);

  // Status distribution for pie chart
  const statusMap = new Map<CaseStatus, number>();
  cases.forEach(c => statusMap.set(c.status, (statusMap.get(c.status) ?? 0) + 1));
  const pieData = [...statusMap.entries()].map(([status, count]) => ({
    name: STATUS_LABELS[status] ?? status,
    value: count,
  }));

  // Resolution trend (mock 7-day)
  const trendData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    resolved: Math.floor(Math.random() * 8) + 2,
    prevented: Math.floor(Math.random() * 4) + 1,
  }));

  return (
    <div>
      <PageHeader
        eyebrow="OushadhaSetu"
        title={<>Command <span className="font-bold">Center</span></>}
        description={`Autonomous refill orchestration for ${user?.orgName ?? 'your organization'} — real-time workflow intelligence.`}
        actions={
          <Link to="/proactive-risk" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-700 px-4 text-sm font-medium text-white shadow-lg transition hover:-translate-y-px hover:bg-brand-800">
            <Radio className="size-4" /> Proactive Risk View
          </Link>
        }
      />

      {/* ── KPI Tiles ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        <KpiTile i={0} label="Active" value={b.open.length} icon={<Activity className="size-4" />} color="brand" />
        <KpiTile i={1} label="Critical" value={b.critical.length} icon={<AlertTriangle className="size-4" />} color="bad" />
        <KpiTile i={2} label="Provider Wait" value={b.providerWait.length} icon={<HeartPulse className="size-4" />} color="warn" />
        <KpiTile i={3} label="Patient Wait" value={b.patientWait.length} icon={<Users className="size-4" />} color="info" />
        <KpiTile i={4} label="Insurance" value={b.insuranceWait.length} icon={<Shield className="size-4" />} color="warn" />
        <KpiTile i={5} label="Proactive Risk" value={b.proactive.length} icon={<Radio className="size-4" />} color="bad" />
        <KpiTile i={6} label="Escalated" value={b.escalated.length} icon={<Zap className="size-4" />} color="bad" />
        <KpiTile i={7} label="Resolved" value={b.resolved.length} icon={<CheckCircle2 className="size-4" />} color="ok" />
      </div>

      {/* ── Row 2: Status + State Machine + Agents ────────────── */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Status Distribution (Pie) */}
        <motion.div {...fadeUp(2)}>
          <Card className="h-full p-5">
            <h3 className="mb-3 text-[15px] font-semibold text-ink-900">Status Distribution</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #d7e5ea', fontSize: '13px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {pieData.slice(0, 6).map((d, i) => (
                <span key={d.name} className="flex items-center gap-1.5 text-[11px] text-ink-600">
                  <span className="size-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {d.name} ({d.value})
                </span>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* State Machine Visualization */}
        <motion.div {...fadeUp(3)}>
          <Card className="h-full p-5">
            <h3 className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-ink-900">
              <Sparkles className="size-4 text-brand-600" /> Workflow State Machine
            </h3>
            <div className="space-y-1">
              {SM_NODES.map((node, i) => {
                const count = cases.filter(c => STATUS_LABELS[c.status]?.includes(node.label.split(' ')[0])).length;
                return (
                  <div key={node.label} className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-md text-white text-[10px] font-bold" style={{ background: node.color }}>
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-ink-800">{node.label}</span>
                        <span className="rounded-full bg-ice-200 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-ink-700">{count}</span>
                      </div>
                    </div>
                    {i < SM_NODES.length - 1 && (
                      <ArrowRight className="size-3 shrink-0 text-ink-400" />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-ink-500">Alternative paths: Insurance Blocked, Appointment Required, Escalated → Resolved</p>
          </Card>
        </motion.div>

        {/* Multi-Agent Panel */}
        <motion.div {...fadeUp(4)}>
          <Card className="h-full p-5">
            <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-ink-900">
              <Bot className="size-4 text-brand-600" /> AI Agent Architecture
            </h3>
            <div className="space-y-2">
              {AGENTS.map(agent => (
                <div key={agent.name} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 transition hover:bg-ice-50">
                  <div className={cn(
                    'flex size-8 items-center justify-center rounded-lg',
                    agent.status === 'active' ? 'bg-ok-50 text-ok-600' :
                    agent.status === 'monitoring' ? 'bg-amber-50 text-amber-700' :
                    'bg-ice-200 text-ink-600'
                  )}>
                    <agent.icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-ink-900">{agent.name}</p>
                      <span className={cn(
                        'rounded-full px-2 py-0.2 text-[10px] font-semibold uppercase',
                        agent.status === 'active' ? 'bg-ok-50 text-ok-700' :
                        agent.status === 'monitoring' ? 'bg-amber-50 text-amber-700' :
                        'bg-ice-100 text-ink-600'
                      )}>
                        {agent.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-500">{agent.desc}</p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">{agent.actions}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Row 3: Resolution Trend + Top Cases ──────────────── */}
      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        <motion.div {...fadeUp(5)} className="lg:col-span-3">
          <Card className="p-5">
            <h3 className="mb-1 text-[15px] font-semibold text-ink-900">Resolution vs Prevented Lapses</h3>
            <p className="mb-4 text-[13px] text-ink-500">This week's resolved cases and proactively prevented medication lapses.</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} barGap={2}>
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#647c85' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#647c85' }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #d7e5ea', fontSize: '13px' }} />
                  <Bar dataKey="resolved" fill="#2a768a" radius={[4, 4, 0, 0]} name="Resolved" />
                  <Bar dataKey="prevented" fill="#1b7f50" radius={[4, 4, 0, 0]} name="Prevented Lapses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div {...fadeUp(6)} className="lg:col-span-2">
          <Card className="h-full p-5">
            <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-ink-900">
              <AlertTriangle className="size-4 text-bad-600" /> Critical Refills
            </h3>
            {b.critical.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-500">No critical refills — all on track.</p>
            ) : (
              <ul className="space-y-2 overflow-y-auto" style={{ maxHeight: '220px' }}>
                {b.critical.slice(0, 8).map(c => (
                  <li key={c.id}>
                    <Link to={`/cases/${c.id}`} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 transition hover:border-brand-300 hover:bg-brand-50/50">
                      <Pill className="size-4 shrink-0 text-bad-600" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-ink-900">{c.medication}</p>
                        <p className="text-[11px] text-ink-500">{c.patientName} · {STATUS_LABELS[c.status]}</p>
                      </div>
                      <span className="rounded-full bg-bad-50 px-2 py-0.5 text-[11px] font-semibold text-bad-700">
                        {c.priority === 'URGENT' ? 'URGENT' : 'HIGH'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </motion.div>
      </div>

      {/* ── Row 4: Proactive Intelligence ────────────────────── */}
      <motion.div {...fadeUp(7)} className="mt-5">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <div>
              <h3 className="flex items-center gap-2 text-[15px] font-semibold text-ink-900">
                <Radio className="size-4 text-brand-600" /> Proactive Silent-Lapse Detection
              </h3>
              <p className="mt-0.5 text-[13px] text-ink-500">Patients who may run out of medication before requesting a refill.</p>
            </div>
            <Link to="/proactive-risk" className="flex items-center gap-1 text-[13px] font-medium text-brand-700 hover:text-brand-900">
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {b.proactive.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-500">No proactive risks detected — all patients are on track.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-[12px] font-medium uppercase tracking-wide text-ink-400">
                    <th className="px-5 py-2.5">Patient</th>
                    <th className="px-5 py-2.5">Medication</th>
                    <th className="px-5 py-2.5 text-right">Days Left</th>
                    <th className="px-5 py-2.5">Risk</th>
                    <th className="px-5 py-2.5">Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  {b.proactive.slice(0, 5).map(c => {
                    const daysLeft = (c as unknown as { daysSupplyRemaining?: number }).daysSupplyRemaining;
                    return (
                      <tr key={c.id} className="border-b border-line last:border-0 hover:bg-ice-50">
                        <td className="px-5 py-3 font-medium text-ink-900">{c.patientName}</td>
                        <td className="px-5 py-3 text-ink-700">{c.medication}</td>
                        <td className="px-5 py-3 text-right tabular-nums">
                          <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold',
                            (daysLeft ?? 99) <= 3 ? 'bg-bad-50 text-bad-700' : 'bg-warn-50 text-warn-700'
                          )}>
                            {daysLeft ?? '—'} days
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="rounded-full bg-bad-50 px-2 py-0.5 text-[11px] font-bold text-bad-700">HIGH</span>
                        </td>
                        <td className="px-5 py-3 text-ink-600">Initiate patient outreach</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── AI Agent Status Command Grid ─────────────────────── */}
      <motion.div {...fadeUp(7)} className="mt-5">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="size-5 text-brand-600" />
              <h3 className="text-base font-bold text-ink-900">Oushadha AI Command Center</h3>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-800">
              <span className="size-2 rounded-full bg-ok-600 animate-pulse" /> All 6 Agents Online
            </span>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Intake Agent', status: 'Active', tone: 'ok', desc: 'Inbound fax parsing & normalization' },
              { name: 'Risk Agent', status: 'Monitoring', tone: 'brand', desc: 'Predicting silent medication lapses' },
              { name: 'Resolution Agent', status: 'Ready', tone: 'ok', desc: 'Clinical protocol routing & pathways' },
              { name: 'Communication Agent', status: 'Waiting for Approval', tone: 'warn', desc: 'Patient & pharmacy outreach drafts' },
              { name: 'Escalation Agent', status: 'Monitoring SLAs', tone: 'brand', desc: 'Stagnant case deadline enforcement' },
              { name: 'Audit Agent', status: 'Ready', tone: 'ok', desc: 'Cryptographic compliance verification' },
            ].map((agent) => (
              <div
                key={agent.name}
                className="rounded-xl border border-line bg-ice-50/50 p-3.5 transition hover:border-brand-300 hover:bg-white hover:shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-ok-600" />
                    <span className="text-xs font-bold text-ink-900">{agent.name}</span>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold border',
                      agent.tone === 'ok'
                        ? 'bg-ok-50 text-ok-700 border-ok-200'
                        : agent.tone === 'warn'
                        ? 'bg-warn-50 text-warn-700 border-warn-200'
                        : 'bg-brand-50 text-brand-700 border-brand-200'
                    )}
                  >
                    {agent.status}
                  </span>
                </div>
                <p className="mt-1.5 text-[11.5px] text-ink-500">{agent.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── Recent AI Decisions with Human-in-the-Loop ─────────── */}
      <motion.div {...fadeUp(8)} className="mt-5">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
            <div>
              <h3 className="text-base font-bold text-ink-900">Recent AI Decisions &amp; Recommendations</h3>
              <p className="text-xs text-ink-500">Every decision requires human authorization. The AI recommends; the human approves.</p>
            </div>
            <span className="text-xs font-semibold text-brand-700">Autonomous Surveillance</span>
          </div>

          <div className="space-y-4">
            <DecisionItem
              time="10:42 AM"
              agent="Proactive Risk Agent"
              finding="Detected possible medication lapse"
              patient="John Smith"
              medication="Metformin 500mg"
              daysRemaining={4}
              historicalLag={6}
              why="Days remaining (4) is less than historical refill processing time (6 days) with no active request."
              evidence={[
                'Current supply: 4 days remaining',
                'Historical refill lag: 6 days',
                'No refill request on record',
                'Maintenance medication for Type 2 Diabetes',
              ]}
              confidence={94}
              action="Patient outreach recommended via SMS."
              risk="HIGH"
            />

            <DecisionItem
              time="10:38 AM"
              agent="Resolution Agent"
              finding="Provider Approval Required"
              patient="Eleanor Vance"
              medication="Lisinopril 20mg"
              daysRemaining={2}
              why="No refills remaining on file and annual review is overdue by 8 months."
              evidence={[
                'No refills remaining on original prescription',
                'Last provider review was 8 months ago',
                'Patient has 2 days medication remaining',
              ]}
              confidence={92}
              action="Request provider approval for 90-day renewal with lab order."
              risk="HIGH"
            />

            <DecisionItem
              time="10:15 AM"
              agent="Escalation Agent"
              finding="Escalate to Duty Nurse"
              patient="Marcus Brody"
              medication="Levothyroxine 75mcg"
              daysRemaining={1}
              why="No provider response for 48 hours and patient supply expires tomorrow."
              evidence={[
                'Provider request sent 48 hours ago',
                'No response recorded',
                'Patient has 1 day supply remaining',
              ]}
              confidence={94}
              action="Escalate to nurse supervisor and alert on-call provider."
              risk="CRITICAL"
            />
          </div>
        </Card>
      </motion.div>

      {/* ── AI Explainability Framework ───────────────────────── */}
      <motion.div {...fadeUp(9)} className="mt-5">
        <Card className="p-5">
          <h3 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-ink-900">
            <Target className="size-4 text-brand-600" /> AI Explainability — How OushadhaSetu Decides
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ExplainCard
              step="1. Detect"
              title="Root Cause Analysis"
              desc="AI analyzes blockers: no refills, expired Rx, missing labs, insurance blocks, controlled substance rules."
              icon={<Brain className="size-5" />}
            />
            <ExplainCard
              step="2. Route"
              title="Autonomous Routing"
              desc="Determines responsible party: provider, patient, insurance, pharmacy. Assigns with deadline."
              icon={<TrendingUp className="size-5" />}
            />
            <ExplainCard
              step="3. Act"
              title="Human-in-the-Loop"
              desc="AI recommends actions. Humans approve, reject, or override. High-impact decisions require MFA."
              icon={<Shield className="size-5" />}
            />
            <ExplainCard
              step="4. Verify"
              title="Audit & Escalation"
              desc="Tracks every action. Auto-escalates on SLA breach. Pharmacy must confirm resolution."
              icon={<Timer className="size-5" />}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────

function KpiTile({ i, label, value, icon, color }: { i: number; label: string; value: number; icon: ReactNode; color: 'brand' | 'ok' | 'warn' | 'bad' | 'info' }) {
  const bg = { brand: 'bg-brand-50', ok: 'bg-ok-50', warn: 'bg-warn-50', bad: 'bg-bad-50', info: 'bg-info-50' }[color];
  const fg = { brand: 'text-brand-700', ok: 'text-ok-700', warn: 'text-warn-700', bad: 'text-bad-700', info: 'text-info-700' }[color];
  return (
    <motion.div {...fadeUp(i)} className="surface flex flex-col items-center gap-1.5 p-3 text-center transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <span className={cn('flex size-8 items-center justify-center rounded-lg', bg, fg)}>{icon}</span>
      <span className="text-[22px] font-bold leading-none text-ink-900">{value}</span>
      <span className="text-[11px] font-medium text-ink-500">{label}</span>
    </motion.div>
  );
}

function ExplainCard({ step, title, desc, icon }: { step: string; title: string; desc: string; icon: ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-gradient-to-br from-white to-ice-50 p-4 transition hover:shadow-[var(--shadow-soft)]">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">{icon}</span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{step}</span>
      </div>
      <h4 className="text-[14px] font-semibold text-ink-900">{title}</h4>
      <p className="mt-1 text-[12px] leading-relaxed text-ink-600">{desc}</p>
    </div>
  );
}

function DecisionItem({
  time,
  agent,
  finding,
  patient,
  medication,
  daysRemaining,
  historicalLag,
  why,
  evidence,
  confidence,
  action,
  risk,
}: {
  time: string;
  agent: string;
  finding: string;
  patient: string;
  medication: string;
  daysRemaining?: number;
  historicalLag?: number;
  why: string;
  evidence: string[];
  confidence: number;
  action: string;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'overridden'>('pending');

  return (
    <div className="rounded-xl border border-line bg-ice-50/60 p-4 transition hover:bg-white hover:shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-ink-500">{time}</span>
          <span className="text-ink-300">·</span>
          <span className="rounded-full bg-brand-50 border border-brand-200 px-2.5 py-0.5 text-[11px] font-bold text-brand-800">
            {agent}
          </span>
          <span className="text-xs font-semibold text-ink-900">{finding}</span>
        </div>
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase w-fit',
            risk === 'CRITICAL' ? 'bg-bad-50 text-bad-700 border border-bad-200' : 'bg-warn-50 text-warn-700 border border-warn-200'
          )}
        >
          {risk} RISK · {confidence}% CONFIDENCE
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
        <div>
          <p className="text-ink-500">Patient: <strong className="text-ink-900 font-semibold">{patient}</strong></p>
          <p className="mt-0.5 text-ink-500">Medication: <strong className="text-ink-800 font-medium">{medication}</strong></p>
          {daysRemaining !== undefined && (
            <p className="mt-0.5 text-ink-500">
              Days remaining: <strong className="text-bad-700 font-bold">{daysRemaining} days</strong>
              {historicalLag && ` (Historical lag: ${historicalLag} days)`}
            </p>
          )}
        </div>
        <div>
          <p className="text-ink-500 font-medium">WHY?</p>
          <p className="mt-0.5 text-ink-800">{why}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-brand-100 bg-white p-2.5 text-xs">
        <p className="text-ink-500 font-medium text-[11px] uppercase tracking-wide">EVIDENCE</p>
        <ul className="mt-1 space-y-0.5 text-ink-600">
          {evidence.map((ev) => (
            <li key={ev} className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3 text-ok-600" />
              <span>{ev}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-line">
        <div className="text-xs text-ink-700">
          <span className="text-ink-500">Action:</span> <strong className="font-semibold">{action}</strong>
        </div>

        <div className="flex items-center gap-2">
          {status === 'approved' ? (
            <span className="rounded-lg bg-ok-50 border border-ok-200 px-3 py-1 text-xs font-bold text-ok-700">
              ✓ Approved by Physician
            </span>
          ) : status === 'rejected' ? (
            <span className="rounded-lg bg-bad-50 border border-bad-200 px-3 py-1 text-xs font-bold text-bad-700">
              ✕ Recommendation Rejected
            </span>
          ) : status === 'overridden' ? (
            <span className="rounded-lg bg-warn-50 border border-warn-200 px-3 py-1 text-xs font-bold text-warn-700">
              ⊘ Overridden by Staff
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStatus('approved')}
                className="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition hover:bg-brand-800"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => setStatus('rejected')}
                className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-bad-50 hover:text-bad-700 hover:border-bad-200"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => setStatus('overridden')}
                className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-warn-50 hover:text-warn-700 hover:border-warn-200"
              >
                Override
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CenterSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Loading command center">
      <div className="flex items-end justify-between">
        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-8 w-56" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="surface space-y-2 p-3"><Skeleton className="mx-auto h-8 w-8 rounded-lg" /><Skeleton className="mx-auto h-6 w-10" /><Skeleton className="mx-auto h-3 w-16" /></div>)}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {[1, 2, 3].map(i => <div key={i} className="surface p-5"><Skeleton className="mb-3 h-5 w-40" /><Skeleton className="h-52" /></div>)}
      </div>
    </div>
  );
}
