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
