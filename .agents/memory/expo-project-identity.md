---
name: Expo project identity
description: Avoid confusing a stale source-code project ID with the GitHub-linked Expo dashboard project.
---

When an Expo build API says no repository is linked for the app ID in source config, verify that ID belongs to the actual Expo dashboard project before asking for another GitHub connection. A dashboard build can be created for a different project while API calls using the stale ID fail.

**Why:** A build-from-GitHub screen showed a linked repository and successfully queued an internal iOS build, although calls using the source config's project ID reported no repository or no project.

**How to apply:** Compare the dashboard project identity and submitted build details with source configuration. Do not silently change account owner or project ID based on an API error alone; confirm the intended project first.