import { useMemo, useState } from "react";
import { buildingStats } from "../data/mockData";

type Metric = "submissions" | "truth" | "humor";

export function MapPage(): JSX.Element {
  const [metric, setMetric] = useState<Metric>("submissions");
  const [selectedBuilding, setSelectedBuilding] = useState<string>(buildingStats[0].buildingCode);

  const selected = useMemo(
    () => buildingStats.find((entry) => entry.buildingCode === selectedBuilding) ?? buildingStats[0],
    [selectedBuilding]
  );

  const metricValue = useMemo(() => {
    if (metric === "submissions") {
      return String(selected.submissionCount);
    }
    if (metric === "truth") {
      return `${Math.round((selected.likelyTrueCount / selected.submissionCount) * 100)}%`;
    }
    return selected.avgHumorScore.toFixed(1);
  }, [metric, selected]);

  return (
    <section className="page-enter">
      <h2>Building Map</h2>
      <div className="metric-toggle" role="group" aria-label="Map metric selector">
        <button
          type="button"
          className={metric === "submissions" ? "btn btn-primary" : "btn"}
          onClick={() => setMetric("submissions")}
        >
          Submission Count
        </button>
        <button
          type="button"
          className={metric === "truth" ? "btn btn-primary" : "btn"}
          onClick={() => setMetric("truth")}
        >
          True Myth Count
        </button>
        <button
          type="button"
          className={metric === "humor" ? "btn btn-primary" : "btn"}
          onClick={() => setMetric("humor")}
        >
          Humor Score
        </button>
      </div>

      <div className="map-layout">
        <div className="map-grid" role="list" aria-label="UW engineering building map">
          {buildingStats.map((entry) => (
            <button
              key={entry.buildingCode}
              className={
                entry.buildingCode === selectedBuilding ? "map-building map-active" : "map-building"
              }
              onClick={() => setSelectedBuilding(entry.buildingCode)}
              type="button"
            >
              <strong>{entry.buildingCode}</strong>
              <span>{entry.submissionCount} myths</span>
            </button>
          ))}
        </div>

        <aside className="map-tooltip">
          <h3>{selected.buildingCode}</h3>
          <p>
            Selected metric: <b>{metric}</b>
          </p>
          <p className="metric-number">{metricValue}</p>
          <p>Top myth: "E7 labs always take 6 hours"</p>
        </aside>
      </div>
    </section>
  );
}
