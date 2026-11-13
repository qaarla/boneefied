import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const screen = readFileSync(new URL('../components/Screen.tsx', import.meta.url), 'utf8');
const viewer = readFileSync(new URL('../components/AnatomyImageViewer.tsx', import.meta.url), 'utf8');
const gesture = readFileSync(new URL('../components/useAnatomyViewerGesture.ts', import.meta.url), 'utf8');

test('the lesson remains viewport-width and scrolls vertically, never horizontally', () => {
  assert.match(screen, /horizontal: false/);
  assert.match(screen, /directionalLockEnabled: true/);
  assert.match(screen, /alwaysBounceHorizontal: false/);
  assert.match(screen, /screen: \{ flex: 1, width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden' \}/);
  assert.match(screen, /scroll: \{ flexGrow: 1, width: '100%', maxWidth: '100%', minWidth: 0 \}/);
  assert.match(screen, /scrollEnabled: !viewerOwnsGesture/);
  assert.match(screen, /contentContainerStyle: \[styles\.scroll, \{ paddingBottom: bottomPadding \}\]/);
});

test('web transformed artwork cannot contribute horizontal page overflow or overscroll', () => {
  assert.match(gesture, /contain: 'layout paint'/);
  assert.match(gesture, /overscrollBehaviorX: 'none'/);
  assert.match(screen, /overflowX: 'hidden'/);
  assert.match(viewer, /gestureArea: \{ width: '100%', maxWidth: '100%', minWidth: 0, aspectRatio: 1, overflow: 'hidden', backgroundColor: ATLAS_CANVAS_COLOR \}/);
  assert.match(gesture, /touchAction: ownsGesture \|\| transform\.zoom > 1 \? 'none' : 'pan-y'/);
});

test('native back-swiping is disabled before any image touch, including the ancestor stack', () => {
  for (const path of ['app/_layout.tsx', 'app/(tabs)/(study)/_layout.tsx']) {
    const layout = readFileSync(path, 'utf8');
    assert.match(layout, /gestureEnabled: false/);
    assert.match(layout, /fullScreenGestureEnabled: false/);
  }
  // A release must never restore swipe-back and reopen the race on the next pan.
  assert.doesNotMatch(screen, /setOptions|gestureEnabled/);
});

test('page-scroll ownership remains tied to active image gestures, not the navigation policy', () => {
  assert.match(screen, /const locked = owners\.current\.size > 0/);
  assert.match(gesture, /const owns = controller\.active && controller\.owns/);
  assert.match(gesture, /live\.current\.setOwnership\(owner, false\)/);
});

test('transforms stay on the viewer layers, with controls and legend outside the gesture box', () => {
  assert.doesNotMatch(screen, /translateX|translateY|scale:/);
  assert.match(viewer, /gesture\.translationStyle/);
  assert.doesNotMatch(viewer, /gesture\.canvasStyle/);
  assert.ok(viewer.indexOf('</ViewerGestureSurface>') < viewer.indexOf('<AtlasViewerControls'));
  assert.ok(viewer.indexOf('</ViewerGestureSurface>') < viewer.indexOf('<AtlasLegend'));
});
