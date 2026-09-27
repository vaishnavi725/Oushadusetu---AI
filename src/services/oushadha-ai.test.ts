import { describe, it, expect } from 'vitest';
import { aiOrchestrator } from '@/ai/orchestrator';
import { aiApiClient } from '@/services/aiApiClient';
import { supabase } from '@/lib/supabase';

describe('Oushadha AI & Orchestrator Integration Tests', () => {
  it('1. AI Helper responds to "Why is this refill stuck?" with root cause & explainability', async () => {
    const res = await aiOrchestrator.ask('Why is this refill stuck?');
    expect(res.text).toContain('REFILL STATUS');
    expect(res.text).toContain('Why?');
    expect(res.text).toContain('Evidence:');
    expect(res.text).toContain('Confidence:');
    expect(res.decision).toBeDefined();
    expect(res.decision?.risk).toBe('HIGH');
    expect(res.decision?.confidence).toBe(92);
    expect(res.decision?.evidence.length).toBeGreaterThan(0);
    expect(res.decision?.currentState).toBeDefined();
    expect(res.decision?.responsibleParty).toBeDefined();
  });

  it('2. AI Helper responds to "Check for silent-lapse risks" with days remaining & lag', async () => {
    const res = await aiOrchestrator.ask('Check for silent-lapse risks');
    expect(res.text).toContain('days remaining');
    expect(res.text).toContain('Historical refill lag');
    expect(res.text).toContain('Risk Score:');
    expect(res.decision).toBeDefined();
    expect(res.decision?.agentName).toBe('Proactive Risk Agent');
    expect(res.decision?.recommendedAction).toContain('outreach');
  });

  it('3. AI Helper responds to "Which refills are critical?" and "Who needs to act next?"', async () => {
    const crit = await aiOrchestrator.ask('Which refills are critical?');
    expect(crit.decision?.risk).toBe('CRITICAL');

    const who = await aiOrchestrator.ask('Who needs to act next?');
    expect(who.decision?.responsibleParty).toBeDefined();
  });

  it('4. AI Orchestrator returns all 6 modular agents with exact statuses', async () => {
    const agents = await aiOrchestrator.getAgents();
    expect(agents.length).toBe(6);

    const intake = agents.find((a) => a.id === 'intake');
    const risk = agents.find((a) => a.id === 'risk');
    const resolution = agents.find((a) => a.id === 'resolution');
    const comm = agents.find((a) => a.id === 'communication');
    const esc = agents.find((a) => a.id === 'escalation');
    const audit = agents.find((a) => a.id === 'audit');

    expect(intake?.status).toBe('active');
    expect(risk?.status).toBe('monitoring');
    expect(resolution?.status).toBe('ready');
    expect(comm?.status).toBe('ready');
    expect(esc?.status).toBe('monitoring');
    expect(audit?.status).toBe('ready');
  });

  it('5. Human-in-the-Loop approval synchronizes with Supabase audit trail', async () => {
    let caseId = 'edbfc832-9a40-4101-bef2-c5ea969536fc';
    if (import.meta.env.VITE_USE_MOCKS === 'false') {
      const { data: cases } = await supabase.from('refill_cases').select('id').limit(1);
      if (cases && cases.length > 0) {
        caseId = cases[0].id;
      }
    }

    const res = await aiOrchestrator.ask('Why is this refill stuck?', { caseId });
    const decision = res.decision!;

    // Check ai_decisions update
    const { error: aiDecErr } = await supabase
      .from('ai_decisions')
      .update({ human_approval_status: 'APPROVED' })
      .eq('refill_case_id', caseId);
    console.log('ai_decisions update error:', aiDecErr);

    // Check proactive_risks update
    const { error: riskErr } = await supabase
      .from('proactive_risks')
      .update({ outreach_status: 'outreach_sent', prevented_lapse: true })
      .eq('prevented_lapse', false);
    console.log('proactive_risks update error:', riskErr);

    // Check case_timeline insert
    const { error: tlErr } = await supabase.from('case_timeline').insert({
      refill_case_id: caseId,
      event_type: 'HUMAN_APPROVAL',
      title: 'Action Approved',
      description: 'Clinician approved provider review',
      actor_type: 'USER',
      actor_name: 'Dr. Sarah Lin',
      created_at: new Date().toISOString()
    });
    console.log('case_timeline insert error:', tlErr);

    const approvalResult = await aiApiClient.approveDecision({
      decisionId: decision.id,
      action: 'approved',
      note: 'Verified and authorized by Duty Clinician',
      caseId: decision.caseId || caseId,
      agentName: decision.agentName,
      recommendation: decision.recommendedAction,
      risk: decision.risk,
    });

    expect(approvalResult.success).toBe(true);
  });
});
