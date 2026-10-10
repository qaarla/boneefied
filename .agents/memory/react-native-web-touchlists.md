---
name: React Native Web touch collections
description: Browser touch events can expose DOM TouchList despite React Native array typings.
---

Treat web touch collections as indexed, array-like values; do not call Array methods without converting them. Keep native touch arrays supported by the same geometry.

**Why:** In this Expo web preview, actual touch events reached the viewer with a DOM `TouchList` (`Array.isArray` was false). Calling `reduce` crashed the gesture handler even though TypeScript accepted the React Native event type.

**How to apply:** When changing web gestures, test with an indexed `{ 0: point, 1: point, length: 2 }` collection as well as native arrays, then verify real touch delivery and the rendered transform. Do not confuse successful keyboard reset with touch/mouse reset verification.
