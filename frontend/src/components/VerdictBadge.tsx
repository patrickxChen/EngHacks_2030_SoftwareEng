import type { VerdictLabel } from "../types";

interface VerdictBadgeProps {
  verdict: VerdictLabel;
}

const labelMap: Record<VerdictLabel, string> = {
  LIKELY_TRUE: "Likely True",
  LIKELY_FALSE: "Likely False",
  MIXED: "Mixed"
};

export function VerdictBadge({ verdict }: VerdictBadgeProps): JSX.Element {
  return (
    <span className={`verdict-badge verdict-${verdict.toLowerCase()} pulse-on-load`}>
      {labelMap[verdict]}
    </span>
  );
}
