import { buildings } from "../data/buildings";

export interface MythFilters {
  scopeType: "" | "course" | "prof" | "building";
  buildingCode: string;
  programTag: string;
  courseTag: string;
  profTag: string;
  verdict: string;
}

interface FilterBarProps {
  filters: MythFilters;
  onChange: (next: MythFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps): JSX.Element {
  return (
    <section className="filter-bar" aria-label="Myth filters">
      <label>
        Type
        <select
          value={filters.scopeType}
          onChange={(event) =>
            onChange({ ...filters, scopeType: event.target.value as MythFilters["scopeType"] })
          }
        >
          <option value="">All</option>
          <option value="course">Course</option>
          <option value="prof">Professor</option>
          <option value="building">Building</option>
        </select>
      </label>

      <label>
        Building
        <select
          value={filters.buildingCode}
          onChange={(event) => onChange({ ...filters, buildingCode: event.target.value })}
        >
          <option value="">All</option>
          {buildings.map((building) => (
            <option key={building} value={building}>
              {building}
            </option>
          ))}
        </select>
      </label>

      <label>
        Program
        <input
          placeholder="ECE, SE, ME..."
          value={filters.programTag}
          onChange={(event) => onChange({ ...filters, programTag: event.target.value })}
        />
      </label>

      <label>
        Course
        <input
          placeholder="ECE 198"
          value={filters.courseTag}
          onChange={(event) => onChange({ ...filters, courseTag: event.target.value })}
        />
      </label>

      <label>
        Professor
        <input
          placeholder="Prof. Name"
          value={filters.profTag}
          onChange={(event) => onChange({ ...filters, profTag: event.target.value })}
        />
      </label>

      <label>
        Verdict
        <select
          value={filters.verdict}
          onChange={(event) => onChange({ ...filters, verdict: event.target.value })}
        >
          <option value="">All</option>
          <option value="LIKELY_TRUE">Likely True</option>
          <option value="LIKELY_FALSE">Likely False</option>
          <option value="MIXED">Mixed</option>
        </select>
      </label>
    </section>
  );
}