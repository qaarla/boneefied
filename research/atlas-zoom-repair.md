# Boneefied atlas: first-zoom source and rendering audit

## Scope and result

Audited all **164 images referenced by the current published lessons and
questions**, not a few example images. Each was checked against the effective
image registry, including its later overrides, and the actual vector lookup.
All six source contact sheets were visually inspected.

- **155 images have authentic SVG masters** and now draw at their actual zoomed
  display dimensions.
- **Nine images retain finite raster originals**; their dimensions and limits
  are listed below. No low-resolution image was enlarged as a purported repair.
- Every active image has an individual source path, dimensions, hashes, master
  association, renderer and limitation record in `atlas-zoom-source-audit.json`.
- Sources and source-page original-file dimensions were rechecked in
  `atlas-zoom-source-rechecks.json`.

## Shared rendering repair

The previous implementation still placed an inverse-scaled, enlarged SVG inside
the same scaled Animated canvas as the annotations. Availability of a vector
master did not eliminate that native layer-compositing dependency.

The image now paints **outside the scaled annotation canvas**. Its actual
width, height and position are computed from the same scene fit and
center-origin zoom as the annotations; pan uses their shared animated
translation. The SVG root has no inverse scale or scaled ancestor. Native
SVG therefore receives the actual displayed drawing dimensions instead of a
small surface that a parent enlarges. Raster decoding still forbids native
downscaling and uses the full genuine original.

The rounded image mask uses the same zoomed corner radius as before. Markers,
numbering, leaders, image aspect, gesture ownership, pan limits, reset policy,
controls, study modes, reference links and navigation were not redesigned.

## Newly recovered genuine source

The retained **Servier pelvis** was still only **256 × 294 pixels**.
It now has:

- A genuine path-based SVG extracted from the publisher's
  `SMART-Bone-fractures.pptx`, slide 7 group 2.
- A **2560 × 2940** fallback PNG rasterized directly from those vectors.
- Its original 256:294 normalized image frame, source identity, all seven
  anatomical target coordinates and existing CC BY 4.0 attribution.
- An explicit vector-registry association, so the viewer actually uses the new
  SVG rather than merely storing an unused master beside the old PNG.

The older automated thumbnail comparison rejected this candidate at MSE 0.0133.
That threshold was not weakened. Side-by-side manual review identified the same
publisher drawing and checked its seven target regions; the proof explicitly
distinguishes manual anatomical acceptance from an automated pixel match.
Reproduction script: `scripts/atlas/recover-pelvis-master.py`.
Source and output hashes: `assets/images/anatomy/pelvis-vector-recovery.json`.

## Finite raster originals — not claimed as restored vector detail

| Image | Current pixels | Available-source boundary |
|---|---:|---|
| Gray lateral vertebral column | 233 × 800 | The source page's original is also 233 × 800. No higher-quality exact source was verified. Clearly source-limited. |
| Original generalized cell | 1200 × 900 | No original vector master or larger genuine raster was located in the supplied source/history. Source-limited. |
| Original anatomical planes | 1000 × 1000 | No original vector master or larger genuine raster was located. Source-limited. |
| Spinal-cord micrograph crop | 1200 × 749 | Source-limited crop. The upstream 1642 × 1883 original is a composite of a labeled drawing and a micrograph, not an interchangeable larger version of this crop. Swapping it would change framing, labels and Recall behavior. Left intact. |
| Human kidney cortex | 3750 × 2399 | Already matches the genuine original-file dimensions. Full-resolution source retained. Finite at extreme zoom. |
| Alveolar sac | 2816 × 2112 | Already matches genuine original-file dimensions. Full-resolution source retained. Finite at extreme zoom. |
| Simple squamous epithelium | 3264 × 1840 | Already matches genuine original-file dimensions. Full-resolution source retained. Finite at extreme zoom. |
| Simple cuboidal epithelium | 3264 × 1840 | Already matches genuine original-file dimensions. Full-resolution source retained. Finite at extreme zoom. |
| Simple columnar epithelium | 3264 × 1840 | Already matches genuine original-file dimensions. Full-resolution source retained. Finite at extreme zoom. |

## Verification

- TypeScript passed; the full existing-plus-rendering regression suite passed
  all 363 tests at the coherent app-change checkpoint.
- Geometry regression covers every active image, portrait/square/landscape
  layouts, small phone widths, all normal zoom steps through 4×, pan offsets,
  image corners and anatomical label positions. Actual-size paint agrees with
  the original annotation transform to numerical tolerance.
- Every registered master was checked for true SVG artwork, without embedded
  raster images or foreign-object substitutes.
- Four targeted source/geometry tests also passed, including the complete
  runtime coverage and the recovered pelvis SVG/PNG hashes and dimensions.
- One browser interaction pass at 390 × 844 checked Cells & Tissues, heart,
  kidney section, dense skull-base and pelvic-girdle views: first zoom, 2×/4×,
  pan, reset, rounded clipping, marker/leader registration, Recall reveal/hide,
  Image details and preserved reference links. Vector examples appeared crisp.
- A narrow follow-up scoped the **exact retained Servier pelvis**, not the
  separate paired hip-bone atlas plate. Its SVG viewBox was `0 0 256 294`;
  the displayed surface grew from 202.5 × 232.56 to 303.75 × 348.84 on the
  first zoom and 810 × 930.23 at 4×. Pan moved image and marker together,
  Reset restored baseline geometry, and its CC BY 4.0 credit remained visible.
- Browser checks are **not physical iOS/Android visual proof**. No native
  builds, submissions or publishing were performed. Existing installed native
  binaries are not changed by this source-only repair.

Reproduce the complete per-image audit and contact sheets with:

```sh
node --experimental-strip-types artifacts/boneefied/scripts/atlas/audit-zoom-sources.mjs
```
