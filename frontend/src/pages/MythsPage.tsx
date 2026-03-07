import { useEffect, useState } from "react";
import { FilterBar, type MythFilters } from "../components/FilterBar";
import { MythCard } from "../components/MythCard";
import { fetchMyths } from "../lib/api";
import type { Myth } from "../types";

const defaultFilters: MythFilters = {
  buildingCode: "",
  programTag: "",
  courseTag: "",
  verdict: ""
};

export function MythsPage(): JSX.Element {
  const [filters, setFilters] = useState<MythFilters>(defaultFilters);
  const [myths, setMyths] = useState<Myth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const run = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");
        const rows = await fetchMyths({
          buildingCode: filters.buildingCode,
          programTag: filters.programTag,
          courseTag: filters.courseTag,
          verdict: filters.verdict
        });

        if (active) {
          setMyths(rows);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load myths.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [filters]);

  return (
    <section className="page-enter">
      <h2>Myth Feed</h2>
      <FilterBar filters={filters} onChange={setFilters} />

      {loading ? <p className="muted-text">Loading myths...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      {!loading && !error && !myths.length ? (
        <p className="empty-state">No myths yet in this building. Be the first.</p>
      ) : (
        <div className="myth-grid">
          {myths.map((myth, index) => (
            <MythCard key={myth.id} myth={myth} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
