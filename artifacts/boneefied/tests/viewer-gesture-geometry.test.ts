import test from 'node:test';
import assert from 'node:assert/strict';
import { touchCenter, touchDistance } from '../components/viewerGestureGeometry.ts';

test('pinch and pan geometry accepts actual browser-style TouchList shapes without Array methods', () => {
  const start = { 0: { pageX: 80, pageY: 440 }, 1: { pageX: 240, pageY: 440 }, length: 2 };
  const pinch = { 0: { pageX: 50, pageY: 450 }, 1: { pageX: 270, pageY: 450 }, length: 2 };
  assert.equal(Array.isArray(start), false);
  assert.deepEqual(touchCenter(start), { x: 160, y: 440 });
  assert.deepEqual(touchCenter(pinch), { x: 160, y: 450 });
  assert.equal(touchDistance(pinch) / touchDistance(start), 1.375);
  const panStart = touchCenter({ 0: { pageX: 100, pageY: 450 }, length: 1 });
  const panEnd = touchCenter({ 0: { pageX: 160, pageY: 480 }, length: 1 });
  assert.deepEqual({ x: panEnd.x - panStart.x, y: panEnd.y - panStart.y }, { x: 60, y: 30 });
  assert.deepEqual(touchCenter([{ pageX: 100, pageY: 450 }]), panStart, 'native arrays remain supported');
  assert.equal(touchDistance({ length: 0 }), 0);
  assert.throws(() => touchCenter({ length: 0 }), RangeError);
});
