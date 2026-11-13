/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CaseTrackerView } from './components/CaseTrackerView';
import { CitizenIntakeView } from './components/CitizenIntakeView';
import { HomeOverviewView } from './components/HomeOverviewView';
import { OfficerTriageView } from './components/OfficerTriageView';
import { PrecinctDirectoryView } from './components/PrecinctDirectoryView';
import { TopBar } from './components/TopBar';
import { FraudCaseProvider, useFraudCases } from './context/FraudCaseContext';
import { AppView } from './types/fraud';

function SentinelCivicShell() {
  const { setSelectedCaseId } = useFraudCases();
  const [activeView, setActiveView] = useState<AppView>('home');
  const [preselectedPrecinctCode, setPreselectedPrecinctCode] = useState<string | null>(null);
  const [preselectedChannel, setPreselectedChannel] = useState<string | null>(null);
  const [intakeResetKey, setIntakeResetKey] = useState(0);

  const handleNewIncident = (channel?: string) => {
    setPreselectedPrecinctCode(null);
    setPreselectedChannel(channel ?? null);
    setIntakeResetKey((k) => k + 1);
    setActiveView('intake');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCaseInTracker = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveView('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOfficerTriage = (caseId?: string) => {
    if (caseId) {
      setSelectedCaseId(caseId);
    }
    setActiveView('triage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRouteNewReportToPrecinct = (precinctCode: string) => {
    setPreselectedPrecinctCode(precinctCode);
    setPreselectedChannel(null);
    setIntakeResetKey((k) => k + 1);
    setActiveView('intake');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#EFF0EC] text-[#1C1C1C]">
      <TopBar
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNewIncident={() => handleNewIncident()}
      />

      <main className="flex-1">
        {activeView === 'home' && (
          <HomeOverviewView
            onStartNewIncident={handleNewIncident}
            onOpenCaseInTracker={handleOpenCaseInTracker}
            onOpenOfficerTriage={() => handleOpenOfficerTriage()}
            onOpenPrecincts={() => {
              setActiveView('precincts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'intake' && (
          <CitizenIntakeView
            key={intakeResetKey}
            preselectedPrecinctCode={preselectedPrecinctCode}
            preselectedChannel={preselectedChannel}
            onClearPreselectedPrecinct={() => setPreselectedPrecinctCode(null)}
            onReportDispatched={handleOpenCaseInTracker}
            onNavigateTracker={() => setActiveView('tracker')}
          />
        )}

        {activeView === 'tracker' && (
          <CaseTrackerView
            onOpenOfficerTriage={handleOpenOfficerTriage}
            onStartNewReport={() => handleNewIncident()}
          />
        )}

        {activeView === 'triage' && <OfficerTriageView />}

        {activeView === 'precincts' && (
          <PrecinctDirectoryView onRouteNewReportToPrecinct={handleRouteNewReportToPrecinct} />
        )}
      </main>

      {/* Multi-Column Civic Footer */}
      <footer className="mt-12 border-t border-[#1C1C1C]/[0.08] bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[18px] font-extrabold tracking-[-0.02em] text-[#1C1C1C]"
              >
                Sentinel Civic
              </button>
              <p className="mt-2.5 text-[13px] leading-[20px] text-[#41493D]">
                Centralized financial fraud interception platform synchronizing citizens, clearing
                banks, and cyber law enforcement.
              </p>
              <p className="mt-4 text-[12px] font-semibold text-[#0B4F0B]">
                Direct Leased Line to Cyber Cells
              </p>
            </div>

            <div>
              <h4 className="text-[13px] font-bold text-[#1C1C1C]">Rapid Services</h4>
              <ul className="mt-3 space-y-2 text-[13px] text-[#41493D]">
                <li>
                  <button
                    type="button"
                    onClick={() => handleNewIncident()}
                    className="hover:text-[#0B4F0B] transition-colors"
                  >
                    File Immediate Fraud Report
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('tracker')}
                    className="hover:text-[#0B4F0B] transition-colors"
                  >
                    Track Live Case Status
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('triage')}
                    className="hover:text-[#0B4F0B] transition-colors"
                  >
                    Officer Triage Console
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('precincts')}
                    className="hover:text-[#0B4F0B] transition-colors"
                  >
                    Precinct Routing Directory
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-bold text-[#1C1C1C]">Priority Desks</h4>
              <div className="mt-3 space-y-2 text-[13px]">
                <div className="flex items-center justify-between rounded-[10px] bg-[#FBEBEB] px-3 py-2 text-[#B4232C]">
                  <span className="font-semibold">Wire Recall Taskforce</span>
                  <span className="font-mono font-bold">PREC-01A</span>
                </div>
                <div className="flex items-center justify-between rounded-[10px] bg-[#FAFAF9] px-3 py-2 text-[#1C1C1C]">
                  <span>Blockchain Forensics</span>
                  <span className="font-mono font-semibold text-[#0B6B78]">PREC-07C</span>
                </div>
                <div className="flex items-center justify-between rounded-[10px] bg-[#FAFAF9] px-3 py-2 text-[#1C1C1C]">
                  <span>Metro Cyber Financial</span>
                  <span className="font-mono font-semibold text-[#0B6B78]">PREC-04B</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[13px] font-bold text-[#1C1C1C]">Standards &amp; Verification</h4>
              <p className="mt-3 text-[13px] leading-[20px] text-[#41493D]">
                Every submission generates a deterministic SHA-256 verification digest and immutable
                precinct handoff log.
              </p>
              <p className="mt-3 text-[12px] font-semibold text-[#0B4F0B]">
                ISO/IEC 27001 Aligned · Chain-of-Custody Ready
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-[#1C1C1C]/[0.06] pt-6 text-[12px] text-[#41493D] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Sentinel Civic. Inter-agency Financial Recovery Network.</p>
            <p className="font-medium text-[#B4232C]">
              Notice: Immediate reporting within golden hours substantially maximizes asset recovery
              rate.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <FraudCaseProvider>
      <SentinelCivicShell />
    </FraudCaseProvider>
  );
}
