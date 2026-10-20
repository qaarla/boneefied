import test from 'node:test';
import assert from 'node:assert/strict';
import { fitViewerScene, fittedSceneRect, viewerPanBounds } from '../components/viewerSceneFraming.ts';
import { constrainViewer } from '../components/viewerGestureController.ts';

const image = { x: 32, y: 76, width: 284, height: 196 };
const envelope = { x: 4, y: 4, width: 340, height: 340 };
const fit = fitViewerScene(348, 348, 348, 348, [envelope]);
const project = (coordinate: number, offset: number) => 174 + (coordinate - 174) * 4 + offset;

test('raster-only clamps strand an external marker, while annotated vessel bounds make it reachable', () => {
  const raster = viewerPanBounds(image, 348, 348, fit);
  const annotated = viewerPanBounds(image, 348, 348, fit, true);
  const clamped = (bounds: typeof image) => constrainViewer(
    { zoom: 4, offset: { x: 10000, y: 10000 } },
    { width: 348, height: 348, image: bounds },
  );
  assert.ok(project(14, clamped(raster).offset.x) + 8 * 4 < 0, 'old visible painted circle cannot enter the frame');
  const position = project(14, clamped(annotated).offset.x);
  assert.ok(position - 8 * 4 >= 0 && position + 8 * 4 <= 348, 'full painted external circle can be tapped');
  assert.deepEqual(annotated, fit.bounds);
});
test('annotated bounds retain both-axis clamps, stable outward drags and identity Reset', () => {
  const scene = { width: 348, height: 348, image: viewerPanBounds(image, 348, 348, fit, true) };
  const positive = constrainViewer({ zoom: 4, offset: { x: 10000, y: 10000 } }, scene);
  const negative = constrainViewer({ zoom: 4, offset: { x: -10000, y: -10000 } }, scene);
  assert.ok(positive.offset.x > 0 && positive.offset.y > 0);
  assert.ok(negative.offset.x < 0 && negative.offset.y < 0);
  assert.deepEqual(constrainViewer({ zoom: 4, offset: { x: 20000, y: 20000 } }, scene), positive);
  assert.deepEqual(constrainViewer({ zoom: 1, offset: positive.offset }, scene), { zoom: 1, offset: { x: 0, y: 0 } });
});
test('unrelated plates preserve their exact previous raster-bounded pan geometry', () => {
  assert.deepEqual(viewerPanBounds(image, 348, 348, fit), fittedSceneRect(image, 348, 348, fit));
  assert.deepEqual(viewerPanBounds(image, 348, 348, fit, false), fittedSceneRect(image, 348, 348, fit));
});
