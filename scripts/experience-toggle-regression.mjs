import { chromium } from 'playwright-core';

const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const criticalSections = [
  { section: '#sectors', items: '#sectors .sector-card', expected: 7, name: 'sectors' },
  { section: '#field-operations', items: '#field-operations .field-card', expected: 3, name: 'field-operations' },
];

async function primeRevealSection(page, sectionSelector) {
  const nodes = page.locator(`${sectionSelector} [data-reveal]`);
  const count = await nodes.count();
  if (count < 1) throw new Error(`No reveal nodes in ${sectionSelector}`);

  for (let index = 0; index < count; index += 1) {
    await nodes.nth(index).scrollIntoViewIfNeeded();
    await sleep(140);
  }

  await page.locator(sectionSelector).scrollIntoViewIfNeeded();
  await sleep(520);
}

async function assertSectionFullyVisible(page, { section, items, expected, name }, phase) {
  const result = await page.evaluate(({ section, items, expected }) => {
    const sectionEl = document.querySelector(section);
    const itemEls = [...document.querySelectorAll(items)];
    const revealEls = sectionEl ? [...sectionEl.querySelectorAll('[data-reveal]')] : [];

    const inspect = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        opacity: Number.parseFloat(style.opacity || '1'),
        display: style.display,
        visibility: style.visibility,
        width: rect.width,
        height: rect.height,
        pending: element.classList.contains('reveal-pending'),
        visibleClass: element.classList.contains('is-visible'),
        revealed: element.getAttribute('data-revealed'),
      };
    };

    return {
      sectionExists: Boolean(sectionEl),
      expected,
      itemCount: itemEls.length,
      items: itemEls.map(inspect),
      reveals: revealEls.map(inspect),
      overflow: document.documentElement.scrollWidth > innerWidth + 2,
    };
  }, { section, items, expected });

  const badItems = result.items.filter((item) =>
    item.opacity < 0.94 ||
    item.display === 'none' ||
    item.visibility === 'hidden' ||
    item.width <= 0 ||
    item.height <= 0 ||
    item.pending
  );
  const badReveals = result.reveals.filter((item) =>
    item.opacity < 0.94 ||
    item.display === 'none' ||
    item.visibility === 'hidden' ||
    item.width <= 0 ||
    item.height <= 0 ||
    item.pending
  );

  if (!result.sectionExists || result.itemCount !== expected || badItems.length || badReveals.length || result.overflow) {
    throw new Error(`${phase} ${name}: ${JSON.stringify(result)}`);
  }

  if (name === 'field-operations') {
    const images = await page.locator('#field-operations .field-card img').evaluateAll((elements) =>
      elements.map((image) => {
        const rect = image.getBoundingClientRect();
        const style = getComputedStyle(image);
        return {
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          width: rect.width,
          height: rect.height,
          opacity: Number.parseFloat(style.opacity || '1'),
          display: style.display,
          visibility: style.visibility,
        };
      }),
    );
    if (images.length !== 3 || images.some((image) =>
      image.naturalWidth <= 0 ||
      image.naturalHeight <= 0 ||
      image.width <= 0 ||
      image.height <= 0 ||
      image.opacity < 0.94 ||
      image.display === 'none' ||
      image.visibility === 'hidden'
    )) {
      throw new Error(`${phase} field-images: ${JSON.stringify(images)}`);
    }
  }

  console.log('PASS', phase, name, `items=${result.itemCount} reveals=${result.reveals.length}`);
}

async function switchAndWatch(page, controlSelector, itemSelector, expected, phase) {
  const result = await page.evaluate(async ({ controlSelector, itemSelector, expected }) => {
    const control = document.querySelector(controlSelector);
    if (!(control instanceof HTMLElement)) return { missingControl: true, failures: ['missing-control'] };

    const failures = [];
    const samples = [];
    const started = performance.now();
    let minOpacity = 1;
    let minCount = Number.POSITIVE_INFINITY;

    control.click();

    await new Promise((resolve) => {
      const tick = (now) => {
        const items = [...document.querySelectorAll(itemSelector)];
        minCount = Math.min(minCount, items.length);
        const sample = items.map((item) => {
          const style = getComputedStyle(item);
          const rect = item.getBoundingClientRect();
          const opacity = Number.parseFloat(style.opacity || '1');
          minOpacity = Math.min(minOpacity, opacity);
          return {
            opacity,
            display: style.display,
            visibility: style.visibility,
            width: rect.width,
            height: rect.height,
            pending: item.classList.contains('reveal-pending'),
          };
        });

        if (
          items.length !== expected ||
          sample.some((item) =>
            item.opacity < 0.94 ||
            item.display === 'none' ||
            item.visibility === 'hidden' ||
            item.width <= 0 ||
            item.height <= 0 ||
            item.pending
          )
        ) {
          failures.push({ at: +(now - started).toFixed(1), count: items.length, sample });
        }

        samples.push({ at: +(now - started).toFixed(1), count: items.length, min: sample.length ? Math.min(...sample.map((item) => item.opacity)) : 0 });

        if (now - started < 700) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });

    return {
      missingControl: false,
      failures,
      sampleCount: samples.length,
      minOpacity,
      minCount,
      language: document.documentElement.lang,
      direction: document.documentElement.dir,
      theme: document.documentElement.dataset.theme,
      switching: document.documentElement.dataset.experienceSwitching || '',
    };
  }, { controlSelector, itemSelector, expected });

  if (result.missingControl || result.failures.length || result.minCount !== expected || result.minOpacity < 0.94) {
    throw new Error(`${phase}: transient blank detected: ${JSON.stringify(result)}`);
  }
  console.log('PASS', phase, JSON.stringify({
    samples: result.sampleCount,
    minOpacity: result.minOpacity,
    minCount: result.minCount,
    language: result.language,
    theme: result.theme,
  }));
}

async function runViewport(width, height) {
  const context = await browser.newContext({
    viewport: { width, height },
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
  await sleep(180);

  for (const target of criticalSections) {
    await primeRevealSection(page, target.section);
    await assertSectionFullyVisible(page, target, `before-switch-${width}`);

    await switchAndWatch(
      page,
      '.site-header .language-toggle button:last-child',
      target.items,
      target.expected,
      `${target.name}-ar-to-en-${width}`,
    );
    if (!(await page.evaluate(() => document.documentElement.lang === 'en' && document.documentElement.dir === 'ltr'))) {
      throw new Error(`${target.name}: English root state failed`);
    }
    await assertSectionFullyVisible(page, target, `after-ar-to-en-${width}`);

    await switchAndWatch(
      page,
      '.site-header [role="switch"]',
      target.items,
      target.expected,
      `${target.name}-dark-to-light-${width}`,
    );
    if ((await page.evaluate(() => document.documentElement.dataset.theme)) !== 'light') {
      throw new Error(`${target.name}: light theme state failed`);
    }
    await assertSectionFullyVisible(page, target, `after-dark-to-light-${width}`);

    await switchAndWatch(
      page,
      '.site-header .language-toggle button:first-child',
      target.items,
      target.expected,
      `${target.name}-en-to-ar-${width}`,
    );
    await assertSectionFullyVisible(page, target, `after-en-to-ar-${width}`);

    await switchAndWatch(
      page,
      '.site-header [role="switch"]',
      target.items,
      target.expected,
      `${target.name}-light-to-dark-${width}`,
    );
    await assertSectionFullyVisible(page, target, `after-light-to-dark-${width}`);
  }

  const rootState = await page.evaluate(() => ({
    language: document.documentElement.lang,
    direction: document.documentElement.dir,
    theme: document.documentElement.dataset.theme,
    overflow: document.documentElement.scrollWidth > innerWidth + 2,
  }));

  if (rootState.overflow) throw new Error(`Horizontal overflow at ${width}px`);
  if (errors.length) throw new Error(`Browser errors at ${width}px: ${errors.join(' | ')}`);

  console.log('PASS experience-toggle-regression', width, JSON.stringify(rootState));
  await context.close();
}

try {
  await runViewport(1366, 768);
  await runViewport(390, 844);
} finally {
  await browser.close();
}

// post-merge verification trigger 2026-09-25
