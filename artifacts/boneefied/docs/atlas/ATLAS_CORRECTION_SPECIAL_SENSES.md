# Special Senses — individual published-plate review

## Scope

**9 assigned diagrams, 73 existing targets.** Inventory comes from the actual
Special Senses lessons plus question ownership, not filenames or a proposed
module. All nine numbered source/legend overlays were opened individually.
No new plates, structures, modules, questions, specimens or rights were added.

| Published plate | Targets | Individual source findings and action |
|---|---:|---|
| Eye in section: tunics, lens and vitreous chamber | 13 | **Retained.** Right eye from above, anterior at viewer left. Checked sclera/choroid/retina order, anterior lens/cornea/iris, posterior off-axis optic nerve and foveal position. Tunic markers refer to the correct member layer, not adjacent vitreous. |
| Anterior eye: chambers, aqueous humor and zonules | 9 | **Existing detail reframed, not replaced.** Reduced the over-magnified source transform so complete corneal/ciliary-body height and anterior coat context are visible. Both chambers, pupil versus iris, lens and thin zonules remain distinct. Synchronized all nine labels/hotspots/question targets. Aqueous target is inside chamber fluid, not the neighboring corneal edge/blank field; ciliary target stays in actual ciliary tissue. This remains an anterior-focused view, not an extra optic-nerve identification plate. |
| Optic disc, macula and optic nerve head | 6 | **Retained.** Fundus nasal side is viewer right, matching the right-eye caption. Both optic-disc endpoints refer to their own fundus/section panels; macula and fovea are separate. Section shows retinal fibres turning through the disc gap into the optic nerve with central vessels. |
| Retina: cell chain | 6 | **Retained.** Light arrives from the vitreous above; ganglion/bipolar cells precede the photoreceptors, pigment epithelium lies behind them, with choroid/sclera farther below. Rod versus tapered cone pointers and the retinal tissue-region target were checked individually. This is an explicitly simplified schematic, not a specimen. |
| Ear in section: outer, middle and inner | 8 | **Retained.** Right-ear section, lateral/external side viewer left. Canal ends at the tympanic membrane; auditory tube is separate and inferior. Vestibule, looped canals, cochlea and exiting VIII trunk have distinct pointers. Overview source pixels were not regenerated during the detail repair. |
| Middle ear: ossicles and windows | 7 | **Existing detail repaired.** Previously the full-ear magnified crop left the auditory tube as a bottom-edge fragment and cropped irrelevant surrounding labyrinth. Reused the existing chamber, membrane, ossicles, windows and full auditory-tube geometry as a focused complete detail. All seven anchors remapped with the same transform. Stapes points to its actual narrow lower bony limb, not chamber fluid or oval window. |
| Inner ear: vestibule, canals and cochlea | 9 | **Retained.** Flattened right labyrinth, not a literal single coronal plane. Larger utricle above smaller saccule; canal versus inner duct, cochlea, vestibular/cochlear nerve branches, oval window and basal round window individually distinguished. |
| Cochlear ducts and organ of Corti | 6 | **Retained.** Upper vestibular scala, middle cochlear duct and lower tympanic scala checked separately. Modiolar side at viewer left. The enlarged Corti panel keeps inner hair cell on the modiolar side and outer hair cells opposite; organ target is in the sensory/supporting complex, not nearby membrane or blank space. |
| Smell/taste pathways and receptor cells | 9 | **Retained**, including the preceding group's explicit English/Spanish taste-region labels. Olfactory epithelium/fila/bulb and bipolar receptor cell are distinct. Taste territories are not presented as literal nerve fibres; taste bud and gustatory receptor cell endpoints stay distinct. |

## Presentation and data preservation

- All nine assigned assets use image-centered initial/reset framing, fitting the
  raster, numbered bubbles and leaders at natural **1450×1000 / 1.45** proportions.
  Four plates join that policy here: anterior eye, retinal chain, middle ear and
  cochlea/Corti. The other five already used it after the preceding group.
- Protected anatomy rectangles were updated only for the two reframed details.
  Painted labels remain compact; 44px interaction regions are not mistaken for
  visible filled circles.
- **Only two source rasters changed. Seven remain byte-identical.**
  The two repaired preview images receive scoped cache revisions; unrelated
  image-cache keys and saved study data are not cleared.
- Both the generated metadata and the runtime correction share the repaired
  detail geometry. Learning, Recall, Glossary and question hotspots receive the
  same coordinates, including questions with only a subset of targets.
- Before/after comparison confirms unchanged module/lesson ownership, canonical
  structures, source/rights records, question IDs/types/answers/options/scoring,
  and descriptive copy. Differences are confined to the two details' target
  coordinates and their two protected-anatomy rectangles.
- Tinos, uniform matte artwork, bundled image registration, specimen rights and
  offline-loader behavior are retained. No remote artwork or specimens imported.

## Verification

- Type checking and **47 targeted automated tests pass**.
- **73/73 published endpoints** pass source-region checks, supplemented by
  individual painted-anatomy review. Narrow-line targets need visible-pixel or
  curve evidence as well: a padded semantic mask alone incorrectly accepted the
  former stapes point in chamber-colored space. The repaired stapes location is
  on the visible bony curve and has an analytic regression check.
- Evidence: `generated-artifacts/atlas-senses-repair/` contains individually
  numbered before/after source/legend views, owner inventory, hashes and full
  canonical snapshots. Browser interaction results are saved separately there.
- Live verification covers centered 1×, controls, pinch, constrained two-axis
  pan, scroll isolation, Reset, enlarged-text Recall/reveal and question feedback.
  Results and limitations must be read with the completed browser report; local
  bundling or browser touch simulation is not physical-device evidence.

### Completed browser results

- **9/9** Learn plates pass complete centered 1×, correct source proportions,
  ordered legends and bubble/leader containment at 390×844 / Default.
- **9/9** pass 320×844 / Large static layout and Recall individual reveal/hide,
  reveal-all and hide-all, including full legends without horizontal overflow.
- **9/9** received an actual browser mouse pan and Reset. These mouse checks
  alone are explicitly **not** used as proof of pinch or two-axis containment.
- A focused **CDP touch-emulated pass on the four changed frames** (anterior
  eye, retina, middle ear and cochlea/Corti) passes 2×/4× pinch, both-axis 4× pan,
  stable positive/negative limits, image/marker tracking, stationary parent
  scroll and identity Reset. The five unchanged frames retain their preceding
  group's full passing touch/scroll evidence; their artwork, coordinates and
  gesture behavior were not changed here.
- The five canonical **asset-backed** Practice cases pass at 320×844 / Large:
  pupil, stapes, organ of Corti, retinal ganglion cells and olfactory epithelium.
  Correct feedback and revealed labels fit. Generic text-only multiple-choice
  cases were not substituted for these image-based requirements.
- Both revised detail plates reopen after a warm **offline client-side remount**
  as complete 1450×1000 blob images. Their post-remount SHA-256 matches the local
  inventory and their online proof. Nine cache entries remain; no cache clearing.
- Separate non-blocking limitation: the decorative `muscle-fibers-light.webp`
  texture missed offline caching. This was not an anatomy-plate failure and its
  loader was not changed. A fresh native offline launch and physical-device
  touch behavior remain unverified; no native build was started.

No native build, publication, unrelated group work or curriculum expansion.
