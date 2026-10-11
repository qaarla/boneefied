# Boneefied Visual Repair 4

## Completion and scope

- **164 published catalog visuals checked:** 157 annotated diagrams and 7 unmarked reference/specimen/histology visuals. This is a current-source catalog audit, not verification of an existing production deployment.
- **107 diagrams changed:** smaller default enlarged-text marker paint, with density-sensitive 24–28 px caps. Ordinary-phone paint is unchanged in the raster comparison. Numerals remain at least 10 px and independent 44/60 px touch regions are preserved.
- **50 existing per-diagram size overrides retained**, with 18 px base / 21 px enlarged maximum; **153 existing anatomy-protection configurations retained**. No new per-diagram override was necessary.
- Shared viewer legend/caption spacing is now 12 px padding with 8 px legend gaps; disclosure text aligns to the same horizontal inset. Controls have a width cap so enlarged text can wrap within the image card.
- A concrete 320 px end-of-lesson defect was corrected: both anatomy bookmark targets and labels now cap their width, allowing Intercondylar eminence and other long names to wrap rather than clip. Bookmark meaning/actions are unchanged.
- **Manual redrawing required: none identified for this presentation repair.** The retained classic vertebral-column reference has small baked labels at 1×; its existing zoom is needed for those details, and they cannot be independently resized as overlays.
- **Ready for a clean internal test build: yes, from the visual-system review.** This is not a native release/build-success or store-readiness certification.
- No source artwork, anatomical target coordinates, legend names/number ordering, question mappings, rights metadata, image loading, gesture controller, navigation or unrelated app areas were changed. No build, deployment or publication was performed. Stopped after BVR04.

## Verification

- Every annotated visual was reviewed in paired normal/enlarged phone QA renderings: 348 px image width at default typography, 271 px at effective 2.8×. All 314 current rasters / 18 contact sheets were reviewed; the 7 unmarked images were separately reviewed in a phone-width contact sheet.
- Painted-circle overlap count: **0**. Anatomical-anchor covers: **0**. Colored-ink risk flags: **0**. Pixel screening is not by itself a semantic occlusion verdict; visual review was separate.
- All **164 source-image hashes unchanged**. All ordered label-number/target fingerprints unchanged; **723 unique question-target configuration fingerprints unchanged**.
- TypeScript passed. Full suite: **143 passed**. After the final bookmark-wrap correction, TypeScript and **10 focused marker/typography checks passed**.
- Live 390 px normal: low-density diaphragm paint 27.1 px inside 44 px targets; dense female/heart/skull paint 18 px inside 44 px targets. Controls, legends, captions and rights text remained separate, with no document overflow.
- Live 320 px with qaFontScale=2.5 and the actual Text Large preference (1.12 factor), effective **2.8×**: Recall revealed **1. Parietal bone**, matching its numbered legend. Paint was 21 px inside a 44 px target. Toolbar and artwork did not overlap.
- At the actual enlarged skeletal module end, the repaired Intercondylar eminence target measured **256×104 px**, matching its 256 px parent; its full label wrapped onto two lines. Final lesson descendants and document had no horizontal overflow, and Practice / Return remained reachable at maximum scroll.
- Enlarged Practice Submit ended at y=572.2 while the floating dock began at y=682: **109.8 px clearance**. Setup end content also cleared the dock. No bottom-padding change was needed.
- Actual enabled Practice skull target: 1.5× pan moved the image down 60 px without scrolling the parent or selecting an answer; a deliberate tap selected Skull and enabled Submit. **No answer was submitted.** Learn/Recall reveal behavior, including matching duplicated Uterus legend entries, was preserved.
- The BVR03 gesture implementation is untouched. Its existing full gesture/bounds/reset coverage remains applicable; this pass checked deliberate image interaction after the presentation changes without repeating the entire gesture matrix.
- Text Default was restored after browser checks. Expo is running; the pre-existing DevTools missing-libglib warning does not prevent application bundling. A transient disconnected Metro page recovered after reload during the focused check.

## Evidence limits

Phone-browser layouts and synthetic enlarged typography are not physical iPhone/Android proof. No native release binary was created or installed. Offline and provenance paths were preserved, not re-certified by new offline testing or live license research. Raster callout models do not prove every raw Practice region interaction; the actual enabled selectable target was checked separately.

Summary, per-diagram IDs, source/mapping checks and full browser results: VISUAL_REPAIR_4_AUDIT.json. Detailed generated evidence is ignored under generated-artifacts/bvr02/bvr04-before and generated-artifacts/bvr02/bvr04-after.

## Retained per-diagram size overrides (50)

| Diagram | Asset ID |
|---|---|
| Superficial muscles, anterior and posterior views | asset-openstax-muscle-labeled-overview |
| Female internal organs: ovary, tube, uterus and vagina | asset-bvis06-female-gross |
| Testis, epididymis and seminiferous tubule | asset-bvis06-testis-ducts |
| Heart from the front: chambers, apex and great vessels | asset-bvis05-heart-anterior |
| Major arteries and major veins of the body | asset-bvis05-body-artery-vein-maps |
| Male reproductive tract, glands and penis | asset-bvis06-male-system |
| Skull base, external (inferior) view | asset-skeletal-atlas-skull-base-external |
| Alimentary canal: mouth to anus | asset-bvis06-alimentary-canal |
| Ovary: follicle stages and follicle wall | asset-bvis06-ovary-follicle |
| Abdominal placement of the digestive organs | asset-bvis06-abdominal-placement |
| Upper airway: nasal cavity, sinuses and pharynx | asset-bvis05-upper-airway |
| Cranial floor, internal (superior) view | asset-skeletal-atlas-cranial-floor-internal |
| Liver, gallbladder, pancreas and their ducts | asset-bvis06-liver-biliary-pancreas |
| Kidney in section: cortex, medulla and collecting system | asset-bvis06-kidney-section |
| Nephron segments and the urine pathway | asset-bvis06-nephron-pathway |
| Larynx and glottis | asset-bvis05-larynx-glottis |
| Urinary tract and the opened bladder | asset-bvis06-urinary-tract |
| Anterior skull: facial bones and openings | asset-skull-front |
| Left lateral skull | asset-skull-lateral |
| Layers of the digestive wall | asset-bvis06-digestive-wall-layers |
| Skin in section: layers, appendages and receptors | asset-openstax-historical-skin-structure |
| Epidermis: strata and cell types (schematic) | asset-bvis04-epidermis-strata |
| Appendicular skeleton, anterior view | asset-commons-appendicular-skeleton-blank |
| Opened heart: chambers, valves and flow | asset-bvis05-heart-chambers-valves |
| Lymphatic drainage routes and node groups | asset-bvis05-lymph-overview |
| Stomach: regions, rugae and gastric glands | asset-bvis06-stomach |
| Large intestine and anal canal | asset-bvis06-large-intestine |
| Right hand, palmar view: carpals, metacarpals, phalanges | asset-skeletal-atlas-hand-palmar |
| Brain, midsagittal view: callosum, diencephalon, ventricles | asset-servier-brain-sagittal |
| Eye in section: tunics, lens and vitreous chamber | asset-servier-eye-section |
| Oral cavity, pharynx and salivary glands | asset-bvis06-oral-cavity |
| Renal corpuscle and filtration barrier | asset-bvis06-renal-corpuscle |
| Deep brain nuclei, coronal slice | asset-bvis04-deep-nuclei |
| Spinal cord in cross-section: gray matter, tracts and roots | asset-bvis04-spinal-cross-section |
| Right foot, dorsal view: tarsals, metatarsals, phalanges | asset-skeletal-atlas-foot-dorsal |
| Anterior eye: chambers, aqueous humor and zonules | asset-bvis04-eye-anterior-segment |
| Inner ear: vestibule, canals and cochlea | asset-bvis04-inner-ear-vestibular |
| Uterine wall and endometrium | asset-bvis06-uterine-wall |
| Cranial sutures: superior and posterior views | asset-skeletal-atlas-skull-sutures |
| Cranial nerves I-VI, inferior surface of the brain | asset-bvis04-cranial-nerves-i-vi |
| Middle ear: ossicles and windows | asset-bvis04-middle-ear |
| Optic disc, macula and optic nerve head | asset-gray880-optic-nerve-head |
| Spinal nerve: roots, ganglion and rami | asset-bvis04-spinal-roots-rami |
| The four major plexuses and the phrenic nerve | asset-bvis04-plexus-overview |
| Cranial nerves VII-XII, brainstem and cerebellopontine angle | asset-bvis04-cranial-nerves-vii-xii |
| Retina: cell chain (schematic) | asset-bvis04-retina-layers |
| Cochlear ducts and the organ of Corti (schematic) | asset-bvis04-cochlea-corti |
| Gonads: ovary and testis | asset-bvis05-ovary-testis |
| Hand: intrinsic muscles, palmar view | asset-muscular-atlas-hand |
| Foot: plantar first layer and dorsal inset | asset-muscular-atlas-foot |
