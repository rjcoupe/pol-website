import { faqs } from '../content';
import { SectionHead } from './SectionHead';

export function Faq() {
  return (
    <section id="faq" className="faq">
      <div className="wrap">
        <SectionHead head={faqs.head} />
        <div className="faq-list reveal">
          {faqs.items.map((f) => (
            <details className="q" key={f.q}>
              <summary>{f.q}</summary>
              <div className="ans">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
