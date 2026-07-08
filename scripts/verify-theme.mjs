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
