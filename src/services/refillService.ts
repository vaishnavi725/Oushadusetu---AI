import type {
  AuditLogEntry,
  CaseDetail,
  CaseEvent,
  CaseSummary,
  ListCasesParams,
  PageParams,
  Paginated,
  PracticeCaseDetail,
} from '@shared/dto.ts';
import type { CaseStatus, Priority, Resolution, SlaState, TransitionAction } from '@shared/types.ts';
import { supabase } from '@/lib/supabase';
import { mockRefillService } from './mock/mock-service';
import type { RefillService } from './refill-service';

function mapSupabaseCaseToSummary(r: any): CaseSummary {
  const isWaitingProvider = r.current_state?.toLowerCase().includes('provider') || r.responsible_party === 'Provider';
  const isWaitingPatient = r.current_state?.toLowerCase().includes('patient');
  
  let status: CaseStatus = 'TRIAGE';
  let resolution: Resolution | null = null;
  if (r.resolved) {
    status = 'APPROVED';
    resolution = 'completed';
  } else if (isWaitingProvider) {
    status = 'WAITING_ON_PROVIDER';
  } else if (isWaitingPatient) {
    status = 'WAITING_ON_PATIENT_VISIT';
  }

  const priority: Priority = (r.risk_level === 'CRITICAL' || r.risk_score >= 90) ? 'URGENT' : 'ROUTINE';
  const sla: SlaState = r.days_waiting >= 4 ? 'breached' : r.days_waiting >= 2 ? 'at_risk' : 'on_track';
  const med = r.prescriptions?.medications?.name
    ? `${r.prescriptions.medications.name} ${r.prescriptions.medications.dosage ?? ''}`.trim()
    : 'Prescription Drug';

  return {
    id: r.id,
    caseNumber: `RF-${r.id.slice(0, 6).toUpperCase()}`,
    patientName: r.patients?.name ?? 'John Demo',
    medication: med,
    status,
    resolution,
    blockers: ['NO_REFILLS_REMAINING'],
    priority,
    ownerName: r.providers?.name ?? 'Dr. Ananya Rao',
    ownerRole: 'provider',
    ownerUserId: r.provider_id ?? null,
    nextAction: r.recommended_action ?? 'Provider review required',
    dueAt: new Date(Date.now() + 86400000).toISOString(),
    statusSince: r.created_at ?? new Date().toISOString(),
    slaState: sla,
    pharmacyName: r.pharmacies?.name ?? 'OushadhaCare Pharmacy',
    practiceName: 'OushadhaSetu Clinical Center',
    escalationLevel: r.escalation_required ? 1 : 0,
    source: 'fax',
    updatedAt: r.updated_at ?? new Date().toISOString(),
    createdAt: r.created_at ?? new Date().toISOString(),
    injectionSuspected: false,
  };
}

export const refillService: RefillService = {
  ...mockRefillService,

  async listCases(params: ListCasesParams): Promise<Paginated<CaseSummary>> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error, count } = await supabase
        .from('refill_cases')
        .select(`
          *,
          patients ( name ),
          providers ( name ),
          pharmacies ( name ),
          prescriptions (
            medications ( name, dosage )
          )
        `, { count: 'exact' });

      if (!error) {
        const summaries = (data || []).map(mapSupabaseCaseToSummary);
        return {
          data: summaries,
          meta: {
            page: params.page ?? 1,
            limit: params.limit ?? 25,
            total: count ?? summaries.length,
          },
        };
      }
      return { data: [], meta: { page: 1, limit: 25, total: 0 } };
    }

    return mockRefillService.listCases(params);
  },

  async getCase(caseId: string): Promise<CaseDetail> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error } = await supabase
        .from('refill_cases')
        .select(`
          *,
          patients ( * ),
          providers ( * ),
          pharmacies ( * ),
          prescriptions (
            *,
            medications ( * )
          )
        `)
        .eq('id', caseId)
        .maybeSingle();

      if (!error && data) {
        const r = data as any;
        const summary = mapSupabaseCaseToSummary(r);
        const allowed: TransitionAction[] = ['DECIDE', 'ROUTE_TO_PROVIDER', 'REQUEST_INFO'];
        const detail: PracticeCaseDetail = {
          view: 'practice',
          case: {
            ...summary,
            blockerDetails: [],
            requestedPayload: {
              patientFirstName: r.patients?.name?.split(' ')[0] ?? 'John',
              patientLastName: r.patients?.name?.split(' ')[1] ?? 'Demo',
              patientDob: r.patients?.date_of_birth ?? '1985-04-12',
              patientPhone: r.patients?.phone ?? '+91-9000000101',
              medicationName: r.prescriptions?.medications?.name ?? 'Metformin',
              strength: r.prescriptions?.medications?.dosage ?? '500 mg',
              quantity: r.prescriptions?.quantity ?? 30,
              pharmacyName: r.pharmacies?.name ?? 'OushadhaCare Pharmacy',
              notes: r.blocker ?? 'Refill requested by pharmacy.',
            },
            linkedCaseId: null,
            linkedCaseNumber: null,
            version: 1,
            practiceOrgId: 'org-lfm',
            pharmacyOrgId: 'org-citycare',
            cancelReason: null,
          },
          patient: {
            id: r.patients?.id ?? r.patient_id,
            practiceOrgId: 'org-lfm',
            firstName: r.patients?.name?.split(' ')[0] ?? 'John',
            lastName: r.patients?.name?.split(' ')[1] ?? 'Demo',
            dob: r.patients?.date_of_birth ?? '1985-04-12',
            phone: r.patients?.phone ?? '+91-9000000101',
            email: r.patients?.email ?? 'demo@example.com',
            chartNumber: 'LFM-1001',
            preferredChannel: 'sms',
            smsOptOut: false,
          },
          patientAge: 39,
          prescription: {
            id: r.prescriptions?.id ?? r.prescription_id,
            practiceOrgId: 'org-lfm',
            patientId: r.patients?.id ?? r.patient_id,
            prescriberId: r.providers?.id ?? 'u-rao',
            medicationName: r.prescriptions?.medications?.name ?? 'Metformin',
            strength: r.prescriptions?.medications?.dosage ?? '500 mg',
            form: r.prescriptions?.medications?.form ?? 'tablet',
            sig: 'Take 1 tablet daily by mouth',
            quantity: r.prescriptions?.quantity ?? 30,
            daysSupply: r.prescriptions?.days_supply ?? 30,
            refillsAuthorized: 0,
            refillsRemaining: r.prescriptions?.refills_remaining ?? 0,
            writtenAt: r.prescriptions?.created_at ?? new Date().toISOString(),
            lastFillAt: r.prescriptions?.last_refill_date ?? new Date().toISOString(),
            drugClass: 'diabetes',
            controlledSchedule: null,
            status: 'active',
            statusChangedAt: null,
            checkInBeforeNextRefill: false,
          },
          lastVisit: new Date(Date.now() - 60 * 86400000).toISOString(),
          lastA1c: '6.8',
          pharmacy: {
            id: r.pharmacies?.id ?? 'org-citycare',
            name: r.pharmacies?.name ?? 'OushadhaCare Pharmacy',
            type: 'pharmacy',
            timezone: 'America/Chicago',
            phone: r.pharmacies?.phone ?? '+91-9000000010',
            city: r.pharmacies?.address ?? 'Bengaluru',
          },
          priorCases: [],
          matchCandidates: [],
          conflicts: [],
          notes: [],
          tasks: [],
          infoRequests: [],
          decisions: [],
          notifications: [],
          outbox: [],
          allowedActions: allowed,
          suggestedAction: 'DECIDE',
        };
        return detail;
      }
    }

    return mockRefillService.getCase(caseId);
  },

  async getCaseEvents(caseId: string, page: PageParams): Promise<Paginated<CaseEvent>> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error, count } = await supabase
        .from('case_timeline')
        .select('*', { count: 'exact' })
        .eq('refill_case_id', caseId)
        .order('created_at', { ascending: false });

      if (!error) {
        return {
          data: (data || []).map((r: any) => ({
            id: r.id,
            caseId: r.refill_case_id,
            actorType: r.actor_type?.toLowerCase() === 'ai' ? 'ai' : r.actor_type?.toLowerCase() === 'system' ? 'system' : 'user',
            actorName: r.actor_type === 'AI' ? 'Oushadha AI' : 'Clinical System',
            eventType: r.event_type ?? 'TIMELINE_EVENT',
            title: r.title,
            fromStatus: null,
            toStatus: null,
            reason: r.description,
            ruleIds: [],
            aiSuggestionId: null,
            promptVersion: null,
            requestId: 'req-sb',
            public: true,
            createdAt: r.created_at,
          })),
          meta: {
            page: page.page ?? 1,
            limit: page.limit ?? 50,
            total: count ?? (data?.length || 0),
          },
        };
      }
      return { data: [], meta: { page: page.page ?? 1, limit: page.limit ?? 50, total: 0 } };
    }
    return mockRefillService.getCaseEvents(caseId, page);
  },

  async listAuditLogs(page: PageParams): Promise<Paginated<AuditLogEntry>> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error, count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (!error) {
        return {
          data: (data || []).map((r: any) => ({
            id: r.id,
            caseId: r.refill_case_id,
            entity: 'case',
            entityId: r.refill_case_id,
            actorType: r.actor_type?.toLowerCase() === 'ai' ? 'ai' : 'user',
            actorName: r.actor_name ?? 'System',
            action: r.action,
            details: typeof r.details === 'object' && r.details !== null ? r.details : {},
            requestId: 'req-sb',
            createdAt: r.created_at,
          })),
          meta: {
            page: page.page ?? 1,
            limit: page.limit ?? 25,
            total: count ?? (data?.length || 0),
          },
        };
      }
      return { data: [], meta: { page: page.page ?? 1, limit: page.limit ?? 25, total: 0 } };
    }
    return mockRefillService.listAuditLogs(page);
  },
};
