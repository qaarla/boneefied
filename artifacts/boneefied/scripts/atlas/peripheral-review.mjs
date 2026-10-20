// Audit assigned nerve plates, including regional CN/skin views, not a phantom module.
import { content } from '../../content/canonical.ts';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { peripheralAtlasAssetIds } from '../../content/peripheral-atlas-corrections.ts';

const senses = process.argv.includes('--senses');
const endocrine = process.argv.includes('--endocrine');
const cardiovascular = process.argv.includes('--cardiovascular');
const vessels = process.argv.includes('--vessels');
const sensesModule = content.modules.find(m => m.id === (vessels ? 'blood-vessels' : cardiovascular ? 'cardiovascular-system' : endocrine ? 'endocrine-system' : 'special-senses'));
const ids = senses || endocrine || cardiovascular || vessels ? [...new Set([
  ...sensesModule.lessons.flatMap(l => l.assetIds ?? []),
  ...content.questions.filter(q => q.moduleId === sensesModule.id).map(q => q.assetId).filter(Boolean),
])] : peripheralAtlasAssetIds;
const root = fileURLToPath(new URL('../../', import.meta.url));
const out = join(root, `../../generated-artifacts/atlas-${vessels ? 'vessels' : cardiovascular ? 'cardiovascular' : endocrine ? 'endocrine' : senses ? 'senses' : 'peripheral'}-repair`);
mkdirSync(out, { recursive: true });
const phase = process.argv.includes('--after') ? 'after' : 'before';
const sha = data => createHash('sha256').update(data).digest('hex');
const assets = ids.map(id => {
  const a = content.assets.find(a => a.id === id);
  if (!a) throw Error(`Missing actual published plate: ${id}`);
  const owners = content.modules.flatMap(m => (m.lessons ?? [])
    .filter(l => l.assetIds?.includes(id)).map(l => ({ moduleId: m.id, lessonId: l.id })));
  const questions = content.questions.filter(q => q.assetId === id).map(q => q.id);
  if (!owners.length && !questions.length) throw Error(`Unpublished plate: ${id}`);
  return { ...a, owners, questions, sourceSha256: sha(readFileSync(join(root, a.localAssetPath))) };
});
writeFileSync(join(out, `inventory-${phase}.json`), JSON.stringify(assets, null, 2));
writeFileSync(join(out, `identity-${phase}.json`), JSON.stringify(content));
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
assets.forEach((a, i) => {
  const raw = readFileSync(join(root, a.localAssetPath));
  const [width, height] = execFileSync('identify', ['-format', '%w %h', join(root, a.localAssetPath)], { encoding: 'utf8' }).split(' ').map(Number);
  const labels = a.labels ?? a.hotspots ?? [], w = 1050, h = w * height / width;
  let legendY = 28;
  const legend = labels.map((p, n) => {
    const name = p.displayLabel ?? content.structures.find(s => s.id === p.structureId)?.canonicalName ?? p.structureId;
    const lines = [''];
    for (const word of `${n + 1}. ${name}`.split(' ')) {
      if (lines.at(-1).length + word.length > 45) lines.push('');
      lines[lines.length - 1] += `${lines.at(-1) ? ' ' : ''}${word}`;
    }
    const text = lines.map((line, i) => `<text x="1070" y="${legendY + i * 18}" font-size="14">${esc(line)}</text>`).join('');
    legendY += lines.length * 18 + 8;
    return `<circle cx="${p.x * w}" cy="${p.y * h}" r="7" fill="white" stroke="#a31e18" stroke-width="1.5"/><text x="${p.x * w}" y="${p.y * h + 4}" text-anchor="middle" font-size="10">${n + 1}</text>${text}`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1470" height="${Math.ceil(Math.max(h, legendY + 20))}" style="font-family:DejaVu Sans"><rect width="100%" height="100%" fill="white"/><image width="${w}" height="${h}" href="data:image/png;base64,${raw.toString('base64')}"/>${legend}</svg>`;
  const base = join(out, `${String(i + 1).padStart(2, '0')}-${phase}`);
  writeFileSync(`${base}.svg`, svg);
  execFileSync('convert', ['-background', 'white', `${base}.svg`, `${base}.png`], { stdio: 'ignore' });
  console.log(i + 1, a.id, labels.length, `${width}x${height}`);
});
console.log('Total:', assets.length, 'visuals,', assets.reduce((n, a) => n + (a.labels ?? a.hotspots ?? []).length, 0), 'targets');
