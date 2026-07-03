import { render, screen } from '@testing-library/react';
import { SectionHead } from './SectionHead';
import { MonoMark } from './Wordmark';
import { WhatsAppIcon } from './WhatsAppIcon';

test('SectionHead renders kicker, title, and optional lead', () => {
  render(<SectionHead head={{ kicker: 'K', title: 'T', lead: 'L' }} />);
  expect(screen.getByText('K')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'T' })).toBeInTheDocument();
  expect(screen.getByText('L')).toBeInTheDocument();
});

test('SectionHead omits lead when not given', () => {
  const { container } = render(<SectionHead head={{ kicker: 'K', title: 'T' }} />);
  expect(container.querySelector('.lead')).toBeNull();
});

test('MonoMark renders POL with accented O', () => {
  const { container } = render(<MonoMark />);
  expect(container.querySelector('.mono-mark')).toHaveTextContent('POL');
  expect(container.querySelector('.mono-mark .a')).toHaveTextContent('O');
});

test('WhatsAppIcon is aria-hidden', () => {
  const { container } = render(<WhatsAppIcon />);
  expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
});
