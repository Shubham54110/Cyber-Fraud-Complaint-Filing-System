import { AlertTriangle, CheckCircle2, Compass, ShieldAlert, ShieldCheck } from 'lucide-react';
import { CaseStatus, UrgencyLevel } from '../types/fraud';

interface StatusPillProps {
  status: CaseStatus;
}

export function StatusPill({ status }: StatusPillProps) {
  if (status === 'Freeze Requested') {
    return (
      <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[#E5484D]/[0.12] px-3 text-[12px] font-semibold text-[#E5484D] whitespace-nowrap shrink-0">
        <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.2} />
        {status}
      </span>
    );
  }

  if (status === 'Resolved' || status === 'Intake Verified') {
    return (
      <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[#C4F25A]/35 px-3 text-[12px] font-semibold text-[#0B4F0B] whitespace-nowrap shrink-0">
        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.2} />
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[#0B6B78]/[0.13] px-3 text-[12px] font-semibold text-[#0B6B78] whitespace-nowrap shrink-0">
      {status === 'Routed to Precinct' ? (
        <Compass className="h-3.5 w-3.5" strokeWidth={2.2} />
      ) : (
        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
      )}
      {status}
    </span>
  );
}

interface UrgencyLabelProps {
  urgency: UrgencyLevel;
}

export function UrgencyLabel({ urgency }: UrgencyLabelProps) {
  if (urgency === 'Critical — Freeze Window') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#E5484D] whitespace-nowrap">
        <ShieldAlert className="h-3.5 w-3.5" strokeWidth={2.2} />
        Critical Freeze Window
      </span>
    );
  }
  if (urgency === 'Elevated') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0B6B78] whitespace-nowrap">
        Elevated Priority
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#41493D] whitespace-nowrap">
      Standard Queue
    </span>
  );
}
