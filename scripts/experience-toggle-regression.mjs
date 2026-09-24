import { chromium } from 'playwright-core';

const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const sectionSelectors = [
  '#services',
  '#sectors',
  '#operating-system',
  '#field-operations',
  '#why-veast',
  '#faq',
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function visibleRevealState(page, selector) {
  return page.evaluate((target) => {
    const section = document.querySelector(target);
    if (!section) return { missing: true, count: 0, hidden: [] };
    const viewportHeight = window.innerHeight;
    const nodes = [...section.querySelectorAll('[data-reveal]')].filter((node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight * 0.9) - Math.max(rect.top, 0));
      const visibleRatio = rect.height > 0 ? visibleHeight / rect.height : 0;
      return style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        rect.height > 0 &&
        visibleRatio >= 0.2;
    });
    return {
      missing: false,
      count: nodes.length,
      hidden: nodes
        .filter((node) => Number.parseFloat(getComputedStyle(node).opacity || '1') < 0.94)
        .map((node) => ({
          tag: node.tagName,
          reveal: node.getAttribute('data-reveal'),
          className: node.className,
          opacity: getComputedStyle(node).opacity,
        })),
    };
  }, selector);
}

async function assertVisible(page, selector, phase) {
  const state = await visibleRevealState(page, selector);
  if (state.missing) throw new Error(`${phase}: missing section ${selector}`);
  if (state.count < 1) throw new Error(`${phase}: no viewport reveal nodes in ${selector}`);
  if (state.hidden.length) {
    throw new Error(`${phase}: hidden reveal nodes after experience change in ${selector}: ${JSON.stringify(state.hidden)}`);
  }
  console.log('PASS', phase, selector, `visible=${state.count}`);
}

async function clickHeaderControl(page, selector) {
  const clicked = await page.evaluate((query) => {
    const element = document.querySelector(query);
    if (!(element instanceof HTMLElement)) return false;
    element.click();
    return true;
  }, selector);
  if (!clicked) throw new Error(`Missing header control: ${selector}`);
}

async function assertAllSectorCardsVisible(page, phase) {
  const state = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#sectors .sector-card')];
    return {
      count: cards.length,
      cards: cards.map((card) => {
        const style = getComputedStyle(card);
        const rect = card.getBoundingClientRect();
        return {
          opacity: Number.parseFloat(style.opacity || '1'),
          display: style.display,
          visibility: style.visibility,
          width: rect.width,
          height: rect.height,
          revealed: card.getAttribute('data-revealed'),
          visibleClass: card.classList.contains('is-visible'),
        };
      }),
    };
  });
  const bad = state.cards.filter((card) =>
    card.opacity < 0.94 ||
    card.display === 'none' ||
    card.visibility === 'hidden' ||
    card.width <= 0 ||
    card.height <= 0
  );
  if (state.count !== 7 || bad.length) {
    throw new Error(`${phase}: sectors blank after in-place experience switch: ${JSON.stringify(state)}`);
  }
  console.log('PASS', phase, 'all-sector-cards-visible', JSON.stringify(state.cards.map((card) => ({
    opacity: card.opacity,
    revealed: card.revealed,
    visibleClass: card.visibleClass,
  }))));
}

try {
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    reducedMotion: 'no-preference',
    colorScheme: 'dark',
  });
  await context.addInitScript(() => {
    localStorage.setItem('veast-language', 'ar');
    localStorage.setItem('veast-theme', 'dark');
  });

  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  if (!response?.ok()) throw new Error(`Preview HTTP ${response?.status()}`);

  const cadence = await page.evaluate(async () => {
    const samples = [];
    let start = performance.now();
    let last = start;
    return await new Promise((resolve) => {
      const tick = (now) => {
        samples.push(now - last);
        last = now;
        if (now - start < 1100) {
          requestAnimationFrame(tick);
          return;
        }
        const clean = samples.slice(2).sort((a, b) => a - b);
        const pick = (q) => clean[Math.min(clean.length - 1, Math.floor((clean.length - 1) * q))] || 0;
        const slow = clean.filter((value) => value > 34).length;
        resolve({
          frames: clean.length,
          median: +pick(0.5).toFixed(2),
          p95: +pick(0.95).toFixed(2),
          slowRatio: +(slow / Math.max(clean.length, 1)).toFixed(3),
        });
      };
      requestAnimationFrame(tick);
    });
  });
  if (!(cadence.frames >= 20 && cadence.median <= 35.5 && cadence.p95 <= Math.max(55, cadence.median * 1.8) && cadence.slowRatio <= 0.35)) {
    throw new Error(`Local intro cadence regression: ${JSON.stringify(cadence)}`);
  }
  console.log('PASS local-intro-cadence', JSON.stringify(cadence));

  await page.evaluate(() => document.querySelector('.site-entry')?.remove());
  await sleep(150);

  let expectedTheme = 'dark';
  let expectedLanguage = 'ar';

  // Exact user-reported reproduction: stay on Sectors, switch theme/language repeatedly,
  // and verify every card remains rendered without a page refresh.
  await page.locator('#sectors').scrollIntoViewIfNeeded();
  await sleep(900);

  await clickHeaderControl(page, '.site-header [role="switch"]');
  expectedTheme = 'light';
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light', { timeout: 2500 });
  await sleep(420);
  await assertAllSectorCardsVisible(page, 'sectors-after-dark-to-light');

  await clickHeaderControl(page, '.site-header .language-toggle button:last-child');
  expectedLanguage = 'en';
  await page.waitForFunction(() => document.documentElement.lang === 'en', { timeout: 2500 });
  await sleep(420);
  await assertAllSectorCardsVisible(page, 'sectors-after-ar-to-en');

  await clickHeaderControl(page, '.site-header .language-toggle button:first-child');
  expectedLanguage = 'ar';
  await page.waitForFunction(() => document.documentElement.lang === 'ar', { timeout: 2500 });
  await sleep(420);
  await assertAllSectorCardsVisible(page, 'sectors-after-en-to-ar');

  await clickHeaderControl(page, '.site-header [role="switch"]');
  expectedTheme = 'dark';
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark', { timeout: 2500 });
  await sleep(420);
  await assertAllSectorCardsVisible(page, 'sectors-after-light-to-dark');

  await clickHeaderControl(page, '.site-header [role="switch"]');
  expectedTheme = 'light';
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light', { timeout: 2500 });
  await sleep(420);
  await assertAllSectorCardsVisible(page, 'sectors-after-dark-to-light-repeat');

  for (const selector of sectionSelectors) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await sleep(780);
    await assertVisible(page, selector, 'before-toggle');

    expectedTheme = expectedTheme === 'dark' ? 'light' : 'dark';
    await clickHeaderControl(page, '.site-header [role="switch"]');
    await page.waitForFunction(
      (theme) => document.documentElement.dataset.theme === theme,
      expectedTheme,
      { timeout: 2500 },
    );
    await sleep(360);
    await assertVisible(page, selector, 'after-theme-toggle');

    expectedLanguage = expectedLanguage === 'ar' ? 'en' : 'ar';
    const languageSelector = expectedLanguage === 'en'
      ? '.site-header .language-toggle button:last-child'
      : '.site-header .language-toggle button:first-child';
    await clickHeaderControl(page, languageSelector);
    await page.waitForFunction(
      (language) => document.documentElement.lang === language,
      expectedLanguage,
      { timeout: 2500 },
    );
    await sleep(420);
    await assertVisible(page, selector, 'after-language-toggle');
  }

  const rootState = await page.evaluate(() => ({
    language: document.documentElement.lang,
    direction: document.documentElement.dir,
    theme: document.documentElement.dataset.theme,
    overflow: document.documentElement.scrollWidth > innerWidth + 2,
  }));
  if (rootState.overflow) throw new Error('Horizontal overflow after repeated experience toggles');
  if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);

  console.log('PASS experience-toggle-regression', JSON.stringify(rootState));
  await context.close();
} finally {
  await browser.close();
}
