import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { renderableAtlasXml } from '../components/atlasVectorXml.ts';

const generated = readFileSync('content/vector-image-sources.generated.ts', 'utf8');
const pairs = [...generated.matchAll(/\[require\('@\/([^']+)'\), \(\) => require\('@\/([^']+)'\) as string\]/g)]
  .map((m) => ({ raster: m[1]!, vector: m[2]! }));

test('the exact masters cover 154/164 published images, preserving all existing raster identities', () => {
  const inventory = JSON.parse(readFileSync('../../research/boneefied-photo-references/inventory.json', 'utf8'));
  const byRaster = new Map(pairs.map((p) => [p.raster, p.vector]));
  const vector = inventory.assets.filter((a: { localAssetPath: string }) => byRaster.has(a.localAssetPath));
  assert.equal(inventory.assets.length, 164);
  assert.equal(vector.length, 154);
  for (const { raster, vector } of pairs) {
    assert.ok(existsSync(raster), raster);
    const xml = readFileSync(vector, 'utf8');
    assert.match(xml, /<svg\b/);
    assert.doesNotMatch(xml, /<image\b|data:image\/|<foreignObject\b/, vector);
  }
});

test('the actual heart plate source resolves to its original vector, not a PNG enlargement', () => {
  assert.ok(pairs.some((p) => p.raster === 'assets/images/anatomy/bvis05-atlas/bvis05-01-heart-anterior.png'
    && p.vector === 'assets/images/anatomy/bvis05-atlas/bvis05-01-heart-anterior.svg'));
  const viewer = readFileSync('components/AnatomyImageViewer.tsx', 'utf8');
  assert.match(viewer, /vectorXmlForSource\(source\)/);
  assert.match(viewer, /<SharpAtlasImage xml=\{vectorXml\}/);
  assert.match(viewer, /scale=\{gesture.zoom \* framing.scale\}/);
  const renderer = readFileSync('components/SharpAtlasImage.tsx', 'utf8');
  assert.match(renderer, /width=\{width \* resolutionScale\}/);
  assert.match(renderer, /height=\{height \* resolutionScale\}/);
  assert.match(renderer, /allowDownscaling=\{false\}/);
});

test('legacy editor metadata is omitted without changing any visible paths or viewBox', () => {
  for (const { vector } of pairs) {
    const original = readFileSync(vector, 'utf8');
    const clean = renderableAtlasXml(original);
    assert.doesNotMatch(clean, /\s(?:inkscape|sodipodi):[\w-]+\s*=/, vector);
    assert.doesNotMatch(clean, /\sdata-[\w-]+\s*=/, vector);
    assert.doesNotMatch(clean, /<(?:metadata|sodipodi:namedview|inkscape:perspective)\b/, vector);
    // All of these elements participate in visible artwork/registration.
    const artwork = (s: string) => [...s.matchAll(/<(?:path|rect|g|clipPath|use|ellipse|circle|linearGradient|stop|polyline)\b[^>]*>/g)]
      .map((m) => m[0].replace(/\s+(?:(?:inkscape|sodipodi):[\w-]+|xmlns:(?!xlink\b)[\w-]+|data-[\w-]+)\s*=\s*(?:"[^"]*"|'[^']*')/g, ''));
    assert.deepEqual(artwork(clean), artwork(original), vector);
    assert.equal(clean.match(/viewBox=["'][^"']+["']/)?.[0], original.match(/viewBox=["'][^"']+["']/)?.[0], vector);
  }
});
