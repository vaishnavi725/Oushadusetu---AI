import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Bot,
  ClipboardList,
  FlaskRound,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  PhoneIncoming,
  PlusCircle,
  Radio,
  Settings,
  ShieldCheck,
  Stethoscope,
  WifiOff,
  AlertTriangle,
  Gauge,
} from 'lucide-react';
import { can, ROLE_LABELS } from '@shared/domain/permissions.ts';
import type { Role } from '@shared/types.ts';
import { refillService } from '@/services';
import { Logo } from '@/components/ui/Layout';
import { Drawer } from '@/components/ui/Modal';
import { OushadhaAIHelper } from '@/components/ai/OushadhaAIHelper';
import { cn } from '@/lib/format';
import { useOnline } from '@/lib/hooks';
import { useAuth } from './auth-context';
import { DevRoleSwitcher } from './DevRoleSwitcher';
import { SimulatorDrawer } from './SimulatorDrawer';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  roles: readonly Role[];
  end?: boolean;
}

const I = 'size-[18px]';
const NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className={I} />, roles: ['practice_admin', 'practice_staff', 'provider', 'pharmacy_admin', 'pharmacy_staff'], end: true },
  { to: '/command-center', label: 'Command Center', icon: <Gauge className={I} />, roles: ['practice_admin', 'practice_staff', 'provider', 'pharmacy_admin', 'pharmacy_staff'] },
  { to: '/provider/inbox', label: 'Provider inbox', icon: <Stethoscope className={I} />, roles: ['provider'] },
  { to: '/queue', label: 'Refill queue', icon: <ClipboardList className={I} />, roles: ['practice_admin', 'practice_staff', 'provider'] },
  { to: '/proactive-risk', label: 'Proactive Risk', icon: <Radio className={I} />, roles: ['practice_admin', 'practice_staff', 'provider', 'pharmacy_admin'] },
  { to: '/agents', label: 'AI Agents', icon: <Bot className={I} />, roles: ['practice_admin', 'provider', 'pharmacy_admin'] },
  { to: '/cases/new', label: 'Phone request', icon: <PhoneIncoming className={I} />, roles: ['practice_admin', 'practice_staff'] },
  { to: '/pharmacy/requests', label: 'Requests', icon: <Inbox className={I} />, roles: ['pharmacy_admin', 'pharmacy_staff'], end: true },
  { to: '/pharmacy/requests/new', label: 'New request', icon: <PlusCircle className={I} />, roles: ['pharmacy_admin', 'pharmacy_staff'] },
  { to: '/analytics', label: 'Analytics', icon: <BarChart3 className={I} />, roles: ['practice_admin', 'provider', 'pharmacy_admin'] },
  { to: '/settings/profile', label: 'Settings', icon: <Settings className={I} />, roles: ['practice_admin', 'provider', 'practice_staff', 'pharmacy_admin', 'pharmacy_staff'] },
];

export function AppShell() {
  const { user, signOut } = useAuth();
  const online = useOnline();
  const [menuOpen, setMenuOpen] = useState(false);
  const [simOpen, setSimOpen] = useState(false);
  const location = useLocation();
  const health = useQuery({ queryKey: ['health'], queryFn: () => refillService.getHealth(), refetchInterval: 60_000 });

  useEffect(() => setMenuOpen(false), [location.pathname]);
  if (!user) return null;
  const items = NAV.filter((n) => n.roles.includes(user.role));
  const mobileTabs = items.slice(0, 3);

  return (
    <div className="app-backdrop min-h-screen">
      <a href="#main" className="sr-only z-[90] rounded bg-white px-3 py-2 focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[rgba(0,217,255,0.18)] bg-[#03132F]/95 backdrop-blur-2xl lg:flex shadow-[4px_0_32px_rgba(3,19,47,0.8)]">
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>
        <div className="mx-4 mb-3 rounded-2xl border border-[rgba(0,217,255,0.22)] bg-gradient-to-br from-[#06245A]/80 via-[#03132F]/80 to-[#06245A]/60 px-3.5 py-3 shadow-[0_4px_16px_rgba(3,19,47,0.5)]">
          <p className="truncate text-xs font-bold text-[#F5FAFF] tracking-tight">{user.orgName}</p>
          <p className="text-[11px] text-[#4DA3FF] font-medium mt-0.5">{user.orgType === 'practice' ? 'Physician practice' : 'Pharmacy'}</p>
        </div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Main">
          {items.map((item, i) => (
            <motion.div key={item.to} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
              <SideLink item={item} />
            </motion.div>
          ))}
        </nav>
        {can(user.role, 'simulator.use') && import.meta.env.VITE_APP_ENV !== 'production' && (
          <button type="button" onClick={() => setSimOpen(true)} className="mx-3 mb-2 flex items-center gap-2.5 rounded-xl border border-dashed border-[rgba(0,217,255,0.35)] px-3 py-2 text-xs font-semibold text-[#00D9FF] transition hover:bg-[#087BFF]/15">
            <FlaskRound className="size-4" /> Failure simulator
          </button>
        )}
        <UserCard onSignOut={() => void signOut('manual')} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[rgba(0,217,255,0.18)] bg-[#03132F]/90 px-4 backdrop-blur-xl lg:hidden">
        <Logo />
        <button type="button" onClick={() => setMenuOpen(true)} className="rounded-lg p-2 text-[#A2C0E8] hover:bg-[#06245A]" aria-label="Open menu">
          <Menu className="size-5" />
        </button>
      </header>

      <div className="lg:pl-64">
        <AnimatePresence>
          {!online && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-warn-600 text-white">
              <p role="status" className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium">
                <WifiOff className="size-4" /> You're offline. Changes are paused until you reconnect.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {health.data?.status === 'degraded' && (
          <p role="status" className="flex items-center justify-center gap-2 bg-warn-50 px-4 py-2 text-sm text-warn-700">
            <AlertTriangle className="size-4" /> Background jobs delayed — reminders and escalations may be late.
          </p>
        )}
        <main id="main" className="mx-auto w-full max-w-[1400px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8 text-[#F5FAFF]">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tabs (max 4: 3 destinations + menu) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[rgba(0,217,255,0.18)] bg-[#03132F]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden" aria-label="Main">
        {mobileTabs.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cn('flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium', isActive ? 'text-[#00D9FF]' : 'text-[#749BC9]')}>
            {item.icon}
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
        <button type="button" onClick={() => setMenuOpen(true)} className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-[#749BC9]">
          <Menu className={I} />
          More
        </button>
      </nav>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title={user.orgName} description={`${user.name} · ${ROLE_LABELS[user.role]}`}>
        <nav className="space-y-1" aria-label="Mobile">
          {items.map((item) => (
            <SideLink key={item.to} item={item} />
          ))}
        </nav>
        {can(user.role, 'simulator.use') && (
          <button type="button" onClick={() => setSimOpen(true)} className="mt-4 flex w-full items-center gap-2.5 rounded-lg border border-dashed border-[rgba(0,217,255,0.35)] px-3 py-2.5 text-sm font-medium text-[#00D9FF]">
            <FlaskRound className="size-4" /> Failure simulator
          </button>
        )}
        <button type="button" onClick={() => void signOut('manual')} className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#A2C0E8] hover:bg-[#06245A]">
          <LogOut className="size-4" /> Sign out
        </button>
      </Drawer>
      <SimulatorDrawer open={simOpen} onClose={() => setSimOpen(false)} />
      <OushadhaAIHelper />
      {import.meta.env.VITE_APP_ENV !== 'production' && <DevRoleSwitcher />}
    </div>
  );
}

function SideLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 select-none',
          isActive
            ? 'bg-[#087BFF] text-[#F5FAFF] shadow-[0_0_18px_rgba(0,217,255,0.4)] border border-[#00D9FF]/40'
            : 'text-[#A2C0E8] hover:bg-[#06245A]/70 hover:text-[#00D9FF]'
        )
      }
    >
      <span className="transition-transform duration-200 group-hover:scale-105">{item.icon}</span>
      {item.label}
    </NavLink>
  );
}

function UserCard({ onSignOut }: { onSignOut: () => void }) {
  const { user } = useAuth();
  if (!user) return null;
  const initials = user.name.replace(/^Dr\.\s*/, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('');
  return (
    <div className="border-t border-[rgba(0,217,255,0.18)] p-3">
      <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-[#06245A]/60 transition">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#087BFF] to-[#06245A] border border-[#00D9FF]/40 text-[13px] font-bold text-[#F5FAFF] shadow-[0_0_12px_rgba(0,217,255,0.25)]">{initials}</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-[#F5FAFF]">{user.name}</p>
          <p className="flex items-center gap-1 text-[11px] text-[#749BC9] font-mono">
            {ROLE_LABELS[user.role]}
            {user.aal === 'aal2' && (
              <span className="inline-flex items-center gap-0.5 text-[#00D9FF] font-bold" title="MFA verified this session">
                <ShieldCheck className="size-3" /> MFA
              </span>
            )}
          </p>
        </div>
        <button type="button" onClick={onSignOut} className="rounded-lg p-2 text-[#749BC9] transition hover:bg-[#EF4444]/20 hover:text-[#EF4444] cursor-pointer" aria-label="Sign out" title="Sign out">
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  );
}
