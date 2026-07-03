import { useState } from 'react';
import { brand, nav, waLink } from '../content';
import { useScrolled } from '../hooks/useScrolled';
import { MonoMark } from './Wordmark';
import { WhatsAppIcon } from './WhatsAppIcon';

export function Nav() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap nav-in">
        <a className="brand" href="#top" aria-label={`${brand.name} home`}>
          <MonoMark />
          <span className="tag">{brand.tagline}</span>
        </a>
        <nav className={`nav-links${open ? ' open' : ''}`}>
          {nav.map((l) => (
            <a key={l.href} className="link" href={l.href} onClick={close}>
              {l.label}
            </a>
          ))}
          <a className="btn solid" href={waLink} target="_blank" rel="noopener" onClick={close}>
            <WhatsAppIcon />
            {brand.ctaLabel}
          </a>
        </nav>
        <button className="hamburger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
