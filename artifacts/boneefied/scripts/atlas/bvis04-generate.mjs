// BVIS04 original matte atlas generator. Run: node scripts/atlas/bvis04-generate.mjs [key ...]
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Scene, W, H } from './bvis04-lib.mjs';
import { plates as nerv } from './bvis04-nervous.mjs';
import { plates as sens } from './bvis04-senses.mjs';
import { plates as skin } from './bvis04-skin.mjs';
import { plates as tiss } from './bvis04-tissue.mjs';
import { plates as nailp } from './bvis04-nail.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outRel = 'assets/images/anatomy/bvis04-atlas';
const outDir = join(root, outRel);
mkdirSync(outDir, { recursive: true });
const sha = (b) => createHash('sha256').update(b).digest('hex');
// The canonical contract ({modules[{id,lessons[{id,structureIds}]}], structures[{id,name,moduleId}]}) is a snapshot of the
// app's canonical anatomy IDs taken for BVIS04 (stored beside this script, not regenerated here). Pins are validated against it.
const contract = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'bvis04-anatomy-contract.json'), 'utf8'));
const canon = new Map(contract.structures.map((s) => [s.id, s]));
const only = process.argv.slice(2);
const all = [...nerv, ...sens, ...skin, ...tiss, ...nailp];
const problems = [], warns = [], prov = [], gen = [];
const refs = [
  'https://openstax.org/books/anatomy-and-physiology-2e (text-only factual cross-check; no OpenStax illustration used)',
  'https://www.ncbi.nlm.nih.gov/books/NBK10799/ (Neuroscience, 2nd ed., NCBI Bookshelf - text-only)',
  'https://www.ncbi.nlm.nih.gov/books/NBK546599/ (StatPearls anatomy chapters - text-only)',
  'Standring S, ed. Gray\'s Anatomy: The Anatomical Basis of Clinical Practice, 42nd ed. (textbook facts only; no figures reproduced)',
  'Mescher AL. Junqueira\'s Basic Histology, 16th ed. (textbook facts for tissue morphology; schematics are original)',
];

all.forEach((p, i) => {
  if (only.length && !only.includes(p.key)) return;
  const S = new Scene(p.key);
  p.draw(S);
  const base = `bvis04-${String(i + 1).padStart(2, '0')}-${p.key}`;
  const svgRel = `${outRel}/${base}.svg`, pngRel = `${outRel}/${base}.png`;
  writeFileSync(join(root, svgRel), S.svg());
  execFileSync('convert', ['-density', '96', '-background', '#ECEAE2', join(root, svgRel), '-resize', `${W}x${H}!`, join(root, pngRel)], { stdio: 'ignore' });
  const idp = `/tmp/b4-id-${p.key}`;
  writeFileSync(`${idp}.svg`, S.idsvg());
  execFileSync('convert', ['-density', '96', `${idp}.svg`, '-filter', 'point', '-resize', `${W}x${H}!`, `${idp}.png`]);
  const raw = execFileSync('convert', [`${idp}.png`, '-depth', '8', 'rgb:-'], { maxBuffer: 1 << 28 });
  const G = 2, gw = Math.floor(W / G), gh = Math.floor(H / G);
  const colAt = (gx, gy) => { const o = (gy * G * W + gx * G) * 3; return ((raw[o] << 16) | (raw[o + 1] << 8) | raw[o + 2]); };
  const distCache = new Map();
  const distFor = (key) => {
    if (distCache.has(key)) return distCache.get(key);
    const wants = new Set(key.split('+').map((k) => parseInt(S.hex(k).slice(1), 16))), d = new Float32Array(gw * gh); let cnt = 0;
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) { if (wants.has(colAt(x, y))) { d[y * gw + x] = 1e6; cnt++; } }
    if (!cnt) { distCache.set(key, null); return null; }
    const a = 1, b = 1.4142;
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) { const k = y * gw + x; if (!d[k]) continue; let v = d[k];
      v = Math.min(v, (x ? d[k - 1] : 0) + a, (y ? d[k - gw] : 0) + a, (x && y ? d[k - gw - 1] : 0) + b, (y && x < gw - 1 ? d[k - gw + 1] : 0) + b); d[k] = v; }
    for (let y = gh - 1; y >= 0; y--) for (let x = gw - 1; x >= 0; x--) { const k = y * gw + x; if (!d[k]) continue; let v = d[k];
      v = Math.min(v, (x < gw - 1 ? d[k + 1] : 0) + a, (y < gh - 1 ? d[k + gw] : 0) + a, (x < gw - 1 && y < gh - 1 ? d[k + gw + 1] : 0) + b, (x && y < gh - 1 ? d[k + gw - 1] : 0) + b); d[k] = v; }
    for (let k = 0; k < d.length; k++) d[k] *= G; // px
    distCache.set(key, d); return d;
  };
  const items = [];
  S.pins.forEach((pn) => {
    if (!canon.has(pn.structureId)) { problems.push(`${p.key}: non-canonical id ${pn.structureId}`); return; }
    const d = distFor(pn.key);
    if (!d) { problems.push(`${p.key}:${pn.structureId} shape '${pn.key}' fully hidden or missing`); return; }
    let dmax = 0, best = null; for (let k = 0; k < d.length; k++) if (d[k] > dmax) { dmax = d[k]; if (!pn.hint) best = k; }
    if (pn.hint) {
      const thr = Math.min(dmax * 0.6, 7); let bd = 1e12;
      for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) { const v = d[y * gw + x]; if (v >= thr) { const dd = (x * G - pn.hint[0]) ** 2 + (y * G - pn.hint[1]) ** 2; if (dd < bd) { bd = dd; best = y * gw + x; } } }
      if (Math.sqrt(bd) > 40) warns.push(`${p.key}:${pn.structureId} hint moved ${Math.round(Math.sqrt(bd))}px`);
    }
    const px = [(best % gw) * G, Math.floor(best / gw) * G];
    items.push({ structureId: pn.structureId, x: Math.round((px[0] / W) * 10000) / 10000, y: Math.round((px[1] / H) * 10000) / 10000, radius: pn.radius, panel: pn.panel, px, key: pn.key, interior: Math.round(d[best]) });
  });
  items.forEach((a, ia) => items.forEach((b, ib) => { if (ib > ia && Math.hypot(a.px[0] - b.px[0], a.px[1] - b.px[1]) < 38) warns.push(`${p.key}: pins ${a.structureId}/${b.structureId} only ${Math.round(Math.hypot(a.px[0] - b.px[0], a.px[1] - b.px[1]))}px apart`); }));
  const ids = items.map((x) => x.structureId + '|' + x.panel); if (new Set(ids).size !== ids.length) problems.push(`${p.key}: duplicate id within panel`);
  const id = p.replaces ?? `asset-bvis04-${p.key}`;
  prov.push({ id, plate: i + 1, moduleId: p.moduleId, teachingKind: p.kind, disposition: p.replaces ? 'replacement' : 'addition', preservesReplacedId: p.replaces, creator: 'Boneefied', rights: 'Original work by Boneefied, all rights retained; no third-party illustration imported, traced or reproduced.',
    svgPath: svgRel, pngPath: pngRel, notice: 'Original authorship: drawn from scratch by scripts/atlas/bvis04-*.mjs. References consulted for textbook anatomical facts only.',
    references: refs.map((u) => ({ source: u, use: 'text-only factual reference; no images imported' })), purpose: p.purpose, orientation: p.orientation[0], dimensions: { width: W, height: H, aspectRatio: W / H },
    histologyNotice: p.kind === 'tissue-schematic' ? 'Explicit schematic drawing; not a photomicrograph and not traced from one.' : undefined,
    featureAnchorMapping: items.map((it) => ({ structureId: it.structureId, x: it.x, y: it.y, radius: it.radius, panel: it.panel, shapeKey: it.key, ownColourInteriorPx: it.interior, verifiedOnIdMap: true })),
    sha256: { svg: sha(readFileSync(join(root, svgRel))), png: sha(readFileSync(join(root, pngRel))) } });
  gen.push({ id, key: p.key, replaces: p.replaces ?? null, moduleId: p.moduleId, teachingKind: p.kind, svgPath: svgRel, pngPath: pngRel, title: p.title, description: p.desc, orientation: p.orientation[0], orientationEs: p.orientation[1], purpose: p.purpose, lessons: p.lessons, labels: items.map(({ structureId, x, y, radius, panel }) => ({ structureId, x, y, radius, panel })) });
  console.log('ok', base, items.length, 'pins');
});
if (!only.length) {
  writeFileSync(join(outDir, 'provenance.json'), JSON.stringify({ pack: 'boneefied-bvis04-neuro-senses-skin-tissue', generatedBy: 'scripts/atlas/bvis04-generate.mjs', plates: prov }, null, 2) + '\n');
  writeFileSync(join(root, 'content/bvis04-plates.generated.ts'), `// GENERATED by scripts/atlas/bvis04-generate.mjs - do not edit by hand.\nexport interface Bvis04PlateLabel { structureId: string; x: number; y: number; radius: number; panel: string }\nexport interface Bvis04Plate { id: string; key: string; replaces: string | null; moduleId: string; teachingKind: 'gross-diagram' | 'tissue-schematic'; svgPath: string; pngPath: string; title: [string, string]; description: [string, string]; orientation: string; orientationEs: string; purpose: string; lessons: string[]; labels: Bvis04PlateLabel[] }\nexport const bvis04Plates: Bvis04Plate[] = ${JSON.stringify(gen, null, 2)};\n`);
  writeFileSync(join(root, 'content/bvis04-image-sources.generated.ts'), `// GENERATED by scripts/atlas/bvis04-generate.mjs - do not edit by hand.\nexport const bvis04ImageSources: Record<string, number> = {\n${gen.map((g) => `  '${g.id}': require('@/${g.pngPath}'),`).join('\n')}\n};\n`);
}
console.log('plates', all.length, 'problems', problems.length, 'warnings', warns.length);
problems.forEach((x) => console.log('PROBLEM', x)); warns.forEach((x) => console.log('warn', x));
