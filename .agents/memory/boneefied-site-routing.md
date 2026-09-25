---
name: Boneefied site routing
description: Why the standalone public site cannot simply replace the domain root without checking Expo access
---

Keep the standalone Boneefied website at a non-root path until a deliberate domain cutover preserves Expo's manifest response for native launch requests.

**Why:** The existing public Expo server uses the same root URL for a normal browser landing page and for a platform-header manifest response. A path-only proxy cannot distinguish those requests. Assigning a standalone static web artifact to the root without another Expo route could break the established phone-access link, even though the iOS build itself stays unchanged.

**How to apply:** Before moving the new website to the primary domain root, explicitly plan and verify the replacement Expo access path or header-aware routing. Do not silently change the native artifact's routing or publish as part of a visual website edit.