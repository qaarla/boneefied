---
name: Study storage recovery contract
description: Why unreadable progress must be preserved rather than normalized into a writable empty state.
---

Keep AsyncStorage and the existing study record compatible with installed versions unless the user explicitly requests a migration. A failed or invalid load is not evidence of a missing record: preserve its bytes, and recover by retrying the read rather than resetting or retrying a default-state save.

**Why:** The user requested the smallest safe correction, retaining legacy progress, raw drafts, bookmarks, preferences, and the existing key/format. Tolerant normalization can be useful for display or pure helpers, but returning defaults does not establish permission to replace saved data.

**How to apply:** Any future persistence refactor must distinguish a successful missing-key result from read/validation failure, gate every writer, and preserve a visible retry-load path. Verify storage side effects as well as hydration results; pure scoring/normalization tests alone do not prove data preservation. Do not claim that browser/mocked-storage evidence proves physical-device storage behavior.
