---
name: EAS Build Commands authority
description: The user's required existing runbook for mobile builds in this project.
---

Reference the existing “EAS Build Commands” / “EAS Build Commands(1)” document before choosing the mobile build workflow; the user explicitly requires it as the authoritative workflow.

**Why:** The user repeated this instruction to correct the existing build task, emphasizing that it must not cause duplicate builds or an invented alternative workflow.

**How to apply:** Read `attached_assets/EAS_Build_Commands_1791649501668.docx`, the expanded uploaded copy. It covers verified GitHub source pinning, connected GitHub API fallback, direct-upload examples, duplicate avoidance, and terminal artifact verification. Use this app's actual configuration rather than example identities or settings from other apps. Apply only paths permitted by the current platform instructions.

A build action can report “queued but the build ID was not available in time” without a corresponding build appearing in subsequent build or workflow lists. Do not treat this as a confirmed running build or immediately resubmit it.

**Why:** Both platform requests returned this ambiguous result while repeated listings still showed only previous releases. Another request could duplicate delayed work.

**How to apply:** Reconcile the project build and workflow lists, including NEW and IN_QUEUE. If no ID appears, report the unconfirmed request and ask for the Expo dashboard request status rather than claiming an installable artifact exists.
