import type { AIDecision, AgentInfo } from '../types';

export const intakeAgentInfo: AgentInfo = {
  id: 'intake',
  name: 'Intake Agent',
  role: 'Inbound Request Processing',
  status: 'active',
  statusLabel: 'Active',
  description: 'Parses incoming pharmacy refill requests, extracts key medication details, and identifies preliminary blockers.',
  decisionsCount: 42,
  accuracy: 98,
  lastAction: 'Processed pharmacy fax refill for Metformin',
};

export function runIntakeAnalysis(patient: string, medication: string): AIDecision {
  return {
    id: `dec-${Date.now()}-intake`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    agentType: 'intake',
    agentName: 'Intake Agent',
    finding: 'New refill request parsed and triaged',
    patientName: patient,
    medication: medication,
    why: 'Incoming fax had complete dosage and quantity info matching patient record.',
    evidence: [
      'Patient identity matched in EHR (100% confidence)',
      'Medication and dosage confirmed against active profile',
      'No controlled substance flags detected',
    ],
    confidence: 96,
    recommendedAction: 'Route to clinical triage queue',
    currentState: 'TRIAGE',
    responsibleParty: 'Practice Staff',
    risk: 'LOW',
    status: 'approved',
  };
}
