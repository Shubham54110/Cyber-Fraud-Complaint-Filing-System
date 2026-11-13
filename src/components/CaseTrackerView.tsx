import { useMemo, useRef, useState } from 'react';
import { ArrowUpRight, FileText, Search, ShieldCheck } from 'lucide-react';
import { useFraudCases } from '../context/FraudCaseContext';
import { formatCurrencyUsd, formatTimestampLabel } from '../data/seedCases';
import { CaseStatus } from '../types/fraud';
import { PrecinctRoutingCard } from './PrecinctRoutingCard';
import { StatusPill, UrgencyLabel } from './StatusPill';
import { TimelineVisualizer } from './TimelineVisualizer';

interface CaseTrackerViewProps {
  onOpenOfficerTriage: (caseId: string) => void;
  onStartNewReport: () => void;
}

const FILTER_STATUSES: ('All' | CaseStatus)[] = [
  'All',
  'Freeze Requested',
  'Routed to Precinct',
  'Under Forensic Review',
  'Intake Verified',
  'Resolved',
];

export function CaseTrackerView({ onOpenOfficerTriage, onStartNewReport }: CaseTrackerViewProps) {
  const { cases, selectedCaseId, setSelectedCaseId } = useFraudCases();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CaseStatus>('All');
  const detailRef = useRef<HTMLDivElement | null>(null);

  const filteredCases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.id.toLowerCase().includes(q) ||
        item.financialInstitution.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.reporterName.toLowerCase().includes(q) ||
        item.precinct.code.toLowerCase().includes(q)
      );
    });
  }, [cases, query, statusFilter]);

  const activeCase = useMemo(() => {
    return (
      filteredCases.find((c) => c.id === selectedCaseId) ??
      filteredCases[0] ??
      cases.find((c) => c.id === selectedCaseId) ??
      cases[0]
    );
  }, [filteredCases, cases, selectedCaseId]);

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    if (window.innerWidth < 1024 && detailRef.current) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 40);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
      {/* Header & Search Controls */}
      <div className="mb-6 flex flex-col gap-5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[13px] font-semibold text-[#0B6B78]">
            Citizen Case Tracker · Real-Time Precinct Handoff
          </p>
          <h1 className="mt-1.5 text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#1C1C1C] sm:text-[36px]">
            Verify filing status and routing milestones.
          </h1>
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#41493D]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Case ID, bank, or precinct..."
            className="civic-input h-12 w-full pl-11 pr-4 text-[14px]"
          />
        </div>
      </div>

      {/* Segmented Status Filter Bar */}
      <div className="-mx-4 mb-6 flex items-center gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {FILTER_STATUSES.map((status) => {
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`h-9 rounded-full px-4 text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#0B4F0B] text-white'
                  : 'bg-white text-[#41493D] border border-[#1C1C1C]/10 hover:text-[#1C1C1C]'
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      {filteredCases.length === 0 ? (
        <div className="civic-card rounded-[28px] p-8 sm:p-12 text-center">
          <h2 className="text-[20px] font-bold text-[#1C1C1C]">No matching fraud reports found</h2>
          <p className="mt-2 text-[14px] text-[#41493D]">
            Adjust your search query or status filter, or submit a new cybercrime intake declaration.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setStatusFilter('All');
              }}
              className="h-11 rounded-[14px] border border-[#1C1C1C]/15 bg-white px-5 text-[14px] font-semibold text-[#1C1C1C] hover:bg-[#FAFAF9]"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={onStartNewReport}
              className="h-11 rounded-[14px] bg-[#0B4F0B] px-5 text-[14px] font-semibold text-white"
            >
              File New Report
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Fraud Case Cards (2-col on tablet md:, 1-col on phone & desktop left rail) */}
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-1 lg:col-span-5">
            {filteredCases.map((item) => {
              const isSelected = activeCase?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectCase(item.id)}
                  className={`w-full rounded-[20px] p-5 text-left transition-all duration-150 ${
                    isSelected
                      ? 'bg-white ring-2 ring-[#0B4F0B] shadow-[0_12px_28px_-8px_rgba(11,79,11,0.12)]'
                      : 'civic-card hover:-translate-y-[1px]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-[12px] font-semibold text-[#0B6B78] tabular-nums">
                        {item.id}
                      </span>
                      <p className="mt-1 font-mono text-[24px] sm:text-[26px] font-extrabold leading-none tracking-[-0.03em] text-[#1C1C1C] tabular-nums">
                        {formatCurrencyUsd(item.lossAmountUsd)}
                      </p>
                    </div>
                    <StatusPill status={item.status} />
                  </div>

                  <p className="mt-3 text-[15px] font-semibold text-[#1C1C1C]">
                    {item.financialInstitution}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-[#41493D]">
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{item.precinct.code}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{formatTimestampLabel(item.updatedAt)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Selected Case Detail & Vertical Routing Timeline */}
          {activeCase && (
            <div ref={detailRef} className="space-y-6 scroll-mt-20 lg:col-span-7">
              <div className="civic-card rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 space-y-6">
                {/* Summary Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-[#1C1C1C]/[0.06] pb-6 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-[13px] font-bold text-[#0B6B78] tabular-nums">
                        {activeCase.id}
                      </span>
                      <span aria-hidden="true" className="text-[#717A6C]">·</span>
                      <UrgencyLabel urgency={activeCase.urgency} />
                    </div>
                    <h2 className="mt-2 text-[22px] sm:text-[26px] font-extrabold tracking-[-0.02em] text-[#1C1C1C]">
                      {activeCase.financialInstitution}
                    </h2>
                    <p className="mt-1 text-[13px] sm:text-[14px] text-[#41493D]">
                      Filed by {activeCase.reporterName} · {activeCase.category} · Ref{' '}
                      <span className="font-mono text-[#1C1C1C] break-all">{activeCase.transactionRef}</span>
                    </p>
                  </div>

                  <div className="flex flex-row items-center justify-between sm:flex-col sm:items-end gap-2">
                    <StatusPill status={activeCase.status} />
                    <p className="font-mono text-[24px] sm:text-[28px] font-extrabold tracking-[-0.03em] text-[#1C1C1C] tabular-nums">
                      {formatCurrencyUsd(activeCase.lossAmountUsd)}
                    </p>
                  </div>
                </div>

                {/* Precinct Routing Card */}
                <PrecinctRoutingCard precinct={activeCase.precinct} />

                {/* Vertical Incident Timeline & Routing Visualizer */}
                <div>
                  <h3 className="mb-5 text-[16px] font-bold text-[#1C1C1C]">
                    Incident Timeline &amp; Precinct Handoff
                  </h3>
                  <TimelineVisualizer nodes={activeCase.timeline} />
                </div>

                {/* Narrative & Evidence */}
                <div className="border-t border-[#1C1C1C]/[0.06] pt-6 space-y-5">
                  <div>
                    <h4 className="text-[13px] font-bold text-[#41493D]">Citizen Statement</h4>
                    <p className="mt-1.5 text-[15px] leading-[23px] text-[#1C1C1C]">
                      {activeCase.narrative}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[13px] font-bold text-[#41493D]">
                      Attached Exhibits ({activeCase.evidenceItems.length})
                    </h4>
                    <div className="mt-2 divide-y divide-[#1C1C1C]/[0.06] border-y border-[#1C1C1C]/[0.06]">
                      {activeCase.evidenceItems.map((ev) => (
                        <div
                          key={ev.id}
                          className="flex flex-col items-start justify-between gap-1.5 py-3 text-[13px] sm:flex-row sm:items-center sm:gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 max-w-full">
                            <FileText className="h-4 w-4 shrink-0 text-[#0B6B78]" />
                            <span className="truncate font-semibold text-[#1C1C1C]">{ev.fileName}</span>
                            <span className="hidden sm:inline text-[#41493D] whitespace-nowrap">
                              {ev.fileType} · <span className="font-mono tabular-nums">{ev.sizeLabel}</span>
                            </span>
                          </div>
                          <div className="flex w-full items-center justify-between pl-6 sm:w-auto sm:pl-0">
                            <span className="text-[12px] text-[#41493D] sm:hidden">
                              {ev.fileType} · <span className="font-mono tabular-nums">{ev.sizeLabel}</span>
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 text-[12px] font-semibold whitespace-nowrap ${
                                ev.verified ? 'text-[#0B4F0B]' : 'text-[#717A6C]'
                              }`}
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              {ev.verified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeCase.officerNotes.length > 0 && (
                    <div>
                      <h4 className="text-[13px] font-bold text-[#41493D]">Official Investigator Updates</h4>
                      <div className="mt-2 space-y-3">
                        {activeCase.officerNotes.map((note) => (
                          <div key={note.id} className="rounded-[14px] bg-[#FAFAF9] p-4 text-[13px]">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[#41493D]">
                              <span className="font-semibold text-[#1C1C1C]">
                                {note.author} · <span className="font-mono">{note.badgeNumber}</span>
                              </span>
                              <span className="font-mono tabular-nums">{note.timestamp}</span>
                            </div>
                            <p className="mt-1.5 leading-[20px] text-[#1C1C1C]">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end border-t border-[#1C1C1C]/[0.06] pt-4">
                  <button
                    type="button"
                    onClick={() => onOpenOfficerTriage(activeCase.id)}
                    className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-1.5 rounded-[12px] border border-[#1C1C1C]/15 px-4 text-[13px] font-semibold text-[#1C1C1C] transition-colors hover:bg-[#B6F21C]/20"
                  >
                    <span>Manage in Officer Triage</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
