import React, { useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckSquare,
  RotateCcw,
  Search,
  ShieldAlert,
  Square,
} from 'lucide-react';
import { useFraudCases } from '../context/FraudCaseContext';
import {
  PRECINCT_DIRECTORY,
  formatCurrencyUsd,
  formatTimestampLabel,
} from '../data/seedCases';
import { CaseStatus } from '../types/fraud';
import { StatusPill, UrgencyLabel } from './StatusPill';

const OFFICER_ROSTER = [
  { name: 'Det. Capt. Elena Vance', badge: 'BDG-4012' },
  { name: 'Lt. Marcus Holloway', badge: 'BDG-3108' },
  { name: 'Spec. Insp. Priya Nair', badge: 'BDG-7104' },
];

const PIPELINE_STATUSES: CaseStatus[] = [
  'Intake Verified',
  'Routed to Precinct',
  'Freeze Requested',
  'Under Forensic Review',
  'Resolved',
];

export function OfficerTriageView() {
  const {
    cases,
    selectedCaseId,
    setSelectedCaseId,
    updateCaseStatus,
    toggleFreezeAdvisory,
    reassignPrecinct,
    toggleEvidenceVerified,
    addOfficerNote,
    resetDemoData,
  } = useFraudCases();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CaseStatus>('All');
  const [criticalOnly, setCriticalOnly] = useState(false);

  const [activeOfficerIdx, setActiveOfficerIdx] = useState(0);
  const [nextStatus, setNextStatus] = useState<CaseStatus>('Under Forensic Review');
  const [statusNote, setStatusNote] = useState('');
  const [targetPrecinct, setTargetPrecinct] = useState('PREC-01A');
  const [docketNote, setDocketNote] = useState('');
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const inspectorRef = useRef<HTMLElement | null>(null);
  const activeOfficer = OFFICER_ROSTER[activeOfficerIdx];

  const metrics = useMemo(() => {
    const totalLoss = cases.reduce((sum, item) => sum + item.lossAmountUsd, 0);
    const criticalFreezeCount = cases.filter(
      (item) => item.urgency === 'Critical — Freeze Window' || item.freezeRequested,
    ).length;
    const activeInvestigations = cases.filter((item) => item.status !== 'Resolved').length;
    const resolvedCount = cases.filter((item) => item.status === 'Resolved').length;
    return { totalLoss, criticalFreezeCount, activeInvestigations, resolvedCount };
  }, [cases]);

  const filteredQueue = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cases.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (criticalOnly && item.urgency !== 'Critical — Freeze Window') return false;
      if (!q) return true;
      return (
        item.id.toLowerCase().includes(q) ||
        item.reporterName.toLowerCase().includes(q) ||
        item.financialInstitution.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.precinct.code.toLowerCase().includes(q)
      );
    });
  }, [cases, searchQuery, statusFilter, criticalOnly]);

  const inspectedCase = useMemo(() => {
    return (
      filteredQueue.find((c) => c.id === selectedCaseId) ??
      filteredQueue[0] ??
      cases.find((c) => c.id === selectedCaseId) ??
      cases[0]
    );
  }, [filteredQueue, cases, selectedCaseId]);

  const notifyFeedback = (msg: string) => {
    setFeedbackBanner(msg);
    setTimeout(() => setFeedbackBanner(null), 2600);
  };

  const handleSelectRow = (id: string, status: CaseStatus, precinctCode: string) => {
    setSelectedCaseId(id);
    setNextStatus(status);
    setTargetPrecinct(precinctCode);
    if (window.innerWidth < 1024 && inspectorRef.current) {
      setTimeout(() => {
        inspectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 40);
    }
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectedCase) return;
    updateCaseStatus(
      inspectedCase.id,
      nextStatus,
      activeOfficer.name,
      activeOfficer.badge,
      statusNote,
    );
    setStatusNote('');
    notifyFeedback(`Updated ${inspectedCase.id} to ${nextStatus}.`);
  };

  const handlePrecinctReassign = () => {
    if (!inspectedCase) return;
    reassignPrecinct(inspectedCase.id, targetPrecinct, activeOfficer.name, activeOfficer.badge);
    notifyFeedback(`Reassigned ${inspectedCase.id} to ${targetPrecinct}.`);
  };

  const handleDocketNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectedCase || !docketNote.trim()) return;
    addOfficerNote(inspectedCase.id, activeOfficer.name, activeOfficer.badge, docketNote);
    setDocketNote('');
    notifyFeedback(`Appended official docket note to ${inspectedCase.id}.`);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
      {/* Operational Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[13px] font-semibold text-[#0B6B78]">
            Law Enforcement Triage Console · Cyber &amp; Financial Crimes Pipeline
          </p>
          <h1 className="mt-1.5 text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#1C1C1C] sm:text-[36px]">
            Investigator Queue &amp; Precinct Dispatch
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <label htmlFor="officerSelect" className="text-[12px] font-semibold text-[#41493D]">
              Active Officer:
            </label>
            <select
              id="officerSelect"
              value={activeOfficerIdx}
              onChange={(e) => setActiveOfficerIdx(Number(e.target.value))}
              className="civic-input h-10 w-full sm:w-auto px-3 text-[13px] font-semibold"
            >
              {OFFICER_ROSTER.map((officer, idx) => (
                <option key={officer.badge} value={idx}>
                  {officer.name} ({officer.badge})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              resetDemoData();
              notifyFeedback('Demo cases restored to initial baseline.');
            }}
            className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-1.5 rounded-[12px] border border-[#1C1C1C]/15 bg-white px-3.5 text-[13px] font-semibold text-[#1C1C1C] transition-colors hover:bg-[#FAFAF9] whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Demo Cases
          </button>
        </div>
      </div>

      {/* 4-Column Operational KPI Strip */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="civic-card rounded-[20px] p-5">
          <span className="text-[12px] font-semibold text-[#41493D]">Reported Loss Volume</span>
          <p className="mt-2 font-mono text-[26px] sm:text-[28px] font-extrabold leading-none tracking-[-0.03em] text-[#1C1C1C] tabular-nums">
            {formatCurrencyUsd(metrics.totalLoss)}
          </p>
        </div>
        <div className="civic-card rounded-[20px] p-5">
          <span className="text-[12px] font-semibold text-[#E5484D]">Critical Freeze Window</span>
          <p className="mt-2 font-mono text-[26px] sm:text-[28px] font-extrabold leading-none tracking-[-0.03em] text-[#E5484D] tabular-nums">
            {metrics.criticalFreezeCount}
          </p>
        </div>
        <div className="civic-card rounded-[20px] p-5">
          <span className="text-[12px] font-semibold text-[#0B6B78]">Open Investigations</span>
          <p className="mt-2 font-mono text-[26px] sm:text-[28px] font-extrabold leading-none tracking-[-0.03em] text-[#0B6B78] tabular-nums">
            {metrics.activeInvestigations}
          </p>
        </div>
        <div className="civic-card rounded-[20px] p-5">
          <span className="text-[12px] font-semibold text-[#0B4F0B]">Resolved &amp; Recovered</span>
          <p className="mt-2 font-mono text-[26px] sm:text-[28px] font-extrabold leading-none tracking-[-0.03em] text-[#0B4F0B] tabular-nums">
            {metrics.resolvedCount}
          </p>
        </div>
      </div>

      {feedbackBanner && (
        <div
          role="status"
          className="mb-5 rounded-[14px] bg-[#C4F25A]/45 px-4 py-3 text-[13px] font-semibold text-[#0B4F0B]"
        >
          {feedbackBanner}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex items-center gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {(['All', ...PIPELINE_STATUSES] as const).map((status) => {
            const active = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`h-9 rounded-full px-3.5 text-[12px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#0B4F0B] text-white'
                    : 'bg-white text-[#41493D] border border-[#1C1C1C]/10 hover:text-[#1C1C1C]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setCriticalOnly((v) => !v)}
            className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-[12px] px-3.5 text-[12px] font-semibold transition-colors whitespace-nowrap ${
              criticalOnly
                ? 'bg-[#E5484D] text-white'
                : 'border border-[#1C1C1C]/15 bg-white text-[#1C1C1C] hover:bg-[#FAFAF9]'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Critical Only
          </button>

          <div className="relative flex-1 sm:min-w-[230px] sm:flex-initial">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#41493D]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter queue..."
              className="civic-input h-10 w-full pl-9 pr-3 text-[13px]"
            />
          </div>
        </div>
      </div>

      {/* Main Split: Mobile Card List + Tablet/Desktop Table + Forensics Inspector */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left: Case Queue */}
        <div className="civic-card overflow-hidden rounded-[24px] lg:col-span-7">
          {filteredQueue.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-[16px] font-bold text-[#1C1C1C]">No cases match current triage filters</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setCriticalOnly(false);
                }}
                className="mt-4 h-10 rounded-[12px] bg-[#0B4F0B] px-4 text-[13px] font-semibold text-white"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Mobile Stacked Queue (< 768px) */}
              <div className="divide-y divide-[#1C1C1C]/[0.06] md:hidden">
                {filteredQueue.map((item) => {
                  const isSelected = inspectedCase?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectRow(item.id, item.status, item.precinct.code)}
                      className={`w-full p-4 text-left transition-colors ${
                        isSelected ? 'bg-[#C4F25A]/22' : 'hover:bg-[#FAFAF9]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[12px] font-bold text-[#0B6B78] tabular-nums">
                          {item.id}
                        </span>
                        <span className="font-mono text-[16px] font-extrabold text-[#1C1C1C] tabular-nums">
                          {formatCurrencyUsd(item.lossAmountUsd)}
                        </span>
                      </div>
                      <p className="mt-1 text-[14px] font-bold text-[#1C1C1C]">{item.reporterName}</p>
                      <p className="text-[12px] text-[#41493D]">
                        {item.financialInstitution} · {item.category}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <StatusPill status={item.status} />
                        <span className="font-mono text-[11px] text-[#41493D] tabular-nums">
                          {item.precinct.code} · {formatTimestampLabel(item.updatedAt)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tablet & Desktop High-Density Table (md: 768px+) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#1C1C1C]/[0.06] bg-[#FAFAF9] text-[11px] font-bold tracking-[0.04em] text-[#41493D] uppercase">
                      <th className="px-4 py-3">Case / Reporter</th>
                      <th className="px-4 py-3">Category &amp; Unit</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Loss (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C1C1C]/[0.06] text-[13px]">
                    {filteredQueue.map((item) => {
                      const isSelected = inspectedCase?.id === item.id;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => handleSelectRow(item.id, item.status, item.precinct.code)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#C4F25A]/22' : 'hover:bg-[#FAFAF9]'
                          }`}
                        >
                          <td className="px-4 py-3.5 align-top">
                            <span className="font-mono text-[12px] font-bold text-[#0B6B78] tabular-nums">
                              {item.id}
                            </span>
                            <p className="mt-0.5 font-semibold text-[#1C1C1C]">{item.reporterName}</p>
                            <p className="text-[12px] text-[#41493D]">{item.financialInstitution}</p>
                          </td>
                          <td className="px-4 py-3.5 align-top">
                            <p className="font-medium text-[#1C1C1C]">{item.category}</p>
                            <p className="mt-0.5 font-mono text-[12px] text-[#41493D]">
                              {item.precinct.code} · {formatTimestampLabel(item.updatedAt)}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 align-top">
                            <StatusPill status={item.status} />
                          </td>
                          <td className="px-4 py-3.5 text-right align-top font-mono text-[14px] font-bold text-[#1C1C1C] tabular-nums">
                            {formatCurrencyUsd(item.lossAmountUsd)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Right: Forensics & Dispatch Inspector */}
        {inspectedCase && (
          <aside
            ref={inspectorRef}
            className="civic-card scroll-mt-20 rounded-[24px] p-5 sm:p-6 space-y-6 lg:col-span-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#1C1C1C]/[0.06] pb-4">
              <div>
                <span className="font-mono text-[12px] font-bold text-[#0B6B78]">
                  {inspectedCase.id} · {inspectedCase.precinct.dispatchId}
                </span>
                <h2 className="mt-1 text-[20px] font-bold tracking-[-0.01em] text-[#1C1C1C]">
                  {inspectedCase.financialInstitution}
                </h2>
                <div className="mt-1">
                  <UrgencyLabel urgency={inspectedCase.urgency} />
                </div>
              </div>
              <p className="font-mono text-[24px] font-extrabold tracking-[-0.02em] text-[#1C1C1C] tabular-nums">
                {formatCurrencyUsd(inspectedCase.lossAmountUsd)}
              </p>
            </div>

            {/* AI Extracted Summary */}
            <div className="rounded-[16px] bg-[#FAFAF9] p-4 space-y-2 text-[13px]">
              <p className="font-semibold text-[#0B6B78]">{inspectedCase.aiSummary.confidenceLabel}</p>
              <p className="font-medium text-[#1C1C1C]">{inspectedCase.aiSummary.recommendedAction}</p>
              <p className="text-[#41493D] leading-[19px]">{inspectedCase.narrative}</p>
            </div>

            {/* Emergency Bank Freeze Toggle */}
            <div className="flex flex-col items-start justify-between gap-3 border-y border-[#1C1C1C]/[0.06] py-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-[14px] font-bold text-[#1C1C1C]">Clearinghouse Freeze Flag</p>
                <p className="text-[12px] text-[#41493D]">
                  {inspectedCase.freezeRequested
                    ? 'Active recall advisory sent to institution'
                    : 'Trigger emergency asset hold notice'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = !inspectedCase.freezeRequested;
                  toggleFreezeAdvisory(
                    inspectedCase.id,
                    next,
                    activeOfficer.name,
                    activeOfficer.badge,
                  );
                  notifyFeedback(
                    next
                      ? `Emergency freeze flag issued for ${inspectedCase.id}.`
                      : `Freeze flag cleared for ${inspectedCase.id}.`,
                  );
                }}
                className={`inline-flex h-10 w-full sm:w-auto items-center justify-center gap-1.5 rounded-[12px] px-4 text-[12px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  inspectedCase.freezeRequested
                    ? 'bg-[#E5484D] text-white hover:bg-[#c9383d]'
                    : 'border border-[#E5484D]/40 bg-[#E5484D]/[0.08] text-[#E5484D] hover:bg-[#E5484D]/[0.15]'
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                {inspectedCase.freezeRequested ? 'Freeze Active' : 'Issue Freeze'}
              </button>
            </div>

            {/* Pipeline Status Transition */}
            <form onSubmit={handleStatusSubmit} className="space-y-3">
              <label htmlFor="triageStatusSelect" className="block text-[12px] font-semibold text-[#1C1C1C]">
                Advance Pipeline Status
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  id="triageStatusSelect"
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value as CaseStatus)}
                  className="civic-input h-10 flex-1 px-3 text-[13px] font-medium"
                >
                  {PIPELINE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="h-10 rounded-[12px] bg-[#0B4F0B] px-4 text-[13px] font-semibold text-white whitespace-nowrap shrink-0"
                >
                  Update
                </button>
              </div>
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Optional milestone log note..."
                className="civic-input h-10 w-full px-3 text-[13px]"
              />
            </form>

            {/* Precinct Reassignment */}
            <div className="space-y-2 border-t border-[#1C1C1C]/[0.06] pt-4">
              <label htmlFor="reassignPrecinctSelect" className="block text-[12px] font-semibold text-[#1C1C1C]">
                Reassign Cybercrime Division
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  id="reassignPrecinctSelect"
                  value={targetPrecinct}
                  onChange={(e) => setTargetPrecinct(e.target.value)}
                  className="civic-input h-10 flex-1 px-3 text-[13px] font-medium"
                >
                  {PRECINCT_DIRECTORY.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} — {p.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handlePrecinctReassign}
                  className="h-10 rounded-[12px] border border-[#1C1C1C]/15 bg-white px-4 text-[13px] font-semibold text-[#1C1C1C] hover:bg-[#B6F21C]/20 whitespace-nowrap shrink-0"
                >
                  Reassign
                </button>
              </div>
            </div>

            {/* Evidence Verification Checklist */}
            <div className="space-y-2 border-t border-[#1C1C1C]/[0.06] pt-4">
              <p className="text-[12px] font-semibold text-[#1C1C1C]">
                Verify Submitted Evidence ({inspectedCase.evidenceItems.length})
              </p>
              <div className="space-y-1.5">
                {inspectedCase.evidenceItems.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => toggleEvidenceVerified(inspectedCase.id, ev.id)}
                    className="flex w-full items-center justify-between gap-2 rounded-[12px] bg-[#FAFAF9] px-3 py-2.5 text-left text-[13px] transition-colors hover:bg-[#C4F25A]/20"
                  >
                    <span className="truncate font-medium text-[#1C1C1C]">{ev.fileName}</span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0B4F0B] whitespace-nowrap shrink-0">
                      {ev.verified ? (
                        <>
                          <CheckSquare className="h-4 w-4 text-[#0B4F0B]" />
                          Verified
                        </>
                      ) : (
                        <>
                          <Square className="h-4 w-4 text-[#717A6C]" />
                          Mark Verified
                        </>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Official Docket Note Composer */}
            <form onSubmit={handleDocketNoteSubmit} className="space-y-2 border-t border-[#1C1C1C]/[0.06] pt-4">
              <label htmlFor="docketNote" className="block text-[12px] font-semibold text-[#1C1C1C]">
                Add Investigator Docket Note
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="docketNote"
                  type="text"
                  value={docketNote}
                  onChange={(e) => setDocketNote(e.target.value)}
                  placeholder="Record subpoena, bank contact, or trace finding..."
                  className="civic-input h-10 flex-1 px-3 text-[13px]"
                />
                <button
                  type="submit"
                  className="h-10 rounded-[12px] bg-[#B6F21C] px-4 text-[13px] font-bold text-[#1C1C1C] whitespace-nowrap shrink-0"
                >
                  Log Note
                </button>
              </div>
            </form>
          </aside>
        )}
      </div>
    </div>
  );
}
