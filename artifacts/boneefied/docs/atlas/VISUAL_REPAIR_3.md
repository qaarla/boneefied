# Boneefied Visual Repair 3

## Scope

Anatomy-image gesture interaction only, after the existing marker repairs. No artwork, marker sizing/tuning metadata, anatomical targets, legends, answer mappings, provenance, image loading, navigation configuration, release builds, deployment or publication changes.

The reported physical-device defect was that dragging a magnified anatomy image also scrolled the surrounding lesson.

## Repair

- At centered 1×, ordinary single-finger vertical swipes are left to the surrounding page.
- A pinch takes viewer ownership immediately. Ownership persists through finger-count changes, including a return to 1×, until the last finger lifts or the gesture is canceled.
- A single touch on a zoomed viewer locks the containing page from touch-down. Movement of at least 6 px becomes a pan; smaller jitter remains a tap.
- Native responder capture and explicit scroll ownership work together. The shared Screen also forwards the lock to its keyboard-aware Practice scroll view. Ownership is leased per viewer, released on completion/cancellation/unmount, and is not a permanent lock while zoomed.
- Web uses non-passive native touch listeners to prevent the browser's default scrolling only for owned moving/pinching gestures. At-rest single-finger scrolling remains available. Touch collections remain compatible with actual DOM TouchList values.
- Horizontal, vertical and diagonal movement share one controller. Pinch distance controls bounded 1–4× zoom; focal-point anchoring preserves the point under the gesture when unconstrained. Finger-count changes rebase from the current transform without a discontinuity.
- Panning is clamped both to the scaled viewer frame and the actual contained source-picture bounds, not just the extra callout whitespace. At least one quarter of the smaller picture/viewport extent remains visible on each axis. There is no fling/inertia.
- Reset cancels pending animation updates and returns to centered 1× with zero translation.
- Image, anatomical anchor dots, leader lines, marker paint and touch controls remain children of the same transformed canvas. Source-normalized overlay geometry and existing hit sizes are unchanged.
- A drag or pinch suppresses release/compatibility presses. A fresh deliberate tap remains usable, and keyboard activation recovers after the short suppression window. Both Recall label toggling and Practice hotspot selection use this guard.
- Rendering is coalesced to animation frames; expensive callout geometry is memoized independently of zoom/pan.
- The existing wrapping, 44 px-minimum zoom/reset controls stay below the gesture area rather than covering anatomy.

## Verification

- TypeScript check passed.
- Full test suite: **141 passed, zero failures**.
- After final lifecycle hardening: **10 focused gesture/cleanup tests passed**, and TypeScript passed again.
- Gesture-controller coverage includes 1× page-scroll ownership, three pan directions, jitter versus taps, accidental-release suppression, fresh taps, focal pinch anchoring, touch-count changes, bounds across phone-sized/letterboxed scenes, zoom-button re-clamping, reset, and late native measurement correction without a mid-pinch jump.
- A single focused phone-preview pass, plus completion of its missing deliberate Practice-tap check, passed. Numeric observations are below. They are not physical native-device proof.
- The Expo workflow is running. Its known React Native DevTools missing-library warning is unrelated to the application; the web application bundled and started.

## Evidence limits

No native release binary was built or installed, and no physical iPhone/Android gesture verification is claimed. Offline image loading and rights/provenance paths were preserved, not independently re-certified by a new offline/native-device test. No Practice answer is submitted during the focused gesture checks.

## Phone-rendered interaction observations

- **390 px female-reproductive Recall:** Trusted Chromium touch delivery moved the actual page scroll parent from 527 to 422 at 1×, with centered image and no revealed label. Pinch samples at a fixed centroid produced 1, 1.375, 1.75 and 2.125× while page scroll stayed 422.
- **Zoomed pan and Recall tap:** Horizontal, vertical and diagonal drags moved the canvas to (+90,+90) without moving the page. Starting a drag on a Recall marker moved the canvas +36 px without revealing it. A deliberate 3 px-jitter tap inside a visible marker hit area selected Uterus; its duplicate structure marker also revealed, preserving existing shared reveal behavior.
- **Pinch transitions:** Returning to 1× gave zero translation; page scroll stayed fixed through the two-to-one transition and final release. A new 1× swipe then moved the page from 422 to 287. Pinch samples reached the 4× and 1× limits.
- **Bounds evidence:** The browser's largest drag yielded (+195,+87) at 4× and kept source-picture content in-frame, but did not reach saturation. For its 348×676 frame and contained 348×240 picture, the controller's calculated limits are ±522 px horizontally and ±649 px vertically. Oversized-offset saturation and visibility guarantees are verified by the unit matrix, not claimed as independently saturated in-browser.
- **Reset and controls:** Repeated zoom/pan followed by the actual Reset button returned to `translate(0,0) scale(1)`. Normal-phone controls were 44 px high, below the image. Document width remained 390 px.
- **320 px enlarged skeletal Recall:** On the supported `qaFontScale=2.5` fixture, 1.5× panning moved (−22,−20) while page scroll stayed 4583. A deliberate marker tap revealed Maxilla without scrolling; Reset centered the image. Learn/Recall mode switching still worked, and document width remained 320 px. The test used query enlargement, not a separate Text Large preference control.
- **Enlarged Practice:** On the actual selectable “Tap the skull in this anterior axial-skeleton view” question, dragging from the target panned but left the answer unselected and Submit disabled. The page stayed at 610 through pinch and finger-count transitions.
- **Practice tap after pan:** With the enabled raw skull target visible at 1.5×, a 2.8 px-jitter touch inside its transparent hitbox selected Skull and enabled Submit. Its hitbox measured 37.08×53.25 px in that rendered fixture; this is the unchanged raw target, not a numbered 44/60 px callout. The canvas remained `(0,45) scale(1.5)` and page scroll remained 610. Submit was not clicked.
- The image, markers and leaders moved together in the captured zoomed views. At extreme enlarged text, prompts wrap heavily and can extend beyond the current vertical viewport; this existing text presentation was not changed.
- The browser pass predates the final lifecycle hardening for end/cancel delivery outside the element and native app-background cancellation. These additive cleanup paths have static/type coverage; they were not separately exercised on a physical device.
- Full browser observations and measurement clarification are saved in VISUAL_REPAIR_3_BROWSER_CHECKS.json.
