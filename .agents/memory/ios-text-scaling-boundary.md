---
name: iOS text scaling boundary
description: Why native text and native navigation headers require different Dynamic Type handling.
---

Keep app text-size preferences in the shared base typography. Let React Native's iOS Text and TextInput apply the system Dynamic Type multiplier; do not multiply their font sizes or line heights by the system font scale again. Native-stack headers with an explicit custom title font size are different: that custom UIFont is static and needs a system-scale-aware size.

**Why:** The installed React Native iOS text implementation scales explicit line heights with its effective font multiplier, while the native-stack header implementation constructs a fixed font for custom title sizes. Treating both alike either doubles body scaling or leaves headers static.

**How to apply:** Use the shared typography helpers when introducing text or custom native headers. Verify actual Larger Text behavior on an iPhone before asserting native layout is fully validated; web zoom and web font preference checks are not equivalent.

For web-renderer regression checks that emulate Dynamic Type, use a fresh browser context for each scale and confirm a computed body-title font size before attributing screenshots to that scale. A reused preview context once labeled an accessibility-sized Progress screenshot as default-sized, creating a false default-layout failure.

**Why:** The browser can retain test-only scale state across route changes even when the current URL does not reveal it.

**How to apply:** Separate default, intermediate, and accessibility-sized captures; treat native tab bars, keyboard avoidance, and iOS line breaking as unverified until checked on-device.