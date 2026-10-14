import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ViewerGestureController, constrainViewer, type ViewerScene } from '../components/viewerGestureController.ts';

const origin = { x: 20, y: 100 };
const scene: ViewerScene = { width: 348, height: 572, image: { x: 0, y: 166, width: 348, height: 240 } };
const touch = (x: number, y: number) => ({ 0: { pageX: x, pageY: y }, length: 1 });
const pinch = (distance: number, x = 194, y = 386) => ({
  0: { pageX: x - distance / 2, pageY: y },
  1: { pageX: x + distance / 2, pageY: y }, length: 2,
});
test('1× observes taps but leaves ordinary vertical swipes to the page', () => {
  const g = new ViewerGestureController();
  g.start(touch(140, 360), scene, origin, 0);
  assert.equal(g.owns, false);
  g.move(touch(140, 430), scene, origin, 1);
  assert.equal(g.owns, false);
  assert.deepEqual(g.transform, { zoom: 1, offset: { x: 0, y: 0 } });
  assert.equal(g.canPress(1), false, 'scroll cannot select a target');
});
test('zoomed horizontal, vertical and diagonal pans use both axes', () => {
  for (const [dx, dy] of [[30, 0], [0, 30], [-30, -40]]) {
    const g = new ViewerGestureController();
    g.changeZoom(1, scene);
    g.start(touch(194, 386), scene, origin, 0);
    assert.equal(g.owns, true, 'ownership starts before scroll interception');
    g.move(touch(194 + dx, 386 + dy), scene, origin, 1);
    assert.deepEqual(g.transform.offset, { x: dx, y: dy });
    assert.equal(g.canPress(1), false);
    g.end(2);
    assert.equal(g.owns, false);
    assert.equal(g.canPress(3), false, 'release click must not select an answer');
    assert.equal(g.canPress(403), true, 'keyboard presses recover after suppression window');
  }
});
test('minor jitter is a tap, not a pan; a fresh tap after dragging remains usable', () => {
  const g = new ViewerGestureController();
  g.changeZoom(0.5, scene);
  g.start(touch(194, 386), scene, origin, 0);
  g.move(touch(196, 388), scene, origin, 1);
  assert.deepEqual(g.transform.offset, { x: 0, y: 0 });
  assert.equal(g.canPress(1), true);
  g.move(touch(220, 420), scene, origin, 2);
  g.end(3);
  assert.equal(g.canPress(4), false);
  g.start(touch(220, 420), scene, origin, 5);
  assert.equal(g.canPress(5), true);
});
test('pinch owns immediately and retains ownership after dropping to one finger at 1×', () => {
  const g = new ViewerGestureController();
  g.start(touch(100, 386), scene, origin, 0);
  g.start(pinch(100), scene, origin, 1);
  assert.equal(g.owns, true);
  g.move(pinch(200), scene, origin, 2);
  assert.equal(g.transform.zoom, 2);
  g.move(pinch(40), scene, origin, 3);
  assert.equal(g.transform.zoom, 1);
  assert.deepEqual(g.transform.offset, { x: 0, y: 0 });
  g.start(touch(174, 386), scene, origin, 4);
  assert.equal(g.owns, true);
  g.move(touch(174, 420), scene, origin, 5);
  assert.equal(g.transform.zoom, 1);
  assert.equal(g.canPress(5), false);
  g.end(6);
  assert.equal(g.owns, false);
});
test('pinch is focal-point anchored, bounded, and rebases between one and two touches', () => {
  const g = new ViewerGestureController();
  g.start(pinch(100, 224, 406), scene, origin, 0);
  g.move(pinch(200, 224, 406), scene, origin, 1);
  assert.deepEqual(g.transform, { zoom: 2, offset: { x: -30, y: -20 } });
  g.move(pinch(1000, 224, 406), scene, origin, 2);
  assert.equal(g.transform.zoom, 4);
  const before = g.transform;
  g.start(touch(224, 406), scene, origin, 3);
  assert.deepEqual(g.transform, before);
  g.move(touch(230, 414), scene, origin, 4);
  assert.equal(g.transform.offset.x, before.offset.x + 6);
  assert.equal(g.transform.offset.y, before.offset.y + 8);
});
test('clamp retains at least a quarter of contained image/viewport intersection at phone widths', () => {
  for (const width of [239, 271, 348]) for (const height of [width / 1.45, 572, 780]) for (const zoom of [1, 1.5, 2, 4]) {
    const imageHeight = Math.min(height, width / 1.45);
    const s = { width, height, image: { x: 0, y: (height - imageHeight) / 2, width, height: imageHeight } };
    for (const direction of [-1, 1]) {
      const result = constrainViewer({ zoom, offset: { x: direction * 1e6, y: direction * 1e6 } }, s);
      const top = height / 2 + (s.image.y - height / 2) * zoom + result.offset.y;
      const bottom = top + imageHeight * zoom;
      assert.ok(Math.min(height, bottom) - Math.max(0, top) >= Math.min(height, imageHeight * zoom) / 4 - 1e-7);
      assert.ok(Math.abs(result.offset.x) <= width * (zoom - 1) / 2 + 1e-7);
      assert.ok(Math.abs(result.offset.y) <= height * (zoom - 1) / 2 + 1e-7);
    }
  }
});
test('extreme drags retain the full image/viewport intersection, including padded portrait and landscape frames', () => {
  for (const width of [239, 301, 348]) for (const height of [220, 396, 572]) for (const aspect of [0.5, 1.45, 2.8]) {
    const imageHeight = Math.min(height - 24, (width - 24) / aspect);
    const imageWidth = imageHeight * aspect;
    const s = { width, height, image: { x: (width - imageWidth) / 2, y: (height - imageHeight) / 2, width: imageWidth, height: imageHeight } };
    for (const zoom of [1.01, 1.5, 2, 4]) for (const direction of [-1, 1]) {
      const t = constrainViewer({ zoom, offset: { x: direction * 1e6, y: -direction * 1e6 } }, s);
      for (const [frame, start, size, offset] of [
        [width, s.image.x, imageWidth, t.offset.x],
        [height, s.image.y, imageHeight, t.offset.y],
      ]) {
        const first = frame / 2 + (start - frame / 2) * zoom + offset;
        const last = first + size * zoom;
        const overlap = Math.min(frame, last) - Math.max(0, first);
        assert.ok(overlap >= Math.min(frame, size * zoom) - 1e-7);
      }
    }
  }
});

test('pinch translated through each edge stays owned until final lift and cannot release an answer', () => {
  const g = new ViewerGestureController();
  g.start(pinch(100), scene, origin, 0);
  for (const [distance, x, y] of [[250, 250, 420], [500, 900, -500], [25, 100, 340]]) {
    g.move(pinch(distance, x, y), scene, origin, 1);
    assert.equal(g.owns, true);
    assert.ok(g.transform.zoom >= 1 && g.transform.zoom <= 4);
  }
  g.start(touch(100, 340), scene, origin, 2);
  g.move(touch(140, 390), scene, origin, 3);
  assert.equal(g.owns, true);
  g.end(4);
  assert.equal(g.owns, false);
  assert.equal(g.canPress(5), false);
  g.reset();
  assert.deepEqual(g.transform, { zoom: 1, offset: { x: 0, y: 0 } });
});

test('native capture locks before interception, web ownership survives a return to 1×, and page momentum is frozen', () => {
  const hook = readFileSync(new URL('../components/useAnatomyViewerGesture.ts', import.meta.url), 'utf8');
  const screen = readFileSync(new URL('../components/Screen.tsx', import.meta.url), 'utf8');
  assert.match(hook, /onStartShouldSetPanResponderCapture:[\s\S]*?measure\(\); begin\(e\.nativeEvent\.touches\);/);
  assert.match(hook, /return controller\.owns && e\.nativeEvent\.touches\.length > 1/);
  assert.match(hook, /touchAction: ownsGesture \|\| transform\.zoom > 1 \? 'none' : 'pan-y'/);
  assert.match(hook, /setOwnsGesture\(owns\)/);
  assert.match(screen, /lockedScrollY\.current = scrollY\.current/);
  assert.match(screen, /scrollTo\(\{ y: lockedScrollY\.current, animated: false \}\)/);
  assert.match(screen, /owners\.current\.size > 0 && lockedScrollY\.current !== null/);
});
test('zoom buttons re-clamp and reset clears transform and any active ownership', () => {
  const g = new ViewerGestureController();
  g.changeZoom(3, scene);
  g.start(touch(100, 300), scene, origin, 0);
  g.move(touch(1000, 1000), scene, origin, 1);
  g.changeZoom(-2.5, scene);
  assert.deepEqual(g.transform, constrainViewer(g.transform, scene));
  g.reset();
  assert.deepEqual(g.transform, { zoom: 1, offset: { x: 0, y: 0 } });
  assert.equal(g.owns, false);
  assert.equal(g.active, false);
});
test('late native origin measurement can correct a fresh pinch but cannot jump a moving pinch', () => {
  const g = new ViewerGestureController();
  g.start(pinch(100), scene, { x: 0, y: 0 }, 0);
  g.refreshFrameOrigin(scene, origin);
  g.move(pinch(200), scene, origin, 1);
  assert.deepEqual(g.transform, { zoom: 2, offset: { x: 0, y: 0 } });
  g.refreshFrameOrigin(scene, { x: 900, y: 900 });
  g.move(pinch(210), scene, origin, 2);
  assert.deepEqual(g.transform.offset, { x: 0, y: 0 });
});
test('gesture lifecycle wires and removes global end/cancel and native background cleanup', () => {
  const hook = readFileSync(new URL('../components/useAnatomyViewerGesture.ts', import.meta.url), 'utf8');
  for (const event of ['touchend', 'touchcancel']) {
    assert.ok(hook.includes(`window.addEventListener('${event}',`));
    assert.ok(hook.includes(`window.removeEventListener('${event}',`));
  }
  assert.ok(hook.includes("AppState.addEventListener('change'"));
  assert.ok(hook.includes('subscription.remove()'));
  assert.ok(hook.includes('live.current.setOwnership(owner, false)'));
});
