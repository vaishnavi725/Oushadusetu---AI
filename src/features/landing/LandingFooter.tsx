import { Link } from 'react-router-dom';
import { OushadhaLogo } from './OushadhaLogo';

export function LandingFooter() {
  return (
    <footer className="bg-[#07111F] text-slate-400 text-xs py-14 border-t border-white/10">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-10 border-b border-white/10">
          <div className="max-w-md">
            <OushadhaLogo size="md" />
            <p className="mt-3 text-sm text-slate-300 font-medium">
              &ldquo;Keep Every Refill Moving.&rdquo;
            </p>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Autonomous Prescription Refill &amp; Lapse Prevention platform connecting patients, pharmacies, providers, and insurers.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 sm:gap-12">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-slate-200 mb-3 font-semibold">
                Navigation
              </div>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#platform" className="hover:text-teal-300 transition">Platform</a></li>
                <li><a href="#ai-agents" className="hover:text-teal-300 transition">AI Intelligence</a></li>
                <li><a href="#digital-twin" className="hover:text-teal-300 transition">Digital Twin</a></li>
                <li><a href="#analytics" className="hover:text-teal-300 transition">Analytics</a></li>
                <li><Link to="/login" className="hover:text-teal-300 transition">Login</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-slate-200 mb-3 font-semibold">
                Governance
              </div>
              <ul className="space-y-2 text-slate-400 font-mono text-[11px]">
                <li>HIPAA &amp; HITECH</li>
                <li>SOC2 Type II</li>
                <li>HL7 FHIR R4</li>
                <li>Human-in-the-Loop</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} OushadhaSetu. All rights reserved.</p>
          <p className="text-teal-400/90 font-medium">
            Autonomous Prescription Refill &amp; Lapse Prevention
          </p>
        </div>
      </div>
    </footer>
  );
}
