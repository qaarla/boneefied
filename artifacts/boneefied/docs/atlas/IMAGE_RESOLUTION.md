# Anatomy image resolution

## Target

Two Zoom in presses mean **2×**, not 4×: the existing viewer adds 0.5 per
press. Improve the source artwork for this zoom level on high-density iPhones
without changing the anatomy, IDs, questions, progress, or normalized markers.
This is not a promise of unlimited raster zoom.

## Completed source upgrades

- All **149** main original atlas plates: unchanged SVG masters rendered
  directly to **2900 × 2000** PNGs, previously 1450 × 1000.
- Two additional original vector diagrams: mitosis **2900 × 2000** and
  body cavities **1600 × 2200**.
- The three epithelial specimen photographs: authentic full-resolution
  **3264 × 1840** source JPEGs, previously 1280 × 722 previews. No synthesis,
  sharpening, interpolation, or lossy re-encoding was applied to these originals.
- The two public-domain skeleton diagrams: original upstream SVGs recovered
  and rasterized at three times the previous dimensions.
- Six older Servier illustrations (elbow, heart, kidney, thyroid, ovary,
  uterus): recovered from the publisher's editable PowerPoint vectors, not
  traced from the small PNG. Existing publisher thumbnails were first matched
  pixel-for-pixel; candidate vector renders were compared to those thumbnails.
  The exports preserve the prior content bounds and aspect ratio, and retain
  their existing CC BY 4.0 attribution.

The atlas generators now export at 2× so subsequent anatomical corrections do
not silently restore small rasters. SVG geometry remains in its original
logical coordinates. PNG hashes in the relevant provenance files were updated.

## Remaining source limits

Do **not** describe every legacy image as newly high-resolution.

- Three Gray plates (vertebral column, posterior heart, posterior abdominal
  wall) remain at the original resolution currently supplied by their source.
- Cell overview and the older anatomical-planes diagram have no genuine local
  vector master.
- The spinal-cord photograph and three unlabeled hand/foot crops were not
  blindly replaced by the full source page images: those have different fields
  and would invalidate the existing markers or mix in labeled diagrams.
- Stomach section, lymph-node section, and pelvis have publisher source decks,
  but no sufficiently faithful render was recovered. The male reproductive
  illustration's exact editable publisher source was not located. Those
  images were deliberately retained rather than substituted or redrawn.
- Three additional source-original plates (pelvic floor, historical heart
  valves, historical peritoneum) are below the full pixel budget for a
  350 × 250-point image box at 2× on a 3× display. The pelvic-floor shortfall is
  small; the peritoneum image is substantially limited.
- Other already-larger images remain at their authentic upstream resolution.

The **16** source-limited legacy images above still need suitable originals
or separately reviewed replacement artwork to meet the same sharpness target.
Ordinary enlargement cannot restore their missing detail.

## Reproducibility and evidence

- `scripts/atlas/export-resolution.mjs`: direct re-export of approved in-house
  masters; does not regenerate anatomy or annotation geometry.
- `scripts/atlas/upgrade-external-resolution.mjs`: exact Wikimedia source
  upgrades, retaining crops. Review `assets/images/anatomy/source-resolution.json`.
- `scripts/atlas/upgrade-servier-resolution.py` and
  `servier-vector-source.py`: publisher-source recovery. Unsupported vector
  primitives and poor visual matches fail closed. Review `servier-resolution.json`.
- Downloaded source decks and review output are in the ignored
  `generated-artifacts/image-resolution/` directory, not Git history.
- Changed image hashes are included in the web cache identity so a stable
  Metro asset URL does not continue serving an older cached thumbnail.
- Automated checks verify dimensions, hashes, source identity, and preserved
  source/marker aspect ratios. They do not constitute installed-iPhone visual
  or memory testing.

These are source changes only. Existing installed apps do not receive new
bundled images until an updated native build is delivered and installed.
