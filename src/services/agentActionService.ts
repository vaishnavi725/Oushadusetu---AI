import { supabase } from '@/lib/supabase';

export interface AgentActionRecord {
  id: string;
  refill_case_id?: string | null;
  agent_name: string;
  action: string;
  reason?: string | null;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  created_at: string;
}

export const agentActionService = {
  async listAgentActions(caseId?: string): Promise<AgentActionRecord[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      let query = supabase.from('agent_actions').select('*').order('created_at', { ascending: false });
      if (caseId) {
        query = query.eq('refill_case_id', caseId);
      }
      const { data, error } = await query;
      if (!error) {
        return (data || []) as AgentActionRecord[];
      }
      return [];
    }

    return [
      {
        id: 'act-1',
        refill_case_id: caseId ?? 'case-1',
        agent_name: 'Intake Agent',
        action: 'Classified incoming fax as routine maintenance refill request for Metformin.',
        reason: 'Fax matched patient EHR and active prescription profile.',
        status: 'COMPLETED',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'act-2',
        refill_case_id: caseId ?? 'case-1',
        agent_name: 'Resolution Agent',
        action: 'Identified zero refills remaining and flagged for provider order authorization.',
        reason: 'No refills left on prescription.',
        status: 'COMPLETED',
        created_at: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: 'act-3',
        refill_case_id: caseId ?? 'case-1',
        agent_name: 'Communication Agent',
        action: 'Drafted notification informing patient that provider review is underway.',
        reason: 'Patient communication policy.',
        status: 'COMPLETED',
        created_at: new Date(Date.now() - 3400000).toISOString(),
      },
    ];
  },

  async recordAction(action: Omit<AgentActionRecord, 'id' | 'created_at'>): Promise<AgentActionRecord> {
    const payload = {
      ...action,
      created_at: new Date().toISOString(),
    };
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error } = await supabase.from('agent_actions').insert(payload).select().single();
      if (!error && data) {
        return data as AgentActionRecord;
      }
    }
    return {
      id: `act-${Date.now()}`,
      ...payload,
    };
  },
};
