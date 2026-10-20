import { content } from '../../content/canonical.ts';
import { combinedAtlasAssetsForStructure } from '../../content/atlas-index.ts';
import { bvis04Plates } from '../../content/bvis04-plates.generated.ts';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../../', import.meta.url));
const out = join(root, '../../generated-artifacts/atlas-nervous-repair');
mkdirSync(out, { recursive: true });
const module = content.modules.find(m => m.id === 'nervous-system');
const uses = new Map();
const add = (id, use) => { if (id) uses.set(id, [...uses.get(id) ?? [], use]); };
for (const l of module.lessons) for (const id of l.assetIds ?? []) add(id, `lesson:${l.id}`);
for (const q of content.questions.filter(q => q.moduleId === module.id)) add(q.assetId, `question:${q.id}`);
for (const s of content.structures.filter(s => s.moduleId === module.id))
  for (const a of combinedAtlasAssetsForStructure(s.id)) add(a.id, `glossary:${s.id}`);
// Explicitly requested neurological tissue view, without auditing other tissue systems.
const tissue = bvis04Plates.find(p => p.key === 'nervous-tissue');
add(tissue.id, 'associated:nervous-tissue');
const assets = [...uses].map(([id, uses]) => {
  const a = content.assets.find(a => a.id === id);
  const questions = content.questions.filter(q => q.assetId === id);
  return { ...a, uses, questions: questions.map(q => ({
    id: q.id, taskType: q.taskType, structureIds: q.structureIds, hotspots: q.hotspots,
  })) };
});
const phase = process.argv.includes('--after') ? 'after' : 'before';
writeFileSync(join(out, `inventory-${phase}.json`), JSON.stringify(assets, null, 2));
writeFileSync(join(out, `identity-${phase}.json`), JSON.stringify({
  modules: content.modules, questions: content.questions, sources: content.sources,
  assets: content.assets,
}));
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
assets.forEach((a, i) => {
  const image = readFileSync(join(root, a.localAssetPath));
  const [width, height] = execFileSync('identify', ['-format', '%w %h', join(root, a.localAssetPath)], { encoding: 'utf8' }).split(' ').map(Number);
  const labels = a.labels?.length ? a.labels : a.hotspots ?? [];
  const w = 1050, h = w * height / width;
  const legend = labels.map((p, n) => {
    const name = p.displayLabel ?? content.structures.find(s => s.id === p.structureId)?.canonicalName ?? p.structureId;
    return `<circle cx="${p.x * w}" cy="${p.y * h}" r="7" fill="white" stroke="#a31e18" stroke-width="1.5"/><text x="${p.x * w}" y="${p.y * h + 4}" text-anchor="middle" font-size="10">${n + 1}</text><text x="1070" y="${28 + n * 26}" font-size="15">${n + 1}. ${esc(name)}</text>`;
  }).join('');
  const mime = a.localAssetPath.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1470" height="${Math.ceil(Math.max(h, labels.length * 26 + 40))}" style="font-family:DejaVu Sans"><rect width="100%" height="100%" fill="white"/><image width="${w}" height="${h}" href="data:${mime};base64,${image.toString('base64')}"/>${legend}</svg>`;
  const base = join(out, `${String(i + 1).padStart(2, '0')}-${phase}`);
  writeFileSync(`${base}.svg`, svg);
  execFileSync('convert', ['-background', 'white', `${base}.svg`, `${base}.png`]);
  console.log(i + 1, a.id, labels.length, `${width}x${height}`, createHash('sha256').update(image).digest('hex'));
});
