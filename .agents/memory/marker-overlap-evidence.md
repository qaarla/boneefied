---
name: Marker overlap evidence
description: Distinguishing visible collisions from coarse marker bounds and incorrect contained-image measurements.
---

Treat visible text-label collisions as presentation defects, but do not treat an intersection of circular marker bounding rectangles alone as proof of a visible collision.

**Why:** In a narrow Cytology viewer, two circular badges had a small corner intersection between their rectangular bounds while their visible circles remained separate. Enforcing completely disjoint rectangles would introduce unnecessary movement of anatomy markers.

**How to apply:** Inspect the actual pixels or circle geometry when reviewing numbered markers. Distinguish those from full-text pill collisions, which can genuinely obscure text. Preserve anatomical hotspot coordinates when repairing the presentation of labels.

For React Native Web images using contain mode, the DOM image element can measure as the full viewer frame rather than the actual letterboxed picture. Do not transform source-normalized protection areas using that element's bounds without checking the visible contain box.

**Why:** A browser audit reported anatomy-protection intersections from full-frame image bounds and rectangular paint bounds while the screenshots showed the bubbles safely outside tissue. Correct source-aspect projection and circle geometry did not reproduce those flags.

**How to apply:** Derive the contained picture's offsets and size from its source aspect ratio and measured viewer dimensions. Test painted circles against each individual protected region, then inspect visible anatomy and leader endpoints. Keep coarse screening flags separate from verified occlusion.

Generated QA files are evidence only after successful decoding; a matching file count is not proof of completed rendering. Keep QA-tool failures separate from app defects.

**Why:** An interrupted contact-sheet job left a partial PNG despite the expected files existing. Separately, inherited blank font metadata broke a montage of valid images while the application itself remained healthy.

**How to apply:** When resuming visual QA, validate cached images before reuse, and isolate rendering-tool errors before changing product code or drawing conclusions about anatomy presentation.

Semantic ID masks can deliberately widen narrow strokes. Matching the expected
mask color does not establish that a pointer ends on visible anatomy.

**Why:** A stapes pointer passed its padded ID mask while the actual raster pixel
was middle-ear chamber fluid, outside the thin bony limb.

**How to apply:** For narrow nerves, zonules, ossicles or similar targets, inspect
the actual source pixel or analytically test the painted curve/stroke as well as
the semantic region. Keep the target on the actual tissue, not merely its padded
sampling area.

Keep any viewer framing inset in the shared contain geometry, not only in the Image style. Image painting, normalized anchors, protected anatomy, and gesture bounds must refer to the same padded box.

**Why:** Framing/gesture work must not move anatomical targets. Separately requested anatomical endpoint repairs require an independent source-level review rather than moving targets to improve layout.

**How to apply:** Prefer actual bundled image dimensions when available; keep metadata as the fallback. Check sparse and dense plates at narrow and normal widths using painted bubbles and source-image geometry.

Treat anatomical correctness and overlay geometry as separate evidence. A point inside a semantic mask or a shape's bounding box is not proof that it identifies the intended structure. Conversely, lumina, plasma and named potential spaces can legitimately look blank.

**Why:** The user identified pins that pointed to nothing even though collision/layout audits passed. Thin anatomy can also be obscured by the QA dot itself.

**How to apply:** Enlarge the actual source raster and inspect the endpoint against the depicted anatomy. Preserve valid targets; correct confirmed errors consistently across Study, Practice and pre-catalog glossary views. Explicitly flag art that cannot distinguish the requested structure instead of claiming geometry repaired it.

A mounted legend does not establish that its diagram's painted markers are ready, especially for later/offscreen plates.

**Why:** Browser QA initially compared a valid five-entry legend against an empty marker collection. Scrolling its viewer into view and waiting for painted-marker readiness resolved the mismatch without an application change.

**How to apply:** Before reporting a numbering mismatch, bring each relevant viewer into view and wait for its image/callout layout to settle. Verify visible marker text against the corresponding legend, not only initial DOM presence.

Do not assume every diagram must pan substantially on both axes at the same
zoom, or that a fixed number of swipes reaches both clamps.

**Why:** A dense enlarged-text diagram still fit horizontally at a zoom where
other diagrams overflowed. At a higher zoom, its valid annotation envelope also
required more travel than a fixed swipe count allowed. Both produced false
browser-test failures without an application defect.

**How to apply:** Exercise each axis at a zoom where its content actually
overflows, then continue dragging until the measured transform stabilizes.
Keep parent-scroll offsets separate. Do not widen correct bounds to satisfy a
test's arbitrary movement threshold.
