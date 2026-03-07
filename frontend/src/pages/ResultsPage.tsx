import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { fetchMyths } from "../lib/api";
import type { Myth } from "../types";

export function ResultsPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const [results, setResults] = useState<Myth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const run = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");
        const myths = await fetchMyths({ q: query });
        if (active) {
          setResults(myths);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load results.");
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
  }, [query]);

  return (
    <section className="page-enter">
      <div className="results-head">
        <h2>Results {query ? `for "${query}"` : ""}</h2>
          <Link to="/home" className="btn">
          Back Home
        </Link>
      </div>

      {loading ? <p className="muted-text">Loading results...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      {!loading && !error && results.length ? (
        <div className="results-grid">
          {results.map((myth) => (
            <PostCard key={myth.id} myth={myth} />
          ))}
        </div>
      ) : !loading && !error ? (
        <p className="empty-state">No myths match that search. Try course code or building.</p>
      ) : null}
    </section>
  );
}