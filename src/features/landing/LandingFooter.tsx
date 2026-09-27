import { Link } from 'react-router-dom';
import { OushadhaLogo } from './OushadhaLogo';

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-14 text-xs text-slate-500">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-slate-200 pb-10 md:flex-row">
          <div className="max-w-md">
            <OushadhaLogo size="md" />
            <p className="mt-3 text-sm font-medium text-slate-800">&ldquo;Keep every refill moving.&rdquo;</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              An operating system for prescription refill resolution, connecting patients, pharmacies, providers, and insurers.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 sm:gap-12">
            <div>
              <div className="mb-3 text-xs font-semibold tracking-wide text-slate-900 uppercase">Navigation</div>
              <ul className="space-y-2">
                <li><a href="#about" className="transition hover:text-teal-800">About</a></li>
                <li><a href="#platform" className="transition hover:text-teal-800">Platform</a></li>
                <li><a href="#ai-agents" className="transition hover:text-teal-800">AI intelligence</a></li>
                <li><a href="#digital-twin" className="transition hover:text-teal-800">Digital twin</a></li>
                <li><a href="#analytics" className="transition hover:text-teal-800">Analytics</a></li>
                <li><Link to="/login" className="transition hover:text-teal-800">Login</Link></li>
              </ul>
            </div>
            <div>
              <div className="mb-3 text-xs font-semibold tracking-wide text-slate-900 uppercase">Governance</div>
              <ul className="space-y-2">
                <li>HIPAA &amp; HITECH</li>
                <li>SOC 2 Type II</li>
                <li>HL7 FHIR R4</li>
                <li>Human in the loop</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>© {new Date().getFullYear()} OushadhaSetu. All rights reserved.</p>
          <p className="font-medium text-teal-800">Autonomous prescription refill and lapse prevention</p>
        </div>
      </div>
    </footer>
  );
}
