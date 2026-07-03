import { render, screen } from '@testing-library/react';
import { Testimonials } from './Testimonials';
import { Faq } from './Faq';
import { Contact } from './Contact';
import { testimonials, faqs, brand, waLink } from '../content';

test('Testimonials renders all quotes', () => {
  render(<Testimonials />);
  for (const q of testimonials.quotes) {
    expect(screen.getByText(q.quote)).toBeInTheDocument();
    expect(screen.getByText(q.who)).toBeInTheDocument();
  }
});

test('Faq renders every question and answer', () => {
  render(<Faq />);
  for (const f of faqs.items) {
    expect(screen.getByText(f.q)).toBeInTheDocument();
    expect(screen.getByText(f.a)).toBeInTheDocument();
  }
});

test('Contact shows display number linking to WhatsApp', () => {
  render(<Contact />);
  const pill = screen.getByText(brand.whatsappDisplay).closest('a')!;
  expect(pill).toHaveAttribute('href', waLink);
});
