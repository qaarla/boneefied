# Original organic background — implementation and verification

## Purpose and authorship

Original Boneefied artwork, purpose-drawn in code on October 15, 2026 in response
to the user's request for an extremely understated dendritic / artistic
smooth-muscle-like treatment. It is **nonliteral decoration**, not histology,
a diagram, or an assertion that tissues share anatomical structure.
No photos, micrographs, stock art, external artwork, or generated-image service
were used. These curves are not part of the scientific asset/answer catalog.

The canonical geometry is `components/organicFibers.ts`: twelve tapered,
closed cubic-Bézier fibers and six fine, rounded branches. Both the Expo
renderer and the website renderer consume it. The standalone privacy document
contains the same original paths inline; a regression test prevents drift.

## Rendering boundaries

- The existing shared `Screen` paints the decoration **behind** its scrolling
  content. Its existing solid theme background remains the fallback. The
  native SVG has a local null-rendering error boundary.
- Strength is 4% of the app's existing theme-primary ink, 3% of the existing
  website charcoal, and 2.5% of the privacy document's existing text ink.
  Existing palette, Tinos/fallbacks, geometry, safe-area ownership and dock
  reflow are unchanged.
- Paths stay near outer margins with a broad empty center. They are static:
  no timers, random generation, animation, scroll listeners, transformations,
  texture filters, image downloads, or third-party requests.
- The underlays have no layout footprint, touch handlers, focus targets or
  screen-reader content. The native wrapper disables all pointer events and
  hides the accessibility subtree; web SVG uses ARIA rather than forwarding
  native `accessible` to a DOM SVG.
- Existing opaque anatomy viewer frames, image pixels, hotspot regions,
  answer inputs/options and lesson cards mask the underlay. No atlas source,
  marker, target, answer, question, curriculum, glossary record, progress or
  persisted state was changed.
- Website content, branding and links are unchanged. No Ask Naama label/link
  was found in the inspected current app/website source; none was introduced,
  renamed, embedded or integrated.
- The decoration has no remote asset dependency. This is **not** proof that
  every existing image in a web development session, or a fresh native launch,
  works offline.

## Source checks

- Both app and website TypeScript checks pass.
- All 181 pre-existing tests passed in the complete-suite run. Of three new
  background checks, one initially flagged an outer-margin control point;
  after correction all three new checks passed. The checks cover static,
  sparse geometry, shared-family parity, hidden/noninteractive placement,
  original plain-screen fallback, and opaque atlas frames.
- At a fully painted fiber, calculated WCAG foreground/supporting-text
  contrast against the blended background is:
  - App light: **13.39:1 / 4.90:1**.
  - App dark: **13.53:1 / 7.08:1**.
  - Website main/lead text: **12.37:1 / 6.33:1**.
  These are specific token-pair calculations, not a blanket accessibility
  certification of every pre-existing website text style.

## Running-browser verification

An isolated new browser context checked Study home, Skeletal System and a
loaded labeled atlas, glossary search (including Acetabulum), a Practice
question and graded response, Progress, and Settings at 390×844. Cards,
diagrams, legends, answers and feedback stayed clear and opaque. A Radius
answer graded correctly with its explanation and source. Only that isolated
context's local history changed; no actual user's study state was reset.

- Atlas zoom enlarged the image from 324×223 to 486×335; Reset restored it.
  Recall marker 1 revealed Parietal bone. Internal Explore scrolling left
  document scroll at zero. Page scrolling and interactive controls worked.
- At 320×844 with `qaFontScale=2.5`, text reflowed and the existing two-row
  accessible tab layout remained. The 1440px app stayed centered. Neither
  showed horizontal document overflow.
- The website at 1440px and 390px and privacy page at 390px rendered without
  horizontal overflow. The narrow site's existing actions stacked normally.
- In the **already-loaded** app session, offline client-side navigation to
  home, Progress and the previously loaded skeletal module succeeded; fibers
  still painted and previously loaded raster plates remained complete.
  Some existing resource requests failed offline, including Expo Router's
  `back-icon.png`. This is not a cold-offline-reload, unseen-image availability,
  or native offline-launch certification.
- The new SVG `accessible` DOM warning seen in the first capture was corrected
  with platform-appropriate ARIA. Remaining notes were existing `shadow*` and
  pointer-events deprecations and the known proxied website dev-banner MIME
  error; these did not prevent rendering.

No physical iOS/Android device, distribution build, published release or
production deployment is certified by these checks. No dependency, deployment
configuration or release artifact was changed. Repair 9 remains unchanged.
