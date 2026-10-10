---
name: Boneefied atlas standard
description: User requirements for the reusable anatomy visual language and rights-safe extensions.
---

Boneefied should look like a coherent college anatomy atlas, not a collage of unrelated internet images. Use flat/matte, restrained, clean medical illustrations with simple anatomical forms, consistent line weight, low-saturation system colors, orientation cues, margins, labels, hotspots, backgrounds, and captions. Each instructional plate has one uncluttered learning purpose. Reuse one base illustration for Learn, Recall, and image questions whenever practical.

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

For nervous and senses plates, distinguish a peripheral nerve from its central bulb/tract and inspect continuous labyrinth connections and articulations.

**Why:** An olfactory-nerve target on a bulb passed semantic-mask checks, as did detached semicircular ducts. Their metadata was internally consistent but the anatomy was wrong.

**How to apply:** Inspect the actual depicted structure and connections at full size; do not equate a correctly named drawing group with anatomical evidence.

For vascular, respiratory and lymphatic schematics, inspect continuous vessel/air lumens, where vessels actually enter tissue, and whether a space target lies between its bounding tissues rather than within an organ.

**Why:** Semantic masks also accepted floating capillary bridges, sealed alveolar bubbles, afferents ending in follicles, and a pleural-space target inside lung tissue. Overpainted semantic regions displaced a white-pulp anchor onto marginal zone.

**How to apply:** Review the final visible rendering after mask validation. Mere contact at a single point is not an open lumen; distinguish tissue, lumen and potential space explicitly.

Retain real microscopy by asset identity/type, not the question task type.

**Why:** A real spinal-cord specimen uses a multiple-choice question; filtering only histology-identification tasks would incorrectly substitute a schematic.

**How to apply:** Preserve specimen endpoints across all question types when replacing gross diagrams.
