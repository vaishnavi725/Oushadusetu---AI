import { describe, it, expect } from 'vitest';
import { testSupabaseConnection } from './supabase';
import { patientService } from './patientService';
import { prescriptionService } from './prescriptionService';
import { refillService } from './refillService';
import { proactiveRiskService } from './proactiveRiskService';
import { timelineService } from './timelineService';
import { aiDecisionService } from './aiDecisionService';
import { agentActionService } from './agentActionService';

describe('Supabase Integration Tests', () => {
  it('1. checks Supabase connection', async () => {
    const res = await testSupabaseConnection();
    expect(res.success).toBe(true);
  });

  it('2. retrieves patients from Supabase', async () => {
    const patients = await patientService.listPatients();
    expect(patients.length).toBeGreaterThan(0);
    expect(patients[0]).toHaveProperty('name');
    expect(patients[0]).toHaveProperty('phone');
    console.log(`Patients loaded: ${patients.length} (first: ${patients[0].name})`);
  });

  it('3. retrieves prescriptions from Supabase', async () => {
    const prescriptions = await prescriptionService.listPrescriptions();
    expect(prescriptions.length).toBeGreaterThan(0);
    expect(prescriptions[0]).toHaveProperty('medicationName');
    expect(prescriptions[0]).toHaveProperty('quantity');
    console.log(`Prescriptions loaded: ${prescriptions.length} (first: ${prescriptions[0].medicationName})`);
  });

  it('4. retrieves refill cases from Supabase', async () => {
    const res = await refillService.listCases({});
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0]).toHaveProperty('caseNumber');
    expect(res.data[0]).toHaveProperty('patientName');
    console.log(`Refill cases loaded: ${res.data.length} (first: ${res.data[0].caseNumber} - ${res.data[0].patientName})`);
  });

  it('5. retrieves proactive risks from Supabase', async () => {
    const risks = await proactiveRiskService.listProactiveRisks();
    expect(risks.length).toBeGreaterThan(0);
    expect(risks[0]).toHaveProperty('days_remaining');
    expect(risks[0]).toHaveProperty('risk_score');
    console.log(`Proactive risks loaded: ${risks.length} (first: ${risks[0].patientName} - ${risks[0].medicationName})`);
  });

  it('6. retrieves timeline from Supabase', async () => {
    const cases = await refillService.listCases({});
    const caseId = cases.data[0]?.id;
    const timeline = await timelineService.getCaseTimeline(caseId);
    expect(timeline.length).toBeGreaterThan(0);
    expect(timeline[0]).toHaveProperty('title');
    console.log(`Timeline events loaded: ${timeline.length} for case ${caseId}`);
  });

  it('7. retrieves AI decisions from Supabase', async () => {
    const decisions = await aiDecisionService.listAiDecisions();
    expect(decisions.length).toBeGreaterThan(0);
    expect(decisions[0]).toHaveProperty('recommendation');
    expect(decisions[0]).toHaveProperty('confidence');
    console.log(`AI decisions loaded: ${decisions.length} (first agent: ${decisions[0].agent_name})`);
  });

  it('8. retrieves agent actions from Supabase', async () => {
    const actions = await agentActionService.listAgentActions();
    expect(actions).toBeDefined();
    console.log(`Agent actions tested: ${actions.length}`);
  });
});
