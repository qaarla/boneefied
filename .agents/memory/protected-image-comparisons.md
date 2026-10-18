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

## Dynamic atlas and navigation snapshot scope

Do not use whole-route DOM counts or unscoped screenshot equality as the sole
proof for foreground-only changes. Expo navigation can retain zero-size text
from inactive routes, reuse the same title for navigation and content, and
settle offscreen atlas markers asynchronously.

**Why:** These effects produced false comparison failures even when reading
components differed only in color expressions and their computed non-color
styles were unchanged.

**How to apply:** Exclude inactive/zero-size nodes, identify the actual reading
element rather than matching text alone, and combine scoped computed-color
checks with source/palette invariance checks. Do not claim whole-atlas pixel
identity when it was not established.
