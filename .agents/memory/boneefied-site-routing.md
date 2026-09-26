---
name: Boneefied site routing
description: Preserve Expo's header-aware manifest while routing browser visitors to the standalone site.
---

The browser homepage may lead to the standalone website, but the domain root must keep serving the Expo manifest when a platform header is present. The older Expo Go QR experience must remain reachable separately.

**Why:** Expo uses the same root URL for native launch requests and browser visits; a path-only static proxy cannot distinguish them. Replacing the Expo service at root could break phone access even though the iOS build itself stays unchanged.

**How to apply:** On future homepage routing changes, verify both browser and platform-header requests and retain the Expo Go QR route. Do not silently replace the native artifact's root route or publish as part of a visual website edit.