---
name: Google Play release constraints
description: Existing Play app entry and paid-download decision must be preserved during Android release work.
---

Boneefied's Google Play app entry already exists; do not create another. Preserve the app's paid-download decision and existing Android signing identity.

**Why:** The owner explicitly stated these constraints when authorizing the Android production bundle.

**How to apply:** Use the existing Play entry for future release work. Do not change pricing or rotate signing keys as part of build preparation or store setup.

Release retrieval is workspace delivery convenience, not authorization to publish a release or deploy the website.

**Why:** The owner explicitly separated delivery of the already-finished bundle from builds, Play submission, and app publication.

**How to apply:** Keep staging and download work separate from store and deployment actions. Follow the owner's current delivery preference without changing app behavior or store settings.
