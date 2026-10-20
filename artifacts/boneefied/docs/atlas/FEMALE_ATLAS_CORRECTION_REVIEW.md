# Female Reproductive atlas correction — 18/19

Scope: Female Reproductive only. No app/package build, store submission, deployment, new system, or new anatomical plate.

## Published inventory and individual inspection

Publication union was assembled from lesson assets, visual questions, and each female structure's runtime atlas/glossary lookup, not from filenames alone. Exactly **3 plates**, **54 numbered targets**, and **65 structures** are published in this module. All three source plates were opened individually with numbered anatomical endpoint annotations, and their running-phone views were inspected individually.

| Image | Published title | Targets | Result |
|---|---|---:|---|
| `bvis06-17-female-gross.png` / `.svg` | Female internal organs: ovary, tube, uterus and vagina | 25 | Corrected source anatomy, two anatomical pointers, and compact centered callout framing. |
| `bvis06-18-ovary-follicle.png` / `.svg` | Ovary: follicle stages and follicle wall | 20 | Artwork/endpoints retained after individual inspection; corrected compact centered callout framing. |
| `bvis06-19-uterine-wall.png` / `.svg` | Uterine wall and endometrium | 9 | Corrected smooth-muscle pointer, secretory-gland depiction, and compact centered callout framing. |

All image paths are under `assets/images/anatomy/bvis06-atlas/`.

### 1. Female gross anatomy and enlarged uterine/cervical section

- Inspected uterus, fundus, body, cervical wall/canal, internal/external os, vagina and fornix; paired ovaries, tube segments and fimbriae; ovarian, suspensory and broad ligaments.
- Corrected the ovarian ligament's uterine attachment from the middle of the body toward the uterine horn, immediately below tube entry. Corrected the suspensory band to travel superolaterally toward the pelvic wall; supporting bands remain behind the ovary and fimbriae.
- Corrected the fundus/body color boundary to the level of the tube openings in both views.
- Exposed the enlarged section's intramural tube lumina through the wall to the uterine cavity instead of burying them behind the wall fill.
- Restricted the named fornix region to the cervical recesses rather than identifying the entire vaginal lumen as fornix. Existing valid fornix endpoints remain in the recesses.
- Revised the protected overlay regions to follow organs and ducts rather than treating the whole pale broad-ligament sheet as solid, inaccessible artwork.
- Anatomical target **13 (ovarian ligament)** changed from `(0.2207, 0.518)` to `(0.2097, 0.484)`. Target **14 (suspensory ligament)** changed from `(0.0883, 0.616)` to `(0.0786, 0.488)`. Both are verified against the actual 9-pixel drawn quadratic band, not only the wider semantic mask.
- The other **23** target coordinates, all numbers, structure identities, and legend order remain unchanged.

### 2. Ovary and follicle section

- Individually inspected cortex, medulla, vascular hilum, primordial/primary/secondary/antral/mature follicles, corpus luteum and corpus albicans.
- Inspected the enlarged follicle's theca externa/interna, granulosa, fluid-filled antrum, cumulus connection, corona radiata, zona pellucida and oocyte. The theca-cell endpoint is in the thecal wall, not in antral fluid.
- No source artwork or anatomical endpoint correction was necessary. All **20** coordinates and both original source-file hashes remain unchanged.
- Presentation changed: closer callouts, shorter gutters, centered undistorted complete artwork, and preserved separate touch cells.

### 3. Uterine wall and endometrial states

- Inspected functionalis/basalis, whole endometrium, uterine gland, myometrium, smooth muscle, perimetrium and the two endometrial states.
- Moved target **6 (smooth muscle of uterus)** from `(0.1228, 0.524)` to `(0.1352, 0.516)`, on the actual painted spindle center rather than the widened mask surrounding it.
- Made secretory glands visibly wider and coiled, distinct from the narrow, near-straight proliferative glands. Kept them within their panel, preserving the phase identification targets.
- The other **8** coordinates, numbers and legend identities remain unchanged.

## Framing and interaction verification

All three plates passed actual browser touch input at **390px/Default** and **320px/Large**:

- 1×: complete raster, all numbered circles and leader endpoints inside the square viewer; zero clipped or overlapping painted circles; every number matches its legend; correct 1450:1000 source aspect; centered raster.
- The first screenshot review exposed excessive callout gutters despite passing basic containment. The final female-only layout removes the extra inter-cell gap while retaining disjoint 44px study touch cells (60px question cells under Large text). Other systems retain their existing gap and framing behavior.
- A running-browser size assertion checks that the artwork occupies at least half the frame width, preventing the earlier tiny-image/long-gutter regression.
- Zoom in/out, real two-finger pinch, enlarged panning in both axes, measured stable pan clamps, parent-scroll isolation and Reset passed individually.
- Recall marker taps revealed the intended names after transformation.
- Runtime local foreground images had the expected dimensions. Source hash comparisons and final offline captures checked the actual study image, not a decorative background.
- Final 320px/Large screenshots of each remounted lesson were opened and visually inspected.

### Study questions

Exactly **53 published visual questions**: **49 hotspot**, **3 image-identification**, **1 ordered-sequence**.

All 53 were submitted successfully. All 49 hotspot answers were selected after actual 2× zoom and pan, with the parent scroll position unchanged. The final complete question pass used the revised callout layout at 320px/Large.

Fixed the legacy `q-visual-ovary` machine-ID answer alias in English and Spanish; its human-readable answer is retained. The three repaired endpoints propagate consistently into their generated question hotspots. No question/progress/structure IDs were replaced.

## Local assets, rights, offline and scope

- Only **two SVG/PNG source pairs** were regenerated: female gross and uterine wall. Ovary/follicle artwork remained byte-identical.
- Verified local image-manifest references and SVG/PNG SHA-256 agreement with provenance.
- All artwork remains original, matte Boneefied illustration. Existing source rights and factual-reference provenance are retained; no third-party image was imported, traced, or reproduced.
- The ovary and uterine-wall sections are explicitly teaching schematics, not photomicrographs. No real female reproductive micrograph is published in this union.
- The changed raster URLs receive female-only cache revisions; unrelated cached images are preserved.
- Actual lesson foreground image nodes were observed unmounting, then distinct new nodes rendered all three plates after networking was disabled. Learn and Recall foreground byte hashes matched the local source for **3/3** plates.
- This is **warm web-session offline evidence**, not a fresh offline launch or a physical native-device test.
- Canonical before/after comparison: no module or structure changes; only the two female asset records and four female questions changed. Number-to-legend identity and unrelated canonical content are preserved.
- **30 targeted regression tests passed**, including seven female tests, shared gesture/framing/control tests and actual thin-stroke endpoint checks. TypeScript passed.
- Metro served the app successfully. Its optional desktop React Native DevTools launcher reports a missing Linux shared library; it did not prevent the verified app/browser flows.

## Manual-redraw status and boundaries

**None of the three published plates remains flagged for manual redraw.**

There is no separate published vulvar/external-genital plate, round-ligament plate, or mesovarium plate in this module. These were not invented or added. Their absence is not evidence of an inspected illustration. Physical-device/native gesture and cold-offline verification remain outstanding; no build was created to obtain them.

Evidence: `generated-artifacts/atlas-female-repair/` contains before/after inventories and sources, canonical identity comparisons, Default/Large gesture results, all 53 submitted question results, foreground hashes, actual offline-remount evidence and the three final phone screenshots.

Work stops after Female Reproductive.
