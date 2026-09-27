import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, KeyRound, LogIn, Mail, UserRound, Zap } from 'lucide-react';
import { ROLE_LABELS, homeRouteFor } from '@shared/domain/permissions.ts';
import { signInSchema, type SignInInput } from '@shared/schemas/index.ts';
import { MFA_REQUIRED_ROLES } from '@shared/types.ts';
import { useAuth } from '@/app/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { PillLoader, ProjectFactCard } from '@/components/ui/PillLoader';
import { ApiError, authService, friendlyMessage } from '@/services';
import { DEMO_MFA_CODE, DEMO_PASSWORD, USERS } from '@/mocks/data/fixtures';
import { AuthLayout } from './AuthLayout';
import { FormAlert, PasswordInput, safeNext } from './auth-shared';

const BANNERS: { param: string; value: string; tone: 'info' | 'success' | 'warning'; text: string }[] = [
  { param: 'reason', value: 'idle', tone: 'info', text: 'You were signed out after 15 minutes of inactivity.' },
  { param: 'reason', value: 'removed', tone: 'warning', text: 'Your access was removed. Contact your admin.' },
  { param: 'verified', value: '1', tone: 'success', text: 'Email verified — you can sign in now.' },
  { param: 'reset', value: '1', tone: 'success', text: 'Password updated. Sign in with your new password.' },
];

const initials = (name: string) =>
  name
    .replace(/^Dr\.\s*/, '')
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('');

export default function SignInPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [isDemoSigningIn, setIsDemoSigningIn] = useState(false);
  const next = safeNext(params.get('next'));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema), mode: 'onBlur', defaultValues: { email: '', password: '' } });

  // Already signed in (and past any required MFA) → go straight to destination.
  if (user && (!MFA_REQUIRED_ROLES.includes(user.role) || user.aal === 'aal2')) {
    return <Navigate to={next ?? homeRouteFor(user.role)} replace />;
  }

  const handleSuccessfulSignIn = () => {
    refresh();
    const current = authService.currentUser();
    const defaultHome = current ? homeRouteFor(current.role) : '/queue';
    navigate(next ?? defaultHome, { replace: true });
  };

  const onSubmit = async (values: SignInInput) => {
    setFormError(null);
    const startTime = Date.now();
    try {
      const result = await authService.signIn(values.email, values.password);
      const elapsed = Date.now() - startTime;
      if (elapsed < 2000) {
        await new Promise((r) => setTimeout(r, 2000 - elapsed));
      }
      if (result.status === 'signed_in') {
        handleSuccessfulSignIn();
        return;
      }
      const mode = result.status === 'mfa_enroll' ? 'enroll' : 'verify';
      const qs = new URLSearchParams();
      if (next) qs.set('next', next);
      qs.set('mode', mode);
      navigate(`/mfa?${qs.toString()}`, { replace: true });
    } catch (e) {
      setFormError(e instanceof ApiError && e.code === 'UNAUTHENTICATED' ? 'Invalid email or password.' : friendlyMessage(e));
    }
  };

  const instantDemoLogin = async (email: string) => {
    setFormError(null);
    setIsDemoSigningIn(true);
    setValue('email', email);
    setValue('password', DEMO_PASSWORD);
    const startTime = Date.now();
    try {
      const u = USERS.find((x) => x.email.toLowerCase() === email.toLowerCase());
      if (u && authService.devSwitchUser) {
        authService.devSwitchUser(u.key, 'aal2');
        const elapsed = Date.now() - startTime;
        if (elapsed < 2000) {
          await new Promise((r) => setTimeout(r, 2000 - elapsed));
        }
        handleSuccessfulSignIn();
        return;
      }
      const result = await authService.signIn(email, DEMO_PASSWORD);
      const elapsed = Date.now() - startTime;
      if (elapsed < 2000) {
        await new Promise((r) => setTimeout(r, 2000 - elapsed));
      }
      if (result.status === 'signed_in') {
        handleSuccessfulSignIn();
      } else {
        const qs = new URLSearchParams();
        if (next) qs.set('next', next);
        qs.set('mode', 'verify');
        navigate(`/mfa?${qs.toString()}`, { replace: true });
      }
    } catch (err) {
      setFormError(friendlyMessage(err));
    } finally {
      setIsDemoSigningIn(false);
    }
  };

  const fillDemo = (email: string) => {
    setFormError(null);
    setValue('email', email, { shouldValidate: true, shouldDirty: true });
    setValue('password', DEMO_PASSWORD, { shouldValidate: true, shouldDirty: true });
  };

  const banners = BANNERS.filter((b) => params.get(b.param) === b.value);

  return (
    <AuthLayout
      eyebrow="Clinical Portal"
      title={<span className="font-semibold tracking-tight">Sign in</span>}
      description="Open your workspace to see what is blocking each refill, who owns it, and what should happen next."
      footer={
        <>
          Need an enterprise deployment?{' '}
          <Link to="/sign-up" className="font-semibold text-brand-700 underline-offset-2 hover:underline">
            Request clinic access
          </Link>
        </>
      }
      below={<DemoAccounts onPick={fillDemo} onInstantLogin={instantDemoLogin} isSubmitting={isDemoSigningIn} />}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {banners.map((b) => (
          <FormAlert key={b.text} tone={b.tone}>
            {b.text}
          </FormAlert>
        ))}
        {formError && <FormAlert tone="error">{formError}</FormAlert>}
        
        <Input 
          label="Email" 
          type="email" 
          autoComplete="email" 
          inputMode="email" 
          placeholder="name@clinic.health"
          leading={<Mail className="size-4" />} 
          error={errors.email?.message} 
          {...register('email')} 
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          error={errors.password?.message}
          labelAction={
            <Link to="/forgot-password" className="text-[12.5px] font-medium text-brand-700 underline-offset-2 hover:underline">
              Forgot password
            </Link>
          }
          {...register('password')}
        />
        <div className="space-y-2 pt-1">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isSubmitting}
            icon={<LogIn className="size-4" aria-hidden />}
          >
            Sign In
          </Button>

          <Button
            type="button"
            size="lg"
            variant="secondary"
            onClick={() => void instantDemoLogin('dr.rao@lakeside.example.com')}
            disabled={isDemoSigningIn}
            loading={isDemoSigningIn}
            className="w-full border-slate-200 bg-slate-50 font-semibold text-slate-900 hover:bg-white"
            icon={<Zap className="size-4 text-teal-700" aria-hidden />}
          >
            Demo Login
          </Button>
        </div>
      </form>

      {/* Pill Loading Overlay during instant persona authorization */}
      {isDemoSigningIn && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF6F0]/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="flex flex-col items-center justify-center">
            <PillLoader size="2xl" showRings />
            <ProjectFactCard />
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

function DemoAccounts({ 
  onPick, 
  onInstantLogin, 
  isSubmitting 
}: { 
  onPick: (email: string) => void; 
  onInstantLogin: (email: string) => void;
  isSubmitting: boolean;
}) {
  const [showAllUsers, setShowAllUsers] = useState(false);

  return (
    <section aria-labelledby="demo-accounts" className="rounded-3xl border border-[#EDE4D8] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(28,25,23,0.15)] sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#F2E8DC] pb-3.5">
        <div>
          <h2 id="demo-accounts" className="text-sm font-display font-bold tracking-tight text-slate-950">
            One-Click Workspace Access
          </h2>
          <p className="text-[11.5px] text-stone-500 mt-0.5">Instant sign-in for evaluator testing</p>
        </div>
        <p className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-stone-600 bg-[#FAF4ED] px-2.5 py-1 rounded-full border border-[#E9DFD3]">
          <KeyRound className="size-3 text-teal-800" aria-hidden />
          MFA Code: <span className="font-bold text-teal-950">{DEMO_MFA_CODE}</span>
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onInstantLogin('dr.rao@lakeside.example.com')}
          className="group flex flex-col items-start rounded-2xl border border-teal-200/80 bg-gradient-to-b from-teal-50/60 to-white p-3 text-left transition-all hover:border-teal-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider text-teal-900 uppercase bg-teal-100/80 px-1.5 py-0.5 rounded">
            <Zap className="size-2.5 text-teal-700" /> Provider (MD)
          </span>
          <span className="mt-2 text-[13px] font-bold text-slate-950">Dr. Anika Rao</span>
          <span className="text-[11px] text-stone-500 truncate w-full">Approvals & Inbox</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onInstantLogin('admin@lakeside.example.com')}
          className="group flex flex-col items-start rounded-2xl border border-stone-200 bg-gradient-to-b from-stone-50/80 to-white p-3 text-left transition-all hover:border-stone-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider text-stone-800 uppercase bg-stone-100 px-1.5 py-0.5 rounded">
            <Zap className="size-2.5 text-stone-600" /> Practice Admin
          </span>
          <span className="mt-2 text-[13px] font-bold text-slate-950">Priya Shah</span>
          <span className="text-[11px] text-stone-500 truncate w-full">Queue & Triage</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onInstantLogin('admin@citycare.example.com')}
          className="group flex flex-col items-start rounded-2xl border border-cyan-200/80 bg-gradient-to-b from-cyan-50/60 to-white p-3 text-left transition-all hover:border-cyan-400 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider text-cyan-900 uppercase bg-cyan-100/80 px-1.5 py-0.5 rounded">
            <Zap className="size-2.5 text-cyan-700" /> Pharmacy
          </span>
          <span className="mt-2 text-[13px] font-bold text-slate-950">Lena Novak</span>
          <span className="text-[11px] text-stone-500 truncate w-full">Fulfillment Outbox</span>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#F2E8DC] pt-3 text-[11.5px] text-stone-500">
        <button
          type="button"
          onClick={() => setShowAllUsers(!showAllUsers)}
          className="text-teal-800 font-semibold hover:underline flex items-center gap-1"
        >
          <span>{showAllUsers ? 'Hide team list' : 'View all 8 demo personas'}</span>
          <ArrowRight className={`size-3 transition-transform ${showAllUsers ? '-rotate-90' : 'rotate-90'}`} />
        </button>
        <span className="font-mono text-[10.5px] text-stone-500">All passwords: <strong className="text-slate-800">{DEMO_PASSWORD}</strong></span>
      </div>

      {showAllUsers && (
        <ul className="mt-3 grid gap-1.5 max-h-48 overflow-y-auto pr-1">
          {USERS.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => onPick(u.email)}
                className="group flex w-full items-center gap-2.5 rounded-xl border border-stone-200/60 bg-[#FAF7F2] px-3 py-2 text-left transition-colors hover:border-teal-300 hover:bg-white"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-teal-800 border border-stone-200" aria-hidden>
                  {initials(u.name) || <UserRound className="size-3.5" />}
                </span>
                <span className="min-w-0 flex-1 flex items-baseline justify-between gap-2">
                  <span className="truncate text-xs font-semibold text-slate-900">{u.name}</span>
                  <span className="text-[10.5px] font-mono text-stone-500">
                    {ROLE_LABELS[u.role]}
                  </span>
                </span>
                <ArrowRight className="size-3 shrink-0 text-stone-400 group-hover:text-teal-700 transition-colors" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
