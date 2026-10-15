# Boneefied website-only UI embroidery

## Production-output acceptance — October 15, 2026

Ready runtime revision: `25557bbc89a456e0bf2298333cebd40ab3bd93e3`.
This pass did not alter runtime code or generate new artwork: the approved
9% correction was already in the main website used by publishing.

- The real public browser entry `https://boneefied.com/` returned 200 after
  redirecting to `/site/`, rendered the expected heading and raised no page
  exceptions. Home and both linked privacy URL forms returned 200.
  The unspecified failure-to-open was not reproduced. The unlinked root
  `/privacy-policy` returns 404; the site's actual links use `/site/privacy-policy`.
- The live browser still computed **0.025**, confirming the deployed treatment
  is not the current 9% source. A successful previous publishing badge does
  not establish that the corrected release is live.
- Built the actual website with the service's configured `PORT=20970` and
  `BASE_PATH=/site/`. The first manual build omitted PORT and was rejected by
  the existing config; using both manifest-provided values passed. This was
  a manual invocation issue, not a reproduced production startup defect.
- Loaded `dist/public` with a temporary local static test server using the
  website's base path and privacy rewrite. This checks the actual minified
  publishing output, not Vite development rendering; it does not reproduce
  the production proxy. The real public entry was checked separately above.
- All eight home/privacy × 390/1440px × light/dark combinations loaded without
  page exceptions, failed requests, broken images or horizontal overflow.
  Checked local links/fragment targets, keyboard focus, normally attached
  document scrolling, phone-access anchor navigation and successful Copy link.
  There are no real public forms; the search field is an existing illustration.
  No Ask Naama link exists on these website pages; none was removed or added.
- Saved and visually reviewed **24 unenhanced PNG captures** at 100% browser
  zoom: top/middle/footer on each page/width/theme. Review sheets and
  machine-readable results are in `generated-artifacts/embroidery-production/`.
  The same original ornament is discernible at the margins; section backgrounds
  do not suppress it wholesale. Existing opaque illustrations remain unobstructed.
  Actual device brightness cannot be certified by browser screenshots.
- Build CSS: `assets/index-sPYzT2eM.css`, SHA-256
  `26f45c09f4b2c8a7269b5481785755b27266c9bc33a902b2452dac02b927a0d5`.
  This is an evidence identifier, not a promise that another build must retain
  the same filename.

**READY TO PUBLISH:** caller-controlled single republish on the existing domain
is the remaining release step, followed by fresh live visual verification.
No independent publication, native/distribution build, data clearing, new
setting, framework change or deployment configuration edit was performed.

## Visibility correction after owner review — October 15, 2026

The earlier 2.5% implementation below is historical. The owner found it
effectively invisible despite correct deployment. The source now uses **9%**
for the same single original ornament on home and privacy, in both themes.
No paths, masking geometry, stacking, responsive layout, native runtime,
content, links, integrations, fonts or approved colors changed.

The gold italic hero word now has the existing paper color behind it. This
does not change line metrics or spacing and preserves its approximately
3.13:1 large-text contrast where a stronger fiber would otherwise pass behind
it. Representative main heading/body contrast remains above the applicable
thresholds even over a fully covered 9% fiber. Existing muted small-copy
colors were not redesigned; this is not a complete accessibility certification.

Verification: website TypeScript check and all six website/cross-surface
regressions pass (the cross-surface test's website-only opacity expectation
was updated; native runtime is unchanged). Browser screenshots compare the
previous 2.5% appearance with the revised source at 390px and 1440px, 100%
zoom, light/dark, hero/middle/footer/privacy. Every combination shows a
visible pixel change. Document dimensions, section coordinates, text and
hrefs are identical; no horizontal overflow; one normally scrolling underlay.
The opaque interiors of six illustration/preview/QR surfaces are pixel-identical.
Keyboard links retain solid focus outlines. Evidence and machine-readable
results are under ignored `generated-artifacts/embroidery-intensity/`.

This correction is **source/development-preview only**, ready for review and
republishing. No production build, distribution build or publication was
performed for this correction. The published site's previously verified 2.5%
appearance must not be represented as the corrected 9% appearance.

## Accepted scope

October 15, 2026: refine the **existing public website**, through its entire
scrolling page and existing privacy page. This is an implementation follow-up
to the original cross-surface organic background, not acceptance of a new app,
platform, redesign or deployment. “UI embroidery” describes the treatment and
is not added to public page copy.

## Implemented

- Reconciled the existing ornament rather than adding a second layer. The main
  website still has exactly one underlay, before its main content and footer.
- Kept the original purpose-drawn twelve tapered fibers and six smooth
  branches. The canonical geometry and **all native application code are
  unchanged**. No third-party art, photographs or scientific illustrations
  were introduced.
- The ornament is now document-bound and scrolls normally with the page,
  rather than remaining attached to the viewport. A single nonrepeating,
  continuous composition covers the existing document without seams,
  per-section variants, randomization, animation or scroll listeners.
- Both website pages use **2.5% strength**. The main site's SVG alpha mask uses
  its existing `--ink` in light and dark mode, replacing the hard-coded
  light-theme ink. The privacy page preserves its existing current-color SVG.
- No extra height, padding, sections, frames or cards were added. Content,
  typography/fallbacks, branding, section order, spacing, routes, hrefs and
  action handlers are unchanged.
- The underlay is hidden from assistive technology and ignores pointer
  events. The site's existing opaque illustrations, previews, QR and controls
  remain above it. Unsupported or failed masks leave the original plain
  background usable.
- No Ask Naama reference exists in the current inspected website source; none
  was added, renamed or integrated. There are no website authentication or
  input-form screens in this package. Existing phone-access links and Copy
  link behavior remain intact. Naama, Surf Browse, private admin areas, mobile
  scoring, saved progress and offline study code were not changed.

## Tests and preview evidence

- Website TypeScript check passed.
- Three website embroidery regression tests passed, covering one full-page
  underlay, normal document attachment, theme-based ink/fallback, and the same
  original path family on the privacy page.
- The three pre-existing cross-surface background checks also passed without
  changing their source or the native implementation.
- A full-page 1440px running-preview screenshot shows the header/hero, all
  middle sections, phone access/support and footer. It is saved in the ignored
  `generated-artifacts/website-embroidery/` evidence directory.
- A fresh isolated browser journey inspected the site top-to-bottom at
  **390×844, 768×1024 and 1440×900**, plus the privacy page and light/dark hero.
  Running-site viewport captures include header/hero, multiple middle
  sections, educational previews, access/QR and complete footer.
- The single underlay's `rect.top + scrollY` remained zero through phone
  scroll positions 0–7000 and representative tablet positions; its height
  matched the full shell. The privacy SVG similarly matched its body's
  complete height and document origin. This confirms normal scrolling rather
  than fixed-viewport/parallax behavior.
- Available CSS width equaled document width at each viewport, with no
  horizontal overflow. Temporarily hiding only the ornament in the test
  browser left page height, section geometry and QR dimensions unchanged.
  Hero, search, format-preview and QR A/B screenshots showed unchanged,
  unobstructed content; the normal ornament was restored after the checks.
- Header/hero/footer anchor navigation and Copy link succeeded. Keyboard
  traversal reached existing actions in order with a visible 3px focus
  outline; mouse selection selected the complete hero heading.
  Existing mailto, app deep-link and Expo/build hrefs were inspected without
  opening mail, app or distribution flows. No input forms were present.
- Representative light text contrast: heading 13.06:1, body 5.69:1,
  primary CTA 12.78:1; the large gold italic heading word measured 3.13:1.
  Dark-mode heading/navigation measured 12.94:1 and body 9.42:1. These are
  sampled pairs, not an exhaustive accessibility certification.
- The known proxied Vite dev-banner MIME error remained; no website asset
  or application-render failure was observed.

## Live deployment

**Not published by this work.** Running development-preview checks are not
proof that boneefied.com's deployed release contains this revision. No
deployment settings, dependency pins, distribution builds or release files
were changed. Physical devices are not certified by browser viewport checks.
