import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { content } from '../content/canonical.ts';
import { containedOverlayBox } from '../components/viewerOverlayProtection.ts';
import { fitViewerScene, fittedSceneRect, zoomedViewportRect } from '../components/viewerSceneFraming.ts';

const inventory = JSON.parse(readFileSync('../../research/boneefied-photo-references/inventory.json', 'utf8')).assets;
const active = new Set([
  ...content.modules.flatMap(m => (m.lessons ?? []).flatMap(l => l.assetIds ?? [])),
  ...content.questions.flatMap(q => q.assetId ? [q.assetId] : []),
]);

test('the source audit covers the entire current active runtime, not just a stale sample', () => {
  assert.deepEqual([...active].sort(), inventory.map((a: { id: string }) => a.id).sort());
  assert.equal(active.size, 164);
});

test('actual-size image painting matches the old annotation transform for every active plate, zoom, pan and phone width', () => {
  for (const asset of content.assets.filter(a => active.has(a.id))) {
    for (const width of [239, 316, 348, 390]) for (const height of [220, 396, 780]) {
      const aspect = asset.imageAspectRatio ?? 1.45;
      const image = containedOverlayBox(width, height, aspect, 12);
      const fit = fitViewerScene(width, width, width, height,
        [image, { x: 0, y: 0, width: 44, height: 44 }, { x: width - 44, y: height - 44, width: 44, height: 44 }]);
      for (const zoom of [1, 1.5, 2, 2.5, 3, 4]) {
        const displayed = zoomedViewportRect(fittedSceneRect(image, width, height, fit), width, width, zoom);
        for (const point of [{ x: 0, y: 0 }, { x: .5, y: .5 }, { x: 1, y: 1 }, ...(asset.labels ?? [])]) {
          for (const pan of [-87, 0, 123]) {
            const oldX = pan + width / 2 + zoom *
              (fit.left + width / 2 + fit.scale * (image.x + point.x * image.width - width / 2) - width / 2);
            const oldY = pan + width / 2 + zoom *
              (fit.top + height / 2 + fit.scale * (image.y + point.y * image.height - height / 2) - width / 2);
            assert.ok(Math.abs(displayed.x + point.x * displayed.width + pan - oldX) < 1e-8, asset.id);
            assert.ok(Math.abs(displayed.y + point.y * displayed.height + pan - oldY) < 1e-8, asset.id);
          }
        }
        assert.ok(Math.abs(displayed.width / displayed.height - aspect) < 1e-8, asset.id);
      }
    }
  }
});

test('SVG is drawn at final dimensions outside every scaled scene, with no inverse-scale workaround', () => {
  const viewer = readFileSync('components/AnatomyImageViewer.tsx', 'utf8');
  const renderer = readFileSync('components/SharpAtlasImage.tsx', 'utf8');
  const imageLayer = viewer.slice(viewer.indexOf('testID="viewer-image-surface"'), viewer.indexOf('testID="viewer-canvas"'));
  assert.match(imageLayer, /gesture.translationStyle/);
  assert.doesNotMatch(imageLayer, /gesture.canvasStyle|transform:\s*\[/);
  assert.match(viewer, /borderRadius: colors.radius \* framing.scale \* gesture.zoom/);
  assert.match(renderer, /width=\{width\}/);
  assert.match(renderer, /height=\{height\}/);
  assert.doesNotMatch(renderer, /resolutionScale|transformOrigin|transform:\s*\[/);
  assert.match(renderer, /allowDownscaling=\{false\}/);
});

test('the retained pelvis uses a real publisher vector and a genuinely vector-rendered high-resolution fallback', () => {
  const base = 'assets/images/anatomy/';
  const proof = JSON.parse(readFileSync(base + 'pelvis-vector-recovery.json', 'utf8'));
  const png = readFileSync(base + 'servier-pelvis.png');
  const xml = readFileSync(base + 'servier-pelvis.svg');
  assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [2560, 2940]);
  assert.match(xml.toString(), /viewBox="0 0 256 294"/);
  assert.doesNotMatch(xml.toString(), /<image\b|data:image/);
  assert.equal(createHash('sha256').update(png).digest('hex'), proof.pngSha256);
  assert.equal(createHash('sha256').update(xml).digest('hex'), proof.vectorSha256);
  assert.equal(proof.lowResolutionImageUpscaled, false);
  assert.equal(proof.automaticMatchAccepted, false);
  assert.equal(proof.manualAnatomicalMatchAccepted, true);
  assert.match(readFileSync('content/vector-image-sources.generated.ts', 'utf8'),
    /require\('@\/assets\/images\/anatomy\/servier-pelvis.png'\), \(\) => require\('@\/assets\/images\/anatomy\/servier-pelvis.svg'\)/);
});
