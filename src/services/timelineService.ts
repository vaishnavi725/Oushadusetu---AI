import { supabase } from '@/lib/supabase';

export interface TimelineEventRecord {
  id: string;
  refill_case_id: string;
  event_type: string;
  title: string;
  description: string;
  actor_type: 'SYSTEM' | 'AI' | 'USER' | 'PROVIDER' | 'PHARMACY';
  created_at: string;
}

export const timelineService = {
  async getCaseTimeline(caseId: string): Promise<TimelineEventRecord[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error } = await supabase
        .from('case_timeline')
        .select('*')
        .eq('refill_case_id', caseId)
        .order('created_at', { ascending: true });
      if (!error) {
        return (data || []) as TimelineEventRecord[];
      }
      return [];
    }

    return [
      {
        id: `tl-1-${caseId}`,
        refill_case_id: caseId,
        event_type: 'REQUESTED',
        title: 'Refill Requested',
        description: 'Inbound prescription refill request received from CityCare Pharmacy.',
        actor_type: 'SYSTEM',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: `tl-2-${caseId}`,
        refill_case_id: caseId,
        event_type: 'AI_DIAGNOSIS',
        title: 'Autonomous Triage Completed',
        description: 'Oushadha AI verified prescription history and detected zero refills remaining.',
        actor_type: 'AI',
        created_at: new Date(Date.now() - 43200000).toISOString(),
      },
      {
        id: `tl-3-${caseId}`,
        refill_case_id: caseId,
        event_type: 'PROVIDER_NOTIFIED',
        title: 'Provider Review Dispatched',
        description: 'Order placed in Dr. Rao clinical inbox for 90-day renewal approval.',
        actor_type: 'USER',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
  },

  async addTimelineEvent(event: Omit<TimelineEventRecord, 'id' | 'created_at'>): Promise<TimelineEventRecord> {
    const payload = {
      ...event,
      created_at: new Date().toISOString(),
    };
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error } = await supabase.from('case_timeline').insert(payload).select().single();
      if (!error && data) {
        return data as TimelineEventRecord;
      }
    }
    return {
      id: `tl-${Date.now()}`,
      ...payload,
    };
  },
};
