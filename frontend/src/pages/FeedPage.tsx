import { useEffect, useRef, useState } from "react";
import { PostCard } from "../components/PostCard";
import { templateMyths } from "../data/mockData";
import { fetchMyths } from "../lib/api";
import type { Myth } from "../types";

export function FeedPage(): JSX.Element {
  const [myths, setMyths] = useState<Myth[]>(templateMyths);
  const [activeIndex, setActiveIndex] = useState(0);
  const [endReached, setEndReached] = useState(false);
  const lastWheelStepAtRef = useRef(0);

  useEffect(() => {
    let active = true;

    const run = async (): Promise<void> => {
      try {
        const rows = await fetchMyths({ limit: 24 });
        if (active) {
          setMyths(rows.length ? rows : templateMyths);
        }
      } catch {
        if (active) {
          setMyths(templateMyths);
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!myths.length) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((prev) => Math.min(prev, myths.length - 1));
  }, [myths]);

  const moveFeed = (delta: 1 | -1): void => {
    if (!myths.length) {
      return;
    }

    setActiveIndex((prev) => {
      const next = prev + delta;

      if (next < 0) {
        setEndReached(false);
        return 0;
      }

      if (next >= myths.length) {
        setEndReached(true);
        return myths.length - 1;
      }

      setEndReached(false);
      return next;
    });
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>): void => {
    if (myths.length <= 1) {
      return;
    }

    if (event.deltaY === 0) {
      return;
    }

    event.preventDefault();
    const now = Date.now();
    // Trackpad momentum can emit many wheel events; throttle to a single feed step.
    if (now - lastWheelStepAtRef.current < 750) {
      return;
    }
    lastWheelStepAtRef.current = now;

    moveFeed(event.deltaY > 0 ? 1 : -1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "ArrowDown" || event.key === "PageDown" || event.key.toLowerCase() === "j") {
      event.preventDefault();
      moveFeed(1);
      return;
    }

    if (event.key === "ArrowUp" || event.key === "PageUp" || event.key.toLowerCase() === "k") {
      event.preventDefault();
      moveFeed(-1);
    }
  };

  const currentMyth = myths[activeIndex] ?? null;
  const atStart = activeIndex === 0;
  const atEnd = myths.length > 0 && activeIndex === myths.length - 1;

  return (
    <section className="page-enter feed-page">
      <header className="feed-head">
        <p className="brand-kicker">Feed</p>
        <h2>Myth stream</h2>
        <p className="muted-text">One post at a time. Scroll to move next or previous.</p>
      </header>

      <div className="feed-stage">
        <div
          className="feed-scroll"
          aria-label="Myth feed"
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {currentMyth ? (
            <article key={currentMyth.id} className="feed-item feed-item-single">
              <PostCard myth={currentMyth} />
            </article>
          ) : (
            <div className="empty-state">No posts available yet.</div>
          )}
        </div>

        <aside className="feed-controls" aria-label="Feed navigation controls">
          <button
            type="button"
            className="feed-nav-btn"
            onClick={() => moveFeed(-1)}
            disabled={atStart}
            aria-label="Previous post"
          >
            ↑
          </button>
          <button
            type="button"
            className="feed-nav-btn"
            onClick={() => moveFeed(1)}
            disabled={atEnd}
            aria-label="Next post"
          >
            ↓
          </button>
        </aside>
      </div>

      {(atEnd || endReached) && myths.length ? (
        <p className="feed-end-indicator">You reached the end of the feed.</p>
      ) : null}
    </section>
  );
}