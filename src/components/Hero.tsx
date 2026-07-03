import { brand, hero, waLink } from '../content';
import { PolOO } from './Wordmark';
import { WhatsAppIcon } from './WhatsAppIcon';

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="kicker reveal">{hero.kicker}</span>
          <h1 className="hero-word reveal">
            Pr
            <PolOO />
            f
            <br />
            <span className="of">of</span> Life
          </h1>
          <p className="lead hero-sub reveal">{hero.lead}</p>
          <div className="hero-cta reveal">
            <a className="btn solid lg" href={waLink} target="_blank" rel="noopener">
              <WhatsAppIcon />
              {brand.ctaLabel}
            </a>
            <a className="btn lg" href="#packages">
              {hero.ctaSecondary}
            </a>
          </div>
          <div className="hero-meta reveal">
            {hero.stats.map((s) => (
              <div className="item" key={s.small}>
                <div className="n">{s.big}</div>
                <div className="l">{s.small}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-photo reveal">
          <img src={hero.image.src} alt={hero.image.alt} />
          <div className="ring" />
        </div>
      </div>
      <div className="scroll-cue">
        <span>Scroll</span>
        <span className="ln" />
      </div>
    </section>
  );
}
