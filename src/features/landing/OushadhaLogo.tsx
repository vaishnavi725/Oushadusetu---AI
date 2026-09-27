import { cn } from '@/lib/format';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function OushadhaLogo({ className, showSubtitle = true, size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 'size-7' : size === 'lg' ? 'size-11' : 'size-9';
  const titleSize = size === 'sm' ? 'text-[16px]' : size === 'lg' ? 'text-[22px]' : 'text-[18px]';
  const subtitleSize = size === 'sm' ? 'text-[9.5px]' : 'text-[10.5px]';

  return (
    <div className={cn('inline-flex items-center gap-3 select-none', className)}>
      {/* Brand Icon: Medicine + Bridge + Connection */}
      <div className={cn('relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105', iconSize)}>
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="oushadha-brand-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F766E" />
              <stop offset="50%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
            <linearGradient id="bridge-accent" x1="6" y1="28" x2="34" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Background Rounded Shield */}
          <rect width="40" height="40" rx="11" fill="url(#oushadha-brand-grad)" />

          {/* Glowing Neural Connection Grid */}
          <circle cx="20" cy="20" r="14" stroke="#FFFFFF" strokeOpacity="0.15" strokeDasharray="2 3" strokeWidth="0.75" />

          {/* Pill Capsule (Oushadha = Medicine) */}
          <path
            d="M13 14 C13 10.5 16 8 20 8 C24 8 27 10.5 27 14 L27 18 L13 18 Z"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />
          <path
            d="M13 18 L27 18 L27 21 C27 23.5 25 25 20 25 C15 25 13 23.5 13 21 Z"
            fill="#FFFFFF"
            fillOpacity="0.4"
          />

          {/* Connecting Bridge Arch (Setu = Bridge) */}
          <path
            d="M7 32 C12 23 28 23 33 32"
            stroke="url(#bridge-accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Bridge Tension Nodes / AI Interconnects */}
          <line x1="14" y1="26" x2="14" y2="30" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
          <line x1="20" y1="24.5" x2="20" y2="29" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="26" y1="26" x2="26" y2="30" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />

          {/* Medicine Cross Central Core */}
          <circle cx="20" cy="13.5" r="2" fill="#0F766E" />
          <circle cx="33" cy="32" r="1.5" fill="#FFFFFF" />
          <circle cx="7" cy="32" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn('font-bold tracking-tight text-white leading-tight font-display', titleSize)}>
            Oushadha<span className="text-cyan-400">Setu</span>
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
            AI Refill OS
          </span>
        </div>
        {showSubtitle && (
          <span className={cn('font-medium tracking-normal text-slate-400 truncate leading-tight mt-0.5', subtitleSize)}>
            Autonomous Prescription Refill &amp; Lapse Prevention
          </span>
        )}
      </div>
    </div>
  );
}
