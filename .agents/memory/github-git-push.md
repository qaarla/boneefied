---
name: GitHub connector vs Git push
description: Distinguishes Replit's GitHub API connection from workspace Git transport access.
---

An authorized GitHub connector can work for API operations while Git pushes from the workspace remain unauthenticated by default. A linked repository in Expo is separate again. When a workspace-managed Git access secret is available, a command-scoped credential helper can authorize a push without storing a credential in Git config.

**Why:** An unauthenticated dry-run failed despite a working connector and correct remote; a later dry-run using a workspace-managed secret through a scoped helper succeeded. Neither a connector nor a remote URL alone proves that Git transport will work.

**How to apply:** Verify the actual push path non-interactively with a dry-run before promising a push. Check only whether the workspace-managed secret exists; never print it or persist it in Git config. After pushing, compare the remote branch SHA to the local source SHA. If Git transport authentication is unavailable, follow the required build runbook's authenticated Git Database API transfer through the existing GitHub integration. Verify every blob, tree and commit SHA, then independently read the fresh remote ref. Report a source-transfer blocker only if neither route can publish the exact commit; do not ask the user to recreate a working connector.

A Git push can update GitHub successfully and then fail when Replit blocks the local remote-tracking ref write. Verify the remote ref before retrying.

**Why:** The remote accepted a fresh build branch, but the workspace guard rejected the subsequent local tracking-ref lock. The nonzero exit did not mean the remote push failed.

**How to apply:** Read the remote branch with `git ls-remote` or the authenticated GitHub API and compare its full SHA with the intended source before another write or build request.

Unset Git HTTP tracing variables rather than setting `GIT_CURL_VERBOSE=0`.

**Why:** A defined `GIT_CURL_VERBOSE`, including the string `0`, can enable verbose HTTP logging.

**How to apply:** Remove `GIT_CURL_VERBOSE`, `GIT_TRACE_CURL`, and `GIT_TRACE` from credential-bearing Git command environments; never log credentials.