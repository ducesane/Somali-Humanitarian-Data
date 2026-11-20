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
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const PRIMARY_TABS = [
  { href: '/', label: 'Overview', icon: Compass },
  { href: '/districts', label: 'Districts', count: '90', icon: MapPin },
  { href: '/ngos', label: 'NGO Partners', count: '204', icon: Building2 },
  { href: '/undp-projects', label: 'UNDP Projects', count: '50', icon: FolderDown },
  { href: '/vendors', label: 'Vendors & Contractors', count: '364', icon: ReceiptText },
  { href: '/tenders', label: 'Live Tenders & Awards', count: '47', icon: Radio, isLive: true },
  { href: '/pipeline', label: 'Data Pipeline', icon: Activity, badge: 'Live' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-emerald-900/30 text-white shadow-xl">
      {/* ============================================================== */}
      {/* TIER 1: BRANDING, STATUS INDICATORS & GLOBAL ACTIONS */}
      {/* ============================================================== */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Brand Logo & Title */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-950/50 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block leading-tight">
                  Somalia Humanitarian Intelligence
                </span>
                <span className="text-[11px] text-emerald-400 font-medium tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  2026 Open Platform &bull; UN OCHA, UNDP &amp; UNGM
                </span>
              </div>
            </Link>

            {/* Right Side: Live Badge, Dossier CTA & GitHub */}
            <div className="hidden md:flex items-center gap-3">
              {/* UNGM Pipeline Quick Indicator */}
              <Link
                href="/tenders"
                className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-xs text-emerald-300 hover:bg-emerald-900/50 transition-colors"
                title="View active tenders and contract awards"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold">UNGM Live:</span>
                <span className="font-mono text-emerald-200">47 Tenders &bull; 451 Awards</span>
              </Link>

              {/* Proposal Dossier Builder CTA Button */}
              <Link
                href="/dossier-builder"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition-all hover:scale-102"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>Proposal Dossier Builder</span>
              </Link>

              {/* GitHub Link */}
              <a
                href="https://github.com/ducesane/Somali-Humanitarian-Data"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors border border-slate-800"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TIER 2: PRIMARY HORIZONTAL NAVIGATION TABS */}
      {/* ============================================================== */}
      <div className="hidden md:block bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {PRIMARY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
              
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 relative ${
                    isActive
                      ? 'bg-slate-800/90 text-emerald-400 border border-slate-700/80 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  
                  {/* Count / Live Badge */}
                  {tab.count && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-semibold ${
                        tab.isLive
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                          : isActive
                          ? 'bg-emerald-950/60 text-emerald-300'
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

                  {/* Active Bottom Highlight Line */}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE MENU DROPDOWN */}
      {/* ============================================================== */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-1">
          {/* Mobile Proposal Builder Button */}
          <Link
            href="/dossier-builder"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs mb-3 shadow-md"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Proposal Dossier Builder</span>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-200" />
          </Link>

          {/* Navigation Links */}
          {PRIMARY_TABS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                  isActive
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

          <div className="pt-3 border-t border-slate-800 mt-2">
            <a
              href="https://github.com/ducesane/Somali-Humanitarian-Data"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 rounded-xl transition-colors border border-slate-800"
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
