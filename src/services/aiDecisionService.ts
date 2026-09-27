import { supabase } from '@/lib/supabase';

export interface AiDecisionRecord {
  id: string;
  refill_case_id?: string | null;
  proactive_risk_id?: string | null;
  agent_name: string;
  decision_type: string;
  recommendation: string;
  reasoning: string;
  confidence: number;
  evidence: string[];
  human_approval_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'OVERRIDDEN';
  created_at: string;
}

export const aiDecisionService = {
  async listAiDecisions(caseId?: string): Promise<AiDecisionRecord[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      let query = supabase.from('ai_decisions').select('*').order('created_at', { ascending: false });
      if (caseId) {
        query = query.eq('refill_case_id', caseId);
      }
      const { data, error } = await query;
      if (!error) {
        return (data || []).map((d: any) => ({
          id: d.id,
          refill_case_id: d.refill_case_id,
          proactive_risk_id: d.proactive_risk_id,
          agent_name: d.agent_name ?? 'Resolution Agent',
          decision_type: d.decision_type ?? 'NEXT_BEST_ACTION',
          recommendation: d.recommendation,
          reasoning: d.reasoning,
          confidence: d.confidence ?? 90,
          evidence: Array.isArray(d.evidence) ? d.evidence : typeof d.evidence === 'string' ? JSON.parse(d.evidence) : [],
          human_approval_status: d.human_approval_status ?? 'PENDING',
          created_at: d.created_at,
        }));
      }
      return [];
    }

    // Default mock AI decisions
    return [
      {
        id: 'ai-dec-1',
        refill_case_id: caseId ?? 'case-1',
        agent_name: 'Proactive Risk Agent',
        decision_type: 'SILENT_LAPSE_PREVENTION',
        recommendation: 'Initiate proactive patient outreach before stockout.',
        reasoning: 'Days remaining is 4 while historical refill processing lag is 6 days.',
        confidence: 94,
        evidence: [
          'No inbound refill request received',
          'Current supply remaining: 4 days',
          'Pharmacy fulfillment lag: 6 days',
        ],
        human_approval_status: 'PENDING',
        created_at: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'ai-dec-2',
        refill_case_id: caseId ?? 'case-2',
        agent_name: 'Resolution Agent',
        decision_type: 'PROVIDER_APPROVAL',
        recommendation: 'Request provider approval for 90-day maintenance supply.',
        reasoning: 'Last annual review occurred 8 months ago, patient is stable on current regimen.',
        confidence: 92,
        evidence: [
          'Last clinic review was 8 months ago',
          'Zero refills remaining on existing script',
          'No drug interactions detected',
        ],
        human_approval_status: 'APPROVED',
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
  },

  async updateApprovalStatus(
    decisionId: string,
    status: 'APPROVED' | 'REJECTED' | 'OVERRIDDEN'
  ): Promise<void> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      await supabase
        .from('ai_decisions')
        .update({ human_approval_status: status })
        .eq('id', decisionId);
    }
  },

  async recordDecision(decision: Omit<AiDecisionRecord, 'id' | 'created_at'>): Promise<AiDecisionRecord> {
    const payload = {
      ...decision,
      created_at: new Date().toISOString(),
    };
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error } = await supabase.from('ai_decisions').insert(payload).select().single();
      if (!error && data) {
        return data as AiDecisionRecord;
      }
    }
    return {
      id: `ai-dec-${Date.now()}`,
      ...payload,
    };
  },
};
