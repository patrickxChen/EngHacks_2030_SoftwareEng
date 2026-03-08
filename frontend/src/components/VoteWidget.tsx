import { useState } from "react";
import { castVote } from "../lib/api";

interface VoteWidgetProps {
  mythId: string;
  initialUp: number;
  initialDown: number;
  onVote?: (upDelta: number, downDelta: number) => void;
}

type VoteState = "up" | "down" | null;

function loadVote(mythId: string): VoteState {
  try {
    return (localStorage.getItem(`vote:${mythId}`) as VoteState) ?? null;
  } catch {
    return null;
  }
}

function saveVoteDirection(mythId: string, vote: VoteState): void {
  try {
    if (vote) localStorage.setItem(`vote:${mythId}`, vote);
    else localStorage.removeItem(`vote:${mythId}`);
  } catch { /* ignore */ }
}

export function VoteWidget({ mythId, initialUp, initialDown, onVote }: VoteWidgetProps): JSX.Element {
  const [vote, setVote] = useState<VoteState>(() => loadVote(mythId));
  const [upCount, setUpCount] = useState(initialUp);
  const [downCount, setDownCount] = useState(initialDown);
  const [pending, setPending] = useState(false);

  const handleVote = async (nextVote: VoteState): Promise<void> => {
    if (!nextVote || nextVote === vote || pending) {
      return;
    }

    const previousVote = vote;

    const newUpCount = upCount + (nextVote === "up" ? 1 : 0) - (previousVote === "up" ? 1 : 0);
    const newDownCount = downCount + (nextVote === "down" ? 1 : 0) - (previousVote === "down" ? 1 : 0);

    setUpCount(newUpCount);
    setDownCount(newDownCount);
    setVote(nextVote);
    saveVoteDirection(mythId, nextVote);
    const upDelta = (nextVote === "up" ? 1 : 0) - (previousVote === "up" ? 1 : 0);
    const downDelta = (nextVote === "down" ? 1 : 0) - (previousVote === "down" ? 1 : 0);
    onVote?.(upDelta, downDelta);

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
