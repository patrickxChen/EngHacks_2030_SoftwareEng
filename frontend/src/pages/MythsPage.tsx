import { useMemo, useState } from "react";
import { FilterBar, type MythFilters } from "../components/FilterBar";
import { MythCard } from "../components/MythCard";
import type { Myth } from "../types";

const defaultFilters: MythFilters = {
  scopeType: "",
  buildingCode: "",
  programTag: "",
  courseTag: "",
  profTag: "",
  verdict: ""
};

interface MythsPageProps {
  myths: Myth[];
  setMyths: React.Dispatch<React.SetStateAction<Myth[]>>;
}

export function MythsPage({ myths }: MythsPageProps): JSX.Element {
  const [filters, setFilters] = useState<MythFilters>(defaultFilters);

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

      {!visibleMyths.length ? (
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