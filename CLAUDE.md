# Proof of Life — Website

Marketing site for **Proof of Life · Mobile Cocktail Co.** — a UK mobile cocktail bar for small, close gatherings. Single static page, no build step.

## Run it
It's a plain static site. Any of:
- Open `index.html` directly in a browser, **or**
- `python3 -m http.server` then visit the printed URL (needed so `image-slot.js` and the local images load without file:// quirks).

No dependencies to install — fonts load from Google Fonts via CDN.

## Files
- `index.html` — the entire site (inline `<style>` + inline `<script>` at the bottom).
- `image-slot.js` — `<image-slot>` web component: drag-and-drop image placeholders used for all photography. Each slot has a stable `id`; dropped images persist in the browser via localStorage. `src=` points at the seeded placeholder in `images/`.
- `images/` — placeholder photography (`ph-hero`, `ph-1..7`, `ph-about`). Swap these for real shoot photos, keeping filenames, or drop new images onto the slots in-browser.

## Brand
Palette:
- Navy ground `#0E1B2E` (gradient `#16304F` → `#0E1B2E` → `#0A1422`)
- Cream `#F4EAD5`
- Magenta accent `#E83F8C` (deep `#C42C72`)

Type: **Jost** (100–300 weight) for headings/wordmark; **DM Mono** for kickers, labels, nav, buttons.

CSS custom properties live in `:root` at the top of the `<style>` block — edit tokens there.

## Structure (top → bottom)
Nav · Hero · What-we-do features · Events (3 cards) · Packages (3 tiers) · Gallery · About · Testimonials · FAQ · Contact (dark, WhatsApp CTA) · Footer.

## Notable details
- **Wordmark "Proof"** — the two O's are `.pol-oo` (inline-flex with a `gap`) and a magenta `/` slash sits centered between them via `::after`. If you retheme, keep the slash centered on the gap.
- **CTAs** all deep-link to WhatsApp booking: `https://wa.me/447403603638`.
- Website address: **proofoflife.bar**.
- Scroll-reveal animations via `.reveal` + an IntersectionObserver in the inline script; nav gets a `.scrolled` class past the hero.

## Related (not in this bundle)
The logo/identity, business card, and WhatsApp booking QR live in the parent design project.
