import { useEffect, useMemo, useState } from "react";
import { FilterBar, type MythFilters } from "../components/FilterBar";
import { MythCard } from "../components/MythCard";
import { templateMyths } from "../data/mockData";
import { fetchMyths } from "../lib/api";
import type { Myth } from "../types";

const defaultFilters: MythFilters = {
  scopeType: "",
  buildingCode: "",
  programTag: "",
  courseTag: "",
  profTag: "",
  verdict: ""
};

export function MythsPage(): JSX.Element {
  const [filters, setFilters] = useState<MythFilters>(defaultFilters);
  const [myths, setMyths] = useState<Myth[]>(templateMyths);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const run = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");
        const rows = await fetchMyths({
          scopeType: filters.scopeType || undefined,
          buildingCode: filters.buildingCode,
          programTag: filters.programTag,
          courseTag: filters.courseTag,
          profTag: filters.profTag,
          verdict: filters.verdict
        });

        if (active) {
          setMyths(rows.length ? rows : templateMyths);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load myths.");
          setMyths(templateMyths);
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

  const visibleMyths = useMemo(() => {
    return myths.filter((myth) => {
      const matchesScope = filters.scopeType ? myth.scopeType === filters.scopeType : true;
      const matchesBuilding = filters.buildingCode
        ? myth.buildingCode.toLowerCase().includes(filters.buildingCode.toLowerCase())
        : true;
      const matchesProgram = filters.programTag
        ? (myth.programTag ?? "").toLowerCase().includes(filters.programTag.toLowerCase())
        : true;
      const matchesCourse = filters.courseTag
        ? (myth.courseTag ?? "").toLowerCase().includes(filters.courseTag.toLowerCase())
        : true;
      const matchesProf = filters.profTag
        ? (myth.profTag ?? "").toLowerCase().includes(filters.profTag.toLowerCase())
        : true;
      const matchesVerdict = filters.verdict ? myth.verdictLabel === filters.verdict : true;

      return (
        matchesScope &&
        matchesBuilding &&
        matchesProgram &&
        matchesCourse &&
        matchesProf &&
        matchesVerdict
      );
    });
  }, [filters, myths]);

  return (
    <section className="page-enter search-page">
      <h2>Myth Feed</h2>
      <FilterBar filters={filters} onChange={setFilters} />

      {loading ? <p className="muted-text">Loading myths...</p> : null}
      {error && !visibleMyths.length ? <p className="form-error">{error}</p> : null}

      {!loading && !visibleMyths.length ? (
        <p className="empty-state">No myths yet in this building. Be the first.</p>
      ) : (
        <div className="myth-grid">
          {visibleMyths.map((myth, index) => (
            <MythCard key={myth.id} myth={myth} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
