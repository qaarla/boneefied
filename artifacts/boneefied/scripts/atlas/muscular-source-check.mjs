import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { content } from '../../content/canonical.ts';
import { muscularPlates } from '../../content/muscular-atlas-plates.generated.ts';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const dir = join(root, '../../generated-artifacts/atlas-muscular-repair');
const before = JSON.parse(fs.readFileSync(join(dir, 'inventory-before.json')));
const provenancePath = join(root, 'assets/images/anatomy/muscular-atlas/provenance.json');
const provenance = JSON.parse(fs.readFileSync(provenancePath));
const sha = b => createHash('sha256').update(b).digest('hex');
const rows = [];
for (const p of muscularPlates) {
  const a = content.assets.find(a => a.id === p.id);
  const baseline = before.findIndex(a => a.id === p.id);
  const oldReview = fs.readFileSync(join(dir, `${String(baseline + 1).padStart(2, '0')}-before.svg`), 'utf8');
  const old = Buffer.from(oldReview.match(/base64,([^"]+)/)[1], 'base64');
  fs.writeFileSync('/tmp/muscular-before.png', old);
  const comparison = spawnSync('compare', ['-metric', 'AE', '/tmp/muscular-before.png', join(root, p.pngPath), 'null:'], { encoding: 'utf8' });
  const pixelDifference = Number.parseFloat(comparison.stderr.trim());
  if (!Number.isFinite(pixelDifference)) throw Error(`Cannot compare ${p.id}: ${comparison.stderr}`);
  // Do not churn PNG encodings/metadata when actual rendered pixels are unchanged.
  if (pixelDifference === 0) fs.writeFileSync(join(root, p.pngPath), old);
  const record = provenance.plates.find(r => r.id === p.id);
  record.sha256.png = sha(fs.readFileSync(join(root, p.pngPath)));
  const svg = fs.readFileSync(join(root, p.svgPath), 'utf8');
  if (/\b(?:NaN|Infinity)\b/.test(svg)) throw Error(`Nonfinite source geometry: ${p.id}`);
  const idSvg = fs.readFileSync(`/tmp/mus-id-${p.key}.svg`, 'utf8');
  const paths = [...idSvg.matchAll(/<path d="([^"]+)" fill="([^"]+)"/g)];
  const wanted = new Map([...svg.matchAll(/<path d="([^"]+)"[^>]*data-structure-id="([^"]+)" data-anchor="[^"]+"/g)]
    .map(m => [m[2], paths.find(p => p[1] === m[1])?.[2]]));
  const rgb = execFileSync('convert', [`/tmp/mus-id-${p.key}.png`, '-depth', '8', 'rgb:-'], { maxBuffer: 10000000, stdio: ['ignore', 'pipe', 'ignore'] });
  const annotations = a.labels.map(l => {
    const x = Math.round(l.x * 1450), y = Math.round(l.y * 1000);
    const offset = (y * 1450 + x) * 3;
    const color = `#${rgb.subarray(offset, offset + 3).toString('hex')}`;
    const visibleOwnShape = color === wanted.get(l.structureId);
    if (!visibleOwnShape) throw Error(`${p.id}:${l.structureId} hits ${color}, expected ${wanted.get(l.structureId)}`);
    return { structureId: l.structureId, x: l.x, y: l.y, visibleOwnShape };
  });
  rows.push({ id: p.id, key: p.key, pixelDifference, redrawn: pixelDifference !== 0,
    beforeSHA256: sha(old), afterSHA256: record.sha256.png, annotations });
}
fs.writeFileSync(provenancePath, JSON.stringify(provenance, null, 2) + '\n');
fs.writeFileSync(join(dir, 'source-review.json'), JSON.stringify({
  inspected: before.length, targets: before.reduce((n, a) => n + (a.labels ?? a.hotspots ?? []).length, 0),
  ownVisibleShapeChecks: rows.reduce((n, a) => n + a.annotations.length, 0),
  redrawn: rows.filter(r => r.redrawn).length, rows,
  additionalRetainedVisual: 'asset-atlas-body-cavities: ten targets individually inspected; no muscular ID-map claim for this separate source.',
}, null, 2));
console.log(`Checked ${rows.length} muscular plates; ${rows.reduce((n, r) => n + r.annotations.length, 0)} published targets on their own visible shapes; ${rows.filter(r => r.redrawn).length} pixel-changed plates.`);
