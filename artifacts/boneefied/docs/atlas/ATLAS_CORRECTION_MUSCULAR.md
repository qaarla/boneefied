# Muscular System — individual visual correction audit

## Scope and source review

The assembled published catalog contains **21 unique visual assets with 129
targets**: all 20 original muscular plates (119 targets), plus the major
body-cavities/serous-space plate reached through the diaphragm glossary (10).
Every one was individually opened with its own numbered target overlay and
ordered legend. This is not a representative sample.

Fourteen muscular PNGs required visible corrections; six retain their exact
original PNG bytes. The supplementary body-cavities image is unchanged.
All asset IDs, lesson/question identities, label names/order/radii, source
records and rights were preserved. Eleven source-normalized endpoints changed.

## Every plate checked

Numbers below identify review records, not a new user-facing sequence.

| Review | Plate | Targets | Individual result |
|---:|---|---:|---|
| 1 | Whole-body anterior/posterior muscle maps | 27 | Corrected. Recovered missing polygon fiber strokes; exposed vastus lateralis as a lateral quadriceps belly, moved the IT-band course outside it, and moved its target off the narrow distal edge. Pronator teres now has a visible oblique proximal-forearm course. Reviewed the anterior/posterior convention and every remaining torso/limb target individually. |
| 2 | Face/neck, right lateral | 9 | Corrected. SCM now has a continuous stem and distinct lower heads reaching the sternoclavicular region; the scalene representation reaches the first rib. Reduced the anterior platysma overlap to show the SCM course. Uniform per-plate composition adjustment includes the first rib and lower heads without stretching. All nine endpoints updated to actual visible final contours; orbicularis targets reach rings, not openings. |
| 3 | Anterior chest/shoulder | 9 | Corrected missing fiber strokes and contextual pronator/thigh drawing inherited from the shared body model. Inspected superficial pectoralis major/deltoid/serratus, SCM, biceps, rectus/external oblique, and the contralateral pectoralis-minor/intercostal cutaway. Existing targets retained where they remain on their own visible shape. |
| 4 | Superficial back/scapular muscles | 7 | Corrected missing polygon fiber strokes. Checked trapezius, latissimus, infraspinatus, teres minor/major, triceps and deltoid. Deep rhomboids/erectors were not falsely added to a superficial view. |
| 5 | Diaphragm: domes/inferior view | 1 | Retained original PNG. Target is on the domed muscle, not lung or central tendon. Both contextual views remain complete. |
| 6 | Deep back | 7 | Corrected missing polygon fiber strokes. Individually reviewed multifidus, quadratus lumborum, erector spinae, supraspinatus, both rhomboids and levator scapulae in their stated removed-layer views. |
| 7 | Pelvic floor, superior view | 3 | Retained original PNG. Reviewed the levator-ani group target and visible iliococcygeus/pubococcygeus contours; targets do not enter the central opening. |
| 8 | Rotator cuff, anterior/posterior | 5 | Corrected missing subscapularis/infraspinatus/supraspinatus fiber strokes. Checked all four cuff muscles separately; teres major remains named context, not a fifth cuff muscle. Opposing anterior/posterior views retain the right-shoulder convention. |
| 9 | Anterior arm, superficial/deep | 6 | Corrected the contextual pronator-teres course so it crosses the proximal forearm rather than appearing as a largely occluded longitudinal strip. Checked deltoid/biceps and the exposed coracobrachialis/brachialis; existing six endpoints remain valid. |
| 10 | Posterior arm/elbow | 4 | Corrected missing polygon fiber strokes. Reviewed teres major, triceps and deltoid in the whole-arm panel and anconeus in the enlarged elbow panel. The enlarged inset deliberately crops unrelated arm context, not the targeted anconeus. |
| 11 | Forearm, anterior/posterior | 5 | Corrected visible oblique pronator teres and missing polygon fiber strokes. Checked flexor carpi radialis, posterior extensor carpi radialis, anconeus and exposed deep supinator against their actual painted shapes. |
| 12 | Hand intrinsics, palmar | 4 | Retained original PNG. Reviewed lumbricals, flexor pollicis brevis, abductor pollicis brevis and abductor digiti minimi. Thumb-side orientation and all four targets are consistent with the stated view. |
| 13 | Abdominal wall layers | 4 | Corrected missing fibers. External oblique retains the inferomedial course; internal oblique now shows superomedial fibers, not the opposite diagonal; transversus has transverse strokes. Fiber paint is clipped to each actual muscle contour. Rectus target remains in its belly. |
| 14 | Anterior thigh | 8 | Corrected vastus lateralis/IT-band separation and moved the VL target into its exposed belly. Individually checked iliopsoas, adductor longus, gracilis, vastus medialis, TFL, rectus femoris and the lateral-to-medial sartorius course. |
| 15 | Posterior lower-limb overview | 5 | Corrected missing gluteal polygon fibers. Reviewed medial semitendinosus versus lateral biceps femoris, gluteus medius/maximus and gastrocnemius. |
| 16 | Gluteal surface/cutaway | 2 | Corrected missing polygon fibers. Maximus remains superficial in one panel; medius is exposed in the maximus-removed panel. Both markers remain in their own muscle. |
| 17 | Deep thigh, anterior/posterior | 3 | Retained original PNG. Reviewed exposed vastus intermedius, distal articularis genus and posterior semimembranosus, not superficial rectus or semitendinosus. |
| 18 | Anterior/lateral leg | 2 | Retained original PNG. Reviewed lateral fibularis longus and anterior tibialis anterior, including the medial distal tibialis-anterior tendon course. |
| 19 | Calf, surface/cutaway | 4 | Corrected missing soleus/popliteus polygon fibers. Checked gastrocnemius, soleus, popliteus and the visible deep tibialis-posterior region/tendon. |
| 20 | Foot, plantar/dorsal | 4 | Retained original PNG. Checked plantar flexor digitorum brevis, lateral abductor digiti minimi and medial abductor hallucis, plus dorsal extensor digitorum brevis. Hallux orientation correctly reverses between opposing plantar/dorsal views. |
| 21 | Major body cavities/serous-space inset | 10 | Retained. Individually reviewed the diaphragm and all other published cavity/serous targets; full legend must be assessed in its owning Anatomy Foundations viewer, not the single-target muscular glossary card. |

## What failed in the original source

Polygon fiber data used a single polyline in some places and multiple polylines
in others. The renderer treated individual coordinate pairs as whole polylines,
emitting `NaN` SVG coordinates. Image conversion still succeeded, silently
dropping those strokes. A successful PNG conversion and a correct filled-shape
ID map therefore did not establish that the diagnostic fibers were present.

The renderer now accepts both forms, and clips fibers to their parent contour.
The abdominal directions were corrected explicitly rather than merely making
the previously invisible, incorrect internal-oblique diagonal visible.

No global anatomical stretch, arbitrary all-plate shrink factor, shared viewer
redesign or change to another system's source artwork was used.

## Endpoints, questions and attachments

- Nine face/neck points follow the final complete source composition. The two
  view-specific vastus-lateralis targets move into the exposed muscle belly.
  Exact old coordinates are matched; another view of the same muscle is not
  moved indiscriminately.
- All **119 published muscular endpoints** were additionally checked against
  their own visible filled-shape ID map. This is supplemental evidence, not a
  substitute for the individual anatomical contour/orientation inspection.
- All 129 ordered label identities and radii are preserved. Before/after
  question/source/lesson snapshots match, excluding the intended hotspot
  coordinates. All other per-asset metadata matches.
- The module has 173 questions, including 71 hotspot and 11 image-identification
  questions. Existing muscular tests check visual-question/answer mappings
  against the assembled catalog and preserve existing action/attachment items.
- All 12 origin/insertion-type questions were reviewed. They are text-based,
  without attached anatomical endpoint pins. No precise origin/insertion
  localization is claimed for a muscle-belly identification marker. In
  particular, the scalene drawing represents an anterior/middle-scalene course
  to the first rib; a separately labeled posterior-scalene insertion on the
  second rib is not present.

## Verification and evidence

- Type checking and **42 automated tests passed** for the final source batch:
  inventory, exact immutable endpoint propagation, finite SVG geometry, source
  hashes, image proportions, question mappings, framing, controls and gestures.
- Source review: `generated-artifacts/atlas-muscular-repair/source-review.json`
  records every muscular plate's before/after raster SHA-256, whether its pixels
  changed, and all 119 own-visible-shape checks.
- The same directory contains individual before/after numbered review images,
  assembled inventories and immutable identity snapshots.
- Only the fourteen pixel-changed PNGs receive
  `boneefiedArt=muscle-contours-1` in development previews. Six unchanged muscular
  PNGs retain their exact prior bytes and cache identities. Earlier skeletal
  and joint revisions remain separate; no cache-wide clearing is performed.
- Actual browser results, recorded incrementally and separately from source
  checks, are in `generated-artifacts/atlas-muscular-repair/browser-results.json`.
  Source checks alone are not claimed as button, pinch, pan or offline UI proof.

### Completed live browser coverage

All 21 lesson-owned viewers passed Default 390 framing and their ordered
legends, measured button enlargement/reversal, pinch, magnified two-axis pan,
stationary-parent scrolling checks and Reset. All 21 also passed Text Large
at 390 and 320 pixels, with targets inside their initial viewer and no horizontal
page overflow.

All 20 muscular viewers passed Recall: initially hidden markers, Reveal All
with the exact expected target count and labels, then Hide All restoring the
hidden state. This covers all 119 muscular targets. The supplementary
Foundations cavity viewer separately passed the same sequence for all 10.
The overview also passed post-pan accidental-reveal suppression.

The online cache audit found all 21 expected images among 23 entries, with
no source SHA-256 mismatch. After actual offline library-to-module re-entry,
all 21 lesson-owned images rendered as complete local blobs at 1450×1000,
with their expected target counts and ordered legends. This is warm-browser
offline re-entry evidence, not an uninstalled native application's cold-start
offline guarantee.

Final browser state: online, 390×844, Text Default, Study library. No quiz
answer was selected or submitted.

### Remaining verification limits

- The live Practice session began with an unanswered, text-only diaphragm
  question. There was no non-submitting skip/next route to an image question;
  leaving and re-entering resumed the same question. Live image-question
  presentation therefore remains unverified. The automated assembled-catalog
  question/target mapping checks passed; no submission was made merely to
  obtain further test coverage.
- The earlier browser context's 22 skeletal/joint cache keys could not be
  re-inspected after that context timed out. No cache clearing was performed,
  and source tests confirm that their existing revision keys are preserved.
- Installed-phone zoom remains unverified. Browser measurements did not
  reproduce the reported zoom failure, and no speculative shared gesture-code
  change was made on the strength of that non-reproduction.

Factual text checks included
[SCM](https://www.ncbi.nlm.nih.gov/books/NBK532881/),
[scalenes](https://www.ncbi.nlm.nih.gov/sites/books/NBK519058),
[anterolateral abdominal wall](https://www.ncbi.nlm.nih.gov/sites/books/NBK525975/),
[abdominal wall muscles](https://www.ncbi.nlm.nih.gov/sites/books/NBK470334/),
and [extrinsic back muscles](https://www.ncbi.nlm.nih.gov/sites/books/NBK537216/).
No reference images were imported, traced or reassigned.

## Boundaries

Regional plates/insets may deliberately cut unrelated surrounding bone/body
context; this is distinguished from clipping a targeted muscle or its marker.
They remain diagrammatic identification views, not surgical attachment maps.

Physical-device evidence must be distinguished from browser touch emulation.
The reported installed-device zoom problem cannot be certified resolved merely
because a browser viewer works. No native build or publication is authorized
or performed in this pass.
