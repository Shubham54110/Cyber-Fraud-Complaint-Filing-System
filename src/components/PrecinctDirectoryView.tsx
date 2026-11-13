import { ArrowRight, Building2, Mail, UserCheck } from 'lucide-react';
import { useFraudCases } from '../context/FraudCaseContext';
import { PRECINCT_DIRECTORY, formatCurrencyUsd } from '../data/seedCases';

interface PrecinctDirectoryViewProps {
  onRouteNewReportToPrecinct: (precinctCode: string) => void;
}

export function PrecinctDirectoryView({
  onRouteNewReportToPrecinct,
}: PrecinctDirectoryViewProps) {
  const { cases } = useFraudCases();

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-[13px] font-semibold text-[#0B6B78]">
          Regional Cybercrime & Financial Fraud Divisions
        </p>
        <h1 className="mt-1.5 text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#1C1C1C] sm:text-[36px]">
          Specialized Precinct Routing Directory
        </h1>
        <p className="mt-2.5 text-[15px] leading-[23px] text-[#41493D]">
          Each incoming citizen report is matched automatically to the division equipped to freeze
          funds, issue clearinghouse recalls, or trace on-chain transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {PRECINCT_DIRECTORY.map((precinct) => {
          const unitCases = cases.filter((c) => c.precinct.code === precinct.code);
          const openCount = unitCases.filter((c) => c.status !== 'Resolved').length;
          const volume = unitCases.reduce((sum, c) => sum + c.lossAmountUsd, 0);

          return (
            <article key={precinct.code} className="civic-card flex flex-col justify-between overflow-hidden rounded-[24px]">
              <div>
                <div className="flex items-center justify-between gap-3 bg-[#0B6B78] px-6 py-3.5 text-white">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#A2EFFD]" />
                    <span className="font-mono text-[13px] font-bold">{precinct.code}</span>
                  </div>
                  <span className="font-mono text-[12px] text-[#A2EFFD] tabular-nums">
                    {precinct.slaWindow}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-[12px] font-semibold text-[#41493D]">{precinct.division}</p>
                    <h2 className="mt-1 text-[19px] font-bold leading-[25px] tracking-[-0.01em] text-[#1C1C1C]">
                      {precinct.name}
                    </h2>
                    <p className="mt-1.5 text-[13px] text-[#41493D]">{precinct.jurisdiction}</p>
                  </div>

                  <div className="border-t border-[#1C1C1C]/[0.06] pt-3.5 text-[13px] text-[#41493D] space-y-1.5">
                    <p>
                      <span className="font-semibold text-[#1C1C1C]">Focus:</span>{' '}
                      {precinct.specialties.join(' · ')}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-[#0B4F0B]" />
                      <span>{precinct.leadCommander}</span>
                    </p>
                    <p className="flex items-center gap-1.5 font-mono text-[12px]">
                      <Mail className="h-3.5 w-3.5 text-[#0B6B78]" />
                      <span>{precinct.contactDesk}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-[#1C1C1C]/[0.06] pt-4">
                    <div>
                      <span className="text-[11px] font-semibold text-[#41493D]">Open Queue</span>
                      <p className="mt-0.5 font-mono text-[20px] font-bold text-[#1C1C1C] tabular-nums">
                        {openCount}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-[#41493D]">Tracked Volume</span>
                      <p className="mt-0.5 font-mono text-[20px] font-bold text-[#0B4F0B] tabular-nums">
                        {formatCurrencyUsd(volume)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => onRouteNewReportToPrecinct(precinct.code)}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[14px] border border-[#1C1C1C]/15 bg-[#FAFAF9] text-[13px] font-semibold text-[#1C1C1C] transition-colors hover:bg-[#B6F21C] hover:border-[#B6F21C]"
                >
                  <span>Route New Report Here</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
