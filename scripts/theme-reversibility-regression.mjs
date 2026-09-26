import { chromium } from 'playwright-core';

const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (ok, name, detail = '') => {
  if (!ok) throw new Error(name + (detail ? ': ' + detail : ''));
  console.log('PASS', name, detail);
};

const targets = [
  ['body', 'body'],
  ['shell', '.site-shell'],
  ['header', '.site-header__inner'],
  ['nav', '.desktop-nav-track'],
  ['hero', '#hero'],
  ['hero-eyebrow', '.hero-copy-scroll > .hero-enter--1'],
  ['hero-secondary', '#hero .btn-secondary'],
  ['hero-scope', '.hero-scope-card'],
  ['hero-field', '.hero-field-card'],
  ['hero-status', '.hero-status-card'],
  ['sector', '#sectors .sector-card'],
  ['operating', '#operating-system .operating-step'],
  ['field', '#field-operations .field-card'],
  ['leadership', '#leadership .leadership-card'],
  ['contact', '#contact-section'],
  ['contact-link', '#contact-section .contact-link'],
  ['footer', '.site-footer'],
  ['resource-button', '.floating-contact--resources'],
];

async function removeEntrance(page) {
  await page.evaluate(() => document.querySelector('.site-entry')?.remove());
  await sleep(900);
}

async function snapshot(page, mobile = false) {
  if (mobile) {
    const toggle = page.locator('#mobile-navigation-toggle');
    if ((await toggle.count()) && (await toggle.isVisible())) {
      const drawerHidden = await page.locator('#mobile-navigation').getAttribute('aria-hidden');
      if (drawerHidden === 'true') {
        await toggle.click();
        await sleep(250);
      }
    }
  }

  return await page.evaluate((targets) => {
    const pick = (selector) => document.querySelector(selector);
    const read = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        color: s.color,
        backgroundColor: s.backgroundColor,
        backgroundImage: s.backgroundImage,
        borderTopColor: s.borderTopColor,
        borderRightColor: s.borderRightColor,
        borderBottomColor: s.borderBottomColor,
        borderLeftColor: s.borderLeftColor,
        boxShadow: s.boxShadow,
        outlineColor: s.outlineColor,
      };
    };
    const result = {};
    for (const [name, selector] of targets) result[name] = read(pick(selector));
    result.root = {
      theme: document.documentElement.dataset.theme || '',
      scheme: document.documentElement.style.colorScheme || '',
      bodyBg: getComputedStyle(document.body).backgroundColor,
      shellColor: getComputedStyle(document.querySelector('.site-shell')).color,
    };
    return result;
  }, targets);
}

function diffSnapshots(a, b) {
  const diffs = [];
  for (const key of Object.keys(a)) {
    if (!(key in b)) {
      diffs.push({ key, reason: 'missing-in-switched-dark' });
      continue;
    }
    const left = JSON.stringify(a[key]);
    const right = JSON.stringify(b[key]);
    if (left !== right) diffs.push({ key, freshDark: a[key], switchedDark: b[key] });
  }
  return diffs;
}

async function clickTheme(page) {
  const toggle = page.locator('[role="switch"]:visible').first();
  if (!(await toggle.count())) throw new Error('theme switch missing');
  await toggle.click();
}

async function run(width, height) {
  const baseContext = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
  await baseContext.addInitScript(() => {
    localStorage.setItem('veast-language', 'en');
    localStorage.setItem('veast-theme', 'dark');
  });
  const fresh = await baseContext.newPage();
  await fresh.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await removeEntrance(fresh);
  const freshDark = await snapshot(fresh, width < 768);
  assert(freshDark.root.theme === 'dark', `fresh dark root ${width}`, JSON.stringify(freshDark.root));
  await baseContext.close();

  const switchContext = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
  await switchContext.addInitScript(() => {
    localStorage.setItem('veast-language', 'en');
    localStorage.setItem('veast-theme', 'dark');
  });
  const page = await switchContext.newPage();
  const errors = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await removeEntrance(page);

  await clickTheme(page);
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light', { timeout: 2500 });
  await sleep(1200);

  await clickTheme(page);
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark', { timeout: 2500 });
  await sleep(1200);

  const switchedDark = await snapshot(page, width < 768);
  assert(switchedDark.root.theme === 'dark' && switchedDark.root.scheme === 'dark', `switched-back dark root ${width}`, JSON.stringify(switchedDark.root));

  const diffs = diffSnapshots(freshDark, switchedDark);
  assert(diffs.length === 0, `dark theme fully restores after light toggle ${width}`, JSON.stringify(diffs));
  assert(errors.length === 0, `no browser errors during theme round-trip ${width}`, errors.join(' | '));
  console.log('PASS theme-reversibility', width);
  await switchContext.close();
}

try {
  await run(1366, 900);
  await run(390, 844);
} finally {
  await browser.close();
}
