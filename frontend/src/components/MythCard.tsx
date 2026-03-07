import type { Myth } from "../types";
import { BuildingBadge } from "./BuildingBadge";
import { TestimonialList } from "./TestimonialList";
import { VerdictBadge } from "./VerdictBadge";
import { VoteWidget } from "./VoteWidget";

interface MythCardProps {
  myth: Myth;
  index?: number;
}

export function MythCard({ myth, index = 0 }: MythCardProps): JSX.Element {
  return (
    <article className="myth-card stagger-item" style={{ animationDelay: `${index * 70}ms` }}>
      <header className="myth-header">
        <BuildingBadge buildingCode={myth.buildingCode} />
        <VerdictBadge verdict={myth.verdictLabel} />
      </header>

      <p className="myth-text">{myth.text}</p>
      <p className="myth-reason">{myth.verdictReason}</p>

      <div className="myth-meta">
        {myth.programTag ? <span>{myth.programTag}</span> : <span>Any program</span>}
        {myth.courseTag ? <code>{myth.courseTag}</code> : <span>No course tag</span>}
        <span>Confidence {Math.round(myth.confidenceScore * 100)}%</span>
      </div>

      <VoteWidget mythId={myth.id} initialUp={myth.votesUp} initialDown={myth.votesDown} />

      <section className="myth-testimonials">
        <h4>Testimonials</h4>
        <TestimonialList testimonials={myth.testimonials} />
      </section>
    </article>
  );
}
