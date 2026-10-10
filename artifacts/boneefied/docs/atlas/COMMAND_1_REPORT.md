# Boneefied Visual Command 1

## Exact assets and placements

All stems below live in `artifacts/boneefied/assets/images/anatomy/atlas/`, each as an editable `.svg` master and a bundled `.png`. There are **10 plates, 10 SVGs, and 10 PNGs**, all 1450 × 1000. Asset IDs use `asset-atlas-` followed by the descriptive stem without its `atlas-NN-` prefix.

| File stem | Existing Study lesson IDs |
| --- | --- |
| `atlas-01-anterior-position` | `foundations-position-directions`, `foundations-surface-regions` |
| `atlas-02-posterior-position` | `foundations-position-directions`, `foundations-surface-regions` |
| `atlas-03-body-planes` | `foundations-planes-sections` |
| `atlas-04-body-cavities` | `foundations-body-cavities`, `foundations-serous-membranes` |
| `atlas-05-abdominal-quadrants` | `foundations-abdomen-map` |
| `atlas-06-abdominal-regions` | `foundations-abdomen-map` |
| `atlas-07-organ-locations` | `foundations-organization`, `organ-map` |
| `atlas-08-skeleton-anterior` | `skull-orientation`, `thoracic-cage`, `limb-girdles`, `limb-bones` |
| `atlas-09-skeleton-posterior` | `vertebral-column`, `thoracic-cage` |
| `atlas-10-skeleton-axial-appendicular` | `limb-girdles`, `limb-bones` |

The first seven appear in the Anatomy Foundations gallery; the last three appear in the Skeletal System gallery. Their corresponding expanded lesson cards also show the atlas plates directly. Learn, Recall, and questions reuse these same PNGs; no alternate answer-labelled image variants are needed. The files contain no baked answer text.

Search results already lead to glossary details. Matching glossary rows now advertise atlas availability, and the existing detail viewer displays relevant plates. Physical markers associate body regions, planes, individual cavities, quadrants, nine regions, organs, and bones. Context associations additionally cover anatomical position, anterior/posterior, midsagittal plane, and dorsal/ventral/abdominopelvic cavities without inventing physical marker positions for those concepts.

## Provenance and rights

Every plate is original Boneefied project vector artwork, authored from geometric shapes rather than traced or imported illustrations. No new OpenStax, NIAID, Servier, stock, web-photo, or Gray illustration was copied into this pack. The recorded rights notice retains original-project rights, with no CC0/public-domain dedication.

Machine-readable per-plate records: `assets/images/anatomy/atlas/provenance.json`. Records include creator, original-authorship/modification notice, SVG/PNG paths and SHA-256, dimensions, orientation, instructional purpose, label/hotspot coordinates, and factual-reference URLs/publishers checked on 2026-10-10.

Text-only factual references:

- NCI SEER, Anatomical Terminology: https://training.seer.cancer.gov/anatomy/body/terminology.html
- NCI SEER, Axial Skeleton: https://training.seer.cancer.gov/anatomy/skeletal/divisions/axial.html
- NCI SEER, Appendicular Skeleton: https://training.seer.cancer.gov/anatomy/skeletal/divisions/appendicular.html
- NCI SEER, Membranes: https://training.seer.cancer.gov/anatomy/cells_tissues_membranes/membranes.html
- MedlinePlus, Abdominal Quadrants: https://medlineplus.gov/ency/imagepages/19578.htm
- NCI SEER glossary, Anatomic Regions of the Abdomen: https://seer.cancer.gov/seertools/glossary/view/55116b6be4b0c48f31dbe7f7

These references support anatomy facts; they do not grant permission to reuse the illustrations on those pages. The new drawings are schematic educational overviews, not clinician-reviewed diagnostic plates.

## Exact new questions

All six are `hotspot` tasks using the original base PNGs:

| Question ID | Module | Base plate |
| --- | --- | --- |
| `q-atlas-plane-coronal` | `anatomy-foundations` | `asset-atlas-body-planes` |
| `q-atlas-quadrant-ruq` | `anatomy-foundations` | `asset-atlas-abdominal-quadrants` |
| `q-atlas-pleural-cavity` | `anatomy-foundations` | `asset-atlas-body-cavities` |
| `q-atlas-organ-spleen` | `anatomy-foundations` | `asset-atlas-organ-locations` |
| `q-atlas-skeleton-clavicle` | `skeletal-system` | `asset-atlas-skeleton-anterior` |
| `q-atlas-skeleton-scapula` | `skeletal-system` | `asset-atlas-skeleton-posterior` |

Catalog totals: **67 assets** (previously 57), **837 questions** (previously 831). No existing questions or assets were removed. Existing structures, progress IDs, state schema, bookmarks, search rules, theme choices, website, and Expo/EAS identity/configuration remain unchanged.

## Verification and limits

- Unit checks cover asset counts, file hashes, provenance, local registration, lesson/glossary associations, side conventions, Spanish coverage, question validity, base-art reuse, and callout separation at phone/enlarged sizes.
- Typecheck passed; the complete test suite passed **78/78**.
- Isolated browser sessions confirmed all six correct-answer paths (4/4 Foundations, 2/2 Skeletal), plus wrong-answer feedback and missed/mastery persistence.
- Browser checks cover Learn/Recall, Reveal all/Hide all, individual reveal, RUQ/scapula glossary access, and 390-pixel light / 320-pixel dark enlarged-text layouts.
- A focused recheck confirmed that Reset no longer intercepts the head callout, and 27 skeletal callout hit boxes measured 44 × 44 CSS pixels with 8-pixel gaps at enlarged text. Enlarged Reveal-all/full-legend behavior and the newly embedded expanded lesson viewers were not fully browser-rechecked; geometry and integration are covered by code and unit checks.
- Atlas-only measured callouts use leader lines to unchanged anatomical anchors, at least 44-pixel label controls, and a separate scalable legend; Reset/Reveal/Hide remain below the illustration. Legacy plate presentation is unchanged.
- All image files are local static Metro requires; browser inspection observed same-origin image blobs rather than external image hosts.
- Physical iPhone/Android behavior and a fresh native offline launch were **not tested**. Local bundling and a running web preview do not prove those device/offline behaviors.
- No application build, store submission, deployment, or publication was performed.

Reusable visual standard and generator: `docs/atlas/VISUAL_STANDARD.md` and `scripts/atlas/{tokens,base,generate}.mjs`.
