'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  MapPin,
  Building2,
  FileText,
  Activity,
  Menu,
  X,
  ExternalLink,
  FolderDown,
  ReceiptText,
  Radio,
  Sparkles,
  Trophy,
  ChevronRight,
  Globe2,
  Briefcase,
  Layers,
  Smartphone
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Pillar I: Field & Territorial Intelligence
const FIELD_TABS = [
  { href: '/', label: 'Platform Overview', icon: Compass },
  { href: '/districts', label: 'Districts & Locations', count: '90', icon: MapPin },
  { href: '/ngos', label: 'NGO Operational Presence', count: '211', icon: Building2 },
];

// Pillar II: Funding, Contracts & Strategic Pipeline
const PROCUREMENT_TABS = [
  { href: '/undp-projects', label: 'UNDP Projects', count: '203', icon: FolderDown },
  { href: '/vendors', label: 'Vendors & Contractors', count: '364', icon: ReceiptText },
  { href: '/tenders', label: 'Live Tenders & Awards', count: '47', icon: Radio, isLive: true },
  { href: '/cash-audit', label: 'Cash Programming (CVA)', icon: Smartphone, badge: '$592M' },
  { href: '/dossier-builder', label: 'Proposal Dossier Builder', icon: Sparkles, highlight: true },
  { href: '/pipeline', label: 'Data Pipeline & Status', icon: Activity, badge: 'Live' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Always visible near the top of the page
          if (currentScrollY < 100) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 180) {
            // Scrolling down towards the middle of the page -> hide navbar
            setIsVisible(false);
            setIsOpen(false);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling back up -> reveal navbar smoothly
            setIsVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 bg-slate-950/98 backdrop-blur-md border-b border-emerald-900/40 text-white shadow-2xl transition-all duration-300 ease-in-out ${isVisible || isOpen
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none'
        }`}
    >

      {/* ============================================================== */}
      {/* TIER 1: GLOBAL BRANDING, REAL-TIME STATUS & ACTIONS            */}
      {/* ============================================================== */}
      <div className="border-b border-slate-800/90 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-13 py-2">

            {/* Brand Logo & Title */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-950/50 group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block leading-none">
                    Somalia Humanitarian Intelligence
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                    2026 Open Platform
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide mt-0.5">
                  Multi-Agency Harmonized Data &bull; UN OCHA, UNDP, UNGM &amp; IOM DTM
                </span>
              </div>
            </Link>

            {/* Right Side: UNGM Live Status, Quick Stats & GitHub */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* UNGM Live Indicator */}
              <Link
                href="/tenders"
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/70 text-xs text-emerald-300 hover:bg-emerald-900/60 transition-colors shadow-sm"
                title="View 47 active Somalia bids and 822 contract awards"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-[11px]">UNGM Live:</span>
                <span className="font-mono text-[11px] text-emerald-200">47 Tenders &bull; 822 Awards</span>
              </Link>

              {/* GitHub Link */}
              <a
                href="https://github.com/ducesane/Somali-Humanitarian-Data"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors border border-slate-800"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TIER 2: PILLAR I — FIELD & TERRITORIAL PRESENCE                */}
      {/* ============================================================== */}
      <div className="border-b border-slate-800/70 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1">

            {/* Left Category Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-4">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Field &amp; Territory:</span>
            </div>

            {/* Navigation Tabs - No Scrolling Needed */}
            <nav className="flex items-center gap-2 flex-wrap">
              {FIELD_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${isActive
                        ? 'bg-slate-800 text-emerald-300 border border-slate-700 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>

                    {tab.count && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${isActive
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                          }`}
                      >
                        {tab.count}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Context Hint */}
            <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span>90 Districts &bull; 18 Regions &bull; 211 Active Partners</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TIER 3: PILLAR II — FUNDING, CONTRACTS & STRATEGIC PIPELINE    */}
      {/* ============================================================== */}
      <div className="bg-slate-950/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1.5">

            {/* Left Category Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-4">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Contracts &amp; Pipeline:</span>
            </div>

            {/* Navigation Tabs - No Scrolling Needed */}
            <nav className="flex items-center gap-2 flex-wrap">
              {PROCUREMENT_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname.startsWith(tab.href);

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${tab.highlight
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-bold hover:from-emerald-500 hover:to-teal-500 shadow-sm'
                        : isActive
                          ? 'bg-slate-800 text-amber-300 border border-slate-700 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${tab.highlight ? 'text-slate-950' : isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>

                    {tab.count && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${tab.isLive
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                            : isActive
                              ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                      >
                        {tab.isLive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>}
                        {tab.count}
                      </span>
                    )}

                    {tab.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-800/80">
                        {tab.badge}
                      </span>
                    )}

                    {!tab.highlight && isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Context Hint */}
            <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span>$961M Budget &bull; $87M Orders &bull; UNGM Synced</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE COLLAPSIBLE MENU                                        */}
      {/* ============================================================== */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-4">

          {/* Pillar I Links */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1 flex items-center gap-1.5 tracking-wider">
              <Globe2 className="w-3 h-3 text-emerald-400" />
              <span>Field &amp; Territorial Presence</span>
            </div>
            {FIELD_TABS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${isActive
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Pillar II Links */}
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1 flex items-center gap-1.5 tracking-wider">
              <Briefcase className="w-3 h-3 text-amber-400" />
              <span>Funding, Contracts &amp; Pipeline</span>
            </div>
            {PROCUREMENT_TABS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${item.highlight
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-bold'
                      : isActive
                        ? 'bg-slate-800 text-amber-400 border border-slate-700'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Footer */}
          <div className="pt-3 border-t border-slate-800">
            <a
              href="https://github.com/ducesane/Somali-Humanitarian-Data"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 rounded-lg transition-colors border border-slate-800"
            >
              <span>View Source on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
