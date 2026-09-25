---
name: Native text-row reflow
description: Why web-preview wrapping is not enough for narrow React Native metadata and action rows.
---

For compact React Native cards, place metadata and trailing status in independent layout regions. On phone widths, use a deliberate vertical arrangement rather than relying only on flex-wrapping adjacent Text elements.

**Why:** A narrow layout passed web-preview overlap checks, but physical iPhone QA still showed a status clipped or running directly into metadata. Native text measurement and wrapping can differ from React Native Web.

**How to apply:** When a trailing label must remain readable, reserve its own region or stack it below the details; check a fresh native-device build before claiming that platform-specific clipping is resolved.