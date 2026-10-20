---
name: Warm Expo browser runtime
description: A persistent test tab can retain pre-restart Metro factories even when the server serves updated code.
---

After an Expo restart, a warm browser tab is not proof that the new JavaScript
is executing, even when the server's current bundle contains the changes.

**Why:** A persistent test page reported exactly the old framing offsets after a
correct, unit-tested layout fix. Its live Metro factories lacked the new
helpers; a fresh page executing the current bundle passed the strict geometry
checks. Repeated checks against the old runtime wasted verification time.

**How to apply:** When measurements are suspiciously identical after a change,
reload into a fresh runtime before changing correct code again. If needed,
compare a narrowly chosen helper symbol in the executed Metro factories with
the served bundle. Do not clear user progress, local storage or saved-image
caches to refresh JavaScript. Keep stale measurements distinguished from
fresh-runtime evidence, and do not treat either as physical-device proof.
