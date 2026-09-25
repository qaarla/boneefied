---
name: React Native Web radio state
description: Checked state exposure for accessible radio-style controls across native and web.
---

For React Native radio-style Pressables, keep native `accessibilityState.checked` and explicitly provide `aria-checked` for the web accessibility tree.

**Why:** In this project's React Native Web version, a Pressable with radio role and native checked state rendered the role but omitted the DOM's checked attribute. A visual checkmark alone did not convey the state to assistive technology. Providing explicit web ARIA exposed the correct state after toggles and reloads.

**How to apply:** For new radio-like settings, verify both the visible selected indicator and the web accessibility attribute, while retaining native accessibility state for iOS and Android.