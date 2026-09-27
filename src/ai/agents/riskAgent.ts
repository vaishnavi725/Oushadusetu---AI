import type { AIDecision, AgentInfo } from '../types';

export const riskAgentInfo: AgentInfo = {
  id: 'risk',
  name: 'Proactive Risk Agent',
  role: 'Silent-Lapse Detection',
  status: 'monitoring',
  statusLabel: 'Monitoring',
  description: 'Continuously evaluates patient supply days vs historical turnaround to detect lapse risk before patients run out.',
  decisionsCount: 38,
  accuracy: 94,
  lastAction: 'Flagged potential lapse for John Smith (4 days remaining)',
};

export function runProactiveRiskCheck(
  patient = 'John Smith',
  medication = 'Metformin 500mg',
  daysRemaining = 4,
  historicalLag = 6
): AIDecision {
  const isLapse = daysRemaining < historicalLag;
  return {
    id: `dec-${Date.now()}-risk`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    agentType: 'risk',
    agentName: 'Proactive Risk Agent',
    finding: isLapse ? 'Potential silent medication lapse detected' : 'Patient medication supply is stable',
    patientName: patient,
    medication: medication,
    daysRemaining,
    historicalLag,
    why: isLapse
      ? `Patient has ${daysRemaining} days of medication remaining, but average refill lag is ${historicalLag} days with no active refill request.`
      : `Patient has sufficient buffer supply (${daysRemaining} days remaining).`,
    evidence: [
      `Days remaining: ${daysRemaining} days`,
      `Historical refill processing time: ${historicalLag} days`,
      'Active refill request: None in system',
      'High-adherence maintenance drug (Type 2 Diabetes)',
    ],
    confidence: 91,
    recommendedAction: isLapse ? 'Initiate proactive patient outreach' : 'Continue passive monitoring',
    currentState: 'PROACTIVE_MONITORING',
    responsibleParty: 'Care Coordinator',
    risk: isLapse ? (daysRemaining <= 2 ? 'CRITICAL' : 'HIGH') : 'LOW',
    status: 'pending',
  };
}
