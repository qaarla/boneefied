import { content } from '../../content/canonical.ts';
import { combinedAtlasAssetsForStructure } from '../../content/atlas-index.ts';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../../', import.meta.url));
const out = join(root, '../../generated-artifacts/atlas-joints-repair');
mkdirSync(out, { recursive: true });
const module = content.modules.find(m => m.id === 'joints-ligaments');
const uses = new Map();
const add = (id, use) => { if (id) uses.set(id, [...uses.get(id) ?? [], use]); };
for (const l of module.lessons) for (const id of l.assetIds ?? []) add(id, `lesson:${l.id}`);
for (const q of content.questions.filter(q => q.moduleId === module.id)) add(q.assetId, `question:${q.id}`);
for (const s of content.structures.filter(s => s.moduleId === module.id)) {
  for (const a of combinedAtlasAssetsForStructure(s.id)) add(a.id, `glossary:${s.id}`);
}
// The request explicitly includes the published hip illustrations even though
// these are attached to the skeletal module, not this module's lesson list.
for (const id of ['asset-skeletal-atlas-hip-bone', 'asset-servier-pelvis']) add(id, 'explicit-request:hip');
const assets = [...uses].map(([id, uses]) => ({ ...content.assets.find(a => a.id === id), uses }));
const phase = process.argv.includes('--after') ? 'after' : 'before';
writeFileSync(join(out, `inventory-${phase}.json`), JSON.stringify(assets, null, 2));
const identity = JSON.stringify({
  modules: content.modules.map(m => [m.id, m.lessons?.map(l => l.id)]),
  questions: content.questions.map(({ hotspots, ...q }) => q), sources: content.sources,
});
writeFileSync(join(out, `identity-${phase}.json`), identity);
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
assets.forEach((a, i) => {
  const png = readFileSync(join(root, a.localAssetPath));
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  const w = 1000, h = w * height / width;
  const labels = a.labels?.length ? a.labels : a.hotspots ?? [];
  const legend = labels.map((p, n) => {
    const name = p.displayLabel ?? content.structures.find(s => s.id === p.structureId)?.canonicalName ?? p.structureId;
    return `<circle cx="${p.x * w}" cy="${p.y * h}" r="10" fill="#fff" stroke="#a31e18" stroke-width="2"/><text x="${p.x * w}" y="${p.y * h + 5}" text-anchor="middle" font-size="13" fill="#111">${n + 1}</text><text x="1020" y="${50 + n * 38}" font-size="17">${n + 1}. ${esc(name)}</text>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1420" height="${Math.ceil(Math.max(h, labels.length * 38 + 75))}" style="font-family:DejaVu Sans"><rect width="100%" height="100%" fill="#fff"/><image width="${w}" height="${h}" href="data:image/png;base64,${png.toString('base64')}"/>${legend}</svg>`;
  const base = join(out, `${String(i + 1).padStart(2, '0')}-${phase}`);
  writeFileSync(`${base}.svg`, svg);
  execFileSync('convert', ['-background', 'white', `${base}.svg`, `${base}.png`]);
  console.log(i + 1, a.id, labels.length, `${width}x${height}`, createHash('sha256').update(png).digest('hex'));
});
