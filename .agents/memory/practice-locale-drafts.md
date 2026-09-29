---
name: Practice locale draft preservation
description: Why practice drafts must survive navigation during language switching
---

Store the learner's unsubmitted response exactly as entered in the active practice session. Translate it only at the scoring boundary, never as a stored value. After submission, remove the draft without changing the recorded original response.

**Why:** Browser verification found that switching between Study/Settings and Practice retained a selected answer initially but could lose it after another language switch. The route can remount, so component-local answer state is not a reliable persistence boundary.

**How to apply:** When changing practice inputs, navigation, or language switching, preserve the raw draft for its question across tab navigation and reloads. Resume the same question and restore its draft without converting its stored answer to a translated display label.