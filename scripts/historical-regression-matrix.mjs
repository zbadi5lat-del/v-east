import { chromium } from 'playwright-core';

const url = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, name, detail = '') => {
  if (!condition) throw new Error(`${name}${detail ? ': ' + detail : ''}`);
  console.log('PASS', name, detail);
};

async function removeEntrance(page) {
  await page.evaluate(() => document.querySelector('.site-entry')?.remove());
  await sleep(80);
}

async function collectErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push('PAGEERROR: ' + error.message));
  return errors;
}

async function primeSection(page, selector) {
  const revealNodes = page.locator(`${selector} [data-reveal]`);
  const count = await revealNodes.count();
  for (let index = 0; index < count; index += 1) {
    await revealNodes.nth(index).scrollIntoViewIfNeeded().catch(() => {});
    await sleep(70);
  }
  await page.locator(selector).scrollIntoViewIfNeeded();
  await sleep(260);
}

async function revealHealth(page, selector) {
  return page.evaluate((target) => {
    const section = document.querySelector(target);
    if (!section) return { exists: false, hidden: [], pending: [], total: 0 };
    const elements = [...section.querySelectorAll('[data-reveal]')];
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
        visible: element.classList.contains('is-visible'),
        revealed: element.getAttribute('data-revealed'),
      };
    };
    const states = elements.map(inspect);
    return {
      exists: true,
      total: states.length,
      hidden: states.filter((x) => x.opacity < 0.94 || x.display === 'none' || x.visibility === 'hidden' || x.width <= 0 || x.height <= 0),
      pending: states.filter((x) => x.pending),
    };
  }, selector);
}

async function assertSectionHealthy(page, selector, label) {
  const health = await revealHealth(page, selector);
  assert(health.exists, label + ' section exists');
  assert(health.hidden.length === 0, label + ' has no hidden reveal nodes', JSON.stringify(health.hidden));
  assert(health.pending.length === 0, label + ' has no pending reveal nodes after reveal', JSON.stringify(health.pending));
}

async function rapidExperienceSwitches(page, selector) {
  await primeSection(page, selector);
  const result = await page.evaluate(async ({ selector }) => {
    const section = document.querySelector(selector);
    if (!section) return { missing: true, failures: ['missing section'] };
    const controls = {
      ar: document.querySelector('.site-header .language-toggle button:first-child'),
      en: document.querySelector('.site-header .language-toggle button:last-child'),
      theme: document.querySelector('.site-header [role="switch"]'),
    };
    if (!(controls.ar instanceof HTMLElement) || !(controls.en instanceof HTMLElement) || !(controls.theme instanceof HTMLElement)) {
      return { missing: true, failures: ['missing controls'] };
    }

    const failures = [];
    const samples = [];
    let minOpacity = 1;
    const inspect = () => {
      const nodes = [...section.querySelectorAll('[data-reveal]')];
      const states = nodes.map((node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        const opacity = Number.parseFloat(style.opacity || '1');
        minOpacity = Math.min(minOpacity, opacity);
        return {
          opacity,
          display: style.display,
          visibility: style.visibility,
          width: rect.width,
          height: rect.height,
          pending: node.classList.contains('reveal-pending'),
        };
      });
      if (states.some((x) => x.opacity < 0.94 || x.display === 'none' || x.visibility === 'hidden' || x.width <= 0 || x.height <= 0 || x.pending)) {
        failures.push(states);
      }
      samples.push(states.length);
    };

    const clickAndWatch = async (element) => {
      element.click();
      const start = performance.now();
      await new Promise((resolve) => {
        const tick = (now) => {
          inspect();
          if (now - start < 520) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
    };

    await clickAndWatch(controls.en);
    await clickAndWatch(controls.theme);
    await clickAndWatch(controls.ar);
    await clickAndWatch(controls.theme);
    await clickAndWatch(controls.en);
    await clickAndWatch(controls.ar);

    return {
      missing: false,
      failures: failures.length,
      samples: samples.length,
      minOpacity,
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      theme: document.documentElement.dataset.theme,
      switching: document.documentElement.dataset.experienceSwitching || '',
    };
  }, { selector });

  assert(!result.missing, 'rapid experience controls present', JSON.stringify(result));
  assert(result.failures === 0, `rapid switch ${selector} has no blank frames`, JSON.stringify(result));
  assert(result.minOpacity >= 0.94, `rapid switch ${selector} opacity stays visible`, JSON.stringify(result));
}

async function testDesktop() {
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    colorScheme: 'dark',
    reducedMotion: 'no-preference',
  });
  await context.addInitScript(() => {
    if (!localStorage.getItem('veast-language')) localStorage.setItem('veast-language', 'ar');
    if (!localStorage.getItem('veast-theme')) localStorage.setItem('veast-theme', 'dark');
  });
  const page = await context.newPage();
  const errors = await collectErrors(page);

  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  assert(response?.ok(), 'desktop HTTP');
  await removeEntrance(page);

  const initial = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    theme: document.documentElement.dataset.theme,
    h1: document.querySelectorAll('h1').length,
    sections: document.querySelectorAll('main section').length,
    duplicateIds: (() => {
      const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    })(),
    overflow: document.documentElement.scrollWidth > innerWidth + 2,
  }));
  assert(initial.lang === 'ar' && initial.dir === 'rtl' && initial.theme === 'dark', 'desktop initial AR/RTL/dark', JSON.stringify(initial));
  assert(initial.h1 === 1 && initial.sections === 12 && initial.duplicateIds.length === 0 && !initial.overflow, 'desktop structural baseline', JSON.stringify(initial));

  const sectionSelectors = [
    '#places', '#about', '#pillars', '#services', '#sectors', '#operating-system',
    '#field-operations', '#why-veast', '#leadership', '#faq', '#contact-section',
  ];
  for (const selector of sectionSelectors) {
    await primeSection(page, selector);
    await assertSectionHealthy(page, selector, selector);
  }

  await rapidExperienceSwitches(page, '#sectors');
  await rapidExperienceSwitches(page, '#field-operations');

  // Persistence after user-driven changes.
  await page.evaluate(() => {
    document.querySelector('.site-header .language-toggle button:last-child')?.click();
    document.querySelector('.site-header [role="switch"]')?.click();
  });
  await sleep(650);
  const beforeReload = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    theme: document.documentElement.dataset.theme,
  }));
  assert(beforeReload.lang === 'en' && beforeReload.dir === 'ltr' && beforeReload.theme === 'light', 'desktop switch to EN/LTR/light before reload', JSON.stringify(beforeReload));
  await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
  await removeEntrance(page);
  const afterReload = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    theme: document.documentElement.dataset.theme,
  }));
  assert(afterReload.lang === 'en' && afterReload.dir === 'ltr' && afterReload.theme === 'light', 'language/theme persist after reload', JSON.stringify(afterReload));

  // FAQ atomic stack and functionality after persisted experience state.
  await page.locator('#faq').scrollIntoViewIfNeeded();
  await sleep(320);
  const faqBefore = await page.locator('#faq .faq-item').evaluateAll((items) => items.map((item) => {
    const rect = item.getBoundingClientRect();
    const style = getComputedStyle(item);
    return { opacity: +style.opacity, height: rect.height, display: style.display, visibility: style.visibility };
  }));
  assert(faqBefore.length === 4 && faqBefore.every((x) => x.opacity > .94 && x.height > 60 && x.display !== 'none' && x.visibility !== 'hidden'), 'FAQ stack visible after experience persistence', JSON.stringify(faqBefore));
  const faqButtons = page.locator('#faq button[aria-controls^="faq-panel-"]');
  await faqButtons.nth(1).click();
  await sleep(350);
  assert((await faqButtons.nth(1).getAttribute('aria-expanded')) === 'true', 'FAQ disclosure opens after switches');

  // Venue modal focus lifecycle.
  await page.locator('#places').scrollIntoViewIfNeeded();
  await sleep(320);
  const trigger = page.locator('#places [aria-haspopup="dialog"]').first();
  await trigger.focus();
  await trigger.click();
  await sleep(350);
  const dialog = page.locator('#place-profile-dialog');
  assert(await dialog.isVisible(), 'venue modal visible');
  assert((await dialog.getAttribute('aria-modal')) === 'true', 'venue modal semantics');
  assert(await page.evaluate(() => document.activeElement?.hasAttribute('data-autofocus') === true), 'venue modal autofocus');
  await page.keyboard.press('Escape');
  await sleep(350);
  assert(await trigger.evaluate((el) => document.activeElement === el), 'venue modal returns focus to trigger');

  // PDF launcher/panel after multiple experience changes.
  await page.evaluate(() => scrollTo(0, Math.min(document.body.scrollHeight * .58, document.body.scrollHeight - 1200)));
  await sleep(450);
  const pdfToggle = page.locator('button[aria-controls="floating-pdf-panel"]');
  assert(await pdfToggle.isVisible(), 'PDF launcher visible');
  await pdfToggle.click();
  await sleep(360);
  assert(await page.locator('#floating-pdf-panel a[href$=".pdf"]').count() === 3, 'PDF panel contains 3 downloads');
  await page.keyboard.press('Escape');
  await sleep(360);

  // Contact overlap protections.
  await page.locator('#contact-section').scrollIntoViewIfNeeded();
  await sleep(500);
  const floating = await page.evaluate(() => {
    const inspect = (el) => el ? {
      opacity: Number.parseFloat(getComputedStyle(el).opacity || '1'),
      pointer: getComputedStyle(el).pointerEvents,
    } : null;
    return {
      pdf: inspect(document.querySelector('.floating-resources')),
      whatsapp: inspect(document.querySelector('.floating-contact:not(.floating-contact--resources)')),
    };
  });
  assert(floating.pdf && (floating.pdf.pointer === 'none' || floating.pdf.opacity < .1), 'PDF launcher does not cover contact', JSON.stringify(floating.pdf));
  assert(floating.whatsapp && (floating.whatsapp.pointer === 'none' || floating.whatsapp.opacity < .1), 'WhatsApp does not cover contact', JSON.stringify(floating.whatsapp));

  // Lazy images eventually decode after a complete document pass.
  const images = page.locator('img');
  const imageCount = await images.count();
  for (let i = 0; i < imageCount; i += 1) {
    await images.nth(i).scrollIntoViewIfNeeded().catch(() => {});
    await sleep(30);
  }
  let broken = [];
  const deadline = Date.now() + 4000;
  do {
    broken = await images.evaluateAll((items) => items
      .filter((img) => !img.complete || img.naturalWidth <= 0)
      .map((img) => ({ src: img.currentSrc || img.getAttribute('src'), complete: img.complete, naturalWidth: img.naturalWidth })));
    if (!broken.length) break;
    await sleep(100);
  } while (Date.now() < deadline);
  assert(broken.length === 0, 'all runtime images decode', JSON.stringify(broken));

  const anchors = await page.locator('a[href^="#"]').evaluateAll((items) => [...new Set(items.map((a) => a.getAttribute('href')).filter(Boolean))]);
  const brokenAnchors = [];
  for (const href of anchors) {
    if (href === '#') continue;
    const exists = await page.evaluate((value) => Boolean(document.getElementById(value.slice(1))), href);
    if (!exists) brokenAnchors.push(href);
  }
  assert(brokenAnchors.length === 0, 'all internal anchors resolve', brokenAnchors.join(','));

  assert(errors.length === 0, 'desktop no console/page errors', errors.join(' | '));
  await context.close();
}

async function testMobile() {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
    reducedMotion: 'no-preference',
  });
  await context.addInitScript(() => {
    if (!localStorage.getItem('veast-language')) localStorage.setItem('veast-language', 'ar');
    if (!localStorage.getItem('veast-theme')) localStorage.setItem('veast-theme', 'dark');
  });
  const page = await context.newPage();
  const errors = await collectErrors(page);

  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  assert(response?.ok(), 'mobile HTTP');
  await removeEntrance(page);

  const menu = page.locator('#mobile-navigation-toggle');
  await menu.click();
  await sleep(360);
  assert((await page.locator('#mobile-navigation').getAttribute('aria-hidden')) === 'false', 'mobile drawer opens');
  assert(await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden'), 'mobile drawer locks body scroll');

  const en = page.locator('#mobile-navigation .language-toggle button').filter({ hasText: /^EN$/ });
  await en.click();
  await sleep(500);
  const postLanguageDrawer = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    drawerHidden: document.getElementById('mobile-navigation')?.getAttribute('aria-hidden'),
    bodyOverflow: getComputedStyle(document.body).overflow,
    activeId: document.activeElement?.id || '',
    activeInsideInert: Boolean(document.activeElement?.closest('[inert]')),
  }));
  assert(postLanguageDrawer.lang === 'en' && postLanguageDrawer.dir === 'ltr', 'mobile drawer language changes to EN/LTR', JSON.stringify(postLanguageDrawer));
  assert(postLanguageDrawer.drawerHidden === 'true', 'language switch closes mobile drawer', JSON.stringify(postLanguageDrawer));
  assert(postLanguageDrawer.bodyOverflow !== 'hidden', 'language switch releases body scroll lock', JSON.stringify(postLanguageDrawer));
  assert(postLanguageDrawer.activeId === 'mobile-navigation-toggle', 'language switch returns focus to menu toggle', JSON.stringify(postLanguageDrawer));
  assert(!postLanguageDrawer.activeInsideInert, 'focus never remains inside inert drawer', JSON.stringify(postLanguageDrawer));

  await menu.click();
  await sleep(360);
  const themeSwitch = page.locator('#mobile-navigation [role="switch"]');
  const beforeTheme = await page.evaluate(() => document.documentElement.dataset.theme);
  await themeSwitch.click();
  await sleep(520);
  const afterTheme = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    drawerHidden: document.getElementById('mobile-navigation')?.getAttribute('aria-hidden'),
    bodyOverflow: getComputedStyle(document.body).overflow,
  }));
  assert(afterTheme.theme !== beforeTheme, 'mobile drawer theme switch changes theme', JSON.stringify(afterTheme));
  assert(afterTheme.drawerHidden === 'false' && afterTheme.bodyOverflow === 'hidden', 'theme switch keeps drawer modal/open', JSON.stringify(afterTheme));
  await page.keyboard.press('Escape');
  await sleep(360);
  assert((await page.locator('#mobile-navigation').getAttribute('aria-hidden')) === 'true', 'mobile Escape closes drawer');
  assert(await menu.evaluate((el) => document.activeElement === el), 'mobile Escape returns focus');

  await rapidExperienceSwitches(page, '#sectors');
  await rapidExperienceSwitches(page, '#field-operations');

  const mobileState = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth + 2,
    pendingVisible: [...document.querySelectorAll('[data-reveal].reveal-pending')].filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < innerHeight;
    }).length,
  }));
  assert(!mobileState.overflow && mobileState.pendingVisible === 0, 'mobile no overflow or visible pending reveals', JSON.stringify(mobileState));
  assert(errors.length === 0, 'mobile no console/page errors', errors.join(' | '));

  await context.close();
}

async function testReducedMotion() {
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  assert(response?.ok(), 'reduced-motion HTTP');
  await sleep(300);
  const state = await page.evaluate(() => ({
    entrance: getComputedStyle(document.querySelector('.site-entry')).display,
    hiddenRevealCount: [...document.querySelectorAll('[data-reveal]')].filter((el) => +getComputedStyle(el).opacity < .94).length,
  }));
  assert(state.entrance === 'none' && state.hiddenRevealCount === 0, 'reduced motion never hides content', JSON.stringify(state));
  await context.close();
}

try {
  await testDesktop();
  await testMobile();
  await testReducedMotion();
  console.log('PASS historical-regression-matrix');
} finally {
  await browser.close();
}
