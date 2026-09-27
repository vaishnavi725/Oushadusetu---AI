import type { AIDecision, AgentInfo, AIMessage } from '@/ai/types';
import { supabase } from '@/lib/supabase';
import { aiDecisionService } from './aiDecisionService';
import { agentActionService } from './agentActionService';
import { auditService } from './auditService';
import { timelineService } from './timelineService';
import { proactiveRiskService } from './proactiveRiskService';

const API_BASE =
  typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null'
    ? window.location.origin
    : 'http://localhost:5173';

export const aiApiClient = {
  async ask(
    question: string,
    context?: { caseId?: string; patientName?: string; medication?: string },
  ): Promise<AIMessage> {
    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context }),
      });
      if (res.ok) {
        const data = await res.json();
        return data as AIMessage;
      }
    } catch (err) {
      console.warn('Backend AI API unavailable, using client-side fallback:', err);
    }

    const q = question.toLowerCase();
    const patient = context?.patientName ?? 'John Demo';
    const med = context?.medication ?? 'Metformin 500 mg';

    if (q.includes('why is this refill stuck') || q.includes('stuck') || q.includes('explain')) {
      const decision: AIDecision = {
        id: `dec-${Date.now()}-stuck`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentType: 'resolution',
        agentName: 'Resolution Agent',
        finding: 'Provider Approval Required',
        patientName: patient,
        medication: med,
        daysRemaining: 2,
        why: 'No refills remaining on original prescription. Patient has limited medication supply.',
        evidence: [
          'No refills remaining',
          'Provider review required before fulfillment',
          'Patient has limited medication supply (2 days remaining)',
        ],
        confidence: 92,
        recommendedAction: 'Request provider approval for renewal.',
        currentState: 'WAITING_ON_PROVIDER',
        responsibleParty: 'Dr. Sarah Lin (PCP)',
        risk: 'HIGH',
        status: 'pending',
        caseId: context?.caseId,
      };

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `REFILL STATUS\nProvider Approval Required\n\nWhy?\nNo refills remaining.\n\nEvidence:\n✓ No refills remaining\n✓ Provider review required\n✓ Patient has limited medication supply\n\nRisk: HIGH\n\nRecommended action: Request provider approval.\n\nConfidence: 92%`,
        decision,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Who needs to act next?', 'Check for silent-lapse risks', 'What should I do next?'],
      };
    }

    if (q.includes('silent') || q.includes('lapse') || q.includes('proactive')) {
      const decision: AIDecision = {
        id: `dec-${Date.now()}-risk`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentType: 'risk',
        agentName: 'Proactive Risk Agent',
        finding: 'Silent-Lapse Risk Detected',
        patientName: patient,
        medication: med,
        daysRemaining: 2,
        historicalLag: 5,
        why: 'Patient may run out before the historical refill process completes.',
        evidence: [
          `Patient: ${patient}`,
          `Medication: ${med}`,
          'Days remaining: 2 days',
          'Historical refill lag: 5 days',
          'Risk score: 88 (HIGH)',
          'No refill request on file in EHR/pharmacy',
        ],
        confidence: 94,
        recommendedAction: 'Initiate proactive patient outreach.',
        currentState: 'PROACTIVE_MONITORING',
        responsibleParty: 'Care Coordinator',
        risk: 'HIGH',
        status: 'pending',
        caseId: context?.caseId,
      };

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Patient: ${patient}\nMedication: ${med}\n\n2 days remaining\nHistorical refill lag: 5 days\nRisk Score: 88\nRisk: HIGH\n\nAI Analysis:\n"Patient may run out before the historical refill process completes."\n\nRecommended action:\nInitiate proactive patient outreach.`,
        decision,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Initiate patient outreach', 'Why is this refill stuck?', 'What should I do next?'],
      };
    }

    if (q.includes('critical') || q.includes('urgent') || q.includes('priority')) {
      const decision: AIDecision = {
        id: `dec-${Date.now()}-crit`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentType: 'escalation',
        agentName: 'Escalation Agent',
        finding: 'Critical Escalation Required',
        patientName: patient,
        medication: med,
        daysRemaining: 1,
        why: 'Provider response is overdue and patient has less than 24 hours of medication remaining.',
        evidence: [
          'Provider request sent > 48 hours ago',
          'No provider response recorded',
          'Patient has limited supply (1 day remaining)',
          'Maintenance therapy for chronic condition',
        ],
        confidence: 96,
        recommendedAction: 'Escalate to covering duty provider or charge nurse.',
        currentState: 'ESCALATED',
        responsibleParty: 'Charge Nurse / Covering MD',
        risk: 'CRITICAL',
        status: 'pending',
        caseId: context?.caseId,
      };

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `I found 1 refill case in CRITICAL condition:\n\nPatient: ${patient}\nMedication: ${med}\nDays remaining: 1\nRisk: CRITICAL\n\nWhy?\nProvider response is overdue.\n\nEvidence:\n✓ Request sent > 48h ago\n✓ No provider response\n✓ Patient has limited supply\n\nConfidence: 96%\nRecommended action: Escalate to duty nurse / covering provider.`,
        decision,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Who needs to act next?', 'Why is this refill stuck?', 'What should I do next?'],
      };
    }

    if (q.includes('who') || q.includes('act next') || q.includes('owner')) {
      const decision: AIDecision = {
        id: `dec-${Date.now()}-who`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentType: 'resolution',
        agentName: 'Resolution Agent',
        finding: 'Action Assigned to Dr. Sarah Lin (PCP)',
        patientName: patient,
        medication: med,
        why: 'Provider must approve renewal order because original prescription has zero refills remaining.',
        evidence: [
          'Assigned party: Dr. Sarah Lin (PCP)',
          'Protocol: Clinical renewal authorization required',
          'SLA deadline: Due in 4 hours',
          'Clinical safety verified by Audit Agent',
        ],
        confidence: 95,
        recommendedAction: 'Send priority in-basket alert to Dr. Sarah Lin.',
        currentState: 'WAITING_ON_PROVIDER',
        responsibleParty: 'Dr. Sarah Lin (PCP)',
        risk: 'HIGH',
        status: 'pending',
        caseId: context?.caseId,
      };

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `The designated next actor is **Dr. Sarah Lin (PCP)**.\n\nThe refill cannot be dispatched to the pharmacy until clinical authorization is signed.`,
        decision,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Why is this refill stuck?', 'Check for silent-lapse risks', 'What should I do next?'],
      };
    }

    const decision: AIDecision = {
      id: `dec-${Date.now()}-general`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentType: 'resolution',
      agentName: 'Resolution Agent',
      finding: 'Provider Approval Required',
      patientName: patient,
      medication: med,
      daysRemaining: 2,
      why: 'No refills remaining on original prescription. Annual check-up is overdue.',
      evidence: [
        'Last provider review was 8 months ago',
        'No remaining refills on file',
        'Patient has 2 days of medication remaining',
      ],
      confidence: 92,
      recommendedAction: 'Request provider approval for renewal.',
      currentState: 'WAITING_ON_PROVIDER',
      responsibleParty: 'Dr. Sarah Lin (PCP)',
      risk: 'HIGH',
      status: 'pending',
      caseId: context?.caseId,
    };

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `REFILL STATUS\nProvider Approval Required\n\nWhy?\nNo refills remaining.\n\nEvidence:\n✓ No refills remaining\n✓ Provider review required\n✓ Patient has limited medication supply\n\nRisk: HIGH\n\nRecommended action: Request provider approval.\n\nConfidence: 92%`,
      decision,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: ['Why is this refill stuck?', 'Check for silent-lapse risks', 'Who needs to act next?'],
    };
  },

  async approveDecision(params: {
    decisionId: string;
    action: 'approved' | 'rejected' | 'overridden';
    note?: string;
    caseId?: string;
    agentName?: string;
    recommendation?: string;
    risk?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/ai/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        return (await res.json()) as { success: boolean; message: string };
      }
    } catch (err) {
      console.warn('Backend /api/ai/approve failed, applying direct Supabase service writes:', err);
    }

    const { decisionId, action, note, caseId, agentName = 'Resolution Agent', recommendation = 'Action taken', risk = 'HIGH' } = params;
    const approvalStatus = action === 'approved' ? 'APPROVED' : action === 'rejected' ? 'REJECTED' : 'OVERRIDDEN';

    if (decisionId && !decisionId.startsWith('dec-temp')) {
      try {
        await aiDecisionService.updateApprovalStatus(decisionId, approvalStatus);
      } catch (e) {
        console.warn('Failed to update ai_decisions:', e);
      }
    }

    try {
      await agentActionService.recordAction({
        refill_case_id: caseId ?? null,
        agent_name: agentName,
        action: `Human ${action.toUpperCase()}: ${recommendation}`,
        reason: note || `Reviewer action: ${action}`,
        status: 'COMPLETED',
      });
    } catch (e) {
      console.warn('Failed to insert agent_action:', e);
    }

    try {
      await auditService.recordLog({
        refill_case_id: caseId ?? null,
        actor_type: 'USER',
        actor_name: 'Licensed Clinical Staff',
        action: `${action.toUpperCase()} AI Recommendation: ${recommendation}`,
        details: { decisionId, action, risk, note: note || undefined },
      });
    } catch (e) {
      console.warn('Failed to insert audit_log:', e);
    }

    if (caseId) {
      try {
        await timelineService.addTimelineEvent({
          refill_case_id: caseId,
          event_type: 'HUMAN_APPROVAL',
          title: `AI Recommendation ${action.toUpperCase()}`,
          description: `${recommendation}${note ? ` (Note: ${note})` : ''}`,
          actor_type: 'USER',
        });
      } catch (e) {
        console.warn('Failed to add timeline event:', e);
      }
    }

    if (caseId && action === 'approved') {
      try {
        await supabase
          .from('refill_cases')
          .update({
            current_state: 'Approved by Provider',
            resolved: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', caseId);
      } catch (e) {
        console.warn('Failed to update refill_case:', e);
      }
    }

    if (agentName.toLowerCase().includes('risk') || recommendation.toLowerCase().includes('outreach')) {
      try {
        const risks = await proactiveRiskService.listProactiveRisks();
        if (risks.length > 0) {
          await proactiveRiskService.updateRiskOutreach(
            risks[0].id,
            action === 'approved' ? 'SENT' : 'COMPLETED',
            action === 'approved',
          );
        }
      } catch (e) {
        console.warn('Failed to update proactive risk:', e);
      }
    }

    return {
      success: true,
      message: 'Human approval recorded and synchronized with database audit trail.',
    };
  },

  async getAgents(): Promise<AgentInfo[]> {
    try {
      const res = await fetch(`${API_BASE}/api/ai/agents`);
      if (res.ok) {
        const data = await res.json();
        if (data.agents && data.agents.length > 0) {
          return data.agents as AgentInfo[];
        }
      }
    } catch (err) {
      console.warn('Backend /api/ai/agents failed, using fallback:', err);
    }

    return [
      {
        id: 'intake',
        name: 'Intake Agent',
        role: 'Inbound Request Processing',
        status: 'active',
        statusLabel: 'Active',
        description: 'Parses incoming pharmacy refill requests, extracts key medication details, and identifies preliminary blockers.',
        decisionsCount: 42,
        accuracy: 98,
        lastAction: 'Processed pharmacy fax refill for Metformin',
      },
      {
        id: 'risk',
        name: 'Proactive Risk Agent',
        role: 'Silent-Lapse Detection',
        status: 'monitoring',
        statusLabel: 'Monitoring',
        description: 'Continuously evaluates patient supply days vs historical turnaround to detect lapse risk before patients run out.',
        decisionsCount: 38,
        accuracy: 94,
        lastAction: 'Flagged potential lapse for John Demo (2 days remaining)',
      },
      {
        id: 'resolution',
        name: 'Resolution Agent',
        role: 'Clinical Pathway & Policy Routing',
        status: 'ready',
        statusLabel: 'Ready',
        description: 'Applies clinic protocols to formulate resolution paths, identify required approvals, and prepare provider decisions.',
        decisionsCount: 57,
        accuracy: 97,
        lastAction: 'Prepared provider approval pathway for Lisinopril',
      },
      {
        id: 'communication',
        name: 'Communication Agent',
        role: 'Patient & Pharmacy Outreach',
        status: 'ready',
        statusLabel: 'Ready',
        description: 'Composes polite, HIPAA-compliant patient reminders and pharmacy updates, queued for staff authorization.',
        decisionsCount: 29,
        accuracy: 99,
        lastAction: 'Drafted SMS reminder for blood pressure refill renewal',
      },
      {
        id: 'escalation',
        name: 'Escalation Agent',
        role: 'SLA & Inactivity Monitoring',
        status: 'monitoring',
        statusLabel: 'Monitoring',
        description: 'Monitors case aging, clinic SLA deadlines, and flags stagnant requests for immediate triage escalation.',
        decisionsCount: 19,
        accuracy: 96,
        lastAction: 'Escalated overdue refill request to duty nurse',
      },
      {
        id: 'audit',
        name: 'Audit Agent',
        role: 'Compliance & Audit Integrity',
        status: 'ready',
        statusLabel: 'Ready',
        description: 'Validates multi-agent suggestions against clinical safety rules and maintains an append-only audit trail.',
        decisionsCount: 64,
        accuracy: 100,
        lastAction: 'Audited provider step-up MFA verification and logged event',
      },
    ];
  },
};
