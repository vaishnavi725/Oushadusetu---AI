import type { ReactNode } from 'react';
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Building2, ClipboardCheck, ScrollText, SlidersHorizontal, UserRound, Users } from 'lucide-react';
import { can } from '@shared/domain/permissions.ts';
import type { Role } from '@shared/types.ts';
import { useAuth } from '@/app/auth-context';
import { PageHeader } from '@/components/ui/Layout';
import { cn } from '@/lib/format';

interface SettingsTab {
  to: string;
  label: string;
  icon: ReactNode;
}

const I = 'size-4';

export function settingsTabsFor(role: Role): SettingsTab[] {
  const tabs: SettingsTab[] = [{ to: '/settings/profile', label: 'Profile', icon: <UserRound className={I} aria-hidden /> }];
  if (can(role, 'team.manage')) {
    tabs.push({ to: '/settings/team', label: 'Team', icon: <Users className={I} aria-hidden /> });
    tabs.push({
      to: '/settings/pharmacies',
      label: role === 'pharmacy_admin' ? 'Practices' : 'Pharmacies',
      icon: <Building2 className={I} aria-hidden />,
    });
  }
  if (can(role, 'policies.edit')) tabs.push({ to: '/settings/policies', label: 'Policies', icon: <SlidersHorizontal className={I} aria-hidden /> });
  if (can(role, 'audit.view')) tabs.push({ to: '/settings/audit', label: 'Audit log', icon: <ScrollText className={I} aria-hidden /> });
  return tabs;
}

export default function SettingsLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  if (pathname.replace(/\/+$/, '') === '/settings') return <Navigate to="/settings/profile" replace />;
  if (!user) return null;
  const tabs = settingsTabsFor(user.role);

  return (
    <div>
      <PageHeader
        eyebrow={user.orgName}
        title={
          <>
            <span className="font-bold">Settings</span>
          </>
        }
        description="Your account, your organisation and how OushadhaSetu behaves for your team."
      />
      <nav aria-label="Settings" className="-mx-4 mb-6 overflow-x-auto border-b border-line px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <ul className="flex min-w-max gap-1.5">
          {tabs.map((t) => (
            <li key={t.to}>
              <NavLink
                to={t.to}
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-3 text-[14px] font-bold transition-all',
                    isActive ? 'text-[#F5FAFF] bg-[#06245A]/90 border-b-2 border-[#00D9FF] shadow-[0_-2px_12px_rgba(0,217,255,0.15)]' : 'text-[#B8C7D9] hover:text-[#F5FAFF] hover:bg-[#06245A]/40',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-[#00D9FF]' : 'text-[#B8C7D9]'}>{t.icon}</span>
                    {t.label}
                    {isActive && <motion.span layoutId="settings-tab" className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]" aria-hidden />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="min-w-0">
        <Outlet />
      </div>
      {can(user.role, 'audit.view') && (
        <p className="mt-10 flex items-center gap-2 text-[13px] font-medium text-[#B8C7D9]">
          <ClipboardCheck className="size-4 text-[#00D9FF]" aria-hidden /> Changes to team, links and policies are recorded in the audit log.
        </p>
      )}
    </div>
  );
}
