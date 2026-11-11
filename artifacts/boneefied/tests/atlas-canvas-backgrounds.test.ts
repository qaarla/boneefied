import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { ATLAS_CANVAS_COLOR, ATLAS_CANVAS_INK } from '../constants/atlasCanvas.ts';
import { content } from '../content/canonical.ts';

const report = JSON.parse(readFileSync('../../research/atlas-canvas-backgrounds.json', 'utf8'));
const inventory = JSON.parse(readFileSync('../../research/atlas-zoom-source-audit.json', 'utf8'));
const viewer = readFileSync('components/AnatomyImageViewer.tsx', 'utf8');
const mapping = readFileSync('content/atlas-canvas-raster-sources.ts', 'utf8');
const sha = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const rgb = (path: string): Buffer => execFileSync('magick', [path, '-alpha', 'off', '-depth', '8', 'rgb:-'], { maxBuffer: 20_000_000 });

test('one warm paper covers every current atlas image, independent of appearance', () => {
  const active = new Set([...content.modules.flatMap(m => (m.lessons ?? []).flatMap(l => l.assetIds ?? [])),
    ...content.questions.flatMap(q => q.assetId ? [q.assetId] : [])]);
  assert.deepEqual([...active].sort(), inventory.rows.map((r: { id: string }) => r.id).sort());
  assert.equal(report.activeIllustrations, active.size);
  assert.equal(report.canvas, ATLAS_CANVAS_COLOR);
  assert.equal(ATLAS_CANVAS_COLOR, '#ECEAE2');
  assert.match(viewer, /gestureArea: \{[^\n]*backgroundColor: ATLAS_CANVAS_COLOR/);
  assert.doesNotMatch(viewer, /\btintColor:|\bmixBlendMode:|\bfilter:/);
  assert.match(viewer, /useOfflineImage\(vectorXml \? undefined : atlasCanvasRasterSource\(source\)\)/);
  assert.match(viewer, /vectorXmlForSource\(source\)/);
  assert.match(viewer, /Asset\.fromModule\(source\)/, 'original geometry remains authoritative');
});

test('all original artwork and photos retain their exact source bytes', () => {
  for (const row of inventory.rows) {
    assert.equal(sha(row.activeRequire), row.rasterSha256, row.id);
    if (row.vectorMaster) assert.equal(sha(row.vectorMaster), row.vectorSha256, row.id);
  }
  assert.equal(inventory.rows.filter((r: { vectorMaster: string | null }) => r.vectorMaster).length, report.vectorMastersUnchanged);
});

test('all three white-paper bitmaps are wired to background-only copies, not photos or vectors', () => {
  assert.equal(report.displayCopies.length, 3);
  assert.equal([...mapping.matchAll(/\[require\(/g)].length, 3);
  const paper = [236, 234, 226];
  for (const row of report.displayCopies) {
    assert.ok(mapping.includes(`require('@/${row.original}')`));
    assert.ok(mapping.includes(`require('@/${row.displayCopy}')`));
    assert.equal(sha(row.displayCopy), row.displaySha256);
    const before = rgb(row.original), after = rgb(row.displayCopy);
    assert.equal(before.length, after.length);
    assert.deepEqual(readFileSync(row.original).subarray(16, 24), readFileSync(row.displayCopy).subarray(16, 24), 'pixel dimensions');
    let changed = 0, retainedWhite = 0;
    for (let i = 0; i < before.length; i += 3) {
      const white = before[i] === 255 && before[i + 1] === 255 && before[i + 2] === 255;
      if (before[i] === after[i] && before[i + 1] === after[i + 1] && before[i + 2] === after[i + 2]) {
        if (white) retainedWhite++;
        continue;
      }
      assert.ok(white, `${row.original}: anatomical ink or color changed at pixel ${i / 3}`);
      assert.deepEqual([...after.subarray(i, i + 3)], paper);
      changed++;
    }
    assert.equal(changed, row.backgroundPixelsChanged);
    assert.equal(retainedWhite, row.enclosedOrProtectedWhitePixels);
    for (const [x, y] of row.protectedBoneProbes) {
      const i = (y * row.dimensions[0] + x) * 3;
      assert.deepEqual([...after.subarray(i, i + 3)], [255, 255, 255], 'bone remains anatomically white');
    }
  }
});

test('canvas text and annotation leaders remain readable in both appearances', () => {
  const channels = (hex: string) => hex.slice(1).match(/../g)!.map(v => parseInt(v, 16));
  const luminance = (color: number[]) => color.map(c => c / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
  const paper = channels(ATLAS_CANVAS_COLOR), ink = channels(ATLAS_CANVAS_INK);
  const contrast = (color: number[]) => (luminance(paper) + 0.05) / (luminance(color) + 0.05);
  assert.ok(contrast(ink) >= 7);
  assert.ok(contrast(ink.map((c, i) => c * 0.6 + paper[i] * 0.4)) >= 3);
  assert.match(viewer, /const targetColor = [^\n]*: ATLAS_CANVAS_INK/);
  assert.match(viewer, /backgroundColor: visible \? colors\.primary : ATLAS_CANVAS_INK/);
});
