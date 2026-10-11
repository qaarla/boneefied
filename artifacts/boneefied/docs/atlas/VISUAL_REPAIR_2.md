# Boneefied Visual Repair 2

## Scope and result

- Reviewed all 164 active published visuals: 157 have annotations or question hotspots; 7 have no persistent marker overlays to tune. Dense reproductive, vascular, nerve, skull, hand/foot plates were reviewed first.
- Reviewed every marker visual in paired normal and enlarged phone-width QA renderings, before and after tuning.
- Added individual anatomy-protection areas on 153 visuals. Four adequate visuals remain on their existing layout.
- Added size overrides to 50 dense/local-cluster visuals only: 18 px base paint, 21 px maximum enlarged paint, 10 px base numeral. Numerals remain at least 10 px; enlarged overridden numerals reach 11.76 px. All other visuals retain the global responsive sizing rule.
- Bubble positions, not anatomical targets, are adjusted. Safe-cell selection avoids protected anatomy and target dots; cell swaps reduce leader crossings without reordering annotations. Where needed, extra viewer whitespace provides safe cells without shrinking or editing the source anatomy.
- Learn, Recall, Glossary and numbered Practice viewers resolve the same tuning by asset identity, including raw atlas-pack aliases.
- Source PNG hashes, ordered label-number/coordinate fingerprints and 723 question-target geometry fingerprints all match the pre-repair baseline. No artwork, anatomical coordinates, raw hotspot radii, answer mappings or legend names were changed.
- Independent hit boxes remain 44 px for label callouts, and 44/60 px for numbered Practice controls. Protected legacy label layouts use the same disjoint 44 px cells without extra hit slop.
- No unrelated UI changes, release builds, deployment or publication. Existing BVR01 changes were retained.

## Verification and evidence limits

- Full test suite: 133 passed, zero failures. Final adjusted hit-area regression: 9 focused tests passed. TypeScript check passed.
- Geometry matrix: every marker plate at image widths 239, 271, 301 and 348 px, normal and 2.8x typography, with both label and numbered-Practice control sizes. The 239 px case covers the narrower nested viewer measured in the live 320 px layout. Painted circles fit their frames and do not intersect protected areas; normalized anatomical endpoints are unchanged.
- All 314 after-render images and 18 paired contact sheets were visually reviewed. Source images and overlays were also reviewed in the before set.
- After-render painted-circle collision count: 0. Colored-ink screening flags: 0. Pixel screening is not a semantic anatomy verdict; visual review is separate.
- The audit rasters model numbered callout geometry. Eight retained/original non-atlas diagrams used different full-label/direct layouts before this repair, so their before rasters are not exact screenshots of those old UI states. Their tuned label viewers now use protected callouts.
- Question geometry fingerprints cover all 723 unique per-asset target configurations. Numbered cell smoke checks are conservative simulations; non-numbered raw target selection remains unchanged and is not claimed to have been converted into numbered controls.
- Generated QA evidence is ignored under generated-artifacts/bvr02/before and generated-artifacts/bvr02/after. See VISUAL_REPAIR_2_AUDIT.json for source hashes and per-diagram findings.
- The focused live-preview pass is complete; findings are below. No physical native-device, offline-rendering, release-binary or published-app verification is claimed.

## Diagrams requiring size overrides (50)

| Diagram | Markers | Asset ID |
|---|---:|---|
| Superficial muscles, anterior and posterior views | 27 | asset-openstax-muscle-labeled-overview |
| Female internal organs: ovary, tube, uterus and vagina | 25 | asset-bvis06-female-gross |
| Testis, epididymis and seminiferous tubule | 23 | asset-bvis06-testis-ducts |
| Heart from the front: chambers, apex and great vessels | 22 | asset-bvis05-heart-anterior |
| Major arteries and major veins of the body | 22 | asset-bvis05-body-artery-vein-maps |
| Male reproductive tract, glands and penis | 21 | asset-bvis06-male-system |
| Skull base, external (inferior) view | 20 | asset-skeletal-atlas-skull-base-external |
| Alimentary canal: mouth to anus | 20 | asset-bvis06-alimentary-canal |
| Ovary: follicle stages and follicle wall | 20 | asset-bvis06-ovary-follicle |
| Abdominal placement of the digestive organs | 20 | asset-bvis06-abdominal-placement |
| Upper airway: nasal cavity, sinuses and pharynx | 19 | asset-bvis05-upper-airway |
| Cranial floor, internal (superior) view | 18 | asset-skeletal-atlas-cranial-floor-internal |
| Liver, gallbladder, pancreas and their ducts | 18 | asset-bvis06-liver-biliary-pancreas |
| Kidney in section: cortex, medulla and collecting system | 18 | asset-bvis06-kidney-section |
| Nephron segments and the urine pathway | 18 | asset-bvis06-nephron-pathway |
| Larynx and glottis | 17 | asset-bvis05-larynx-glottis |
| Urinary tract and the opened bladder | 17 | asset-bvis06-urinary-tract |
| Anterior skull: facial bones and openings | 16 | asset-skull-front |
| Left lateral skull | 16 | asset-skull-lateral |
| Layers of the digestive wall | 16 | asset-bvis06-digestive-wall-layers |
| Skin in section: layers, appendages and receptors | 15 | asset-openstax-historical-skin-structure |
| Epidermis: strata and cell types (schematic) | 15 | asset-bvis04-epidermis-strata |
| Appendicular skeleton, anterior view | 14 | asset-commons-appendicular-skeleton-blank |
| Opened heart: chambers, valves and flow | 14 | asset-bvis05-heart-chambers-valves |
| Lymphatic drainage routes and node groups | 14 | asset-bvis05-lymph-overview |
| Stomach: regions, rugae and gastric glands | 14 | asset-bvis06-stomach |
| Large intestine and anal canal | 14 | asset-bvis06-large-intestine |
| Right hand, palmar view: carpals, metacarpals, phalanges | 13 | asset-skeletal-atlas-hand-palmar |
| Brain, midsagittal view: callosum, diencephalon, ventricles | 13 | asset-servier-brain-sagittal |
| Eye in section: tunics, lens and vitreous chamber | 13 | asset-servier-eye-section |
| Oral cavity, pharynx and salivary glands | 13 | asset-bvis06-oral-cavity |
| Renal corpuscle and filtration barrier | 11 | asset-bvis06-renal-corpuscle |
| Deep brain nuclei, coronal slice | 10 | asset-bvis04-deep-nuclei |
| Spinal cord in cross-section: gray matter, tracts and roots | 10 | asset-bvis04-spinal-cross-section |
| Right foot, dorsal view: tarsals, metatarsals, phalanges | 9 | asset-skeletal-atlas-foot-dorsal |
| Anterior eye: chambers, aqueous humor and zonules | 9 | asset-bvis04-eye-anterior-segment |
| Inner ear: vestibule, canals and cochlea | 9 | asset-bvis04-inner-ear-vestibular |
| Uterine wall and endometrium | 9 | asset-bvis06-uterine-wall |
| Cranial sutures: superior and posterior views | 7 | asset-skeletal-atlas-skull-sutures |
| Cranial nerves I-VI, inferior surface of the brain | 7 | asset-bvis04-cranial-nerves-i-vi |
| Middle ear: ossicles and windows | 7 | asset-bvis04-middle-ear |
| Optic disc, macula and optic nerve head | 6 | asset-gray880-optic-nerve-head |
| Spinal nerve: roots, ganglion and rami | 6 | asset-bvis04-spinal-roots-rami |
| The four major plexuses and the phrenic nerve | 6 | asset-bvis04-plexus-overview |
| Cranial nerves VII-XII, brainstem and cerebellopontine angle | 6 | asset-bvis04-cranial-nerves-vii-xii |
| Retina: cell chain (schematic) | 6 | asset-bvis04-retina-layers |
| Cochlear ducts and the organ of Corti (schematic) | 6 | asset-bvis04-cochlea-corti |
| Gonads: ovary and testis | 5 | asset-bvis05-ovary-testis |
| Hand: intrinsic muscles, palmar view | 4 | asset-muscular-atlas-hand |
| Foot: plantar first layer and dorsal inset | 4 | asset-muscular-atlas-foot |

## Adequate diagrams left unchanged

- Anterior skeleton — asset-atlas-skeleton-anterior
- Posterior skeleton — asset-atlas-skeleton-posterior
- Femoral and sciatic nerves of the right lower limb — asset-bvis04-lower-limb-nerves
- Diaphragm: domes and inferior view — asset-openstax-diaphragm-labeled

## Complete per-diagram disposition

| Diagram | Markers | Size override | Position protection |
|---|---:|---|---|
| Superficial muscles, anterior and posterior views (asset-openstax-muscle-labeled-overview) | 27 | 18 px; max 21 px | 2 protected region(s) |
| Female internal organs: ovary, tube, uterus and vagina (asset-bvis06-female-gross) | 25 | 18 px; max 21 px | 2 protected region(s) |
| Testis, epididymis and seminiferous tubule (asset-bvis06-testis-ducts) | 23 | 18 px; max 21 px | 2 protected region(s) |
| Heart from the front: chambers, apex and great vessels (asset-bvis05-heart-anterior) | 22 | 18 px; max 21 px | 2 protected region(s) |
| Major arteries and major veins of the body (asset-bvis05-body-artery-vein-maps) | 22 | 18 px; max 21 px | 2 protected region(s) |
| Male reproductive tract, glands and penis (asset-bvis06-male-system) | 21 | 18 px; max 21 px | 2 protected region(s) |
| Skull base, external (inferior) view (asset-skeletal-atlas-skull-base-external) | 20 | 18 px; max 21 px | 1 protected region(s) |
| Alimentary canal: mouth to anus (asset-bvis06-alimentary-canal) | 20 | 18 px; max 21 px | 2 protected region(s) |
| Ovary: follicle stages and follicle wall (asset-bvis06-ovary-follicle) | 20 | 18 px; max 21 px | 2 protected region(s) |
| Abdominal placement of the digestive organs (asset-bvis06-abdominal-placement) | 20 | 18 px; max 21 px | 2 protected region(s) |
| Upper airway: nasal cavity, sinuses and pharynx (asset-bvis05-upper-airway) | 19 | 18 px; max 21 px | 2 protected region(s) |
| Cranial floor, internal (superior) view (asset-skeletal-atlas-cranial-floor-internal) | 18 | 18 px; max 21 px | 1 protected region(s) |
| Liver, gallbladder, pancreas and their ducts (asset-bvis06-liver-biliary-pancreas) | 18 | 18 px; max 21 px | 2 protected region(s) |
| Kidney in section: cortex, medulla and collecting system (asset-bvis06-kidney-section) | 18 | 18 px; max 21 px | 2 protected region(s) |
| Nephron segments and the urine pathway (asset-bvis06-nephron-pathway) | 18 | 18 px; max 21 px | 2 protected region(s) |
| Larynx and glottis (asset-bvis05-larynx-glottis) | 17 | 18 px; max 21 px | 2 protected region(s) |
| Urinary tract and the opened bladder (asset-bvis06-urinary-tract) | 17 | 18 px; max 21 px | 2 protected region(s) |
| Anterior skull: facial bones and openings (asset-skull-front) | 16 | 18 px; max 21 px | 1 protected region(s) |
| Left lateral skull (asset-skull-lateral) | 16 | 18 px; max 21 px | 1 protected region(s) |
| Layers of the digestive wall (asset-bvis06-digestive-wall-layers) | 16 | 18 px; max 21 px | 2 protected region(s) |
| Skin in section: layers, appendages and receptors (asset-openstax-historical-skin-structure) | 15 | 18 px; max 21 px | 1 protected region(s) |
| Epidermis: strata and cell types (schematic) (asset-bvis04-epidermis-strata) | 15 | 18 px; max 21 px | 2 protected region(s) |
| Anterior skeleton (asset-atlas-skeleton-anterior) | 14 | Global rule retained | Unchanged |
| Appendicular skeleton, anterior view (asset-commons-appendicular-skeleton-blank) | 14 | 18 px; max 21 px | 1 protected region(s) |
| Opened heart: chambers, valves and flow (asset-bvis05-heart-chambers-valves) | 14 | 18 px; max 21 px | 1 protected region(s) |
| Lymphatic drainage routes and node groups (asset-bvis05-lymph-overview) | 14 | 18 px; max 21 px | 2 protected region(s) |
| Stomach: regions, rugae and gastric glands (asset-bvis06-stomach) | 14 | 18 px; max 21 px | 2 protected region(s) |
| Large intestine and anal canal (asset-bvis06-large-intestine) | 14 | 18 px; max 21 px | 2 protected region(s) |
| Right hand, palmar view: carpals, metacarpals, phalanges (asset-skeletal-atlas-hand-palmar) | 13 | 18 px; max 21 px | 1 protected region(s) |
| Posterior skeleton (asset-atlas-skeleton-posterior) | 13 | Global rule retained | Unchanged |
| Brain, midsagittal view: callosum, diencephalon, ventricles (asset-servier-brain-sagittal) | 13 | 18 px; max 21 px | 1 protected region(s) |
| Eye in section: tunics, lens and vitreous chamber (asset-servier-eye-section) | 13 | 18 px; max 21 px | 1 protected region(s) |
| Oral cavity, pharynx and salivary glands (asset-bvis06-oral-cavity) | 13 | 18 px; max 21 px | 2 protected region(s) |
| Red bone marrow and hematopoiesis (asset-bvis05-marrow-hematopoiesis) | 12 | Global rule retained | 2 protected region(s) |
| Vessel wall layers and vessel types (asset-bvis05-vessel-wall-types) | 12 | Global rule retained | 2 protected region(s) |
| Kidney placement in the abdomen (asset-bvis06-kidney-placement) | 12 | Global rule retained | 2 protected region(s) |
| Respiratory membrane and airway wall (asset-bvis05-respiratory-membrane-histology) | 11 | Global rule retained | 1 protected region(s) |
| Lymph node: afferent, sinuses, efferent and hilum (asset-bvis05-lymph-node-structure) | 11 | Global rule retained | 1 protected region(s) |
| Renal blood vessels, hilum to nephron and back (asset-bvis06-renal-vessels) | 11 | Global rule retained | 1 protected region(s) |
| Renal corpuscle and filtration barrier (asset-bvis06-renal-corpuscle) | 11 | 18 px; max 21 px | 2 protected region(s) |
| Right shoulder joint relationships, anterior view (asset-skeletal-atlas-shoulder-joint) | 10 | Global rule retained | 1 protected region(s) |
| Right knee: anterior layer (left) and deep cruciates, patella omitted (right) (asset-skeletal-atlas-knee-joint) | 10 | Global rule retained | 2 protected region(s) |
| Anterior anatomical position (asset-atlas-anterior-position) | 10 | Global rule retained | 1 protected region(s) |
| Major body cavities with serous-space inset (asset-atlas-body-cavities) | 10 | Global rule retained | 1 protected region(s) |
| Axial and appendicular skeleton (asset-atlas-skeleton-axial-appendicular) | 10 | Global rule retained | 1 protected region(s) |
| Regional vertebrae compared: cervical, thoracic, lumbar (superior view) (asset-cervical-vertebra) | 10 | Global rule retained | 1 protected region(s) |
| Deep brain nuclei, coronal slice (asset-bvis04-deep-nuclei) | 10 | 18 px; max 21 px | 1 protected region(s) |
| Ventricles, CSF and meninges (asset-bvis04-csf-meninges) | 10 | Global rule retained | 2 protected region(s) |
| Spinal cord in cross-section: gray matter, tracts and roots (asset-bvis04-spinal-cross-section) | 10 | 18 px; max 21 px | 1 protected region(s) |
| Pericardium and layers of the heart wall (asset-bvis05-heart-wall-pericardium) | 10 | Global rule retained | 2 protected region(s) |
| Coronary sinus and posterior coronary vessels (asset-bvis05-coronary-posterior) | 10 | Global rule retained | 1 protected region(s) |
| Trachea, bronchi and bronchioles (asset-bvis05-trachea-bronchial-tree) | 10 | Global rule retained | 2 protected region(s) |
| Lungs: lobes, fissures and hilum (asset-bvis05-lung-lobes) | 10 | Global rule retained | 2 protected region(s) |
| Small intestine: regions and mucosa (asset-bvis06-small-intestine) | 10 | Global rule retained | 2 protected region(s) |
| Typical vertebra: superior view with lateral inset (asset-skeletal-atlas-vertebra-typical) | 9 | Global rule retained | 2 protected region(s) |
| Atlas (C1) from above and axis (C2) from the side (asset-skeletal-atlas-atlas-axis) | 9 | Global rule retained | 2 protected region(s) |
| Right forearm, anterior view, with proximal-ulna inset (asset-skeletal-atlas-forearm) | 9 | Global rule retained | 2 protected region(s) |
| Right hip bone: lateral (left) and medial (right) views (asset-skeletal-atlas-hip-bone) | 9 | Global rule retained | 2 protected region(s) |
| Right foot, dorsal view: tarsals, metatarsals, phalanges (asset-skeletal-atlas-foot-dorsal) | 9 | 18 px; max 21 px | 1 protected region(s) |
| Nine abdominal regions (asset-atlas-abdominal-regions) | 9 | Global rule retained | 1 protected region(s) |
| Whole-body organ locations (asset-atlas-organ-locations) | 9 | Global rule retained | 1 protected region(s) |
| Axial skeleton, anterior view (asset-commons-axial-skeleton-blank) | 9 | Global rule retained | 1 protected region(s) |
| Face and neck muscles, right lateral view (asset-openstax-muscle-face-neck) | 9 | Global rule retained | 1 protected region(s) |
| Anterior chest and shoulder muscles (asset-openstax-muscle-anterior-trunk) | 9 | Global rule retained | 1 protected region(s) |
| Anterior eye: chambers, aqueous humor and zonules (asset-bvis04-eye-anterior-segment) | 9 | 18 px; max 21 px | 1 protected region(s) |
| Inner ear: vestibule, canals and cochlea (asset-bvis04-inner-ear-vestibular) | 9 | 18 px; max 21 px | 1 protected region(s) |
| Smell and taste: pathways and receptor cells (schematic) (asset-bvis04-smell-taste) | 9 | Global rule retained | 3 protected region(s) |
| Peripheral blood smear (schematic field) (asset-bvis05-blood-smear-schematic) | 9 | Global rule retained | 1 protected region(s) |
| Arterial route to the arm and hand (asset-bvis05-upper-limb-arteries) | 9 | Global rule retained | 1 protected region(s) |
| Venous return from the arm and the median cubital vein (asset-bvis05-upper-limb-veins) | 9 | Global rule retained | 2 protected region(s) |
| Pleura and diaphragm (asset-bvis05-pleura-diaphragm) | 9 | Global rule retained | 2 protected region(s) |
| Endocrine glands of the body (asset-bvis05-endocrine-body-map) | 9 | Global rule retained | 2 protected region(s) |
| Thyroid and parathyroid glands (asset-bvis05-thyroid-parathyroid) | 9 | Global rule retained | 3 protected region(s) |
| Liver lobule and pancreatic acini (asset-bvis06-liver-lobule-pancreas) | 9 | Global rule retained | 2 protected region(s) |
| Uterine wall and endometrium (asset-bvis06-uterine-wall) | 9 | 18 px; max 21 px | 2 protected region(s) |
| Pectoral girdle relationships, anterior view (right side detailed) (asset-skeletal-atlas-pectoral-girdle) | 8 | Global rule retained | 1 protected region(s) |
| Right humerus: anterior (left) and posterior (right) (asset-skeletal-atlas-humerus) | 8 | Global rule retained | 2 protected region(s) |
| Right leg, anterior view, with tibial-plateau inset (asset-skeletal-atlas-leg-tibia-fibula) | 8 | Global rule retained | 2 protected region(s) |
| Posterior anatomical position (asset-atlas-posterior-position) | 8 | Global rule retained | 1 protected region(s) |
| Original cell overview (asset-original-cell-overview) | 8 | Global rule retained | 1 protected region(s) |
| Ear in section: outer, middle and inner (asset-servier-ear-section) | 8 | Global rule retained | 1 protected region(s) |
| Anterior thigh: superficial layer (asset-openstax-muscle-anterior-leg) | 8 | Global rule retained | 3 protected region(s) |
| Dermis and hypodermis: fibres and vessels (asset-bvis04-dermis-hypodermis) | 8 | Global rule retained | 1 protected region(s) |
| Hair follicle in longitudinal section (asset-bvis04-hair-follicle) | 8 | Global rule retained | 1 protected region(s) |
| The five leukocytes, compared (asset-bvis05-leukocyte-types) | 8 | Global rule retained | 1 protected region(s) |
| Spleen: red pulp and white pulp (asset-bvis05-spleen-pulp) | 8 | Global rule retained | 2 protected region(s) |
| Hypothalamus and pituitary: portal and neural links (asset-bvis05-hypothalamus-pituitary-axis) | 8 | Global rule retained | 1 protected region(s) |
| Deep back muscles (trapezius and latissimus dorsi removed) (asset-muscular-atlas-deep-back) | 7 | Global rule retained | 1 protected region(s) |
| Cranial sutures: superior and posterior views (asset-skeletal-atlas-skull-sutures) | 7 | 18 px; max 21 px | 2 protected region(s) |
| Thoracic cage, anterior view (asset-skeletal-atlas-thoracic-cage) | 7 | Global rule retained | 1 protected region(s) |
| Generic synovial joint in section (asset-skeletal-atlas-synovial-joint) | 7 | Global rule retained | 1 protected region(s) |
| Pelvis (asset-servier-pelvis) | 7 | Global rule retained | 1 protected region(s) |
| Superficial back and scapular muscles (asset-openstax-muscle-posterior-back) | 7 | Global rule retained | 1 protected region(s) |
| Brainstem, cerebellum and spinal cord, midsagittal (asset-bvis04-brainstem-cerebellum) | 7 | Global rule retained | 1 protected region(s) |
| Cranial nerves I-VI, inferior surface of the brain (asset-bvis04-cranial-nerves-i-vi) | 7 | 18 px; max 21 px | 1 protected region(s) |
| Middle ear: ossicles and windows (asset-bvis04-middle-ear) | 7 | 18 px; max 21 px | 1 protected region(s) |
| Composition of blood: plasma, serum and formed elements (asset-bvis05-blood-composition) | 7 | Global rule retained | 3 protected region(s) |
| Carotid arteries and jugular veins of the head and neck (asset-bvis05-head-neck-vessels) | 7 | Global rule retained | 1 protected region(s) |
| Hepatic portal system (asset-bvis05-hepatic-portal-system) | 7 | Global rule retained | 1 protected region(s) |
| Tonsils: where they sit and how they are built (asset-bvis05-tonsil-map-structure) | 7 | Global rule retained | 2 protected region(s) |
| Adrenal gland: cortex zones and medulla (asset-bvis05-adrenal-zones) | 7 | Global rule retained | 2 protected region(s) |
| Pancreas: exocrine acini and the endocrine islet (asset-bvis05-pancreas-islet) | 7 | Global rule retained | 1 protected region(s) |
| Rib detail: head, tubercle and costal groove (asset-skeletal-atlas-rib-detail) | 6 | Global rule retained | 2 protected region(s) |
| Right femur: anterior (left) and posterior (right) (asset-skeletal-atlas-femur) | 6 | Global rule retained | 2 protected region(s) |
| Optic disc, macula and optic nerve head (asset-gray880-optic-nerve-head) | 6 | 18 px; max 21 px | 2 protected region(s) |
| Brain, lateral surface: lobes and insula (asset-servier-brain-lateral) | 6 | Global rule retained | 1 protected region(s) |
| Anterior arm: superficial and deep layers (asset-openstax-muscle-anterior-arm) | 6 | Global rule retained | 2 protected region(s) |
| Spinal nerve: roots, ganglion and rami (asset-bvis04-spinal-roots-rami) | 6 | 18 px; max 21 px | 1 protected region(s) |
| The four major plexuses and the phrenic nerve (asset-bvis04-plexus-overview) | 6 | 18 px; max 21 px | 1 protected region(s) |
| Cranial nerves VII-XII, brainstem and cerebellopontine angle (asset-bvis04-cranial-nerves-vii-xii) | 6 | 18 px; max 21 px | 1 protected region(s) |
| Retina: cell chain (schematic) (asset-bvis04-retina-layers) | 6 | 18 px; max 21 px | 1 protected region(s) |
| Cochlear ducts and the organ of Corti (schematic) (asset-bvis04-cochlea-corti) | 6 | 18 px; max 21 px | 2 protected region(s) |
| Valves of the heart from above (asset-bvis05-heart-valves-superior) | 6 | Global rule retained | 1 protected region(s) |
| Coronary vessels, anterior surface (asset-bvis05-coronary-anterior) | 6 | Global rule retained | 1 protected region(s) |
| Flow chain: aorta to vein (asset-bvis05-vessel-flow-chain) | 6 | Global rule retained | 1 protected region(s) |
| Three capillary types (asset-bvis05-capillary-types) | 6 | Global rule retained | 3 protected region(s) |
| Arterial route to the leg and foot (asset-bvis05-lower-limb-arteries) | 6 | Global rule retained | 3 protected region(s) |
| Alveolar unit: bronchiole, duct, sac and alveoli (asset-bvis05-alveolar-unit) | 6 | Global rule retained | 1 protected region(s) |
| Forearm: anterior and posterior views (asset-muscular-atlas-forearm) | 5 | Global rule retained | 2 protected region(s) |
| Right scapula: anterior (left) and posterior (right) (asset-skeletal-atlas-scapula) | 5 | Global rule retained | 2 protected region(s) |
| Sweat and sebaceous glands (asset-gray946-sweat-gland) | 5 | Global rule retained | 2 protected region(s) |
| Original mitosis stages (asset-original-mitosis-stages) | 5 | Global rule retained | 1 protected region(s) |
| Original body cavities (asset-original-body-cavities) | 5 | Global rule retained | 1 protected region(s) |
| Posterior lower limb: contextual overview (asset-openstax-muscle-posterior-leg) | 5 | Global rule retained | 1 protected region(s) |
| Rotator cuff: anterior and posterior views (asset-injurymap-rotator-cuff-labeled) | 5 | Global rule retained | 2 protected region(s) |
| Median, ulnar and radial nerves of the right upper limb (asset-bvis04-upper-limb-nerves) | 5 | Global rule retained | 2 protected region(s) |
| Loose connective tissues: areolar, adipose, reticular (schematic) (asset-bvis04-connective-loose) | 5 | Global rule retained | 2 protected region(s) |
| Great saphenous vein: foot to groin (asset-bvis05-great-saphenous-route) | 5 | Global rule retained | 2 protected region(s) |
| Thymus and thymic lobule (asset-bvis05-thymus-lobule) | 5 | Global rule retained | 2 protected region(s) |
| Gut-associated lymphoid tissue and the lacteal (asset-bvis05-gut-lymphoid-lacteal) | 5 | Global rule retained | 2 protected region(s) |
| Gonads: ovary and testis (asset-bvis05-ovary-testis) | 5 | 18 px; max 21 px | 2 protected region(s) |
| Peritoneal folds: mesentery and omenta (asset-bvis06-peritoneal-folds) | 5 | Global rule retained | 2 protected region(s) |
| Posterior arm and elbow (asset-muscular-atlas-posterior-arm) | 4 | Global rule retained | 2 protected region(s) |
| Abdominal wall layers (asset-muscular-atlas-abdominal-wall) | 4 | Global rule retained | 1 protected region(s) |
| Calf: surface and cutaway (asset-muscular-atlas-calf) | 4 | Global rule retained | 2 protected region(s) |
| Hand: intrinsic muscles, palmar view (asset-muscular-atlas-hand) | 4 | 18 px; max 21 px | 1 protected region(s) |
| Foot: plantar first layer and dorsal inset (asset-muscular-atlas-foot) | 4 | 18 px; max 21 px | 2 protected region(s) |
| Four abdominal quadrants (asset-atlas-abdominal-quadrants) | 4 | Global rule retained | 1 protected region(s) |
| Elbow joint (asset-servier-elbow-joint) | 4 | Global rule retained | 1 protected region(s) |
| Femoral and sciatic nerves of the right lower limb (asset-bvis04-lower-limb-nerves) | 4 | Global rule retained | Unchanged |
| Simple epithelia: squamous, cuboidal, columnar (schematic) (asset-bvis04-epithelia-simple) | 4 | Global rule retained | 1 protected region(s) |
| Pseudostratified and stratified squamous epithelia (schematic) (asset-bvis04-epithelia-stratified) | 4 | Global rule retained | 1 protected region(s) |
| Cartilages: hyaline, elastic, fibrocartilage (schematic) (asset-bvis04-cartilage) | 4 | Global rule retained | 1 protected region(s) |
| Muscle tissues: skeletal, cardiac, smooth (schematic) (asset-bvis04-muscle-tissue) | 4 | Global rule retained | 1 protected region(s) |
| Nail in longitudinal section (asset-bvis04-nail-section) | 4 | Global rule retained | 1 protected region(s) |
| Conduction system of the heart (asset-bvis05-conduction-system) | 4 | Global rule retained | 1 protected region(s) |
| Celiac trunk and renal vessels (asset-bvis05-celiac-renal-context) | 4 | Global rule retained | 1 protected region(s) |
| Deep thigh: anterior and posterior cutaways (asset-muscular-atlas-deep-thigh) | 3 | Global rule retained | 2 protected region(s) |
| Pelvic floor: levator ani, superior view (asset-muscular-atlas-pelvic-floor) | 3 | Global rule retained | 1 protected region(s) |
| Three body planes compared (asset-atlas-body-planes) | 3 | Global rule retained | 3 protected region(s) |
| Original anatomical planes (asset-original-anatomical-planes) | 3 | Global rule retained | 3 protected region(s) |
| Stratified cuboidal, columnar and transitional epithelia (schematic) (asset-bvis04-epithelia-other-stratified) | 3 | Global rule retained | 1 protected region(s) |
| Dense connective tissues: regular, irregular, elastic (schematic) (asset-bvis04-connective-dense) | 3 | Global rule retained | 1 protected region(s) |
| Gluteal region: surface and cutaway (asset-muscular-atlas-gluteal) | 2 | Global rule retained | 3 protected region(s) |
| Anterior and lateral leg (asset-muscular-atlas-anterior-leg) | 2 | Global rule retained | 1 protected region(s) |
| Nervous tissue: neuron and neuroglia (schematic) (asset-bvis04-nervous-tissue) | 2 | Global rule retained | 1 protected region(s) |
| Diaphragm: domes and inferior view (asset-openstax-diaphragm-labeled) | 1 | Global rule retained | Unchanged |

## Reproduce QA evidence

    node --experimental-strip-types artifacts/boneefied/scripts/atlas/bvr02-audit.ts after
    node --experimental-strip-types artifacts/boneefied/scripts/atlas/bvr02-contact-sheets.ts after

The before option removes BVR02 presentation metadata to reproduce the prior global rule; keep the original before inventory for the recorded hash comparison.

## Focused live-preview findings

- Normal 390 px viewport: female-gross 25, testis/ducts 23, cranial nerves 7 and anterior heart 22 measured 18 px paint, 10 px numerals and 44×44 px Study hits.
- Enlarged 320 px viewport: skull base 20, hand 13 and dorsal foot 9 measured 21 px paint, 11.76 px numerals and 44×44 px Study hits. The global-size thoracic-cage control retained 31.9 px paint and 14.6625 px numerals; its positioning is tuned, but its size is not overridden.
- On the female plate, tapping outside the painted circle but inside the hit area revealed Uterus, including its duplicate structure marker. A second tap hid it and restored generic hidden accessibility states.
- Zoom reached 1.5×, a marker-free drag moved the canvas by 25 px in each direction, and Reset restored the original transform.
- Enlarged skull-base Practice measured a 60×60 px hit target around 21×21 px paint. An outer-area tap selected the requested foramen-ovale target; Submit was left untouched. No answer or score was submitted.
- Median nerve search returned one glossary entry; its associated upper-limb nerve atlas and filtered marker were present.
- Visible marker numbers and accessible legend entries matched. Cranial, skull-base and heart screenshots showed bubbles in surrounding whitespace rather than covering their depicted anatomy.
- The tester initially flagged eight coarse rectangular overlaps on each of two plates, then retracted the implication of anatomy occlusion. Its heart calculation used full-frame DOM image bounds despite the visible contain rendering, plus rectangular paint bounds. These are not the authored contained-image/circle tests. Exact per-region geometry checks are zero; the screenshots are consistent with them.
- Direct-URL navigation produced a GO_BACK warning with no prior navigation stack. The normal in-app return path was not evaluated. At extreme enlarged typography, some headings/prompts wrap into narrow fragments; the document remained 320 px wide with no horizontal overflow. These unrelated existing layout/navigation observations were not changed in this repair.
- Browser results and the measurement clarification are retained in VISUAL_REPAIR_2_BROWSER_CHECKS.json. This is web-preview evidence, not physical native-device or release-binary verification.
