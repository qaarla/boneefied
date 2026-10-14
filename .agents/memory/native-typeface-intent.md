---
name: Native typeface intent
description: The user's chosen Boneefied native typeface and permitted readability exceptions.
---

Use Tinos regular for standard Boneefied native body text and its actual bold face for headings, emphasized labels, buttons and navigation.

Apply the same Tinos identity to ordinary website text, including the Privacy Policy and Expo landing/access page, while retaining fallback families for unsupported characters and scripts. Preserve the established sizes, spacing, colors, layout, and functions.

**Why:** The user explicitly extended the established Tinos requirement across the website and app, with native screens to remain visually unchanged.

**Why:** The user explicitly requested “tinos overhaul please,” after confirming that loading Tinos alone had left the UI using system sans-serif. This is a deliberate typeface choice, not an incidental dependency.

**How to apply:** Keep new native reading UI consistent with that choice. Readability of tiny anatomy overlays/marker numerals takes priority over uniformity, as the user explicitly allowed retaining their established compact treatment. Preserve icon/SF Symbol fonts, technical monospace details and OS-owned alert typography rather than forcing them into Tinos.

Dense numbered atlas legends are also an explicit local exception to unbounded reading-text scaling: preserve Tinos but keep their scaling, line height and spacing bounded.

**Why:** The user said enlarged Tinos legend text consumed excessive vertical space and requested compact, readable annotation lists without disabling accessibility scaling globally.

**How to apply:** Keep the fixed size cap within dense legends. Preserve long-name wrapping, original marker correspondence and scroll reachability rather than applying a global cap to ordinary reading text.

Individual reading blocks may fit a word to their available width only when enlarged text would otherwise split it or overflow. Keep normal sizes, wording and native accessibility scaling unchanged; do not replace this with arbitrary global font limits.

**Why:** The user's final app-wide QA requirement explicitly prohibits clipping, mid-word breakage and horizontal overflow at normal and enlarged text sizes while keeping the established visual language.

**How to apply:** Check expanded lesson cards and nested atlas descriptions, not only wide galleries and initial screen viewports. Include attached punctuation and slash-linked terms when evaluating a word's fit; narrow nested contexts exposed defects that the initial screen sweep missed.
