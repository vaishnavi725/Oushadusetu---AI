import { motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  Building2,
  CalendarDays,
  Pill,
  Shield,
  Sparkles,
  Stethoscope,
  UserRound,
  Zap,
} from 'lucide-react';
import type { PracticeCaseDetail } from '@shared/dto.ts';
import { cn } from '@/lib/format';

export function RefillDigitalTwin({ detail }: { detail: PracticeCaseDetail }) {
  const c = detail.case;
  const p = detail.patient;
  const rx = detail.prescription;
  const ph = detail.pharmacy;

  // Compute Digital Twin Properties
  const providerName = c.ownerName || 'Dr. Rajesh Kumar';
  const pharmacyName = ph?.name || 'OushadhaCare Pharmacy';
  const medication = rx ? `${rx.medicationName} ${rx.strength}` : c.medication;
  const patientName = c.patientName;

  // Current State, Blocker & Responsible Party
  const isEscalated = c.escalationLevel > 0 || c.slaState === 'breached';
  const isInsuranceBlocked = c.blockers.includes('INSURANCE_PA_REQUIRED') || c.status === 'WAITING_ON_INSURANCE';
  const isAppointmentRequired = c.blockers.includes('VISIT_REQUIRED') || c.status === 'WAITING_ON_PATIENT_VISIT';
  const isProviderApproval = c.status === 'WAITING_ON_PROVIDER';
  const isResolved = ['CLOSED', 'CANCELLED', 'DISPENSED', 'APPROVED'].includes(c.status);

  let currentState = 'Pharmacy Review';
  let responsibleParty = 'Pharmacy';
  let blocker = 'Prescription triage in progress';

  if (isResolved) {
    currentState = 'Resolved';
    responsibleParty = 'Completed';
    blocker = 'None (Refill Approved & Sent)';
  } else if (isEscalated) {
    currentState = 'Escalated';
    responsibleParty = 'Duty Nurse / Supervisor';
    blocker = 'Provider response overdue (> 48h)';
  } else if (isInsuranceBlocked) {
    currentState = 'Insurance Blocked';
    responsibleParty = 'Payer / Pharmacy';
    blocker = 'Prior authorization or updated card required';
  } else if (isAppointmentRequired) {
    currentState = 'Appointment Required';
    responsibleParty = 'Patient';
    blocker = 'Clinical visit / A1c lab test required';
  } else if (isProviderApproval) {
    currentState = 'Provider Approval Required';
    responsibleParty = 'Provider';
    blocker = 'No refills remaining on file';
  }

  // Risk & Resolution Probability
  const riskLevel = c.priority === 'URGENT' || isEscalated ? 'HIGH' : 'ROUTINE';
  const resolutionProbability = isResolved ? 100 : isEscalated ? 68 : isInsuranceBlocked ? 74 : 92;
  const nextAction = c.nextAction || (isProviderApproval ? 'Request provider approval.' : 'Review prescription status.');

  // Stepper Nodes
  const pipelineSteps = [
    { id: 'requested', label: 'Requested', desc: 'Pharmacy fax/EHR ingested' },
    { id: 'pharmacy', label: 'Pharmacy Review', desc: 'Stock & dosage verified' },
    { id: 'provider', label: 'Provider Approval', desc: 'Clinical evaluation' },
    { id: 'patient', label: 'Patient Action', desc: 'Outreach & consent' },
    { id: 'resolved', label: 'Resolved', desc: 'Dispense confirmed' },
  ];

  // Determine current active step index
  let activeIndex = 1;
  if (isResolved) activeIndex = 4;
  else if (isAppointmentRequired) activeIndex = 3;
  else if (isProviderApproval) activeIndex = 2;
  else if (isInsuranceBlocked || isEscalated) activeIndex = 2;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      aria-label="Refill Digital Twin"
      className="overflow-hidden rounded-2xl border border-[rgba(0,217,255,0.3)] bg-gradient-to-br from-[#06245A]/90 via-[#03132F]/90 to-[#06245A]/75 p-6 shadow-[0_8px_32px_rgba(3,19,47,0.7)] backdrop-blur-xl"
    >
      {/* Digital Twin Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(0,217,255,0.22)] pb-4.5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#087BFF] text-[#F5FAFF] shadow-[0_0_15px_rgba(0,217,255,0.4)] border border-[#00D9FF]/40">
            <Sparkles className="size-5 text-[#00D9FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-[#F5FAFF] tracking-tight">Refill Digital Twin</h2>
              <span className="rounded-full bg-[#087BFF]/20 border border-[#00D9FF]/50 px-2.5 py-0.5 text-xs font-bold text-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.2)]">
                Live State Tracking
              </span>
            </div>
            <p className="text-[13.5px] text-[#B8C7D9] font-normal mt-0.5">
              Autonomous clinical simulation and state machine grounded in EHR &amp; Supabase.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border shadow-sm',
              riskLevel === 'HIGH'
                ? 'bg-amber-950/85 text-amber-300 border-amber-500/50'
                : 'bg-cyan-950/85 text-cyan-300 border-cyan-500/50'
            )}
          >
            {riskLevel} RISK
          </span>
          <span className="rounded-full bg-emerald-950/85 text-emerald-300 border border-emerald-500/50 px-3 py-1 text-xs font-bold shadow-sm">
            Resolution Probability: {resolutionProbability}%
          </span>
        </div>
      </div>

      {/* Primary Entity Grid */}
      <div className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div className="rounded-xl border border-[rgba(0,217,255,0.22)] bg-[#03132F]/85 p-3.5 shadow-md">
          <span className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-[#B8C7D9]">
            <UserRound className="size-4 text-[#00D9FF]" /> Patient
          </span>
          <p className="mt-1.5 font-bold text-[#F5FAFF] text-[16px] truncate">{patientName}</p>
          <span className="text-[13px] text-[#00D9FF] font-mono">{p?.chartNumber || 'Chart on file'}</span>
        </div>

        <div className="rounded-xl border border-[rgba(0,217,255,0.22)] bg-[#03132F]/85 p-3.5 shadow-md">
          <span className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-[#B8C7D9]">
            <Pill className="size-4 text-[#00D9FF]" /> Medication
          </span>
          <p className="mt-1.5 font-bold text-[#F5FAFF] text-[16px] truncate">{medication}</p>
          <span className="text-[13px] text-[#00D9FF] font-medium">{rx?.sig || 'Daily maintenance'}</span>
        </div>

        <div className="rounded-xl border border-[rgba(0,217,255,0.22)] bg-[#03132F]/85 p-3.5 shadow-md">
          <span className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-[#B8C7D9]">
            <Stethoscope className="size-4 text-[#00D9FF]" /> Provider
          </span>
          <p className="mt-1.5 font-bold text-[#F5FAFF] text-[16px] truncate">{providerName}</p>
          <span className="text-[13px] text-[#B8C7D9]">Physician Reviewer</span>
        </div>

        <div className="rounded-xl border border-[rgba(0,217,255,0.22)] bg-[#03132F]/85 p-3.5 shadow-md">
          <span className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-[#B8C7D9]">
            <Building2 className="size-4 text-[#00D9FF]" /> Pharmacy
          </span>
          <p className="mt-1.5 font-bold text-[#F5FAFF] text-[16px] truncate">{pharmacyName}</p>
          <span className="text-[13px] text-[#B8C7D9]">Dispensing Partner</span>
        </div>
      </div>

      {/* Operational State & Blocker Detail */}
      <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
        <div className="rounded-xl border border-[rgba(0,217,255,0.3)] bg-[#06245A]/85 p-4 shadow-md">
          <span className="text-[13px] font-bold uppercase tracking-wider text-[#B8C7D9]">Current State</span>
          <p className="mt-1 font-bold text-[#F5FAFF] text-[17px]">{currentState}</p>
        </div>

        <div className="rounded-xl border border-amber-500/45 bg-amber-950/70 p-4 shadow-md">
          <span className="text-[13px] font-bold uppercase tracking-wider text-amber-300">Primary Blocker</span>
          <p className="mt-1 font-bold text-amber-100 text-[17px] truncate" title={blocker}>
            {blocker}
          </p>
        </div>

        <div className="rounded-xl border border-[#087BFF]/50 bg-[#06245A]/85 p-4 shadow-md">
          <span className="text-[13px] font-bold uppercase tracking-wider text-[#00D9FF]">Responsible Party</span>
          <p className="mt-1 font-bold text-[#F5FAFF] text-[17px]">{responsibleParty}</p>
        </div>
      </div>

      {/* Visual State Machine Stepper */}
      <div className="mt-5 rounded-2xl border border-[rgba(0,217,255,0.25)] bg-[#03132F]/90 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5FAFF] flex items-center gap-2">
            <Activity className="size-4 text-[#00D9FF]" /> Workflow State Machine
          </h3>
          <span className="text-[13.5px] text-[#B8C7D9]">
            Next Action: <strong className="text-[#00D9FF] font-bold">{nextAction}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 relative">
          {pipelineSteps.map((step, idx) => {
            const isCompleted = activeIndex > idx || isResolved;
            const isCurrent = activeIndex === idx && !isResolved;

            return (
              <div
                key={step.id}
                className={cn(
                  'relative rounded-xl border p-3 transition-all text-left',
                  isCompleted
                    ? 'border-emerald-500/50 bg-emerald-950/50 text-[#F5FAFF]'
                    : isCurrent
                    ? 'border-2 border-[#00D9FF] bg-[#06245A] text-[#F5FAFF] ring-2 ring-[#00D9FF]/40 shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                    : 'border-slate-800 bg-[#06245A]/35 text-[#8AA8CC]'
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'flex size-5.5 items-center justify-center rounded-full text-[11px] font-bold',
                      isCompleted
                        ? 'bg-emerald-500 text-[#03132F]'
                        : isCurrent
                        ? 'bg-[#00D9FF] text-[#03132F] animate-pulse'
                        : 'bg-slate-700 text-slate-300'
                    )}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </span>
                  {idx < pipelineSteps.length - 1 && (
                    <ArrowRight className="size-3.5 text-slate-500 hidden sm:block" />
                  )}
                </div>
                <p className="mt-2 text-[13.5px] font-bold text-[#F5FAFF]">{step.label}</p>
                <p className="text-[12px] text-[#B8C7D9] mt-0.5 leading-snug">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Alternative Branches / Exceptions */}
        {(isInsuranceBlocked || isAppointmentRequired || isEscalated) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-white/10 text-[13px]">
            <span className="font-bold text-[#F5FAFF]">Active Workflow Branch:</span>
            {isInsuranceBlocked && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 px-3 py-1 font-bold text-amber-300 text-xs">
                <Shield className="size-3.5" /> Insurance Blocked Branch
              </span>
            )}
            {isAppointmentRequired && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-950/80 border border-blue-500/50 px-3 py-1 font-bold text-blue-300 text-xs">
                <CalendarDays className="size-3.5" /> Appointment Required Branch
              </span>
            )}
            {isEscalated && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-950/80 border border-rose-500/50 px-3 py-1 font-bold text-rose-300 text-xs">
                <Zap className="size-3.5 text-rose-400" /> Escalated SLA Branch
              </span>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
