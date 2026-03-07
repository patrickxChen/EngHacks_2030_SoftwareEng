import type { Testimonial } from "../types";

interface TestimonialListProps {
  testimonials: Testimonial[];
}

export function TestimonialList({ testimonials }: TestimonialListProps): JSX.Element {
  if (!testimonials.length) {
    return <p className="muted-text comments-empty">No comments yet. Be the first to add one.</p>;
  }

  return (
    <ul className="testimonial-list">
      {testimonials.map((entry) => (
        <li key={entry.id} className="testimonial-card">
          <header className="testimonial-card-head">
            <div className="testimonial-user-block">
              <p className="testimonial-user">{entry.userName}</p>
              <small className="testimonial-date">{new Date(entry.createdAt).toLocaleString()}</small>
            </div>
            <p
              className={
                entry.voteValue === 1
                  ? "testimonial-vote testimonial-vote-true"
                  : "testimonial-vote testimonial-vote-false"
              }
            >
              {entry.voteValue === 1 ? "True" : "False"}
            </p>
          </header>

          <p className="testimonial-rationale-label">Rationale</p>
          <p className="testimonial-text">{entry.text}</p>
        </li>
      ))}
    </ul>
  );
}
