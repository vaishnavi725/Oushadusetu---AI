export type RefillScene = {
  id: string;
  state: string;
  lane: string;
  med: string;
  caseId: string;
  owner: string;
  ownerRole: string;
  blocker: string;
  missing: string;
  next: string;
  priority: 'Critical' | 'Watch' | 'Clear';
  days: number;
  confidence: number;
  human: boolean;
  reasons: string[];
  timeline: { time: string; label: string; done: boolean }[];
};

export const REFILL_SCENES: RefillScene[] = [
  {
    id: 'requested',
    state: 'Refill requested',
    lane: 'Intake',
    med: 'Lisinopril 10 mg',
    caseId: 'RX-34891',
    owner: 'Highland Pharmacy',
    ownerRole: 'Pharmacy',
    blocker: 'None yet',
    missing: 'Clinical policy check',
    next: 'Match the patient and read remaining refills',
    priority: 'Watch',
    days: 0,
    confidence: 97,
    human: false,
    reasons: ['Request received from the pharmacy', 'Patient identity matched', 'Last fill was 28 days ago'],
    timeline: [
      { time: '08:02', label: 'Request created', done: true },
      { time: '08:02', label: 'Patient matched', done: true },
      { time: '—', label: 'Policy check', done: false },
    ],
  },
  {
    id: 'provider',
    state: 'Waiting on provider',
    lane: 'Clinical review',
    med: 'Lisinopril 10 mg',
    caseId: 'RX-34891',
    owner: 'Dr. Anika Rao',
    ownerRole: 'Provider',
    blocker: 'No refills remaining',
    missing: 'A signed renewal',
    next: 'Approve a 90-day renewal, or book a visit',
    priority: 'Critical',
    days: 4,
    confidence: 92,
    human: true,
    reasons: ['Zero refills left on the last order', 'Last visit was 9 months ago', 'Clinic policy requires a visit every 6 months'],
    timeline: [
      { time: 'Mon', label: 'Request created', done: true },
      { time: 'Mon', label: 'Pharmacy review', done: true },
      { time: 'Tue', label: 'Provider task opened', done: true },
      { time: '—', label: 'Awaiting signature', done: false },
    ],
  },
  {
    id: 'approved',
    state: 'Approved',
    lane: 'Human decision',
    med: 'Lisinopril 10 mg',
    caseId: 'RX-34891',
    owner: 'Highland Pharmacy',
    ownerRole: 'Pharmacy',
    blocker: 'Cleared',
    missing: 'Dispense confirmation',
    next: 'Release the fill to the pharmacy',
    priority: 'Watch',
    days: 4,
    confidence: 99,
    human: false,
    reasons: ['Dr. Rao approved a 90-day supply', 'Follow-up scheduled in 5 months', 'Decision written to the audit log'],
    timeline: [
      { time: 'Tue', label: 'Task opened', done: true },
      { time: '09:14', label: 'Provider approved', done: true },
      { time: '09:14', label: 'Audit recorded', done: true },
      { time: '—', label: 'Pharmacy fill', done: false },
    ],
  },
  {
    id: 'insurance',
    state: 'Waiting on insurance',
    lane: 'Coverage',
    med: 'Atorvastatin 40 mg',
    caseId: 'RX-35102',
    owner: 'CityCare Billing',
    ownerRole: 'Practice staff',
    blocker: 'Formulary rejection',
    missing: 'A covered alternative or an override',
    next: 'Send the payer the diagnosis already on file',
    priority: 'Watch',
    days: 2,
    confidence: 88,
    human: true,
    reasons: ['Claim rejected for quantity limit', 'Chart already has the supporting diagnosis', 'AI drafted the payer note for review'],
    timeline: [
      { time: 'Wed', label: 'Claim rejected', done: true },
      { time: 'Wed', label: 'Note drafted', done: true },
      { time: '—', label: 'Staff sends note', done: false },
    ],
  },
  {
    id: 'resolved',
    state: 'Resolved',
    lane: 'Complete',
    med: 'Lisinopril 10 mg',
    caseId: 'RX-34891',
    owner: 'Patient',
    ownerRole: 'Patient',
    blocker: 'None',
    missing: 'Nothing',
    next: 'Watch the next supply window',
    priority: 'Clear',
    days: 0,
    confidence: 99,
    human: false,
    reasons: ['Pharmacy confirmed the fill', 'Patient notified by text', 'Supply covers 90 days'],
    timeline: [
      { time: '09:14', label: 'Approved', done: true },
      { time: '11:40', label: 'Dispensed', done: true },
      { time: '11:41', label: 'Patient updated', done: true },
    ],
  },
];
