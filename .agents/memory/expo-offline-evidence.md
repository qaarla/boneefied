---
name: Expo offline evidence
description: Distinguish local anatomy asset registration from actual offline image availability in Expo preview and on native devices.
---

Do not claim the anatomy plates work offline merely because they are registered as local `require` images. The Expo web development preview once retained in-app navigation and stored study progress after switching the browser offline, but previously viewed raster images failed when reopened. After explicitly caching visited images in browser storage, a loaded web session was observed reopening a previously visited lesson offline with visible raster plates and no printed labels in Recall. This does not establish a fresh offline launch.

**Why:** Source-level asset presence and an online screenshot were both successful while a later browser-offline exercise showed blank image areas. Neither this web-preview failure nor an online view establishes native package behavior.

**How to apply:** Report separately (1) bundled file/catalog checks, (2) loaded web-preview offline checks, and (3) a fresh offline launch on a physical native device. Do not infer (3) from either (1) or (2). Native offline availability needs native-device evidence. React Native Web's Image does not expose the native resolveAssetSource method; use the Expo asset resolver when caching web URLs.

When correcting an existing raster, preserve unrelated cached images but give
the changed artwork a new preview fetch/cache identity if its URL is stable.

**Why:** Metro web-preview image paths can stay identical when PNG bytes change.
A cache-first image loader would otherwise keep displaying the earlier anatomy
despite a correct source edit.

**How to apply:** Check the revised response and cached bytes against the current
source hash, then remount offline. Do not erase the entire anatomy cache to make
an image correction appear to work; production content-hashed assets and native
bundles have different identity behavior.

Offline and loading checks must inspect the foreground study image, not any
completed image in the surrounding card.

**Why:** A decorative background can be fully loaded while the anatomy is still
pending, producing a false offline pass or an incorrect dimension failure.

**How to apply:** Wait for the actual study image and compare its natural
dimensions with the expected source before making image-availability or
geometry claims. A rendered credit, legend or viewer shell is not image evidence.

Distinguish a reused asset's gallery instance from its lesson instance when
claiming offline reopening.

**Why:** Closing a lesson can unmount its image while the same asset remains
mounted in a fixed gallery. Selecting the first matching asset ID can silently
verify the gallery rather than the image that was supposedly reopened.

**How to apply:** Observe which specific viewers actually unmount, then reopen
and check those foreground images offline. Report still-mounted gallery checks
separately from remount evidence; do not promote either to native cold-start proof.

Capture a live image-node reference immediately before collapsing that same
lesson, then require its detachment and a distinct loaded node after reopening.
Do not rely on opening a collection of lessons first or on credit counts.

**Why:** Exclusive lesson expansion can detach earlier images while later
lessons are opened. Bulk closure assertions then misreport a test-harness
failure as an offline failure. Recall can also keep numbered markers mounted
while concealing names; absence of every marker is not the Recall contract.

**How to apply:** Check one lesson instance through the entire
open/close/reopen sequence. Verify foreground bytes and hidden/revealed names
independently of viewer-shell, credit, and numbered-marker presence.