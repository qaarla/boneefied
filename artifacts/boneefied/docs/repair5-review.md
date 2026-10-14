# Repair 5 — anatomical endpoint pass

## Scope and outcome

- Reviewed all **164 active visuals** from the assembled runtime catalog: **153 original generated plates and 11 retained visuals**.
- Inspected source-target review images in sequence, enlarged the suspicious structures, and then inspected every phone-width overlay.
- Coverage includes skeletal, joint, muscle, nerve, vascular, respiratory, digestive, urinary, reproductive, and histology content, plus cell/foundation diagrams.
- Corrected **49 displayed endpoints across 19 diagrams**. There are **53 exact-coordinate correction rules**, including separate legacy Practice coordinates.
- Preserved label order, structure IDs, legend text, scoring IDs, hotspot radii, image attribution, and all 164 source-image byte hashes.
- Explicit compact-marker overrides reduce **46 named dense diagrams** to **16–17px painted circles**, with numerals at least 10px. Independent 44px/60px touch regions remain unchanged. Other diagrams retain their defaults.
- Corrected coordinates are shared by canonical Study assets, Practice question hotspots, and raw/pre-catalog glossary/viewer inputs. Already-corrected points are not corrected twice.
- No native/web production build, deployment, publishing, source-art rewrite, or unrelated UI work was performed for this pass. Earlier framing and gesture work was preserved.

## Confirmed repairs

| Diagram | Corrected targets |
| --- | --- |
| Atlas/axis | Spinous process onto the visible shaft |
| Thoracic cage | False and floating ribs onto rib centerlines |
| Rib detail | Costal groove onto the darker inner rib groove |
| Synovial joint | Joint overview inside the joint; cartilage onto its blue-gray cap |
| Shoulder joint | Acromion onto the arch |
| Knee joint | Intercondylar eminence onto exposed bone between ligament attachments |
| Anterior anatomical position | Axillary region from superior shoulder to the axillary fold |
| Anterior skeleton | True, false, floating rib groups onto actual bone |
| Axial/appendicular skeleton | True ribs onto the same corrected rib centerline |
| Sweat-gland plate | Eccrine target from duct to coiled secretory gland |
| Cell overview | Nucleolus, mitochondrion, smooth ER, Golgi, centrosome |
| Mitosis | Stage targets inside the appropriate cells; telophase on the lower two-nuclei cell |
| Original anatomical planes | Sagittal, coronal, transverse onto the corresponding colored planes |
| Original body cavities | Vertebral, thoracic, abdominal, pelvic onto their colored regions |
| Retained elbow | Cartilage cap; separate Practice cavity/capsule coordinates aligned with the correct Study locations |
| Retained pelvis | Pelvic girdle, pubic ramus, ischium; old Practice positions aligned. Acetabulum remains limited by the art below |
| Retained appendicular skeleton | Clavicle, scapula, radius, ulna, carpals, metacarpals, pelvic girdle, femur, patella, tibia, fibula, tarsals |
| Epidermal strata | Dermal-papilla interior, separate from the tactile corpuscle |
| Muscle tissue | Smooth-muscle cell body, away from the tapered ambiguous edge |

## Suspicions dismissed after enlargement

- Foundational cranial/vertebral cavities: the points are inside the cranial region and the narrow colored vertebral canal.
- Spleen: the endpoint is within the small purple spleen, though the review dot obscures much of this narrow structure at reduced scale.
- Whole-skeleton clavicle, humerus, radius, femur, patella, tibia, fibula: authored centerlines confirmed the original locations; only the rib groups needed changes.
- Heart wall: myocardium, endocardium and epicardium endpoints are on their respective colored layers.
- Terminal bronchiole: the endpoint follows the actual fine terminal twig. Source branch geometry confirms it is not floating in the background.
- Internal anal sphincter: the endpoint is in the left internal muscle band. The neighboring anal-canal target correctly refers to the pale lumen.
- Cervical vertebra and sweat-gland plates were inspected individually rather than relying on their small contact-sheet images.

## Artwork limitations — not repaired or certified by geometry

1. **Original mitosis stages:** the interphase drawing contains a condensed X chromosome, and the upper fifth cell has only one nucleus. Moving the markers does not correct these drawing limitations. Telophase now refers to the lower two-nuclei cell. The initial anaphase concern was dismissed after enlargement: opposed purple chromatids are visible in the fourth cell.
2. **Retained Servier pelvis:** the low-resolution blue hip-joint region does not unambiguously distinguish the acetabular socket from the femoral head/cartilage. The old Practice location is aligned with Study, but the acetabulum target is **not anatomically certified** by this coordinate-only pass.

No replacement art or additional work was started.

## Verification and evidence

- TypeScript typecheck: passed.
- Focused viewer/framing/gesture/marker/repair tests: **36 passed**.
- **875 associated hotspot questions** included; repeated identical hotspot arrangements deduplicated only for geometry calculations.
- **6,306 geometry cases** at image-viewer widths **239, 301, 348px**, normal/enlarged typography and Study/Practice controls.
- Zero painted bubble collisions, clipping, protected-region coverage, out-of-frame leader endpoints, or numerals below 10px in those cases. Straight leaders are bounded because both endpoints remain within the convex viewer frame.
- Number/order/identity/radius preservation and correction idempotence have focused regression tests.
- All 164 source-image hashes match the pre-repair inventory.
- Generated evidence is ignored by Git/deployment under `generated-artifacts/repair5/`: source reviews, individual phone overlays, 21 phone-review sheets, before/after inventories, findings, and `report.json`.
- These checks establish source review and phone-width geometry, **not physical iPhone/Android-device proof**. The automated live screenshot can capture Expo before font/asset hydration; a blank initial capture is not used as evidence of a rendered diagram.
