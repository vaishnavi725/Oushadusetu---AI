import { supabase } from '@/lib/supabase';

export interface AuditLogItem {
  id: string;
  refill_case_id?: string | null;
  actor_type: 'AI' | 'USER' | 'SYSTEM' | 'PROVIDER' | 'PHARMACY';
  actor_name: string;
  action: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export const auditService = {
  async listLogs(caseId?: string): Promise<AuditLogItem[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (caseId) {
        query = query.eq('refill_case_id', caseId);
      }
      const { data, error } = await query;
      if (!error) {
        return (data || []) as AuditLogItem[];
      }
      return [];
    }
    return [
      {
        id: 'audit-mock-1',
        refill_case_id: caseId ?? 'case-1',
        actor_type: 'AI',
        actor_name: 'Resolution Agent',
        action: 'Recommended provider approval',
        details: { risk: 'HIGH', confidence: 92 },
        created_at: new Date().toISOString(),
      },
    ];
  },

  async recordLog(entry: Omit<AuditLogItem, 'id' | 'created_at'>): Promise<AuditLogItem> {
    const payload = {
      ...entry,
      created_at: new Date().toISOString(),
    };
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error } = await supabase.from('audit_logs').insert(payload).select().single();
      if (error) {
        console.warn('audit_logs insert error:', error);
      }
      if (!error && data) {
        return data as AuditLogItem;
      }
    }
    return {
      id: `audit-${Date.now()}`,
      ...payload,
    };
  },
};
