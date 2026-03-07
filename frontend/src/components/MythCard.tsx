import { useNavigate } from "react-router-dom";
import type { Myth } from "../types";
import { BuildingBadge } from "./BuildingBadge";
import { VoteWidget } from "./VoteWidget";

interface MythCardProps {
  myth: Myth;
  index?: number;
}

export function MythCard({ myth, index = 0 }: MythCardProps): JSX.Element {
  const navigate = useNavigate();
  const totalVotes = myth.votesUp + myth.votesDown;
  const mythRate = totalVotes ? Math.round((myth.votesDown / totalVotes) * 100) : 50;
  const isMythBusted = mythRate > 90;
  const isNotMyth = mythRate <= 10;
  const typeLabel =
    myth.scopeType === "prof" ? "Professor" : myth.scopeType === "course" ? "Course" : "Building";
  const typeValue = myth.profTag ?? myth.courseTag ?? myth.scopeKey ?? "General";

  return (
    <article
      className="myth-card myth-card-clickable stagger-item"
      style={{ animationDelay: `${index * 70}ms` }}
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
      <div
        className={
          isMythBusted
            ? "myth-rate-overlay myth-rate-overlay-busted"
            : isNotMyth
              ? "myth-rate-overlay myth-rate-overlay-not-myth"
              : "myth-rate-overlay"
        }
        aria-label={
          isMythBusted
            ? `Myth busted at ${mythRate}%`
            : isNotMyth
              ? `Not a myth at ${mythRate}%`
              : `Myth rate ${mythRate}%`
        }
      >
        {isMythBusted ? (
          <>
            <span className="myth-busted-mark" aria-hidden="true">
              X
            </span>
            <strong className="myth-busted-text">MYTH BUSTED</strong>
            <span className="myth-rate-label">{mythRate}% myth rate</span>
          </>
        ) : isNotMyth ? (
          <>
            <span className="myth-not-mark" aria-hidden="true">
              ✓
            </span>
            <strong className="myth-not-text">NOT A MYTH</strong>
            <span className="myth-rate-label">{mythRate}% myth rate</span>
          </>
        ) : (
          <>
            <span className="myth-rate-label">Myth rate</span>
            <strong className="myth-rate-value">{mythRate}%</strong>
          </>
        )}
      </div>

      <header className="myth-header">
        <BuildingBadge buildingCode={myth.buildingCode} />
        <span className="myth-scope-chip">{typeLabel}</span>
        <code>{typeValue}</code>
      </header>

      <p className="myth-text">{myth.text}</p>

      <VoteWidget mythId={myth.id} initialUp={myth.votesUp} initialDown={myth.votesDown} />
    </article>
  );
}
