import { useMemo, useState } from "react";
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

  const score = useMemo(() => upCount - downCount, [upCount, downCount]);

  const handleVote = async (nextVote: VoteState): Promise<void> => {
    if (!nextVote || nextVote === vote || pending) {
      return;
    }

    const previousVote = vote;
    const previousUp = upCount;
    const previousDown = downCount;

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
      // Revert optimistic state when request fails.
      setVote(previousVote);
      setUpCount(previousUp);
      setDownCount(previousDown);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="vote-widget" role="group" aria-label="Vote on this myth">
      <button
        className={vote === "up" ? "vote-btn vote-btn-active vote-icon-btn" : "vote-btn vote-icon-btn"}
        onClick={() => void handleVote("up")}
        aria-label="Upvote myth"
        type="button"
        disabled={pending}
      >
        ↗
      </button>
      <span className="vote-score" aria-live="polite">
        Score {score}
      </span>
      <button
        className={
          vote === "down" ? "vote-btn vote-btn-active vote-icon-btn" : "vote-btn vote-icon-btn"
        }
        onClick={() => void handleVote("down")}
        aria-label="Downvote myth"
        type="button"
        disabled={pending}
      >
        ↘
      </button>
    </div>
  );
}
