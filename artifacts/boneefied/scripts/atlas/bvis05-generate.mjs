// BVIS05 original matte atlas generator. Run: node scripts/atlas/bvis05-generate.mjs [key ...]
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Scene, W, H } from './bvis05-lib.mjs';
import { plates as p1 } from './bvis05-heart.mjs';
import { plates as p2 } from './bvis05-blood.mjs';
import { plates as p3 } from './bvis05-vessels.mjs';
import { plates as p4 } from './bvis05-vessels2.mjs';
import { plates as p5 } from './bvis05-resp.mjs';
import { plates as p6 } from './bvis05-lymph.mjs';
import { plates as p7 } from './bvis05-endo.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const outRel = 'assets/images/anatomy/bvis05-atlas';
const outDir = join(root, outRel);
mkdirSync(outDir, { recursive: true });
const sha = (b) => createHash('sha256').update(b).digest('hex');
// The canonical contract ({modules[{id,lessons[{id,structureIds}]}], structures[{id,name,moduleId}]}) is a snapshot of the
// app's canonical anatomy IDs taken for BVIS05 (stored beside this script, not regenerated here). Pins are validated against it.
const contract = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'bvis05-anatomy-contract.json'), 'utf8'));
const canon = new Map(contract.structures.map((s) => [s.id, s]));
const only = process.argv.slice(2);
const all = [...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7];
const problems = [], warns = [], prov = [], gen = [];
const refs = [
  'LIVE TEXT-ONLY CHECKED (pages directly fetched; no images imported): https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy',
  'LIVE TEXT-ONLY CHECKED (pages directly fetched; no images imported): https://openstax.org/books/anatomy-and-physiology-2e/pages/20-5-circulatory-pathways',
  'LIVE TEXT-ONLY CHECKED (pages directly fetched; no images imported): https://openstax.org/books/anatomy-and-physiology-2e/pages/22-1-organs-and-structures-of-the-respiratory-system',
  'LIVE TEXT-ONLY CHECKED (pages directly fetched; no images imported): https://openstax.org/books/anatomy-and-physiology-2e/pages/21-1-anatomy-of-the-lymphatic-and-immune-systems',
  'LIVE TEXT-ONLY CHECKED (pages directly fetched; no images imported): https://openstax.org/books/anatomy-and-physiology-2e/pages/17-3-the-pituitary-gland-and-hypothalamus',
  'LIVE TEXT-ONLY CHECKED (pages directly fetched; no images imported): https://openstax.org/books/anatomy-and-physiology-2e/pages/17-6-the-adrenal-glands',
  'BIBLIOGRAPHY ONLY (not directly accessed this run): https://training.seer.cancer.gov/anatomy/ (NCI SEER Training anatomy modules)',
  'BIBLIOGRAPHY ONLY (not directly accessed this run): https://www.ncbi.nlm.nih.gov/books/ (NCBI Bookshelf anatomy chapters)',
  'BIBLIOGRAPHY ONLY (not directly accessed this run): Standring S, ed. Gray\'s Anatomy: The Anatomical Basis of Clinical Practice, 42nd ed.',
  'BIBLIOGRAPHY ONLY (not directly accessed this run): Mescher AL. Junqueira\'s Basic Histology, 16th ed.',
];

all.forEach((p, i) => {
  if (only.length && !only.includes(p.key)) return;
  const S = new Scene(p.key);
  p.draw(S);
  const base = `bvis05-${String(i + 1).padStart(2, '0')}-${p.key}`;
  const svgRel = `${outRel}/${base}.svg`, pngRel = `${outRel}/${base}.png`;
  writeFileSync(join(root, svgRel), S.svg());
  execFileSync('convert', ['-density', '96', '-background', '#ECEAE2', join(root, svgRel), '-resize', `${W}x${H}!`, join(root, pngRel)], { stdio: 'ignore' });
  const idp = `${tmpdir()}/b5-id-${p.key}`;
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
  const id = `asset-bvis05-${p.key}`;
  prov.push({ id, plate: i + 1, moduleId: p.moduleId, teachingKind: p.kind, disposition: 'addition', preservesReplacedId: null, creator: 'Boneefied', rights: 'Original work by Boneefied, all rights retained; no third-party illustration imported, traced or reproduced.',
    svgPath: svgRel, pngPath: pngRel, notice: 'Original authorship: drawn from scratch by scripts/atlas/bvis05-*.mjs. Anatomical facts: general anatomical bibliography (not directly accessed this run) plus six OpenStax A&P 2e pages fetched live as text only; see references. No images imported.',
    references: refs.map((u) => ({ source: u, use: 'text-only factual reference; no images imported' })), purpose: p.purpose, orientation: p.orientation[0], dimensions: { width: W, height: H, aspectRatio: W / H },
    histologyNotice: p.kind === 'tissue-schematic' ? 'Explicit schematic drawing; not a photomicrograph and not traced from one.' : undefined,
    featureAnchorMapping: items.map((it) => ({ structureId: it.structureId, x: it.x, y: it.y, radius: it.radius, panel: it.panel, shapeKey: it.key, ownColourInteriorPx: it.interior, verifiedOnIdMap: true })),
    featureMask: { method: 'semantic id-map rendered from the same shape geometry; one unique flat colour per structure key', sha256: sha(readFileSync(`${idp}.png`)), file: null },
    sha256: { svg: sha(readFileSync(join(root, svgRel))), png: sha(readFileSync(join(root, pngRel))) } });
  gen.push({ id, key: p.key, replaces: null, moduleId: p.moduleId, teachingKind: p.kind, svgPath: svgRel, pngPath: pngRel, title: p.title, description: p.desc, orientation: p.orientation[0], orientationEs: p.orientation[1], purpose: p.purpose, lessons: p.lessons, labels: items.map(({ structureId, x, y, radius, panel }) => ({ structureId, x, y, radius, panel })) });
  console.log('ok', base, items.length, 'pins');
});
if (!only.length) {
  writeFileSync(join(outDir, 'provenance.json'), JSON.stringify({ pack: 'boneefied-bvis05-cardio-vessels-respiratory-lymphatic-endocrine', generatedBy: 'scripts/atlas/bvis05-generate.mjs', plates: prov }, null, 2) + '\n');
  writeFileSync(join(root, 'content/bvis05-plates.generated.ts'), `// GENERATED by scripts/atlas/bvis05-generate.mjs - do not edit by hand.\nexport interface Bvis05PlateLabel { structureId: string; x: number; y: number; radius: number; panel: string }\nexport interface Bvis05Plate { id: string; key: string; replaces: string | null; moduleId: string; teachingKind: 'gross-diagram' | 'tissue-schematic'; svgPath: string; pngPath: string; title: [string, string]; description: [string, string]; orientation: string; orientationEs: string; purpose: string; lessons: string[]; labels: Bvis05PlateLabel[] }\nexport const bvis05Plates: Bvis05Plate[] = ${JSON.stringify(gen, null, 2)};\n`);
  writeFileSync(join(root, 'content/bvis05-image-sources.generated.ts'), `// GENERATED by scripts/atlas/bvis05-generate.mjs - do not edit by hand.\nexport const bvis05ImageSources: Record<string, number> = {\n${gen.map((g) => `  '${g.id}': require('@/${g.pngPath}'),`).join('\n')}\n};\n`);
}
console.log('plates', all.length, 'problems', problems.length, 'warnings', warns.length);
problems.forEach((x) => console.log('PROBLEM', x)); warns.forEach((x) => console.log('warn', x));
