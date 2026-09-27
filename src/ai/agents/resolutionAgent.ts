import type { AIDecision, AgentInfo } from '../types';

export const resolutionAgentInfo: AgentInfo = {
  id: 'resolution',
  name: 'Resolution Agent',
  role: 'Clinical Pathway & Policy Routing',
  status: 'ready',
  statusLabel: 'Ready',
  description: 'Applies clinic protocols to formulate resolution paths, identify required approvals, and prepare provider decisions.',
  decisionsCount: 57,
  accuracy: 97,
  lastAction: 'Prepared provider approval pathway for Lisinopril',
};

export function runResolutionAnalysis(
  patient = 'Eleanor Vance',
  medication = 'Lisinopril 20mg'
): AIDecision {
  return {
    id: `dec-${Date.now()}-res`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    agentType: 'resolution',
    agentName: 'Resolution Agent',
    finding: 'Provider Approval Required',
    patientName: patient,
    medication: medication,
    daysRemaining: 2,
    why: 'No refills remaining on original prescription. Annual check-up is overdue.',
    evidence: [
      'Last provider review was 8 months ago',
      'No remaining refills on file',
      'Patient has 2 days of medication remaining',
      'Blood pressure stabilized at last visit (124/80)',
    ],
    confidence: 92,
    recommendedAction: 'Request provider approval for 90-day renewal with lab order',
    currentState: 'WAITING_ON_PROVIDER',
    responsibleParty: 'Dr. Sarah Lin (PCP)',
    risk: 'HIGH',
    status: 'pending',
  };
}
