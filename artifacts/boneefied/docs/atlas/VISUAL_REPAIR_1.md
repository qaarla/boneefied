# Visual Repair 1 — global marker sizing

## Completed scope

- Numbered anatomy markers use a shared sizing rule based on contained image width and full-diagram annotation count. Dense plates automatically get smaller visible circles.
- Typical default paint is 18–30 logical pixels, with proportional numerals, no internal painted padding, and the existing matte theme/contrast.
- Invisible interaction regions remain independent: at least 44px for module markers and 44/60px for normal/enlarged Practice. Existing callout placement geometry, anatomy coordinates, identifiers, and scoring are retained.
- Enlarged typography affects numeric paint explicitly, bounded within a 40px circle. Native Dynamic Type stays enabled; its multiplier is compensated to avoid scaling already-sized numerals twice. Reading text, full accessible names, and legends retain their normal scaling.
- Optional `Asset.hotspotSizeOverride` (`diameter`, `numeralSize`) is forwarded through module, glossary, and Practice. Diameter is a base logical-pixel value before typography scaling/safety bounds. No diagram override or anatomical adjustment was applied.

## Verification

TypeScript passed. All **128 tests passed** (124 existing + four marker-sizing tests).

| Browser-rendered phone case | Sparse renal-vessel plate (11) | Dense skull-base plate (20) |
|---|---:|---:|
| 390px, normal text; image width 348px | 25.39px paint | 23.14px paint |
| 320px, Large + supported 2.5× system-scale preview; image width 271px | 30.38px paint, 13.97px numeral | 27px paint, 12.42px numeral |

Both module hit regions measured 44×44px. Enlarged Practice measured a 60×60px hit region around a 29.63px circle. Outer-region clicks selected the intended Practice target without submitting an answer, and revealed/hid the intended Recall marker. Hidden Recall names stayed generic. Zoom, pan, and Reset passed.

An initial test used unsupported `qaFontScale=2`, which did not activate simulated system scaling. Only the enlarged cases were repeated in a fresh context using supported `qaFontScale=2.5`, with computed heading sizes confirming the scale. That corrected pass succeeded.

Evidence: `VISUAL_REPAIR_1_BROWSER_CHECKS.json`.

## Boundaries

No per-diagram tuning, diagram/target edits, question or answer-map changes, progress/storage changes, image/rights/provenance changes, offline implementation changes, website changes, build-configuration changes, new release builds, or publishing.

Phone-width checks are browser evidence, not a new physical-iPhone or offline test. Existing Android/iPhone build files were not rebuilt.
