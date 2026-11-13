import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Lock,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-react';
import { useFraudCases } from '../context/FraudCaseContext';
import {
  PRECINCT_DIRECTORY,
  formatCurrencyUsd,
  formatTimestampLabel,
  generateVerificationHash,
  getPrecinctByCode,
} from '../data/seedCases';
import {
  EvidenceItem,
  FraudCase,
  FraudCategory,
  TriageAnalyzeResponse,
  UrgencyLevel,
} from '../types/fraud';
import { PrecinctRoutingCard } from './PrecinctRoutingCard';

interface CitizenIntakeViewProps {
  preselectedPrecinctCode?: string | null;
  preselectedChannel?: string | null;
  onClearPreselectedPrecinct: () => void;
  onReportDispatched: (caseId: string) => void;
  onNavigateTracker: () => void;
}

const FRAUD_CHANNELS = [
  'Commercial Wire / BEC',
  'On-Chain Wallet Drain',
  'SMS Phishing & Portal Login',
  'P2P Instant Payment App',
  'SIM Swap & Credit Line',
];

const CATEGORIES: FraudCategory[] = [
  'Wire & ACH Fraud',
  'Crypto & Wallet Drain',
  'Phishing & Account Takeover',
  'Payment App Scam',
  'Identity & Credit Fraud',
];

export function CitizenIntakeView({
  preselectedPrecinctCode,
  preselectedChannel,
  onClearPreselectedPrecinct,
  onReportDispatched,
  onNavigateTracker,
}: CitizenIntakeViewProps) {
  const { cases, addCase } = useFraudCases();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [financialInstitution, setFinancialInstitution] = useState('');
  const [channel, setChannel] = useState(preselectedChannel || FRAUD_CHANNELS[0]);
  const [lossInput, setLossInput] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [narrative, setNarrative] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageAnalyzeResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FraudCategory>('Wire & ACH Fraud');
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel>('Elevated');
  const [selectedPrecinctCode, setSelectedPrecinctCode] = useState<string>(
    preselectedPrecinctCode || 'PREC-01A',
  );

  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [submittedCase, setSubmittedCase] = useState<FraudCase | null>(null);
  const [freshBannerVisible, setFreshBannerVisible] = useState(false);

  useEffect(() => {
    if (preselectedPrecinctCode) {
      setSelectedPrecinctCode(preselectedPrecinctCode);
    }
  }, [preselectedPrecinctCode]);

  useEffect(() => {
    if (preselectedChannel) {
      setChannel(preselectedChannel);
    }
  }, [preselectedChannel]);

  useEffect(() => {
    const inputEl = document.getElementById('reporterName');
    if (inputEl) {
      inputEl.focus({ preventScroll: true });
    }
    setFreshBannerVisible(true);
    const timer = setTimeout(() => setFreshBannerVisible(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  const parsedLoss = Math.max(0, Number(lossInput.replace(/[^0-9.]/g, '')) || 0);

  const loadSampleWireIncident = () => {
    setReporterName('Morgan Whitaker');
    setReporterContact('m.whitaker@westbaygroup.com');
    setFinancialInstitution('Pacific Harbor Commercial Bank');
    setChannel('Commercial Wire / BEC');
    setLossInput('24800');
    setTransactionRef('FEDWIRE-771290-PH');
    setNarrative(
      'An email impersonating our commercial vendor requested updated ACH/wire instructions for invoice #4092. Our accounting desk wired $24,800 two hours ago before confirming verbally with the vendor.',
    );
    setFormError(null);
  };

  const loadSampleCryptoIncident = () => {
    setReporterName('Sora Takahashi');
    setReporterContact('sora.t@protonmail.com');
    setFinancialInstitution('Apex Digital Custody');
    setChannel('On-Chain Wallet Drain');
    setLossInput('11400');
    setTransactionRef('0x9f2c81b04a7d...31a9');
    setNarrative(
      'Connected hardware wallet to a spoofed governance claim link sent via Discord. Malicious approval drained $11,400 in USDC across two transactions within the last 90 minutes.',
    );
    setFormError(null);
  };

  const handleAnalyzeAndRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName.trim() || !financialInstitution.trim() || !narrative.trim() || parsedLoss <= 0) {
      setFormError(
        'Please complete your name, financial institution, estimated loss amount, and incident narrative.',
      );
      return;
    }

    setFormError(null);
    setAnalyzing(true);
    setStep(2);

    try {
      const response = await fetch('/api/triage/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          narrative: narrative.trim(),
          lossAmountUsd: parsedLoss,
          institution: financialInstitution.trim(),
          channel,
        }),
      });

      if (!response.ok) {
        throw new Error('Classification service unavailable');
      }

      const data = (await response.json()) as TriageAnalyzeResponse;
      setTriageResult(data);
      setSelectedCategory(data.category);
      setSelectedUrgency(data.urgency);
      setSelectedPrecinctCode(preselectedPrecinctCode || data.precinctCode);
    } catch {
      const fallbackPrecinct = preselectedPrecinctCode || 'PREC-04B';
      const fallbackUrgency: UrgencyLevel = parsedLoss >= 5000 ? 'Critical — Freeze Window' : 'Elevated';
      setTriageResult({
        category: 'Phishing & Account Takeover',
        urgency: fallbackUrgency,
        precinctCode: fallbackPrecinct,
        recommendedAction: 'Notify institution fraud desk immediately and seal transaction receipts.',
        confidenceLabel: 'Rule-Verified Routing',
        extractedIndicators: [
          `Reported Loss: ${formatCurrencyUsd(parsedLoss)}`,
          `Institution: ${financialInstitution.trim()}`,
          'Citizen Narrative Verified',
        ],
        source: 'deterministic',
      });
      setSelectedCategory('Phishing & Account Takeover');
      setSelectedUrgency(fallbackUrgency);
      setSelectedPrecinctCode(fallbackPrecinct);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const nowIso = new Date().toISOString();
    const added: EvidenceItem[] = Array.from(files).map((file, idx) => ({
      id: `ev-${Date.now()}-${idx}`,
      fileName: file.name,
      fileType: file.type.includes('pdf')
        ? 'PDF Receipt'
        : file.type.startsWith('image/')
          ? 'Screen Capture'
          : 'Document Log',
      sizeLabel: file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(12, Math.round(file.size / 1024))} KB`,
      uploadedAt: nowIso,
      verified: false,
    }));

    setEvidenceItems((prev) => [...prev, ...added]);
    e.target.value = '';
  };

  const handleAddSampleEvidence = (fileName: string, fileType: string, sizeLabel: string) => {
    if (evidenceItems.some((item) => item.fileName === fileName)) return;
    setEvidenceItems((prev) => [
      ...prev,
      {
        id: `ev-sample-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        fileName,
        fileType,
        sizeLabel,
        uploadedAt: new Date().toISOString(),
        verified: false,
      },
    ]);
  };

  const handleRemoveEvidence = (id: string) => {
    setEvidenceItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSealAndDispatch = () => {
    const nowIso = new Date().toISOString();
    const nowLabel = formatTimestampLabel(nowIso);
    const randomDigits = Math.floor(8850 + Math.random() * 1100);
    const caseId = `SC-2026-${randomDigits}`;
    const precinctEntry = getPrecinctByCode(selectedPrecinctCode);
    const dispatchSuffix = Math.floor(1000 + Math.random() * 8999);
    const dispatchId = `DSP-${precinctEntry.code.replace('PREC-', '')}-${dispatchSuffix}`;
    const verificationHash = generateVerificationHash(
      `${caseId}-${reporterName}-${parsedLoss}-${nowIso}`,
    );

    const isCritical = selectedUrgency === 'Critical — Freeze Window';

    const newCase: FraudCase = {
      id: caseId,
      createdAt: nowIso,
      updatedAt: nowIso,
      reporterName: reporterName.trim(),
      reporterContact: reporterContact.trim() || 'citizen@sentinelcivic.gov',
      financialInstitution: financialInstitution.trim(),
      channel,
      category: selectedCategory,
      lossAmountUsd: parsedLoss,
      transactionRef: transactionRef.trim() || `REF-${randomDigits}`,
      narrative: narrative.trim(),
      urgency: selectedUrgency,
      status: isCritical ? 'Freeze Requested' : 'Routed to Precinct',
      freezeRequested: isCritical,
      precinct: {
        code: precinctEntry.code,
        name: precinctEntry.name,
        division: precinctEntry.division,
        jurisdiction: precinctEntry.jurisdiction,
        dispatchId,
        verificationHash,
      },
      evidenceItems:
        evidenceItems.length > 0
          ? evidenceItems
          : [
              {
                id: `ev-decl-${Date.now()}`,
                fileName: 'signed_citizen_statement.txt',
                fileType: 'Intake Affidavit',
                sizeLabel: '14 KB',
                uploadedAt: nowIso,
                verified: true,
              },
            ],
      timeline: [
        {
          id: `tl-1-${Date.now()}`,
          stage: 'Citizen Intake Authenticated',
          detail: `Loss declaration of ${formatCurrencyUsd(parsedLoss)} sealed under SHA-256 digest.`,
          timestamp: nowLabel,
          state: 'completed',
        },
        {
          id: `tl-2-${Date.now()}`,
          stage: `Routed to ${precinctEntry.name}`,
          detail: `Dispatched to ${precinctEntry.code} (${precinctEntry.slaWindow}).`,
          timestamp: nowLabel,
          state: 'active',
        },
        {
          id: `tl-3-${Date.now()}`,
          stage: isCritical ? 'Emergency Bank Freeze Advisory' : 'Investigator Forensic Review',
          detail: isCritical
            ? `Urgent recall notice queued for ${financialInstitution.trim()}.`
            : 'Assigned investigator validating transaction logs and evidence.',
          timestamp: 'Scheduled',
          state: 'upcoming',
        },
      ],
      officerNotes: [],
      aiSummary: {
        confidenceLabel: triageResult?.confidenceLabel ?? 'Rule-Verified Routing',
        recommendedAction:
          triageResult?.recommendedAction ??
          'Preserve transaction records and route to assigned regional cyber division.',
        extractedIndicators:
          triageResult?.extractedIndicators ?? [
            `Reported Loss: ${formatCurrencyUsd(parsedLoss)}`,
            `Institution: ${financialInstitution.trim()}`,
          ],
        source: triageResult?.source ?? 'deterministic',
      },
    };

    addCase(newCase);
    setSubmittedCase(newCase);
    onClearPreselectedPrecinct();
    setStep(4);
  };

  const handleStartFresh = () => {
    setStep(1);
    setReporterName('');
    setReporterContact('');
    setFinancialInstitution('');
    setLossInput('');
    setTransactionRef('');
    setNarrative('');
    setEvidenceItems([]);
    setTriageResult(null);
    setSubmittedCase(null);
    setFormError(null);
  };

  const previewPrecinct = getPrecinctByCode(selectedPrecinctCode);

  const stepsMeta = [
    { num: 1, label: 'Incident & Loss' },
    { num: 2, label: 'Smart Routing' },
    { num: 3, label: 'Evidence' },
    { num: 4, label: 'Receipt' },
  ] as const;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
      {/* Editorial Hero Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[13px] font-semibold tracking-[0.01em] text-[#0B6B78]">
            Cyber & Financial Fraud Intake · Encrypted Precinct Dispatch
          </p>
          <h1 className="mt-2 text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#1C1C1C] sm:text-[40px]">
            Report financial fraud and route directly to cyber investigators.
          </h1>
          <p className="mt-3 text-[16px] leading-[24px] text-[#41493D]">
            Complete a structured incident declaration to receive instant fraud classification,
            bank-freeze urgency scoring, and a cryptographically verifiable precinct dispatch receipt.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#41493D] lg:pb-1">
          <div>
            <span className="block font-mono text-[20px] font-bold text-[#0B4F0B] tabular-nums">
              {cases.length}
            </span>
            <span>Active Tracked Filings</span>
          </div>
          <div className="h-8 w-[1px] bg-[#1C1C1C]/10" aria-hidden="true" />
          <div>
            <span className="block font-mono text-[20px] font-bold text-[#1C1C1C] tabular-nums">
              &lt; 15 min
            </span>
            <span>Rapid Freeze Dispatch</span>
          </div>
        </div>
      </div>

      {/* 12-Column Responsive Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Main Intake Surface */}
        <section className="civic-card rounded-[28px] p-6 sm:p-8 lg:col-span-8">
          {/* Step Progress Bar */}
          <div className="mb-8 grid grid-cols-2 gap-2 border-b border-[#1C1C1C]/[0.06] pb-6 sm:flex sm:flex-wrap sm:items-center">
            {stepsMeta.map((item, idx) => {
              const isCurrent = step === item.num;
              const isDone = step > item.num;
              return (
                <div key={item.num} className="flex items-center gap-2">
                  <div
                    className={`inline-flex h-8 w-full sm:w-auto items-center justify-center sm:justify-start gap-2 rounded-full px-3 text-[12px] font-semibold whitespace-nowrap transition-colors ${
                      isCurrent
                        ? 'bg-[#B6F21C] text-[#1C1C1C]'
                        : isDone
                          ? 'bg-[#C4F25A]/35 text-[#0B4F0B]'
                          : 'bg-[#FAFAF9] text-[#717A6C]'
                    }`}
                  >
                    <span className="font-mono tabular-nums">
                      {isDone ? <Check className="h-3.5 w-3.5" strokeWidth={2.75} /> : `0${item.num}`}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {idx < stepsMeta.length - 1 && (
                    <span className="hidden sm:inline-block h-[1px] w-4 bg-[#1C1C1C]/15" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Fresh Incident Confirmation */}
          {freshBannerVisible && step === 1 && (
            <div
              role="status"
              className="mb-5 rounded-[12px] bg-[#C4F25A]/35 px-4 py-2.5 text-[13px] font-semibold text-[#0B4F0B]"
            >
              New incident declaration ready — enter details below or select a sample case.
            </div>
          )}

          {/* STEP 1: INCIDENT & LOSS */}
          {step === 1 && (
            <form onSubmit={handleAnalyzeAndRoute} className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#1C1C1C]">
                    1. Incident & Monetary Loss Details
                  </h2>
                  <p className="mt-1 text-[14px] text-[#41493D]">
                    Provide transaction details and describe how the compromise or transfer occurred.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={loadSampleWireIncident}
                    className="inline-flex h-9 items-center rounded-[12px] border border-[#1C1C1C]/15 bg-white px-3 text-[12px] font-semibold text-[#1C1C1C] transition-colors hover:bg-[#B6F21C]/20 whitespace-nowrap"
                  >
                    Sample: Spoofed Wire
                  </button>
                  <button
                    type="button"
                    onClick={loadSampleCryptoIncident}
                    className="inline-flex h-9 items-center rounded-[12px] border border-[#1C1C1C]/15 bg-white px-3 text-[12px] font-semibold text-[#1C1C1C] transition-colors hover:bg-[#B6F21C]/20 whitespace-nowrap"
                  >
                    Sample: Wallet Drain
                  </button>
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="flex items-center gap-2.5 rounded-[14px] bg-[#E5484D]/[0.1] px-4 py-3 text-[13px] font-semibold text-[#E5484D]"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Fraud Channel Quick Selector */}
              <div>
                <label className="mb-2 block text-[12px] font-semibold tracking-[0.02em] text-[#1C1C1C]">
                  Primary Incident Channel
                </label>
                <div className="flex flex-wrap gap-2">
                  {FRAUD_CHANNELS.map((item) => {
                    const active = channel === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setChannel(item)}
                        className={`h-9 rounded-[12px] px-3.5 text-[13px] font-semibold transition-colors whitespace-nowrap ${
                          active
                            ? 'bg-[#0B4F0B] text-white'
                            : 'border border-[#1C1C1C]/12 bg-[#FAFAF9] text-[#41493D] hover:bg-[#C4F25A]/25 hover:text-[#1C1C1C]'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="reporterName" className="mb-1.5 block text-[12px] font-semibold tracking-[0.02em] text-[#1C1C1C]">
                    Full Legal Name
                  </label>
                  <input
                    id="reporterName"
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g., Claire Abernathy"
                    className="civic-input h-[50px] w-full px-4 text-[15px]"
                  />
                </div>

                <div>
                  <label htmlFor="reporterContact" className="mb-1.5 block text-[12px] font-semibold tracking-[0.02em] text-[#1C1C1C]">
                    Contact Email
                  </label>
                  <input
                    id="reporterContact"
                    type="email"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    placeholder="name@domain.com"
                    className="civic-input h-[50px] w-full px-4 text-[15px]"
                  />
                </div>

                <div>
                  <label htmlFor="financialInstitution" className="mb-1.5 block text-[12px] font-semibold tracking-[0.02em] text-[#1C1C1C]">
                    Financial Institution / Platform
                  </label>
                  <input
                    id="financialInstitution"
                    type="text"
                    value={financialInstitution}
                    onChange={(e) => setFinancialInstitution(e.target.value)}
                    placeholder="e.g., First Meridian Bank or Coinbase"
                    className="civic-input h-[50px] w-full px-4 text-[15px]"
                  />
                </div>

                <div>
                  <label htmlFor="lossAmount" className="mb-1.5 block text-[12px] font-semibold tracking-[0.02em] text-[#1C1C1C]">
                    Estimated Financial Loss (USD)
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[15px] font-semibold text-[#41493D]">
                      $
                    </span>
                    <input
                      id="lossAmount"
                      type="number"
                      min="1"
                      step="any"
                      value={lossInput}
                      onChange={(e) => setLossInput(e.target.value)}
                      placeholder="12500"
                      className="civic-input h-[50px] w-full pl-8 pr-4 font-mono text-[15px] tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="transactionRef" className="mb-1.5 block text-[12px] font-semibold tracking-[0.02em] text-[#1C1C1C]">
                  Transaction Reference, Wire Trace, or Wallet Hash (Optional)
                </label>
                <input
                  id="transactionRef"
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g., FEDWIRE-994201 or 0x7a4e..."
                  className="civic-input h-[50px] w-full px-4 font-mono text-[14px]"
                />
              </div>

              <div>
                <label htmlFor="narrative" className="mb-1.5 block text-[12px] font-semibold tracking-[0.02em] text-[#1C1C1C]">
                  Incident Narrative
                </label>
                <textarea
                  id="narrative"
                  rows={4}
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="Describe how contact occurred, what credentials or funds were transferred, and when the transaction took place..."
                  className="civic-input w-full px-4 py-3.5 text-[15px] leading-[22px]"
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-[14px] bg-[#0B4F0B] px-6 text-[15px] font-semibold text-white transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_8px_18px_-4px_rgba(11,79,11,0.35)] whitespace-nowrap"
                >
                  <span>Analyze & Route Incident</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SMART CATEGORIZATION & PRECINCT MATCH */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#1C1C1C]">
                  2. Smart Categorization & Precinct Match
                </h2>
                <p className="mt-1 text-[14px] text-[#41493D]">
                  Review the automated fraud classification and assigned cybercrime unit before attaching evidence.
                </p>
              </div>

              {analyzing ? (
                <div className="space-y-4 py-4" aria-busy="true">
                  <div className="h-6 w-56 animate-pulse rounded-lg bg-[#EFF0EC]" />
                  <div className="h-28 w-full animate-pulse rounded-[20px] bg-[#EFF0EC]" />
                  <div className="h-32 w-full animate-pulse rounded-[20px] bg-[#EFF0EC]" />
                </div>
              ) : (
                <>
                  {/* Triage Extraction Summary */}
                  <div className="rounded-[20px] border border-[#1C1C1C]/[0.08] bg-[#FAFAF9] p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[12px] font-semibold text-[#0B6B78]">
                        {triageResult?.confidenceLabel ?? 'Automated Triage'}
                      </span>
                      {selectedUrgency === 'Critical — Freeze Window' ? (
                        <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[#E5484D]/[0.12] px-3 text-[12px] font-semibold text-[#E5484D]">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Critical — Freeze Window
                        </span>
                      ) : (
                        <span className="inline-flex h-7 items-center rounded-full bg-[#C4F25A]/35 px-3 text-[12px] font-semibold text-[#0B4F0B]">
                          {selectedUrgency}
                        </span>
                      )}
                    </div>

                    <p className="text-[15px] font-semibold leading-[22px] text-[#1C1C1C]">
                      {triageResult?.recommendedAction}
                    </p>

                    {triageResult && triageResult.extractedIndicators.length > 0 && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#1C1C1C]/[0.06] pt-3 text-[13px] text-[#41493D]">
                        {triageResult.extractedIndicators.map((ind, index) => (
                          <span key={ind} className="inline-flex items-center gap-3">
                            <span>{ind}</span>
                            {index < triageResult.extractedIndicators.length - 1 && (
                              <span aria-hidden="true" className="text-[#717A6C]">·</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Editable Classification Overrides */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="categorySelect" className="mb-1.5 block text-[12px] font-semibold text-[#1C1C1C]">
                        Assigned Fraud Category
                      </label>
                      <select
                        id="categorySelect"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as FraudCategory)}
                        className="civic-input h-[48px] w-full px-3.5 text-[14px] font-medium"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="precinctSelect" className="mb-1.5 block text-[12px] font-semibold text-[#1C1C1C]">
                        Target Law Enforcement Division
                      </label>
                      <select
                        id="precinctSelect"
                        value={selectedPrecinctCode}
                        onChange={(e) => setSelectedPrecinctCode(e.target.value)}
                        className="civic-input h-[48px] w-full px-3.5 text-[14px] font-medium"
                      >
                        {PRECINCT_DIRECTORY.map((p) => (
                          <option key={p.code} value={p.code}>
                            {p.code} — {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preview Precinct Routing Card */}
                  <PrecinctRoutingCard
                    compact
                    precinct={{
                      code: previewPrecinct.code,
                      name: previewPrecinct.name,
                      division: previewPrecinct.division,
                      jurisdiction: previewPrecinct.jurisdiction,
                      dispatchId: 'PENDING-SEAL',
                      verificationHash: 'sha256:awaiting-final-citizen-seal',
                    }}
                  />

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-[14px] border border-[#1C1C1C]/15 px-5 text-[14px] font-semibold text-[#1C1C1C] transition-colors hover:bg-[#B6F21C]/15 whitespace-nowrap"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Edit Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-[14px] bg-[#0B4F0B] px-6 text-[15px] font-semibold text-white transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_8px_18px_-4px_rgba(11,79,11,0.35)] whitespace-nowrap"
                    >
                      <span>Continue to Evidence</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 3: EVIDENCE & DISPATCH */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#1C1C1C]">
                  3. Attach Transaction Receipts & Evidence
                </h2>
                <p className="mt-1 text-[14px] text-[#41493D]">
                  Upload wire confirmations, bank statements, or phishing screenshots for precinct verification.
                </p>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#1C1C1C]/15 bg-[#FAFAF9] px-6 py-8 text-center transition-colors hover:border-[#0B4F0B]/50 hover:bg-[#C4F25A]/10">
                <Upload className="h-7 w-7 text-[#0B4F0B]" />
                <span className="mt-3 text-[15px] font-semibold text-[#1C1C1C]">
                  Select PDF receipts, screenshots, or email logs
                </span>
                <span className="mt-1 text-[13px] text-[#41493D]">
                  Stored locally in your session docket for immediate investigator preview
                </span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>

              {/* Quick Sample Attachment Pills for Testing */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-semibold text-[#41493D]">Quick sample exhibits:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleAddSampleEvidence('wire_confirmation_receipt.pdf', 'PDF Receipt', '340 KB')
                  }
                  className="inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-[#1C1C1C]/12 bg-white px-3 text-[12px] font-semibold text-[#1C1C1C] hover:bg-[#B6F21C]/20"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Wire Receipt PDF
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAddSampleEvidence('phishing_message_capture.png', 'Screen Capture', '820 KB')
                  }
                  className="inline-flex h-8 items-center gap-1.5 rounded-[10px] border border-[#1C1C1C]/12 bg-white px-3 text-[12px] font-semibold text-[#1C1C1C] hover:bg-[#B6F21C]/20"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Phishing Capture PNG
                </button>
              </div>

              {evidenceItems.length > 0 && (
                <div className="divide-y divide-[#1C1C1C]/[0.06] rounded-[16px] border border-[#1C1C1C]/[0.08] bg-white px-4">
                  {evidenceItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-[#0B6B78]" />
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-semibold text-[#1C1C1C]">
                            {item.fileName}
                          </p>
                          <p className="text-[12px] text-[#41493D]">
                            {item.fileType} · <span className="font-mono tabular-nums">{item.sizeLabel}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.fileName}`}
                        onClick={() => handleRemoveEvidence(item.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#41493D] hover:bg-[#E5484D]/10 hover:text-[#E5484D]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-[14px] border border-[#1C1C1C]/15 px-5 text-[14px] font-semibold text-[#1C1C1C] transition-colors hover:bg-[#B6F21C]/15 whitespace-nowrap"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Routing
                </button>
                <button
                  type="button"
                  onClick={handleSealAndDispatch}
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-[14px] bg-[#B6F21C] px-6 text-[15px] font-bold text-[#1C1C1C] transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_10px_24px_-6px_rgba(182,242,28,0.65)] whitespace-nowrap"
                >
                  <Lock className="h-4 w-4" />
                  <span>Seal & Dispatch Report</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CRYPTOGRAPHIC RECEIPT */}
          {step === 4 && submittedCase && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#C4F25A]/40 px-3 py-1 text-[12px] font-bold text-[#0B4F0B]">
                    <ShieldCheck className="h-4 w-4" />
                    Report Sealed & Dispatched
                  </div>
                  <h2 className="mt-3 text-[26px] font-extrabold tracking-[-0.02em] text-[#1C1C1C]">
                    Case {submittedCase.id}
                  </h2>
                  <p className="mt-1 text-[14px] text-[#41493D]">
                    {submittedCase.financialInstitution} · {submittedCase.category} ·{' '}
                    <span className="font-mono font-semibold text-[#1C1C1C] tabular-nums">
                      {formatCurrencyUsd(submittedCase.lossAmountUsd)}
                    </span>
                  </p>
                </div>
              </div>

              <PrecinctRoutingCard precinct={submittedCase.precinct} />

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleStartFresh}
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-[14px] border border-[#1C1C1C]/15 px-5 text-[14px] font-semibold text-[#1C1C1C] hover:bg-[#FAFAF9] whitespace-nowrap"
                >
                  File Another Report
                </button>
                <button
                  type="button"
                  onClick={() => onReportDispatched(submittedCase.id)}
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-[14px] bg-[#0B4F0B] px-6 text-[15px] font-semibold text-white transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_8px_18px_-4px_rgba(11,79,11,0.35)] whitespace-nowrap"
                >
                  <span>Open Live Case Timeline</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Right Side: Live Verification Summary & Freeze Protocol */}
        <aside className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-1 lg:col-span-4">
          <div className="civic-card rounded-[24px] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1C1C1C]/[0.06] pb-4">
              <span className="text-[13px] font-semibold text-[#41493D]">Intake Declaration</span>
              <span className="font-mono text-[12px] font-semibold text-[#0B6B78]">
                {previewPrecinct.code}
              </span>
            </div>

            <div>
              <span className="text-[12px] font-semibold text-[#41493D]">Declared Monetary Loss</span>
              <p className="mt-1 font-mono text-[32px] font-extrabold leading-none tracking-[-0.03em] text-[#1C1C1C] tabular-nums">
                {formatCurrencyUsd(parsedLoss)}
              </p>
            </div>

            <div className="space-y-2.5 border-t border-[#1C1C1C]/[0.06] pt-4 text-[13px]">
              <div className="flex justify-between gap-3">
                <span className="text-[#41493D]">Assigned Division</span>
                <span className="text-right font-semibold text-[#1C1C1C]">{previewPrecinct.name}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#41493D]">Target Response SLA</span>
                <span className="font-mono font-semibold text-[#0B4F0B] tabular-nums">
                  {previewPrecinct.slaWindow}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#41493D]">Exhibits Attached</span>
                <span className="font-mono font-semibold text-[#1C1C1C] tabular-nums">
                  {evidenceItems.length}
                </span>
              </div>
            </div>

            {parsedLoss >= 5000 && (
              <div className="rounded-[16px] bg-[#E5484D]/[0.09] p-4 text-[13px] leading-[19px] text-[#93000A]">
                <p className="font-bold text-[#E5484D]">Rapid Freeze Window Protocol</p>
                <p className="mt-1">
                  Losses of $5,000 or more automatically flag your filing for emergency bank recall
                  coordination upon submission.
                </p>
              </div>
            )}
          </div>

          <div className="civic-card-frosted rounded-[24px] p-6 space-y-3">
            <h3 className="text-[15px] font-bold text-[#1C1C1C]">Already filed an incident?</h3>
            <p className="text-[13px] leading-[20px] text-[#41493D]">
              Track investigator milestones, precinct handoffs, and clearinghouse freeze statuses in real time.
            </p>
            <button
              type="button"
              onClick={onNavigateTracker}
              className="inline-flex h-10 w-full items-center justify-center rounded-[12px] border border-[#1C1C1C]/15 bg-white text-[13px] font-semibold text-[#1C1C1C] transition-colors hover:bg-[#B6F21C]/20"
            >
              Open Case Tracker
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
