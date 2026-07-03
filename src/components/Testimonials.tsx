import { testimonials } from '../content';
import { SectionHead } from './SectionHead';

export function Testimonials() {
  return (
    <section className="quotes">
      <div className="wrap">
        <SectionHead head={testimonials.head} />
        <div className="quote-grid">
          {testimonials.quotes.map((q) => (
            <div className="quote reveal" key={q.who}>
              <div className="mk">“</div>
              <p>{q.quote}</p>
              <div className="who">{q.who}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
