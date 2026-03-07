import type { Myth } from "../types";
import { BuildingBadge } from "./BuildingBadge";
import { VerdictBadge } from "./VerdictBadge";

interface PostCardProps {
  myth: Myth;
}

export function PostCard({ myth }: PostCardProps): JSX.Element {
  const firstReply = myth.testimonials[0];

  return (
    <article className="post-card">
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

      <div className="post-actions">
        <button type="button" className="vote-btn vote-icon-btn" aria-label="Upvote post">
          ↗
        </button>
        <button type="button" className="vote-btn vote-icon-btn" aria-label="Downvote post">
          ↘
        </button>
        <button type="button" className="vote-btn">
          Reply
        </button>
      </div>

      {firstReply ? (
        <section className="post-reply-preview">
          <b>{firstReply.userName}</b>
          <p>{firstReply.text}</p>
        </section>
      ) : null}
    </article>
  );
}