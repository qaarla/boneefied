// @ts-nocheck — local per-plate evidence, never an app build.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { content } from '../../content/canonical.ts';
import { buildVisualAudit, rightsGroup } from './bvis07-audit.ts';
import { overlayFrame } from './bvr02-audit.ts';
import { repair5Targets, repair5ArtworkLimitations } from '../../content/repair5-targets.ts';
import { circleIntersectsRect } from '../../components/viewerMarkerLayout.ts';

const root = path.resolve(import.meta.dirname, '../..');
const output = path.resolve(root, '../../generated-artifacts/repair5');
fs.mkdirSync(output, { recursive: true });
const escape = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const active = new Set(buildVisualAudit().inventory.filter(a => a.active).map(a => a.id));
const assets = content.assets.filter(a => active.has(a.id));
const only = process.argv[2];
const rows = [];
for (const [index, asset] of assets.entries()) {
  if (only && asset.id !== only) continue;
  const bytes = fs.readFileSync(path.join(root, asset.localAssetPath));
  const [iw, ih] = execFileSync('identify', ['-format', '%w %h', path.join(root, asset.localAssetPath)]).toString().split(' ').map(Number);
  const data = `data:image/${/\.jpe?g$/i.test(asset.localAssetPath) ? 'jpeg' : 'png'};base64,${bytes.toString('base64')}`;
  const points = asset.labels?.length ? asset.labels : asset.hotspots ?? [];
  const qVariants = content.questions.filter(q => q.assetId === asset.id && q.hotspots?.length).map(q => ({ question: q.id, points: q.hotspots }));
  const name = p => p.displayLabel ?? content.structures.find(s => s.id === p.structureId)?.canonicalName ?? p.structureId;
  const file = `${String(index + 1).padStart(3, '0')}-${asset.id}`;
  const targetMarks = points.map((p, i) => {
    const x = p.x * 900, y = p.y * (900 * ih / iw) + 52;
    return `<circle cx="${x}" cy="${y}" r="4" fill="#FF2020" stroke="white" stroke-width="1"/><text x="${x + 6}" y="${y - 5}" font-size="15" font-weight="bold" stroke="white" stroke-width="3" paint-order="stroke">${i + 1}</text>`;
  }).join('');
  const legend = points.map((p, i) => `<text x="918" y="${79 + i * 23}" font-size="15">${i + 1}. ${escape(name(p))}</text>`).join('');
  const h = Math.max(52 + 900 * ih / iw, 90 + points.length * 23) + 30;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1390" height="${h}" font-family="DejaVu Sans"><rect width="100%" height="100%" fill="white"/><text x="12" y="23" font-size="19">${index + 1}. ${escape(asset.id)}</text><image x="0" y="52" width="900" height="${900 * ih / iw}" href="${data}"/>${targetMarks}${legend}</svg>`;
  fs.writeFileSync(path.join(output, file + '.svg'), svg);
  execFileSync('convert', ['-background', 'white', path.join(output, file + '.svg'), path.join(output, file + '.png')], { maxBuffer: 1e6 });
  const variants = [];
  const uniqueQuestions = [...new Map(qVariants.map(q => [JSON.stringify(q.points), q])).values()];
  const groups = [{ kind: 'asset', points }, ...uniqueQuestions.map(q => ({ kind: q.question, points: q.points }))];
  for (const group of groups) for (const width of [239, 301, 348]) for (const scale of [1, 2.8]) for (const practice of group.kind === 'asset' ? [false, true] : [true]) {
    const frame = overlayFrame({ ...asset, imageAspectRatio: iw / ih }, group.points, width, scale, practice);
    const bubbles = frame.callouts.map((p, i) => {
      const a = frame.anchors[i];
      return `<line x1="${a.x}" y1="${a.y}" x2="${p.x}" y2="${p.y}" stroke="#BD5018" stroke-width="1" opacity=".6"/><circle cx="${a.x}" cy="${a.y}" r="2" fill="#BD5018"/><circle cx="${p.x}" cy="${p.y}" r="${frame.paint.diameter / 2}" fill="#BD5018"/><text x="${p.x}" y="${p.y}" dominant-baseline="central" text-anchor="middle" font-family="DejaVu Sans" font-size="${frame.paint.numeralSize}" fill="white">${i + 1}</text>`;
    }).join('');
    const phone = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${frame.height}"><rect width="100%" height="100%" fill="white"/><image x="${frame.box.x}" y="${frame.box.y}" width="${frame.box.width}" height="${frame.box.height}" href="${data}"/>${bubbles}</svg>`;
    if (group.kind === 'asset' && width === 301 && scale === 1 && !practice) {
      fs.writeFileSync(path.join(output, file + '-phone.svg'), phone);
      execFileSync('convert', [path.join(output, file + '-phone.svg'), path.join(output, file + '-phone.png')]);
    }
    let collisions = 0, clipped = 0, protectedCovers = 0, escapedLeaders = 0, tinyNumerals = frame.paint.numeralSize < 10;
    const avoid = (asset.hotspotOverlayAvoidRects ?? []).map(r => ({ left: frame.box.x + r.x * frame.box.width, top: frame.box.y + r.y * frame.box.height, width: r.width * frame.box.width, height: r.height * frame.box.height }));
    frame.callouts.forEach((p, i) => {
      const radius = frame.paint.diameter / 2 + frame.paint.borderWidth / 2;
      if (p.x - radius < 0 || p.x + radius > width || p.y - radius < 0 || p.y + radius > frame.height) clipped++;
      for (const q of frame.callouts.slice(i + 1)) if (Math.hypot(p.x - q.x, p.y - q.y) < radius * 2) collisions++;
      for (const r of avoid) if (circleIntersectsRect(p, frame.paint.diameter / 2, r)) protectedCovers++;
      const anchor = frame.anchors[i];
      if (anchor.x < 0 || anchor.x > width || anchor.y < 0 || anchor.y > frame.height) escapedLeaders++;
    });
    variants.push({ kind: group.kind, width, scale, practice, height: frame.height, diameter: frame.paint.diameter, collisions, clipped, protectedCovers, escapedLeaders, tinyNumerals });
  }
  rows.push({ index: index + 1, id: asset.id, source: asset.sourceId, group: rightsGroup(asset), dimensions: [iw, ih], imageSha256: createHash('sha256').update(bytes).digest('hex'), points: points.map((p, i) => ({ number: i + 1, ...p })), questionVariants: qVariants, variants, reviewFile: file + '.png' });
}
if (only) {
  const previous = JSON.parse(fs.readFileSync(path.join(output, 'inventory.json'), 'utf8'));
  const replacements = new Map(rows.map(r => [r.id, r]));
  rows.splice(0, rows.length, ...previous.map(r => replacements.get(r.id) ?? r));
}
fs.writeFileSync(path.join(output, 'inventory.json'), JSON.stringify(rows, null, 2));
const report = { plates: rows.length, original: rows.filter(r => r.group === 'originalBoneefiedVectors').length, targets: rows.reduce((n, a) => n + a.points.length, 0), questions: rows.reduce((n, a) => n + a.questionVariants.length, 0), geometricCases: rows.reduce((n, a) => n + a.variants.length, 0), correctedDiagrams: Object.keys(repair5Targets).length, correctionRules: Object.values(repair5Targets).flat().length, artworkLimitations: repair5ArtworkLimitations, problems: rows.filter(r => r.variants.some(v => v.collisions || v.clipped || v.protectedCovers || v.escapedLeaders || v.tinyNumerals)).map(r => r.id) };
fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
