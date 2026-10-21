---
name: Persistent study dock intent
description: The owner's required navigation model for systems and nested study pages.
---

Keep the existing Study, Practice, Missed, Progress dock throughout every Explore by system page and every nested study window. Do not restore the floating Study back button. Reselecting the active tab goes up exactly one logical level: content/activity → category overview → section root. At the root it does nothing. Switching to a different tab preserves that section's position instead of resetting it.

**Why:** The owner prefers the persistent dock over the floating Study arrow and subsequently specified hierarchical navigation on active-tab reselection. The one-level parent rule supersedes the earlier return-straight-to-library behavior.

**How to apply:** Retain the existing native iOS tab treatment and accessible fallback, not a visual copy added to individual pages. Define logical parents explicitly, not from browsing history. Study content and nested lessons share their system overview; glossary entries share the relevant glossary overview. Practice questions/results share system setup. Missed and Progress have only roots until deeper views are introduced. Upward navigation must never submit answers, complete sessions, clear saved progress, or discard unfinished responses.

For cold deep links, resolve navigation against the hydrated root state rather than trusting the tab navigator's nested state. Distinguish returning within the active Study stack from switching to Study from another tab.

**Why:** In the installed Expo Router, the parent tab's child state can remain stale and keyless even while the nested module renders. Scoped pop/reset actions then silently do nothing. A stack dismissal is also not a valid tab-switch action.

**How to apply:** Include cold direct-link reselection, one-step category-to-root transitions, ordinary cross-tab restoration, and unfinished Practice responses in verification. Do not infer success from in-app module navigation alone.

Permission to change tab navigation behavior is not permission to redesign the dock.

**Why:** The owner rejected unsolicited home-header and dock changes, then explicitly authorized a dock-only restyle with “COPY THIS STYLE WITH YOUR COLOR SCHEME.” That later approval supersedes the dock appearance freeze, not the home-header protection.

**How to apply:** Follow the supplied dock reference: substantial icons above clear centered serif labels, a restrained translucent base, Boneefied orange for the active item, and theme-appropriate neutral inactive items. Retain Study, Practice, Missed and Progress and their approved one-level navigation. Keep the home header, system headings, and atlas layout untouched by dock styling.

Approved visual reference: `attached_assets/Screenshot_2026-10-20_at_8.50.48_PM_1792554651680.png`. Its yellow highlight is a style reference, not a request to replace Boneefied's orange palette.
