import { useState } from "react";
import { castVote } from "../lib/api";

interface VoteWidgetProps {
  mythId: string;
  initialUp: number;
  initialDown: number;
}

type VoteState = "up" | "down" | null;

export function VoteWidget({ mythId, initialUp, initialDown }: VoteWidgetProps): JSX.Element {
  const [vote, setVote] = useState<VoteState>(null);
  const [upCount, setUpCount] = useState(initialUp);
  const [downCount, setDownCount] = useState(initialDown);
  const [pending, setPending] = useState(false);

  const handleVote = async (nextVote: VoteState): Promise<void> => {
    if (!nextVote || nextVote === vote || pending) {
      return;
    }

    const previousVote = vote;

    if (previousVote === "up") {
      setUpCount((prev) => prev - 1);
    }
    if (previousVote === "down") {
      setDownCount((prev) => prev - 1);
    }

    if (nextVote === "up") {
      setUpCount((prev) => prev + 1);
    }
    if (nextVote === "down") {
      setDownCount((prev) => prev + 1);
    }

    setVote(nextVote);

    try {
      setPending(true);
      await castVote(mythId, nextVote === "up" ? 1 : -1);
    } catch {
      // Keep optimistic update — backend may be unavailable in demo mode.
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="vote-widget"
      role="group"
      aria-label="Vote on this myth"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="vote-segment">
        <button
          className={
            vote === "up"
              ? "vote-btn vote-btn-active vote-icon-btn vote-btn-true"
              : "vote-btn vote-icon-btn vote-btn-true"
          }
          onClick={() => void handleVote("up")}
          aria-label="Vote true"
          type="button"
          disabled={pending}
        >
          <span>True ▲</span>
          <span className="vote-count" aria-hidden="true">
            {upCount}
          </span>
        </button>
        <button
          className={
            vote === "down"
              ? "vote-btn vote-btn-active vote-icon-btn vote-btn-false"
              : "vote-btn vote-icon-btn vote-btn-false"
          }
          onClick={() => void handleVote("down")}
          aria-label="Vote false"
          type="button"
          disabled={pending}
        >
          <span>False ▼</span>
          <span className="vote-count" aria-hidden="true">
            {downCount}
          </span>
        </button>
      </div>
    </div>
  );
}
