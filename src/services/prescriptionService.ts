import { supabase } from '@/lib/supabase';
import { buildPrescriptions } from '@/mocks/data/fixtures';

export interface Prescription {
  id: string;
  patient_id: string;
  provider_id?: string;
  pharmacy_id?: string;
  medication_id?: string;
  medicationName: string;
  strength?: string;
  dosage?: string;
  quantity: number;
  refills_remaining: number;
  days_supply: number;
  days_supply_remaining?: number;
  last_refill_date?: string | null;
  historical_refill_lag_days?: number;
  active: boolean;
}

export const prescriptionService = {
  async listPrescriptions(): Promise<Prescription[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data: rxData, error } = await supabase
        .from('prescriptions')
        .select('*, medications(name, dosage, form)');
      if (!error) {
        return (rxData || []).map((r: any) => ({
          id: r.id,
          patient_id: r.patient_id,
          provider_id: r.provider_id,
          pharmacy_id: r.pharmacy_id,
          medication_id: r.medication_id,
          medicationName: r.medications?.name ?? 'Medication',
          strength: r.medications?.dosage ?? 'Standard',
          dosage: r.medications?.dosage,
          quantity: r.quantity ?? 30,
          refills_remaining: r.refills_remaining ?? 0,
          days_supply: r.days_supply ?? 30,
          days_supply_remaining: r.days_supply_remaining ?? 0,
          last_refill_date: r.last_refill_date ?? null,
          historical_refill_lag_days: r.historical_refill_lag_days ?? 5,
          active: r.active ?? true,
        }));
      }
      return [];
    }
    // Fallback to mock prescriptions
    return buildPrescriptions().map((rx) => ({
      id: rx.id,
      patient_id: rx.patientId,
      provider_id: rx.prescriberId,
      medicationName: rx.medicationName,
      strength: rx.strength,
      dosage: rx.strength,
      quantity: rx.quantity,
      refills_remaining: rx.refillsRemaining,
      days_supply: rx.daysSupply,
      days_supply_remaining: Math.max(0, rx.daysSupply - (rx.refillsRemaining === 0 ? 28 : 20)),
      last_refill_date: rx.lastFillAt,
      historical_refill_lag_days: 5,
      active: rx.status === 'active',
    }));
  },

  async getPrescription(id: string): Promise<Prescription | null> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*, medications(name, dosage, form)')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) {
        const r = data as any;
        return {
          id: r.id,
          patient_id: r.patient_id,
          provider_id: r.provider_id,
          pharmacy_id: r.pharmacy_id,
          medication_id: r.medication_id,
          medicationName: r.medications?.name ?? 'Medication',
          strength: r.medications?.dosage ?? 'Standard',
          dosage: r.medications?.dosage,
          quantity: r.quantity ?? 30,
          refills_remaining: r.refills_remaining ?? 0,
          days_supply: r.days_supply ?? 30,
          days_supply_remaining: r.days_supply_remaining ?? 0,
          last_refill_date: r.last_refill_date ?? null,
          historical_refill_lag_days: r.historical_refill_lag_days ?? 5,
          active: r.active ?? true,
        };
      }
    }
    const mock = buildPrescriptions().find((rx) => rx.id === id);
    if (!mock) return null;
    return {
      id: mock.id,
      patient_id: mock.patientId,
      provider_id: mock.prescriberId,
      medicationName: mock.medicationName,
      strength: mock.strength,
      dosage: mock.strength,
      quantity: mock.quantity,
      refills_remaining: mock.refillsRemaining,
      days_supply: mock.daysSupply,
      days_supply_remaining: 3,
      last_refill_date: mock.lastFillAt,
      historical_refill_lag_days: 5,
      active: mock.status === 'active',
    };
  },
};
