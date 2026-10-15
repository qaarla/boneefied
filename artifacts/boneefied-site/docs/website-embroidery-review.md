# Boneefied website-only UI embroidery

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
