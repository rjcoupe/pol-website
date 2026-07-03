import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';
import { Features } from './Features';
import { Events } from './Events';
import { hero, features, events, waLink } from '../content';

test('Hero renders lead, stats, image, and booking CTA', () => {
  render(<Hero />);
  expect(screen.getByText(hero.lead)).toBeInTheDocument();
  for (const s of hero.stats) expect(screen.getByText(s.big)).toBeInTheDocument();
  expect(screen.getByAltText(hero.image.alt)).toHaveAttribute('src', hero.image.src);
  expect(screen.getByRole('link', { name: /message to book/i })).toHaveAttribute('href', waLink);
});

test('Features renders all three cards', () => {
  render(<Features />);
  for (const c of features.cards) {
    expect(screen.getByRole('heading', { name: c.title })).toBeInTheDocument();
    expect(screen.getByText(c.body)).toBeInTheDocument();
  }
});

test('Events renders all cards with images', () => {
  render(<Events />);
  for (const c of events.cards) {
    expect(screen.getByRole('heading', { name: c.title })).toBeInTheDocument();
    expect(screen.getByAltText(c.alt)).toHaveAttribute('src', c.image);
  }
});
