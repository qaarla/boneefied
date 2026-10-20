import { content } from '../../content/canonical.ts';
import { combinedAtlasAssetsForStructure } from '../../content/atlas-index.ts';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../../', import.meta.url));
const out = join(root, '../../generated-artifacts/atlas-muscular-repair');
mkdirSync(out, { recursive: true });
const module = content.modules.find(m => m.id === 'muscular-system');
const uses = new Map();
const add = (id, use) => { if (id) uses.set(id, [...uses.get(id) ?? [], use]); };
for (const l of module.lessons) for (const id of l.assetIds ?? []) add(id, `lesson:${l.id}`);
for (const q of content.questions.filter(q => q.moduleId === module.id)) add(q.assetId, `question:${q.id}`);
for (const s of content.structures.filter(s => s.moduleId === module.id))
  for (const a of combinedAtlasAssetsForStructure(s.id)) add(a.id, `glossary:${s.id}`);
const assets = [...uses].map(([id, uses]) => ({ ...content.assets.find(a => a.id === id), uses }));
const phase = process.argv.includes('--after') ? 'after' : 'before';
writeFileSync(join(out, `inventory-${phase}.json`), JSON.stringify(assets, null, 2));
writeFileSync(join(out, `identity-${phase}.json`), JSON.stringify({
  modules: content.modules.map(m => [m.id, m.lessons?.map(l => l.id)]),
  questions: content.questions.map(({ hotspots, ...q }) => q), sources: content.sources,
}));
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
assets.forEach((a, i) => {
  const png = readFileSync(join(root, a.localAssetPath));
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  const w = 1000, h = w * height / width;
  const labels = a.labels?.length ? a.labels : a.hotspots ?? [];
  const legend = labels.map((p, n) => {
    const name = p.displayLabel ?? content.structures.find(s => s.id === p.structureId)?.canonicalName ?? p.structureId;
    return `<circle cx="${p.x * w}" cy="${p.y * h}" r="8" fill="#fff" stroke="#a31e18" stroke-width="1.5"/><text x="${p.x * w}" y="${p.y * h + 4}" text-anchor="middle" font-size="11" fill="#111">${n + 1}</text><text x="1020" y="${32 + n * 28}" font-size="16">${n + 1}. ${esc(name)}</text>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1450" height="${Math.ceil(Math.max(h, labels.length * 28 + 50))}" style="font-family:DejaVu Sans"><rect width="100%" height="100%" fill="#fff"/><image width="${w}" height="${h}" href="data:image/png;base64,${png.toString('base64')}"/>${legend}</svg>`;
  const base = join(out, `${String(i + 1).padStart(2, '0')}-${phase}`);
  writeFileSync(`${base}.svg`, svg);
  execFileSync('convert', ['-background', 'white', `${base}.svg`, `${base}.png`]);
  console.log(i + 1, a.id, labels.length, `${width}x${height}`, createHash('sha256').update(png).digest('hex'));
});
