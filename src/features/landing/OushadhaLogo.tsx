import { cn } from '@/lib/format';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'ink' | 'inverse';
}

export function OushadhaLogo({ className, showSubtitle = true, size = 'md', tone = 'ink' }: LogoProps) {
  const iconSize = size === 'sm' ? 'size-7' : size === 'lg' ? 'size-11' : 'size-9';
  const titleSize = size === 'sm' ? 'text-[16px]' : size === 'lg' ? 'text-[22px]' : 'text-[18px]';
  const subtitleSize = size === 'sm' ? 'text-[9.5px]' : 'text-[10.5px]';

  return (
    <div className={cn('inline-flex items-center gap-3 select-none', className)}>
      {/* Brand Icon: Official OushadhaSetu Monogram */}
      <div className={cn('relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105', iconSize)}>
        <img
          src="/images/oushadha-icon.png"
          alt="OushadhaSetu Icon"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn('font-bold tracking-tight leading-tight font-display', titleSize, tone === 'inverse' ? 'text-white' : 'text-slate-900')}>
            Oushadha<span className={tone === 'inverse' ? 'text-cyan-300' : 'text-teal-700'}>Setu</span>
          </span>
          <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase border', tone === 'inverse' ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60' : 'bg-teal-50 text-teal-800 border-teal-200')}>
            AI Refill OS
          </span>
        </div>
        {showSubtitle && (
          <span className={cn('font-medium tracking-normal truncate leading-tight mt-0.5', subtitleSize, tone === 'inverse' ? 'text-slate-400' : 'text-slate-500')}>
            Autonomous Prescription Refill &amp; Lapse Prevention
          </span>
        )}
      </div>
    </div>
  );
}
