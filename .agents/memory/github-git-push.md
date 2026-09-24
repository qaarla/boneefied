---
name: GitHub connector vs Git push
description: Distinguishes Replit's GitHub API connection from workspace Git transport access.
---

An authorized and attached GitHub connector can work for API operations while Git pushes from the workspace still have no HTTPS credential. A linked repository in Expo is separate again. Do not claim that an Active integration or a correctly configured remote proves push access.

**Why:** In this project, the GitHub connection was attached, but a non-interactive dry-run push still requested a password; SSH also lacked an authorized key. Recommending another repository setup step did not address the actual authentication gap.

**How to apply:** Verify the actual push path without mutation before promising a push. If the connector cannot supply Git transport credentials, report that precise blocker instead of asking the user to recreate or reconnect the repository.