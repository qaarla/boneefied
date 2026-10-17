---
name: Protected scientific image comparisons
description: Rounded-frame antialiasing can invalidate whole-frame background-isolation pixel comparisons.
---

Compare the scientific image and markers inside the atlas frame, excluding its
rounded antialiased corners, when toggling decorative backgrounds for pixel
protection checks. Record the excluded region explicitly.

**Why:** Whole-frame comparisons changed only a few corner pixels where the
rounded white/dark frame blends against its exterior. Interior comparisons
were pixel-identical; the whole-frame mismatch did not mean anatomy was tinted.

**How to apply:** Do not conceal a whole-frame mismatch or claim byte identity
for the entire frame. Inspect where pixels differ and separately report
scientific-interior integrity and exterior-frame changes.
