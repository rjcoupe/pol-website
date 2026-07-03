import { features } from '../content';
import { SectionHead } from './SectionHead';

export function Features() {
  return (
    <section id="what">
      <div className="wrap">
        <SectionHead head={features.head} />
        <div className="feature-row">
          {features.cards.map((c) => (
            <div className="feature reveal" key={c.index}>
              <div className="ix">{c.index}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
