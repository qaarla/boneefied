# Atlas zoom source quality

## Active rendering path

The cardiovascular module's **Selected atlas plates** uses
`asset-bvis05-heart-anterior`, whose existing image module is
`assets/images/anatomy/bvis05-atlas/bvis05-01-heart-anterior.png` (2900 × 2000).
Previously `AnatomyImageViewer` drew that PNG through React Native Image and
transformed the image/annotation canvas. The authentic SVG (viewBox
`0 0 1450 1000`) existed but was not rendered by this path.

The viewer now resolves the existing image module through
`vector-image-sources.generated.ts` and renders the exact sibling SVG through
`SharpAtlasImage` / `react-native-svg`. Metro bundles the original XML locally
as source text; no external SVG request, conversion, tracing, raster upscaling
or sharpening is involved. Before rendering, only nonvisual Inkscape/Sodipodi
editor metadata and source-audit `data-*` attributes are omitted to avoid
invalid React DOM attributes. The viewer's actual labels and leaders use
unchanged separate metadata. All visible SVG elements and viewBoxes are preserved.
The registry is reproducible with
`node scripts/atlas/vector-sources.mjs`.

The SVG's layout dimensions grow with the actual zoom and scene-fit scale,
with an inverse local transform keeping its logical image rectangle unchanged.
This avoids stretching only a small native backing surface. Existing scene
geometry, marker/leader coordinates, gesture handling, controls, rounded image
mask and real-photo associations are unchanged.

There are 159 available SVG/PNG pairs in the repository, covering **154 of the
164 published image IDs**. The remaining five pairs are retained source aliases,
not five additional published illustrations.

## Raster-only source limits

These ten published images have no usable vector master or higher-resolution
same-frame original in the available source set. The existing source-resolution
and Servier source-match records were inspected. Review-sheet SVGs containing
embedded PNGs are not vector masters. No substitute crop, approximate redraw,
AI detail, or upscaled preview was used.

| Published image ID | Available native pixels | Limit |
|---|---:|---|
| asset-vertebral-column | 233 × 800 | Existing exact upstream original is already this small. |
| asset-original-cell-overview | 1200 × 900 | Only raster artwork available; review SVGs merely embed it. |
| asset-original-anatomical-planes | 1000 × 1000 | Only raster artwork available; review SVGs merely embed it. |
| asset-servier-pelvis | 256 × 294 | Previous publisher/vector-group inspection found no faithful vector match. |
| asset-commons-kidney-cortex-human | 3750 × 2399 | Already the genuine source original; finite microscope detail. |
| asset-commons-alveolar-sac | 2816 × 2112 | Already the genuine source original; finite microscope detail. |
| asset-openstax-spinal-cord-specimen | 1200 × 749 | Existing specimen crop retained; a different full-frame source would move targets. |
| asset-commons-simple-squamous-epithelium | 3264 × 1840 | Already upgraded to genuine full-resolution source. |
| asset-commons-simple-cuboidal-epithelium | 3264 × 1840 | Already upgraded to genuine full-resolution source. |
| asset-commons-simple-columnar-epithelium | 3264 × 1840 | Already upgraded to genuine full-resolution source. |

Native raster rendering now uses expo-image with downscaling disabled, allowing
the available source pixels to be used rather than deliberately reducing the
image to its initial viewport. This cannot add anatomical detail absent from
the source.

## Verification boundaries

- TypeScript and focused source/association checks passed.
- Both iOS and Android development JavaScript bundles were served successfully
  by Metro and contain the new renderer and original heart SVG.
- Development JavaScript compilation is not a native binary build and is not
  physical-device rendering evidence.
- A fresh 390 × 844 browser session verified the actual anterior heart,
  chambers/septa, valves, kidney cross-section and anterior skull at 4×.
  Their image surfaces contained inline SVG paths, not raster `<img>` elements.
  The anterior heart retained viewBox `0 0 1450 1000` and 29 paths; kidney
  cross-section retained 95 paths, and anterior skull retained 64 paths.
- The heart's zoomed SVG layout grew to 1135.67 × 783.22 pixels within the
  existing scene fit. Drag changed the canvas offsets to (40, 35); Zoom out
  reached 3.5× and Reset restored scale 1, zero offsets and a 324 × 223.45
  pixel SVG. Rounded clipping, labels/leaders and photo links remained present.
- The separate kidney-cortex specimen remained a loaded 3750 × 2399 raster.
  No detail beyond that genuine source is claimed.
- Browser inspection identified React diagnostics from nonvisual SVG metadata.
  After removing only those authoring attributes at render time, a fresh
  skeletal-page screenshot showed no unknown-prop errors or diagnostic toast.
  Visible geometry equivalence is covered by the source regression test.
- 55 focused source, gesture, framing, mask, marker and photo-reference checks
  passed. Browser rendering proof must not be described as physical iOS/Android
  device proof.
- Existing downloaded binaries are unchanged. No native builds or publishing
  are authorized by this repair.
