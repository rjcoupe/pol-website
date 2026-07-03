# React SPA Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the static `index.html` marketing site into a Vite + React 18 + TypeScript SPA driven by one typed content config, deployed to GitHub Pages via GitHub Actions.

**Architecture:** Single-page app, no router. `src/content.ts` holds all copy/prices/links with TypeScript types; one component per section renders its slice. The existing CSS ports verbatim to a global stylesheet (only `image-slot` selectors become `img` rules). Scroll-reveal and nav behaviour become small hooks.

**Tech Stack:** Vite 5, React 18, TypeScript (strict), Vitest + React Testing Library, GitHub Actions → GitHub Pages.

## Global Constraints

- **All work on branch `react-spa`** — pushing a Vite entry `index.html` to `main` before the deploy workflow exists breaks the live site (Pages currently serves the branch root).
- Rendered site must be visually identical to the current one (same class names, same CSS custom properties, same markup shape).
- Copy must match current `index.html` exactly, **except**: The Pour price is **£150** (uncommitted change, intentional) and the gallery lead changes to `A few favourites from recent pours.` (old lead described the removed drag-and-drop feature).
- WhatsApp number `447403603638` appears in exactly one place: `brand.whatsapp` in `src/content.ts`. Every CTA derives from it. Display form: `+44 7403 603638`.
- Custom domain `proofoflife.bar` must survive: `CNAME` lives in `public/`.
- The counter.dev script (`data-id="94c59655-4069-4890-9139-e5b6a388b464"`, `data-utcoffset="1"`) and Google Fonts links stay in `index.html`.
- The old static site is available at any time via `git show main:index.html` — use it to verify copy and CSS.
- Test commands: `npm test` (Vitest, run mode), `npm run build` (`tsc --noEmit && vite build`).

---

### Task 1: Scaffold Vite project, migrate assets, port CSS

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `.gitignore`, `src/main.tsx`, `src/App.tsx` (stub), `src/styles/global.css`, `src/test/setup.ts`
- Rewrite: `index.html` (becomes Vite entry)
- Move: `CNAME` → `public/CNAME`, `images/*` → `public/images/`
- Delete: `image-slot.js`

**Interfaces:**
- Produces: `App` default export from `src/App.tsx` (stub `<></>` for now, replaced in Task 8); `src/styles/global.css` with all site classes; test setup with an `IntersectionObserver` stub.

- [ ] **Step 1: Create branch**

```bash
git checkout -b react-spa
```

- [ ] **Step 2: Extract the CSS before touching index.html**

Copy the contents of the `<style>` block (between `<style>` and `</style>`, currently lines 11–283 of `index.html`) into a new file `src/styles/global.css`, WITHOUT the `<style>` tags. Then apply exactly these replacements (the only `image-slot` selectors in the file — old rule → new rule):

```css
/* was: .hero-photo image-slot { width: 100%; height: 540px; box-shadow: ... } */
.hero-photo img { width: 100%; height: 540px; object-fit: cover; border-radius: 14px; box-shadow: 0 30px 70px -30px rgba(21,38,60,0.45); }

/* was: .event-card image-slot { width: 100%; height: 340px; } */
.event-card img { width: 100%; height: 340px; object-fit: cover; }

/* was: .gal-grid image-slot { width: 100%; height: 100%; } */
.gal-grid img { width: 100%; height: 100%; object-fit: cover; }

/* was: .about-photo image-slot { width: 100%; height: 480px; box-shadow: ... } */
.about-photo img { width: 100%; height: 480px; object-fit: cover; border-radius: 14px; box-shadow: 0 30px 70px -34px rgba(21,38,60,0.4); }
```

And inside the `@media (max-width: 940px)` block:

```css
/* was: .hero-photo image-slot { height: 320px; }  */
.hero-photo img { height: 320px; }
/* was: .about-photo image-slot { height: 340px; } */
.about-photo img { height: 340px; }
```

(`border-radius: 14px` replicates the old `shape="rounded" radius="14"` attributes; event/gallery slots were `shape="rect"`, so no radius.)

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "proofoflife-website",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^24.1.0",
    "typescript": "~5.5.0",
    "vite": "^5.4.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 4: Create `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

- [ ] **Step 5: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"]
}
```

- [ ] **Step 6: Create `.gitignore`**

```
node_modules/
dist/
```

- [ ] **Step 7: Create `src/test/setup.ts`**

jsdom has no IntersectionObserver; the reveal hook needs a stub.

```ts
import '@testing-library/jest-dom/vitest';

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverStub,
});
```

- [ ] **Step 8: Replace `index.html` with the Vite entry**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Proof of Life — Mobile Cocktail Co.</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;1,200;1,300&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <script>document.documentElement.classList.add('js');</script>
  <script src="https://cdn.counter.dev/script.js" data-id="94c59655-4069-4890-9139-e5b6a388b464" data-utcoffset="1"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

- [ ] **Step 9: Create `src/main.tsx` and stub `src/App.tsx`**

`src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`src/App.tsx` (stub, fully replaced in Task 8):

```tsx
export default function App() {
  return <></>;
}
```

- [ ] **Step 10: Move assets, delete image-slot.js**

```bash
mkdir -p public
git mv CNAME public/CNAME
git mv images public/images
git rm image-slot.js
```

- [ ] **Step 11: Install and verify**

```bash
npm install
npm run build
```

Expected: build succeeds, `dist/` contains `index.html`, `CNAME`, `images/`, and hashed JS/CSS assets. Then check `ls dist/CNAME dist/images` to confirm the copies.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "Scaffold Vite + React + TS app, port CSS, migrate assets"
```

---

### Task 2: Typed content config

**Files:**
- Create: `src/content.ts`
- Test: `src/content.test.ts`

**Interfaces:**
- Produces (all consumed by section components in Tasks 4–7):
  - `brand: { name; tagline; ctaLabel; whatsapp; whatsappDisplay; website; copyright }` (all `string`)
  - `waLink: string` — `https://wa.me/${brand.whatsapp}`
  - `nav: { label: string; href: string }[]`
  - `hero: { kicker; lead; ctaSecondary; stats: { big; small }[]; image: { src; alt } }`
  - `features: { head: SectionHeadContent; cards: { index; title; body }[] }`
  - `events: { head: SectionHeadContent; cards: { title; body; image; alt }[] }`
  - `packages: { head: SectionHeadContent; tiers: Package[]; note: string }` where `Package = { name; desc; fromPrice: number; items: string[]; featured?: boolean; badge?: string }`
  - `gallery: { head: SectionHeadContent; images: { image; alt; size: 'feature' | 'wide' | 'normal' }[] }`
  - `about: { kicker; heading; paragraphs: string[]; signature }` — paragraphs may contain `**bold**` spans
  - `testimonials: { head: SectionHeadContent; quotes: { quote; who }[] }`
  - `faqs: { head: SectionHeadContent; items: { q; a }[] }`
  - `contact: { kicker; headingTail; lead; caption }`
  - `footer: { links: { label: string; href: string }[] }`
  - `SectionHeadContent = { kicker: string; title: string; lead?: string }`

- [ ] **Step 1: Write the failing test — `src/content.test.ts`**

```ts
import { brand, waLink, packages, faqs, gallery } from './content';

test('whatsapp number is digits only and drives waLink', () => {
  expect(brand.whatsapp).toMatch(/^\d+$/);
  expect(waLink).toBe(`https://wa.me/${brand.whatsapp}`);
});

test('exactly one package is featured and all have items', () => {
  expect(packages.tiers.filter((t) => t.featured)).toHaveLength(1);
  for (const t of packages.tiers) {
    expect(t.items.length).toBeGreaterThan(0);
    expect(t.fromPrice).toBeGreaterThan(0);
  }
});

test('every gallery image has alt text and a valid size', () => {
  for (const g of gallery.images) {
    expect(g.alt).not.toBe('');
    expect(['feature', 'wide', 'normal']).toContain(g.size);
  }
});

test('faq answers are non-empty', () => {
  for (const f of faqs.items) expect(f.a.length).toBeGreaterThan(20);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./content`.

- [ ] **Step 3: Create `src/content.ts`**

Copy is transcribed from `git show main:index.html` (decode HTML entities: `&pound;`→£, `&amp;`→&). Full file:

```ts
export interface SectionHeadContent {
  kicker: string;
  title: string;
  lead?: string;
}

export interface Package {
  name: string;
  desc: string;
  fromPrice: number;
  items: string[];
  featured?: boolean;
  badge?: string;
}

export const brand = {
  name: 'Proof of Life',
  tagline: 'Mobile Cocktail Co.',
  ctaLabel: 'Message to book',
  whatsapp: '447403603638',
  whatsappDisplay: '+44 7403 603638',
  website: 'proofoflife.bar',
  copyright: '© 2026 Proof of Life · Mobile Cocktail Co.',
};

export const waLink = `https://wa.me/${brand.whatsapp}`;

export const nav: { label: string; href: string }[] = [
  { label: 'What we do', href: '#what' },
  { label: 'Events', href: '#events' },
  { label: 'Packages', href: '#packages' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
];

export const hero = {
  kicker: 'Mobile bar hire · UK',
  lead: 'A proper cocktail bar that comes to you. One bartender, the right spirits — plus beer, wine and soft drinks — and a little warmth, for the smaller, closer gatherings where every drink actually matters.',
  ctaSecondary: 'See packages',
  stats: [
    { big: 'Intimate', small: 'weddings' },
    { big: 'Private', small: 'parties' },
    { big: 'Small', small: 'gatherings' },
  ],
  image: { src: '/images/ph-hero.png', alt: 'The Proof of Life bar in action' },
};

export const features = {
  head: {
    kicker: 'What we do',
    title: 'A full bar, brought to you.',
    lead: "Mobile cocktail bar hire for events that deserve more than a fridge full of warm cans. Cocktails are our craft — with beer, wine and soft drinks always on hand — and one bartender on it all night, so a smaller gathering feels properly looked after.",
  } satisfies SectionHeadContent,
  cards: [
    {
      index: '01',
      title: 'We bring everything',
      body: "Bar, glassware, ice, garnish, spirits and mixers — the whole setup arrives, gets built, and leaves without a trace. You don't lift a thing.",
    },
    {
      index: '02',
      title: 'One bartender who knows',
      body: 'A single experienced pair of hands behind the bar — fast, friendly, and unhurried with a smaller crowd. Proper technique, no theatrics unless you ask.',
    },
    {
      index: '03',
      title: "A menu that's yours",
      body: "Two house signatures or a short bespoke list built around your taste and your guests. Cocktails lead, but there's chilled beer, wine and soft drinks on the bar too — and proper alcohol-free serves always included.",
    },
  ],
};

export const events = {
  head: {
    kicker: 'Where we pour',
    title: 'Made for the small ones.',
    lead: "The kind of nights where it's about the people, not the headcount — twelve around a kitchen island, forty in a back garden.",
  } satisfies SectionHeadContent,
  cards: [
    {
      title: 'Intimate weddings',
      body: 'A signature his-and-hers serve and an arrival drink, for the close-knit celebrations.',
      image: '/images/ph-2.png',
      alt: 'Cocktails at an intimate wedding',
    },
    {
      title: 'Private parties',
      body: 'Birthdays, anniversaries, garden gatherings — turn an evening into an event.',
      image: '/images/ph-1.png',
      alt: 'A private party in full swing',
    },
    {
      title: 'Small gatherings',
      body: 'Launches, dinners and get-togethers that want a proper drink and a personal touch.',
      image: '/images/ph-4.png',
      alt: 'Drinks at a small gathering',
    },
  ],
};

export const packages = {
  head: {
    kicker: 'Packages',
    title: 'Three ways to pour.',
    lead: "Every booking is one bartender, tailored to your numbers and hours — these are the starting points. Tell us the date and we'll send an exact quote.",
  } satisfies SectionHeadContent,
  tiers: [
    {
      name: 'The Pour',
      desc: 'The essentials, done properly.',
      fromPrice: 150,
      items: [
        'One bartender, up to 3 hours',
        'Two house signature cocktails',
        'Beer, wine & soft drinks too',
        'Bar, glassware & ice included',
        'Soft & alcohol-free options',
        'Up to 25 guests',
      ],
    },
    {
      name: 'The Spread',
      desc: 'Our full bar experience.',
      fromPrice: 700,
      featured: true,
      badge: 'Most booked',
      items: [
        'One bartender, up to 5 hours',
        'Short cocktail menu, four serves',
        'Beer, wine & soft drinks too',
        'Garnish program & premium glassware',
        'Arrival drink on the door',
        'Up to 45 guests',
      ],
    },
    {
      name: 'The Whole Night',
      desc: 'Bespoke, top to bottom.',
      fromPrice: 950,
      items: [
        'One bartender, hours to suit',
        'Bespoke menu & tasting session',
        'Premium & rare spirits',
        'Themed or personalised serves',
        'Up to 60 guests',
      ],
    },
  ] satisfies Package[],
  note: 'Prices are indicative starting points · final quote depends on guest numbers, hours & travel.',
};

export const gallery = {
  head: {
    kicker: 'Gallery',
    title: 'Last call, every time.',
    lead: 'A few favourites from recent pours.',
  } satisfies SectionHeadContent,
  images: [
    { image: '/images/ph-3.png', alt: 'Signature cocktail close-up', size: 'feature' },
    { image: '/images/ph-5.png', alt: 'Garnish preparation', size: 'normal' },
    { image: '/images/ph-6.png', alt: 'The bar setup', size: 'normal' },
    { image: '/images/ph-7.png', alt: 'Guests at the bar', size: 'wide' },
    { image: '/images/ph-1.png', alt: 'Evening pours', size: 'normal' },
    { image: '/images/ph-2.png', alt: 'A toast', size: 'normal' },
    { image: '/images/ph-4.png', alt: 'Last drinks of the night', size: 'wide' },
  ] as { image: string; alt: string; size: 'feature' | 'wide' | 'normal' }[],
};

export const about = {
  kicker: 'Our story',
  heading: 'We named it after the first sip.',
  // **bold** spans render as <strong>
  paragraphs: [
    'Proof of Life started with a simple belief: a good drink, made properly and handed over with a bit of warmth, changes the whole feel of a room.',
    "We're a **mobile cocktail company** — spirits, kit and a seasoned bartender that travel to wherever the night's happening. No corporate gloss, no clipboard energy. Just a genuinely good bar, parked in your venue for the evening.",
    'We keep it deliberately small. One bar, one bartender, full attention on your guests — and a setup that leaves your space exactly as we found it.',
  ],
  signature: '— The Proof of Life team',
  image: { src: '/images/ph-about.png', alt: 'The Proof of Life team' },
};

export const testimonials = {
  head: {
    kicker: 'Kind words',
    title: 'The morning-after reviews.',
  } satisfies SectionHeadContent,
  quotes: [
    {
      quote: 'Our guests are still asking who did the bar. Faultless from setup to last pour.',
      who: 'Wedding · Cotswolds',
    },
    {
      quote: 'Turned a back garden into the best night of the summer. Worth every penny.',
      who: '40th birthday · London',
    },
    {
      quote: "Professional, warm, and the cocktails were genuinely excellent. We'll book again.",
      who: 'Anniversary · Bristol',
    },
  ],
};

export const faqs = {
  head: {
    kicker: 'Good to know',
    title: 'Questions, answered.',
  } satisfies SectionHeadContent,
  items: [
    {
      q: 'Do you provide the alcohol?',
      a: "Yes — spirits, mixers, garnish and ice come as standard. Prefer to supply your own? We're happy to work on a dry-hire basis, where you provide the stock and we bring the bar, kit and bartender.",
    },
    {
      q: 'How much space do you need?',
      a: "A footprint of roughly 2m × 1.5m and reasonably level access is plenty for the bar. We'll talk through your venue beforehand so setup is effortless on the day.",
    },
    {
      q: 'How far do you travel?',
      a: "We're a mobile bar, so travel is the point. Local events are covered as standard; anything further afield is easily arranged with a small travel charge folded into your quote.",
    },
    {
      q: 'Are you licensed and insured?',
      a: "Yes — we carry public liability insurance and hold a personal licence. If your venue needs a Temporary Event Notice, we'll guide you through it.",
    },
    {
      q: 'How many guests can one bar handle?',
      a: "We're built for intimate events — up to around 60 guests with a single bartender. That's where one bar shines: everyone gets a proper drink and a bit of attention, with no queue swallowing the evening.",
    },
    {
      q: 'Is it only cocktails?',
      a: "Cocktails are what we do best, but they're far from the whole bar. Every booking comes with chilled beer, wine and soft drinks as standard, plus thoughtful alcohol-free serves — so there's something for everyone, whatever they're in the mood for.",
    },
    {
      q: 'Can you make a non-alcoholic menu?',
      a: "Always. Every package includes thoughtful alcohol-free serves, and we're glad to build a full zero-proof menu that's every bit as good as the rest.",
    },
  ],
};

export const contact = {
  kicker: 'Book the bar',
  headingTail: 'a good night',
  lead: "Tell us the date, the place and roughly how many. We'll come back with a tailored quote — usually the same day.",
  caption: 'Message to book · WhatsApp',
};

export const footer = {
  links: [
    { label: 'What we do', href: '#what' },
    { label: 'Packages', href: '#packages' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
  ],
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content.ts src/content.test.ts
git commit -m "Add typed content config with all site copy"
```

---

### Task 3: Hooks and shared components

**Files:**
- Create: `src/hooks/useScrolled.ts`, `src/hooks/useReveal.ts`, `src/components/Wordmark.tsx`, `src/components/WhatsAppIcon.tsx`, `src/components/SectionHead.tsx`
- Test: `src/components/shared.test.tsx`

**Interfaces:**
- Consumes: `SectionHeadContent` from `src/content.ts`.
- Produces:
  - `useScrolled(threshold?: number): boolean`
  - `useReveal(): void` — call once in `App`; wires the IntersectionObserver
  - `MonoMark(): JSX` — the `P(O)L` mark
  - `PolOO(): JSX` — the slashed double-O used in the hero word
  - `WhatsAppIcon({ fill?: string }): JSX` — default `fill="currentColor"`
  - `SectionHead({ head }: { head: SectionHeadContent }): JSX`

- [ ] **Step 1: Write the failing test — `src/components/shared.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement**

`src/hooks/useScrolled.ts`:

```ts
import { useEffect, useState } from 'react';

export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}
```

`src/hooks/useReveal.ts` (faithful port of the old inline script — hero reveals on mount with 80ms stagger, other sections reveal on intersection with 70ms stagger):

```ts
import { useEffect } from 'react';

export function useReveal(): void {
  useEffect(() => {
    document.querySelectorAll<HTMLElement>('.hero .reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => el.classList.add('in')),
      );
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    document
      .querySelectorAll<HTMLElement>('section:not(.hero) .reveal')
      .forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i % 3, 2) * 70}ms`;
        io.observe(el);
      });
    return () => io.disconnect();
  }, []);
}
```

`src/components/Wordmark.tsx`:

```tsx
export function MonoMark() {
  return (
    <span className="mono-mark">
      P<span className="a">O</span>L
    </span>
  );
}

export function PolOO() {
  return (
    <span className="pol-oo">
      <span>o</span>
      <span>o</span>
    </span>
  );
}
```

`src/components/WhatsAppIcon.tsx` (paths copied verbatim from the old markup):

```tsx
export function WhatsAppIcon({ fill = 'currentColor' }: { fill?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path fill={fill} d="M16 3.2C8.93 3.2 3.2 8.93 3.2 16c0 2.26.6 4.46 1.73 6.4L3.2 28.8l6.56-1.72A12.74 12.74 0 0 0 16 28.8C23.07 28.8 28.8 23.07 28.8 16S23.07 3.2 16 3.2Z" />
      <path fill="#0E1B2E" d="M12.4 9.6c-.24-.53-.49-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.56 1.14 3.07 1.3 3.28.16.21 2.2 3.52 5.43 4.8 2.69 1.06 3.24.85 3.82.8.58-.05 1.88-.77 2.15-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.72.16-.21.32-.82 1.03-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.56-1.58-.95-.84-1.58-1.89-1.77-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.7-1.74-.97-2.36Z" />
    </svg>
  );
}
```

`src/components/SectionHead.tsx`:

```tsx
import type { SectionHeadContent } from '../content';

export function SectionHead({ head }: { head: SectionHeadContent }) {
  return (
    <div className="sec-head reveal">
      <span className="kicker">{head.kicker}</span>
      <h2>{head.title}</h2>
      {head.lead && <p className="lead">{head.lead}</p>}
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks src/components/Wordmark.tsx src/components/WhatsAppIcon.tsx src/components/SectionHead.tsx src/components/shared.test.tsx
git commit -m "Add reveal/scroll hooks and shared components"
```

---

### Task 4: Nav and Footer

**Files:**
- Create: `src/components/Nav.tsx`, `src/components/Footer.tsx`
- Test: `src/components/NavFooter.test.tsx`

**Interfaces:**
- Consumes: `brand, nav, footer, waLink` from `../content`; `MonoMark` from `./Wordmark`; `WhatsAppIcon`; `useScrolled`.
- Produces: `Nav(): JSX`, `Footer(): JSX`.

- [ ] **Step 1: Write the failing test — `src/components/NavFooter.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { nav, footer, brand, waLink } from '../content';
```

Note: `userEvent` needs `@testing-library/user-event` — add it: `npm install -D @testing-library/user-event`.

```tsx
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
  expect(screen.getByText(brand.copyright)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Nav`/`Footer` not found.

- [ ] **Step 3: Implement**

`src/components/Nav.tsx`:

```tsx
import { useState } from 'react';
import { brand, nav, waLink } from '../content';
import { useScrolled } from '../hooks/useScrolled';
import { MonoMark } from './Wordmark';
import { WhatsAppIcon } from './WhatsAppIcon';

export function Nav() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap nav-in">
        <a className="brand" href="#top" aria-label={`${brand.name} home`}>
          <MonoMark />
          <span className="tag">{brand.tagline}</span>
        </a>
        <nav className={`nav-links${open ? ' open' : ''}`}>
          {nav.map((l) => (
            <a key={l.href} className="link" href={l.href} onClick={close}>
              {l.label}
            </a>
          ))}
          <a className="btn solid" href={waLink} target="_blank" rel="noopener" onClick={close}>
            <WhatsAppIcon />
            {brand.ctaLabel}
          </a>
        </nav>
        <button className="hamburger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
```

`src/components/Footer.tsx`:

```tsx
import { brand, footer, waLink } from '../content';
import { MonoMark } from './Wordmark';

export function Footer() {
  return (
    <footer>
      <div className="wrap foot-in">
        <div className="brand">
          <MonoMark />
        </div>
        <nav className="foot-links">
          {footer.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href={waLink} target="_blank" rel="noopener">
            WhatsApp
          </a>
        </nav>
        <div className="foot-copy">{brand.copyright}</div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.tsx src/components/Footer.tsx src/components/NavFooter.test.tsx package.json package-lock.json
git commit -m "Add Nav and Footer components"
```

---

### Task 5: Hero, Features, Events

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/Features.tsx`, `src/components/Events.tsx`
- Test: `src/components/sections1.test.tsx`

**Interfaces:**
- Consumes: `brand, hero, features, events, waLink` from `../content`; `PolOO`, `WhatsAppIcon`, `SectionHead`.
- Produces: `Hero(): JSX`, `Features(): JSX`, `Events(): JSX`.

- [ ] **Step 1: Write the failing test — `src/components/sections1.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement**

`src/components/Hero.tsx`:

```tsx
import { brand, hero, waLink } from '../content';
import { PolOO } from './Wordmark';
import { WhatsAppIcon } from './WhatsAppIcon';

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="kicker reveal">{hero.kicker}</span>
          <h1 className="hero-word reveal">
            Pr
            <PolOO />
            f
            <br />
            <span className="of">of</span> Life
          </h1>
          <p className="lead hero-sub reveal">{hero.lead}</p>
          <div className="hero-cta reveal">
            <a className="btn solid lg" href={waLink} target="_blank" rel="noopener">
              <WhatsAppIcon />
              {brand.ctaLabel}
            </a>
            <a className="btn lg" href="#packages">
              {hero.ctaSecondary}
            </a>
          </div>
          <div className="hero-meta reveal">
            {hero.stats.map((s) => (
              <div className="item" key={s.small}>
                <div className="n">{s.big}</div>
                <div className="l">{s.small}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-photo reveal">
          <img src={hero.image.src} alt={hero.image.alt} />
          <div className="ring" />
        </div>
      </div>
      <div className="scroll-cue">
        <span>Scroll</span>
        <span className="ln" />
      </div>
    </section>
  );
}
```

`src/components/Features.tsx`:

```tsx
import { features } from '../content';
import { SectionHead } from './SectionHead';

export function Features() {
  return (
    <section id="what">
      <div className="wrap">
        <SectionHead head={features.head} />
        <div className="feature-row">
          {features.cards.map((c) => (
            <div className="feature reveal" key={c.index}>
              <div className="ix">{c.index}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`src/components/Events.tsx`:

```tsx
import { events } from '../content';
import { SectionHead } from './SectionHead';

export function Events() {
  return (
    <section id="events" className="events">
      <div className="wrap">
        <SectionHead head={events.head} />
        <div className="event-grid">
          {events.cards.map((c) => (
            <div className="event-card reveal" key={c.title}>
              <img src={c.image} alt={c.alt} />
              <div className="cap">
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/Features.tsx src/components/Events.tsx src/components/sections1.test.tsx
git commit -m "Add Hero, Features, and Events sections"
```

---

### Task 6: Packages, Gallery, About

**Files:**
- Create: `src/components/Packages.tsx`, `src/components/Gallery.tsx`, `src/components/About.tsx`
- Test: `src/components/sections2.test.tsx`

**Interfaces:**
- Consumes: `packages, gallery, about, waLink` from `../content`; `SectionHead`.
- Produces: `Packages(): JSX`, `Gallery(): JSX`, `About(): JSX`.

- [ ] **Step 1: Write the failing test — `src/components/sections2.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { Packages } from './Packages';
import { Gallery } from './Gallery';
import { About } from './About';
import { packages, gallery, about } from '../content';

test('Packages renders every tier with price and items', () => {
  render(<Packages />);
  for (const t of packages.tiers) {
    expect(screen.getByText(t.name)).toBeInTheDocument();
    expect(screen.getByText(`£${t.fromPrice}`)).toBeInTheDocument();
    for (const item of t.items) expect(screen.getByText(item)).toBeInTheDocument();
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement**

`src/components/Packages.tsx`:

```tsx
import { packages, waLink } from '../content';
import { SectionHead } from './SectionHead';

export function Packages() {
  return (
    <section id="packages">
      <div className="wrap">
        <SectionHead head={packages.head} />
        <div className="pkg-grid">
          {packages.tiers.map((t) => (
            <div className={`pkg${t.featured ? ' feat' : ''} reveal`} key={t.name}>
              {t.badge && <div className="badge">{t.badge}</div>}
              <div className="name">{t.name}</div>
              <div className="desc">{t.desc}</div>
              <div className="price">
                <span className="from">from</span>
                <span className="amt">£{t.fromPrice}</span>
              </div>
              <ul>
                {t.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="pkg-cta">
                <a
                  className={`btn${t.featured ? ' solid' : ''}`}
                  href={waLink}
                  target="_blank"
                  rel="noopener"
                >
                  Enquire
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="pkg-note">{packages.note}</p>
      </div>
    </section>
  );
}
```

`src/components/Gallery.tsx`:

```tsx
import { gallery } from '../content';
import { SectionHead } from './SectionHead';

const sizeClass = { feature: ' g-a', wide: ' g-b', normal: '' } as const;

export function Gallery() {
  return (
    <section id="gallery" className="gallery">
      <div className="wrap">
        <SectionHead head={gallery.head} />
        <div className="gal-grid">
          {gallery.images.map((g, i) => (
            <img key={i} className={sizeClass[g.size].trim() || undefined} src={g.image} alt={g.alt} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

`src/components/About.tsx`:

```tsx
import { Fragment } from 'react';
import { about } from '../content';

function Bold({ text }: { text: string }) {
  const parts = text.split('**');
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? <strong key={i}>{p}</strong> : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}

export function About() {
  return (
    <section id="about" className="about">
      <div className="wrap about-grid">
        <div className="about-photo reveal">
          <img src={about.image.src} alt={about.image.alt} />
        </div>
        <div className="about-body reveal">
          <span className="kicker">{about.kicker}</span>
          <h2>{about.heading}</h2>
          {about.paragraphs.map((p, i) => (
            <p key={i}>
              <Bold text={p} />
            </p>
          ))}
          <div className="sig">{about.signature}</div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Packages.tsx src/components/Gallery.tsx src/components/About.tsx src/components/sections2.test.tsx
git commit -m "Add Packages, Gallery, and About sections"
```

---

### Task 7: Testimonials, FAQ, Contact

**Files:**
- Create: `src/components/Testimonials.tsx`, `src/components/Faq.tsx`, `src/components/Contact.tsx`
- Test: `src/components/sections3.test.tsx`

**Interfaces:**
- Consumes: `testimonials, faqs, contact, brand, waLink` from `../content`; `SectionHead`, `WhatsAppIcon`.
- Produces: `Testimonials(): JSX`, `Faq(): JSX`, `Contact(): JSX`.

- [ ] **Step 1: Write the failing test — `src/components/sections3.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement**

`src/components/Testimonials.tsx`:

```tsx
import { testimonials } from '../content';
import { SectionHead } from './SectionHead';

export function Testimonials() {
  return (
    <section className="quotes">
      <div className="wrap">
        <SectionHead head={testimonials.head} />
        <div className="quote-grid">
          {testimonials.quotes.map((q) => (
            <div className="quote reveal" key={q.who}>
              <div className="mk">“</div>
              <p>{q.quote}</p>
              <div className="who">{q.who}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`src/components/Faq.tsx` (native `<details>`, no state):

```tsx
import { faqs } from '../content';
import { SectionHead } from './SectionHead';

export function Faq() {
  return (
    <section id="faq" className="faq">
      <div className="wrap">
        <SectionHead head={faqs.head} />
        <div className="faq-list reveal">
          {faqs.items.map((f) => (
            <details className="q" key={f.q}>
              <summary>{f.q}</summary>
              <div className="ans">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`src/components/Contact.tsx` (the heading keeps the brand wordmark inline — original used a span-only `pol-oo` here, not the split one):

```tsx
import { brand, contact, waLink } from '../content';
import { WhatsAppIcon } from './WhatsAppIcon';

export function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <span className="kicker reveal">{contact.kicker}</span>
        <h2 className="word reveal">
          Pr<span className="pol-oo">oo</span>f <span className="of">of</span>{' '}
          {contact.headingTail}
        </h2>
        <p className="lead reveal">{contact.lead}</p>
        <div className="wa-block reveal">
          <a className="wa-pill" href={waLink} target="_blank" rel="noopener">
            <span className="ic">
              <WhatsAppIcon fill="#F4EAD5" />
            </span>
            <span className="num">{brand.whatsappDisplay}</span>
          </a>
          <span className="wa-cap">{contact.caption}</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Testimonials.tsx src/components/Faq.tsx src/components/Contact.tsx src/components/sections3.test.tsx
git commit -m "Add Testimonials, FAQ, and Contact sections"
```

---

### Task 8: App assembly and integration test

**Files:**
- Rewrite: `src/App.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: every section component from Tasks 4–7; `useReveal` from Task 3.
- Produces: `App` default export rendering the full page in order Nav · Hero · Features · Events · Packages · Gallery · About · Testimonials · Faq · Contact · Footer.

- [ ] **Step 1: Write the failing test — `src/App.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: `App.test.tsx` FAILS (stub App renders nothing); all other suites still PASS.

- [ ] **Step 3: Implement `src/App.tsx`**

```tsx
import { useReveal } from './hooks/useReveal';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Events } from './components/Events';
import { Packages } from './components/Packages';
import { Gallery } from './components/Gallery';
import { About } from './components/About';
import { Testimonials } from './components/Testimonials';
import { Faq } from './components/Faq';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  useReveal();
  return (
    <>
      <Nav />
      <a id="top" />
      <Hero />
      <Features />
      <Events />
      <Packages />
      <Gallery />
      <About />
      <Testimonials />
      <Faq />
      <Contact />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Run all tests and the build**

Run: `npm test && npm run build`
Expected: all suites PASS; build succeeds.

- [ ] **Step 5: Visual comparison against the live site**

```bash
npm run dev
```

Open the printed URL and compare side-by-side with https://proofoflife.bar (or `git show main:index.html` served locally). Check: hero wordmark slash sits between the O's; nav blurs after scrolling; sections reveal on scroll; burger menu works below 1000px width; package prices read £150/£700/£950; FAQ accordions open; all images display.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "Assemble full page in App with integration tests"
```

---

### Task 9: Deploy workflow, docs, PR

**Files:**
- Create: `.github/workflows/deploy.yml`
- Rewrite: `CLAUDE.md` (describes the old static layout)

**Interfaces:**
- Consumes: `npm test`, `npm run build` from Task 1; `dist/` output containing `CNAME`.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Rewrite `CLAUDE.md`**

```markdown
# Proof of Life — Website

Marketing site for **Proof of Life · Mobile Cocktail Co.** — a UK mobile cocktail bar
for small, close gatherings. Single-page React SPA (Vite + TypeScript), no router.

## Run it
- `npm install` once, then `npm run dev`.
- `npm test` — Vitest + Testing Library.
- `npm run build` — type-check + production build to `dist/`.

## Editing content — start here
**All copy, prices, packages, FAQs, testimonials and contact details live in
`src/content.ts`.** Change a price or add an FAQ there; components render whatever
the config says. The WhatsApp number appears once (`brand.whatsapp`) and every CTA
derives from it.

## Files
- `src/content.ts` — the typed content config (the file you usually want).
- `src/components/` — one component per page section, plus shared bits
  (`Wordmark`, `WhatsAppIcon`, `SectionHead`).
- `src/hooks/` — `useReveal` (scroll-reveal IntersectionObserver), `useScrolled` (nav).
- `src/styles/global.css` — all styling; brand tokens are CSS custom properties in `:root`.
- `public/images/` — photography. Replace a file (keep the name) and push to swap a photo.
- `public/CNAME` — custom domain (proofoflife.bar); Vite copies it into `dist/`.
- `index.html` — Vite entry; Google Fonts + counter.dev analytics live here.

## Brand
Palette: navy ground `#0E1B2E`, cream `#F4EAD5`, magenta accent `#E83F8C`
(deep `#C42C72`). Type: **Jost** (100–300) for headings; **DM Mono** for
kickers/labels/nav/buttons. Tokens in `:root` at the top of `global.css`.

## Notable details
- **Wordmark "Proof"** — the two O's are `.pol-oo` with a magenta `/` slash centered
  via `::after` (see `Wordmark.tsx`). Keep the slash centered on the gap if retheming.
- Section order: Nav · Hero · Features · Events · Packages · Gallery · About ·
  Testimonials · FAQ · Contact · Footer (`src/App.tsx`).

## Deploying
Push to `main` → `.github/workflows/deploy.yml` tests, builds, and publishes `dist/`
to GitHub Pages. Repo setting: Pages source must be **GitHub Actions**.

## Related (not in this repo)
The logo/identity, business card, and WhatsApp booking QR live in the parent design
project.
```

- [ ] **Step 3: Commit and push the branch**

```bash
git add .github/workflows/deploy.yml CLAUDE.md
git commit -m "Add GitHub Pages deploy workflow, update docs"
git push -u origin react-spa
```

- [ ] **Step 4: Open PR**

```bash
gh pr create --title "Convert static site to React SPA with typed content config" --body "$(cat <<'EOF'
## Summary
- Converts the single static index.html into a Vite + React 18 + TypeScript SPA, visually identical to the current site
- All editable content (copy, packages/prices, FAQs, testimonials, WhatsApp number) now lives in one typed file: src/content.ts
- Removes image-slot.js (local-only design tool); photos are plain files in public/images/ — overwrite and push to swap
- Adds Vitest smoke tests and a GitHub Actions workflow that tests, builds, and deploys dist/ to GitHub Pages (CNAME preserved via public/)
- Carries the uncommitted price change: The Pour from £150

## ⚠️ Before merging
Switch repo **Settings → Pages → Build and deployment → Source** to **"GitHub Actions"** (currently "Deploy from a branch"). The configure-pages step also attempts this automatically, but set it manually to be safe. Until the switch, the old site stays live from main.

## Test plan
- [ ] `npm test` and `npm run build` pass in CI
- [ ] After merge: proofoflife.bar serves the new build, all sections render, WhatsApp CTAs work

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 5: Report the manual step**

Tell the repo owner explicitly: merging the PR replaces branch-root serving. GitHub Settings → Pages → Build and deployment → Source → **GitHub Actions**. Do this before or immediately after merge; until then the old site stays live from `main`.
