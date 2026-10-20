---
name: Anatomy gesture ownership
description: Boneefied gesture ownership, scroll isolation and the external-callout reachability exception.
---

At 1×, a vertical swipe on anatomy may scroll the lesson. Pinch owns the gesture until every finger lifts, including when it returns to 1×. A zoomed single-finger drag pans the viewer, not the page. Page scrolling is locked during the owned gesture, not for the entire time the viewer remains zoomed.

**Why:** The user reported on a physical device that trying to move around a magnified anatomy image also moved the lesson “up and down.” Web touch-action alone does not establish native scroll interception behavior.

**How to apply:** Keep child responder capture and explicit parent scroll ownership consistent across Learn, Recall, Glossary and Practice. Preserve real taps while suppressing drag/pinch release clicks. Rebase finger-count changes, release ownership on cancellation/unmount, clamp against contained source-image geometry rather than callout whitespace, and keep image and overlays in one coordinate transform. Treat phone-browser evidence as browser evidence, not native-device proof.

Page ownership includes stopping existing scroll momentum, not just disabling new scrolling. Browser touch-action must track the active owned gesture as well as zoom, so returning to 1× during a pinch does not unlock the page before the final finger lifts.

**Why:** The user explicitly requires the module page to stay stationary throughout an owned gesture, while ordinary image swipes at 1× and page swipes outside the viewer remain available.

**How to apply:** Acquire the page lease before native interception; retain it across touch-count changes; release it on final lift, cancellation, reset, or unmount. Bound pans so the smaller image remains within its frame or a larger image continues covering the viewport, rather than allowing most of the diagram to leave the screen.

Fit the complete annotated plate at reset, but distinguish those fit bounds from
the raster bounds used to contain magnified panning. Preserve the anatomical
aspect ratio in a tidy rectangular or square-like frame.

**Why:** The user reported clipped respiratory callouts and repeated that installed
iPhone zoom/pan did not work. A phone-size browser baseline worked, so browser
success must not be used to dismiss the native report. Using annotation gutters
as pan limits also allowed the raster to leave most of the viewport.

**How to apply:** Include measured marker hit boxes and leader endpoints when
fitting 1×. Project the actual source rectangle through that same fit for pan
constraints. Exercise controls, pinch, both drag axes, scroll isolation and
tap suppression; report browser and physical-device evidence separately.

A browser reporting `navigator.maxTouchPoints === 0` can still exercise the web
touch handlers through CDP touch emulation. Mouse dragging alone is not pinch
verification.

**Why:** A Special Senses audit initially substituted mouse pans for the requested
pinch/both-axis checks; CDP touch events subsequently exercised the actual web
handlers successfully in that same mouse-oriented browser.

**How to apply:** For requested touch verification, dispatch touch events and
measure zoom, both pan limits, marker tracking and parent-scroll stability. Keep
mouse, touch-emulated browser and physical-device results explicitly distinct.

In React Native Web, measure the actual scrollable lesson container rather than
`window.scrollY` when verifying that an anatomy gesture does not move the lesson.

**Why:** The window can remain at zero while a nested ScrollView is the element
that actually moves, so an unchanged window offset alone is a false scroll-isolation
pass.

**How to apply:** Identify the real scrollable ancestor, confirm its offset changes
with ordinary lesson scrolling, then record that same offset during pinch and pan.

## External numbered callouts must remain reachable

For Blood Vessels and Lymphatic plates, magnified pan constraints include the complete annotated
plate, not only the raster. The older raster-only policy above remains scoped
to earlier groups; do not silently change those outside their own correction pass.

**Why:** Raster-only edge coverage and perfect marker/image alignment can both
pass while external numbered markers cannot enter the viewport at magnification.
The user explicitly required actual hotspot targeting after transformation.
A dense vascular plate subsequently passed real intended-marker taps after
both 2× and 4× pan with annotated-content constraints.

**How to apply:** Exercise actual visible marker selection after zoom and pan,
with no force-click or handler invocation. Bound movement to meaningful content;
annotation gutters are part of the plate, not unbounded blank canvas. Distinguish
that contract from requiring the raster alone to cover every viewport edge.
Keep the same image/leader/marker transform and preserve scroll ownership and
post-gesture tap suppression.

## Per-plate evidence must cover each requested action

Do not infer every plate's interaction success from one representative viewer,
source/geometry checks, or an empty pending list in a browser report.

**Why:** Bounded atlas passes returned successful overall reports while actual
pinch, two-axis pan and Reset evidence existed only for the overview plate.
Static enlarged-text screenshots and successful Practice answers did not fill
those missing viewer checks.

**How to apply:** Audit a per-plate matrix of visibly changed button zoom,
actual pinch, nonzero horizontal/vertical movement, actual parent-scroll offsets,
Reset and post-pan selection, plus the requested enlarged-text coverage.
Request only missing checks, not another full pass. Have the tester publish
captures in its screenshot result, not merely record otherwise unviewable IDs.

Treat a failed testing-worker continuation as an infrastructure failure, not
as a verdict about the app.

**Why:** A continuation failed after successful question checks; independent
targeted browser checks then passed the missing plate interactions without any
app change.

**How to apply:** Preserve valid evidence, check incremental coverage promptly,
and complete only the missing checks independently when possible. Do not wait
repeatedly on an already failed worker or relaunch a complete test pass.

## Complete atlas policy and painted readiness

New published atlas images must inherit centered full-scene fitting and
annotation-envelope pan bounds; do not reintroduce per-system-only opt-ins.

**Why:** Successful later system repairs could coexist with earlier plates still
using asymmetric legacy fitting or image-only limits that excluded callouts.

**How to apply:** Extend the shared policy for new atlas images, and verify that
external numbered callouts remain reachable after zoom as well as at Reset.

A decoded cached image (`naturalWidth > 0`) is not proof that its React Native
Web wrapper has completed layout. Gate geometry evidence on a nonzero painted
image rectangle as well as the expected foreground source bytes.

**Why:** Premature measurement produced zero image rectangles and falsely marked
every marker as clipped/overlapping. Loaded-layout measurements passed without
any anatomy or marker changes.

**How to apply:** Wait for painted dimensions before judging overlap, centering,
aspect or crop; do not “fix” source coordinates in response to zero-layout data.
