import type { AIDecision, AgentInfo } from '../types';

export const escalationAgentInfo: AgentInfo = {
  id: 'escalation',
  name: 'Escalation Agent',
  role: 'SLA & Inactivity Monitoring',
  status: 'monitoring',
  statusLabel: 'Monitoring SLAs',
  description: 'Monitors case aging, clinic SLA deadlines, and flags stagnant requests for immediate triage escalation.',
  decisionsCount: 19,
  accuracy: 96,
  lastAction: 'Escalated overdue refill request to duty nurse',
};

export function runEscalationCheck(
  patient = 'Marcus Brody',
  medication = 'Levothyroxine 75mcg'
): AIDecision {
  return {
    id: `dec-${Date.now()}-esc`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    agentType: 'escalation',
    agentName: 'Escalation Agent',
    finding: 'Escalate to Duty Nurse / Backup Provider',
    patientName: patient,
    medication: medication,
    daysRemaining: 1,
    why: 'No provider response for 48 hours and patient supply expires tomorrow.',
    evidence: [
      'Provider request sent 48 hours ago',
      'No response or acknowledgment recorded',
      'Patient has only 1 day supply remaining',
      'Thyroid hormone replacement therapy is time-critical',
    ],
    confidence: 94,
    recommendedAction: 'Reassign case immediately to on-call clinical nurse lead',
    currentState: 'ESCALATED',
    responsibleParty: 'Nurse Supervisor / Back-up MD',
    risk: 'CRITICAL',
    status: 'pending',
  };
}
