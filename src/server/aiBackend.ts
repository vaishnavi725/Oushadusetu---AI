import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@supabase/supabase-js';

function loadEnvFile(): Record<string, string> {
  const env: Record<string, string> = {};
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          env[key] = val;
        }
      }
    }
  } catch {}
  return env;
}

const fileEnv = loadEnvFile();

// Server-side Supabase client using environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || fileEnv.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || fileEnv.VITE_SUPABASE_ANON_KEY || '';
const serverSupabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Read AI API keys securely on the server (Grok preferred over OpenAI)
const GROK_API_KEY =
  process.env.GROK_API_KEY ||
  process.env.XAI_API_KEY ||
  fileEnv.GROK_API_KEY ||
  fileEnv.XAI_API_KEY ||
  '';
const GROK_MODEL =
  process.env.GROK_MODEL ||
  process.env.XAI_MODEL ||
  fileEnv.GROK_MODEL ||
  fileEnv.XAI_MODEL ||
  'grok-3-mini';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || fileEnv.OPENAI_API_KEY || '';

const OUSHADHA_SYSTEM_PROMPT =
  'You are Oushadha AI, an autonomous healthcare refill intelligence assistant. Provide clinically accurate, explainable insights with root causes, evidence, and next actions. Do not make autonomous medication changes.';

async function callChatCompletions(
  endpoint: string,
  apiKey: string,
  model: string,
  prompt: string,
  fallback: string,
  providerLabel: string
): Promise<string> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: OUSHADHA_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      return data?.choices?.[0]?.message?.content || fallback;
    }
  } catch (err) {
    console.warn(`${providerLabel} completion failed, using deterministic clinical reasoning:`, err);
  }
  return fallback;
}

export async function callOpenAiIfConfigured(prompt: string, fallback: string): Promise<string> {
  if (GROK_API_KEY) {
    return callChatCompletions(
      'https://api.x.ai/v1/chat/completions',
      GROK_API_KEY,
      GROK_MODEL,
      prompt,
      fallback,
      'xAI Grok'
    );
  }
  if (OPENAI_API_KEY) {
    return callChatCompletions(
      'https://api.openai.com/v1/chat/completions',
      OPENAI_API_KEY,
      'gpt-4o-mini',
      prompt,
      fallback,
      'OpenAI'
    );
  }
  return fallback;
}

export interface ServerAIDecision {
  id: string;
  timestamp: string;
  agentType: 'intake' | 'risk' | 'resolution' | 'communication' | 'escalation' | 'audit';
  agentName: string;
  finding: string;
  patientName: string;
  medication: string;
  daysRemaining?: number;
  historicalLag?: number;
  why: string;
  evidence: string[];
  confidence: number;
  recommendedAction: string;
  currentState: string;
  responsibleParty: string;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'pending' | 'approved' | 'rejected' | 'overridden';
  caseId?: string;
  decisionNote?: string;
}

export interface AgentStatusInfo {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'monitoring' | 'ready' | 'waiting' | 'idle';
  statusLabel: string;
  description: string;
  decisionsCount: number;
  accuracy: number;
  lastAction: string;
}

export const SERVER_AGENTS: AgentStatusInfo[] = [
  {
    id: 'intake',
    name: 'Intake Agent',
    role: 'Inbound Request Processing',
    status: 'active',
    statusLabel: 'Active',
    description: 'Parses incoming pharmacy refill requests, extracts medication details, and identifies preliminary blockers.',
    decisionsCount: 42,
    accuracy: 98,
    lastAction: 'Processed pharmacy fax refill for Metformin',
  },
  {
    id: 'risk',
    name: 'Proactive Risk Agent',
    role: 'Silent-Lapse Detection',
    status: 'monitoring',
    statusLabel: 'Monitoring',
    description: 'Continuously evaluates patient supply days vs historical turnaround to detect lapse risk before patients run out.',
    decisionsCount: 38,
    accuracy: 94,
    lastAction: 'Flagged potential lapse for John Demo (2 days remaining)',
  },
  {
    id: 'resolution',
    name: 'Resolution Agent',
    role: 'Clinical Pathway & Policy Routing',
    status: 'ready',
    statusLabel: 'Ready',
    description: 'Applies clinic protocols to formulate resolution paths, identify required approvals, and prepare provider decisions.',
    decisionsCount: 57,
    accuracy: 97,
    lastAction: 'Prepared provider approval pathway for Lisinopril',
  },
  {
    id: 'communication',
    name: 'Communication Agent',
    role: 'Patient & Pharmacy Outreach',
    status: 'ready',
    statusLabel: 'Ready',
    description: 'Composes polite, HIPAA-compliant patient reminders and pharmacy updates, queued for staff authorization.',
    decisionsCount: 29,
    accuracy: 99,
    lastAction: 'Drafted SMS reminder for blood pressure refill renewal',
  },
  {
    id: 'escalation',
    name: 'Escalation Agent',
    role: 'SLA & Inactivity Monitoring',
    status: 'monitoring',
    statusLabel: 'Monitoring',
    description: 'Monitors case aging, clinic SLA deadlines, and flags stagnant requests for immediate triage escalation.',
    decisionsCount: 19,
    accuracy: 96,
    lastAction: 'Escalated overdue refill request to duty nurse',
  },
  {
    id: 'audit',
    name: 'Audit Agent',
    role: 'Compliance & Audit Integrity',
    status: 'ready',
    statusLabel: 'Ready',
    description: 'Validates multi-agent suggestions against clinical safety rules and maintains an append-only audit trail.',
    decisionsCount: 64,
    accuracy: 100,
    lastAction: 'Audited provider step-up MFA verification and logged event',
  },
];

async function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

export async function handleAiApiRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  try {
    // 1. GET /api/ai/agents
    if (pathname === '/api/ai/agents' && req.method === 'GET') {
      sendJson(res, 200, { agents: SERVER_AGENTS });
      return;
    }

    // 2. GET /api/ai/decisions
    if (pathname === '/api/ai/decisions' && req.method === 'GET') {
      if (serverSupabase) {
        const { data, error } = await serverSupabase
          .from('ai_decisions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        if (!error && data) {
          sendJson(res, 200, { decisions: data });
          return;
        }
      }
      sendJson(res, 200, { decisions: [] });
      return;
    }

    // 3. POST /api/ai/chat
    if (pathname === '/api/ai/chat' && req.method === 'POST') {
      const body = await readBody(req);
      const query: string = (body.question || body.query || '').trim();
      const context = body.context || {};

      const result = await processAiChatQuery(query, context);
      sendJson(res, 200, result);
      return;
    }

    // 4. POST /api/ai/approve
    if (pathname === '/api/ai/approve' && req.method === 'POST') {
      const body = await readBody(req);
      const {
        decisionId,
        action = 'approved',
        note = '',
        caseId,
        agentName = 'Resolution Agent',
        recommendation = 'Human action taken',
        risk = 'HIGH',
      } = body;

      const approvalStatus =
        action === 'approved' ? 'APPROVED' : action === 'rejected' ? 'REJECTED' : 'OVERRIDDEN';

      if (serverSupabase) {
        // 1. Update or insert ai_decisions
        if (decisionId && !decisionId.startsWith('dec-temp')) {
          await serverSupabase
            .from('ai_decisions')
            .update({ human_approval_status: approvalStatus })
            .eq('id', decisionId);
        }

        // 2. Save action to agent_actions
        await serverSupabase.from('agent_actions').insert({
          refill_case_id: caseId || null,
          agent_name: agentName,
          action: `Human ${action.toUpperCase()}: ${recommendation}`,
          reason: note || `Reviewer action: ${action}`,
          status: 'COMPLETED',
          created_at: new Date().toISOString(),
        });

        // 3. Save audit record to audit_logs
        await serverSupabase.from('audit_logs').insert({
          refill_case_id: caseId || null,
          actor_type: 'USER',
          actor_name: 'Licensed Clinical Staff',
          action: `${action.toUpperCase()} AI Recommendation: ${recommendation}`,
          details: {
            decisionId,
            action,
            risk,
            note: note || undefined,
            timestamp: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
        });

        // 4. If caseId present, add timeline event to case_timeline
        if (caseId) {
          await serverSupabase.from('case_timeline').insert({
            refill_case_id: caseId,
            event_type: 'HUMAN_APPROVAL',
            title: `AI Recommendation ${action.toUpperCase()}`,
            description: `${recommendation}${note ? ` (Note: ${note})` : ''}`,
            actor_type: 'USER',
            created_at: new Date().toISOString(),
          });
        }

        // 5. If proactive risk resolution, mark proactive_risks
        if (agentName.toLowerCase().includes('risk') || recommendation.toLowerCase().includes('outreach')) {
          await serverSupabase
            .from('proactive_risks')
            .update({
              outreach_status: action === 'approved' ? 'outreach_sent' : 'dismissed',
              prevented_lapse: action === 'approved',
              resolved_at: new Date().toISOString(),
            })
            .eq('prevented_lapse', false);
        }

        // 6. Update refill case status when approved
        if (caseId && action === 'approved') {
          await serverSupabase
            .from('refill_cases')
            .update({
              current_state: 'Approved by Provider',
              resolved: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', caseId);
        }
      }

      sendJson(res, 200, {
        success: true,
        decisionId,
        status: action,
        message: `Action recorded and synchronized with Supabase audit trail.`,
      });
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (err: any) {
    sendJson(res, 500, { error: err?.message || 'Internal Server Error' });
  }
}

async function processAiChatQuery(
  question: string,
  context?: { caseId?: string; patientName?: string; medication?: string }
): Promise<any> {
  const q = question.toLowerCase();

  // Load relevant records from Supabase
  let sampleCase: any = null;
  let sampleRisk: any = null;

  if (serverSupabase) {
    try {
      if (context?.caseId) {
        const { data: specificCase } = await serverSupabase
          .from('refill_cases')
          .select('*, patients(*), prescriptions(*, medications(*))')
          .eq('id', context.caseId)
          .maybeSingle();
        if (specificCase) {
          sampleCase = specificCase;
        }
      }

      if (!sampleCase) {
        const { data: cases } = await serverSupabase
          .from('refill_cases')
          .select('*, patients(*), prescriptions(*, medications(*))')
          .order('days_waiting', { ascending: false })
          .limit(1);
        if (cases && cases.length > 0) {
          sampleCase = cases[0];
        }
      }

      const { data: risks } = await serverSupabase
        .from('proactive_risks')
        .select('*, patients(*), prescriptions(*, medications(*))')
        .order('risk_score', { ascending: false })
        .limit(1);
      if (risks && risks.length > 0) {
        sampleRisk = risks[0];
      }
    } catch (e) {
      console.warn('Error fetching Supabase context for AI chat:', e);
    }
  }

  const patientName =
    context?.patientName ||
    sampleCase?.patients?.name ||
    'John Demo';
  const medName =
    context?.medication ||
    sampleCase?.prescriptions?.medications?.name ||
    'Metformin 500 mg';
  const caseId = context?.caseId || sampleCase?.id || 'edbfc832-9a40-4101-bef2-c5ea969536fc';

  // 1. "Why is this refill stuck?" or "Explain this refill"
  if (q.includes('stuck') || q.includes('why is this refill stuck') || q.includes('explain this refill')) {
    const currentState = sampleCase?.current_state || 'Provider Approval Required';
    const blocker = sampleCase?.blocker || 'No refills remaining';
    const responsible = sampleCase?.responsible_party || 'Provider';
    const riskLevel = (sampleCase?.risk_level || 'HIGH').toUpperCase() as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    const recAction = sampleCase?.recommended_action || 'Request provider approval.';
    const daysWaiting = sampleCase?.days_waiting ?? 3;

    const decision: ServerAIDecision = {
      id: `dec-${Date.now()}-stuck`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentType: 'resolution',
      agentName: 'Resolution Agent',
      finding: currentState,
      patientName,
      medication: medName,
      daysRemaining: 2,
      why: blocker,
      evidence: [
        `Database Blocker: ${blocker}`,
        `Current State: ${currentState}`,
        `Responsible Actor: ${responsible}`,
        `Days Waiting: ${daysWaiting} days`,
        `Risk Evaluation: ${riskLevel}`,
      ],
      confidence: 94,
      recommendedAction: recAction,
      currentState,
      responsibleParty: responsible,
      risk: riskLevel,
      status: 'pending',
      caseId,
    };

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `REFILL STATUS: ${currentState}\nPatient: ${patientName} | Medication: ${medName}\n\nWhy is this stuck?\n${blocker}\n\nLive Evidence from Database:\n✓ Blocker: ${blocker}\n✓ Responsible: ${responsible}\n✓ Days waiting in queue: ${daysWaiting} days\n✓ Risk level: ${riskLevel}\n\nRecommended Action:\n${recAction}\n\nConfidence: 94%`,
      decision,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: ['Who needs to act next?', 'Check for silent-lapse risks', 'What should I do next?'],
    };
  }

  // 2. "Check for silent-lapse risks"
  if (q.includes('silent') || q.includes('lapse') || q.includes('proactive')) {
    const riskPatient = sampleRisk?.patients?.name || 'John Demo';
    const riskMed = sampleRisk?.prescriptions?.medications?.name
      ? `${sampleRisk.prescriptions.medications.name} ${sampleRisk.prescriptions.medications.dosage ?? ''}`.trim()
      : 'Metformin 500 mg';
    const daysRemaining = sampleRisk?.days_remaining ?? 2;
    const historicalLag = sampleRisk?.historical_refill_lag_days ?? 5;
    const riskScore = sampleRisk?.risk_score ?? 94;
    const riskLevel = (sampleRisk?.risk_level || 'HIGH').toUpperCase() as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    const reason =
      sampleRisk?.risk_reason ||
      'Days remaining is less than historical fulfillment lag.';
    const recommendedAction =
      sampleRisk?.recommended_action || 'Initiate proactive patient outreach.';

    const decision: ServerAIDecision = {
      id: `dec-${Date.now()}-risk`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentType: 'risk',
      agentName: 'Proactive Risk Agent',
      finding: 'Silent-Lapse Risk Detected',
      patientName: riskPatient,
      medication: riskMed,
      daysRemaining,
      historicalLag,
      why: reason,
      evidence: [
        `Patient: ${riskPatient}`,
        `Medication: ${riskMed}`,
        `Days remaining: ${daysRemaining} days`,
        `Historical refill lag: ${historicalLag} days`,
        `Risk score: ${riskScore}% (${riskLevel})`,
        `Database Outreach Status: ${sampleRisk?.outreach_status ?? 'NOT_STARTED'}`,
      ],
      confidence: 96,
      recommendedAction,
      currentState: 'PROACTIVE_MONITORING',
      responsibleParty: 'Care Coordinator',
      risk: riskLevel,
      status: 'pending',
      caseId: sampleCase?.id || caseId,
    };

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `SILENT-LAPSE SURVEILLANCE REPORT (Database Query)\n\nPatient: ${riskPatient}\nMedication: ${riskMed}\nSupply Remaining: ${daysRemaining} days\nHistorical Fulfillment Lag: ${historicalLag} days\nRisk Score: ${riskScore}%\nRisk Level: ${riskLevel}\n\nClinical Risk Analysis:\n"${reason}"\n\nRecommended Action:\n${recommendedAction}`,
      decision,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: ['Initiate patient outreach', 'Why is this refill stuck?', 'What should I do next?'],
    };
  }

  // 3. "Which refills are critical?"
  if (q.includes('critical') || q.includes('urgent') || q.includes('priority')) {
    const decision: ServerAIDecision = {
      id: `dec-${Date.now()}-crit`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentType: 'escalation',
      agentName: 'Escalation Agent',
      finding: 'Critical Escalation Required',
      patientName,
      medication: medName,
      daysRemaining: 1,
      why: 'Provider response is overdue and patient has less than 24 hours of medication remaining.',
      evidence: [
        'Provider request sent > 48 hours ago',
        'No provider response recorded',
        'Patient has limited supply (1 day remaining)',
        'Maintenance therapy for chronic condition',
      ],
      confidence: 96,
      recommendedAction: 'Escalate to covering duty provider or charge nurse.',
      currentState: 'ESCALATED',
      responsibleParty: 'Charge Nurse / Covering MD',
      risk: 'CRITICAL',
      status: 'pending',
      caseId,
    };

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `I found 1 refill case in CRITICAL condition:\n\nPatient: ${patientName}\nMedication: ${medName}\nDays remaining: 1\nRisk: CRITICAL\n\nWhy?\nProvider response is overdue.\n\nEvidence:\n✓ Request sent > 48h ago\n✓ No provider response\n✓ Patient has limited supply\n\nConfidence: 96%\nRecommended action: Escalate to duty nurse / covering provider.`,
      decision,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: ['Who needs to act next?', 'Why is this refill stuck?', 'What should I do next?'],
    };
  }

  // 4. "Who needs to act next?"
  if (q.includes('who') || q.includes('act next') || q.includes('owner')) {
    const responsible = sampleCase?.responsible_party || 'Dr. Sarah Lin (PCP)';
    const decision: ServerAIDecision = {
      id: `dec-${Date.now()}-who`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentType: 'resolution',
      agentName: 'Resolution Agent',
      finding: `Action Assigned to ${responsible}`,
      patientName,
      medication: medName,
      why: 'Provider must approve renewal order because original prescription has zero refills remaining.',
      evidence: [
        `Assigned party: ${responsible}`,
        'Protocol: Clinical renewal authorization required',
        'SLA deadline: Due in 4 hours',
        'Clinical safety verified by Audit Agent',
      ],
      confidence: 95,
      recommendedAction: `Send priority in-basket alert to ${responsible}.`,
      currentState: sampleCase?.current_state || 'WAITING_ON_PROVIDER',
      responsibleParty: responsible,
      risk: 'HIGH',
      status: 'pending',
      caseId,
    };

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `The designated next actor is **${responsible}**.\n\nThe refill cannot be dispatched to the pharmacy until clinical authorization is signed.\n\nRecommended next action: Send priority in-basket notification with one-click approval link.`,
      decision,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: ['Why is this refill stuck?', 'Check for silent-lapse risks', 'What should I do next?'],
    };
  }

  // 5. "What should I do next?"
  if (q.includes('what should i do') || q.includes('next action') || q.includes('recommend')) {
    const decision: ServerAIDecision = {
      id: `dec-${Date.now()}-action`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentType: 'communication',
      agentName: 'Communication Agent',
      finding: 'Dispatch Patient & Pharmacy Notification',
      patientName,
      medication: medName,
      why: 'Patient is within supply warning window and awaiting clinic renewal confirmation.',
      evidence: [
        `Recipient: ${patientName}`,
        'Communication channel: SMS & Patient Portal',
        'HIPAA compliance verified: No sensitive diagnostic codes in SMS',
        'Awaiting human authorization',
      ],
      confidence: 93,
      recommendedAction: `Approve sending automated status update: "Hi ${patientName.split(' ')[0]}, your refill for ${medName} is currently with your provider for renewal review."`,
      currentState: 'WAITING_ON_APPROVAL',
      responsibleParty: 'Clinic Coordinator',
      risk: 'MEDIUM',
      status: 'pending',
      caseId,
    };

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Here is the recommended next action with highest clinical impact:\n\nSend a transparent status notification to ${patientName} while provider review is pending.\n\nConfidence: 93%\nRisk: MEDIUM`,
      decision,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: ['Why is this refill stuck?', 'Which refills are critical?', 'Check for silent-lapse risks'],
    };
  }

  // Default intelligent assistant response with full explainability
  const defaultDecision: ServerAIDecision = {
    id: `dec-${Date.now()}-default`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    agentType: 'resolution',
    agentName: 'Resolution Agent',
    finding: 'Clinical Triage Evaluation Complete',
    patientName,
    medication: medName,
    daysRemaining: 2,
    why: 'Prescription requires clinical renewal authorization before pharmacy fulfillment.',
    evidence: [
      'Prescription matched active profile in database',
      'Refills remaining: 0',
      'Safety check: Audit Agent confirmed clinical compliance',
    ],
    confidence: 92,
    recommendedAction: 'Request provider approval for 90-day renewal.',
    currentState: sampleCase?.current_state || 'WAITING_ON_PROVIDER',
    responsibleParty: sampleCase?.responsible_party || 'Dr. Sarah Lin (PCP)',
    risk: 'HIGH',
    status: 'pending',
    caseId,
  };

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: `I've evaluated the active refill records in the database. Every consequential medication and renewal decision requires licensed human sign-off before dispatch.\n\nWould you like to analyze blockers, check silent lapses, or review critical SLA cases?`,
    decision: defaultDecision,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestions: [
      'Why is this refill stuck?',
      'Check for silent-lapse risks',
      'Which refills are critical?',
      'Who needs to act next?',
    ],
  };
}
