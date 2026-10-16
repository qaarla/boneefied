# Full-surface organic material — October 16, 2026

## Current scope

Supersedes the margin-only ornament and the website opacity-only correction.
One shared original, static, nonliteral material contains short softly tapered
fascicles, internal strands and secondary connecting filaments. It is not a
teaching illustration or literal histology. The artwork is deterministic,
local/offline, and includes the centre.

## Implementation

- Shared original geometry: `components/organicFibers.ts`.
- Native renderer and plain fallback: `components/OrganicBackground.tsx`.
  Fixed-scale local crops prevent a small panel from shrinking an entire tile.
  Cards/rows/buttons use `AdaptiveLayout`; the glossary FlatLists, source
  disclosure, word-part rows, module header, atlas control surround, custom
  tab bars and supported stack header background are integrated explicitly.
- Website: `src/components/organic-background.tsx`, `src/App.tsx`,
  `src/index.css`, and `public/privacy-policy.html` in `boneefied-site`.
  Both mask dimensions are explicit: automatic height stretched short motifs
  into page-height wires during iteration. Local surface layers use existing
  approved tones; existing gradients/backgrounds/layout are not replaced.
- Native anatomy frame, base diagrams, markers and instructional legends do
  not contain material. Website hero illustration, search demonstration,
  format illustrations, QR and logo artwork are protected from surface art.
- Decoration is behind content, pointer-transparent, hidden from assistive
  use, static and self-contained. Unsupported web masks return to plain paper.
  Existing inputs retain opaque readable backdrops. No learning, scoring,
  account, saved progress, scientific content or link targets were changed.

## Actual verification

The initial browser tester correctly rejected coarse wires. Those results
were not accepted as completion. Geometry was replaced with short fascicles,
not merely thinner full-height wires. A later direct-browser pass checked the
corrected running Expo web app and website.

- Phone 390px and desktop 1440px, light/dark, normal 100% browser zoom.
- App: home, real skeletal atlas diagram, live practice question, glossary,
  progress, and expanded Settings About panel.
- Website: top, middle, footer and privacy.
- Forty normal screenshots plus forty center-only crops are saved under
  `generated-artifacts/full-surface-material/`. Crops remove the outer 25%
  on each side. The same material is visible in central background/surfaces.
- Center raster comparisons against temporarily hidden decoration found
  changed central pixels, not just nonzero CSS opacity. The JSON includes
  earlier successful captures reused without a redundant rerun.
- Search, glossary/progress navigation, theme selection, starting a question
  and ordering an answer were exercised in isolated contexts. No real user
  state was reset. The tester did not submit an answer. Website Copy link
  worked. The direct pass verified atlas zoom-in and reset transforms in
  both themes/widths.
- Website search/format/QR opaque interior comparisons were byte-identical.
  Full atlas-frame/hero crop comparisons were not consistently byte-identical;
  do not claim pixel-perfect browser certification from those checks. The
  anatomy renderer/assets are unchanged, contain no material layers, and
  captured diagrams/markers remain visibly pristine. A separate whole-element
  hero comparison was byte-identical; the hero texture layer is disabled.
- Native and website typechecks pass; four material tests and four website
  tests pass. The design implementation also ran the unchanged full native
  suite successfully (185 tests) before the final header/fallback additions;
  that suite is not represented as rerun after those additions.
- Known nonblocking proxy dev-banner MIME and native DevTools installation
  warnings are unrelated to rendering; no page exception occurred in the
  final matrix. No performance benchmark or accessibility certification
  beyond the reported checks is claimed.

## Native and live boundaries

These are running Expo **web** and website preview screenshots, not mockups and
not installed-device evidence. No installed iOS/Android device was available.
System-owned iOS liquid-glass tab chrome is retained; custom native surfaces
and the supported stack background use material, but their on-device rendering
and native pinch/keyboard/safe-area behavior remain unverified.

No publication, DNS change, distribution build, paid generation, dependency
upgrade or model-tier change was initiated. The existing published release
was not changed by this work; preview acceptance is not live-site acceptance.
