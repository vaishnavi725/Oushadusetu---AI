import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { OushadhaLogo } from './OushadhaLogo';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Hierarchy', href: '#pyramid-solution' },
  { label: 'Platform', href: '#platform' },
  { label: 'How It Works', href: '#flow-works' },
  { label: 'AI Intelligence', href: '#ai-agents' },
  { label: 'Digital Twin', href: '#digital-twin' },
  { label: 'Analytics', href: '#analytics' },
];

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.href.slice(1))).filter((node): node is HTMLElement => Boolean(node));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.15, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-slate-200/80 bg-white/90 py-3.5 shadow-sm backdrop-blur-md'
            : 'border-b border-transparent bg-white/70 py-4 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-lg">
            <OushadhaLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white p-1 md:flex" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  active === link.href ? 'bg-teal-800 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="group inline-flex items-center gap-2 rounded-full bg-teal-800 px-5 py-2.5 text-xs font-semibold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              <span>Request access</span>
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile navigation menu"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 md:hidden"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute top-0 right-0 bottom-0 flex w-[85%] max-w-sm flex-col overflow-y-auto border-l border-slate-200 bg-white p-6 text-slate-900 shadow-2xl"
              role="dialog"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <OushadhaLogo size="sm" showSubtitle={false} />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 py-6">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-teal-800"
                  >
                    <span>{link.label}</span>
                    <span className="text-slate-500 text-xs">→</span>
                  </a>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 border-t border-slate-200 pt-6">
                <Link
                  to="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-3.5 text-sm font-semibold text-white"
                >
                  <span>Request access</span>
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
