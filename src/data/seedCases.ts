import { FraudCase, PrecinctDirectoryEntry } from '../types/fraud';

export const PRECINCT_DIRECTORY: PrecinctDirectoryEntry[] = [
  {
    code: 'PREC-01A',
    name: 'Wire & Clearinghouse Rapid Freeze Taskforce',
    division: 'Financial Crimes Division · Unit A',
    jurisdiction: 'Metro Commercial & Interbank District',
    slaWindow: '< 15 min freeze dispatch',
    specialties: ['Wire & ACH Fraud'],
    leadCommander: 'Det. Capt. Elena Vance',
    contactDesk: 'wire-recall@sentinelcivic.gov',
  },
  {
    code: 'PREC-04B',
    name: 'Metro Cyber Financial Unit',
    division: 'Cyber Operations Bureau · Unit B',
    jurisdiction: 'Central Municipal & Banking Corridor',
    slaWindow: '< 45 min forensic intake',
    specialties: ['Phishing & Account Takeover', 'Wire & ACH Fraud'],
    leadCommander: 'Lt. Marcus Holloway',
    contactDesk: 'cyber-fin@sentinelcivic.gov',
  },
  {
    code: 'PREC-07C',
    name: 'Digital Asset & Blockchain Forensics',
    division: 'Cyber Operations Bureau · Unit C',
    jurisdiction: 'Regional Virtual Asset & Exchange Desk',
    slaWindow: '< 30 min exchange alert',
    specialties: ['Crypto & Wallet Drain'],
    leadCommander: 'Spec. Insp. Priya Nair',
    contactDesk: 'chain-trace@sentinelcivic.gov',
  },
  {
    code: 'PREC-02E',
    name: 'Municipal Payment Fraud Bureau',
    division: 'Consumer Protection Division · Unit E',
    jurisdiction: 'District P2P & Retail Commerce Network',
    slaWindow: '2 hr standard triage',
    specialties: ['Payment App Scam'],
    leadCommander: 'Sgt. David Okafor',
    contactDesk: 'p2p-desk@sentinelcivic.gov',
  },
  {
    code: 'PREC-03D',
    name: 'Consumer Identity & Account Takeover Desk',
    division: 'Special Fraud Investigations · Unit D',
    jurisdiction: 'Countywide Credit & Telecom Jurisdiction',
    slaWindow: '4 hr carrier/bureau coordination',
    specialties: ['Identity & Credit Fraud', 'Phishing & Account Takeover'],
    leadCommander: 'Det. Hannah Lindqvist',
    contactDesk: 'identity-desk@sentinelcivic.gov',
  },
];

export function getPrecinctByCode(code: string): PrecinctDirectoryEntry {
  return PRECINCT_DIRECTORY.find((p) => p.code === code) ?? PRECINCT_DIRECTORY[1];
}

export function formatCurrencyUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function generateVerificationHash(seed: string): string {
  let h1 = 0xdeadbeef ^ seed.length;
  let h2 = 0x41c6ce57 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const partA = (h1 >>> 0).toString(16).padStart(8, '0');
  const partB = (h2 >>> 0).toString(16).padStart(8, '0');
  return `sha256:${partA}${partB}9f4c2a18e0b7`.slice(0, 31);
}

export function formatTimestampLabel(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export const INITIAL_DEMO_CASES: FraudCase[] = [
  {
    id: 'SC-2026-8841',
    createdAt: '2026-11-13T09:12:00Z',
    updatedAt: '2026-11-13T09:41:00Z',
    reporterName: 'Claire Abernathy',
    reporterContact: 'c.abernathy@civicmail.org',
    financialInstitution: 'First Meridian Commercial Bank',
    channel: 'Commercial Wire / BEC',
    category: 'Wire & ACH Fraud',
    lossAmountUsd: 48500,
    transactionRef: 'FEDWIRE-994201-FM',
    narrative:
      'Received spoofed escrow closing instructions matching our title attorney domain. Initiated an outgoing domestic wire of $48,500 before discovering the routing number belonged to an unfamiliar account.',
    urgency: 'Critical — Freeze Window',
    status: 'Freeze Requested',
    freezeRequested: true,
    precinct: {
      code: 'PREC-01A',
      name: 'Wire & Clearinghouse Rapid Freeze Taskforce',
      division: 'Financial Crimes Division · Unit A',
      jurisdiction: 'Metro Commercial & Interbank District',
      dispatchId: 'DSP-01A-7749',
      verificationHash: 'sha256:8c4a91f20e7b3d14a902c1',
    },
    evidenceItems: [
      {
        id: 'ev-101',
        fileName: 'fedwire_confirmation_994201.pdf',
        fileType: 'PDF Receipt',
        sizeLabel: '412 KB',
        uploadedAt: '2026-11-13T09:13:00Z',
        verified: true,
        summaryNote: 'Originating SWIFT/Fedwire trace confirmed',
      },
      {
        id: 'ev-102',
        fileName: 'spoofed_title_email_headers.eml',
        fileType: 'Email Header Log',
        sizeLabel: '28 KB',
        uploadedAt: '2026-11-13T09:14:00Z',
        verified: true,
        summaryNote: 'SPF/DKIM mismatch from lookalike domain',
      },
    ],
    timeline: [
      {
        id: 'tl-1',
        stage: 'Citizen Intake Authenticated',
        detail: 'Loss declaration and Fedwire reference sealed under cryptographic digest.',
        timestamp: 'Nov 13 · 09:12',
        state: 'completed',
      },
      {
        id: 'tl-2',
        stage: 'Routed to Rapid Freeze Taskforce',
        detail: 'Auto-matched to PREC-01A within 15-minute recall SLA.',
        timestamp: 'Nov 13 · 09:14',
        state: 'completed',
      },
      {
        id: 'tl-3',
        stage: 'Interbank Recall & Freeze Requested',
        detail: 'Emergency hold advisory issued to First Meridian & receiving clearing bank.',
        timestamp: 'Nov 13 · 09:41',
        state: 'active',
      },
      {
        id: 'tl-4',
        stage: 'Subpoena & Funds Recovery Audit',
        detail: 'Pending clearinghouse confirmation of held funds.',
        timestamp: 'Scheduled',
        state: 'upcoming',
      },
    ],
    officerNotes: [
      {
        id: 'on-1',
        author: 'Det. Capt. Elena Vance',
        badgeNumber: 'BDG-4012',
        note: 'Fedwire recall tracer transmitted to receiving institution compliance desk. Awaiting beneficiary account freeze confirmation.',
        timestamp: 'Nov 13 · 09:41',
      },
    ],
    aiSummary: {
      confidenceLabel: 'AI-Assisted Routing',
      recommendedAction: 'Dispatch immediate interbank wire recall and preserve spoofed SMTP headers.',
      extractedIndicators: [
        'Reported Loss: $48,500',
        'Business Email Compromise Vector',
        'Fedwire Recall Window Active',
      ],
      source: 'gemini',
    },
  },
  {
    id: 'SC-2026-8837',
    createdAt: '2026-11-13T07:50:00Z',
    updatedAt: '2026-11-13T08:35:00Z',
    reporterName: 'Devon Takahashi',
    reporterContact: 'd.takahashi@northbay.io',
    financialInstitution: 'Horizon Custody Exchange',
    channel: 'On-Chain Wallet Drain',
    category: 'Crypto & Wallet Drain',
    lossAmountUsd: 19250,
    transactionRef: '0x7a4e91c8f4b2...e813',
    narrative:
      'Signed what appeared to be a staking verification prompt on a cloned governance portal. Within four minutes, 6.2 ETH and 4,100 USDC were swept to an external mixer relay address.',
    urgency: 'Critical — Freeze Window',
    status: 'Under Forensic Review',
    freezeRequested: true,
    precinct: {
      code: 'PREC-07C',
      name: 'Digital Asset & Blockchain Forensics',
      division: 'Cyber Operations Bureau · Unit C',
      jurisdiction: 'Regional Virtual Asset & Exchange Desk',
      dispatchId: 'DSP-07C-3318',
      verificationHash: 'sha256:41e7bc902f8a1c65d2209e',
    },
    evidenceItems: [
      {
        id: 'ev-201',
        fileName: 'etherscan_drain_tx_log.json',
        fileType: 'On-Chain Trace',
        sizeLabel: '84 KB',
        uploadedAt: '2026-11-13T07:52:00Z',
        verified: true,
      },
      {
        id: 'ev-202',
        fileName: 'phishing_dapp_screenshot.png',
        fileType: 'Screen Capture',
        sizeLabel: '1.4 MB',
        uploadedAt: '2026-11-13T07:53:00Z',
        verified: false,
      },
    ],
    timeline: [
      {
        id: 'tl-21',
        stage: 'Citizen Intake Authenticated',
        detail: 'Transaction hash and malicious spender contract logged.',
        timestamp: 'Nov 13 · 07:50',
        state: 'completed',
      },
      {
        id: 'tl-22',
        stage: 'Routed to Blockchain Forensics',
        detail: 'Assigned to PREC-07C for cluster tracing and exchange tagging.',
        timestamp: 'Nov 13 · 07:54',
        state: 'completed',
      },
      {
        id: 'tl-23',
        stage: 'Off-Ramp Exchange Freeze Alert',
        detail: 'Cluster hops flagged at two regulated off-ramp liquidity desks.',
        timestamp: 'Nov 13 · 08:35',
        state: 'active',
      },
      {
        id: 'tl-24',
        stage: 'Asset Seizure Coordination',
        detail: 'Awaiting exchange compliance KYC freeze response.',
        timestamp: 'Scheduled',
        state: 'upcoming',
      },
    ],
    officerNotes: [
      {
        id: 'on-21',
        author: 'Spec. Insp. Priya Nair',
        badgeNumber: 'BDG-7104',
        note: 'Spender contract 0x99d...3b1 matches known drainer kit. 4,100 USDC traced to secondary deposit wallet; freeze notice queued.',
        timestamp: 'Nov 13 · 08:35',
      },
    ],
    aiSummary: {
      confidenceLabel: 'AI-Assisted Routing',
      recommendedAction: 'Flag destination wallet addresses with regulated exchange compliance desks.',
      extractedIndicators: [
        'Reported Loss: $19,250',
        'Malicious Permit2 Approval',
        'Traceable On-Chain Hop Cluster',
      ],
      source: 'gemini',
    },
  },
  {
    id: 'SC-2026-8824',
    createdAt: '2026-11-12T18:20:00Z',
    updatedAt: '2026-11-12T20:10:00Z',
    reporterName: 'Miriam Solano',
    reporterContact: 'msolano@ridgefield.net',
    financialInstitution: 'Pacific Crest Credit Union',
    channel: 'SMS Phishing & Portal Login',
    category: 'Phishing & Account Takeover',
    lossAmountUsd: 6400,
    transactionRef: 'ACH-OUT-441820',
    narrative:
      'Clicked an urgent fraud-verification SMS link claiming my debit card was locked. Entered online banking credentials and a one-time passcode; attackers added an external payee and pulled $6,400 via ACH.',
    urgency: 'Elevated',
    status: 'Routed to Precinct',
    freezeRequested: false,
    precinct: {
      code: 'PREC-04B',
      name: 'Metro Cyber Financial Unit',
      division: 'Cyber Operations Bureau · Unit B',
      jurisdiction: 'Central Municipal & Banking Corridor',
      dispatchId: 'DSP-04B-5120',
      verificationHash: 'sha256:9b13d40f7e22c81a66510b',
    },
    evidenceItems: [
      {
        id: 'ev-301',
        fileName: 'smishing_text_capture.png',
        fileType: 'Mobile Screenshot',
        sizeLabel: '620 KB',
        uploadedAt: '2026-11-12T18:22:00Z',
        verified: true,
      },
    ],
    timeline: [
      {
        id: 'tl-31',
        stage: 'Citizen Intake Authenticated',
        detail: 'Phishing URL and ACH debit reference recorded.',
        timestamp: 'Nov 12 · 18:20',
        state: 'completed',
      },
      {
        id: 'tl-32',
        stage: 'Routed to Metro Cyber Financial Unit',
        detail: 'Case queued under PREC-04B for banking session IP correlation.',
        timestamp: 'Nov 12 · 20:10',
        state: 'active',
      },
      {
        id: 'tl-33',
        stage: 'Forensic Review & Domain Takedown',
        detail: 'Pending investigator docket review.',
        timestamp: 'Scheduled',
        state: 'upcoming',
      },
    ],
    officerNotes: [],
    aiSummary: {
      confidenceLabel: 'AI-Assisted Routing',
      recommendedAction: 'Rotate member credentials and request originating IP logs from credit union.',
      extractedIndicators: [
        'Reported Loss: $6,400',
        'SMS Credential Harvesting',
        'Unauthorized External ACH Payee',
      ],
      source: 'gemini',
    },
  },
  {
    id: 'SC-2026-8812',
    createdAt: '2026-11-12T14:05:00Z',
    updatedAt: '2026-11-12T16:45:00Z',
    reporterName: 'Julian Mercer',
    reporterContact: 'j.mercer@oakridge.com',
    financialInstitution: 'QuickSend P2P Network',
    channel: 'P2P Instant Payment App',
    category: 'Payment App Scam',
    lossAmountUsd: 1850,
    transactionRef: 'ZLL-88201944',
    narrative:
      'Caller impersonated bank fraud prevention and instructed me to send a "reversal verification" transfer of $1,850 through QuickSend to cancel a pending charge.',
    urgency: 'Elevated',
    status: 'Under Forensic Review',
    freezeRequested: false,
    precinct: {
      code: 'PREC-02E',
      name: 'Municipal Payment Fraud Bureau',
      division: 'Consumer Protection Division · Unit E',
      jurisdiction: 'District P2P & Retail Commerce Network',
      dispatchId: 'DSP-02E-1904',
      verificationHash: 'sha256:3d991a04c6b7e812f04d19',
    },
    evidenceItems: [
      {
        id: 'ev-401',
        fileName: 'p2p_transfer_receipt.pdf',
        fileType: 'PDF Receipt',
        sizeLabel: '198 KB',
        uploadedAt: '2026-11-12T14:08:00Z',
        verified: true,
      },
    ],
    timeline: [
      {
        id: 'tl-41',
        stage: 'Citizen Intake Authenticated',
        detail: 'P2P recipient handle and caller ID captured.',
        timestamp: 'Nov 12 · 14:05',
        state: 'completed',
      },
      {
        id: 'tl-42',
        stage: 'Routed to Municipal Payment Fraud Bureau',
        detail: 'Assigned to PREC-02E for recipient mule-account check.',
        timestamp: 'Nov 12 · 14:22',
        state: 'completed',
      },
      {
        id: 'tl-43',
        stage: 'Cross-District Mule Cluster Review',
        detail: 'Recipient handle linked to 3 prior impersonation complaints.',
        timestamp: 'Nov 12 · 16:45',
        state: 'active',
      },
    ],
    officerNotes: [
      {
        id: 'on-41',
        author: 'Sgt. David Okafor',
        badgeNumber: 'BDG-2291',
        note: 'Recipient token cross-referenced with active spoofing ring. Escalating subpoena request to QuickSend trust & safety.',
        timestamp: 'Nov 12 · 16:45',
      },
    ],
    aiSummary: {
      confidenceLabel: 'AI-Assisted Routing',
      recommendedAction: 'Log spoofing caller ID and link recipient token to regional mule registry.',
      extractedIndicators: [
        'Reported Loss: $1,850',
        'Bank Impersonation Voice Scam',
        'Irreversible P2P Transfer',
      ],
      source: 'gemini',
    },
  },
  {
    id: 'SC-2026-8795',
    createdAt: '2026-11-11T11:30:00Z',
    updatedAt: '2026-11-12T10:15:00Z',
    reporterName: 'Nadia Kowalski',
    reporterContact: 'nkowalski@veridian.org',
    financialInstitution: 'National Reserve Card Services',
    channel: 'SIM Swap & New Credit Line',
    category: 'Identity & Credit Fraud',
    lossAmountUsd: 9200,
    transactionRef: 'CRE-SIM-55019',
    narrative:
      'Mobile carrier number was ported without authorization late Tuesday. Attackers used SMS recovery codes to open a $9,200 revolving credit line and purchase electronics for local pickup.',
    urgency: 'Elevated',
    status: 'Intake Verified',
    freezeRequested: false,
    precinct: {
      code: 'PREC-03D',
      name: 'Consumer Identity & Account Takeover Desk',
      division: 'Special Fraud Investigations · Unit D',
      jurisdiction: 'Countywide Credit & Telecom Jurisdiction',
      dispatchId: 'DSP-03D-6042',
      verificationHash: 'sha256:66fa01c2d9e48b11a730c5',
    },
    evidenceItems: [
      {
        id: 'ev-501',
        fileName: 'carrier_port_out_incident_ticket.pdf',
        fileType: 'Carrier Log',
        sizeLabel: '310 KB',
        uploadedAt: '2026-11-11T11:35:00Z',
        verified: false,
      },
    ],
    timeline: [
      {
        id: 'tl-51',
        stage: 'Citizen Intake Authenticated',
        detail: 'SIM port-out timestamp and credit inquiry verified.',
        timestamp: 'Nov 11 · 11:30',
        state: 'active',
      },
      {
        id: 'tl-52',
        stage: 'Routed to Identity & Takeover Desk',
        detail: 'Awaiting carrier store camera & port-out log preservation.',
        timestamp: 'Pending',
        state: 'upcoming',
      },
    ],
    officerNotes: [],
    aiSummary: {
      confidenceLabel: 'AI-Assisted Routing',
      recommendedAction: 'Place credit bureau fraud alerts and preserve retail pickup surveillance.',
      extractedIndicators: [
        'Reported Loss: $9,200',
        'Unauthorized Telecom SIM Port',
        'Fraudulent Credit Origination',
      ],
      source: 'gemini',
    },
  },
  {
    id: 'SC-2026-8760',
    createdAt: '2026-11-09T15:10:00Z',
    updatedAt: '2026-11-12T17:00:00Z',
    reporterName: 'Arthur Pendelton',
    reporterContact: 'apendelton@harborworks.co',
    financialInstitution: 'Civic Trust Savings',
    channel: 'Duplicate Vendor Invoice ACH',
    category: 'Wire & ACH Fraud',
    lossAmountUsd: 14700,
    transactionRef: 'ACH-REC-208814',
    narrative:
      'Compromised supplier billing portal submitted altered ACH instructions for a quarterly equipment invoice. Caught within 4 hours of settlement.',
    urgency: 'Standard',
    status: 'Resolved',
    freezeRequested: false,
    precinct: {
      code: 'PREC-01A',
      name: 'Wire & Clearinghouse Rapid Freeze Taskforce',
      division: 'Financial Crimes Division · Unit A',
      jurisdiction: 'Metro Commercial & Interbank District',
      dispatchId: 'DSP-01A-6891',
      verificationHash: 'sha256:1a94e02c8f7d33b6a01e44',
    },
    evidenceItems: [
      {
        id: 'ev-601',
        fileName: 'ach_reversal_settlement_letter.pdf',
        fileType: 'Bank Settlement',
        sizeLabel: '245 KB',
        uploadedAt: '2026-11-09T15:12:00Z',
        verified: true,
      },
    ],
    timeline: [
      {
        id: 'tl-61',
        stage: 'Citizen Intake Authenticated',
        detail: 'ACH trace number and altered invoice sealed.',
        timestamp: 'Nov 9 · 15:10',
        state: 'completed',
      },
      {
        id: 'tl-62',
        stage: 'Interbank Recall Executed',
        detail: 'PREC-01A triggered same-day ACH return code R06.',
        timestamp: 'Nov 9 · 16:02',
        state: 'completed',
      },
      {
        id: 'tl-63',
        stage: 'Funds Returned & Case Closed',
        detail: 'Full $14,700 recovered to originating Civic Trust account.',
        timestamp: 'Nov 12 · 17:00',
        state: 'completed',
      },
    ],
    officerNotes: [
      {
        id: 'on-61',
        author: 'Det. Capt. Elena Vance',
        badgeNumber: 'BDG-4012',
        note: 'Full funds returned via clearinghouse reversal. Case archived with compliance receipt.',
        timestamp: 'Nov 12 · 17:00',
      },
    ],
    aiSummary: {
      confidenceLabel: 'AI-Assisted Routing',
      recommendedAction: 'Case resolved; vendor portal MFA audit recommended.',
      extractedIndicators: [
        'Reported Loss: $14,700',
        'Vendor Invoice Alteration',
        'Full ACH Recovery Completed',
      ],
      source: 'gemini',
    },
  },
];
