import { useState } from 'react';
import { Menu, ShieldCheck, X } from 'lucide-react';
import { AppView } from '../types/fraud';

interface TopBarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  onNewIncident: () => void;
}

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: 'home', label: 'Overview' },
  { id: 'intake', label: 'File Report' },
  { id: 'tracker', label: 'Track Case' },
  { id: 'triage', label: 'Officer Triage' },
  { id: 'precincts', label: 'Precincts' },
];

export function TopBar({ activeView, onNavigate, onNewIncident }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#1C1C1C]/[0.06] bg-[#EFF0EC]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8 lg:px-12">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4F0B] rounded-lg py-1"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#0B4F0B] text-[#B6F21C]">
            <ShieldCheck className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="text-[17px] lg:text-[18px] font-bold tracking-[-0.02em] text-[#1C1C1C] whitespace-nowrap shrink-0">
            Sentinel Civic
          </span>
        </button>

        {/* Zone 2: Single-line Navigation Links (Tablet md+ and Desktop lg+) */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-3.5 lg:gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-2 text-[13px] lg:text-[14px] font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4F0B] rounded-md ${
                  isActive
                    ? 'text-[#0B4F0B]'
                    : 'text-[#41493D] hover:text-[#1C1C1C]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[1px] h-[2.5px] rounded-full bg-[#0B4F0B]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action CTA + Mobile Drawer Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNewIncident();
            }}
            className="inline-flex h-9 sm:h-10 items-center justify-center rounded-full bg-[#B6F21C] px-3.5 sm:px-4 lg:px-5 text-[13px] lg:text-[14px] font-bold text-[#1C1C1C] transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_8px_18px_-4px_rgba(182,242,28,0.65)] active:translate-y-0 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#0B4F0B]/40"
          >
            <span className="sm:hidden">New Report</span>
            <span className="hidden sm:inline">New Incident</span>
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-[12px] border border-[#1C1C1C]/15 bg-white text-[#1C1C1C]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#1C1C1C]/[0.06] bg-white px-4 py-3 md:hidden shadow-lg">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`flex h-11 items-center justify-between rounded-[12px] px-3.5 text-left text-[15px] font-semibold ${
                    isActive
                      ? 'bg-[#C4F25A]/35 text-[#0B4F0B]'
                      : 'text-[#1C1C1C] hover:bg-[#FAFAF9]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
