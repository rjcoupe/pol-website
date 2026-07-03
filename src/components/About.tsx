import { Fragment } from 'react';
import { about } from '../content';

function Bold({ text }: { text: string }) {
  const parts = text.split('**');
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? <strong key={i}>{p}</strong> : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}

export function About() {
  return (
    <section id="about" className="about">
      <div className="wrap about-grid">
        <div className="about-photo reveal">
          <img src={about.image.src} alt={about.image.alt} />
        </div>
        <div className="about-body reveal">
          <span className="kicker">{about.kicker}</span>
          <h2>{about.heading}</h2>
          {about.paragraphs.map((p, i) => (
            <p key={i}>
              <Bold text={p} />
            </p>
          ))}
          <div className="sig">{about.signature}</div>
        </div>
      </div>
    </section>
  );
}
