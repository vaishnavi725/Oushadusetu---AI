import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  Check,
  Slash,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/format';
import { aiOrchestrator } from '@/ai/orchestrator';
import type { AIDecision, AIMessage, DecisionStatus } from '@/ai/types';

const INITIAL_SUGGESTIONS = [
  'Why is this refill stuck?',
  'Which refills are critical?',
  'Check for silent-lapse risks',
  'Who needs to act next?',
  'Explain this refill',
  'What should I do next?',
];

export function OushadhaAIHelper() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am **Oushadha AI**, your autonomous refill intelligence copilot.\n\nAsk me about refill risks, blockers, and next actions.',
      timestamp: 'Just now',
      suggestions: INITIAL_SUGGESTIONS,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim() || loading) return;
    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiOrchestrator.ask(queryText);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "I couldn't process that question right now. Please try choosing one of the suggested prompts.",
          timestamp: 'Just now',
          suggestions: INITIAL_SUGGESTIONS,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDecisionStatus = async (decision: AIDecision, status: DecisionStatus) => {
    await aiOrchestrator.updateDecisionStatus(decision.id, status, undefined, {
      caseId: decision.caseId,
      agentName: decision.agentName,
      recommendation: decision.recommendedAction,
      risk: decision.risk,
    });

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.decision && msg.decision.id === decision.id) {
          return {
            ...msg,
            decision: {
              ...msg.decision,
              status,
            },
          };
        }
        return msg;
      })
    );
  };

  return (
    <>
      {/* Floating AI Helper Button */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Open Oushadha AI Copilot"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-teal-900/25 ring-2 ring-white/30 backdrop-blur transition-all duration-300 hover:shadow-2xl hover:shadow-teal-700/35"
      >
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-white" />
        </span>
        <Sparkles className="size-4 text-teal-200" />
        <span>✦ Oushadha AI</span>
      </motion.button>

      {/* Slide-out Copilot Panel */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="flex w-screen max-w-lg flex-col bg-white shadow-2xl"
              >
                {/* Copilot Header */}
                <div className="relative border-b border-slate-200 bg-gradient-to-r from-teal-50 via-white to-cyan-50/50 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-cyan-700 text-white shadow-md">
                        <Sparkles className="size-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-display text-base font-bold text-slate-900">Oushadha AI</h2>
                          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800">
                            Refill Intelligence Assistant
                          </span>
                        </div>
                        <p className="text-[12.5px] text-slate-600 font-medium">
                          Ask me about refill risks, blockers, and next actions.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Close"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 space-y-4 overflow-y-auto p-4 bg-slate-50/60">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        'flex flex-col gap-1.5',
                        m.sender === 'user' ? 'items-end' : 'items-start'
                      )}
                    >
                      <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-400">
                        {m.sender === 'assistant' ? (
                          <>
                            <Bot className="size-3 text-teal-600" />
                            <span>Oushadha AI · {m.timestamp}</span>
                          </>
                        ) : (
                          <>
                            <User className="size-3 text-slate-500" />
                            <span>You · {m.timestamp}</span>
                          </>
                        )}
                      </div>

                      <div
                        className={cn(
                          'max-w-[94%] rounded-2xl p-4 text-[13.5px] leading-relaxed shadow-xs',
                          m.sender === 'user'
                            ? 'bg-teal-700 text-white'
                            : 'border border-slate-200 bg-white text-slate-800'
                        )}
                      >
                        <p className="whitespace-pre-line font-normal">{m.text}</p>

                        {/* Structured Clinical Decision Card with full Explainability & HITL */}
                        {m.decision && (
                          <DecisionCard
                            decision={m.decision}
                            onApprove={() => handleDecisionStatus(m.decision!, 'approved')}
                            onReject={() => handleDecisionStatus(m.decision!, 'rejected')}
                            onOverride={() => handleDecisionStatus(m.decision!, 'overridden')}
                          />
                        )}
                      </div>

                      {/* Clickable Suggestions */}
                      {m.suggestions && m.suggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5 pl-1">
                          {m.suggestions.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => void handleAsk(s)}
                              className="rounded-full border border-teal-200 bg-white px-3 py-1 text-[12px] font-medium text-teal-800 shadow-2xs transition hover:border-teal-400 hover:bg-teal-50 hover:text-teal-900 active:scale-95"
                            >
                              ✦ {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 p-3 text-xs text-slate-600 w-fit shadow-xs">
                      <Sparkles className="size-4 animate-spin text-teal-600" />
                      <span>Oushadha AI is orchestrating specialized agents…</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="border-t border-slate-200 bg-white p-3.5">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void handleAsk(input);
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me about refill risks, blockers, or next actions…"
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white transition hover:bg-teal-800 disabled:opacity-40"
                      aria-label="Send message"
                    >
                      <Send className="size-4" />
                    </button>
                  </form>
                  <p className="mt-2 text-center text-[11px] text-slate-500">
                    Oushadha AI recommends actions · Licensed clinicians review &amp; approve before execution.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function DecisionCard({
  decision,
  onApprove,
  onReject,
  onOverride,
}: {
  decision: AIDecision;
  onApprove: () => void;
  onReject: () => void;
  onOverride: () => void;
}) {
  const [showReasoning, setShowReasoning] = useState(true);

  return (
    <div className="mt-3.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-left text-xs shadow-xs">
      {/* Status & Risk Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            REFILL STATUS
          </span>
          <p className="font-bold text-slate-900 text-[13.5px]">{decision.finding}</p>
        </div>
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
            decision.risk === 'CRITICAL'
              ? 'bg-rose-100 text-rose-800 border border-rose-300'
              : decision.risk === 'HIGH'
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          )}
        >
          {decision.risk} RISK
        </span>
      </div>

      {/* Why Section */}
      <div className="mt-2.5">
        <span className="font-bold text-slate-700 uppercase tracking-wide text-[10.5px]">WHY?</span>
        <p className="mt-0.5 text-slate-800 leading-snug font-medium">{decision.why}</p>
      </div>

      {/* Evidence Checklist */}
      <div className="mt-2.5 space-y-1">
        <span className="font-bold text-slate-700 uppercase tracking-wide text-[10.5px]">EVIDENCE</span>
        <ul className="space-y-1 text-slate-700">
          {decision.evidence.map((item) => (
            <li key={item} className="flex items-start gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Current State & Responsible Party Badge */}
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-200 pt-2 text-[11px]">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500">CURRENT STATE</span>
          <p className="font-mono font-semibold text-slate-800 truncate">{decision.currentState}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500">RESPONSIBLE PARTY</span>
          <p className="font-semibold text-slate-800 truncate">{decision.responsibleParty}</p>
        </div>
      </div>

      {/* Recommended Action & Confidence */}
      <div className="mt-3 rounded-lg border border-teal-200 bg-white p-2.5 shadow-2xs">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-teal-900 uppercase">RECOMMENDED ACTION</span>
          <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
            CONFIDENCE: {decision.confidence}%
          </span>
        </div>
        <p className="mt-1 text-slate-800 font-semibold">{decision.recommendedAction}</p>
      </div>

      {/* Human-In-The-Loop Action Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {decision.status === 'approved' ? (
            <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-md text-[11px]">
              <Check className="size-3.5 text-emerald-600" /> Approved by Human · Synced to Supabase
            </span>
          ) : decision.status === 'rejected' ? (
            <span className="flex items-center gap-1 font-semibold text-rose-800 bg-rose-50 border border-rose-300 px-2.5 py-1 rounded-md text-[11px]">
              <X className="size-3.5 text-rose-600" /> Rejected by Human
            </span>
          ) : decision.status === 'overridden' ? (
            <span className="flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-md text-[11px]">
              <Slash className="size-3.5 text-amber-600" /> Overridden by Human
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={onApprove}
                className="flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-teal-800 active:scale-95 shadow-xs"
              >
                <Check className="size-3" /> Approve
              </button>
              <button
                type="button"
                onClick={onReject}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 transition hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 active:scale-95"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={onOverride}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 transition hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 active:scale-95"
              >
                Override
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowReasoning(!showReasoning)}
          className="flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:underline"
        >
          <span>{showReasoning ? 'Hide AI details' : 'View AI details'}</span>
          {showReasoning ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        </button>
      </div>

      {/* Detailed Technical Reasoning Drawer */}
      {showReasoning && (
        <div className="mt-2.5 border-t border-slate-200 pt-2 text-[11px] text-slate-600 space-y-1 bg-white rounded-md p-2.5 border border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-500">Agent:</span>
            <span className="font-semibold text-slate-900">{decision.agentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Patient:</span>
            <span className="font-medium text-slate-800">{decision.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Medication:</span>
            <span className="font-medium text-slate-800">{decision.medication}</span>
          </div>
          {decision.daysRemaining !== undefined && (
            <div className="flex justify-between">
              <span className="text-slate-500">Days Remaining:</span>
              <span className="font-bold text-rose-700">{decision.daysRemaining} days</span>
            </div>
          )}
          {decision.historicalLag !== undefined && (
            <div className="flex justify-between">
              <span className="text-slate-500">Historical Refill Lag:</span>
              <span className="font-semibold text-slate-700">{decision.historicalLag} days</span>
            </div>
          )}
          <div className="mt-1 flex items-center gap-1.5 text-[10.5px] text-teal-800 bg-teal-50 p-1.5 rounded">
            <AlertTriangle className="size-3 text-teal-600 shrink-0" />
            <span>Human-in-the-loop: Consequential prescription actions require clinician sign-off.</span>
          </div>
        </div>
      )}
    </div>
  );
}
