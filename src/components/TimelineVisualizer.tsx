import { Check } from 'lucide-react';
import { TimelineNode } from '../types/fraud';

interface TimelineVisualizerProps {
  nodes: TimelineNode[];
}

export function TimelineVisualizer({ nodes }: TimelineVisualizerProps) {
  return (
    <div className="relative space-y-6">
      {nodes.map((node, index) => {
        const isLast = index === nodes.length - 1;
        const isCompleted = node.state === 'completed';
        const isActive = node.state === 'active';

        return (
          <div key={node.id} className="relative flex gap-4">
            {/* Vertical Connecting Rail */}
            {!isLast && (
              <span
                aria-hidden="true"
                className={`absolute left-[11px] top-6 bottom-[-24px] w-[2px] ${
                  isCompleted
                    ? 'bg-[#6BC91A]'
                    : isActive
                      ? 'bg-gradient-to-b from-[#B6F21C] to-[#1C1C1C]/12'
                      : 'bg-[#1C1C1C]/10'
                }`}
              />
            )}

            {/* Node Indicator */}
            <div className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
              {isCompleted && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#6BC91A] bg-white text-[#0B4F0B]">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
                </span>
              )}
              {isActive && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B6F21C] ring-4 ring-[#B6F21C]/40 border border-[#0B4F0B]/25">
                  <span className="h-2 w-2 rounded-full bg-[#0B4F0B]" />
                </span>
              )}
              {node.state === 'upcoming' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#1C1C1C]/20 bg-[#FAFAF9]" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h5
                  className={`text-[15px] font-semibold tracking-[-0.01em] ${
                    node.state === 'upcoming' ? 'text-[#717A6C]' : 'text-[#1C1C1C]'
                  }`}
                >
                  {node.stage}
                </h5>
                <span className="font-mono text-[12px] font-medium text-[#41493D] tabular-nums whitespace-nowrap">
                  {node.timestamp}
                </span>
              </div>
              <p
                className={`mt-1 text-[13px] leading-[19px] ${
                  node.state === 'upcoming' ? 'text-[#717A6C]' : 'text-[#41493D]'
                }`}
              >
                {node.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
