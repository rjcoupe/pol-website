import { packages, waLink } from '../content';
import { SectionHead } from './SectionHead';

export function Packages() {
  return (
    <section id="packages">
      <div className="wrap">
        <SectionHead head={packages.head} />
        <div className="pkg-grid">
          {packages.tiers.map((t) => (
            <div className={`pkg${t.featured ? ' feat' : ''} reveal`} key={t.name}>
              {t.badge && <div className="badge">{t.badge}</div>}
              <div className="name">{t.name}</div>
              <div className="desc">{t.desc}</div>
              <div className="price">
                <span className="from">from</span>
                <span className="amt">£{t.fromPrice}</span>
              </div>
              <ul>
                {t.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="pkg-cta">
                <a
                  className={`btn${t.featured ? ' solid' : ''}`}
                  href={waLink}
                  target="_blank"
                  rel="noopener"
                >
                  Enquire
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="pkg-note">{packages.note}</p>
      </div>
    </section>
  );
}
