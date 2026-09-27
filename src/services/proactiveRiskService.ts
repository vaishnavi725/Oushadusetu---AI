import { supabase } from '@/lib/supabase';

export interface ProactiveRiskRecord {
  id: string;
  patient_id: string;
  patientName: string;
  prescription_id: string;
  medicationName: string;
  days_remaining: number;
  historical_refill_lag_days: number;
  risk_score: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  risk_reason: string;
  recommended_action: string;
  outreach_status: 'NOT_STARTED' | 'PENDING' | 'SENT' | 'COMPLETED';
  prevented_lapse: boolean;
  detected_at: string;
}

export const proactiveRiskService = {
  async listProactiveRisks(): Promise<ProactiveRiskRecord[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error } = await supabase
        .from('proactive_risks')
        .select(`
          *,
          patients ( name ),
          prescriptions (
            medications ( name, dosage )
          )
        `)
        .order('risk_score', { ascending: false });

      if (!error) {
        return (data || []).map((r: any) => ({
          id: r.id,
          patient_id: r.patient_id,
          patientName: r.patients?.name ?? 'Unknown Patient',
          prescription_id: r.prescription_id,
          medicationName: r.prescriptions?.medications?.name
            ? `${r.prescriptions.medications.name} ${r.prescriptions.medications.dosage ?? ''}`.trim()
            : 'Prescription Medication',
          days_remaining: r.days_remaining ?? 0,
          historical_refill_lag_days: r.historical_refill_lag_days ?? 5,
          risk_score: r.risk_score ?? 80,
          risk_level: (r.risk_level?.toUpperCase() as any) ?? 'HIGH',
          risk_reason: r.risk_reason ?? 'Days remaining less than historical fulfillment lag.',
          recommended_action: r.recommended_action ?? 'Initiate proactive patient outreach.',
          outreach_status: r.outreach_status ?? 'NOT_STARTED',
          prevented_lapse: Boolean(r.prevented_lapse),
          detected_at: r.detected_at ?? new Date().toISOString(),
        }));
      }
      return [];
    }

    // Default mock proactive risks
    return [
      {
        id: 'pr-1',
        patient_id: 'pt-1',
        patientName: 'John Smith',
        prescription_id: 'rx-1',
        medicationName: 'Metformin 500mg',
        days_remaining: 4,
        historical_refill_lag_days: 6,
        risk_score: 92,
        risk_level: 'HIGH',
        risk_reason: 'Days supply (4 days) is less than historical clinic refill processing lag (6 days).',
        recommended_action: 'Initiate proactive patient outreach via SMS / Portal.',
        outreach_status: 'PENDING',
        prevented_lapse: false,
        detected_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'pr-2',
        patient_id: 'pt-2',
        patientName: 'Maria Garcia',
        prescription_id: 'rx-2',
        medicationName: 'Lisinopril 20mg',
        days_remaining: 2,
        historical_refill_lag_days: 5,
        risk_score: 96,
        risk_level: 'CRITICAL',
        risk_reason: 'Critical blood pressure maintenance. Zero refills remaining and 2 days left.',
        recommended_action: 'Queue bridge supply order and alert primary care provider.',
        outreach_status: 'NOT_STARTED',
        prevented_lapse: false,
        detected_at: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'pr-3',
        patient_id: 'pt-3',
        patientName: 'Robert Chen',
        prescription_id: 'rx-3',
        medicationName: 'Atorvastatin 40mg',
        days_remaining: 5,
        historical_refill_lag_days: 7,
        risk_score: 78,
        risk_level: 'MEDIUM',
        risk_reason: 'Refill interval approaching without inbound pharmacy request.',
        recommended_action: 'Send automated adherence reminder.',
        outreach_status: 'COMPLETED',
        prevented_lapse: true,
        detected_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  },

  async updateRiskOutreach(riskId: string, status: 'PENDING' | 'SENT' | 'COMPLETED', prevented = false): Promise<void> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      await supabase
        .from('proactive_risks')
        .update({ outreach_status: status, prevented_lapse: prevented })
        .eq('id', riskId);
    }
  },
};
