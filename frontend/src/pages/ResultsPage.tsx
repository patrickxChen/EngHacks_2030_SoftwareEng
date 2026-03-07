import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { myths } from "../data/mockData";

export function ResultsPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) {
      return myths;
    }

    return myths.filter((myth) => {
      const source = [myth.text, myth.buildingCode, myth.courseTag ?? "", myth.programTag ?? ""]
        .join(" ")
        .toLowerCase();
      return source.includes(query);
    });
  }, [query]);

  return (
    <section className="page-enter">
      <div className="results-head">
        <h2>Results {query ? `for "${query}"` : ""}</h2>
        <Link to="/" className="btn">
          Back Home
        </Link>
      </div>

      {results.length ? (
        <div className="results-grid">
          {results.map((myth) => (
            <PostCard key={myth.id} myth={myth} />
          ))}
        </div>
      ) : (
        <p className="empty-state">No myths match that search. Try course code or building.</p>
      )}
    </section>
  );
}