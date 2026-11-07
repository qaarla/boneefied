---
name: EAS Build Commands authority
description: The user's required existing runbook for mobile builds in this project.
---

Reference the existing “EAS Build Commands” / “EAS Build Commands(1)” document before choosing the mobile build workflow; the user explicitly requires it as the authoritative workflow.

**Why:** The user repeated this instruction to correct the existing build task, emphasizing that it must not cause duplicate builds or an invented alternative workflow.

**How to apply:** Read the user's revised manual, `attached_assets/EAS_Build_Commands_Remastered_1793752743621.pdf`, supplied on 2026-11-03. The earlier `attached_assets/EAS_Build_Commands_1791649501668.docx` retains historical detail. Use this app's actual configuration rather than example identities or settings from other apps. Apply only paths permitted by the current platform instructions; the manual explicitly distinguishes connected build actions from restricted CLI invocations.

A build action can report “queued but the build ID was not available in time” without a corresponding build appearing in subsequent build or workflow lists. Do not treat this as a confirmed running build or immediately resubmit it.

**Why:** Both platform requests returned this ambiguous result while repeated listings still showed only previous releases. Another request could duplicate delayed work.

**How to apply:** Reconcile the project build and workflow lists, including NEW and IN_QUEUE. A dashboard screenshot can establish that no new job appeared. A validated build-only workflow through the separate connected workflow action can provide a traceable run ID, but a NEW workflow with no jobs is still not a native build. Never claim an installable artifact exists without the finished build and verified download.

The workflow-start acknowledgement can display an old commit beside the correct
requested Git ref. Verify the workflow details and its actual native jobs before
assuming the wrong source ran or submitting again.

**Why:** A launch acknowledgement displayed the previous workflow's commit, but
the new workflow details and both native build records used the intended,
independently verified GitHub revision.

**How to apply:** Record the returned workflow ID, inspect its requested ref,
resolved commit and native build IDs, then verify those build records directly.
Treat an acknowledgement as submission evidence, not final source verification.
