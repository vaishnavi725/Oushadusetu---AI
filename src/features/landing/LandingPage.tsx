import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
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
import { NcetSection } from './NcetSection';
import { BottomCtaBanner } from './BottomCtaBanner';
import { LandingFooter } from './LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] selection:bg-teal-500/20 selection:text-teal-200 font-sans overflow-x-hidden">
      {/* 1. Transparent / Frosted Navbar */}
      <LandingNavbar />

      {/* 2. Fullscreen Hero (min-h-[100vh]) */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center pt-8 pb-16 lg:py-20 overflow-hidden bg-gradient-to-b from-[#07111F] via-[#0B1726] to-[#07111F]">
        {/* Subtle Ambient Depth Lighting */}
        <div className="absolute top-1/4 left-1/3 size-[500px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 size-[450px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Word-by-Word Headline & Micro-Copy (col-span-7) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-white/5 text-teal-300 border border-white/10 mb-6"
              >
                <span className="size-2 rounded-full bg-teal-400" />
                <span className="font-mono uppercase tracking-widest text-[11px]">
                  Autonomous Prescription Refill &amp; Lapse Prevention
                </span>
              </motion.div>

              {/* Main Headline: Animated WORD BY WORD */}
              <div className="space-y-2">
                <div>
                  <WordByWord
                    text="Keep Every Refill Moving."
                    as="h1"
                    className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-display"
                    delay={0.1}
                    stagger={0.1}
                  />
                </div>

                <div>
                  <WordByWord
                    text="AI that detects, resolves, and prevents medication refill delays."
                    as="p"
                    className="text-2xl sm:text-4xl xl:text-5xl font-bold tracking-tight bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent leading-[1.15]"
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
                className="mt-4 text-xs sm:text-sm font-mono uppercase tracking-wider text-teal-300/80"
              >
                From refill request to resolution — intelligently orchestrated.
              </motion.div>

              {/* Supporting Text */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 text-base sm:text-lg text-slate-300 max-w-[560px] leading-relaxed"
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
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] min-w-[210px]"
                >
                  <span>Start the Refill Flow</span>
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#flow-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-base font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
                >
                  <span>Explore the System</span>
                  <ChevronDown className="size-4 text-slate-400" />
                </a>
              </motion.div>

              {/* Trust Metrics */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.55, duration: 0.5 }}
                className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono"
              >
                <div className="flex items-center gap-1.5 text-teal-300/90">
                  <ShieldCheck className="size-4" />
                  <span>HIPAA &amp; SOC2 Certified</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Brain className="size-4 text-teal-400" />
                  <span>Human-in-the-Loop AI</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <HeartPulse className="size-4 text-cyan-400" />
                  <span>Zero Unnoticed Gaps</span>
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

      {/* 3. Section 2: "One Refill. One Intelligent Flow." */}
      <EcosystemFlowSection />

      {/* 4. Section 3: "Every Refill Has a Digital Twin." */}
      <DigitalTwinSection />

      {/* 5. Section 4: "Don't Wait for the Refill Request." (Silent Lapse) */}
      <SilentLapseSection />

      {/* 6. Section 5: "Intelligence Behind Every Refill." (AI Agents) */}
      <ConnectedAiAgentsSection />

      {/* 7. Section 6: "AI That Explains Every Decision." (Explainability) */}
      <ExplainabilitySection />

      {/* 8. Section 7: "From Refill Data to Resolution Intelligence." (Analytics) */}
      <ClinicalCollaborationSection />

      {/* 9. NCET Institutional Credibility Section */}
      <NcetSection />

      {/* 10. Bottom CTA Banner */}
      <BottomCtaBanner />

      {/* 11. Minimal Footer with NCET Attribution */}
      <LandingFooter />
    </div>
  );
}
