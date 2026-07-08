import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

test('defaults to dark when nothing is stored and the system has no light preference', () => {
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('dark');
  expect(document.documentElement.dataset.theme).toBe('dark');
});

test('follows a system light preference when nothing is stored', () => {
  const original = window.matchMedia;
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query === '(prefers-color-scheme: light)',
      media: query,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    }),
  });
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('light');
  Object.defineProperty(window, 'matchMedia', { writable: true, value: original });
});

test('a stored choice beats the system preference', () => {
  localStorage.setItem('pol-theme', 'light');
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('light');
  expect(document.documentElement.dataset.theme).toBe('light');
});

test('an unrecognised stored value falls back to dark', () => {
  localStorage.setItem('pol-theme', 'sepia');
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('dark');
});

test('toggle flips the theme, the attribute, and the stored value', () => {
  const { result } = renderHook(() => useTheme());
  act(() => result.current.toggle());
  expect(result.current.theme).toBe('light');
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(localStorage.getItem('pol-theme')).toBe('light');
  act(() => result.current.toggle());
  expect(result.current.theme).toBe('dark');
  expect(localStorage.getItem('pol-theme')).toBe('dark');
});

test('updates the theme-color meta when present', () => {
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'theme-color');
  document.head.appendChild(meta);
  const { result } = renderHook(() => useTheme());
  expect(meta.getAttribute('content')).toBe('#0E1B2E');
  act(() => result.current.toggle());
  expect(meta.getAttribute('content')).toBe('#FAF4E7');
  meta.remove();
});
