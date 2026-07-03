import { events } from '../content';
import { SectionHead } from './SectionHead';

export function Events() {
  return (
    <section id="events" className="events">
      <div className="wrap">
        <SectionHead head={events.head} />
        <div className="event-grid">
          {events.cards.map((c) => (
            <div className="event-card reveal" key={c.title}>
              <img src={c.image} alt={c.alt} />
              <div className="cap">
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
