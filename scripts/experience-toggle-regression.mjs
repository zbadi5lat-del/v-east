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
  await page.evaluate(() => document.querySelector('.site-entry')?.remove());
  await sleep(150);

  let expectedTheme = 'dark';
  let expectedLanguage = 'ar';

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

// final-loop verification probe 2026-09-24T23:01+03
