---
name: Google Play release constraints
description: Existing Play app entry and paid-download decision must be preserved during Android release work.
---

Boneefied's Google Play app entry already exists; do not create another. Preserve the app's paid-download decision and existing Android signing identity.

**Why:** The owner explicitly stated these constraints when authorizing the Android production bundle.

**How to apply:** Use the existing Play entry for future release work. Do not change pricing or rotate signing keys as part of build preparation or store setup.

For release retrieval, the owner wants the exact existing signed AAB downloadable inside this Replit project rather than requiring navigation through Expo. Do not create a public endpoint by default or include large release binaries in Git.

**Why:** The owner explicitly requested project-local file staging for manual Play Console uploads.

**How to apply:** Retrieve the already-finished artifact without rebuilding or modifying its bytes, provide Files-view download instructions, and retain a short provenance and checksum manifest.
