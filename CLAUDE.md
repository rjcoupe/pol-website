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
  (`Wordmark`, `WhatsAppIcon`, `SectionHead`, `ThemeToggle`).
- `src/hooks/` — `useReveal` (scroll-reveal IntersectionObserver), `useScrolled` (nav),
  `useTheme` (light/dark: localStorage `pol-theme` → `prefers-color-scheme` → dark).
- `src/styles/global.css` — all styling; brand tokens are CSS custom properties in
  `:root`, remapped by the `[data-theme='dark']` block for dark mode.
- `public/images/` — photography. Replace a file (keep the name) and push to swap a photo.
- `public/CNAME` — custom domain (proofoflife.bar); Vite copies it into `dist/`.
- `index.html` — Vite entry; Google Fonts, counter.dev analytics, and the pre-paint
  theme script (sets `data-theme` before first paint — keep in sync with `useTheme`).

## Brand
Palette: navy ground `#0E1B2E`, cream `#F4EAD5`, magenta accent `#E83F8C`
(deep `#C42C72`). Type: **Jost** (100–300) for headings; **DM Mono** for
kickers/labels/nav/buttons. Tokens in `:root` at the top of `global.css`.

## Notable details
- **Wordmark "Proof"** — the two O's are `.pol-oo` with a magenta `/` slash centered
  via `::after` (see `Wordmark.tsx`). Keep the slash centered on the gap if retheming.
- Section order: Nav · Hero · Features · Events · Packages · Gallery · About ·
  Testimonials · FAQ · Contact · Footer (`src/App.tsx`).
- **Contact + footer stay navy in both themes** — the "dark bookend" is intentional
  (original design, reconfirmed 2026-07). Not a theme-toggle bug.

## Deploying
Push to `main` → `.github/workflows/deploy.yml` tests, builds, and publishes `dist/`
to GitHub Pages. Repo setting: Pages source must be **GitHub Actions**.

## Related (not in this repo)
The logo/identity, business card, and WhatsApp booking QR live in the parent design
project.
