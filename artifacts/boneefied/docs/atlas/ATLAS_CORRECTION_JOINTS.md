# Joints & Ligaments — complete visual correction pass

## Inventory, not a gallery sample

Every published Joints & Ligaments lesson, image question and structure glossary
was inventoried from the assembled runtime catalog. This yields six distinct
visuals. Both existing hip illustrations were also included because the user
explicitly requested hip review, even though those plates are attached to the
skeletal lessons.

**Eight plates, 64 annotations, all individually opened and inspected.**
Three plates required source redraws and ten anatomical endpoint corrections.
Five plates retain their existing artwork and targets.

| # | Plate | Targets | Individual findings and action |
|---:|---|---:|---|
| 1 | Retained elbow section — `asset-servier-elbow-joint` | 4 | Retained. Humerus, blue cartilage, burgundy cavity and purple capsule targets fall on the intended structures/space. Existing original proportions and attribution preserved. |
| 2 | Generic synovial section — `asset-skeletal-atlas-synovial-joint` | 7 | **Redrawn.** Replaced the detached central fluid “puddle” with a continuous capsule-enclosed fluid space. Membrane now adjoins the inner capsule, cartilage shares the underlying bone contour, and the external ligament attaches to both bones. Complete shaft ends now lie inside the source raster. All seven endpoints reviewed and corrected against the visible final drawing. |
| 3 | Anterior right shoulder — `asset-skeletal-atlas-shoulder-joint` | 10 | **Redrawn in part.** Clavicle pointer formerly fell below the shaft in empty background; moved onto the actual shaft. Humeral head shifted slightly laterally so the joint interval is a genuine interval beside the glenoid, rather than a dark cut painted inside the head. Reviewed glenoid, greater tubercle, scapula, coracoid/acromion and both ligament targets individually. |
| 4 | Right knee, anterior/deep — `asset-skeletal-atlas-knee-joint` | 10 | **Redrawn in part.** Continuous femoral shaft/condyles and supported tibial plateau. MCL now reaches the medial tibia instead of ending outside the bone. Separate distal articular surfaces and a deep intercondylar notch distinguish the cruciate attachments from cartilage. Joint interval is behind the anterior patellar ligament, with its pointer moved to the exposed interval beside that ligament. |
| 5 | Pectoral girdle — `asset-skeletal-atlas-pectoral-girdle` | 8 | Retained. Reviewed AC ligament at the clavicle/acromion junction, glenoid/head relation, coracoid and remaining bony targets. The prior correction removing an extra clavicle fragment remains intact. |
| 6 | Forearm/proximal-ulna inset — `asset-skeletal-atlas-forearm` | 9 | Retained. Interosseous membrane spans the two shafts; radius/ulna, head/tuberosity/styloids and olecranon/trochlear-notch targets reviewed against actual contours. |
| 7 | Right hip bone, lateral/medial — `asset-skeletal-atlas-hip-bone` | 9 | Retained. Lateral exposed acetabulum and medial auricular/SI surface are distinguished between views. Ilium/crest/ASIS, pubis/ischium/tuberosity and obturator opening targets reviewed. |
| 8 | Retained assembled pelvis — `asset-servier-pelvis` | 7 | Retained with explicit limitation. The existing acetabulum point reaches the visible bony rim, not the central femoral-head/cartilage region. The deeper socket remains occluded/ambiguous in this low-resolution assembled image. It is **not** reported as an exposed-socket illustration. |

There is no additional dedicated hip-ligament plate published in this module's
current lesson/question/glossary inventory. No new plate or lesson was invented
to make the inventory appear larger.

## Anatomical corrections

Coordinates are normalized to the intrinsic raster, not the square viewer.
The same exact-coordinate repairs reach Learn, Recall, raw/pre-catalog glossary
objects and question-specific hotspots. They preserve IDs, radii, order and names.

| Plate | Target | Corrected source-normalized point |
|---|---|---|
| Synovial section | Whole joint | `(0.5, 0.49)` |
| Synovial section | Fibrous capsule | `(530/1450, 0.5)` |
| Synovial section | Synovial membrane | `(551/1450, 0.5)` |
| Synovial section | Articular cartilage | `(0.5, 0.437)` |
| Synovial section | Joint cavity | `(685/1450, 0.52)` |
| Synovial section | Synovial fluid | `(760/1450, 0.535)` |
| Synovial section | External ligament | `(495/1450, 0.47)` |
| Shoulder | Clavicle | `(880/1450, 0.23)` |
| Knee | MCL | `(520/1450, 0.48)` |
| Knee | Joint interval | `(490/1450, 0.48)` |

A joint cavity is deliberately a space, not colored bone or ligament. Its
leader must terminate **within the anatomically bounded joint space**, not in
unrelated background. Membrane, capsule and ligament pointers instead reach
their actual painted tissue contours.

## Framing and interaction approach

The shared viewer already fits the union of the intrinsic-aspect raster,
measured annotation interaction bounds and leader endpoints into a centered
square viewport. This pass preserves that common geometry for image painting,
leaders, markers and gesture bounds. No per-image stretch, image-only inset,
arbitrary global shrink factor or extra source-space padding was introduced.

The prior right-edge shoulder problem is checked in the actual full shoulder
viewer, including its displaced callout circles, not merely a raw PNG or a
focused glossary card. Source endpoint defects were corrected in their own
plates rather than disguised by smaller marker paint.

## Preservation and evidence

- Existing question fields other than corrected hotspot coordinates, module and
  lesson identities, source records, annotation names/order/radii and all eight
  asset identities/paths are unchanged against the before-state snapshot.
- The original matte palette is retained. Only three existing original SVG/PNG
  pairs and their exact provenance hashes/feature mappings were regenerated.
  Third-party elbow/pelvis images and credits were not repainted or reassigned.
- The three revised raster URLs get a new preview fetch/cache identity:
  `boneefiedArt=joint-continuity-1`. Previous skeletal cache identities and other
  saved images remain untouched; there is no cache-wide deletion.
- Before/after individual source review images, immutable identity snapshots
  and machine-readable per-target changes:
  `generated-artifacts/atlas-joints-repair/`.
- Source review: `source-review.json` in that directory. It records before/after
  raster SHA-256 values, all 64 targets, exact rights, lesson/question/glossary
  uses and the retained pelvis limitation.
- Type checking and **48 automated checks passed**, covering exact target
  propagation, inventory, local source proportions, current provenance hashes,
  question/lesson identity, shared full-scene framing, gestures and controls.

Factual checks used text only, without importing/tracing any reference figure:
[glenohumeral articulation](https://www.ncbi.nlm.nih.gov/books/NBK537018/),
[MCL attachments](https://www.ncbi.nlm.nih.gov/books/NBK507780),
[knee relationships](https://www.ncbi.nlm.nih.gov/sites/books/NBK500017/),
[synovial capsule and cavity](https://www.ncbi.nlm.nih.gov/books/NBK507893/).

Live browser per-plate results are recorded separately in
`generated-artifacts/atlas-joints-repair/browser-results.json`; source inspection
and automated geometry checks alone are not claimed as interactive verification.
Browser touch testing is not physical iOS/Android evidence.

No native build, publication, unrelated module redesign or progress reset.

## Completed actual-viewer results

**8/8 full viewers passed; 64/64 annotations and ordered legend entries checked.**
No focused-glossary substitutions were used for the full-legend audit.

- All eight preserved intrinsic aspect and complete centered raster/marker
  framing at 390px Default text, 390px Large text and 320px Large text.
  In particular, all ten shoulder callouts, including the right-edge clavicle
  callout, remained inside the square frame.
- Actual Zoom in, Zoom out, pinch to 2×/4×, both-axis panning, edge clamp/reverse
  and identity Reset were exercised on every plate. Parent scrolling stayed
  stationary during owned gestures; the annotation/image transform remained
  coupled. The pectoral 4× numerical displacement was discarded after a QA-loop
  measurement error; its live clamp/reverse behavior was still verified.
- The three corrected images were reopened offline from the actual UI. Online
  and offline blob/cache SHA-256 values matched the current source PNGs.
  Existing cache entries were not cleared. Retention was checked only for the
  older skeletal entries actually present in that browser at baseline, not
  claimed for absent entries.
- Current corrected PNG hashes:
  - Synovial: `cd109a0d3f69b5eb299f8519935a942c60cef3cfaee1742e70e132e5a3fb275f`
  - Shoulder: `0145c38b3e788466ee1b1500ec6d53c3d9092afb79851b56ec3f404fdf17f770`
  - Knee: `a0e3baa6b0491b15837a9694cac4ef896d2f5b880773557fe21e8e22e6cbfd8d`
- All ten corrected endpoints were additionally sampled against the unannotated
  raster and matched the intended tissue/space palette. This supports, but does
  not replace, the individual contour and anatomical relationship review.
- The browser was returned online, 390px, Text Default. The library still showed
  Joints & Ligaments as Not started. No quiz submission, bookmark, reset-progress
  or other progress-changing action was performed.

The retained pelvis's deeper socket limitation remains as stated above.
Physical-device behavior was not tested; these results are browser evidence.
