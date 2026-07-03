import { render } from '@testing-library/react';
import App from './App';
import { brand } from './content';

test('renders every anchored section', () => {
  const { container } = render(<App />);
  for (const id of ['what', 'events', 'packages', 'gallery', 'about', 'faq', 'contact']) {
    expect(container.querySelector(`section#${id}`)).not.toBeNull();
  }
  expect(container.querySelector('header.nav')).not.toBeNull();
  expect(container.querySelector('footer')).not.toBeNull();
});

test('every WhatsApp link uses the configured number', () => {
  const { container } = render(<App />);
  const links = container.querySelectorAll('a[href*="wa.me"]');
  expect(links.length).toBe(7); // nav CTA, hero CTA, 3 package Enquire, contact pill, footer
  links.forEach((a) =>
    expect(a).toHaveAttribute('href', `https://wa.me/${brand.whatsapp}`),
  );
});
