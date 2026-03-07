import { useMemo, useState } from "react";
import { FilterBar, type MythFilters } from "../components/FilterBar";
import { MythCard } from "../components/MythCard";
import { myths } from "../data/mockData";

const defaultFilters: MythFilters = {
  buildingCode: "",
  programTag: "",
  courseTag: "",
  verdict: ""
};

export function MythsPage(): JSX.Element {
  const [filters, setFilters] = useState<MythFilters>(defaultFilters);

  const filtered = useMemo(
    () =>
      myths.filter((myth) => {
        const byBuilding = !filters.buildingCode || myth.buildingCode === filters.buildingCode;
        const byProgram =
          !filters.programTag ||
          (myth.programTag ?? "").toLowerCase().includes(filters.programTag.toLowerCase());
        const byCourse =
          !filters.courseTag ||
          (myth.courseTag ?? "").toLowerCase().includes(filters.courseTag.toLowerCase());
        const byVerdict = !filters.verdict || myth.verdictLabel === filters.verdict;
        return byBuilding && byProgram && byCourse && byVerdict;
      }),
    [filters]
  );

  return (
    <section className="page-enter">
      <h2>Myth Feed</h2>
      <FilterBar filters={filters} onChange={setFilters} />

      {!filtered.length ? (
        <p className="empty-state">No myths yet in this building. Be the first.</p>
      ) : (
        <div className="myth-grid">
          {filtered.map((myth, index) => (
            <MythCard key={myth.id} myth={myth} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
