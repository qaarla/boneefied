---
name: React Native Web selection state
description: Checked and selected state exposure for accessible radio and tab controls across native and web.
---

For React Native radio-style and tab Pressables, keep native `accessibilityState.checked` or `.selected` and explicitly provide `aria-checked` or `aria-selected` for the web accessibility tree.

**Why:** In this project's React Native Web version, Pressables with radio or tab roles and native accessibility state rendered the role but omitted the corresponding DOM state attribute. A visual indicator alone did not convey the state to assistive technology. Explicit web ARIA exposed the state after toggles and route changes.

**How to apply:** For new radio or tab controls, verify both the visible selected indicator and the web accessibility attribute, while retaining native accessibility state for iOS and Android.