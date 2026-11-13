import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_DEMO_CASES,
  formatTimestampLabel,
  generateVerificationHash,
  getPrecinctByCode,
} from '../data/seedCases';
import { CaseStatus, FraudCase, TimelineNode } from '../types/fraud';

const STORAGE_KEY = 'sentinel_civic_cases_v1';

interface FraudCaseContextValue {
  cases: FraudCase[];
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  addCase: (newCase: FraudCase) => void;
  updateCaseStatus: (
    caseId: string,
    status: CaseStatus,
    officerName: string,
    badgeNumber: string,
    noteText?: string,
  ) => void;
  toggleFreezeAdvisory: (caseId: string, active: boolean, officerName: string, badgeNumber: string) => void;
  reassignPrecinct: (caseId: string, precinctCode: string, officerName: string, badgeNumber: string) => void;
  toggleEvidenceVerified: (caseId: string, evidenceId: string) => void;
  addOfficerNote: (caseId: string, officerName: string, badgeNumber: string, note: string) => void;
  resetDemoData: () => void;
}

const FraudCaseContext = createContext<FraudCaseContextValue | null>(null);

function loadStoredCases(): FraudCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_DEMO_CASES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as FraudCase[];
    }
    return INITIAL_DEMO_CASES;
  } catch {
    return INITIAL_DEMO_CASES;
  }
}

export function FraudCaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<FraudCase[]>(() => loadStoredCases());
  const [selectedCaseId, setSelectedCaseId] = useState<string>(() => {
    const loaded = loadStoredCases();
    return loaded[0]?.id ?? INITIAL_DEMO_CASES[0].id;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch {
      // Ignore storage quota errors in restricted sandboxes
    }
  }, [cases]);

  const addCase = (newCase: FraudCase) => {
    setCases((prev) => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
  };

  const updateCaseStatus = (
    caseId: string,
    status: CaseStatus,
    officerName: string,
    badgeNumber: string,
    noteText?: string,
  ) => {
    const nowIso = new Date().toISOString();
    const nowLabel = formatTimestampLabel(nowIso);

    setCases((prev) =>
      prev.map((item) => {
        if (item.id !== caseId) return item;

        const completedTimeline: TimelineNode[] = item.timeline
          .filter((node) => node.state !== 'upcoming')
          .map((node) => ({ ...node, state: 'completed' as const }));

        const newStageNode: TimelineNode = {
          id: `tl-${Date.now()}`,
          stage: `Status Updated: ${status}`,
          detail:
            noteText?.trim() ||
            `Investigator ${officerName} (${badgeNumber}) transitioned case to ${status}.`,
          timestamp: nowLabel,
          state: status === 'Resolved' ? 'completed' : 'active',
        };

        const upcomingNodes: TimelineNode[] =
          status === 'Resolved'
            ? []
            : [
                {
                  id: `tl-next-${Date.now()}`,
                  stage: 'Final Recovery & Case Closure',
                  detail: 'Pending institutional restitution confirmation and archival.',
                  timestamp: 'Scheduled',
                  state: 'upcoming',
                },
              ];

        const updatedNotes = noteText?.trim()
          ? [
              {
                id: `on-${Date.now()}`,
                author: officerName,
                badgeNumber,
                note: noteText.trim(),
                timestamp: nowLabel,
              },
              ...item.officerNotes,
            ]
          : item.officerNotes;

        return {
          ...item,
          status,
          freezeRequested: status === 'Freeze Requested' ? true : item.freezeRequested,
          updatedAt: nowIso,
          timeline: [...completedTimeline, newStageNode, ...upcomingNodes],
          officerNotes: updatedNotes,
        };
      }),
    );
  };

  const toggleFreezeAdvisory = (
    caseId: string,
    active: boolean,
    officerName: string,
    badgeNumber: string,
  ) => {
    const nowIso = new Date().toISOString();
    const nowLabel = formatTimestampLabel(nowIso);

    setCases((prev) =>
      prev.map((item) => {
        if (item.id !== caseId) return item;

        const completedTimeline: TimelineNode[] = item.timeline
          .filter((n) => n.state !== 'upcoming')
          .map((n) => ({ ...n, state: 'completed' as const }));

        const freezeNode: TimelineNode = {
          id: `tl-frz-${Date.now()}`,
          stage: active ? 'Emergency Account Freeze Advisory Issued' : 'Freeze Advisory Lifted',
          detail: active
            ? `${officerName} (${badgeNumber}) flagged ${item.financialInstitution} for urgent asset hold.`
            : `${officerName} (${badgeNumber}) cleared the emergency hold advisory.`,
          timestamp: nowLabel,
          state: 'active',
        };

        return {
          ...item,
          freezeRequested: active,
          status: active ? 'Freeze Requested' : item.status === 'Freeze Requested' ? 'Under Forensic Review' : item.status,
          urgency: active ? 'Critical — Freeze Window' : item.urgency,
          updatedAt: nowIso,
          timeline: [...completedTimeline, freezeNode],
          officerNotes: [
            {
              id: `on-frz-${Date.now()}`,
              author: officerName,
              badgeNumber,
              note: active
                ? `Urgent clearinghouse / institution freeze advisory dispatched to ${item.financialInstitution}.`
                : 'Emergency hold advisory lifted following investigator verification.',
              timestamp: nowLabel,
            },
            ...item.officerNotes,
          ],
        };
      }),
    );
  };

  const reassignPrecinct = (
    caseId: string,
    precinctCode: string,
    officerName: string,
    badgeNumber: string,
  ) => {
    const target = getPrecinctByCode(precinctCode);
    const nowIso = new Date().toISOString();
    const nowLabel = formatTimestampLabel(nowIso);

    setCases((prev) =>
      prev.map((item) => {
        if (item.id !== caseId) return item;

        const suffix = String(Math.floor(1000 + Math.random() * 8999));
        const dispatchId = `DSP-${target.code.replace('PREC-', '')}-${suffix}`;
        const verificationHash = generateVerificationHash(`${item.id}-${target.code}-${nowIso}`);

        const completedTimeline: TimelineNode[] = item.timeline
          .filter((n) => n.state !== 'upcoming')
          .map((n) => ({ ...n, state: 'completed' as const }));

        const handoffNode: TimelineNode = {
          id: `tl-route-${Date.now()}`,
          stage: `Reassigned to ${target.name}`,
          detail: `Transferred by ${officerName} (${badgeNumber}) · Dispatch ${dispatchId}.`,
          timestamp: nowLabel,
          state: 'active',
        };

        return {
          ...item,
          updatedAt: nowIso,
          status: item.status === 'Intake Verified' ? 'Routed to Precinct' : item.status,
          precinct: {
            code: target.code,
            name: target.name,
            division: target.division,
            jurisdiction: target.jurisdiction,
            dispatchId,
            verificationHash,
          },
          timeline: [...completedTimeline, handoffNode],
        };
      }),
    );
  };

  const toggleEvidenceVerified = (caseId: string, evidenceId: string) => {
    setCases((prev) =>
      prev.map((item) => {
        if (item.id !== caseId) return item;
        return {
          ...item,
          evidenceItems: item.evidenceItems.map((ev) =>
            ev.id === evidenceId ? { ...ev, verified: !ev.verified } : ev,
          ),
        };
      }),
    );
  };

  const addOfficerNote = (caseId: string, officerName: string, badgeNumber: string, note: string) => {
    const trimmed = note.trim();
    if (!trimmed) return;
    const nowIso = new Date().toISOString();
    const nowLabel = formatTimestampLabel(nowIso);

    setCases((prev) =>
      prev.map((item) => {
        if (item.id !== caseId) return item;
        return {
          ...item,
          updatedAt: nowIso,
          officerNotes: [
            {
              id: `on-${Date.now()}`,
              author: officerName,
              badgeNumber,
              note: trimmed,
              timestamp: nowLabel,
            },
            ...item.officerNotes,
          ],
        };
      }),
    );
  };

  const resetDemoData = () => {
    setCases(INITIAL_DEMO_CASES);
    setSelectedCaseId(INITIAL_DEMO_CASES[0].id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CASES));
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <FraudCaseContext.Provider
      value={{
        cases,
        selectedCaseId,
        setSelectedCaseId,
        addCase,
        updateCaseStatus,
        toggleFreezeAdvisory,
        reassignPrecinct,
        toggleEvidenceVerified,
        addOfficerNote,
        resetDemoData,
      }}
    >
      {children}
    </FraudCaseContext.Provider>
  );
}

export function useFraudCases(): FraudCaseContextValue {
  const ctx = useContext(FraudCaseContext);
  if (!ctx) {
    throw new Error('useFraudCases must be used inside FraudCaseProvider');
  }
  return ctx;
}
