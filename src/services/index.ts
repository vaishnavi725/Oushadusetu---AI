// The ONE place that picks mock vs real.
import { mockAuthService } from './mock/mock-auth';
import { refillService } from './refillService';
import type { AuthService } from './refill-service';

export const USING_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
export { refillService };
export const authService: AuthService = mockAuthService;

export { ApiError, friendlyMessage, newRequestId } from './errors';
export type { RefillService, AuthService } from './refill-service';
export { supabase, isSupabaseConfigured, testSupabaseConnection } from './supabase';
export { patientService } from './patientService';
export { prescriptionService } from './prescriptionService';
export { proactiveRiskService } from './proactiveRiskService';
export { aiDecisionService } from './aiDecisionService';
export { agentActionService } from './agentActionService';
export { timelineService } from './timelineService';
export { auditService } from './auditService';
