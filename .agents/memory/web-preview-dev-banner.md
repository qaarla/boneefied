---
name: Web preview dev banner
description: Distinguishing preview-only script errors from Boneefied website errors
---

The proxied development preview may inject a Replit dev-banner script that fails with a 502 or MIME-type error. Do not assume this means the website itself or its published build is broken.

**Why:** Browser reviews showed the page, images, QR, and navigation functioning while the injected development-banner request failed; the production bundle did not include that script.

**How to apply:** When this error appears, identify the failing request and compare the built HTML and first-party asset responses before changing the site's code or setup. Treat actual application asset or runtime failures separately.