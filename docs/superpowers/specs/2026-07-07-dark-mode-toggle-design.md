# Dark Mode Toggle — Design

**Date:** 2026-07-07
**Status:** Approved

## Goal

Add a dark mode to the Proof of Life site that realises the brand palette
requirement (navy ground, cream text, magenta accent — exact values below),
with a toggle in the nav. The current cream treatment becomes light mode and
stays visually identical apart from two deliberate brand corrections.

The original requirement references `:root` in an inline `<style>` block in
`index.html`; that predates the React conversion. The tokens live in
`src/styles/global.css` and that is where this work happens.

## Requirement palette (exact values)

| Role | Value |
|---|---|
| Navy base (primary dark ground, contact, footer) | `#0E1B2E` |
| Navy gradient (top-lit ground) | `#16304F → #0E1B2E → #0A1422` |
| Cream (primary text on navy, light grounds) | `#F4EAD5` |
| Cream dim 70% (secondary text) | `rgba(244,234,213,0.70)` |
| Cream dim 50% (labels, meta) | `rgba(244,234,213,0.50)` |
| Hairlines (borders, dividers) | `rgba(244,234,213,0.12)` |
| Accent | `#E83F8C` |
| Accent deep (hover/pressed, denser fills) | `#C42C72` |

Rules: magenta in small doses only (slash, CTAs, links, kickers, divider
glows) — never large fills. Body text keeps ~13:1 contrast (cream on navy, or
`#0E1B2E` on cream). Default and `:hover` link colors set explicitly to
accent / accent-deep. The magenta "/" slash stays centered between the two
O's in the "Proof" wordmark.

## Decisions (user-approved)

- **Default theme:** follow `prefers-color-scheme`; if the OS expresses no
  preference, default to **dark**. A manual toggle overrides and persists.
- **Toggle UI:** small sun/moon icon button at the end of the nav links,
  present in desktop nav and the mobile menu. Accessible name via
  `aria-label`.
- **Dark styling depth:** full navy-gradient ground per spec. Cards
  (packages, quotes, features) become hairline-bordered panels with faint
  `--navy-hi` fills instead of white gradients. Cream text at the 70%/50%
  dim levels. Contact and footer are already navy and stay as-is in both
  modes.
- **Brand corrections (both modes, light mode not byte-identical):**
  - `--magenta-deep` `#D6357E` → `#C42C72` (matches requirement and CLAUDE.md).
  - Cream dims on navy surfaces normalised to the spec's exact
    0.70 / 0.50 / 0.12 (currently 0.66 / 0.45 / 0.10).

## Architecture

**Mechanism:** semantic CSS custom properties in `:root`, remapped by a
`[data-theme='dark']` block. Chosen over `light-dark()` (can't express the
gradient/glass treatments cleanly) and React-side theme objects (would move
styling out of `global.css`, against project structure).

### CSS (`src/styles/global.css`)

- Promote the ~28 hardcoded colors outside `:root` (white card gradients,
  nav glass `rgba(250,244,231,…)`, ink shadows `rgba(21,38,60,…)`, hero
  ground stops) into semantic tokens, e.g. `--card-grad`, `--nav-glass`,
  `--shadow-tint`, `--hero-ground`. Light values identical to today.
- Add a `[data-theme='dark']` block remapping tokens to the palette above.
- `color-scheme: light dark` on `:root`; each theme sets its own
  `color-scheme`.
- Global link rule becomes explicit: `a { color: var(--magenta) }`,
  `a:hover { color: var(--magenta-deep) }`. Classed links (`.link`, `.btn`,
  footer links, CTAs) keep existing appearance via their more specific
  selectors.

### React

- `src/hooks/useTheme.ts` — reads localStorage key `pol-theme`
  (`'light' | 'dark'`); if absent, uses `matchMedia('(prefers-color-scheme: light)')`
  → light, else dark. Applies `data-theme` to `document.documentElement`,
  updates the `theme-color` meta, exposes `{ theme, toggle }`. Toggling
  persists to localStorage.
- `src/components/ThemeToggle.tsx` — icon button (sun in dark mode, moon in
  light mode), `aria-label="Switch to light theme"` / `"…dark theme"`.
  Rendered by `Nav` at the end of `.nav-links`.
- `index.html` — inline pre-paint script: read `pol-theme`, else
  `matchMedia`, else dark; set `data-theme` on `<html>` to avoid a flash of
  the wrong theme.

## Error handling

- localStorage unavailable (private mode): hook wraps reads/writes in
  try/catch; theme still works per-visit, just doesn't persist.
- Unknown stored value: treated as absent (fall through to system → dark).

## Testing

- `src/test/setup.ts` gains a `matchMedia` stub (jsdom lacks it).
- New: `useTheme` tests (system fallback, dark fallback, localStorage
  persistence, toggle flips `data-theme`); `ThemeToggle` test (renders in
  nav, click flips theme and label).
- All existing tests keep passing (23 currently, pending the in-flight
  gallery test fixes in the working tree).

## Out of scope

Per-image dark variants, route/state libraries, theme transition animations
beyond existing CSS transitions, any content changes in `src/content.ts`.
