import { render, screen } from '@testing-library/react';
import { Packages } from './Packages';
import { Gallery } from './Gallery';
import { About } from './About';
import { packages, gallery, about } from '../content';

test('Packages renders every tier with price and items', () => {
  const { container } = render(<Packages />);
  for (const t of packages.tiers) {
    const tierEl = screen.getByText(t.name).closest('.pkg');
    expect(tierEl).toHaveTextContent(`£${t.fromPrice}`);
    for (const item of t.items) {
      expect(tierEl).toHaveTextContent(item);
    }
  }
  expect(screen.getByText('Most booked')).toBeInTheDocument();
});

test('featured tier gets the feat class and badge', () => {
  const { container } = render(<Packages />);
  const feat = container.querySelector('.pkg.feat')!;
  expect(feat).toHaveTextContent('The Spread');
  expect(feat.querySelector('.badge')).toHaveTextContent('Most booked');
});

test('Gallery renders all images with layout classes', () => {
  const { container } = render(<Gallery />);
  expect(container.querySelectorAll('.gal-grid img')).toHaveLength(gallery.images.length);
  expect(container.querySelectorAll('.gal-grid img.g-a')).toHaveLength(1);
  expect(container.querySelectorAll('.gal-grid img.g-b')).toHaveLength(2);
});

test('About renders paragraphs with bold span as <strong>', () => {
  const { container } = render(<About />);
  expect(screen.getByRole('heading', { name: about.heading })).toBeInTheDocument();
  expect(container.querySelector('.about-body strong')).toHaveTextContent('mobile cocktail company');
  expect(screen.getByText(about.signature)).toBeInTheDocument();
});
