# Atlas correction: Cells & Tissues, Cytology / Mitosis, Anatomy Foundations

## Scope and counting

The assembled published catalog is authoritative. Include an asset when a
published lesson, question, or glossary structure in one of these three modules
can reach it. Count a PNG and its SVG master as one illustration; repeated Learn,
Recall, glossary and question uses are not additional illustrations.

- **19 illustration asset identities inspected individually; 103 numbered labels.**
- **2 illustrations changed** (drawing, corresponding endpoints, aspect metadata
  and anatomy-protection regions).
- **17 illustrations retained** after inspection.
- Three genuine epithelial microscopy photographs remain separate, unchanged
  histology assets. They are not counted as schematic illustrations.
- No canonical structure IDs, asset IDs, question IDs, answer keys, legend order,
  label text, or question-to-image mappings were changed.
- No other module, website, publication or native build is part of this work.

## Individual source-art and endpoint review

Review used each actual source raster, enlarged detail where needed, its
source-normalized published targets and its editable master when available.
The early contact sheets are diagnostic anchor reviews, **not** screenshots of
the app or evidence of current viewer fit.

| Published illustration | Labels | Result and anatomical review |
|---|---:|---|
| `asset-atlas-anterior-position` | 10 | Retained. Head, neck, chest, axillary fold, upper arm, forearm, abdomen, thigh, patella and leg endpoints remain on their depicted regions. |
| `asset-atlas-posterior-position` | 8 | Retained. Posterior head/neck, dorsal trunk, upper arm, forearm, thigh, popliteal and crural targets correspond to the back view. |
| `asset-atlas-body-planes` | 3 | Retained. Separate sagittal, coronal and transverse panels; targets fall on the respective colored planes, away from ambiguous intersections. |
| `asset-atlas-body-cavities` | 10 | Retained. Sagittal cavity locations, diaphragm, retroperitoneal kidney, continuous posterior vertebral canal and the three distinct serous-inset layers/spaces checked. |
| `asset-atlas-abdominal-quadrants` | 4 | Retained. Four quadrants match the subject's right/left, not the viewer's right/left. |
| `asset-atlas-abdominal-regions` | 9 | Retained. Three-by-three regions and exact numbered order checked; umbilical target is in the middle region. |
| `asset-atlas-organ-locations` | 9 | Retained. Brain, lungs, heart, liver, stomach, spleen, pancreas, retroperitoneal kidney and bladder correspond to the simplified whole-body view. Detail is schematic, not diagnostic cross-sectional anatomy. |
| `asset-original-cell-overview` | 8 | Retained. Membrane, cytoplasm, nucleus, nucleolus, mitochondrion, smooth ER, Golgi and centrosome endpoints checked against the actual colored structures. Broad generalized-cell schematic, not microscopy. |
| `asset-original-mitosis-stages` | 5 | **Corrected art and all five endpoints.** Removed the misleading extra single-nucleus stage. Interphase now has diffuse chromatin, not a condensed X; prophase has condensed duplicated chromosomes and a fragmenting envelope; metaphase has equatorial duplicated chromosomes; anaphase has four separated daughter chromosomes moving toward each pole; telophase has two reforming nuclei/decondensing chromatin and an early cleavage furrow. Four chromosomes are a teaching simplification, not the human chromosome count. |
| `asset-original-anatomical-planes` | 3 | Retained. Red mid-sagittal strip, broad blue coronal plane and yellow transverse plane are correctly distinguished; targets avoid their common intersection. |
| `asset-original-body-cavities` | 5 | **Corrected art and all five endpoints.** The old neck-only vertebral region was misleading. Reused the existing original matte sagittal figure, without the serous inset, at a uniform scale. The vertebral canal now continues posterior to the trunk cavities. The same five exact legend identities remain in the same order. |
| `asset-bvis04-epithelia-simple` | 4 | Retained. One flattened/cuboidal/columnar layer, apical versus basal orientation, and basement-membrane endpoint checked. |
| `asset-bvis04-epithelia-stratified` | 4 | Retained. Pseudostratified cells with varied nuclear heights, goblet cell, keratinized surface and nonkeratinized stratified tissue checked. |
| `asset-bvis04-epithelia-other-stratified` | 3 | Retained. Stratified cuboidal and columnar layers and transitional intermediate/umbrella cells checked. |
| `asset-bvis04-connective-loose` | 5 | Retained. Areolar field, thick pale collagen, thin elastic fiber, adipose cells and reticular mesh targets checked separately. |
| `asset-bvis04-connective-dense` | 3 | Retained. Parallel regular bundles, interwoven irregular bundles and prominent elastic fibers match the three tissue targets. |
| `asset-bvis04-cartilage` | 4 | Retained. Hyaline matrix, lacunar space, elastic cartilage and collagen-rich fibrocartilage checked. The published lacuna endpoint is already in the pale space beside the chondrocyte; the older generator's nucleus-centered coordinate was not substituted for the runtime target. |
| `asset-bvis04-muscle-tissue` | 4 | Retained. Striated skeletal fibers, branching cardiac fibers, intercalated disc and nonstriated spindle-shaped smooth cell targets checked. |
| `asset-bvis04-nervous-tissue` | 2 | Retained. Neuronal soma and neuroglial figure endpoints checked; simplified myelinated axon and glial examples remain explicitly schematic. |

All 103 published labels are runtime overlays. The two corrected SVG masters
contain no rendered text or numbers, so Recall does not falsely hide baked-in
answers. Existing genuine photograph identities and credits remain unchanged.

## Implementation and provenance

Both corrected raster filenames and asset identities are retained. Editable
masters and exact PNG/SVG SHA-256 hashes:

`assets/images/anatomy/foundations-corrections/provenance.json`

Regeneration (only these two diagrams; not an application build):

```sh
node scripts/atlas/generate-foundations-corrections.mjs
```

The cavity figure is original Boneefied foundational artwork, isolated and
uniformly scaled, not traced or imported third-party art. The mitosis drawing is
original Boneefied vector work from anatomical facts. Existing original-art
ownership remains in force. Factual references are recorded in provenance.

Final target correction is applied consistently to raw/pre-catalog glossary
objects, assembled asset labels/hotspots and question-specific hotspots. It is
idempotent and preserves exact legend identity, order, authored text and radii.
Updated protection regions are shared by the viewer's actual tuning lookup,
not merely attached to unused metadata on a catalog object.

## Verification

- TypeScript check passed.
- 46 automated tests passed: bounded runtime inventory, original-art provenance,
  exact legends/targets, immutable/idempotent repairs, shared square framing and
  gesture-controller regressions, foundational/tissue pack integrity, catalog
  reachability/rights and large-text legend behavior.
- Touch-enabled Chromium: **19 inspected, 19 passed, 0 failed, 0 unreachable,
  0 pending**, with the app's actual Large text setting enabled. Every diagram
  has 320px frame/raster measurements and matching Learn legend counts, plus
  390px Recall/gesture results. All frames were square; the actual source raster
  ratios were preserved, including the corrected portrait cavity plate.
- Per-plate checks covered zoom-in/out controls, pinch response, two-axis touch
  pan at sufficient magnification, Recall hide/reveal, drag-without-reveal and
  Reset to identity. The original cell overview and dense-connective schematic
  received a focused 2× pan recheck; both moved on X/Y and reset correctly.
- Browser interaction evidence:
  `generated-artifacts/atlas-foundations-repair/browser-results.json`.
- The first browser attempt reached Settings and selected the actual Large
  text setting, but the Expo host then returned HTTP 502 before any diagram was
  inspected. This attempt is **not** counted as a diagram pass. The managed Expo
  service was restored and its HTTPS status returned 200 before resuming.

## Remaining issues and boundaries

- **Observed unresolved diagram-art/endpoint defects: 0.**
- **One minor shared presentation issue remains:** in Large text, the five-action
  Recall control row can wrap the word “Reset” across lines at 390px. The control
  remained responsive. No shared control redesign was included in this bounded
  per-illustration correction.

**Physical-device boundary:** browser touch emulation and unit tests do not
prove installed iPhone/Android gestures or accessibility scaling. No native
build, installation, store submission, or offline-device test was performed.
The previously installed application has not been updated by these source edits.
