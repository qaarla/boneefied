---
name: Persistent study dock intent
description: The owner's required navigation model for systems and nested study pages.
---

Keep the existing four-option Study, Practice, Missed, Progress dock throughout every Explore by system page and every nested study window. Remove the floating Study back button; tapping Study returns to the library, including when Study is already selected.

**Why:** The owner explicitly prefers the persistent dock over the “random, weirdly placed back arrow study,” describing it as more seamless. This supersedes the earlier instruction to retain that module back control.

**How to apply:** Retain the existing native iOS tab treatment and accessible fallback, not a visual copy of the dock added to individual pages. Keep meaningful content headings and safe areas. Returning to Study must not reset other tabs or lose unsubmitted practice selections.

For cold deep links, resolve navigation against the hydrated root state rather than trusting the tab navigator's nested state. Distinguish returning within the active Study stack from switching to Study from another tab.

**Why:** In the installed Expo Router, the parent tab's child state can remain stale and keyless even while the nested module renders. Scoped pop/reset actions then silently do nothing. A stack dismissal is also not a valid tab-switch action.

**How to apply:** Include both cold direct-link reselection and cross-tab return-to-Study in navigation verification. Do not infer success from in-app module navigation alone.
