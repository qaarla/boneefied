---
name: Marker overlap evidence
description: Distinguishing visible anatomy-label collisions from circular badge bounding-box intersections.
---

Treat visible text-label collisions as presentation defects, but do not treat an intersection of circular marker bounding rectangles alone as proof of a visible collision.

**Why:** In a narrow Cytology viewer, two circular badges had a small corner intersection between their rectangular bounds while their visible circles remained separate. Enforcing completely disjoint rectangles would introduce unnecessary movement of anatomy markers.

**How to apply:** Inspect the actual pixels or circle geometry when reviewing numbered markers. Distinguish those from full-text pill collisions, which can genuinely obscure text. Preserve anatomical hotspot coordinates when repairing the presentation of labels.
