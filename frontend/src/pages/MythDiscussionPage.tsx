import { useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { BuildingBadge } from "../components/BuildingBadge";
import { TestimonialList } from "../components/TestimonialList";
import { VoteWidget } from "../components/VoteWidget";
import { templateMyths } from "../data/mockData";
import { addTestimonial } from "../lib/api";
import type { Myth } from "../types";

interface MythDiscussionPageProps {
  myths: Myth[];
  setMyths: React.Dispatch<React.SetStateAction<Myth[]>>;
}

export function MythDiscussionPage({ myths, setMyths }: MythDiscussionPageProps): JSX.Element {
  const { mythId = "" } = useParams();
  const [commentText, setCommentText] = useState("");
  const [commentVote, setCommentVote] = useState<"true" | "false">("true");
  const [commenting, setCommenting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Find myth from shared state instead of fetching
  const myth = useMemo(() => {
    const found = myths.find((entry) => entry.id === mythId);
    return found ?? templateMyths.find((entry) => entry.id === mythId) ?? null;
  }, [myths, mythId]);

  const commentError = useMemo(() => {
    if (!commentText.trim()) return "Comment text is required.";
    if (commentText.trim().length < 6) return "Comment should be at least 6 characters.";
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
      const isTemplateMyth = myth.id.startsWith("tmpl-");
      if (!isTemplateMyth) {
        await addTestimonial(myth.id, {
          buildingCode: myth.buildingCode,
          text: commentText.trim(),
          voteValue: commentVote === "true" ? 1 : -1
        });
      }

      const nextVoteValue: 1 | -1 = commentVote === "true" ? 1 : -1;
      const wasUp = commentVote === "true";

      const nextTestimonial = {
        id: `local-${Date.now()}`,
        userName: "You",
        buildingCode: myth.buildingCode,
        text: commentText.trim(),
        voteValue: nextVoteValue,
        createdAt: new Date().toISOString()
      };

      // Update shared myths state so HomePage and MythsPage stay in sync
      setMyths((prev) =>
        prev.map((m) =>
          m.id === myth.id
            ? {
                ...m,
                votesUp: m.votesUp + (wasUp ? 1 : 0),
                votesDown: m.votesDown + (wasUp ? 0 : 1),
                testimonialCount: m.testimonialCount + 1,
                testimonials: [nextTestimonial, ...m.testimonials]
              }
            : m
        )
      );

      setCommentText("");
      setCommentVote("true");
      setMessage(isTemplateMyth ? "Comment added to example myth." : "Comment added.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to add comment.");
    } finally {
      setCommenting(false);
    }
  };

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
      <VoteWidget
        mythId={myth.id}
        initialUp={myth.votesUp}
        initialDown={myth.votesDown}
        onVote={(upDelta, downDelta) => {
          setMyths((prev) =>
            prev.map((m) =>
              m.id === myth.id
                ? { ...m, votesUp: m.votesUp + upDelta, votesDown: m.votesDown + downDelta }
                : m
            )
          );
        }}
      />

      <section className="comments-panel">
        <div className="comments-head">
          <h3>Comments</h3>
          <span className="comments-count">{myth.testimonialCount}</span>
        </div>
        <TestimonialList testimonials={myth.testimonials} />
      </section>

      <form className="myth-form" onSubmit={(event) => void handleCommentSubmit(event)}>
        <label>
          Your vote
          <select
            value={commentVote}
            onChange={(event) => setCommentVote(event.target.value as "true" | "false")}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>
        <label>
          Rationale
          <textarea
            rows={3}
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Explain why you voted true or false..."
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