import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Play, Pause, ArrowRight, X } from 'lucide-react';

interface AutoAdvanceWidgetProps {
  durationSeconds?: number;
  destinationRoute?: string;
}

export function AutoAdvanceWidget({
  durationSeconds = 120, // 2 minutes
  destinationRoute = '/login',
}: AutoAdvanceWidgetProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(durationSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPaused || dismissed) return;

    if (secondsRemaining <= 0) {
      navigate(destinationRoute);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(destinationRoute);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, isPaused, dismissed, navigate, destinationRoute]);

  if (dismissed) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  const progressPercent = ((durationSeconds - secondsRemaining) / durationSeconds) * 100;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Demo auto navigation timer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-[#E8DFD3] bg-white/95 py-2.5 pl-4 pr-3 shadow-[0_12px_36px_-10px_rgba(28,25,23,0.25)] backdrop-blur-md"
      >
        {/* Circular Progress & Clock Icon */}
        <div className="relative flex size-8 items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-stone-200"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-teal-700 transition-all duration-1000 ease-linear"
              strokeDasharray={`${progressPercent}, 100`}
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <Clock className="absolute size-3.5 text-teal-800" />
        </div>

        {/* Text countdown */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-slate-900">{formattedTime}</span>
            <span className="text-[11px] text-stone-500">Auto-tour</span>
          </div>
          <span className="text-[10px] text-teal-800 font-medium">Entering Command Center</span>
        </div>

        {/* Action Controls */}
        <div className="ml-1 flex items-center gap-1 border-l border-stone-200 pl-2">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100 hover:text-slate-900 transition-colors"
            title={isPaused ? 'Resume countdown' : 'Pause countdown'}
          >
            {isPaused ? <Play className="size-3.5 text-emerald-600" /> : <Pause className="size-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => navigate(destinationRoute)}
            className="inline-flex items-center gap-1 rounded-full bg-teal-800 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-teal-900 transition-colors"
          >
            <span>Enter</span>
            <ArrowRight className="size-3" />
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-full p-1 text-stone-400 hover:text-stone-600 transition-colors"
            title="Dismiss timer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
