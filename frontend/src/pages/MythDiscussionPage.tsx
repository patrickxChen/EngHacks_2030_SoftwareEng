import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { BuildingBadge } from "../components/BuildingBadge";
import { TestimonialList } from "../components/TestimonialList";
import { VoteWidget } from "../components/VoteWidget";
import { templateMyths } from "../data/mockData";
import { addTestimonial, fetchMyths } from "../lib/api";
import type { Myth } from "../types";

export function MythDiscussionPage(): JSX.Element {
  const { mythId = "" } = useParams();
  const [myth, setMyth] = useState<Myth | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const run = async (): Promise<void> => {
      setLoading(true);
      setError("");

      try {
        const rows = await fetchMyths({ limit: 100 });
        const merged = [...templateMyths, ...rows];
        const match = merged.find((entry) => entry.id === mythId) ?? null;

        if (active) {
          setMyth(match);
        }
      } catch {
        const match = templateMyths.find((entry) => entry.id === mythId) ?? null;
        if (active) {
          setMyth(match);
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
  }, [mythId]);

  const commentError = useMemo(() => {
    if (!commentText.trim()) {
      return "Comment text is required.";
    }
    if (commentText.trim().length < 6) {
      return "Comment should be at least 6 characters.";
    }
    return "";
  }, [commentText]);

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!myth || commentError) {
      setError(commentError || "Myth is unavailable.");
      return;
    }

    try {
      setCommenting(true);
      await addTestimonial(myth.id, {
        buildingCode: myth.buildingCode,
        text: commentText.trim()
      });

      const nextTestimonial = {
        id: `local-${Date.now()}`,
        userName: "You",
        buildingCode: myth.buildingCode,
        text: commentText.trim(),
        createdAt: new Date().toISOString()
      };

      setMyth({
        ...myth,
        testimonialCount: myth.testimonialCount + 1,
        testimonials: [nextTestimonial, ...myth.testimonials]
      });
      setCommentText("");
      setMessage("Comment added.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to add comment.");
    } finally {
      setCommenting(false);
    }
  };

  if (loading) {
    return <section className="page-enter"><p className="muted-text">Loading discussion...</p></section>;
  }

  if (!myth) {
    return (
      <section className="page-enter">
        <p className="form-error">This myth could not be found.</p>
        <Link to="/search" className="btn">Back to Search</Link>
      </section>
    );
  }

  return (
    <section className="page-enter discussion-panel">
      <div className="results-head">
        <h2>Myth Discussion</h2>
        <Link to="/search" className="btn">Back to Search</Link>
      </div>

      <div className="discussion-head">
        <BuildingBadge buildingCode={myth.buildingCode} />
        <code>{myth.scopeKey || myth.courseTag || myth.profTag || "General"}</code>
      </div>

      <p className="myth-text">{myth.text}</p>
      <VoteWidget mythId={myth.id} initialUp={myth.votesUp} initialDown={myth.votesDown} />

      <section>
        <h3>Comments</h3>
        <TestimonialList testimonials={myth.testimonials} />
      </section>

      <form className="myth-form" onSubmit={(event) => void handleCommentSubmit(event)}>
        <label>
          Add a comment
          <textarea
            rows={3}
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Share your experience or counterexample..."
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        {message ? <p className="muted-text">{message}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={commenting}>
          {commenting ? "Posting..." : "Post comment"}
        </button>
      </form>
    </section>
  );
}
