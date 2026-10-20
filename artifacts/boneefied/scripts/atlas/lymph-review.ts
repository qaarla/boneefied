// @ts-nocheck — source/target inspection evidence, not an app build.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { content } from '../../content/canonical.ts';
import { combinedAtlasAssetsForStructure } from '../../content/atlas-index.ts';

const phase = process.argv[2] ?? 'before';
const moduleId = process.argv[3] ?? 'lymphatic-system';
const group = moduleId === 'male-reproductive' ? 'male' : moduleId === 'urinary-system' ? 'urinary' : moduleId === 'digestive-system' ? 'digestive' : moduleId === 'respiratory-system' ? 'resp' : 'lymph';
const dir = path.resolve(`generated-artifacts/atlas-${group}-repair`);
fs.mkdirSync(dir, { recursive: true });
const root = path.resolve('artifacts/boneefied');
const mod = content.modules.find(m => m.id === moduleId);
const structures = content.structures.filter(s => s.moduleId === mod.id);
const ids = new Set([
  ...mod.lessons.flatMap(l => l.assetIds ?? []),
  ...content.questions.filter(q => q.moduleId === mod.id).map(q => q.assetId).filter(Boolean),
  ...structures.flatMap(s => combinedAtlasAssetsForStructure(s.id).map(a => a.id)),
]);
const rows = content.assets.filter(a => ids.has(a.id)).map(a => {
  const file = path.join(root, a.localAssetPath);
  const bytes = fs.readFileSync(file);
  const [width, height] = execFileSync('identify', ['-format', '%w %h', file], { encoding: 'utf8' }).trim().split(' ').map(Number);
  const mime = bytes[0] === 0xff && bytes[1] === 0xd8 ? 'image/jpeg' : 'image/png';
  const labels = a.labels ?? a.hotspots ?? [];
  const name = p => p.displayLabel ?? content.structures.find(s => s.id === p.structureId)?.canonicalName ?? p.structureId;
  const scaledH = 900 * height / width;
  const marks = labels.map((p, i) => `<circle cx="${p.x * 900}" cy="${52 + p.y * scaledH}" r="4" fill="#e02020" stroke="white"/><text x="${p.x * 900 + 6}" y="${52 + p.y * scaledH - 5}" font-size="15" stroke="white" stroke-width="3" paint-order="stroke">${i + 1}</text>`).join('');
  const legend = labels.map((p, i) => `<text x="918" y="${80 + i * 24}" font-size="15">${i + 1}. ${name(p).replaceAll('&', '&amp;')}</text>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="${Math.max(52 + scaledH, 100 + labels.length * 24) + 20}" font-family="DejaVu Sans"><rect width="100%" height="100%" fill="white"/><text x="10" y="25" font-size="19">${a.id}</text><image x="0" y="52" width="900" height="${scaledH}" href="data:${mime};base64,${bytes.toString('base64')}"/>${marks}${legend}</svg>`;
  const out = path.join(dir, `${phase}-${a.id}`);
  fs.writeFileSync(out + '.svg', svg);
  execFileSync('convert', ['-background', 'white', out + '.svg', out + '.png']);
  return { id: a.id, title: a.title, localAssetPath: a.localAssetPath, width, height, sourceSha256: createHash('sha256').update(bytes).digest('hex'), type: a.assetType, description: a.description, labels: labels.map((p, i) => ({ number: i + 1, name: name(p), ...p })), questions: content.questions.filter(q => q.assetId === a.id).map(q => ({ id: q.id, taskType: q.taskType })) };
});
fs.writeFileSync(path.join(dir, `inventory-${phase}.json`), JSON.stringify(rows, null, 2));
if (phase === 'before') fs.writeFileSync(path.join(dir, 'identity-before.json'), JSON.stringify(content));
console.log(JSON.stringify({ plates: rows.length, targets: rows.reduce((n, a) => n + a.labels.length, 0), structures: structures.length, assets: rows.map(a => ({ id: a.id, targets: a.labels.length, questions: a.questions.length })) }, null, 2));
