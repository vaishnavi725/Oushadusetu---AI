import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Bot,
  Brain,
  CheckCircle2,
  Eye,
  Layers,
  MessageSquareMore,
  Radio,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Check,
  X,
  Slash,
} from 'lucide-react';
import { cn } from '@/lib/format';
import { Card, PageHeader, Tabs } from '@/components/ui/Layout';
import { aiDecisionService, type AiDecisionRecord } from '@/services/aiDecisionService';
import { aiApiClient } from '@/services/aiApiClient';

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.06 * i, ease: 'easeOut' as const },
});

// ─── Agent Data (Exact User Specification) ──────────────────────────
const AGENTS = [
  {
    name: 'Intake Agent',
    desc: 'Understands why the refill entered the workflow. Matches EHR identity and extracts prescription blockers.',
    status: 'active' as const,
    statusLabel: 'Active',
    icon: Layers,
    lastAction: 'Parsed and normalized incoming pharmacy refill request for Metformin 500mg',
    timestamp: '2 mins ago',
    decisions: 42,
    accuracy: 98,
    avgTime: '1.2s',
  },
  {
    name: 'Risk Agent',
    desc: 'Continuously detects possible silent medication lapses by comparing Days Remaining against Historical Refill Lag.',
    status: 'monitoring' as const,
    statusLabel: 'Monitoring',
    icon: Radio,
    lastAction: 'Calculated silent-lapse risk for John Demo (Supply: 2d, Historical lag: 5d)',
    timestamp: '4 mins ago',
    decisions: 38,
    accuracy: 94,
    avgTime: '0.8s',
  },
  {
    name: 'Resolution Agent',
    desc: 'Formulates resolution pathways according to clinic protocols: determines WHO should act and WHAT action is needed.',
    status: 'ready' as const,
    statusLabel: 'Ready',
    icon: Brain,
    lastAction: 'Recommended provider approval pathway due to zero refills remaining',
    timestamp: '7 mins ago',
    decisions: 57,
    accuracy: 97,
    avgTime: '1.5s',
  },
  {
    name: 'Communication Agent',
    desc: 'Generates draft patient outreach and pharmacy communications with HIPAA compliance guarantees.',
    status: 'ready' as const,
    statusLabel: 'Ready',
    icon: MessageSquareMore,
    lastAction: 'Prepared patient reminder draft via secure SMS channel',
    timestamp: '11 mins ago',
    decisions: 29,
    accuracy: 99,
    avgTime: '1.8s',
  },
  {
    name: 'Escalation Agent',
    desc: 'Monitors clinic SLA deadlines, detects overdue actions, and recommends escalation to duty nurse or covering physician.',
    status: 'monitoring' as const,
    statusLabel: 'Monitoring',
    icon: ShieldAlert,
    lastAction: 'Enforced 48h SLA timer for pending physician reviews',
    timestamp: '15 mins ago',
    decisions: 19,
    accuracy: 96,
    avgTime: '0.3s',
  },
  {
    name: 'Audit Agent',
    desc: 'Verifies whether actions occurred, validates regulatory compliance, and ensures tamper-proof audit trails.',
    status: 'ready' as const,
    statusLabel: 'Ready',
    icon: Eye,
    lastAction: 'Verified clinician approval and recorded tamper-proof audit hash in audit_logs',
    timestamp: 'Just now',
    decisions: 64,
    accuracy: 100,
    avgTime: '0.5s',
  },
];

// ─── Proactive Workflow Steps (Exact User Specification) ───────────
const WORKFLOW_STEPS = [
  'Prescription',
  'Days Remaining',
  'Historical Refill Lag',
  'Risk Calculation',
  'No Refill Request',
  'Silent-Lapse Risk',
  'Proactive Intake Agent',
  'Patient Outreach Recommendation',
  'Human Approval',
  'Agent Action',
  'Audit Log',
  'Prevented Lapse',
];

type TabValue = 'agents' | 'decisions' | 'workflow';

export default function AgentActivityPage() {
  const [tab, setTab] = useState<TabValue>('agents');
  const queryClient = useQueryClient();

  // Query live decisions from Supabase
  const decisionsQ = useQuery({
    queryKey: ['ai-decisions'],
    queryFn: () => aiDecisionService.listAiDecisions(),
  });

  return (
    <div>
      <PageHeader
        eyebrow="Oushadha AI"
        title={<>AI Agent <span className="font-bold">Command Center</span></>}
        description="Autonomous multi-agent orchestration for refill triage, proactive lapse prevention, and human oversight."
        actions={
          <Link
            to="/command-center"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line-strong bg-white px-4 text-sm font-medium text-ink-900 transition hover:bg-brand-50"
          >
            ← System Overview
          </Link>
        }
      />

      <Tabs
        label="Agent views"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'agents' as TabValue, label: 'Agent Status', count: AGENTS.length },
          { value: 'decisions' as TabValue, label: 'Recent AI Decisions', count: decisionsQ.data?.length ?? 0 },
          { value: 'workflow' as TabValue, label: 'Proactive Workflow' },
        ]}
      />

      <div className="mt-5">
        {tab === 'agents' && <AgentsView />}
        {tab === 'decisions' && (
          <DecisionsView
            decisions={decisionsQ.data ?? []}
            isLoading={decisionsQ.isLoading}
            onUpdate={() => void queryClient.invalidateQueries({ queryKey: ['ai-decisions'] })}
          />
        )}
        {tab === 'workflow' && <ProactiveWorkflowView />}
      </div>
    </div>
  );
}

// ─── 1. Agents View ─────────────────────────────────────────────────

function AgentsView() {
  return (
    <div className="space-y-6">
      {/* 6 Specialized Agent Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((agent, i) => (
          <motion.div key={agent.name} {...fadeUp(i)}>
            <Card className="h-full p-5 flex flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
              <div>
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex size-10 items-center justify-center rounded-xl',
                      agent.status === 'active'
                        ? 'bg-ok-50 text-ok-600'
                        : agent.status === 'monitoring'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-ice-200 text-ink-700'
                    )}
                  >
                    <agent.icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-semibold text-ink-900">{agent.name}</h3>
                      <span
                        className={cn(
                          'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                          agent.status === 'active'
                            ? 'bg-ok-50 text-ok-700 border border-ok-200'
                            : agent.status === 'monitoring'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-ice-100 text-ink-700 border border-line'
                        )}
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            agent.status === 'active'
                              ? 'bg-ok-600 animate-pulse'
                              : agent.status === 'monitoring'
                              ? 'bg-amber-600 animate-pulse'
                              : 'bg-ink-400'
                          )}
                        />
                        {agent.statusLabel}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-ink-500">{agent.desc}</p>
                  </div>
                </div>

                <div className="mt-3.5 rounded-lg border border-line bg-slate-50/70 p-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-ink-400">
                    <span className="font-semibold uppercase tracking-wider text-ink-500">Last Action</span>
                    <span className="font-mono text-ink-500">{agent.timestamp}</span>
                  </div>
                  <p className="text-ink-800 text-[11.5px] leading-snug">{agent.lastAction}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-ice-50 p-2.5 text-center">
                <div>
                  <p className="text-[16px] font-bold text-ink-900">{agent.decisions}</p>
                  <p className="text-[10px] text-ink-500">Decisions</p>
                </div>
                <div>
                  <p className="text-[16px] font-bold text-ok-700">{agent.accuracy}%</p>
                  <p className="text-[10px] text-ink-500">Accuracy</p>
                </div>
                <div>
                  <p className="text-[16px] font-bold text-brand-700">{agent.avgTime}</p>
                  <p className="text-[10px] text-ink-500">Avg Time</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Structured Agent Status & Telemetry Table */}
      <Card className="overflow-hidden">
        <div className="border-b border-line bg-ice-50/60 px-5 py-3.5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-ink-900">Agent Surveillance Matrix</h3>
            <p className="text-xs text-ink-500">Real-time status, latest action telemetry, and timestamp for all 6 autonomous agents</p>
          </div>
          <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold">
            All 6 Agents Synchronized
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-ice-50 text-left text-[11px] font-bold uppercase tracking-wider text-ink-500">
                <th className="px-5 py-3">Agent</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Action</th>
                <th className="px-5 py-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map((agent) => (
                <tr key={agent.name} className="border-b border-line last:border-0 hover:bg-ice-50/50">
                  <td className="px-5 py-3.5 font-semibold text-ink-900 whitespace-nowrap">
                    <span className="flex items-center gap-2">
                      <agent.icon className="size-4 text-brand-600" />
                      <span>{agent.name}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase border',
                        agent.status === 'active'
                          ? 'bg-ok-50 text-ok-700 border-ok-200'
                          : agent.status === 'monitoring'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-ice-100 text-ink-700 border-line'
                      )}
                    >
                      {agent.statusLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-ink-800 font-medium">
                    {agent.lastAction}
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-ink-500 whitespace-nowrap tabular-nums">
                    {agent.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── 2. Recent AI Decisions from Supabase ───────────────────────────

function DecisionsView({
  decisions,
  isLoading,
  onUpdate,
}: {
  decisions: AiDecisionRecord[];
  isLoading: boolean;
  onUpdate: () => void;
}) {
  const [actingId, setActingId] = useState<string | null>(null);

  const handleAction = async (
    decision: AiDecisionRecord,
    action: 'approved' | 'rejected' | 'overridden'
  ) => {
    setActingId(decision.id);
    try {
      await aiApiClient.approveDecision({
        decisionId: decision.id,
        action,
        caseId: decision.refill_case_id ?? undefined,
        agentName: decision.agent_name,
        recommendation: decision.recommendation,
      });
      onUpdate();
    } finally {
      setActingId(null);
    }
  };

  if (isLoading) {
    return <Card className="p-8 text-center text-sm text-ink-500">Loading live AI decisions from Supabase…</Card>;
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-line bg-ice-50/50 px-5 py-3.5">
        <h3 className="font-semibold text-ink-900 text-sm">Recent AI Decisions (Live from Supabase)</h3>
        <p className="text-xs text-ink-500 mt-0.5">
          Showing verified AI agent recommendations with confidence scores and audit trail status.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-ice-50 text-left text-[11px] font-bold uppercase tracking-wider text-ink-500">
              <th className="px-5 py-3">Agent</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Reason</th>
              <th className="px-5 py-3">Confidence</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3 text-right">Human Review</th>
            </tr>
          </thead>
          <tbody>
            {decisions.map((d, i) => (
              <motion.tr
                key={d.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.04 * i }}
                className="border-b border-line last:border-0 hover:bg-ice-50/60"
              >
                <td className="px-5 py-3.5 font-semibold text-ink-900 whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <Bot className="size-4 text-brand-600" />
                    <span>{d.agent_name}</span>
                  </span>
                </td>
                <td className="px-5 py-3.5 font-medium text-ink-800">{d.recommendation}</td>
                <td className="px-5 py-3.5 text-xs text-ink-600 max-w-[260px]">{d.reasoning}</td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 border border-brand-200">
                    {d.confidence}%
                  </span>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase',
                      d.human_approval_status === 'APPROVED'
                        ? 'bg-ok-50 text-ok-700 border border-ok-200'
                        : d.human_approval_status === 'REJECTED'
                        ? 'bg-bad-50 text-bad-700 border border-bad-200'
                        : d.human_approval_status === 'OVERRIDDEN'
                        ? 'bg-warn-50 text-warn-700 border border-warn-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    )}
                  >
                    {d.human_approval_status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-ink-500 whitespace-nowrap tabular-nums">
                  {new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  {d.human_approval_status === 'APPROVED' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ok-700">
                      <Check className="size-3.5 text-ok-600" /> Approved
                    </span>
                  ) : d.human_approval_status === 'REJECTED' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-bad-700">
                      <X className="size-3.5 text-bad-600" /> Rejected
                    </span>
                  ) : d.human_approval_status === 'OVERRIDDEN' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-warn-700">
                      <Slash className="size-3.5 text-warn-600" /> Overridden
                    </span>
                  ) : (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={actingId === d.id}
                        onClick={() => void handleAction(d, 'approved')}
                        className="rounded-md bg-brand-700 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-brand-800 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={actingId === d.id}
                        onClick={() => void handleAction(d, 'rejected')}
                        className="rounded-md border border-line bg-white px-2 py-1 text-xs font-medium text-ink-700 transition hover:bg-bad-50 hover:text-bad-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── 3. Proactive Workflow Demo (Step 11) ───────────────────────────

function ProactiveWorkflowView() {
  const [activeStep, setActiveStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const runSimulation = async () => {
    setIsRunning(true);
    setCompleted(false);
    for (let i = 0; i < WORKFLOW_STEPS.length; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 450));
    }
    // Record final action in Supabase
    await aiApiClient.approveDecision({
      decisionId: 'demo-workflow-run',
      action: 'approved',
      agentName: 'Proactive Intake Agent',
      recommendation: 'Prevented silent medication lapse for John Demo (Metformin 500 mg)',
      risk: 'HIGH',
      note: 'Simulated workflow end-to-end execution verified with Supabase.',
    });
    setCompleted(true);
    setIsRunning(false);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Autonomous Pipeline</span>
          <h3 className="text-lg font-bold text-ink-900 mt-0.5">Proactive Silent-Lapse Prevention Workflow</h3>
          <p className="text-sm text-ink-500 mt-1 max-w-2xl">
            This end-to-end clinical workflow detects patient stockout risks before patients run out of medicine, computes lag, and queues proactive outreach for human approval.
          </p>
        </div>
        <button
          type="button"
          disabled={isRunning}
          onClick={() => void runSimulation()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 to-secondary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-50 active:scale-95 shrink-0"
        >
          <Sparkles className="size-4" />
          <span>{isRunning ? 'Running Pipeline…' : completed ? 'Re-run Workflow' : 'Execute Demo Workflow'}</span>
        </button>
      </div>

      {/* Step Flow Nodes */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {WORKFLOW_STEPS.map((step, index) => {
          const isPassed = activeStep > index || completed;
          const isCurrent = activeStep === index && isRunning;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.03 * index }}
              className={cn(
                'relative flex items-center gap-3 rounded-xl border p-3.5 transition-all',
                isCurrent
                  ? 'border-brand-500 bg-brand-50/80 shadow-md ring-2 ring-brand-300'
                  : isPassed
                  ? 'border-ok-300 bg-ok-50/60'
                  : 'border-line bg-white'
              )}
            >
              <div
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs',
                  isPassed
                    ? 'bg-ok-600 text-white'
                    : isCurrent
                    ? 'bg-brand-700 text-white animate-pulse'
                    : 'bg-ice-200 text-ink-500'
                )}
              >
                {isPassed ? <Check className="size-4" /> : index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'text-xs font-semibold leading-tight',
                    isPassed ? 'text-ok-900' : isCurrent ? 'text-brand-900' : 'text-ink-700'
                  )}
                >
                  {step}
                </p>
                <p className="text-[10.5px] text-ink-400 mt-0.5">
                  {index === 0 && 'Active script on file'}
                  {index === 1 && 'Supply: 2 days left'}
                  {index === 2 && 'Avg pharmacy lag: 5 days'}
                  {index === 3 && 'Lapse forecast: 100%'}
                  {index === 4 && 'Zero requests received'}
                  {index === 5 && 'High risk of silent gap'}
                  {index === 6 && 'Proactive agent flag'}
                  {index === 7 && 'Draft outreach prepared'}
                  {index === 8 && 'Clinician review & approve'}
                  {index === 9 && 'Dispatched notification'}
                  {index === 10 && 'Immutable audit entry'}
                  {index === 11 && 'Lapse prevented ✓'}
                </p>
              </div>

              {index < WORKFLOW_STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-ink-300">
                  <ArrowRight className="size-3" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-xl border border-ok-300 bg-ok-50 p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-6 text-ok-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-ok-900">Workflow Complete — Prevented Medication Lapse</p>
              <p className="text-xs text-ok-700">
                Action recorded to <code>agent_actions</code>, audit verified in <code>audit_logs</code>, and lapse prevented in <code>proactive_risks</code>.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-ok-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
            SUCCESS
          </span>
        </motion.div>
      )}
    </Card>
  );
}
