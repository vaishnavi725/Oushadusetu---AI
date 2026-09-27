import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, KeyRound, LogIn, Mail, UserRound, Zap } from 'lucide-react';
import { ROLE_LABELS } from '@shared/domain/permissions.ts';
import { signInSchema, type SignInInput } from '@shared/schemas/index.ts';
import { MFA_REQUIRED_ROLES } from '@shared/types.ts';
import { useAuth } from '@/app/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
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
    return <Navigate to={next ?? '/dashboard'} replace />;
  }

  const handleSuccessfulSignIn = () => {
    refresh();
    const dest = next ?? '/dashboard';
    navigate(dest, { replace: true });
  };

  const onSubmit = async (values: SignInInput) => {
    setFormError(null);
    try {
      const result = await authService.signIn(values.email, values.password);
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
    try {
      const u = USERS.find((x) => x.email.toLowerCase() === email.toLowerCase());
      if (u && authService.devSwitchUser) {
        authService.devSwitchUser(u.key, 'aal2');
        handleSuccessfulSignIn();
        return;
      }
      const result = await authService.signIn(email, DEMO_PASSWORD);
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
      title={
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-bold text-brand-900 tracking-tight">OushadhaSetu</span>
            <span className="text-[20px] font-bold text-teal-800">Sign in</span>
          </div>
          <span className="text-[13px] font-normal text-teal-700 tracking-normal">Autonomous Prescription Refill &amp; Lapse Prevention</span>
        </div>
      }
      description="Sign in to your clinical workstation to review refill queues, monitor AI safety alerts, and manage prescription adherence."
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
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium shadow-md shadow-teal-900/10" 
            loading={isSubmitting} 
            icon={<LogIn className="size-4" aria-hidden />}
          >
            Sign In
          </Button>

          <Button
            type="button"
            size="lg"
            variant="secondary"
            onClick={() => void instantDemoLogin('dr.kumar@valleyhealth.org')}
            disabled={isDemoSigningIn}
            loading={isDemoSigningIn}
            className="w-full border-teal-300 bg-teal-50/80 hover:bg-teal-100 text-teal-950 font-semibold shadow-xs"
            icon={<Zap className="size-4 text-amber-500 fill-amber-500" aria-hidden />}
          >
            Demo Login
          </Button>
        </div>
      </form>
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
  return (
    <section aria-labelledby="demo-accounts" className="rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50/70 via-white/80 to-blue-50/40 p-4.5 backdrop-blur-md sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-teal-100/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-lg bg-teal-600 text-white text-[11px] font-bold shadow-xs">✦</span>
          <h2 id="demo-accounts" className="text-[13px] font-bold tracking-wide text-teal-950 uppercase">
            Demo Login
          </h2>
        </div>
        <p className="flex items-center gap-1 text-[11.5px] text-ink-500 font-medium">
          <KeyRound className="size-3.5 text-teal-600" aria-hidden />
          MFA code: <span className="font-mono font-semibold text-teal-900 bg-teal-100/80 px-1.5 py-0.5 rounded text-[11px]">{DEMO_MFA_CODE}</span>
        </p>
      </div>

      <p className="mt-2.5 text-[12.5px] text-ink-600 leading-relaxed">
        Click any role below for <strong className="text-teal-900">1-Click Instant Login</strong> into the OushadhaSetu clinical dashboard:
      </p>

      {/* Instant 1-Click Fast Actions */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onInstantLogin('dr.kumar@valleyhealth.org')}
          className="flex flex-col items-start p-2.5 rounded-xl border border-teal-200 bg-white hover:bg-teal-50/80 hover:border-teal-400 text-left transition-all shadow-xs group"
        >
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-teal-800 uppercase tracking-wider">
            <Zap className="size-3 text-amber-500 fill-amber-500" /> Provider
          </span>
          <span className="font-semibold text-ink-900 text-[13px] mt-1 group-hover:text-teal-900">Dr. Rajesh Kumar</span>
          <span className="text-[11px] text-ink-500">Physician Reviewer</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onInstantLogin('sarah.jenkins@valleyhealth.org')}
          className="flex flex-col items-start p-2.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50/80 hover:border-blue-400 text-left transition-all shadow-xs group"
        >
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-blue-800 uppercase tracking-wider">
            <Zap className="size-3 text-amber-500 fill-amber-500" /> Practice
          </span>
          <span className="font-semibold text-ink-900 text-[13px] mt-1 group-hover:text-blue-900">Sarah Jenkins</span>
          <span className="text-[11px] text-ink-500">Practice Admin</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onInstantLogin('alex.rivera@highlandrx.org')}
          className="flex flex-col items-start p-2.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50/80 hover:border-emerald-400 text-left transition-all shadow-xs group"
        >
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            <Zap className="size-3 text-amber-500 fill-amber-500" /> Pharmacy
          </span>
          <span className="font-semibold text-ink-900 text-[13px] mt-1 group-hover:text-emerald-900">Alex Rivera</span>
          <span className="text-[11px] text-ink-500">Pharmacy Staff</span>
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-teal-100 flex items-center justify-between text-[11.5px] text-ink-500">
        <span>Or click to auto-fill form:</span>
        <span className="font-mono text-[11px] text-ink-700 bg-slate-100 px-2 py-0.5 rounded">Pass: {DEMO_PASSWORD}</span>
      </div>

      <ul className="mt-2 grid gap-1">
        {USERS.map((u) => (
          <li key={u.id}>
            <button
              type="button"
              onClick={() => onPick(u.email)}
              className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors hover:bg-white/90 border border-transparent hover:border-teal-200"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[11px] font-semibold text-teal-800" aria-hidden>
                {initials(u.name) || <UserRound className="size-3.5" />}
              </span>
              <span className="min-w-0 flex-1 flex items-baseline justify-between gap-2">
                <span className="truncate text-[12.5px] font-medium text-ink-900">{u.name}</span>
                <span className="text-[11px] text-ink-500">
                  {ROLE_LABELS[u.role]}
                </span>
              </span>
              <ArrowRight className="size-3.5 shrink-0 text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-700" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
