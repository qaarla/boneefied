# BVIS02 report: skeletal atlas

Source: `source-boneefied-skeletal-atlas` (original Boneefied art, rights reserved). BVIS01 source and 10 plates untouched.

## Manifest
- Added (19): skull-base-external, cranial-floor-internal, skull-sutures, vertebra-typical, atlas-axis, thoracic-cage, rib-detail, scapula, pectoral-girdle, humerus, forearm, hand-palmar, hip-bone, femur, leg-tibia-fibula, foot-dorsal, synovial-joint, shoulder-joint, knee-joint (`asset-skeletal-atlas-<key>`).
- Replaced in place, same IDs, legacy Gray files kept unused: asset-skull-front, asset-skull-lateral, asset-cervical-vertebra.
- Retained artwork: 3 BVIS01 whole-body plates, asset-servier-pelvis (moved to `limb-girdles`), asset-servier-elbow-joint, asset-vertebral-column. Servier image bytes and credits are unchanged; their aspect ratios and annotation coordinates were corrected against the actual PNGs.

## Questions (24, `q-skeletal-atlas-*`, all hotspot)
One per plate (22) plus pelvis (pubis) and elbow (humerus) on the retained assets. Question module follows the answer structure's owning module (22 skeletal-system, 2 joints-ligaments).

## Files
Generator: scripts/atlas/skeletal-lib.mjs, skeletal-generate.mjs, skeletal-fixes.mjs. Content: skeletal-atlas-pack.ts, atlas-index.ts, generated plates TS. Locale: locales/es/skeletal-atlas.ts. Tests: tests/skeletal-atlas.test.ts and skeletal-question-callouts.test.ts; counts in existing tests and module-manifest.json updated.

## Limits
Art is simplified introductory teaching artwork, not a detailed cadaver/model atlas or clinician-reviewed reference. Talus/calcaneus contours remain simplified. Hallux maps to the existing phalanges-foot entry. Text-only references (NBK ids) informed new original art; no third-party images were newly imported. Native iPhone/Android rendering and cold offline availability are not proven by browser checks or local PNG bundling. No release build, deployment, publication, or export was performed.

## Art correction pass (anatomical identity)
Humerus, femur, hip bone, typical and regional vertebrae now use one continuous bone silhouette with landmark zones drawn on it (scripts/atlas/skeletal-fixes.mjs; IDs, anchors and hashes regenerated). Hand carpals use distinct outlines (scaphoid boat, lunate crescent, angular triquetrum with the pisiform superimposed, trapezium/trapezoid quadrilateral and wedge, capitate head/neck, hamate with attached hook). Foot cuneiforms are wedges, navicular a boat, cuboid a block. Still schematic.

The radius head, proximal ulna hook and anterior acromion were connected to their bones. ACL/PCL pins now sit on distinct upper ligament-stroke points, not their shared crossing. The inferior costal facet appears in the thoracic lateral inset, rather than falsely appearing on a superior surface. Coverage includes every existing skeletalLandmarkStructures ID, all six cranial/eight facial bones, curricular skull openings, C1/C2/dens, and both costal facets.

## Integration and interaction checks
- All 22 plates are attached to relevant expanded Study lessons; curated module galleries reuse the same Learn/Recall viewer. Glossary/search use canonical IDs, with contextual links for skull, carpals, tarsals and pelvis instead of invented group pins.
- The 24 new questions alone use disjoint numbered 44px controls (60px at enlarged text) and leader lines to their original anatomical anchors. Other question layouts retain their existing behavior. Answer names stay hidden before submission; submitted feedback does not add a duplicate revealed-label bubble over a question control.
- Final TypeScript check passed; 90/90 automated tests passed, including full landmark coverage, Spanish question parity, local assets, preserved IDs/questions, and narrow/enlarged question-control separation.
- Browser pass: all 24 English direct-route questions accepted ordinary clicks on the canonical answer and returned correct feedback. A retained elbow anchor problem was found and corrected; the retained pelvis annotations and true image ratios were corrected in the same scoped fix. Both retained questions were then checked again and their leader endpoints aligned with the bones.
- Wrong answers persisted in Missed. Spanish cranial-floor, hand and knee questions scored correctly; a wrong Spanish synovial answer displayed the correct localized response. Hand individual reveal, Reveal all/Hide all, and separate forearm/scapula/foot and synovial/shoulder/knee Recall viewers worked without stale labels or captions.
- Glossary carpals, ulnar styloid and tarsals displayed the regional art. A glossary credit ambiguity was fixed: the written definition now has its own source credit, and every image separately names its artwork source and rights.
- At 390px/light, tarsals showed the regional foot and separate OpenStax definition/Boneefied artwork credits without horizontal overflow. At 320px/dark with qaFontScale=1.8, hand Recall markers were separated 44×44px controls; hand practice choices were separated 60×60px controls. The figure remained visible after normal vertical scrolling; neither page overflowed horizontally. These are browser observations, not native-device proof.
- All 44 SVG/PNG provenance hashes matched their local files. The assembled catalog contains 86 assets and 861 questions. Development preview ran successfully; standard React Native Web deprecation warnings and an unrelated native DevTools missing-library warning remain.
