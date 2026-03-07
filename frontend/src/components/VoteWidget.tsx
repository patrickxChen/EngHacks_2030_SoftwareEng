import { useMemo, useState } from "react";

interface VoteWidgetProps {
  initialUp: number;
  initialDown: number;
}

type VoteState = "up" | "down" | null;

export function VoteWidget({ initialUp, initialDown }: VoteWidgetProps): JSX.Element {
  const [vote, setVote] = useState<VoteState>(null);
  const [upCount, setUpCount] = useState(initialUp);
  const [downCount, setDownCount] = useState(initialDown);

  const score = useMemo(() => upCount - downCount, [upCount, downCount]);

  const handleVote = (nextVote: VoteState): void => {
    if (nextVote === vote) {
      if (nextVote === "up") {
        setUpCount((prev) => prev - 1);
      } else if (nextVote === "down") {
        setDownCount((prev) => prev - 1);
      }
      setVote(null);
      return;
    }

    if (vote === "up") {
      setUpCount((prev) => prev - 1);
    }
    if (vote === "down") {
      setDownCount((prev) => prev - 1);
    }

    if (nextVote === "up") {
      setUpCount((prev) => prev + 1);
    }
    if (nextVote === "down") {
      setDownCount((prev) => prev + 1);
    }

    setVote(nextVote);
  };

  return (
    <div className="vote-widget" role="group" aria-label="Vote on this myth">
      <button
        className={vote === "up" ? "vote-btn vote-btn-active vote-icon-btn" : "vote-btn vote-icon-btn"}
        onClick={() => handleVote("up")}
        aria-label="Upvote myth"
        type="button"
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
        onClick={() => handleVote("down")}
        aria-label="Downvote myth"
        type="button"
      >
        ↘
      </button>
    </div>
  );
}
