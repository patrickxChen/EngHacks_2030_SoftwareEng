import { useNavigate } from "react-router-dom";
import type { Myth } from "../types";
import { BuildingBadge } from "./BuildingBadge";
import { VerdictBadge } from "./VerdictBadge";

interface PostCardProps {
  myth: Myth;
}

export function PostCard({ myth }: PostCardProps): JSX.Element {
  const navigate = useNavigate();
  const firstReply = myth.testimonials[0];

  return (
    <article
      className="post-card post-card-clickable"
      onClick={() => navigate(`/myth/${myth.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/myth/${myth.id}`);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Open myth discussion"
    >
      <header className="post-card-head">
        <p className="post-title">{myth.text}</p>
        <button type="button" className="menu-dot-btn" aria-label="Open post actions">
          ...
        </button>
      </header>

      <div className="post-meta-row">
        <span>John Waterloo</span>
        <code>{myth.courseTag ?? "GEN 101"}</code>
      </div>

      <p className="post-excerpt">{myth.verdictReason}</p>

      <div className="post-badges">
        <BuildingBadge buildingCode={myth.buildingCode} />
        <VerdictBadge verdict={myth.verdictLabel} />
      </div>

      <p className="muted-text">Open this myth to vote and join discussion.</p>

      {firstReply ? (
        <section className="post-reply-preview">
          <b>{firstReply.userName}</b>
          <p>{firstReply.text}</p>
        </section>
      ) : null}
    </article>
  );
}