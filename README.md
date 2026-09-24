# V.East Corporate Website

Production-ready bilingual corporate frontend for **V.East | Sports & Tourism Facility Operations**, built with React, TypeScript, Vite, Tailwind CSS and Lucide icons.

## Current final experience

The website presents V.East's operating scope: facility management, sports/tourism operations, aquatic operations, rescue and safety, first aid, emergency planning, field supervision, sectors, leadership, direct contact, downloadable company PDFs, and an early **Featured Places / أماكن نتعامل معها** section.

Featured Places sits directly after the Hero and currently includes:
- **ELITE Beach**
- **Half moon**

Each venue uses a compact logo-first tile that opens an accessible profile dialog with conservative public information, contact points, direct links, location access and local imagery. Unsupported ratings, prices, capacities, ownership, exclusivity and contract claims are intentionally omitted.

## Motion and visual system

- Cinematic V.East entrance with layered shoreward ocean motion, backwash, irregular foam breakup, shoreline/wet-sand detail, spray, caustics and water texture.
- Logo starts as a close brand focal point and resolves into the centered composition with orbit rings, tracking markers, horizon/sweep layers and the V.EAST wordmark.
- Entrance motion is preserved on phone, tablet and desktop, with lighter mobile effects instead of removing the experience.
- Hero content uses frame-rate-independent scroll interpolation with cached measurements, requestAnimationFrame scheduling and transform-only compositor motion.
- Reduced Motion suppresses nonessential spatial movement.
- Animated day/night control drives the real persisted Light/Dark theme.
- Active navigation pill tracks the real visible section.
- The final high-FPS pass removes realtime SVG displacement/filter work from the animated ocean hot path, collapses most ocean movement onto compositor layers, removes moving backdrop blur from key hero/header elements, and avoids layout-dimension animation in the sticky header.
- No infinite decorative loops, persistent will-change, or animated filter effects are required for the experience.

## UX / accessibility

- Complete Arabic + English catalog with persisted language preference.
- Root-level `lang` + `dir`: Arabic RTL and English LTR.
- Real persisted Dark + Light themes with distinct visual systems.
- Responsive layouts from 320px phones through tablets, laptops and 1920px desktops.
- Mobile navigation with Escape handling and bounded body scroll behavior.
- Venue dialogs use a React portal, semantic dialog naming, focus trap, Escape/backdrop close, body-scroll lock, background `inert`, initial focus and trigger-focus restoration.
- High Contrast / Forced Colors support.
- 44px minimum project touch-target gate for Featured Places interactions.
- Text-spacing and zoom/reflow coverage.
- Floating PDF/WhatsApp controls become non-interactive when they would cover the Contact section.
- Local production imagery only; no AI watermark/generator residue.

## Verified production evidence — 2026-09-24

The current production source and live site have completed the real dependency-installed and browser verification gates:

- Source verification: **PASS** (34 text files checked).
- World-class source audit: **77/77 PASS**.
- Final-experience source audit: **24/24 PASS**.
- TypeScript `tsc --noEmit`: **PASS**.
- Vite production build: **PASS**.
- Live browser E2E: **PASS**, including explicit intro/scroll frame-cadence checks and **0 console/page errors**.
- Responsive/theme/language legacy matrix: **60/60 PASS**.
- Venue profile/modal matrix: **32/32 PASS**.
- 44px touch-target matrix: **48/48 PASS**.
- Contrast + Forced Colors + Reduced Motion: **12/12 PASS**.
- Accessibility media: **24/24 PASS**.
- Text spacing/reflow: **24/24 PASS**.
- Semantic/accessibility: **12/12 PASS**.
- Keyboard/focus: **12/12 PASS**.
- Security/SEO: **13/13 PASS**.
- Asset decode: **9/9 PASS**.
- Representative runtime image loading: **2/2 PASS**.
- DOM/performance matrix: **4/4 PASS**.
- Dedicated responsive animation matrix: **186/186 PASS** across phone/tablet/desktop, Arabic/English and Dark/Light.
- Dedicated sea-motion production gate: **PASS** on desktop and mobile.
- Measured hosted-Chromium cadence: intro **30 frames / 1.1 s**, median **33.3 ms**, p95 **50 ms**, slow-frame ratio **0.10** on a ~30 Hz hosted runner; scroll motion **54 frames / 0.9 s**, median/p95 **16.7 ms**, slow-frame ratio **0**.
- Public production URL resolution: **PASS** for `https://v-east.vercel.app/`.
- Vercel Git deployment status: **success**.

## Commands

```bash
npm install --no-audit --no-fund --package-lock=false
npm run verify:source
npm run verify:worldclass
npm run verify:final-experience
npm run lint
npm run build
```

The permanent GitHub production verification workflows additionally exercise the deployed site with a real Chromium browser and bounded timeouts so browser failures cannot hang indefinitely.

## Release evidence

Runtime evidence is produced by:
- `.github/workflows/live-production-gate.yml`
- `.github/workflows/sea-production-gate.yml`
- `.github/workflows/package-source.yml`

The exact-source packaging workflow verifies source/lint/build again, archives the tracked GitHub HEAD, runs ZIP integrity validation and publishes the archive together with its commit ID and SHA-256.
