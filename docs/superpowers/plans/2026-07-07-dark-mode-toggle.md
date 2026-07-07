# Dark Mode Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persisted, system-aware dark mode (navy brand treatment) with a sun/moon toggle in the nav, per the approved spec at `docs/superpowers/specs/2026-07-07-dark-mode-toggle-design.md`.

**Architecture:** Semantic CSS custom properties in `:root` (light values), remapped by a `[data-theme='dark']` block in `src/styles/global.css`. A `useTheme` hook owns localStorage/`prefers-color-scheme` resolution and writes `data-theme` on `<html>`; a `ThemeToggle` button in the nav flips it. An inline pre-paint script in `index.html` prevents a flash of the wrong theme.

**Tech Stack:** Vite 5, React 18, TypeScript strict, Vitest + Testing Library (jsdom), Playwright (dev-only, `npm i --no-save playwright`) for final visual verification.

## Global Constraints

- Palette exact values: navy `#0E1B2E`, navy-hi `#16304F`, navy-lo `#0A1422`, cream `#F4EAD5`, cream dims `rgba(244,234,213,0.70)` / `rgba(244,234,213,0.50)`, hairlines `rgba(244,234,213,0.12)`, accent `#E83F8C`, accent-deep `#C42C72`.
- Magenta is an accent only — small doses (slash, buttons, links, kickers, glows). Never large magenta fills.
- Body text: cream on navy, or `#15263C`-family ink on cream (~13:1 contrast).
- Default and `:hover` link colors set explicitly to accent / accent-deep; classed links (`.link`, `.btn`, `.foot-links a`) keep their own styles via more specific selectors.
- The magenta "/" slash stays centered between the two O's in "Proof" (`.pol-oo::after` — untouched by this plan; it already uses `var(--magenta)`).
- Light mode stays visually identical EXCEPT the approved brand corrections: `--magenta-deep` → `#C42C72`, `.btn.solid:hover` → accent-deep (was `#ff4f97`), navy-surface cream dims normalised to 0.70/0.50/0.12 (were 0.66/0.45/0.10).
- All styling stays in `src/styles/global.css`. No changes to `src/content.ts`.
- localStorage key: `pol-theme`, values `'light' | 'dark'`. Theme attribute: `data-theme` on `document.documentElement`. No stored value → `matchMedia('(prefers-color-scheme: light)')` → else **dark**.
- theme-color meta: dark `#0E1B2E`, light `#FAF4E7`.
- `npm test` (Vitest) must stay green; `npm run build` (`tsc --noEmit && vite build`) must pass after every task.

---

### Task 1: Tokenize global.css and apply light-mode brand corrections

No visual change apart from the three approved brand corrections. Every color that dark mode must remap (or that the spec's palette names) becomes a custom property.

**Files:**
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: tokens `--cream-70`, `--cream-50`, `--cream-line`, `--kicker-ink`, `--on-accent`, `--nav-glass`, `--nav-sheet`, `--card-grad`, `--photo-shadow`, `--photo-shadow-2`, `--hero-bg` (Task 2's dark block remaps these plus the existing `--ground`/`--ground-2`/`--ink*`/`--line*`).

- [ ] **Step 1: Replace the `:root` block** (`global.css:1-16`) with:

```css
  :root {
    color-scheme: light;
    --navy:    #0E1B2E;
    --navy-hi: #16304F;
    --navy-lo: #0A1422;
    --cream:   #F4EAD5;
    --cream-70: rgba(244,234,213,0.70);  /* secondary text on navy */
    --cream-50: rgba(244,234,213,0.50);  /* labels, meta on navy */
    --cream-line: rgba(244,234,213,0.12);/* hairlines on navy */
    --ground:  #FAF4E7;   /* main light ground */
    --ground-2:#F2E7CF;   /* alternating warmer cream */
    --ink:     #15263C;   /* primary text on light */
    --ink-2:   rgba(21,38,60,0.66);
    --ink-3:   rgba(21,38,60,0.44);
    --line:    rgba(21,38,60,0.14);
    --line-2:  rgba(21,38,60,0.08);
    --magenta: #E83F8C;
    --magenta-deep: #C42C72;
    --kicker-ink: var(--magenta-deep);
    --on-accent: #fff;
    --nav-glass: rgba(250,244,231,0.82);
    --nav-sheet: rgba(250,244,231,0.97);
    --card-grad: linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0) 100%);
    --photo-shadow: rgba(21,38,60,0.45);
    --photo-shadow-2: rgba(21,38,60,0.4);
    --hero-bg:
      radial-gradient(120% 80% at 80% 8%, rgba(232,63,140,0.10) 0%, rgba(232,63,140,0) 50%),
      radial-gradient(100% 90% at 10% 100%, rgba(242,180,90,0.16) 0%, rgba(242,180,90,0) 55%),
      linear-gradient(180deg, #FCF7EC 0%, #FAF4E7 60%, #F2E7CF 100%);
    --maxw: 1180px;
  }
```

Note `--magenta-deep` is now `#C42C72` (brand correction; was `#D6357E`).

- [ ] **Step 2: Replace each literal usage with its token.** Exact edits (line numbers from current file; old → new):

1. `global.css:27` — `a { color: inherit; text-decoration: none; }` →
   ```css
   a { color: var(--magenta); text-decoration: none; }
   a:hover { color: var(--magenta-deep); }
   ```
   (Classed links are unaffected: `.nav-links a.link`, `.btn`, `.foot-links a` set their own color at higher specificity, and `.brand` / `.wa-pill` children all carry explicit colors — `Contact.tsx` passes `fill="#F4EAD5"` to the pill icon.)
2. `global.css:32` (`.kicker`) — `color: var(--magenta-deep);` → `color: var(--kicker-ink);`
3. `global.css:58` (`header.nav.scrolled`) — `background: rgba(250,244,231,0.82);` → `background: var(--nav-glass);`
4. `global.css:83` (`.btn:hover`) — `color: #fff;` → `color: var(--on-accent);`
5. `global.css:84` (`.btn.solid`) — `color: #fff;` → `color: var(--on-accent);`
6. `global.css:85` (`.btn.solid:hover`) — `background: #ff4f97;` → `background: var(--magenta-deep);` (brand correction: hover/pressed = accent-deep)
7. `global.css:93-98` (`.hero` background) — replace the entire three-layer `background:` value with `background: var(--hero-bg);`
8. `global.css:113` (`.hero-photo img`) — `box-shadow: 0 30px 70px -30px rgba(21,38,60,0.45);` → `box-shadow: 0 30px 70px -30px var(--photo-shadow);`
9. `global.css:132` (`.feature`) — `background: linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0) 100%), var(--ground);` → `background: var(--card-grad), var(--ground);`
10. `global.css:135` (`.feature .ix`) — `color: var(--magenta-deep);` → `color: var(--kicker-ink);`
11. `global.css:153` (`.pkg`) — `background: linear-gradient(180deg, #FFFFFF, rgba(255,255,255,0));` → `background: var(--card-grad);`
12. `global.css:157` (`.pkg .badge`) — `color: #fff;` → `color: var(--on-accent);`
13. `global.css:181` (`.about-photo img`) — `box-shadow: 0 30px 70px -34px rgba(21,38,60,0.4);` → `box-shadow: 0 30px 70px -34px var(--photo-shadow-2);`
14. `global.css:190` (`.quote`) — `background: linear-gradient(180deg, #FFFFFF, rgba(255,255,255,0));` → `background: var(--card-grad);`
15. `global.css:216` (`.contact` background, middle layer) — `radial-gradient(90% 90% at 50% 120%, #16304F, rgba(22,48,79,0) 60%),` → `radial-gradient(90% 90% at 50% 120%, var(--navy-hi), rgba(22,48,79,0) 60%),`
16. `global.css:221` (`.contact .lead`) — `color: rgba(244,234,213,0.66);` → `color: var(--cream-70);` (brand correction 0.66 → 0.70)
17. `global.css:228` (`.wa-cap`) — `color: rgba(244,234,213,0.45);` → `color: var(--cream-50);` (0.45 → 0.50)
18. `global.css:231` (`footer`) — `border-top: 1px solid rgba(244,234,213,0.10);` → `border-top: 1px solid var(--cream-line);` (0.10 → 0.12)
19. `global.css:236` (`.foot-links a, .foot-copy`) — `color: rgba(244,234,213,0.45);` → `color: var(--cream-50);`
20. `global.css:262` (mobile `.nav-links`) — `background: rgba(250,244,231,0.97);` → `background: var(--nav-sheet);`

Leave alone (theme-independent, sit on photos or are magenta accents): `.event-card .cap` scrim gradient and its `p` color (`:145`, `:148`), `.pkg.feat` magenta border/wash/shadow (`:154`), `.wa-pill:hover` magenta wash (`:224`), the two magenta/amber radials only where they live inside `--hero-bg`, `.contact` magenta glow (`:215`).

- [ ] **Step 3: Verify nothing else is hardcoded.** Run:

```bash
grep -nE '#[0-9A-Fa-f]{3,8}|rgba\(' src/styles/global.css | grep -vE '^\s*[0-9]+:\s*--|:root'
```

Expected remaining matches: only the "leave alone" list above (`:145`, `:148`, `:154`, `:215` glow, `:224`) plus transparent rgba endpoints.

- [ ] **Step 4: Run the suite and build**

```bash
npm test && npm run build
```
Expected: all tests pass (CSS is not asserted in jsdom); tsc + vite build clean.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "Tokenize palette in global.css; apply brand corrections"
```

---

### Task 2: Dark theme block + pre-paint script + theme-color meta

After this task, manually setting `document.documentElement.dataset.theme = 'dark'` in the browser fully themes the site; first paint picks the right theme with no flash.

**Files:**
- Modify: `src/styles/global.css` (append dark block after `:root`)
- Modify: `index.html`

**Interfaces:**
- Consumes: Task 1's tokens.
- Produces: the `data-theme='dark'` contract and `pol-theme` localStorage key that Tasks 3-5 rely on; `meta[name="theme-color"]` element.

- [ ] **Step 1: Add the dark remap** in `src/styles/global.css`, immediately after the `:root` block:

```css
  [data-theme='dark'] {
    color-scheme: dark;
    --ground:  var(--navy);
    --ground-2: var(--navy-lo);
    --ink:     var(--cream);
    --ink-2:   var(--cream-70);
    --ink-3:   var(--cream-50);
    --line:    var(--cream-line);
    --line-2:  rgba(244,234,213,0.06);  /* card grout, derived: subtler than hairline */
    --kicker-ink: var(--magenta);       /* deep magenta lacks contrast on navy */
    --nav-glass: rgba(14,27,46,0.82);
    --nav-sheet: rgba(14,27,46,0.97);
    --card-grad: linear-gradient(180deg, rgba(22,48,79,0.5) 0%, rgba(22,48,79,0) 100%);
    --photo-shadow: rgba(0,0,0,0.55);
    --photo-shadow-2: rgba(0,0,0,0.5);
    --hero-bg:
      radial-gradient(120% 80% at 80% 8%, rgba(232,63,140,0.12) 0%, rgba(232,63,140,0) 50%),
      linear-gradient(180deg, #16304F 0%, #0E1B2E 60%, #0A1422 100%);
  }
```

(The hero linear gradient is the spec's top-lit `#16304F → #0E1B2E → #0A1422` ground; the amber radial is dropped in dark — it's a warm-paper effect. The magenta glow stays: "divider glows" are an allowed small dose.)

- [ ] **Step 2: Update `index.html`.** Add the meta after the viewport meta (line 5):

```html
  <meta name="theme-color" content="#0E1B2E" />
```

Replace `<script>document.documentElement.classList.add('js');</script>` (line 10) with:

```html
  <script>
    document.documentElement.classList.add('js');
    (function () {
      var t = null;
      try { t = localStorage.getItem('pol-theme'); } catch (e) {}
      if (t !== 'light' && t !== 'dark') {
        t = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      document.documentElement.setAttribute('data-theme', t);
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute('content', t === 'dark' ? '#0E1B2E' : '#FAF4E7');
    })();
  </script>
```

- [ ] **Step 3: Verify by hand in the dev server**

```bash
npm run dev
```

Open the printed URL. Expected: site renders dark (navy ground, cream text) unless your OS is set to light. In devtools, run `document.documentElement.setAttribute('data-theme','light')` and back to `'dark'` — every section (nav, hero, features, events, packages, about, quotes, faq) must follow; contact/footer stay navy in both. Check the packages cards show faint navy panels (no white wash) in dark.

- [ ] **Step 4: Run the suite and build**

```bash
npm test && npm run build
```
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css index.html
git commit -m "Add dark theme token remap and pre-paint theme script"
```

---

### Task 3: `useTheme` hook (TDD)

**Files:**
- Modify: `src/test/setup.ts` (matchMedia stub — jsdom lacks it)
- Create: `src/hooks/useTheme.ts`
- Test: `src/hooks/useTheme.test.ts`

**Interfaces:**
- Consumes: `pol-theme` localStorage key, `data-theme` attribute contract from Task 2.
- Produces: `type Theme = 'light' | 'dark'`; `useTheme(): { theme: Theme; toggle: () => void }` — Task 4's `ThemeToggle` consumes exactly this.

- [ ] **Step 1: Add the matchMedia stub** to `src/test/setup.ts` (append after the IntersectionObserver stub):

```ts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false, // no system light preference → hook falls back to dark
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  }),
});
```

- [ ] **Step 2: Write the failing tests** at `src/hooks/useTheme.test.ts`:

```ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npx vitest run src/hooks/useTheme.test.ts
```
Expected: FAIL — `Cannot find module './useTheme'` (or equivalent resolve error).

- [ ] **Step 4: Implement** `src/hooks/useTheme.ts`:

```ts
import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'pol-theme';

function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(() => storedTheme() ?? systemTheme());
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0E1B2E' : '#FAF4E7');
  }, [theme]);
  const toggle = () =>
    setTheme((t) => {
      const next: Theme = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* private mode: theme still applies, just not persisted */
      }
      return next;
    });
  return { theme, toggle };
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run src/hooks/useTheme.test.ts
```
Expected: 6/6 PASS.

- [ ] **Step 6: Run the full suite and build**

```bash
npm test && npm run build
```
Expected: all pass, no new warnings.

- [ ] **Step 7: Commit**

```bash
git add src/test/setup.ts src/hooks/useTheme.ts src/hooks/useTheme.test.ts
git commit -m "Add useTheme hook with system fallback and persistence"
```

---

### Task 4: `ThemeToggle` in the nav (TDD)

**Files:**
- Create: `src/components/ThemeToggle.tsx`
- Modify: `src/components/Nav.tsx` (render toggle at end of `.nav-links`)
- Modify: `src/styles/global.css` (`.theme-toggle` styles + mobile-menu placement)
- Test: `src/components/ThemeToggle.test.tsx`

**Interfaces:**
- Consumes: `useTheme()` from `src/hooks/useTheme.ts` (Task 3).
- Produces: `<ThemeToggle />` rendered inside Nav's `.nav-links`.

- [ ] **Step 1: Write the failing tests** at `src/components/ThemeToggle.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/components/ThemeToggle.test.tsx
```
Expected: FAIL — no button with accessible name "Switch to light theme".

- [ ] **Step 3: Implement** `src/components/ThemeToggle.tsx`:

```tsx
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      className="theme-toggle"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggle}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path
            d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6a8.5 8.5 0 1 0 10.6 10.6Z" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 4: Render it in Nav.** In `src/components/Nav.tsx`, add the import and place the toggle after the CTA, still inside `.nav-links` (so it lands in the mobile sheet too):

```tsx
import { ThemeToggle } from './ThemeToggle';
```

```tsx
          <a className="btn solid" href={waLink} target="_blank" rel="noopener" onClick={close}>
            <WhatsAppIcon />
            {brand.ctaLabel}
          </a>
          <ThemeToggle />
        </nav>
```

- [ ] **Step 5: Style it.** In `src/styles/global.css`, add after the `.hamburger span` rule (currently `global.css:90`):

```css
  .theme-toggle {
    background: none; border: 0; cursor: pointer; padding: 8px;
    color: var(--ink-2); display: inline-flex; align-items: center;
    transition: color .2s;
  }
  .theme-toggle:hover { color: var(--ink); }
  .theme-toggle svg { width: 18px; height: 18px; }
```

And inside the existing `@media (max-width: 1000px)` block (after the `.nav-links .btn` rule):

```css
    .nav-links .theme-toggle { margin: 10px 28px 0; align-self: flex-start; }
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npx vitest run src/components/ThemeToggle.test.tsx
```
Expected: 2/2 PASS.

- [ ] **Step 7: Run the full suite and build**

```bash
npm test && npm run build
```
Expected: all pass. (`NavFooter.test.tsx` renders Nav — confirm it still passes with the toggle present.)

- [ ] **Step 8: Commit**

```bash
git add src/components/ThemeToggle.tsx src/components/ThemeToggle.test.tsx src/components/Nav.tsx src/styles/global.css
git commit -m "Add theme toggle button to nav"
```

---

### Task 5: End-to-end visual verification

Prove both themes render correctly in a real browser and the toggle + persistence work against the production build.

**Files:**
- Create: `scripts/verify-theme.mjs` (dev-only; committed for repeatability)

**Interfaces:**
- Consumes: everything above, `npm run build` output served by `vite preview`.

- [ ] **Step 1: Ensure Playwright is available (dev-only, not saved to package.json)**

```bash
npx playwright --version || npm i --no-save playwright
npx playwright install chromium --with-deps 2>/dev/null || npx playwright install chromium
```

- [ ] **Step 2: Write** `scripts/verify-theme.mjs`:

```js
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:4173/';
const browser = await chromium.launch();
const fails = [];
const check = (name, actual, expected) => {
  const ok = actual === expected;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${actual}${ok ? '' : ` (expected ${expected})`}`);
  if (!ok) fails.push(name);
};

const bodyBg = (page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const attr = (page) =>
  page.evaluate(() => document.documentElement.getAttribute('data-theme'));

for (const scheme of ['dark', 'light']) {
  const ctx = await browser.newContext({ colorScheme: scheme, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  check(`system-${scheme}: data-theme`, await attr(page), scheme);
  check(
    `system-${scheme}: body bg`,
    await bodyBg(page),
    scheme === 'dark' ? 'rgb(14, 27, 46)' : 'rgb(250, 244, 231)',
  );
  await page.screenshot({ path: `/tmp/pol-theme-${scheme}.png`, fullPage: true });

  if (scheme === 'dark') {
    await page.click('.theme-toggle');
    check('toggle: data-theme flips to light', await attr(page), 'light');
    check('toggle: body bg flips', await bodyBg(page), 'rgb(250, 244, 231)');
    await page.reload({ waitUntil: 'networkidle' });
    check('persistence: still light after reload', await attr(page), 'light');
  }
  await ctx.close();
}

await browser.close();
if (fails.length) {
  console.error(`\n${fails.length} check(s) failed`);
  process.exit(1);
}
console.log('\nAll theme checks passed');
```

- [ ] **Step 3: Build, serve, verify**

```bash
npm run build
npx vite preview --port 4173 &
sleep 2
node scripts/verify-theme.mjs http://localhost:4173/
kill %1
```

Expected: every line `PASS`, exit 0. Then eyeball `/tmp/pol-theme-dark.png` and `/tmp/pol-theme-light.png`: dark shows navy ground with cream text and no white card washes; light is unchanged from the current site (magenta accents only in small doses in both).

- [ ] **Step 4: Run the full suite one last time**

```bash
npm test && npm run build
```
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-theme.mjs
git commit -m "Add browser verification script for theme toggle"
```
