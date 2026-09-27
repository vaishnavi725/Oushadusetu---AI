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
      className="overflow-hidden rounded-2xl border border-teal-200/90 bg-gradient-to-br from-white via-teal-50/20 to-blue-50/30 p-5 shadow-sm"
    >
      {/* Digital Twin Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-xs">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-ink-900 tracking-tight">Refill Digital Twin</h2>
              <span className="rounded-full bg-teal-100/90 border border-teal-200 px-2 py-0.5 text-[11px] font-bold text-teal-900">
                Live State Tracking
              </span>
            </div>
            <p className="text-xs text-ink-500 font-normal">
              Autonomous clinical simulation and state machine grounded in EHR &amp; Supabase.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border',
              riskLevel === 'HIGH'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-teal-50 text-teal-800 border-teal-200'
            )}
          >
            {riskLevel} RISK
          </span>
          <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold">
            Resolution Probability: {resolutionProbability}%
          </span>
        </div>
      </div>

      {/* Primary Entity Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-line bg-white/90 p-3 shadow-2xs">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-ink-500">
            <UserRound className="size-3.5 text-teal-700" /> Patient
          </span>
          <p className="mt-1 font-bold text-ink-900 text-sm truncate">{patientName}</p>
          <span className="text-[11px] text-ink-500 font-mono">{p?.chartNumber || 'Chart on file'}</span>
        </div>

        <div className="rounded-xl border border-line bg-white/90 p-3 shadow-2xs">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-ink-500">
            <Pill className="size-3.5 text-blue-700" /> Medication
          </span>
          <p className="mt-1 font-bold text-ink-900 text-sm truncate">{medication}</p>
          <span className="text-[11px] text-ink-500">{rx?.sig || 'Daily maintenance'}</span>
        </div>

        <div className="rounded-xl border border-line bg-white/90 p-3 shadow-2xs">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-ink-500">
            <Stethoscope className="size-3.5 text-indigo-700" /> Provider
          </span>
          <p className="mt-1 font-bold text-ink-900 text-sm truncate">{providerName}</p>
          <span className="text-[11px] text-ink-500">Physician Reviewer</span>
        </div>

        <div className="rounded-xl border border-line bg-white/90 p-3 shadow-2xs">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-ink-500">
            <Building2 className="size-3.5 text-emerald-700" /> Pharmacy
          </span>
          <p className="mt-1 font-bold text-ink-900 text-sm truncate">{pharmacyName}</p>
          <span className="text-[11px] text-ink-500">Dispensing Partner</span>
        </div>
      </div>

      {/* Operational State & Blocker Detail */}
      <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-teal-200/80 bg-teal-50/50 p-3">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-teal-800">Current State</span>
          <p className="mt-0.5 font-bold text-teal-950 text-[13px]">{currentState}</p>
        </div>

        <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-800">Primary Blocker</span>
          <p className="mt-0.5 font-semibold text-amber-950 text-[13px] truncate" title={blocker}>
            {blocker}
          </p>
        </div>

        <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-3">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-blue-800">Responsible Party</span>
          <p className="mt-0.5 font-bold text-blue-950 text-[13px]">{responsibleParty}</p>
        </div>
      </div>

      {/* Visual State Machine Stepper */}
      <div className="mt-5 rounded-xl border border-line bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-700 flex items-center gap-1.5">
            <Activity className="size-3.5 text-teal-700" /> Workflow State Machine
          </h3>
          <span className="text-[11.5px] text-ink-500">
            Next Action: <strong className="text-teal-900 font-semibold">{nextAction}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
          {pipelineSteps.map((step, idx) => {
            const isCompleted = activeIndex > idx || isResolved;
            const isCurrent = activeIndex === idx && !isResolved;

            return (
              <div
                key={step.id}
                className={cn(
                  'relative rounded-xl border p-2.5 transition-all text-left',
                  isCompleted
                    ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950'
                    : isCurrent
                    ? 'border-teal-500 bg-teal-50/80 text-teal-950 ring-2 ring-teal-200'
                    : 'border-slate-200 bg-slate-50/60 text-slate-500'
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded-full text-[10px] font-bold',
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-teal-700 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-600'
                    )}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </span>
                  {idx < pipelineSteps.length - 1 && (
                    <ArrowRight className="size-3 text-slate-300 hidden sm:block" />
                  )}
                </div>
                <p className="mt-1.5 text-xs font-bold">{step.label}</p>
                <p className="text-[10px] opacity-75 mt-0.5 leading-snug">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Alternative Branches / Exceptions */}
        {(isInsuranceBlocked || isAppointmentRequired || isEscalated) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 pt-2.5 border-t border-line text-xs">
            <span className="font-semibold text-ink-600">Active Workflow Branch:</span>
            {isInsuranceBlocked && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 font-bold text-amber-800 text-[11px]">
                <Shield className="size-3" /> Insurance Blocked Branch
              </span>
            )}
            {isAppointmentRequired && (
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 font-bold text-blue-800 text-[11px]">
                <CalendarDays className="size-3" /> Appointment Required Branch
              </span>
            )}
            {isEscalated && (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 font-bold text-rose-800 text-[11px]">
                <Zap className="size-3 text-rose-600" /> Escalated SLA Branch
              </span>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
