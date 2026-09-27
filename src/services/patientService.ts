import { supabase } from '@/lib/supabase';
import { buildPatients } from '@/mocks/data/fixtures';

export interface Patient {
  id: string;
  name: string;
  date_of_birth?: string | null;
  dob?: string | null;
  phone: string | null;
  email: string | null;
  organization_id?: string;
  created_at?: string;
}

export const patientService = {
  async listPatients(): Promise<Patient[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error } = await supabase.from('patients').select('*').order('name');
      if (!error) {
        return (data || []).map((p) => ({
          ...p,
          dob: p.date_of_birth ?? p.dob ?? null,
          phone: p.phone ?? null,
          email: p.email ?? null,
        }));
      }
      return [];
    }
    // Fallback to mock patients
    return buildPatients().map((p) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      date_of_birth: p.dob,
      dob: p.dob,
      phone: p.phone,
      email: p.email,
      organization_id: p.practiceOrgId,
    }));
  },

  async getPatient(id: string): Promise<Patient | null> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error } = await supabase.from('patients').select('*').eq('id', id).maybeSingle();
      if (!error && data) {
        return {
          ...data,
          dob: data.date_of_birth ?? data.dob ?? null,
          phone: data.phone ?? null,
          email: data.email ?? null,
        };
      }
    }
    const mock = buildPatients().find((p) => p.id === id);
    if (!mock) return null;
    return {
      id: mock.id,
      name: `${mock.firstName} ${mock.lastName}`,
      date_of_birth: mock.dob,
      dob: mock.dob,
      phone: mock.phone,
      email: mock.email,
      organization_id: mock.practiceOrgId,
    };
  },

  async searchPatients(query: string): Promise<Patient[]> {
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
        .limit(10);
      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          ...p,
          dob: p.date_of_birth ?? p.dob ?? null,
          phone: p.phone ?? null,
          email: p.email ?? null,
        }));
      }
    }
    const q = query.toLowerCase();
    return buildPatients()
      .filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || (p.email && p.email.toLowerCase().includes(q)))
      .map((p) => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        date_of_birth: p.dob,
        dob: p.dob,
        phone: p.phone,
        email: p.email,
        organization_id: p.practiceOrgId,
      }));
  },
};
