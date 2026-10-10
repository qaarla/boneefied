import assert from 'node:assert/strict';
import test from 'node:test';
import { clampMarkerCenter, hasMarkerOverlap } from '../components/viewerMarkerLayout.ts';

test('viewer labels remain inside narrow and normal frames at all four edges', () => {
  for (const frameSize of [278, 348]) {
    for (const markerSize of [30, 119, 170]) {
      for (const center of [0, 10, frameSize / 2, frameSize - 10, frameSize]) {
        const clamped = clampMarkerCenter(center, frameSize, markerSize);
        assert.ok(clamped - markerSize / 2 >= 2);
        assert.ok(clamped + markerSize / 2 <= frameSize - 2);
      }
    }
  }
});

test('interior labels retain their positions; oversized labels use the capped frame width', () => {
  assert.equal(clampMarkerCenter(140, 280, 30), 140);
  assert.equal(clampMarkerCenter(140, 280, 400), 140);
  assert.equal(clampMarkerCenter(0, 0, 30), 0);
  assert.equal(clampMarkerCenter(30, 348, 119), 61.5);
});

test('only genuine intersecting label boxes trigger the numbered-marker layout', () => {
  const first = { left: 2, top: 100, width: 119, height: 30 };
  assert.equal(hasMarkerOverlap([first, { left: 109, top: 110, width: 70, height: 30 }]), true);
  assert.equal(hasMarkerOverlap([first, { left: 121, top: 110, width: 70, height: 30 }]), false);
  assert.equal(hasMarkerOverlap([first, { left: 30, top: 130, width: 70, height: 30 }]), false);
  assert.equal(hasMarkerOverlap([first]), false);
  assert.equal(hasMarkerOverlap([]), false);
});
