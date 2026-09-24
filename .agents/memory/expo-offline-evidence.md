---
name: Expo offline evidence
description: Distinguish local anatomy asset registration from actual offline image availability in Expo preview and on native devices.
---

Do not claim the anatomy plates work offline merely because they are registered as local `require` images. In the Expo web development preview, in-app navigation and stored study progress remained available after switching the browser offline, but previously viewed anatomy raster images failed to render when their viewers reopened; Metro resource requests failed without network.

**Why:** Source-level asset presence and an online screenshot were both successful while a later browser-offline exercise showed blank image areas. Neither this web-preview failure nor an online view establishes native package behavior.

**How to apply:** Report separately (1) bundled file/catalog checks, (2) loaded web-preview offline checks, and (3) a fresh offline launch on a physical native device. Do not infer (3) from either (1) or (2). Native offline availability needs native-device evidence; web offline raster support would need its own cache/offline solution and verification.