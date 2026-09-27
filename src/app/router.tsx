import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { createBrowserRouter, Outlet, ScrollRestoration, useLocation, useRouteError } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useQueryClient } from '@tanstack/react-query';
import { PHARMACY_ROLES, PRACTICE_ROLES } from '@shared/types.ts';
import { onBackendChange } from '@/services/mock/backend';
import { PillLoader, PillLoadingScreen, ProjectFactCard } from '@/components/ui/PillLoader';
import { AppShell } from './AppShell';
import { AuthProvider, useAuth } from './auth-context';
import { CrashScreen } from './ErrorBoundary';
import { RequireAuth, RequireRole } from './guards';
import { setUnauthenticatedHandler } from './query-client';

const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const LandingPage = lazy(() => import('@/features/landing/LandingPage'));
const SignInPage = lazy(() => import('@/features/auth/SignInPage'));
const SignUpPage = lazy(() => import('@/features/auth/SignUpPage'));
const VerifyEmailPage = lazy(() => import('@/features/auth/VerifyEmailPage'));
const AcceptInvitePage = lazy(() => import('@/features/auth/AcceptInvitePage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/ResetPasswordPage'));
const MfaPage = lazy(() => import('@/features/auth/MfaPage'));
const PatientStatusPage = lazy(() => import('@/features/patient-status/PatientStatusPage'));
const CaseDetailPage = lazy(() => import('@/features/cases/CaseDetailPage'));
const QueuePage = lazy(() => import('@/features/queue/QueuePage'));
const ProviderInboxPage = lazy(() => import('@/features/provider-inbox/ProviderInboxPage'));
const PharmacyRequestsPage = lazy(() => import('@/features/pharmacy/PharmacyRequestsPage'));
const NewRequestPage = lazy(() => import('@/features/intake/NewRequestPage'));
const PhoneIntakePage = lazy(() => import('@/features/intake/PhoneIntakePage'));
const AnalyticsPage = lazy(() => import('@/features/analytics/AnalyticsPage'));
const SettingsLayout = lazy(() => import('@/features/settings/SettingsLayout'));
const ProfilePage = lazy(() => import('@/features/settings/ProfilePage'));
const TeamPage = lazy(() => import('@/features/settings/TeamPage'));
const PharmaciesPage = lazy(() => import('@/features/settings/PharmaciesPage'));
const PoliciesPage = lazy(() => import('@/features/settings/PoliciesPage'));
const AuditLogPage = lazy(() => import('@/features/settings/AuditLogPage'));
const NotFoundPage = lazy(() => import('@/features/errors/NotFoundPage'));
const CommandCenterPage = lazy(() => import('@/features/command-center/CommandCenterPage'));
const ProactiveRiskPage = lazy(() => import('@/features/proactive/ProactiveRiskPage'));
const AgentActivityPage = lazy(() => import('@/features/agents/AgentActivityPage'));

function PageFallback() {
  return <PillLoadingScreen />;
}

/** Bridges non-React events (401s, worker ticks) into React state. */
function BackendBridge() {
  const qc = useQueryClient();
  const { handleUnauthenticated } = useAuth();
  useEffect(() => {
    setUnauthenticatedHandler(handleUnauthenticated);
    return () => setUnauthenticatedHandler(null);
  }, [handleUnauthenticated]);
  useEffect(
    () =>
      onBackendChange(() => {
        void qc.invalidateQueries({ predicate: (q) => q.queryKey[0] !== 'health' && q.queryKey[0] !== 'ai' });
      }),
    [qc],
  );
  return null;
}

function RootLayout() {
  const location = useLocation();
  // Hold initial animation for at least 2 seconds on cold start
  const [initialLoading, setInitialLoading] = useState(true);
  const [routeTransitioning, setRouteTransitioning] = useState(false);
  const currentPath = useRef(location.pathname);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Hold centered pill animation with project facts for at least 2 seconds on route transition
  useEffect(() => {
    if (currentPath.current !== location.pathname) {
      currentPath.current = location.pathname;
      setRouteTransitioning(true);
      const timer = setTimeout(() => {
        setRouteTransitioning(false);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const showPillOverlay = initialLoading || routeTransitioning;

  return (
    <AuthProvider>
      <BackendBridge />
      <AnimatePresence mode="wait">
        {showPillOverlay && (
          <motion.div
            key="center-pill-animation"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 select-none"
          >
            <div className="flex flex-col items-center justify-center">
              <PillLoader size="2xl" showRings />
              <ProjectFactCard />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
      <ScrollRestoration />
    </AuthProvider>
  );
}

function RouteError() {
  const err = useRouteError();
  console.error(JSON.stringify({ level: 'error', event: 'route.error', details: { message: err instanceof Error ? err.name : 'unknown' } }));
  return <CrashScreen reference={crypto.randomUUID()} />;
}

const practice = PRACTICE_ROLES;
const pharmacy = PHARMACY_ROLES;
const guard = (roles: readonly (typeof PRACTICE_ROLES)[number][], el: ReactNode) => <RequireRole roles={roles}>{el}</RequireRole>;

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <SignInPage /> },
      { path: '/sign-in', element: <SignInPage /> },
      { path: '/landing', element: <LandingPage /> },
      { path: '/sign-up', element: <SignUpPage /> },
      { path: '/verify-email', element: <VerifyEmailPage /> },
      { path: '/accept-invite', element: <AcceptInvitePage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/mfa', element: <MfaPage /> },
      { path: '/status/:token', element: <PatientStatusPage /> },
      {
        element: (
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        ),
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/queue', element: guard(practice, <QueuePage />) },
          { path: '/command-center', element: <CommandCenterPage /> },
          { path: '/proactive-risk', element: <ProactiveRiskPage /> },
          { path: '/agents', element: <AgentActivityPage /> },
          { path: '/cases/new', element: guard(['practice_admin', 'practice_staff', 'provider'], <PhoneIntakePage />) },
          { path: '/cases/:caseId', element: <CaseDetailPage /> },
          { path: '/provider/inbox', element: guard(['provider'], <ProviderInboxPage />) },
          { path: '/provider/inbox/:caseId', element: guard(['provider'], <ProviderInboxPage />) },
          { path: '/pharmacy/requests', element: guard(pharmacy, <PharmacyRequestsPage />) },
          { path: '/pharmacy/requests/new', element: guard(pharmacy, <NewRequestPage />) },
          { path: '/analytics', element: guard(['practice_admin', 'provider', 'pharmacy_admin'], <AnalyticsPage />) },
          {
            path: '/settings',
            element: <SettingsLayout />,
            children: [
              { path: 'profile', element: <ProfilePage /> },
              { path: 'team', element: guard(['practice_admin', 'pharmacy_admin'], <TeamPage />) },
              { path: 'pharmacies', element: guard(['practice_admin', 'pharmacy_admin'], <PharmaciesPage />) },
              { path: 'policies', element: guard(['practice_admin'], <PoliciesPage />) },
              { path: 'audit', element: guard(['practice_admin', 'pharmacy_admin'], <AuditLogPage />) },
            ],
          },
        ],
      },
      { path: '/error', element: <CrashScreen reference="demo-error-page" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
