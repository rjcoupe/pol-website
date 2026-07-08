import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Nav } from './Nav';

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

test('nav renders the theme toggle, dark by default', () => {
  render(<Nav />);
  expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
});

test('clicking the toggle flips theme, label, and persisted choice', async () => {
  const user = userEvent.setup();
  render(<Nav />);
  await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(localStorage.getItem('pol-theme')).toBe('light');
  await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
  expect(document.documentElement.dataset.theme).toBe('dark');
});
