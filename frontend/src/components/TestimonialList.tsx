import type { Testimonial } from "../types";

interface TestimonialListProps {
  testimonials: Testimonial[];
}

export function TestimonialList({ testimonials }: TestimonialListProps): JSX.Element {
  if (!testimonials.length) {
    return <p className="muted-text">No testimonials yet. Be the first to add one.</p>;
  }

  return (
    <ul className="testimonial-list">
      {testimonials.map((entry) => (
        <li key={entry.id} className="testimonial-card">
          <p>{entry.text}</p>
          <small>
            {entry.userName} - {new Date(entry.createdAt).toLocaleDateString()}
          </small>
        </li>
      ))}
    </ul>
  );
}
