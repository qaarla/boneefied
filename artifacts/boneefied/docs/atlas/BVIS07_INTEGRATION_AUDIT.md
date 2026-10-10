# BVIS07 — final 2D visual integration and coverage audit

## Scope and counting rule

Introductory college anatomy: minimum core content plus modest depth, with visuals used inside meaningful questions. No new illustration collection, decorative expansion, 3D, website change, application release build, deployment, or publication.

“Published” below means an existing module's catalog flag, **not a new app-store or web release**. Count unique visual IDs reachable from published lessons, questions, or glossary atlas references. A plate's PNG and SVG master count as one visual. Shared context images may occur in more than one module; module rows therefore must not be summed to obtain the unique visual total.

## Exact final catalog counts

| Measure | Count |
|---|---:|
| Reachable published study visuals | **164** |
| Original Boneefied artwork, total | **153** |
| Original atlas vectors created in BVIS01–06 | **149** |
| Pre-existing original study diagrams | **4** |
| New plates added in BVIS07 | **0** |
| NIH/NIAID BioArt public-domain visuals | **0** |
| Servier-derived visuals | **2** |
| Other verified public-domain / CC0 visuals | **6** |
| Other verified licensed visuals | **3** |
| 2D diagrams | **158** |
| Genuine histology/specimen-section images | **6** |
| Genuine gross-anatomy specimen photographs | **0** |
| Questions with an actual image reference | **886** |
| Hotspot questions | **747** |
| Total playable questions | **1,595** |
| Published modules with visual coverage | **18 / 18** |
| Registered assets, including retired records | **187** |
| Retired registered assets excluded from published count | **23** |

License breakdown reconciles exactly: 153 originals + 0 BioArt + 2 Servier + 6 other public-domain/CC0 + 3 other licensed = 164.

The six other public-domain/CC0 visuals are the historic vertebral-column drawing, two blank LadyofHats skeletal diagrams, and three Berkshire Community College epithelial photomicrographs. The three other licensed visuals are Josef Reischig kidney microscopy (CC BY-SA 3.0), Jpogi alveolar microscopy (CC BY-SA 4.0), and the OpenStax spinal-cord section (CC BY 4.0). Schematics are not counted or labeled as genuine microscopy.

## Published-module coverage

| Module | Visual references | Image-backed questions | Hotspot questions |
|---|---:|---:|---:|
| Cells & Tissues | 12 | 27 | 1 |
| Lymphatic System | 6 | 56 | 50 |
| Cytology / Mitosis | 2 | 5 | 1 |
| Skeletal System | 29 | 49 | 49 |
| Anatomy Foundations | 9 | 6 | 5 |
| Joints & Ligaments | 6 | 5 | 5 |
| Muscular System | 21 | 90 | 71 |
| Nervous System & Brain | 13 | 74 | 62 |
| Integumentary System | 6 | 22 | 20 |
| Special Senses | 10 | 41 | 36 |
| Endocrine System | 6 | 45 | 39 |
| Blood & Cardiovascular System | 11 | 86 | 74 |
| Blood Vessels and Circulation | 11 | 56 | 45 |
| Respiratory System | 8 | 75 | 67 |
| Digestive System | 12 | 93 | 82 |
| Urinary System | 8 | 59 | 50 |
| Male Reproductive System | 2 | 44 | 41 |
| Female Reproductive System | 3 | 53 | 49 |

## Detailed coverage matrix and inventory

- [270-category coverage matrix](BVIS07_COVERAGE_MATRIX.md)
- [Spreadsheet-readable matrix](BVIS07_COVERAGE_MATRIX.csv)
- [Machine-readable inventory, licensing, SHA-256 hashes, references, and uncovered target IDs](BVIS07_REPORT.json)

The matrix includes high-priority structure counts, direct versus contextual support, diagram versus genuine specimen classification, Learn labels, Recall suitability, meaningful visual-question IDs, provenance/rights, and phone-check status. Direct labels do not imply complete coverage of every deeper term in a category. Minor developmental, biochemical, or advanced terms can remain context-supported or text-only; they are explicitly listed rather than disguised as completed visual coverage.

## Small integration corrections

- Corrected the kidney-placement drawing's disconnected ureter ends so both join the bladder. Made its peritoneal-boundary line match the documented dashed cue. Re-exported the existing vector plate and its provenance; added no new plate.
- Used the same caption/source treatment across module galleries, expanded atlas lessons, glossary atlas references, and graded image questions. Long addresses are behind named Source / Rights links, not embedded in image captions. Credits and license notices remain intact.
- Explicitly distinguish 2D diagrams, genuine photomicrographs, anatomical specimen photographs, and teaching models. Source links have at least 44px-high targets.
- Kept full study descriptions out of unanswered visual questions and Recall. Graded questions show the actual illustration's source and context after submission.
- Corrected canonical-ID sequence answer feedback without changing legacy name-based sequences. Neutral read-only image markers do not disclose answer order; visible options and feedback use localized structure names.
- Extended active-source filtering to BVIS06 so retired illustrations are not presented as the displayed artwork's credit.
- Updated assembled manifest totals and stale BVIS06 count/source/resolver test expectations. Foreign contextual labels retain the dedicated glossary destination of their own system.
- Fixed hidden Recall marker accessibility names so a screen reader cannot announce the answer before reveal. Showing/hiding the marker updates its accessible name accordingly.
- Added explicit localized Zoom in / Zoom out controls for inline inspection, retained mouse/touch panning and Reset, and placed controls below the image at all text sizes to prevent marker overlap. Inspection remains inline; no enlarged gallery/modal was added.

## Duplicates, archives, missing references, and rights

- No duplicate published image bytes; no duplicate asset/question/source IDs.
- No missing local catalog files or static resolver IDs, broken question/lesson/glossary asset references, invalid target IDs, or unverified published asset/source flags found.
- Kept all 23 retired registered asset records. They are not unresolved orphan IDs.
- Recorded an additional **21 superseded historical raster files** outside current registered paths: **9** remain inputs of overwritten legacy static resolver entries; **12** are neither registered nor resolved. They are not published study visuals. They were inventoried, not silently deleted.
- SVG authoring masters and provenance documents are not duplicate study visuals or orphan images.
- Existing imported-media creator/license records and exact source/rights links were audited; BVIS07 is not a new live-web license survey or legal certification. No new third-party artwork or specimen acquisition occurred.

## Verification and limits

- TypeScript type check passed.
- Final complete run: **124/124 tests passed**, including the 119 existing catalog/regression tests and five new BVIS07 audit tests.
- Focused catalog examples cover skeletal, muscular, nervous, cardiovascular, respiratory, digestive, urinary, male/female reproductive, and genuine histology. Correct English/Spanish answers grade successfully.
- Every annotated atlas has disjoint, in-bounds callout geometry at 273/343px content width and 44/60px control sizes.
- Reviewed the current renal-corpuscle, abdominal-placement, corrected kidney-placement, and corrected female uterine-detail renders. Earlier BVIS06 render review covered the remaining plates.
- Local static image inputs and hashes are verified. This does **not** prove physical native-device offline rendering or browser offline caching.
- One focused browser pass checked the nine requested anatomy examples plus genuine kidney histology, Learn/Recall, image-target taps, bottom-dock clearance, English/Spanish urinary-sequence grading, and 320px enlarged-text layout. Brief initial blank states resolved after fonts/hydration; no fatal page errors were observed.
- A follow-up checked **only** the two corrected viewer issues: hidden/revealed accessible names, explicit zoom to 1.5×, mouse pan to offset (40,30), Reset to scale 1/offset (0,0), controls below markers, and a wrapping control row with no horizontal overflow at 320px enlarged text. The follow-up passed.
- Browser evidence is recorded separately in `BVIS07_BROWSER_CHECKS.json`; it is web-only, not native-device or offline testing.
- The optional React Native DevTools executable reports a missing system library in workflow startup. Metro and the app run, and the browser checks found no fatal application errors; no unrelated package/toolchain changes were made.

The bounded audit stops here. No release build, app-store submission, deployment, or publication was performed.
