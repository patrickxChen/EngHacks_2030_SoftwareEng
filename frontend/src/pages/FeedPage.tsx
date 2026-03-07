import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BuildingBadge } from "../components/BuildingBadge";
import { templateMyths } from "../data/mockData";
import { castVote, fetchMyths } from "../lib/api";
import type { Myth } from "../types";

type FeedAction = "true" | "false" | "unsure";

export function FeedPage(): JSX.Element {
  const [myths, setMyths] = useState<Myth[]>([]);
  const [index, setIndex] = useState(0);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Swipe-style mode: vote fast, skip fast.");

  useEffect(() => {
    let active = true;

    const run = async (): Promise<void> => {
      setLoading(true);
      try {
        const rows = await fetchMyths({ limit: 60 });
        if (!active) {
          return;
        }

        setMyths(rows.length ? rows : templateMyths);
      } catch {
        if (!active) {
          return;
        }

        setMyths(templateMyths);
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
  }, []);

  const current = myths[index] ?? null;

  const advance = (): void => {
    setIndex((prev) => Math.min(prev + 1, myths.length));
  };

  const handleAction = async (action: FeedAction): Promise<void> => {
    if (!current || pending) {
      return;
    }

    if (action === "unsure") {
      setMessage("Skipped. Next myth loaded.");
      advance();
      return;
    }

    const isTemplate = current.id.startsWith("tmpl-");

    try {
      setPending(true);
      if (!isTemplate) {
        await castVote(current.id, action === "true" ? 1 : -1);
      }
      setMessage(action === "true" ? "Marked as True." : "Marked as False.");
      advance();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Vote failed.");
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        void handleAction("true");
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        void handleAction("false");
        return;
      }

      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        void handleAction("unsure");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleAction]);

  if (loading) {
    return (
      <section className="feed-page page-enter">
        <p className="muted-text">Loading feed...</p>
      </section>
    );
  }

  if (!current) {
    return (
      <section className="feed-page page-enter">
        <article className="feed-end-state">
          <p className="brand-kicker">Ghost Reels</p>
          <h2>No more feed</h2>
          <p className="muted-text">You reached the end. Come back later for fresh myths.</p>
          <div className="feed-end-actions">
            <button type="button" className="btn" onClick={() => setIndex(0)}>
              Watch again
            </button>
            <Link className="btn ghost-btn" to="/search">
              Browse Search
            </Link>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="feed-page page-enter">
      <div className="feed-topline" aria-hidden="true">
        <span>Ghost Reels</span>
        <span>Swipe to decide</span>
      </div>

      <article className="feed-card">
        <header className="feed-card-head">
          <BuildingBadge buildingCode={current.buildingCode} />
          <code>{current.profTag ?? current.courseTag ?? current.scopeKey ?? "General"}</code>
        </header>

        <p className="feed-text">{current.text}</p>

        <div className="feed-actions" role="group" aria-label="Vote actions">
          <button
            type="button"
            className="btn feed-action-true"
            onClick={() => void handleAction("true")}
            disabled={pending}
          >
            <strong>True</strong>
          </button>
          <button
            type="button"
            className="btn feed-action-skip"
            onClick={() => void handleAction("unsure")}
            disabled={pending}
          >
            <strong>Skip</strong>
          </button>
          <button
            type="button"
            className="btn feed-action-false"
            onClick={() => void handleAction("false")}
            disabled={pending}
          >
            <strong>False</strong>
          </button>
        </div>

        <div className="feed-footer">
          <p className="muted-text">{message}</p>
          <Link className="btn" to={`/myth/${current.id}`}>
            Open discussion
          </Link>
        </div>
      </article>
    </section>
  );
}
