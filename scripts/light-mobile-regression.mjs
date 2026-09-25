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

function darkText(rgb) {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return false;
  const [, r, g, b] = match.map(Number);
  return r < 120 && g < 140 && b < 150;
}

async function removeEntrance(page) {
  await page.evaluate(() => document.querySelector('.site-entry')?.remove());
  await sleep(2200);
}

async function desktopLightAudit() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  await context.addInitScript(() => {
    localStorage.setItem('veast-language', 'en');
    localStorage.setItem('veast-theme', 'light');
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));

  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  assert(response?.ok(), 'light desktop HTTP');
  await removeEntrance(page);

  const state = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    overflow: document.documentElement.scrollWidth > innerWidth + 2,
  }));
  assert(state.theme === 'light' && state.lang === 'en' && state.dir === 'ltr', 'light EN/LTR state', JSON.stringify(state));
  assert(!state.overflow, 'light desktop no horizontal overflow');

  const targets = [
    ['hero eyebrow', '.hero-copy-scroll > .hero-enter--1'],
    ['hero field card', '.hero-field-card'],
    ['hero status card', '.hero-status-card'],
    ['sector card', '#sectors .sector-card'],
    ['operating card', '#operating-system .operating-step'],
    ['leadership card', '#leadership .leadership-card'],
    ['contact card', '#contact-section .contact-link'],
    ['footer', '.site-footer'],
  ];

  for (const [name, selector] of targets) {
    const locator = page.locator(selector).first();
    await locator.scrollIntoViewIfNeeded().catch(() => {});
    await sleep(180);
    const info = await locator.evaluate((element) => {
      const style = getComputedStyle(element);
      const candidate = element.querySelector('.text-white:not(.btn-primary *):not(.media-overlay *)') || element.querySelector('h2,h3,p,span');
      const textStyle = candidate ? getComputedStyle(candidate) : style;
      const rect = element.getBoundingClientRect();
      return {
        background: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        color: textStyle.color,
        opacity: Number.parseFloat(style.opacity || '1'),
        display: style.display,
        visibility: style.visibility,
        width: rect.width,
        height: rect.height,
      };
    });
    assert(info.opacity > .94 && info.display !== 'none' && info.visibility !== 'hidden' && info.width > 0 && info.height > 0, name + ' visible', JSON.stringify(info));
    assert(darkText(info.color), name + ' uses readable dark text in light theme', info.color);
  }

  const badLightText = await page.evaluate(() => {
    const roots = ['#hero','#sectors','#operating-system','#leadership','#contact-section','.site-footer'];
    const bad = [];
    for (const rootSelector of roots) {
      const root = document.querySelector(rootSelector);
      if (!root) continue;
      for (const el of root.querySelectorAll('.text-white,.text-slate-200,.text-slate-300,.text-slate-400,.text-slate-500')) {
        if (el.closest('.media-overlay,.btn-primary,[aria-pressed="true"]')) continue;
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (style.display === 'none' || style.visibility === 'hidden' || rect.width <= 0 || rect.height <= 0) continue;
        const match = style.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) continue;
        const r = Number(match[1]), g = Number(match[2]), b = Number(match[3]);
        if (r > 150 && g > 150 && b > 150) bad.push({ selector: rootSelector, text: el.textContent?.trim().slice(0, 60), color: style.color });
      }
    }
    return bad;
  });
  assert(badLightText.length === 0, 'no accidental light text remains on daylight surfaces', JSON.stringify(badLightText));

  assert(errors.length === 0, 'light desktop no console/page errors', errors.join(' | '));
  await context.close();
}

async function mobileOverlapAudit() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
  await context.addInitScript(() => {
    localStorage.setItem('veast-language', 'en');
    localStorage.setItem('veast-theme', 'light');
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));

  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  assert(response?.ok(), 'mobile light HTTP');
  await removeEntrance(page);

  await page.locator('.hero-media-frame').scrollIntoViewIfNeeded();
  await sleep(300);
  const hero = await page.evaluate(() => {
    const media = document.querySelector('.hero-media-main');
    const field = document.querySelector('.hero-field-card');
    const mr = media?.getBoundingClientRect();
    const fr = field?.getBoundingClientRect();
    const position = field ? getComputedStyle(field).position : '';
    return {
      position,
      media: mr ? { top: mr.top, bottom: mr.bottom, left: mr.left, right: mr.right } : null,
      field: fr ? { top: fr.top, bottom: fr.bottom, left: fr.left, right: fr.right } : null,
      overflow: document.documentElement.scrollWidth > innerWidth + 2,
    };
  });
  assert(hero.position !== 'absolute', 'mobile hero field card is in normal flow', JSON.stringify(hero));
  assert(hero.media && hero.field && hero.field.top >= hero.media.bottom - 2, 'mobile hero image/card do not overlap', JSON.stringify(hero));
  assert(!hero.overflow, 'mobile light no horizontal overflow');

  for (const selector of ['#field-operations .field-card', '#contact-section > div > div > div > div:first-child']) {
    const locator = page.locator(selector).first();
    if (!(await locator.count())) continue;
    await locator.scrollIntoViewIfNeeded();
    await sleep(240);
    const info = await locator.evaluate((parent) => {
      const overlay = parent.querySelector('.media-overlay');
      const pr = parent.getBoundingClientRect();
      const or = overlay?.getBoundingClientRect();
      return {
        parent: { top: pr.top, right: pr.right, bottom: pr.bottom, left: pr.left, width: pr.width, height: pr.height },
        overlay: or ? { top: or.top, right: or.right, bottom: or.bottom, left: or.left, width: or.width, height: or.height } : null,
      };
    });
    if (!info.overlay) continue;
    assert(info.overlay.left >= info.parent.left - 2 && info.overlay.right <= info.parent.right + 2 && info.overlay.bottom <= info.parent.bottom + 2, 'mobile media overlay stays inside its image card', JSON.stringify(info));
    assert(info.overlay.height <= info.parent.height, 'mobile media overlay cannot cover beyond parent', JSON.stringify(info));
  }

  assert(errors.length === 0, 'mobile light no console/page errors', errors.join(' | '));
  await context.close();
}

try {
  await desktopLightAudit();
  await mobileOverlapAudit();
  console.log('PASS light-mobile-regression');
} finally {
  await browser.close();
}
