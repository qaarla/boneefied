---
name: GitHub connector vs Git push
description: Distinguishes Replit's GitHub API connection from workspace Git transport access.
---

An authorized GitHub connector can work for API operations while Git pushes from the workspace remain unauthenticated by default. A linked repository in Expo is separate again. When a workspace-managed Git access secret is available, a command-scoped credential helper can authorize a push without storing a credential in Git config.

**Why:** An unauthenticated dry-run failed despite a working connector and correct remote; a later dry-run using a workspace-managed secret through a scoped helper succeeded. Neither a connector nor a remote URL alone proves that Git transport will work.

**How to apply:** Verify the actual push path non-interactively with a dry-run before promising a push. Check only whether the workspace-managed secret exists; never print it or persist it in Git config. After pushing, compare the remote branch SHA to the local source SHA. If authentication is unavailable, report the transport blocker rather than asking the user to recreate the connector.