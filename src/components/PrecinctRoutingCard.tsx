import { useState } from 'react';
import { Building2, Check, Copy, Lock } from 'lucide-react';
import { PrecinctAssignment } from '../types/fraud';

interface PrecinctRoutingCardProps {
  precinct: PrecinctAssignment;
  compact?: boolean;
}

export function PrecinctRoutingCard({ precinct, compact = false }: PrecinctRoutingCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = async () => {
    try {
      await navigator.clipboard.writeText(precinct.verificationHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="civic-card overflow-hidden rounded-[22px]">
      {/* Accent Teal Header Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B6B78] px-5 py-3.5 text-white">
        <div className="flex items-center gap-2.5 min-w-0">
          <Building2 className="h-4 w-4 shrink-0 text-[#A2EFFD]" />
          <span className="text-[12px] font-semibold tracking-[0.02em] truncate">
            {precinct.jurisdiction}
          </span>
        </div>
        <span className="font-mono text-[12px] font-semibold tracking-[0.02em] text-[#A2EFFD] tabular-nums whitespace-nowrap shrink-0">
          {precinct.code} · {precinct.dispatchId}
        </span>
      </div>

      {/* Body */}
      <div className={compact ? 'p-5 space-y-3' : 'p-6 space-y-4'}>
        <div>
          <p className="text-[12px] font-semibold text-[#41493D]">{precinct.division}</p>
          <h4 className="mt-1 text-[17px] font-bold tracking-[-0.01em] text-[#1C1C1C]">
            {precinct.name}
          </h4>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#1C1C1C]/[0.06] pt-3.5">
          <div className="flex items-center gap-2 min-w-0">
            <Lock className="h-3.5 w-3.5 shrink-0 text-[#0B4F0B]" />
            <span className="font-mono text-[12px] text-[#41493D] truncate tabular-nums">
              {precinct.verificationHash}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyHash}
            className="inline-flex h-7 items-center gap-1.5 rounded-[8px] border border-[#1C1C1C]/12 bg-[#FAFAF9] px-2.5 text-[11px] font-semibold text-[#1C1C1C] transition-colors hover:bg-[#C4F25A]/30 whitespace-nowrap shrink-0"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-[#0B4F0B]" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-[#41493D]" />
                Copy Digest
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
