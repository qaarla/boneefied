import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const viewer = readFileSync(new URL('../components/AnatomyImageViewer.tsx', import.meta.url), 'utf8');
const renderer = readFileSync(new URL('../components/SharpAtlasImage.tsx', import.meta.url), 'utf8');

test('the fitted raster alone receives the restrained theme-radius mask', () => {
  const surface = viewer.match(/<Animated.View\s+testID="viewer-image-surface"[\s\S]*?<\/Animated.View>/)?.[0];
  assert.ok(surface);
  assert.match(surface, /pointerEvents="none"/);
  assert.match(surface, /left: displayedImage\.x, top: displayedImage\.y/);
  assert.match(surface, /width: displayedImage\.width, height: displayedImage\.height/);
  assert.match(surface, /borderRadius: colors\.radius/);
  assert.match(surface, /<SharpAtlasImage xml=\{vectorXml\} source=\{image\.source\}/);
  assert.match(renderer, /preserveAspectRatio="xMidYMid meet"/);
  assert.match(renderer, /contentFit="contain"/);
  assert.match(renderer, /resizeMode="contain"/);
  assert.doesNotMatch(surface, /hotspots\.map|labels\.map|Pressable/);
  assert.match(viewer, /imageSurface: \{ position: 'absolute', overflow: 'hidden' \}/);
  assert.match(viewer, /image: \{ width: '100%', height: '100%' \}/);
});

test('the rounded image preserves the existing inset, scene fit and sibling annotations', () => {
  assert.match(viewer, /const IMAGE_INSET = 12/);
  assert.match(viewer, /const imageBox = containedOverlayBox\(canvasSize\.width, layoutHeight, imageAspectRatio, IMAGE_INSET\)/);
  assert.match(viewer, /<SharpAtlasImage[^>]*\/>\s*<\/Animated.View>/);
  assert.ok(viewer.indexOf('testID="viewer-image-surface"') < viewer.indexOf('testID="viewer-canvas"'));
  assert.match(viewer, /fitViewerScene\(canvasSize\.width, canvasSize\.height, canvasSize\.width, layoutHeight, fitRects\)/);
  assert.match(viewer, /viewerPanBounds\(imageBox,/);
});
