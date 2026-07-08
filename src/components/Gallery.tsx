import { gallery, galleryEnabled } from '../content';
import { SectionHead } from './SectionHead';

const sizeClass = { feature: ' g-a', wide: ' g-b', normal: '' } as const;

export function Gallery() {
  if (!galleryEnabled) return null;
  return (
    <section id="gallery" className="gallery">
      <div className="wrap">
        <SectionHead head={gallery.head} />
        <div className="gal-grid">
          {gallery.images.map((g, i) => (
            <img key={i} className={sizeClass[g.size].trim() || undefined} src={g.image} alt={g.alt} />
          ))}
        </div>
      </div>
    </section>
  );
}
