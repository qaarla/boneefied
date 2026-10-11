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
