import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { nav, footer, brand, waLink, igLink } from '../content';

test('Nav renders every nav link and the booking CTA', () => {
  render(<Nav />);
  for (const l of nav) {
    expect(screen.getByRole('link', { name: l.label })).toHaveAttribute('href', l.href);
  }
  expect(screen.getByRole('link', { name: brand.ctaLabel })).toHaveAttribute('href', waLink);
});

test('burger toggles the menu open and a link click closes it', async () => {
  const user = userEvent.setup();
  const { container } = render(<Nav />);
  const links = container.querySelector('.nav-links')!;
  expect(links.classList.contains('open')).toBe(false);
  await user.click(screen.getByRole('button', { name: 'Menu' }));
  expect(links.classList.contains('open')).toBe(true);
  await user.click(screen.getByRole('link', { name: nav[0].label }));
  expect(links.classList.contains('open')).toBe(false);
});

test('Footer renders links, WhatsApp, and copyright', () => {
  render(<Footer />);
  for (const l of footer.links) {
    expect(screen.getByRole('link', { name: l.label })).toHaveAttribute('href', l.href);
  }
  expect(screen.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', waLink);
  const ig = screen.getByRole('link', { name: 'Instagram' });
  expect(ig).toHaveAttribute('href', igLink);
  expect(ig).toHaveAttribute('target', '_blank');
  expect(screen.getByText(brand.copyright)).toBeInTheDocument();
});
