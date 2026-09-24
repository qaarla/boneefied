---
name: Expo offline evidence
description: Distinguish local anatomy asset registration from actual offline image availability in Expo preview and on native devices.
---

Do not claim the anatomy plates work offline merely because they are registered as local `require` images. The Expo web development preview once retained in-app navigation and stored study progress after switching the browser offline, but previously viewed raster images failed when reopened. After explicitly caching visited images in browser storage, a loaded web session was observed reopening a previously visited lesson offline with visible raster plates and no printed labels in Recall. This does not establish a fresh offline launch.

**Why:** Source-level asset presence and an online screenshot were both successful while a later browser-offline exercise showed blank image areas. Neither this web-preview failure nor an online view establishes native package behavior.

**How to apply:** Report separately (1) bundled file/catalog checks, (2) loaded web-preview offline checks, and (3) a fresh offline launch on a physical native device. Do not infer (3) from either (1) or (2). Native offline availability needs native-device evidence. React Native Web's Image does not expose the native resolveAssetSource method; use the Expo asset resolver when caching web URLs.