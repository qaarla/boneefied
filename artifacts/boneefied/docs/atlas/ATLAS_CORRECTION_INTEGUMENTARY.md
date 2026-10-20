# Atlas correction — Integumentary System

## Bounded scope

Only the published Integumentary System visuals reachable from its lessons,
questions and glossary were included. Repeated lesson/Learn/Recall/question
uses do not count as additional plates.

- **6 visuals inspected individually; 55 panel-aware numbered annotations.**
- **1 plate corrected:** a single elastic-fiber endpoint in the dermis detail.
- **5 plates retained without changes.**
- All six original matte raster illustrations are unchanged.
- No content IDs, question IDs/answers/mappings, legend text/order/panels/radii,
  study progress, source credits or other sections were changed.
- No build, publication, native installation or shared-control redesign.

## Plate-by-plate review

| Published asset | Annotations | Source-art and endpoint finding |
|---|---:|---|
| `asset-openstax-historical-skin-structure` | 15 | Retained. Current artwork is the original Boneefied skin overview, **not OpenStax art despite its retained ID**. Reviewed epidermis/dermis/hypodermis, follicle versus shaft, sebaceous gland, arrector pili, root plexus, eccrine/apocrine glands, pore, tactile/free/lamellated receptors and vessels. Published targets fall on the depicted structures. |
| `asset-bvis04-epidermis-strata` | 15 | Retained. Reviewed five thick-skin strata, keratinocyte/melanocyte/Merkel/Langerhans examples, tactile corpuscle versus surrounding dermal papilla, and four thin-skin strata. Repeated structure IDs retain distinct panel-aware numbered annotations. No lucidum is shown or labeled on the thin-skin panel. |
| `asset-bvis04-dermis-hypodermis` | 8 | **One endpoint corrected.** Papillary/reticular dermis, dermal papilla, broad dermis region, pale collagen, dark elastic fibers, vessels and adipose region reviewed. The elastic-fiber endpoint was just above the actual dark line, inside pale collagen; it now ends on the elastic-fiber centerline. |
| `asset-bvis04-hair-follicle` | 8 | Retained. Reviewed exposed shaft, intrafollicular root, sheath, bulb, hair dermal papilla, sebaceous lobules/duct and arrector pili. Pointer targets distinguish adjoining tissues. |
| `asset-gray946-sweat-gland` | 5 | Retained. Current artwork is the original Boneefied eccrine/apocrine/sebaceous comparison, **not historical Gray art despite its retained ID**. Pore, eccrine coil, apocrine coil, sebaceous gland and sebaceous duct endpoints checked. |
| `asset-bvis04-nail-section` | 4 | Retained. Nail plate, underlying bed, proximal root under the fold and matrix targets checked against the longitudinal schematic. |

All source images measure 1450×1000 (aspect 1.45). Existing image-specific
anatomy-protection regions and compact dense-marker sizing were retained:
no source scaling distortion, raster replacement or cosmetic restyling was
introduced. All rendered labels are overlays, not baked-in answers.

## Exact correction and propagation

`asset-bvis04-dermis-hypodermis`, `elastic-fibers-skin`:

- Previous normalized endpoint: `(0.6897, 0.592)`.
- Corrected endpoint: `(1000 / 1450, 0.594)`.
- Actual 1450×1000 raster: approximately `(1000, 592)` → `(1000, 594)`.
- Enlarged contour review and an exact pixel check confirm the old point was
  pale collagen `#F9F1E8`; the new centerline is the dark elastic fiber
  `#6F4F66`. Pixel color supports this specific inspected contour; color alone
  was not used to certify all anatomy.

The immutable exact-coordinate repair reaches assembled asset labels and
hotspots, question-specific hotspots and raw/pre-catalog glossary objects in
the shared viewer. Other structures/views remain unchanged; applying the repair
again is a no-op.

## Provenance and local availability

All six current assets use `source-boneefied-bvis04-atlas` and retain the original
Boneefied artwork credit and schematic/not-photomicrograph distinction.
Historical asset IDs do not authorize displaying obsolete source attribution.
No third-party artwork was acquired or relabeled.

All six PNGs and SVG masters are local. Static bundle resolution is verified
against `content/bvis04-image-sources.generated.ts`; source/master provenance
remains in `assets/images/anatomy/bvis04-atlas/provenance.json`.

Native asset bundling is a source-level availability check, not proof of an
installed device working offline. Browser availability after opening images
uses the existing `boneefied-anatomy-v1` cache and is reported separately.

## Verification

- TypeScript check: passed.
- **32 automated tests passed**, covering this exact published inventory and
  local resolution, PNG aspect ratios, unchanged legends/IDs/radii, corrected
  endpoints across uses, thick/thin identities, existing atlas integrity,
  square-frame fitting and gesture-controller behavior.
- **6/6 actual browser plate checks passed; 0 partial, failed, unreachable or
  pending.** Full results are recorded in
  `generated-artifacts/atlas-integumentary-repair/browser-results.json`.
- Each plate passed zoom in/out, pinch response, horizontal/vertical zoomed
  touch panning with zero parent-scroll displacement, hidden-marker drag,
  reveal/hide and Reset. Ordinary 1× image/gutter swipes still scroll the lesson.
- All six were checked at **320px and 390px with the app's Large text setting**.
  Square 1× frames retained the complete artwork/annotations and 1.45 raster
  aspect. No horizontal page overflow was observed. All 55 visible Learn
  legend entries matched their exact numbered annotations. A representative
  390px Default-text check also rendered successfully; Large was restored.
- The corrected dermal elastic-fiber leader endpoint was measured within
  0.52 rendered pixels of its intended location.
- **6/6 images decoded successfully from the existing cache at 1450×1000, then
  rendered after genuine offline lesson remounts.** No target-image request
  failures or unavailable-image placeholders occurred. Connectivity was restored.
- Visible plate credits correctly identify Boneefied original artwork.
- The diagnostic enlarged source/target images are not app screenshots and do
  not by themselves prove current framing, parent-scroll isolation or offline
  rendering.

## Final counts and out-of-scope observations

- **Inspected: 6 visuals / 55 annotations.**
- **Corrected: 1 visual / 1 anatomical endpoint.**
- **Unchanged: 5 visuals.**
- **Remaining plate-specific problems found: 0.**

The browser pass also observed an unrelated decorative material request failing
while offline (`materials/boneefied-muscle-fibers-light.webp`); the six atlas
images continued to render. Direct-opening the module and pressing “Return to
library” produced a `GO_BACK`-not-handled warning. A cold direct `/settings`
load was blank, although Settings worked through the normal root-page button.
These navigation/background observations were recorded, not changed: they are
outside this bounded image-correction pass.

## Device boundary

No native device was built, installed, or tested. Browser touch emulation and
source-level bundle checks must not be represented as installed iPhone/Android
gesture or offline-device evidence. These source edits do not update an already
installed app.
