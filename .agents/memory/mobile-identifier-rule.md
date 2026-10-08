---
name: Mobile identifier rule
description: Owner's requirement to keep each app's Android package identical to its existing iOS bundle identifier.
---

For each mobile app, the Android package/application ID must be exactly the same reverse-domain string as that app's existing iOS bundleIdentifier.

**Why:** The owner stated: "They all need to have the same as the iOS bundle ID. The iOS bundle ID is the same as the Android package, Play package."

**How to apply:** Audit resolved Expo config and build overrides. Correct missing or obvious placeholder Android identifiers to the existing iOS identifier. Report a different non-placeholder Android identity as a blocker rather than silently replacing it. Preserve the iOS identifier and EAS project linkage.
