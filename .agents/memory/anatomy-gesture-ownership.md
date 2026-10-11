---
name: Anatomy gesture ownership
description: Boneefied's physical-device scrolling defect and the viewer/page gesture ownership contract.
---

At 1×, a vertical swipe on anatomy may scroll the lesson. Pinch owns the gesture until every finger lifts, including when it returns to 1×. A zoomed single-finger drag pans the viewer, not the page. Page scrolling is locked during the owned gesture, not for the entire time the viewer remains zoomed.

**Why:** The user reported on a physical device that trying to move around a magnified anatomy image also moved the lesson “up and down.” Web touch-action alone does not establish native scroll interception behavior.

**How to apply:** Keep child responder capture and explicit parent scroll ownership consistent across Learn, Recall, Glossary and Practice. Preserve real taps while suppressing drag/pinch release clicks. Rebase finger-count changes, release ownership on cancellation/unmount, clamp against contained source-image geometry rather than callout whitespace, and keep image and overlays in one coordinate transform. Treat phone-browser evidence as browser evidence, not native-device proof.
