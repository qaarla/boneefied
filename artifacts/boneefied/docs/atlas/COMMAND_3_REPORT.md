# BVIS03 report: muscular atlas

Scope: muscular visuals and their existing Learn/Recall/practice integration only. No release build, export, submission, deployment, or publication.

## Exact runtime counts
- 20 original SVG masters with local 1450×1000 PNG exports.
- 9 same-ID replacements and 11 new asset records; legacy image files retained.
- All 73 canonical muscular structures appear in the plate annotations and image-linked question targets.
- 119 annotations across the 20 plates, including repeated muscles in complementary views.
- 43 new questions: 32 hotspots, 3 typed image identifications, 8 action/functional-association questions.
- 39 existing muscle-visual hotspot questions and 8 existing advanced image-identification questions remapped to the matching new artwork.
- Muscular module: 73 structures, 8 lessons, 20 distinct lesson asset references, 173 questions.
- Assembled app catalog: 97 assets, 904 questions.

The earlier estimate of 33 new questions was not the assembled count. This report uses the actual runtime catalog.

## Plates and instructional purpose
1. Superficial anterior/posterior whole-body orientation.
2. Lateral face/neck, including SCM and superficial platysma.
3. Anterior chest/shoulder: superficial and removed-layer relationships.
4. Superficial posterior back.
5. Deep back dissection.
6. Anterior arm: superficial/deep exposures.
7. Posterior arm with elbow inset.
8. Anterior/posterior forearm; proximal extensors removed to expose supinator.
9. Abdominal wall layers.
10. Superficial/deep gluteal relationship.
11. Anterior thigh: oblique sartorius and quadriceps.
12. Deep anterior/posterior thigh exposures.
13. Posterior leg and hamstrings.
14. Anterior/lateral leg.
15. Calf: gastrocnemius and broad underlying soleus.
16. Anterior/posterior rotator cuff; teres major explicitly distinguished from cuff membership.
17. Diaphragm.
18. Palmar hand intrinsics.
19. Foot intrinsics, with plantar toe-flexor continuity.
20. Pelvic floor.

Five overview/relationship plates form the curated gallery; all 20 are available through the muscular lessons. Regional plates are also linked to the corresponding glossary entries.

Nine additional legacy illustrations were removed from active muscular lesson attachments; their asset records/files remain in the catalog/repository. All muscular image questions now use the original pack. The eight existing advanced typed questions retain their question IDs, answers, aliases, options, prompts, and factual source references, with one neutral read-only target on the new artwork.

## Content and interaction preservation
All original structure records were compared against the pre-command snapshot and remain unchanged, including canonical IDs and accepted aliases. All 130 original muscular questions retain their IDs, task types, target structure IDs, answers, aliases, and options. The original 12 origin/insertion and 16 muscle-action questions remain unchanged in full.

Eight relocated hotspot prompts describe their new views correctly. New functional-association prompts distinguish “which action,” “which toes,” and “which muscle” instead of applying a generic action stem to incompatible answer types. New typed questions retain canonical English aliases and their Spanish equivalents, including SCM/ECM.

Hotspot questions use numbered controls and leaders to the original anatomical endpoints. New image-identification/action questions show one neutral, read-only target; they do not reveal the target name or select a muscle ID before submission. Ordinary choices or typed answers still determine the score.

The text-answer rendering crash discovered during preview verification was fixed: choice rendering no longer casts a string answer to an array. Its regression check covers the assembled catalog and the new typed questions/legacy hotspots.

## Artwork, references, and rights
Art was drawn as original in-project vectors, not traced or imported from third-party illustrations. Palette, background, line treatment, margins, overlays, and viewer behavior follow the existing atlas standard. Text labels are not baked into the SVG/PNG, so overlays and view/layer captions can be localized.

Original Boneefied project artwork: all rights reserved; no CC0/public-domain dedication. Retired third-party URLs/licenses do not remain on replacement asset records. Per-plate source identity, SHA-256 values, local paths, and annotation mappings are recorded in `assets/images/anatomy/muscular-atlas/provenance.json`.

The muscular page's rights notice shows sources still used by its structures, questions, or displayed assets, not unused credits for retired illustrations. Archived source records remain intact.

Text references recorded with the pack include NCBI StatPearls NBK537012, NBK534836, NBK470334, and NBK526040. Additional text checks used OpenStax Anatomy & Physiology 2e §11.6, NCBI NBK532889 (sartorius), and NBK441844 (rotator cuff). These were factual references, not imported artwork or permissions to copy illustrations.

The artist reviewed all 20 plates at full size. Subsequent corrections addressed arm/tendon continuity, cuff tubercle attachments and supraspinatus passage under the acromion, soleus breadth, platysma continuity, hand lumbrical tendon relationships, foot toe-flexor continuity, and canvas use. These remain simplified educational schematics, not dissection-quality illustrations or independently certified clinical plates.

## Verification
- TypeScript no-emit check passed.
- Final automated suite: 102 tests passed, 0 failed.
- Export hashes, dimensions, absence of baked SVG text, local static image bindings, Spanish parity, original question semantics, annotation/target equality, and 44/60px control layout checks passed.
- The generator reported 0 own-tissue pin problems. This proves visible-tissue placement in the generated semantic ID map, not anatomical correctness by itself.
- First phone-size browser pass: 390×844 light Learn/Recall individual/bulk reveal/hide, expanded arm/forearm and hip/thigh lessons, and their regional viewers passed.
- 320×740 dark with 1.8× text: figure visible after scrolling, no horizontal document overflow, sampled Recall controls 44×44px.
- The first gesture pass exposed unreliable browser pan/reset after a genuine pinch. Touch handling was corrected to allow page scrolling at rest and retain image panning when zoomed, clear cancelled pinch state, and reset live gesture state along with rendering state.

### Final focused browser results
- Supinator new hotspot and the remapped legacy Sartorius hotspot both graded correct with matching anatomical endpoints.
- Typed SCM, Subscapularis, and Vastus intermedius graded correct. Spanish ECM mapped correctly to the existing canonical SCM alias. Read-only target markers were disabled before submission.
- Sartorius action and Tibialis posterior functional-identification choices graded correct.
- A deliberate wrong plantar choice displayed incorrect feedback and persisted in Missed as one retry item. The Spanish plantar question accepted “Los dedos menores del pie.”
- Existing `q-muscle-origin` accepted rectus femoris/recto femoral correctly.
- At 320px dark/1.8× text, sampled answer buttons were 273px wide and at least 66px high, with no horizontal document overflow. Numbered-marker 60px geometry was additionally covered by automated layout checks.
- Final genuine touch sequence on the first viewer: identity baseline → pinch matrix `matrix(1.375, 0, 0, 1.375, 0, 10)` → five-step one-finger pan matrix `matrix(1.375, 0, 0, 1.375, 80, 50)` → normal touch Reset restored the identity matrix and original image bounds.
- Browser-native TouchList input required indexed array-like geometry rather than Array methods. A regression test reproduces that input shape. No runtime error occurred in the final gesture confirmation.

The browser checks were focused samples of each changed interaction path, not a UI run of every question or a physical-device test.

## Limits
Browser phone-sized checks are not physical iPhone/Android validation. No native release build or cold-start/offline-device verification was performed. Local static asset registration is not a claim that native offline behavior has been tested.
