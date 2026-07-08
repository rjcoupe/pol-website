import { brand, contact, waLink } from '../content';
import { PolOO } from './Wordmark';
import { WhatsAppIcon } from './WhatsAppIcon';

export function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <span className="kicker reveal">{contact.kicker}</span>
        <h2 className="word reveal">
          Pr
          <PolOO />f <span className="of">of</span>{' '}
          {contact.headingTail}
        </h2>
        <p className="lead reveal">{contact.lead}</p>
        <div className="wa-block reveal">
          <a className="wa-pill" href={waLink} target="_blank" rel="noopener">
            <span className="ic">
              <WhatsAppIcon fill="#F4EAD5" />
            </span>
            <span className="num">{brand.whatsappDisplay}</span>
          </a>
          <span className="wa-cap">{contact.caption}</span>
        </div>
      </div>
    </section>
  );
}
