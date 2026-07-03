import { brand, footer, waLink } from '../content';
import { MonoMark } from './Wordmark';

export function Footer() {
  return (
    <footer>
      <div className="wrap foot-in">
        <div className="brand">
          <MonoMark />
        </div>
        <nav className="foot-links">
          {footer.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href={waLink} target="_blank" rel="noopener">
            WhatsApp
          </a>
        </nav>
        <div className="foot-copy">{brand.copyright}</div>
      </div>
    </footer>
  );
}
