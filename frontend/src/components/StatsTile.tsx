interface StatsTileProps {
  label: string;
  value: string;
  helper: string;
}

export function StatsTile({ label, value, helper }: StatsTileProps): JSX.Element {
  return (
    <article className="stats-tile">
      <p className="stats-label">{label}</p>
      <p className="stats-value">{value}</p>
      <p className="stats-helper">{helper}</p>
    </article>
  );
}
