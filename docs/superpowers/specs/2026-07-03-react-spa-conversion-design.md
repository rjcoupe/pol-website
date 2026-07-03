# Proof of Life — React SPA Conversion

**Date:** 2026-07-03
**Status:** Approved

## Goal

Convert the single static `index.html` marketing site into a Vite + React 18 + TypeScript
single-page app so that configurable content (prices, packages, FAQs, testimonials, copy,
contact details) lives in one typed config file, while the rendered site stays visually
identical. Deployment moves to a GitHub Actions workflow publishing to GitHub Pages,
preserving the proofoflife.bar custom domain.

## Constraints

- Pixel-identical output: the existing hand-tuned CSS is ported verbatim, not restyled.
- One page, no router — anchor navigation (`#what`, `#events`, `#packages`, `#gallery`,
  `#about`, `#faq`, `#contact`) unchanged.
- The counter.dev analytics script and Google Fonts links stay in `index.html`.
- The uncommitted price change (The Pour: from £150, not £450) carries into the config.
- `image-slot.js` (local-only drag-and-drop design tool) is removed; visitors never saw
  dropped images anyway. Real photos ship by overwriting files in `public/images/`.

## Architecture

Vite project at the repo root:

```
index.html                  Vite entry: fonts, analytics, #root
src/
  main.tsx                  createRoot
  App.tsx                   renders sections in order
  content.ts                ALL configurable content, typed
  types.ts                  content types (or co-located in content.ts)
  styles/global.css         existing CSS ported; image-slot selectors → img wrappers
  hooks/
    useReveal.ts            IntersectionObserver scroll-reveal (.reveal → .in)
    useScrolled.ts          nav .scrolled state past 24px
  components/
    Nav.tsx  Hero.tsx  Features.tsx  Events.tsx  Packages.tsx
    Gallery.tsx  About.tsx  Testimonials.tsx  Faq.tsx  Contact.tsx  Footer.tsx
    Wordmark.tsx            "Pr[o/o]f" slash motif (hero, contact, nav/footer marks)
    WhatsAppIcon.tsx        the SVG currently duplicated 4×
    SectionHead.tsx         kicker + h2 + lead
public/
  CNAME                     proofoflife.bar (copied into dist/)
  images/                   ph-hero, ph-1..7, ph-about (same filenames)
.github/workflows/deploy.yml
```

## Content config

`src/content.ts` exports one typed object:

- `brand` — name, short mark, tagline, WhatsApp number (single source for every CTA
  link, built as `https://wa.me/<number>`), display phone, website address, copyright.
- `nav` — array of `{ label, href }`.
- `hero` — kicker, sub copy, CTA labels, meta stats (`{ big, small }` × 3).
- `features` — 3 × `{ index, title, body }`.
- `events` — 3 × `{ title, body, image, alt }`.
- `packages` — array of `{ name, desc, fromPrice, items[], featured?, badge? }`.
  The Pour £150 / The Spread £700 (featured, "Most booked") / The Whole Night £950.
- `gallery` — array of `{ image, alt, size: 'feature' | 'wide' | 'normal' }` mapping to
  the current `g-a` / `g-b` / default grid classes.
- `about` — kicker, heading, paragraphs (with support for the one `<strong>` phrase),
  signature.
- `testimonials` — array of `{ quote, who }`.
- `faqs` — array of `{ q, a }`.
- `contact` — kicker, heading words, lead, caption.
- `footer` — link list (subset of nav + WhatsApp), copyright line.

Editing a price, FAQ, or testimonial is a one-line change, type-checked by `tsc`.

## Behaviour

- **Scroll reveal:** `useReveal` replicates the current IntersectionObserver
  (threshold 0.12, rootMargin `0px 0px -8% 0px`, staggered transition delays; hero
  reveals immediately on mount). `prefers-reduced-motion` handling stays in CSS.
- **Nav:** `useScrolled` toggles `.scrolled`; burger menu is `useState`, closing on
  link click.
- **FAQ:** native `<details>/<summary>`, no JS.

## Deployment

`.github/workflows/deploy.yml`: on push to `main` → checkout → setup-node (LTS, npm
cache) → `npm ci` → `npm run build` (`tsc -b && vite build`) →
`actions/upload-pages-artifact` (dist) → `actions/deploy-pages`.

Manual one-time step (repo owner): GitHub → Settings → Pages → Source: **GitHub Actions**
(currently "Deploy from a branch"). `public/CNAME` keeps the custom domain bound.

## Testing

Vitest + React Testing Library smoke tests:

- App renders every section heading from content.
- Every booking CTA href contains the configured WhatsApp number.
- Package cards match `content.packages` (count, names, prices).

CI runs `npm run build` (includes `tsc`) and `npm test` before deploy.

## Removed

`image-slot.js`, the old monolithic `index.html` (replaced), root `CNAME` (moved to
`public/`), root `images/` (moved to `public/images/`).

## Out of scope

Router, CMS, Tailwind, image optimization pipeline, additional pages.
