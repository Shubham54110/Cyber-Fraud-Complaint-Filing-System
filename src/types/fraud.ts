export type FraudCategory =
  | 'Wire & ACH Fraud'
  | 'Crypto & Wallet Drain'
  | 'Phishing & Account Takeover'
  | 'Payment App Scam'
  | 'Identity & Credit Fraud';

export type UrgencyLevel = 'Critical — Freeze Window' | 'Elevated' | 'Standard';

export type CaseStatus =
  | 'Intake Verified'
  | 'Routed to Precinct'
  | 'Under Forensic Review'
  | 'Freeze Requested'
  | 'Resolved';

export type AppView = 'home' | 'intake' | 'tracker' | 'triage' | 'precincts';

export interface PrecinctDirectoryEntry {
  code: string;
  name: string;
  division: string;
  jurisdiction: string;
  slaWindow: string;
  specialties: FraudCategory[];
  leadCommander: string;
  contactDesk: string;
}

export interface PrecinctAssignment {
  code: string;
  name: string;
  division: string;
  jurisdiction: string;
  dispatchId: string;
  verificationHash: string;
}

export interface EvidenceItem {
  id: string;
  fileName: string;
  fileType: string;
  sizeLabel: string;
  uploadedAt: string;
  verified: boolean;
  summaryNote?: string;
}

export interface TimelineNode {
  id: string;
  stage: string;
  detail: string;
  timestamp: string;
  state: 'completed' | 'active' | 'upcoming';
}

export interface OfficerNote {
  id: string;
  author: string;
  badgeNumber: string;
  note: string;
  timestamp: string;
}

export interface AiTriageSummary {
  confidenceLabel: string;
  recommendedAction: string;
  extractedIndicators: string[];
  source: 'gemini' | 'deterministic';
}

export interface FraudCase {
  id: string;
  createdAt: string;
  updatedAt: string;
  reporterName: string;
  reporterContact: string;
  financialInstitution: string;
  channel: string;
  category: FraudCategory;
  lossAmountUsd: number;
  transactionRef: string;
  narrative: string;
  urgency: UrgencyLevel;
  status: CaseStatus;
  freezeRequested: boolean;
  precinct: PrecinctAssignment;
  evidenceItems: EvidenceItem[];
  timeline: TimelineNode[];
  officerNotes: OfficerNote[];
  aiSummary: AiTriageSummary;
}

export interface TriageAnalyzeResponse {
  category: FraudCategory;
  urgency: UrgencyLevel;
  precinctCode: string;
  recommendedAction: string;
  confidenceLabel: string;
  extractedIndicators: string[];
  source: 'gemini' | 'deterministic';
}
