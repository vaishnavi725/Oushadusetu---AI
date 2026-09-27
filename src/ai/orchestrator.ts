import type { AIDecision, AgentInfo, AIMessage, DecisionStatus } from './types';
import { intakeAgentInfo } from './agents/intakeAgent';
import { riskAgentInfo, runProactiveRiskCheck } from './agents/riskAgent';
import { resolutionAgentInfo, runResolutionAnalysis } from './agents/resolutionAgent';
import { communicationAgentInfo, runCommunicationDraft } from './agents/communicationAgent';
import { escalationAgentInfo, runEscalationCheck } from './agents/escalationAgent';
import { auditAgentInfo } from './agents/auditAgent';
import { aiApiClient } from '@/services/aiApiClient';

export const ALL_AGENTS: AgentInfo[] = [
  intakeAgentInfo,
  riskAgentInfo,
  resolutionAgentInfo,
  communicationAgentInfo,
  escalationAgentInfo,
  auditAgentInfo,
];

// Initial seeded recent decisions for human review
let recentDecisions: AIDecision[] = [
  runProactiveRiskCheck('John Demo', 'Metformin 500 mg', 2, 5),
  runResolutionAnalysis('John Demo', 'Metformin 500 mg'),
  runEscalationCheck('Marcus Brody', 'Levothyroxine 75mcg'),
  runCommunicationDraft('David Kim', 'Atorvastatin 40mg', 'patient'),
];

export const aiOrchestrator = {
  async getAgents(): Promise<AgentInfo[]> {
    return aiApiClient.getAgents();
  },

  getDecisions(): AIDecision[] {
    return [...recentDecisions];
  },

  async updateDecisionStatus(
    id: string,
    status: DecisionStatus,
    note?: string,
    context?: { caseId?: string; agentName?: string; recommendation?: string; risk?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' }
  ): Promise<AIDecision | null> {
    const idx = recentDecisions.findIndex((d) => d.id === id);
    const current = idx !== -1 ? recentDecisions[idx] : null;

    if (idx !== -1) {
      recentDecisions[idx] = {
        ...recentDecisions[idx],
        status,
        decisionNote: note,
      };
    }

    // Persist to backend API & Supabase audit trail
    await aiApiClient.approveDecision({
      decisionId: id,
      action: status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'overridden',
      note,
      caseId: context?.caseId || current?.caseId,
      agentName: context?.agentName || current?.agentName || 'Resolution Agent',
      recommendation: context?.recommendation || current?.recommendedAction || 'Action taken',
      risk: context?.risk || current?.risk || 'HIGH',
    });

    return current;
  },

  async ask(
    question: string,
    context?: { caseId?: string; patientName?: string; medication?: string }
  ): Promise<AIMessage> {
    // Attempt call via backend API
    const response = await aiApiClient.ask(question, context);

    if (response.decision) {
      // Keep in local cache for immediate human review queue
      recentDecisions = [response.decision, ...recentDecisions.slice(0, 9)];
    }

    return response;
  },
};
