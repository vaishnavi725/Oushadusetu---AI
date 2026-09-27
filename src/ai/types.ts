export type AgentType =
  | 'intake'
  | 'risk'
  | 'resolution'
  | 'communication'
  | 'escalation'
  | 'audit';

export type AgentStatus = 'active' | 'monitoring' | 'ready' | 'waiting' | 'idle';

export type DecisionRisk = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type DecisionStatus = 'pending' | 'approved' | 'rejected' | 'overridden';

export interface AIDecision {
  id: string;
  timestamp: string;
  agentType: AgentType;
  agentName: string;
  finding: string;
  patientName: string;
  medication: string;
  daysRemaining?: number;
  historicalLag?: number;
  why: string;
  evidence: string[];
  confidence: number;
  recommendedAction: string;
  currentState: string;
  responsibleParty: string;
  risk: DecisionRisk;
  status: DecisionStatus;
  caseId?: string;
  decisionNote?: string;
}

export interface AgentInfo {
  id: AgentType;
  name: string;
  role: string;
  status: AgentStatus;
  statusLabel: string;
  description: string;
  decisionsCount: number;
  accuracy: number;
  lastAction: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  decision?: AIDecision;
  timestamp: string;
  suggestions?: string[];
  isLoading?: boolean;
}
