---
name: Boneefied atlas standard
description: User requirements for the reusable anatomy visual language and rights-safe extensions.
---

Boneefied should look like a coherent college anatomy atlas, not a collage of unrelated internet images. Use flat/matte, restrained, clean medical illustrations with simple anatomical forms, consistent line weight, low-saturation system colors, orientation cues, margins, labels, hotspots, backgrounds, and captions. Each instructional plate has one uncluttered learning purpose. Reuse one base illustration for Learn, Recall, and image questions whenever practical.

Keep the teaching scope at introductory college anatomy: “minimum stuff, and a little extra,” with visuals “inside the questions.” “Let’s just keep it 2D.”

**Why:** The user explicitly chose this scope rather than an exhaustive visual expansion or 3D.

**How to apply:** Prioritize meaningful image questions and small gaps in core anatomy coverage; do not expand into 3D or decorative illustration collections.

Prefer original in-project vector/SVG diagrams from anatomical facts cross-checked against reliable references, without tracing or closely reproducing copyrighted modern illustrations.

NIH NIAID BioArt Source is the approved primary external visual source when an exact entry is suitable: verify that entry's license and record creator/source/URL. Public-domain entries may be adapted. Servier Medical Art is the approved secondary source: verify the exact source and retain CC BY 4.0 attribution and a modification notice when adapted. Verified Gray's Anatomy 1918 public-domain plates may support checks or remain when unusually useful, but their antique style must not define the pack.

Do not use OpenStax illustrations in the new visual pack without documented explicit commercial reuse permission for the exact asset. Current OpenStax web licensing is not sufficient. Do not use random web images, stock photos, watermarked art, or unclear-rights assets. Keep machine-readable provenance for every new visual.

**Why:** The user requested “uniform 2D anatomy visuals,” a “legit-looking thing,” and “simple and efficiently and with dignity,” and specified these reuse boundaries.

**How to apply:** Apply this standard to foundational atlas plates and later visual-pack extensions. Preserve existing anatomy/content and use the current offline image viewer, gestures, rights disclosure, and accessibility scaling.

## Visual verification is separate from catalog validation
Passing canonical-ID, bounding-box, or normalized-distance checks does not establish anatomical correctness. Inspect the rendered contours and leader endpoints, not merely the presence of semantic tags. A feature hidden in the stated view belongs in an explicitly identified alternate-view detail, not at an invented visible location.

**Why:** Atlas audits passed while bone landmarks were disconnected and a hidden costal facet was depicted as visible. Retained image targets also scored correctly while pointing into blank space because old annotations and the assumed image ratio were wrong.

Muscular own-tissue pixel checks likewise passed while bellies were disconnected and a tendon crossed the wrong side of a bony arch.

**How to apply:** Review changed art and anatomy anchors directly. Check retained-image dimensions against the actual PNG, and distinguish displaced touch controls from the anatomical dots at their leader endpoints.

For muscles, explicitly inspect belly-to-tendon continuity, attachment landmarks, and which tissues or bones occlude a tendon. A correctly colored anchor is not evidence that those relationships are correct.

Reject nonfinite SVG geometry independently of successful raster conversion
and semantic-mask checks.

**Why:** The image renderer silently omitted invalid muscle-fiber paths while
returning success; filled-shape masks still passed because they did not include
those missing diagnostic strokes.

**How to apply:** Check source paths for nonfinite coordinates, then visually
inspect diagnostic fibers and layer distinctions in the final raster. A
successful conversion or correctly colored muscle target does not prove that
the muscle's identifying detail rendered.

For nervous and senses plates, distinguish a peripheral nerve from its central bulb/tract and inspect continuous labyrinth connections and articulations.

**Why:** An olfactory-nerve target on a bulb passed semantic-mask checks, as did detached semicircular ducts. Their metadata was internally consistent but the anatomy was wrong.

**How to apply:** Inspect the actual depicted structure and connections at full size; do not equate a correctly named drawing group with anatomical evidence.

For vascular, respiratory and lymphatic schematics, inspect continuous vessel/air lumens, where vessels actually enter tissue, and whether a space target lies between its bounding tissues rather than within an organ.

**Why:** Semantic masks also accepted floating capillary bridges, sealed alveolar bubbles, afferents ending in follicles, and a pleural-space target inside lung tissue. Overpainted semantic regions displaced a white-pulp anchor onto marginal zone.

**How to apply:** Review the final visible rendering after mask validation. Mere contact at a single point is not an open lumen; distinguish tissue, lumen and potential space explicitly.

Retain real microscopy by asset identity/type, not the question task type.

**Why:** A real spinal-cord specimen uses a multiple-choice question; filtering only histology-identification tasks would incorrectly substitute a schematic.

**How to apply:** Preserve specimen endpoints across all question types when replacing gross diagrams.

Distinguish complete-source containment from an intrinsically limited
photographic field. Do not invent missing histology to make a whole anatomical
outline appear inside the viewer.

**Why:** The retained spinal-cord photograph itself trims the outer ventral
rim. Outpainting would fabricate specimen evidence, not fix viewer cropping.

**How to apply:** Preserve authentic pixels and their rights, fit the entire
original file at its actual aspect, and explicitly report intrinsic source
limitations separately from viewer framing and numbered-target defects.

Do not assume re-rendered PNG bytes are identical merely because SVG paint is
unchanged. The image renderer embeds current creation/modification timestamps.

**Why:** A metadata-only provenance synchronization re-rendered unchanged limb
drawings but changed PNG SHA-256 values through date chunks, invalidating a
byte-for-byte comparison without changing the teaching graphics.

**How to apply:** Avoid re-rendering for metadata-only edits. Distinguish decoded
pixel identity from byte integrity, and still use exact full-file hashes for
downloads and other integrity-sensitive deliveries.

For regional innervation maps, name a filled territory as a region rather than
pretending its target is on a drawn nerve fibre.

**Why:** The taste map used fibre names for colored tongue/epiglottic territories.
Moving those targets onto unrelated thin lines would change the taught meaning.

**How to apply:** Use explicit per-view regional labels in both languages while
preserving canonical IDs, answers and coordinates; distinguish a regional map
from a detailed nerve-path or fascicle diagram.

Keep marker paint smaller than its interaction area, and adapt painted size to image width and annotation density rather than enlarging the artwork's numbered circles to satisfy touch targets.

**Why:** Physical/rendered feedback said the new 2D diagrams were fundamentally good but “the numbers are a bit gigantic” and “The bubbles are a bit enormous,” especially on dense phone-width diagrams. The requested repair concerned the controls, not the anatomy.

**How to apply:** Preserve anatomy coordinates and answer mappings when repairing marker presentation. Keep generous invisible hit areas, readable contrast, and full accessible names/legends. Per-diagram tuning requires a separate request; optional override support is not authorization to apply overrides.

## Bounded correction passes

The user requires “one section at a time” and “do a clean pass”: inspect every
published visual in the named group, correct only what needs correction, preserve
content/progress and the understated matte style, do no builds or unrelated
redesign, and stop after that group.

**Why:** The user repeated these boundaries for the sequential atlas corrections.

**How to apply:** Inventory published lesson, glossary and question uses before
editing, exercise every affected plate's viewer, and report inspected,
corrected and problematic counts. Do not continue automatically to another
system or use these passes to redesign shared controls.

## Visual-question response verification

Check grading with the response actually emitted by the UI, not only with the
question's own canonical answer.

**Why:** A legacy heart hotspot accepted its display-name answer but rejected the
correct structure ID emitted by tapping the anatomical target. Source geometry
and canonical-answer self-checks alone did not catch this.

**How to apply:** For each hotspot, verify correct target IDs through grading,
including locale normalization. Preserve the canonical answer; add only the
required machine-ID alias when repairing a legacy mismatch.

## Illustration limitations notice

Keep a single educational limitations note in Settings/About: illustrations are
simplified and may be imperfect; encourage comparison with course materials,
trusted anatomy texts and reputable educational websites.

**Why:** The owner asked that the limitations be mentioned at least once,
suggesting Settings or About rather than repeated interruptions while studying.

**How to apply:** Preserve this advisory in both app languages without presenting
it as a substitute for correcting known factual errors.

## Source-only texture corrections

Retain correct existing endpoints and numbered order when correcting a tissue
texture or section-orientation error; do not automatically re-optimize anchors.
This does not prevent separately justified anatomical endpoint repairs.

**Why:** Changing muscle-fibre texture changed the automatic placement result
even though the anatomical layers and their existing valid endpoints had not
moved. Unnecessary re-placement would alter correct study targets.

**How to apply:** Validate the retained endpoints against the corrected drawing,
including actual thin-stroke widths, and reject unintended identity/order changes.
