import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { anatomyImageCacheKey } from '../components/anatomyImageCacheKey.ts';

const dir = 'assets/images/anatomy';
const hash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');

test('all 151 original atlas rasters are direct 2x SVG exports with current provenance', () => {
  let count = 0;
  for (const group of ['atlas', 'skeletal-atlas', 'muscular-atlas', 'bvis04-atlas', 'bvis05-atlas', 'bvis06-atlas', 'foundations-corrections']) {
    const folder = join(dir, group);
    const proof = JSON.parse(readFileSync(join(folder, 'provenance.json'), 'utf8'));
    if (proof.rasterExport) assert.equal(proof.rasterExport.scale, 2);
    for (const name of readdirSync(folder).filter((n) => n.endsWith('.svg'))) {
      const svg = readFileSync(join(folder, name), 'utf8');
      const box = svg.match(/viewBox=["']0 0 ([\d.]+) ([\d.]+)["']/);
      const w = Number(box?.[1] ?? svg.match(/\bwidth=["']([\d.]+)["']/)?.[1]);
      const h = Number(box?.[2] ?? svg.match(/\bheight=["']([\d.]+)["']/)?.[1]);
      const pngPath = join(group === 'foundations-corrections' ? dir : folder, name.replace(/\.svg$/, '.png'));
      const png = readFileSync(pngPath);
      assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [w * 2, h * 2], name);
      const record = (proof.plates ?? proof.records).find((r: { pngPath: string }) => r.pngPath === pngPath);
      assert.ok(record, name);
      assert.equal(record.sha256?.png ?? record.pngSha256, hash(pngPath), name);
      count++;
    }
  }
  assert.equal(count, 151);
});

test('microscope images use authentic full-resolution originals, not resampled previews', () => {
  const proof = JSON.parse(readFileSync(join(dir, 'source-resolution.json'), 'utf8'));
  for (const tissue of ['squamous', 'cuboidal', 'columnar']) {
    const record = proof.records.find((r: { id: string }) => r.id === `asset-commons-simple-${tissue}-epithelium`);
    assert.equal(record.result, 'upgraded-exact-source');
    assert.equal(record.after.width, 3264);
    assert.equal(record.after.sha256, hash(record.path));
    assert.equal(record.license, 'CC0');
  }
});

test('changed bundled artwork gets a new web cache identity even at a stable Metro URL', () => {
  const uri = 'https://example.test/assets/atlas-01-anterior-position.png?platform=web#image';
  const oldKey = anatomyImageCacheKey(uri, 'old-pixel-hash');
  const newKey = anatomyImageCacheKey(uri, 'new-pixel-hash');
  assert.notEqual(oldKey, newKey);
  assert.match(newKey, /platform=web&boneefiedArt=new-pixel-hash#image$/);
  assert.equal(anatomyImageCacheKey(uri, 'new-pixel-hash'), newKey);
  assert.equal(anatomyImageCacheKey('https://example.test/unmodified.jpg'), 'https://example.test/unmodified.jpg');
  assert.equal(anatomyImageCacheKey('https://example.test/unmodified.jpg', 'hash'), 'https://example.test/unmodified.jpg');
  assert.match(anatomyImageCacheKey(uri, null), /boneefiedArt=retina-two-press-1/);
});

test('recovered Servier drawings have a verified source match and unchanged aspect', () => {
  const proof = JSON.parse(readFileSync(join(dir, 'servier-resolution.json'), 'utf8'));
  const upgraded = proof.records.filter((r: { result: string }) => r.result === 'upgraded-exact-vector-source');
  assert.ok(upgraded.length >= 6);
  for (const record of upgraded) {
    assert.ok(record.comparisonMse < .003, record.path);
    assert.equal(record.after.width / record.after.height, record.before.width / record.before.height, record.path);
    assert.equal(record.after.sha256, hash(record.path), record.path);
    assert.match(record.deck, /^https:\/\/smart\.servier\.com\/.*\.pptx$/);
    assert.match(record.license, /CC BY 4.0/);
    assert.ok(readFileSync(record.path.replace(/\.png$/, '.svg'), 'utf8').includes('<path'));
  }
});
