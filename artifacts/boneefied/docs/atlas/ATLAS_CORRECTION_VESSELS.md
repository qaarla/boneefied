# Blood Vessels / Circulation — individual published-plate correction

## Scope and source inspection

**11 existing published plates, 93 annotated targets, 56 visual questions**
(45 hotspot and 11 image-identification). The inventory follows the assembled
published lesson/question assignments, not filenames. Every plate was opened
individually with numbered source anchors and its complete legend, before and
after changes. No authentic specimen appears in this group; the two tissue
plates are explicitly schematics, not micrographs.

The glossary's **45 canonical vascular structures** resolve to the same eleven
plates, with no additional published glossary-only vascular image.

| Published plate | Targets | Individual source inspection and disposition |
|---|---:|---|
| Vessel wall layers and vessel types | 12 | Corrected the left comparison vein to show a genuinely larger, flatter lumen and thin media relative to the artery; preserved distinct externa/media/intima/endothelial endpoints. Checked all six vessel-type examples. All coordinates retained. |
| Three capillary types | 6 | Raster retained. Continuous wall, fenestrae, discontinuous sinusoid wall, erythrocyte/platelet and extravasated neutrophil targets checked separately. Retained explicit schematic and exaggerated-scale notice. |
| Major arteries and major veins of the body | 22 | Checked every individual arterial/venous endpoint, especially radial versus ulnar, internal versus external carotid, adjacent tibial routes, jugular vessels and superficial/deep leg veins. Added small external-carotid branches without crossing the midline or branching the ICA. Coordinates retained. |
| Carotid arteries and jugular veins of the head and neck | 7 | Same external-carotid branch correction. Checked carotid bifurcation, distinct internal/external courses, deep internal jugular versus superficial jugular, and separate subclavian artery/vein points. Anterior patient-right/viewer-left retained. |
| Arterial route to the arm and hand | 9 | Uniformly refitted the source upper body from scale 1.9 to 1.7 so both hands fit completely. All nine endpoints follow the identical affine transform and remain on their original arteries. Checked subclavian/axillary/brachial transitions and thumb-side radial versus medial ulnar route. Also inherits the external-carotid branch correction. |
| Venous return from the arm and the median cubital vein | 9 | Uniformly refitted the whole upper-body route so both hands fit; only its first seven endpoints follow the transform. The two elbow-detail endpoints are unchanged. Checked cephalic versus medial/deep route, oblique median cubital connection, axillary/subclavian continuity and jugular return. The right panel remains an explicitly cropped elbow enlargement. |
| Arterial route to the leg and foot | 6 | Raster retained. Checked aortic/iliac/femoral continuity, anterior versus posterior view and patient sidedness, popliteal route and separate tibial endpoints. Context crop is an intentional lower-body regional view; the full published source is retained. |
| Great saphenous vein: foot to groin | 5 | Corrected the red femoral arterial arrow to point down, while blue femoral and saphenous flow remains up toward the heart. Checked medial saphenous route and actual junction with the femoral vein, plus distinct artery/vein in the groin enlargement. All endpoints retained. |
| Celiac trunk and renal vessels | 4 | Drew a distinct projecting celiac trunk connecting its aortic origin to the three-way hepatic/gastric/splenic branch point. Its endpoint moves to that trunk, not the overprinted aortic wall. Checked renal arterial/venous distinction, right renal artery behind IVC, left renal vein anterior to aorta, kidney/adrenal relationships and sidedness. |
| Hepatic portal system | 7 | Separated hepatic drainage from portal branches so blue crossings no longer imply a direct portal-caval shunt. Checked splenic and mesenteric confluence, inflow toward liver, hepatic return to IVC and inward sinusoidal flow. The second hepatic-vein endpoint now lies on an actual projected downstream outlet, not the central vein; EN/ES copy explicitly explains that projection. Lobule slightly inset to keep peripheral triads clear of the raster edge; its sinusoid/portal-venule endpoints follow the geometry. |
| Flow chain: aorta to vein | 6 | Moved the misplaced arteriolar flow arrow onto the actual arteriole and reduced the capillary arrow so it fits the narrow channel. Checked continuous left-to-right arterial/capillary/venous route, artery/vein colors and all six endpoints. Coordinates retained. |

## Preservation and counts

- **Nine changed rasters; two byte-identical rasters** (capillary types and
  lower-limb arteries).
- **21 coordinate changes:** 16 track uniform upper-body refits; one identifies
  the now-distinct celiac trunk; four follow corrected hepatic drainage or
  lobule geometry. No appearance-only movement onto an adjacent vessel.
- All 93 label/target IDs, orders, radii, canonical names, asset identities,
  question IDs, answers and ownership remain unchanged.
- Machine-checked before/after identity comparison finds **no unrelated asset,
  question, canonical module/structure/source or catalog-size change**.
  Portal question explanations inherit the corrected source description.
- All **56 questions** pass geometry, canonical-answer grading and, for each
  hotspot, grading of the correct structure ID actually emitted by tapping.
- All eleven use the existing centered full-natural-proportion initial/Reset
  policy and existing numbered Practice presentation. Identification uses a
  neutral read-only target before submission, not answer-reveal controls.
- Fixed a group-scoped pan-limit defect: clamping only to the raster stranded
  external numbered markers after magnification. These eleven plates now clamp
  to their complete fitted annotation envelope (raster, leaders and interaction
  regions). This permits reaching the markers without unbounded empty-canvas
  movement. Annotation gutters can legitimately enter the viewport; requiring
  the raster to cover every edge would recreate the accessibility defect.
  All other groups retain their previous pan-limit policy.
- Original matte source palette, Tinos, local static image paths, generous
  interaction regions and original authorship/rights remain. Provenance hashes
  and source anchors are synchronized. Only the nine repainted web images gain
  `vessels-routes-1`; no unrelated cache or learner-progress clearing.

## Verification

- **93/93** endpoints match their named source regions; masks support, rather
  than replace, direct inspection of every actual rendered plate.
- Type checking and **32 targeted tests** pass, including a regression
  demonstrating the old unreachable-marker case, full annotated-content clamps,
  unchanged other-group pan geometry and cardiovascular preservation.
- Evidence: `generated-artifacts/atlas-vessels-repair/` contains individual
  before/after source views, inventory, identity comparison, source-region
  review and all-question mapping/scoring audit.
- Live browser interaction results are recorded separately in
  `browser-results.json`; final outcomes are appended when complete.

### Completed live results

- **11/11 at 390×844 Default:** complete natural 1450×1000 source, centered
  initial/Reset view, all 93 painted markers contained, no outside interaction
  boxes at 1×, and expected legend names/counts. Actual legend font is loaded
  `Tinos_400Regular`.
- **11/11 Zoom buttons:** observed 1× → 1.5× → 1× transforms, not only enabled
  controls.
- **11/11 touch/viewer checks:** real CDP touch input, 2× and 4× magnification,
  movement in both axes, stable positive/negative annotated-content clamps
  under repeated outward drags, and Reset to identity.
- **11/11 actual post-pan Recall marker touches:** intended label reveals,
  rather than merely matching marker/image rectangles. Verified representative
  labels: tunica externa, erythrocyte, aorta (body map and regional arterial
  views), internal jugular, axillary vein, vein (flow chain and saphenous),
  and hepatic veins. Dense body map also passes aorta at 2× and common carotid
  at 4× after real pan.
- **11/11 parent-scroll checks:** recorded actual scrollable lesson-parent
  offsets unchanged during magnified diagonal movement. This is not a
  `window.scrollY` substitute.
- **3/3 Practice selections after zoom+pan, with no intervening Reset:**
  radial artery, celiac trunk and hepatic veins each accept the visible actual
  hotspot and complete as **1/1 Correct**.
- Final state restored to **online, English, Text Default, 390×844, Study
  library**. No application source edits by the tester and no cache/progress
  clearing.

Browser source SHA rows retained in this evidence are inventory metadata, not
new browser-cache hash comparisons. Local source/provenance hashes were
independently checked by the main audit/tests. The static first-viewport
capture tool returned before visible readiness; settled interactive captures
were inspected instead.

### Limits and nonblocking observations

- **No unresolved plate-specific defect** in the inspected sources and verified
  browser flows. Physical-device/native pinch/pan and cold-offline launch were
  not tested; emulated browser touches are not native-device proof. No new
  offline-runtime claim is made.
- At a dense 4× boundary, the measured painted union can be slightly inboard of
  the full interaction-envelope boundary. Annotation gutters can occupy the
  viewport; clamps remain stable and real markers remain reachable.
- One sampled magnified radial target had six pixels of its invisible button
  box beyond the frame; its painted marker remained visible, touchable and
  graded Correct. This was not a 1× cut-off.
- Repeated hepatic-vein occurrences intentionally share a canonical-ID-based
  test identifier; both remain separate source locations. No canonical ID was
  changed to make the test selector unique.
- After restoring Study, the accessibility snapshot still included an
  off-screen completed Practice Results subtree. Visual restoration passed;
  unrelated navigation/accessibility behavior was not changed in this group.

No native build, publication, next system or unrelated feature work.
