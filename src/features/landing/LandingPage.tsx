import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown, ShieldCheck, HeartPulse, Brain, Sparkles } from 'lucide-react';
import { LandingNavbar } from './LandingNavbar';
import { CapsuleHeroVisual } from './CapsuleHeroVisual';
import { WordByWord } from './WordByWord';
import { CapsuleEntranceSequence } from './CapsuleEntranceSequence';
import { ContinuousRefillFlow } from './ContinuousRefillFlow';
import { SceneTransitionSection } from './SceneTransitionSection';
import { EcosystemFlowSection } from './EcosystemFlowSection';
import { DigitalTwinSection } from './DigitalTwinSection';
import { SilentLapseSection } from './SilentLapseSection';
import { ConnectedAiAgentsSection } from './ConnectedAiAgentsSection';
import { ExplainabilitySection } from './ExplainabilitySection';
import { ClinicalCollaborationSection } from './ClinicalCollaborationSection';
import { BottomCtaBanner } from './BottomCtaBanner';
import { LandingFooter } from './LandingFooter';
import { ParticleBackground } from '@/components/pharma';
import { RefillWalkthrough } from './RefillWalkthrough';
import { AboutSection } from './AboutSection';
import { PyramidSolutionSection } from './PyramidSolutionSection';
import { AutoAdvanceWidget } from './AutoAdvanceWidget';

export default function LandingPage() {
  // Cinematic capsule entrance gate:
  // When a user first enters OushadhaSetu, DO NOT immediately show the landing page.
  // First show the fullscreen cinematic capsule scene.
  const [showEntrance, setShowEntrance] = useState(true);
  const [hasRevealed, setHasRevealed] = useState(false);

  const handleEntranceComplete = () => {
    setShowEntrance(false);
    setHasRevealed(true);
  };

  const handleReplayIntro = () => {
    setHasRevealed(false);
    setShowEntrance(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAF6F0] font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-950">
      {/* 1. CINEMATIC CAPSULE ENTRANCE ANIMATION (Fullscreen Scene 1) */}
      <AnimatePresence>
        {showEntrance && (
          <CapsuleEntranceSequence
            onComplete={handleEntranceComplete}
            onSkip={handleEntranceComplete}
          />
        )}
      </AnimatePresence>

      {/* 2. CONTINUOUS REFILL FLOW STREAM (Runs through the entire website) */}
      <ContinuousRefillFlow />

      {/* Global Scroll Progress Bar */}
      <ScrollProgress />

      {/* Main Landing Page (Camera pushes through capsule into here) */}
      <motion.div
        animate={
          hasRevealed
            ? {
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
              }
            : showEntrance
            ? {
                opacity: 0,
                scale: 0.94,
                filter: 'blur(16px)',
              }
            : {
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
              }
        }
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full"
      >
        {/* Navigation Bar with Replay Intro CTA */}
        <LandingNavbar onReplayIntro={handleReplayIntro} />

        {/* ============================================================== */}
        {/* HERO SECTION: "Keep Every Refill Moving."                      */}
        {/* ============================================================== */}
        <section className="relative flex min-h-[calc(100vh-80px)] flex-col justify-center overflow-hidden bg-[radial-gradient(1100px_500px_at_75%_10%,rgba(247,228,215,0.65),transparent_70%),radial-gradient(600px_350px_at_20%_80%,rgba(238,219,204,0.4),transparent_60%),linear-gradient(180deg,#FFFDFB_0%,#FAF6F0_100%)] pt-8 pb-16 lg:py-20">
          {/* Subtle Ambient Particle System */}
          <ParticleBackground className="opacity-35" />

          {/* Cyan Glow Anchor connecting from the Entrance Capsule */}
          <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-cyan-400/10 blur-[100px]" />

          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Word-by-Word Headline & Micro-Copy (col-span-7) */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                {/* Replay Cinematic Intro Badge */}
                <motion.button
                  type="button"
                  onClick={handleReplayIntro}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-50/80 px-3.5 py-1 text-xs font-semibold text-teal-900 shadow-sm transition hover:bg-cyan-100/90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="size-3.5 text-cyan-600 animate-pulse" />
                  <span>Interactive 3D Capsule Entrance</span>
                  <span className="text-[10px] text-teal-700 font-mono">· Replay</span>
                </motion.button>

                {/* Main Headline: Animated WORD BY WORD */}
                <div className="space-y-2">
                  <div>
                    <WordByWord
                      text="Keep Every Refill Moving."
                      as="h1"
                      className="font-display text-4xl leading-[1.08] font-semibold tracking-tight text-slate-950 sm:text-6xl xl:text-7xl"
                      delay={0.15}
                      stagger={0.09}
                    />
                  </div>

                  <div>
                    <WordByWord
                      text="AI that detects, resolves, and prevents medication refill delays."
                      as="p"
                      className="text-2xl leading-[1.15] font-semibold tracking-tight text-teal-800 sm:text-4xl xl:text-5xl"
                      delay={0.55}
                      stagger={0.08}
                    />
                  </div>
                </div>

                {/* Micro-copy line */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-4 text-xs font-medium tracking-wide text-teal-800 sm:text-sm"
                >
                  From refill request to resolution — intelligently orchestrated.
                </motion.div>

                {/* Supporting Text */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-4 max-w-[560px] text-base leading-relaxed text-slate-600 sm:text-lg"
                >
                  OushadhaSetu connects patients, pharmacies, providers, and insurers through intelligent refill orchestration — detecting blockers and preventing medication lapses before they happen.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto"
                >
                  <Link
                    to="/login"
                    className="group inline-flex min-w-[210px] items-center justify-center gap-2.5 rounded-full bg-teal-800 px-8 py-4 text-base font-semibold text-white shadow-[0_12px_30px_-16px_rgba(15,118,110,0.8)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Open the command center</span>
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                  <a
                    href="#platform"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:text-slate-950"
                  >
                    <span>Walk a stuck refill</span>
                    <ChevronDown className="size-4 text-slate-400" />
                  </a>
                </motion.div>

                {/* Trust Metrics */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.55, duration: 0.5 }}
                  className="mt-10 flex flex-wrap items-center gap-6 border-t border-slate-200 pt-6 text-xs text-slate-500"
                >
                  <div className="flex items-center gap-1.5 text-teal-800">
                    <ShieldCheck className="size-4" />
                    <span>HIPAA &amp; SOC2 aligned</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Brain className="size-4 text-teal-700" />
                    <span>Human-in-the-loop AI</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HeartPulse className="size-4 text-sky-700" />
                    <span>No unnoticed gaps</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Hero Capsule & Flow Visual (col-span-5) */}
              <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex items-center justify-center">
                <CapsuleHeroVisual />
              </div>
            </div>
          </div>

          {/* Curved Organic Arch Boundary Transition */}
          <div className="pointer-events-none absolute -bottom-1 inset-x-0 h-10 bg-[#FAF6F0] [clip-path:ellipse(60%_100%_at_50%_100%)] opacity-85" />
        </section>

        {/* ============================================================== */}
        {/* CONTINUOUS SCENE TRANSITIONS: ONE CONNECTED JOURNEY            */}
        {/* ============================================================== */}

        {/* 2. Section: About OushadhaSetu */}
        <SceneTransitionSection id="about" direction="up">
          <AboutSection />
        </SceneTransitionSection>

        {/* 3. Section: 4-Tier Refill Resolution Pyramid Hierarchy */}
        <SceneTransitionSection id="pyramid-solution" direction="up">
          <PyramidSolutionSection />
        </SceneTransitionSection>

        {/* 4. Section: Interactive Refill Walkthrough */}
        <SceneTransitionSection id="platform" direction="up">
          <RefillWalkthrough />
        </SceneTransitionSection>

        {/* 5. Section: Ecosystem Flow */}
        <SceneTransitionSection id="flow-works" direction="up">
          <EcosystemFlowSection />
        </SceneTransitionSection>

        {/* 6. Section: "Every Refill Has a Digital Twin." */}
        <SceneTransitionSection id="digital-twin" direction="up">
          <DigitalTwinSection />
        </SceneTransitionSection>

        {/* 7. Section: "Don't Wait for the Refill Request." (Silent Lapse) */}
        <SceneTransitionSection id="silent-lapse" direction="up">
          <SilentLapseSection />
        </SceneTransitionSection>

        {/* 8. Section: "Intelligence Behind Every Refill." (AI Agents) */}
        <SceneTransitionSection id="ai-agents" direction="up">
          <ConnectedAiAgentsSection />
        </SceneTransitionSection>

        {/* 9. Section: "AI That Explains Every Decision." (Explainability) */}
        <SceneTransitionSection id="explainability" direction="up">
          <ExplainabilitySection />
        </SceneTransitionSection>

        {/* 10. Section: "Refill Operations, At a Glance." (Analytics) */}
        <SceneTransitionSection id="analytics" direction="up">
          <ClinicalCollaborationSection />
        </SceneTransitionSection>

        {/* 11. Bottom CTA Banner */}
        <SceneTransitionSection direction="up">
          <BottomCtaBanner />
        </SceneTransitionSection>

        {/* 12. Minimal Healthcare SaaS Footer */}
        <LandingFooter />

        {/* 13. 2-Minute Auto-Advance Tour Widget */}
        <AutoAdvanceWidget durationSeconds={120} destinationRoute="/login" />
      </motion.div>
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-teal-700" aria-hidden />;
}
