import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowRight, ChevronDown, ShieldCheck, HeartPulse, Brain } from 'lucide-react';
import { LandingNavbar } from './LandingNavbar';
import { CapsuleHeroVisual } from './CapsuleHeroVisual';
import { WordByWord } from './WordByWord';
import { EcosystemFlowSection } from './EcosystemFlowSection';
import { DigitalTwinSection } from './DigitalTwinSection';
import { SilentLapseSection } from './SilentLapseSection';
import { ConnectedAiAgentsSection } from './ConnectedAiAgentsSection';
import { ExplainabilitySection } from './ExplainabilitySection';
import { ClinicalCollaborationSection } from './ClinicalCollaborationSection';
import { BottomCtaBanner } from './BottomCtaBanner';
import { LandingFooter } from './LandingFooter';
import { RefillWalkthrough } from './RefillWalkthrough';
import { AboutSection } from './AboutSection';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAF6F0] font-sans text-slate-900 selection:bg-teal-100 selection:text-teal-950">
      <ScrollProgress />
      <LandingNavbar />

      <section className="relative flex min-h-[calc(100vh-80px)] flex-col justify-center overflow-hidden bg-[radial-gradient(1100px_500px_at_75%_10%,rgba(247,228,215,0.65),transparent_70%),radial-gradient(600px_350px_at_20%_80%,rgba(238,219,204,0.4),transparent_60%),linear-gradient(180deg,#FFFDFB_0%,#FAF6F0_100%)] pt-8 pb-16 lg:py-20">

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Word-by-Word Headline & Micro-Copy (col-span-7) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Main Headline: Animated WORD BY WORD */}
              <div className="space-y-2">
                <div>
                  <WordByWord
                    text="Keep Every Refill Moving."
                    as="h1"
                    className="font-display text-4xl leading-[1.08] font-semibold tracking-tight text-slate-950 sm:text-6xl xl:text-7xl"
                    delay={0.1}
                    stagger={0.1}
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
      </section>

      {/* 2. Section: About OushadhaSetu */}
      <AboutSection />

      <RefillWalkthrough />

      <EcosystemFlowSection />

      {/* 4. Section 3: "Every Refill Has a Digital Twin." */}
      <DigitalTwinSection />

      {/* 5. Section 4: "Don't Wait for the Refill Request." (Silent Lapse) */}
      <SilentLapseSection />

      {/* 6. Section 5: "Intelligence Behind Every Refill." (AI Agents) */}
      <ConnectedAiAgentsSection />

      {/* 7. Section 6: "AI That Explains Every Decision." (Explainability) */}
      <ExplainabilitySection />

      {/* 8. Section 7: "Refill Operations, At a Glance." (Analytics) */}
      <ClinicalCollaborationSection />

      {/* 9. Bottom CTA Banner */}
      <BottomCtaBanner />

      {/* 10. Minimal Healthcare SaaS Footer */}
      <LandingFooter />
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
