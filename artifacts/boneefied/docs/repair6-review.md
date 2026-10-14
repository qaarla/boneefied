# Shared atlas controls — review

## Changes

- The shared viewer now delegates its existing actions to a compact, below-image control component.
- All five labels and accessibility descriptions are unchanged. Zoom increments, reset behavior, reveal/hide handlers and their existing visibility conditions are unchanged.
- Tinos bold at 13pt, orange/charcoal semantic colors, centered labels, subtle borders and a clearly distinguished Reveal all action.
- Actual scaled text measurements determine whether a single row fits. When it does not, zoom and label actions form separate groups; a group splits further only as necessary.
- Buttons retain at least 44×44 tap regions. Text is never truncated and the control block grows in normal document flow above legends/captions rather than overlapping the image.
- No zoom logic, art, anatomy coordinates, legend content, global typography or navigation changes.

## Verification

- Typecheck and **40 focused viewer/repair tests passed**, including four new control-layout tests.
- Real browser checks on **320px and 390px** phone viewports at **1×, 1.8× and 2.5×** text scaling.
- Each of the six layouts retained all five actions, Tinos, centered text, at least 44px tap regions and no text/control/image/caption clipping or overlap.
- The default five-action block measured **57px high at 390px** and **105px at 320px** in the web preview. Larger text reflows rather than being constrained to those heights.
- Clicked all five actions at both normal-text widths: Zoom in produced 1.5×, Zoom out and Reset returned to 1×, Reveal all replaced question marks with numbered labels, Hide all restored question marks.
- Layout tests also cover 239–390px control widths, longer translated-label measurements and scales through 4×.
- Screenshots and measured browser results are in the ignored `generated-artifacts/repair6/` directory. Every one of the six phone screenshots was visually inspected.
- The standard screenshot capture stopped before Expo hydration; the successful browser checks explicitly waited for the controls to render. This is phone-width web verification, not a claim of physical-device testing.
- Existing screen/navigation structure is unchanged; the new controls remain bounded within the shared viewer in normal flow.

No production build, deployment or publishing was performed. Work stopped after the requested control refinement.
