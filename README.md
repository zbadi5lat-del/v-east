# V.East Corporate Website

Production-oriented bilingual corporate frontend for **V.East | Sports & Tourism Facility Operations**, built with React, TypeScript, Vite, Tailwind CSS and Lucide icons.

## Current final experience

The website presents V.East's real operating scope: facility management, sports/tourism operations, aquatic operations, rescue and safety, first aid, emergency planning, field supervision, sectors, leadership, direct contact, and an early **Featured Places / أماكن نتعامل معها** section.

The Featured Places section sits directly after the Hero, so it is prominent without replacing the main brand introduction. It currently includes:
- **ELITE Beach**
- **Half moon**

Each venue has a modern openable card and a focused detail dialog with conservative public information, contact points, direct links, location access, and local imagery. No unsupported rating, price, capacity, exclusivity, ownership, or contract claim is displayed.

## UX / design capabilities

- Complete Arabic + English catalog with persisted language preference.
- Real root-level `lang` + `dir` switching: Arabic RTL and English LTR.
- Real Dark + Light themes with persisted preference.
- Distinct visual systems: Deep Navy / Warm Sand at night and Coastal Daylight / Maritime Teal in light mode.
- Video-inspired animated day/night theme scene.
- Video-inspired active navigation pill driven by actual section scroll state.
- Branded short site-entry motion with reduced-motion bypass.
- Responsive layout from narrow phones through wide desktop.
- Modal venue profiles implemented through a React portal with focus trap, Escape close, background `inert`, body-scroll lock, backdrop close, initial focus and trigger-focus restoration.
- High contrast / Forced Colors support.
- 44px project touch-target quality bar for the new Featured Places interactions.
- Local imagery only for production UI; no AI-generated venue imagery and no AI watermark/generator residue.

## Current hard-test evidence

All locally executable hard gates for the current bytes are passing:

- Responsive / language / theme matrix: **60/60 PASS**.
- Venue modal matrix: **32/32 PASS**.
- 44px Featured Places touch-target matrix: **48/48 PASS**.
- Contrast / Forced Colors / Reduced Motion: **12/12 PASS**.
- Text spacing / reflow: **24/24 PASS**.
- Semantic accessibility: **12/12 PASS**.
- Keyboard / focus source gate: **12/12 PASS**.
- Security / SEO integrity: **13/13 PASS**.
- Asset decode integrity: **9/9 PASS**.
- Representative asset runtime loading: **2/2 PASS**.
- Arabic/English catalog: **318 / 318 leaves**, with 0 missing, 0 empty, 0 Arabic leakage into English, and 0 unexpected untranslated duplicates.
- Strict TypeScript source check using isolated temporary dependency stubs: **0 errors**.
- Static performance budgets: PASS; production assets are ~679 KB total and QA CSS is ~100 KB.

Detailed evidence lives in `qa/current-places/`.

## External runtime gate

The current execution environment cannot reach the npm registry. npm logs show `EAI_AGAIN`, and `node_modules` is unavailable. Therefore the dependency-installed Vite gates remain explicitly:

`BLOCKED_EXTERNAL_DEPENDENCIES`

This means the following are not falsely claimed as verified in this environment:
- `npm run lint` using the real package-installed Vite types;
- `npm run build` using the real local Vite package;
- hydrated Vite preview/runtime smoke.

The current source itself has passed the independent strict TypeScript check and the full static-browser hard-test suite described above.

## Commands when dependency access is available

```bash
npm install --no-audit --no-fund
npm run verify:source
npm run verify:worldclass
npm run lint
npm run build
npm run preview
```

## Release evidence

- `QA_REPORT.md`
- `QA_WORLD_CLASS_REPORT.md`
- `FINAL_QUALITY_SCORECARD.md`
- `FINAL_REQUIREMENT_MATRIX.md`
- `STANDARDS_BENCHMARK_20260924.md`
- `qa/current-places/FINAL_EVIDENCE_SUMMARY.json`
- `qa/current-places/PLACES_SOURCE_NOTES.md`
- `SOURCE_SHA256_FINAL.txt`
- `PACKAGE_SHA256_MANIFEST.txt`
