import type { AIDecision, AgentInfo } from '../types';

export const communicationAgentInfo: AgentInfo = {
  id: 'communication',
  name: 'Communication Agent',
  role: 'Patient & Pharmacy Outreach',
  status: 'waiting',
  statusLabel: 'Waiting for Approval',
  description: 'Composes polite, HIPAA-compliant patient reminders and pharmacy updates, queued for staff authorization.',
  decisionsCount: 29,
  accuracy: 99,
  lastAction: 'Drafted SMS reminder for blood pressure refill renewal',
};

export function runCommunicationDraft(
  patient = 'David Kim',
  medication = 'Atorvastatin 40mg',
  recipient: 'patient' | 'pharmacy' = 'patient'
): AIDecision {
  const isPatient = recipient === 'patient';
  return {
    id: `dec-${Date.now()}-comm`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    agentType: 'communication',
    agentName: 'Communication Agent',
    finding: isPatient ? 'Drafted Patient Proactive Reminder' : 'Drafted Pharmacy Clarification Note',
    patientName: patient,
    medication: medication,
    why: isPatient
      ? `Patient is within 5 days of running out of ${medication}. Automated outreach helps prevent lapse.`
      : `Pharmacy requested clarification on pill strength.`,
    evidence: [
      `Recipient verified: ${patient}`,
      'HIPAA minimum-necessary standards verified',
      'Preferred communication channel: SMS (+1 555-0192)',
      'Requires staff approval before message dispatch',
    ],
    confidence: 95,
    recommendedAction: isPatient
      ? 'Approve and dispatch SMS: "Hi David, your clinic noticed your Atorvastatin is due for renewal..."'
      : 'Send dosage confirmation to CVS Pharmacy #4218',
    currentState: 'WAITING_ON_APPROVAL',
    responsibleParty: 'Clinic Nurse / Coordinator',
    risk: 'MEDIUM',
    status: 'pending',
  };
}
