import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const checks = [];
const check = (id, ok, detail) => checks.push({ id, status: ok ? 'PASS' : 'FAIL', detail });

const content = read('src/content.ts');
const floating = read('src/components/FloatingWhatsApp.tsx');
const header = read('src/components/Header.tsx');
const hero = read('src/components/Hero.tsx');
const entrance = read('src/components/SiteEntrance.tsx');
const css = read('src/index.css');
const i18n = read('src/i18n.ts');

const pdfs = [
  'public/downloads/V-EAST-Company-Profile.pdf',
  'public/downloads/V-EAST-Services-Operations.pdf',
  'public/downloads/V-EAST-Portfolio-Featured-Venues.pdf',
];

for (const rel of pdfs) {
  const file = path.join(root, rel);
  const exists = fs.existsSync(file);
  const bytes = exists ? fs.statSync(file).size : 0;
  const magic = exists ? fs.readFileSync(file).subarray(0, 5).toString('ascii') : '';
  check(`pdf-${path.basename(rel)}`, exists && bytes > 100_000 && magic === '%PDF-', `${path.basename(rel)} exists=${exists} bytes=${bytes} magic=${magic}`);
}

check('pdf-resource-map', content.includes('PDF_RESOURCES') && pdfs.every(rel => content.includes('/' + rel.replace('public/', ''))), 'All three PDFs are mapped as local on-demand resources.');
check('no-save-page-pdf', !floating.includes('window.print') && !i18n.includes('savePagePdf') && !i18n.includes('Save this page as PDF') && !i18n.includes('حفظ الصفحة كملف PDF'), 'Save/print-page PDF behavior is removed.');
check('real-download-links', floating.includes('PDF_RESOURCES.map') && floating.includes(' download className="floating-resources__action"'), 'PDF center exposes real download links.');
check('pdf-library-localized', (i18n.match(/panelLabel:/g) ?? []).length === 2 && (i18n.match(/download: '.*PDF'/g) ?? []).length >= 2, 'PDF library is localized in Arabic and English.');
check('contact-no-overlay', floating.includes('contactVisible') && floating.includes('setVisible(heroPassed&&!contactVisible)') && floating.includes('[inset-inline-start:18px]') && floating.includes('[inset-inline-end:18px]'), 'Floating PDF/WhatsApp controls are opposite-sided and both disappear over the contact/message section.');
check('pdf-popup-inert', floating.includes('const resourcesVisible=visible&&resourcesOpen') && floating.includes("resourcesVisible?'is-open pointer-events-auto':'is-closed pointer-events-none'") && floating.includes('aria-hidden={!resourcesVisible}') && floating.includes('inert={!resourcesVisible}') && floating.includes("event.key==='Escape'"), 'Closed PDF panel is inert/hidden/non-interactive, visible state is bounded by scroll visibility, and Escape-close is implemented.');
check('scroll-direction-header', header.includes("setScrollDirection(nextDirection)") && header.includes('is-going-down') && header.includes('is-going-up') && header.includes('is-hidden'), 'Header responds to scroll direction and can auto-hide/reveal.');
check('header-rAF', header.includes('requestAnimationFrame(paint)') && header.includes("addEventListener('scroll',schedule,{passive:true})"), 'Header scroll behavior is requestAnimationFrame-throttled and passive.');
check('stronger-hero-parallax', hero.includes("style.setProperty('--hero-scroll'") && css.includes('var(--hero-scroll, 0) * -34px') && css.includes('var(--hero-scroll, 0) * 52px') && css.includes('.hero-field-card { translate:'), 'Hero uses stronger layered compositor-friendly scroll depth.');
check('mobile-motion-restraint', css.includes('@media (max-width: 767px)') && css.includes('.hero-field-card,') && css.includes('translate: none;'), 'Extra hero parallax is disabled on mobile.');
check('reduced-motion-restraint', css.includes('@media (prefers-reduced-motion: reduce)') && css.includes('translate: none !important') && css.includes('scale: 1 !important'), 'Extra parallax respects Reduced Motion.');
check('finite-cinematic-entry', css.includes('siteEntryExit 4300ms') && !/animation\s*:[^;]*infinite/i.test(css), 'Cinematic entry remains finite and bounded.');
check('shoreward-backwash-cycle', entrance.includes('site-entry__shore-wet') && entrance.includes('site-entry__backwash') && css.includes('siteEntryOceanSurge 3580ms') && css.includes('@keyframes siteEntryOceanSurge') && css.includes('@keyframes siteEntryWetSand') && css.includes('@keyframes siteEntryBackwash') && !css.includes('siteEntryOceanDrift 3580ms'), 'Primary water motion is shoreward/backwash rather than lateral sliding, with wet-sand interaction.');
check('natural-foam-breakup', entrance.includes('site-entry__ocean-foam--three') && entrance.includes('site-entry__foam-pockets') && css.includes('@keyframes siteEntryFoamBreakOne') && css.includes('@keyframes siteEntryFoamBreakTwo') && css.includes('@keyframes siteEntryFoamBreakThree') && css.includes('stroke-dashoffset'), 'Foam forms, breaks apart, and changes across multiple non-identical crest layers.');
check('mobile-ocean-performance', css.includes('.site-entry__ocean-svg { filter: none; }') && css.includes('.site-entry__foam-pockets ellipse:nth-child(n+4)') && css.includes('.site-entry__spray--7 { display: none; }'), 'Mobile reduces expensive ocean decoration while retaining the core motion story.');
check('no-persistent-will-change', !/will-change\s*:/i.test(css), 'No persistent will-change hints.');

const failures = checks.filter(x => x.status === 'FAIL');
const report = { generatedAt: new Date().toISOString(), summary: { total: checks.length, passed: checks.length - failures.length, failed: failures.length }, checks };
fs.mkdirSync(path.join(root, 'qa'), { recursive: true });
fs.writeFileSync(path.join(root, 'qa', 'final-experience-audit.json'), JSON.stringify(report, null, 2));
if (failures.length) {
  console.error(`Final experience audit FAILED (${failures.length}/${checks.length}).`);
  for (const f of failures) console.error(`- ${f.id}: ${f.detail}`);
  process.exit(1);
}
console.log(`Final experience audit passed (${checks.length}/${checks.length} checks).`);
