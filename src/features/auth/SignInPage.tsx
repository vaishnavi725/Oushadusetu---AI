import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { ArrowLeft, LogIn, Mail, ShieldCheck, UserRound, Zap, Sparkles } from 'lucide-react';
import { ROLE_LABELS, homeRouteFor } from '@shared/domain/permissions.ts';
import { signInSchema, type SignInInput } from '@shared/schemas/index.ts';
import { MFA_REQUIRED_ROLES } from '@shared/types.ts';
import { useAuth } from '@/app/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { PillLoader, ProjectFactCard } from '@/components/ui/PillLoader';
import { ApiError, authService, friendlyMessage } from '@/services';
import { DEMO_MFA_CODE, DEMO_PASSWORD, USERS } from '@/mocks/data/fixtures';
import { ParticleBackground } from '@/components/pharma';
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
  const [showDemoDrawer, setShowDemoDrawer] = useState(false);
  const next = safeNext(params.get('next'));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#03132F] text-[#F5FAFF] selection:bg-[#00D9FF]/30 selection:text-[#F5FAFF]">
      {/* 1. Ambient Background Lighting & Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[900px] rounded-full bg-[radial-gradient(circle,rgba(8,123,255,0.25)_0%,rgba(0,217,255,0.12)_40%,transparent_75%)] blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 size-[700px] rounded-full bg-[radial-gradient(circle,rgba(6,36,90,0.8)_0%,transparent_70%)] blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/3 right-10 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,217,255,0.15)_0%,transparent_70%)] blur-3xl -z-10" />

      {/* 2. Subdued Heart + Capsule Visual Integrated into Background */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{
          opacity: 0.45,
          scale: [1, 1.03, 1],
          y: [0, -10, 0],
        }}
        transition={{
          opacity: { duration: 1.2, ease: 'easeOut' },
          scale: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      >
        <img
          src="/images/heart-capsule.jpg"
          alt="Heart Capsule Technological Reference"
          className="h-full w-full max-w-[1500px] object-cover object-center mix-blend-screen filter saturate-[1.25] brightness-90"
        />
        {/* Cinematic Vignette Overlay to blend seamlessly with #03132F */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#03132F_78%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03132F] via-transparent to-[#03132F]/80" />
      </motion.div>

      {/* 3. Subtle Ambient Particle System */}
      <ParticleBackground className="opacity-30 pointer-events-none" />

      {/* 4. Top Navigation Bar */}
      <header className="relative z-20 flex w-full items-center justify-between px-6 py-6 sm:px-10 max-w-7xl mx-auto">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full border border-[rgba(0,217,255,0.2)] bg-[#06245A]/50 px-4 py-2 text-xs font-semibold text-[#A2C0E8] backdrop-blur-md transition-all hover:border-[#00D9FF] hover:bg-[#087BFF]/20 hover:text-[#00D9FF]"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Landing</span>
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,217,255,0.25)] bg-[#06245A]/50 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#00D9FF] backdrop-blur-md shadow-[0_0_15px_rgba(0,217,255,0.2)]">
          <ShieldCheck className="size-3.5 text-[#00D9FF]" />
          <span>Clinical Portal · MFA AAL2</span>
        </div>
      </header>

      {/* 5. Center Glass Login Experience (ONE Fullscreen Composition) */}
      <main className="relative z-10 flex min-h-[calc(100vh-140px)] flex-col items-center justify-center px-4 py-6 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[480px]"
        >
          {/* Brand Header */}
          <div className="mb-6 text-center">
            <Link to="/" className="inline-flex items-center justify-center gap-3 group focus:outline-none">
              <div className="relative">
                <img
                  src="/images/oushadha-icon.png"
                  alt="OushadhaSetu"
                  className="size-11 rounded-2xl border border-[rgba(0,217,255,0.4)] shadow-[0_0_24px_rgba(0,217,255,0.45)] object-contain transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-2xl bg-[#00D9FF]/20 blur-md -z-10 group-hover:bg-[#00D9FF]/35 transition-colors" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-[#F5FAFF]">
                <span>Oushadha</span>
                <span className="text-[#00D9FF] drop-shadow-[0_0_12px_rgba(0,217,255,0.5)]">Setu</span>
              </span>
            </Link>

            <h1 className="mt-3 font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#F5FAFF]">
              Continue to Your Refill Command Center
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#A2C0E8]">
              Open your workspace to review blockers, coordinate providers, and automate refills.
            </p>
          </div>

          {/* Transparent Glass Login Card */}
          <div className="relative rounded-3xl border border-[rgba(0,217,255,0.24)] bg-gradient-to-b from-[#06245A]/75 via-[#06245A]/60 to-[#03132F]/80 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(3,19,47,0.9),0_0_30px_rgba(0,217,255,0.12),inset_0_1px_0_rgba(255,255,255,0.12)]">
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
                leading={<Mail className="size-4 text-[#4DA3FF]" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <PasswordInput
                label="Password"
                autoComplete="current-password"
                placeholder="••••••••••••"
                error={errors.password?.message}
                labelAction={
                  <Link
                    to="/forgot-password"
                    className="text-[12px] font-semibold text-[#4DA3FF] hover:text-[#00D9FF] hover:underline"
                  >
                    Forgot password?
                  </Link>
                }
                {...register('password')}
              />

              <div className="space-y-2.5 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-sm font-semibold rounded-xl bg-gradient-to-r from-[#087BFF] to-[#0066e6] text-[#F5FAFF] shadow-[0_4px_20px_rgba(0,217,255,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] hover:from-[#00D9FF] hover:to-[#087BFF] hover:text-[#03132F] transition-all duration-200"
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
                  className="w-full h-11 text-xs font-semibold rounded-xl border border-[rgba(0,217,255,0.3)] bg-[#06245A]/70 text-[#F5FAFF] hover:border-[#00D9FF] hover:bg-[#087BFF]/25 hover:text-[#00D9FF] transition-all"
                  icon={<Zap className="size-4 text-[#00D9FF]" aria-hidden />}
                >
                  Quick Evaluator Demo Sign In
                </Button>
              </div>
            </form>

            {/* Collapsible Demo Personas for One-Click Testing */}
            <div className="mt-5 border-t border-[rgba(77,163,255,0.18)] pt-4">
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setShowDemoDrawer(!showDemoDrawer)}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#00D9FF] hover:underline cursor-pointer"
                >
                  <Sparkles className="size-3.5" />
                  <span>{showDemoDrawer ? 'Hide persona accounts' : 'Switch demo personas (8 available)'}</span>
                </button>
                <span className="font-mono text-[11px] text-[#749BC9]">
                  MFA: <strong className="text-[#00D9FF]">{DEMO_MFA_CODE}</strong>
                </span>
              </div>

              {showDemoDrawer && (
                <div className="mt-3.5 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      disabled={isDemoSigningIn}
                      onClick={() => instantDemoLogin('dr.rao@lakeside.example.com')}
                      className="flex flex-col items-start rounded-xl border border-[rgba(0,217,255,0.2)] bg-[#03132F]/80 p-2.5 text-left transition-all hover:border-[#00D9FF] hover:bg-[#087BFF]/20 active:scale-98"
                    >
                      <span className="flex items-center gap-1 text-[9.5px] font-mono font-bold tracking-wider text-[#00D9FF] uppercase bg-[#087BFF]/20 px-1.5 py-0.5 rounded">
                        <Zap className="size-2.5" /> Provider
                      </span>
                      <span className="mt-1 text-xs font-bold text-[#F5FAFF]">Dr. Anika Rao</span>
                      <span className="text-[10.5px] text-[#749BC9] truncate w-full">Approvals</span>
                    </button>

                    <button
                      type="button"
                      disabled={isDemoSigningIn}
                      onClick={() => instantDemoLogin('admin@lakeside.example.com')}
                      className="flex flex-col items-start rounded-xl border border-[rgba(77,163,255,0.2)] bg-[#03132F]/80 p-2.5 text-left transition-all hover:border-[#4DA3FF] hover:bg-[#087BFF]/20 active:scale-98"
                    >
                      <span className="flex items-center gap-1 text-[9.5px] font-mono font-bold tracking-wider text-[#4DA3FF] uppercase bg-[#087BFF]/20 px-1.5 py-0.5 rounded">
                        <Zap className="size-2.5" /> Practice
                      </span>
                      <span className="mt-1 text-xs font-bold text-[#F5FAFF]">Priya Shah</span>
                      <span className="text-[10.5px] text-[#749BC9] truncate w-full">Queue & Triage</span>
                    </button>

                    <button
                      type="button"
                      disabled={isDemoSigningIn}
                      onClick={() => instantDemoLogin('admin@citycare.example.com')}
                      className="flex flex-col items-start rounded-xl border border-[rgba(0,217,255,0.2)] bg-[#03132F]/80 p-2.5 text-left transition-all hover:border-[#00D9FF] hover:bg-[#087BFF]/20 active:scale-98"
                    >
                      <span className="flex items-center gap-1 text-[9.5px] font-mono font-bold tracking-wider text-[#00D9FF] uppercase bg-[#087BFF]/20 px-1.5 py-0.5 rounded">
                        <Zap className="size-2.5" /> Pharmacy
                      </span>
                      <span className="mt-1 text-xs font-bold text-[#F5FAFF]">Lena Novak</span>
                      <span className="text-[10.5px] text-[#749BC9] truncate w-full">Fulfillment</span>
                    </button>
                  </div>

                  <div className="max-h-36 overflow-y-auto pr-1 space-y-1">
                    {USERS.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => fillDemo(u.email)}
                        className="flex w-full items-center justify-between rounded-lg border border-[rgba(77,163,255,0.15)] bg-[#03132F]/60 px-2.5 py-1.5 text-left text-xs transition-colors hover:border-[#00D9FF] hover:bg-[#087BFF]/15"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#087BFF]/30 text-[10px] font-bold text-[#00D9FF]">
                            {initials(u.name) || <UserRound className="size-3" />}
                          </span>
                          <span className="truncate font-semibold text-[#F5FAFF]">{u.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[#749BC9]">{ROLE_LABELS[u.role]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer link */}
            <div className="mt-5 border-t border-[rgba(77,163,255,0.18)] pt-4 text-center text-xs text-[#A2C0E8]">
              Need an enterprise deployment?{' '}
              <Link to="/sign-up" className="font-semibold text-[#00D9FF] hover:underline">
                Request clinic access
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Pill Loading Overlay during instant persona authorization */}
      {isDemoSigningIn && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#03132F]/90 backdrop-blur-xl p-4 animate-in fade-in duration-200">
          <div className="flex flex-col items-center justify-center">
            <PillLoader size="2xl" showRings />
            <ProjectFactCard />
          </div>
        </div>
      )}
    </div>
  );
}
