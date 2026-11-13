import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  FileCheck2,
  Landmark,
  Lock,
  PhoneCall,
  Play,
  Radio,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useFraudCases } from '../context/FraudCaseContext';
import { formatCurrencyUsd } from '../data/seedCases';

interface HomeOverviewViewProps {
  onStartNewIncident: (channel?: string) => void;
  onOpenCaseInTracker: (caseId: string) => void;
  onOpenOfficerTriage: () => void;
  onOpenPrecincts: () => void;
}

const FAST_CATEGORIES: { label: string; channel: string }[] = [
  { label: 'Wire & ACH', channel: 'Commercial Wire / BEC' },
  { label: 'Crypto Drain', channel: 'On-Chain Wallet Drain' },
  { label: 'Phishing', channel: 'SMS Phishing & Portal Login' },
  { label: 'Payment App', channel: 'P2P Instant Payment App' },
  { label: 'Identity Theft', channel: 'SIM Swap & Credit Line' },
  { label: 'Bank Spoofing', channel: 'Commercial Wire / BEC' },
];

const ECOSYSTEM_NODES = [
  {
    icon: Landmark,
    badge: 'Live Feed',
    badgeTone: 'green',
    title: '42+ Clearing Banks',
    body: 'Instant Lien Hold & API Gateway for commercial wires, Fedwire, and ACH recalls.',
    metaLeft: 'API v2.4',
    metaRight: '< 1.2s Sync',
  },
  {
    icon: Zap,
    badge: 'Active Sync',
    badgeTone: 'green',
    title: 'Instant P2P & Clearing',
    body: 'Immediate VPA blockade and rapid clearinghouse switch freeze protocols.',
    metaLeft: 'ACH / P2P',
    metaRight: 'Instant Token Lock',
  },
  {
    icon: Building2,
    badge: '5 Divisions',
    badgeTone: 'neutral',
    title: 'Cyber Crime Precincts',
    body: 'Automated docket routing & nearest cyber financial precinct dispatch.',
    metaLeft: 'Geofenced',
    metaRight: 'All Metro Units',
  },
  {
    icon: Radio,
    badge: 'Carrier Sync',
    badgeTone: 'neutral',
    title: 'Telecom & SIM Gateway',
    body: 'Spoofed IVR tagging, unauthorized SIM-port suspension & carrier escalation.',
    metaLeft: 'Telecom Mesh',
    metaRight: 'Immediate Hold',
  },
  {
    icon: ShieldCheck,
    badge: 'SHA-256',
    badgeTone: 'neutral',
    title: 'Forensics & Judiciary',
    body: 'Tamper-proof digital evidence log & cryptographic admissibility chain.',
    metaLeft: 'Court Ready',
    metaRight: 'Encrypted Chain',
  },
] as const;

export function HomeOverviewView({
  onStartNewIncident,
  onOpenCaseInTracker,
  onOpenOfficerTriage,
  onOpenPrecincts,
}: HomeOverviewViewProps) {
  const { cases } = useFraudCases();
  const featuredCase = cases[0];

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#EFF0EC] text-[#1C1C1C]">
      {/* Urgent Golden-Hour Alert Strip */}
      <div className="mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-12 lg:pt-5">
        <div className="flex flex-col items-start justify-between gap-3 rounded-[16px] border border-[#E5484D]/20 bg-[#FBEBEB] px-4 py-3 text-[13px] sm:flex-row sm:items-center">
          <div className="flex items-start gap-2.5 text-[#93000A] sm:items-center">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#E5484D] sm:mt-0" />
            <span className="font-semibold leading-[19px]">
              Report within 24 hrs: Immediate Golden Hour Cyber Intercept &amp; Fund Freeze Desk active 24x7
            </span>
          </div>
          <button
            type="button"
            onClick={() => onStartNewIncident('Commercial Wire / BEC')}
            className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-full bg-[#B4232C] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#93000A] whitespace-nowrap shrink-0 sm:h-7 sm:w-auto"
          >
            <PhoneCall className="h-3 w-3" />
            <span>Rapid Freeze Intake</span>
          </button>
        </div>
      </div>

      {/* HERO SPLIT SECTION */}
      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Left Hero Column */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center rounded-full bg-[#E3E5DF] px-3.5 py-1 text-[11px] font-bold tracking-[0.04em] text-[#41493D] uppercase">
              Sentinel Civic Protection Network
            </span>

            <h1 className="mt-4 text-[30px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#1C1C1C] sm:mt-5 sm:text-[42px] lg:text-[50px]">
              Lost Money to Fraud?{' '}
              <span className="text-[#0B4F0B]">Report It Fast,</span> Track It Easily.
            </h1>

            <p className="mt-4 max-w-lg text-[15px] leading-[24px] text-[#41493D] sm:mt-5 sm:text-[17px] sm:leading-[26px]">
              File your complaint in minutes, get a verified tracking ID, and have it routed
              straight to your nearest cyber police unit for faster asset freeze action.
            </p>

            {/* Primary CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
              <button
                type="button"
                onClick={() => onStartNewIncident()}
                className="inline-flex h-[50px] w-full items-center justify-center rounded-full bg-[#B6F21C] px-7 text-[15px] font-bold text-[#1C1C1C] transition-all duration-150 hover:-translate-y-[1px] hover:shadow-[0_12px_24px_-6px_rgba(182,242,28,0.65)] whitespace-nowrap sm:w-auto"
              >
                File a Complaint
              </button>

              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="inline-flex h-[50px] w-full items-center justify-center gap-2.5 rounded-full border border-[#1C1C1C]/15 bg-white px-6 text-[15px] font-semibold text-[#1C1C1C] transition-colors hover:bg-[#FAFAF9] whitespace-nowrap sm:w-auto"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B4F0B] text-white">
                  <Play className="h-3 w-3 fill-current" />
                </span>
                <span>How It Works</span>
              </button>
            </div>

            {/* Fast Categorization Chips */}
            <div className="mt-8 sm:mt-9">
              <p className="text-[11px] font-bold tracking-[0.06em] text-[#717A6C] uppercase">
                Fast Categorization
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {FAST_CATEGORIES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onStartNewIncident(item.channel)}
                    className="inline-flex h-9 items-center rounded-full border border-[#1C1C1C]/10 bg-white px-3.5 text-[12px] font-semibold text-[#1C1C1C] transition-colors hover:border-[#0B4F0B] hover:bg-[#C4F25A]/30 whitespace-nowrap sm:h-8"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Hero Column: Overlapping Tilted Cards Visual Composition */}
          <div className="relative flex items-center justify-center px-1 sm:px-4 lg:col-span-6">
            {/* Top Floating Velocity Telemetry */}
            <div className="civic-card absolute left-4 top-0 z-20 hidden rounded-[16px] px-4 py-3 md:flex md:items-center md:gap-4">
              <div>
                <p className="text-[11px] font-semibold text-[#41493D]">Freezing Velocity</p>
                <p className="font-mono text-[20px] font-extrabold text-[#1C1C1C] tabular-nums">
                  14.2s
                </p>
              </div>
              <div className="flex items-end gap-1 h-7">
                <span className="w-1.5 h-3 rounded-full bg-[#C4F25A]" />
                <span className="w-1.5 h-4 rounded-full bg-[#6BC91A]" />
                <span className="w-1.5 h-6 rounded-full bg-[#B6F21C]" />
                <span className="w-1.5 h-7 rounded-full bg-[#0B4F0B]" />
              </div>
            </div>

            {/* Top-Right Status Badge */}
            <div className="civic-card absolute right-4 top-1 z-20 hidden items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-[#1C1C1C] md:inline-flex">
              <Activity className="h-3.5 w-3.5 text-[#0B4F0B]" />
              <span>Auto Intercept Active</span>
            </div>

            {/* Tilted Lime Secured Node Card + Overlapping Dark Case Card */}
            <div className="relative z-10 w-full max-w-[440px] pt-2 md:pt-16">
              <div className="mx-1 -rotate-1 sm:-rotate-2 rounded-[22px] sm:rounded-[24px] bg-gradient-to-br from-[#C4F25A] to-[#B6F21C] p-5 sm:p-6 text-[#002201] shadow-[0_18px_38px_-12px_rgba(11,79,11,0.18)]">
                <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.06em] uppercase">
                  <span>Secured Node</span>
                  <span className="rounded-full bg-[#002201]/10 px-2.5 py-0.5 font-mono">
                    PREC-01A
                  </span>
                </div>
                <p className="mt-4 text-[12px] font-semibold text-[#10520F]">
                  Flagged Mule Account
                </p>
                <p className="mt-1 font-mono text-[18px] sm:text-[20px] font-bold tracking-[0.05em] tabular-nums">
                  5337 8662 •••• 3294
                </p>
                <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-[#002201]/10 pt-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.04em]">
                    Suspect Route
                  </span>
                  <span className="rounded-[8px] bg-[#0B4F0B] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.05em] text-[#B6F21C] uppercase">
                    Lockout Applied
                  </span>
                </div>
              </div>

              {/* Overlapping Dark Forest Green Cyber Rapid Case Card */}
              {featuredCase && (
                <button
                  type="button"
                  onClick={() => onOpenCaseInTracker(featuredCase.id)}
                  className="-mt-4 sm:-mt-6 ml-auto block w-[96%] sm:w-[94%] rotate-1 sm:rotate-2 rounded-[22px] sm:rounded-[24px] bg-gradient-to-br from-[#062907] to-[#0B4F0B] p-5 sm:p-6 text-left text-white shadow-[0_24px_48px_-12px_rgba(0,34,1,0.4)] transition-transform duration-150 hover:rotate-0 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] text-[#B6F21C] uppercase">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Cyber Rapid Case
                    </span>
                    <span className="rounded-full bg-[#B6F21C]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#B6F21C]">
                      Active
                    </span>
                  </div>

                  <p className="mt-3 text-[11px] text-[#93D784]">Reported Case ID</p>
                  <p className="font-mono text-[14px] font-bold tracking-[0.03em]">
                    {featuredCase.id}
                  </p>

                  <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] text-[#93D784]">Recoverable Amount</p>
                      <p className="font-mono text-[24px] sm:text-[26px] font-extrabold leading-none text-[#B6F21C] tabular-nums">
                        {formatCurrencyUsd(featuredCase.lossAmountUsd)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[12px] font-semibold text-white whitespace-nowrap">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#B6F21C]" />
                      Cyber Dispatch Sent
                    </span>
                  </div>
                </button>
              )}

              {/* Bottom-Right Floating Verification Card */}
              <div className="civic-card ml-auto mt-3 inline-flex items-center gap-2.5 rounded-[14px] px-4 py-2.5 text-[12px]">
                <CheckCircle2 className="h-4 w-4 text-[#0B4F0B]" />
                <div>
                  <p className="font-bold text-[#1C1C1C]">Swift Intercept</p>
                  <p className="text-[11px] text-[#41493D]">Bank Node Linked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYNCHRONIZED ECOSYSTEMS 5-COLUMN GRID */}
      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-12">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex rounded-full bg-[#E3E5DF] px-3 py-1 text-[10px] font-bold tracking-[0.06em] text-[#41493D] uppercase">
              Direct API Nodes · Zero-Latency Intercept
            </span>
            <h2 className="mt-2.5 text-[22px] font-bold tracking-[-0.02em] text-[#1C1C1C] sm:text-[26px] lg:text-[28px]">
              Synchronized with National Response &amp; Banking Ecosystems
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenPrecincts}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#C4F25A]/45 px-4 text-[12px] font-bold text-[#0B4F0B] transition-colors hover:bg-[#B6F21C] whitespace-nowrap shrink-0"
          >
            <span>5 Core Grid Gateways Active</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {ECOSYSTEM_NODES.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.title}
                className="civic-card flex flex-col justify-between rounded-[20px] p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#FAFAF9] text-[#0B4F0B]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
                        node.badgeTone === 'green'
                          ? 'bg-[#C4F25A]/40 text-[#0B4F0B]'
                          : 'bg-[#FAFAF9] text-[#41493D]'
                      }`}
                    >
                      {node.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[15px] font-bold text-[#1C1C1C]">{node.title}</h3>
                  <p className="mt-1.5 text-[12px] leading-[18px] text-[#41493D]">{node.body}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#1C1C1C]/[0.06] pt-3 font-mono text-[11px] text-[#41493D]">
                  <span className="font-semibold text-[#1C1C1C]">{node.metaLeft}</span>
                  <span>{node.metaRight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-STEP FEATURE SHOWCASE */}
      <section id="how-it-works" className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-12 lg:py-12">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-[#0B4F0B] px-3 py-1 text-[11px] font-bold text-white">
              Features
            </span>
            <h2 className="mt-3 text-[26px] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#1C1C1C] sm:text-[34px] lg:text-[36px]">
              Report <span className="text-[#0B4F0B]">financial fraud</span> in minutes with
              end-to-end tracking on one <span className="text-[#0B6B78]">secure platform</span>.
            </h2>
          </div>
          <p className="text-[13px] font-medium text-[#41493D]">
            Instant notification, real-time tracking, faster recovery.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Step 01 */}
          <div className="civic-card flex flex-col justify-between rounded-[24px] p-6">
            <div>
              <p className="font-mono text-[11px] font-bold tracking-[0.05em] text-[#0B6B78] uppercase">
                Step 01 Freeze
              </p>
              <h3 className="mt-1.5 text-[18px] font-bold text-[#1C1C1C]">Immediate Fund Lock</h3>
              <p className="mt-1.5 text-[13px] leading-[19px] text-[#41493D]">
                Instantly alerts destination banks &amp; payment gateways to freeze funds.
              </p>
            </div>
            <div className="mt-5 flex flex-col items-center justify-center rounded-[16px] bg-[#C4F25A]/30 p-5 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B4F0B] text-[#B6F21C]">
                <Lock className="h-4 w-4" />
              </span>
              <span className="mt-2.5 rounded-full bg-white px-3 py-1 font-mono text-[11px] font-semibold text-[#0B4F0B]">
                Freeze Protocol Sync
              </span>
            </div>
          </div>

          {/* Step 02 */}
          <div className="civic-card flex flex-col justify-between rounded-[24px] p-6">
            <div>
              <p className="font-mono text-[11px] font-bold tracking-[0.05em] text-[#0B6B78] uppercase">
                Step 02 Intake
              </p>
              <h3 className="mt-1.5 text-[18px] font-bold text-[#1C1C1C]">Easy Guided Filing</h3>
              <p className="mt-1.5 text-[13px] leading-[19px] text-[#41493D]">
                60-second wizard auto-formats transaction IDs and proofs for admissibility.
              </p>
            </div>
            <div className="mt-5 space-y-2 rounded-[16px] bg-[#FAFAF9] p-4 text-[12px]">
              <div className="flex items-center justify-between rounded-[10px] bg-white px-3 py-2 border border-[#1C1C1C]/[0.06]">
                <span className="font-medium text-[#41493D]">Reference Verification</span>
                <CheckCircle2 className="h-4 w-4 text-[#0B4F0B]" />
              </div>
              <div className="flex items-center justify-between rounded-[10px] bg-white px-3 py-2 border border-[#1C1C1C]/[0.06]">
                <span className="font-medium text-[#41493D]">Auto Docket Draft</span>
                <span className="font-mono font-bold text-[#0B4F0B]">Ready</span>
              </div>
            </div>
          </div>

          {/* Step 03 */}
          <div className="civic-card flex flex-col justify-between rounded-[24px] p-6">
            <div>
              <p className="font-mono text-[11px] font-bold tracking-[0.05em] text-[#0B6B78] uppercase">
                Step 03 Track
              </p>
              <h3 className="mt-1.5 text-[18px] font-bold text-[#1C1C1C]">Real-Time Radar</h3>
              <p className="mt-1.5 text-[13px] leading-[19px] text-[#41493D]">
                Follow live milestone updates from gateway hold to restitution audit.
              </p>
            </div>
            <div className="mt-5 space-y-2.5 rounded-[16px] bg-[#FAFAF9] p-4 text-[12px]">
              <div className="flex items-center gap-2 font-semibold text-[#0B4F0B]">
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span>1. Intercept Acknowledged</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-[#1C1C1C]">
                <Check className="h-3.5 w-3.5 shrink-0 text-[#6BC91A]" />
                <span>2. Account Freezing Mandate</span>
              </div>
              <div className="flex items-center gap-2 text-[#717A6C]">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>3. Reversal Protocol</span>
              </div>
            </div>
          </div>

          {/* Step 04 */}
          <div className="civic-card flex flex-col justify-between rounded-[24px] p-6">
            <div>
              <p className="font-mono text-[11px] font-bold tracking-[0.05em] text-[#0B6B78] uppercase">
                Step 04 Dispatch
              </p>
              <h3 className="mt-1.5 text-[18px] font-bold text-[#1C1C1C]">Instant Police Alert</h3>
              <p className="mt-1.5 text-[13px] leading-[19px] text-[#41493D]">
                Direct geo-routing to designated Cyber Crime Cells for urgent nodal action.
              </p>
            </div>
            <div className="mt-5 rounded-[16px] bg-[#003602] p-4 text-white">
              <span className="font-mono text-[11px] font-semibold text-[#B6F21C]">
                Cyber Unit #01
              </span>
              <p className="mt-1 text-[16px] font-bold">Metro Cyber Cell</p>
              <p className="text-[11px] text-[#93D784]">Auto-assigned</p>
              <div className="mt-3 rounded-[10px] bg-[#0B4F0B] px-3 py-1.5 text-center text-[11px] font-bold text-[#B6F21C]">
                Active Officer Assigned
              </div>
            </div>
          </div>
        </div>

        {/* Correlation Engine Strip */}
        <div className="civic-card mt-5 flex flex-col items-start justify-between gap-3 rounded-[18px] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-start gap-3 sm:items-center">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C4F25A]/45 text-[#0B4F0B]">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[14px] font-bold text-[#1C1C1C]">
                Smart Mule-Account Correlation Engine
              </p>
              <p className="text-[12px] text-[#41493D]">
                Proactively links suspect accounts and wallet clusters across regional alerts to stop
                siphon loops.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[#FAFAF9] border border-[#1C1C1C]/10 px-3 py-1 font-mono text-[12px] font-semibold text-[#0B4F0B] whitespace-nowrap">
            Gemini-4 Verified Routing
          </span>
        </div>
      </section>

      {/* VIBRANT LIME FEATURE BAND */}
      <section className="bg-[#B6F21C] py-10 sm:py-14">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-12">
          {/* Dark Live Complaint Tracker Card */}
          <div className="rounded-[24px] sm:rounded-[28px] bg-[#161B16] p-5 sm:p-7 text-white shadow-[0_24px_48px_-12px_rgba(0,34,1,0.28)] lg:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <span className="text-[14px] font-bold text-white">Live Complaint Tracker</span>
              <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] font-semibold text-[#B6F21C]">
                ID: {featuredCase?.id ?? 'SC-2026-8841'}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[18px] bg-white/[0.05] p-4 sm:p-5">
              <div>
                <p className="font-mono text-[10px] font-bold tracking-[0.06em] text-[#93D784] uppercase">
                  Reported Defrauded Amount
                </p>
                <p className="mt-1 font-mono text-[26px] sm:text-[30px] font-extrabold leading-none text-white tabular-nums">
                  {formatCurrencyUsd(featuredCase?.lossAmountUsd ?? 48500)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-4 border-[#B6F21C] font-mono text-[12px] font-extrabold text-[#B6F21C] tabular-nums">
                  87%
                </div>
                <div className="text-[12px]">
                  <p className="font-bold text-white">86.77%</p>
                  <p className="text-[#93D784]">Freeze Success Rate</p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 sm:space-y-3">
              {(featuredCase?.timeline ?? []).slice(0, 4).map((node, idx) => (
                <div
                  key={node.id}
                  className="flex flex-col gap-1 rounded-[14px] bg-white/[0.04] px-3.5 py-3 text-[13px] sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold ${
                        node.state === 'completed'
                          ? 'bg-[#6BC91A] text-[#002201]'
                          : node.state === 'active'
                            ? 'bg-[#B6F21C] text-[#002201]'
                            : 'bg-white/15 text-white/70'
                      }`}
                    >
                      {node.state === 'completed' ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                    </span>
                    <span className="truncate font-semibold text-white">{node.stage}</span>
                  </div>
                  <span className="pl-9 font-mono text-[11px] text-[#93D784] tabular-nums whitespace-nowrap sm:pl-0">
                    {node.timestamp}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => featuredCase && onOpenCaseInTracker(featuredCase.id)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] border border-white/15 bg-white/[0.06] text-[13px] font-semibold text-white transition-colors hover:bg-white/[0.12]"
              >
                <FileCheck2 className="h-4 w-4" />
                <span>Inspect Docket</span>
              </button>
              <button
                type="button"
                onClick={onOpenOfficerTriage}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#B6F21C] text-[13px] font-bold text-[#1C1C1C] transition-colors hover:bg-[#c6f74a]"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Duty Officer Desk</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3 Easy Steps */}
          <div className="lg:col-span-6">
            <h2 className="text-[28px] font-extrabold leading-[1.12] tracking-[-0.03em] text-[#1C1C1C] sm:text-[36px] lg:text-[40px]">
              File and Track Your Complaint in 3 Easy Steps
            </h2>

            <div className="mt-7 space-y-6 sm:mt-8">
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1C1C1C] font-mono text-[14px] font-bold text-[#B6F21C]">
                  1
                </span>
                <div>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#1C1C1C]">
                    Report the Fraud Immediately
                  </h3>
                  <p className="mt-1 text-[14px] leading-[21px] text-[#283600]">
                    Enter incident time, transaction ID or wire trace, affected institution, and
                    upload screenshots. Our wizard formats everything cleanly for investigators.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1C1C1C] font-mono text-[14px] font-bold text-[#B6F21C]">
                  2
                </span>
                <div>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#1C1C1C]">
                    We Route to Intermediaries &amp; Police
                  </h3>
                  <p className="mt-1 text-[14px] leading-[21px] text-[#283600]">
                    Your complaint is categorized and dispatched directly to the specialized Cyber
                    Crime Unit while flagging recipient accounts for urgent freeze review.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1C1C1C] font-mono text-[14px] font-bold text-[#B6F21C]">
                  3
                </span>
                <div>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#1C1C1C]">
                    Track Every Single Update
                  </h3>
                  <p className="mt-1 text-[14px] leading-[21px] text-[#283600]">
                    Monitor live timeline updates from initial verification through bank recall
                    advisories and official investigator docket notes.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartNewIncident()}
              className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#003602] px-7 text-[15px] font-bold text-white transition-transform duration-150 hover:-translate-y-[1px] sm:w-auto"
            >
              <span>Begin Rapid Intake</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3-COLUMN METRICS BAND */}
      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-12 lg:py-12">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="civic-card rounded-[24px] p-6 lg:p-7">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.05em] text-[#41493D] uppercase">
              <span>Asset Freeze Metric</span>
              <TrendingUp className="h-4 w-4 text-[#0B4F0B]" />
            </div>
            <p className="mt-3 font-mono text-[32px] lg:text-[38px] font-extrabold leading-none tracking-[-0.03em] text-[#1C1C1C] tabular-nums">
              $148.4M
            </p>
            <p className="mt-3 text-[13px] leading-[19px] text-[#41493D]">
              Customer funds placed on judicial hold before syndicate extraction across payment
              conduits.
            </p>
          </div>

          <div className="civic-card rounded-[24px] p-6 lg:p-7">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.05em] text-[#41493D] uppercase">
              <span>Rapid Response Volume</span>
              <ShieldCheck className="h-4 w-4 text-[#0B6B78]" />
            </div>
            <p className="mt-3 font-mono text-[32px] lg:text-[38px] font-extrabold leading-none tracking-[-0.03em] text-[#1C1C1C] tabular-nums">
              32,450+
            </p>
            <p className="mt-3 text-[13px] leading-[19px] text-[#41493D]">
              Complaints systematically cataloged and routed to cyber forensic investigation units.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#B6F21C] p-6 lg:p-7 text-[#1C1C1C] shadow-[0_14px_30px_-10px_rgba(182,242,28,0.45)]">
            <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.05em] text-[#384E00] uppercase">
              <span>Average Dispatch</span>
              <Clock className="h-4 w-4 text-[#0B4F0B]" />
            </div>
            <p className="mt-3 font-mono text-[32px] lg:text-[38px] font-extrabold leading-none tracking-[-0.03em] text-[#1C1C1C] tabular-nums">
              18 Mins
            </p>
            <p className="mt-3 text-[13px] leading-[19px] text-[#283600]">
              From final citizen exhibit upload to nodal officer acknowledgment and gateway recall
              ping.
            </p>
          </div>
        </div>

        {/* GOLDEN HOUR MANDATE CALLOUT */}
        <div className="mt-8 flex flex-col justify-between gap-6 rounded-[24px] border border-[#E5484D]/15 bg-[#FBF4F3] p-6 sm:p-7 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-[0.05em] text-[#E5484D] uppercase">
              <AlertTriangle className="h-3.5 w-3.5" />
              Golden Hour Mandate
            </span>
            <h3 className="mt-1.5 text-[22px] sm:text-[24px] font-extrabold tracking-[-0.02em] text-[#1C1C1C]">
              Did the fraud happen in the last 2 hours?
            </h3>
            <p className="mt-1.5 text-[14px] leading-[21px] text-[#41493D]">
              Freezing success rates drop sharply after 120 minutes. Submit our 60-second express
              intake now to notify clearing banks and cyber divisions immediately.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center shrink-0">
            <button
              type="button"
              onClick={() => featuredCase && onOpenCaseInTracker(featuredCase.id)}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#FFE0DE] px-5 text-[13px] font-bold text-[#B4232C] transition-colors hover:bg-[#ffd0cc] whitespace-nowrap sm:w-auto"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Track Live Holds</span>
            </button>
            <button
              type="button"
              onClick={() => onStartNewIncident('Commercial Wire / BEC')}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#003602] px-6 text-[13px] font-bold text-[#B6F21C] transition-transform hover:-translate-y-[1px] whitespace-nowrap sm:w-auto"
            >
              <span>Instant Freeze Desk</span>
              <Zap className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
