// @ts-nocheck — Node-only overlay inspection; no application build or publication.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { content } from '../../content/canonical.ts';
import { buildVisualAudit } from './bvis07-audit.ts';
import { annotationKey, spreadAtlasCallouts } from '../../components/viewerMarkerLayout.ts';
import { markerSizing } from '../../components/viewerMarkerSizing.ts';
import { protectedOverlayHeight } from '../../components/viewerOverlayProtection.ts';

const root = path.resolve(import.meta.dirname, '../..');
const output = path.resolve(root, '../../generated-artifacts/bvr02');
const escape = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

export function overlayFrame(asset, annotations, width, textScale, practice = false) {
  const cell = practice && textScale >= 1.3 ? 60 : 44;
  const columns = Math.max(1, Math.floor(width / (cell + 8)));
  const baseHeight = Math.max(width / 1.45, Math.ceil(annotations.length / Math.min(columns, 2)) * (cell + 8));
  const height = protectedOverlayHeight(annotations, width, baseHeight, cell, cell, asset.imageAspectRatio ?? 1.45, asset.hotspotOverlayAvoidRects ?? [], (asset.hotspotSizeOverride?.maxDiameter ?? 40) / 2);
  const frameRatio = width / height, ratio = asset.imageAspectRatio ?? 1.45;
  const containedWidth = Math.min(1, ratio / frameRatio), containedHeight = Math.min(1, frameRatio / ratio);
  const box = { x: (1 - containedWidth) * width / 2, y: (1 - containedHeight) * height / 2, width: containedWidth * width, height: containedHeight * height };
  const anchors = annotations.map((a) => ({ x: box.x + a.x * box.width, y: box.y + a.y * box.height }));
  const paint = markerSizing(box.width, Math.max(asset.labels?.length ?? 0, annotations.length), textScale, asset.hotspotSizeOverride);
  const avoid = (asset.hotspotOverlayAvoidRects ?? []).map((r) => ({ left: box.x + r.x * box.width, top: box.y + r.y * box.height, width: r.width * box.width, height: r.height * box.height }));
  const callouts = spreadAtlasCallouts(anchors, width, height, cell, cell, 8, { avoid, markerRadius: paint.diameter / 2 });
  return { width, height, cell, box, anchors, paint, callouts };
}

function circleOverlap(a, b, radius) { return Math.hypot(a.x - b.x, a.y - b.y) < radius * 2 - 0.1; }
function getMetrics(frame, pixels) {
  const { callouts, paint, anchors, box } = frame;
  const radius = paint.diameter / 2;
  let overlaps = 0, targetCovers = 0;
  const tissueFractions = callouts.map((point) => {
    let ink = 0, count = 0;
    for (let dy = -Math.ceil(radius); dy <= radius; dy++) for (let dx = -Math.ceil(radius); dx <= radius; dx++) {
      if (dx * dx + dy * dy > radius * radius) continue;
      count++;
      const x = Math.floor(point.x + dx - box.x), y = Math.floor(point.y + dy - box.y);
      if (x < 0 || y < 0 || x >= pixels.width || y >= pixels.height) continue;
      const offset = (y * pixels.width + x) * 3;
      const [r, g, b] = pixels.data.subarray(offset, offset + 3);
      // Colored tissue/ink risk, not a semantic anatomy verdict. Warm panel
      // backgrounds are excluded; flagged plates require visual inspection.
      if (Math.max(r, g, b) - Math.min(r, g, b) > 24 || Math.max(r, g, b) < 155) ink++;
    }
    return Number((ink / Math.max(1, count)).toFixed(3));
  });
  callouts.forEach((p, i) => {
    callouts.slice(i + 1).forEach((q) => { if (circleOverlap(p, q, radius)) overlaps++; });
    anchors.forEach((a) => { if (Math.hypot(p.x - a.x, p.y - a.y) < radius + 3) targetCovers++; });
  });
  return { overlaps, targetCovers, tissueRisk: tissueFractions.filter((n) => n > 0.25).length, tissueFractions };
}

export function markerVisuals() {
  const active = new Set(buildVisualAudit().inventory.filter((a) => a.active).map((a) => a.id));
  return content.assets.filter((a) => active.has(a.id) && (a.labels?.length || a.hotspots?.length || content.questions.some((q) => q.assetId === a.id && q.hotspots?.length)));
}

function inspectVariant(asset, annotations, mode, frame, directory, render) {
  const source = path.join(root, asset.localAssetPath);
  const iw = Math.round(frame.box.width), ih = Math.round(frame.box.height);
  const resized = execFileSync('convert', [source, '-resize', `${iw}x${ih}!`, '-alpha', 'remove', '-depth', '8', 'rgb:-'], { maxBuffer: 8_000_000 });
  const metrics = getMetrics(frame, { width: iw, height: ih, data: resized });
  const mappingHash = createHash('sha256').update(JSON.stringify(annotations.map((a, i) => [i + 1, annotationKey(a), a.radius]))).digest('hex');
  if (render) {
    const ihActual = Math.ceil(frame.height);
    const image = `data:image/${/\\.jpe?g$/i.test(source) ? 'jpeg' : 'png'};base64,${fs.readFileSync(source).toString('base64')}`;
    const elements = frame.callouts.map((p, i) => {
      const a = frame.anchors[i], r = frame.paint.diameter / 2;
      return `<line x1="${a.x}" y1="${a.y}" x2="${p.x}" y2="${p.y}" stroke="#C95618" stroke-width="1" opacity=".65"/><circle cx="${a.x}" cy="${a.y}" r="2" fill="#C95618"/><circle cx="${p.x}" cy="${p.y}" r="${r}" fill="#C95618" stroke="#C95618" stroke-width="1.5"/><text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" font-family="DejaVu Sans" font-size="${frame.paint.numeralSize}" font-weight="bold" fill="white">${i + 1}</text>`;
    }).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${frame.width}" height="${ihActual + 48}"><rect width="100%" height="100%" fill="white"/><image x="${frame.box.x}" y="${frame.box.y}" width="${frame.box.width}" height="${frame.box.height}" xlink:href="${image}"/>${elements}<text x="4" y="${ihActual + 16}" font-family="DejaVu Sans" font-size="10">${escape(asset.id)}</text><text x="4" y="${ihActual + 31}" font-family="DejaVu Sans" font-size="10">${escape(mode)} | n=${annotations.length} | paint=${frame.paint.diameter.toFixed(1)} | risk=${metrics.tissueRisk}</text></svg>`;
    const svgPath = path.join(directory, `${asset.id}-${mode}.svg`);
    fs.writeFileSync(svgPath, svg);
    execFileSync('convert', [svgPath, path.join(directory, `${asset.id}-${mode}.png`)], { maxBuffer: 1_000_000 });
  }
  return { mode, count: annotations.length, mappingHash, paint: frame.paint, canvas: { width: frame.width, height: frame.height }, ...metrics };
}

export function runInspection(label = 'before', render = true) {
  const directory = path.join(output, label);
  fs.mkdirSync(directory, { recursive: true });
  const denseFirst = markerVisuals().map(a => label === 'before'
    ? { ...a, hotspotSizeOverride: undefined, hotspotOverlayAvoidRects: undefined } : a)
    .sort((a, b) => (b.labels?.length ?? 0) - (a.labels?.length ?? 0));
  const rows = denseFirst.map((asset, index) => {
    const labels = asset.labels?.length ? asset.labels : asset.hotspots ?? content.questions.find((q) => q.assetId === asset.id && q.hotspots?.length)?.hotspots ?? [];
    const snapshots = [
      inspectVariant(asset, labels, 'normal', overlayFrame(asset, labels, 348, 1), directory, render),
      inspectVariant(asset, labels, 'large', overlayFrame(asset, labels, 271, 2.8), directory, render),
    ];
    const variants = new Map();
    for (const q of content.questions.filter((q) => q.assetId === asset.id)) {
      const points = q.hotspots ?? (q.taskType === 'hotspot' ? asset.hotspots : undefined);
      if (points?.length) variants.set(JSON.stringify(points), { points, questions: [...(variants.get(JSON.stringify(points))?.questions ?? []), q.id] });
    }
    const questionLayouts = [...variants.values()].map(({ points, questions }) => {
      const frame = overlayFrame(asset, points, 271, 2.8, true);
      const mapped = createHash('sha256').update(JSON.stringify(points)).digest('hex');
      const collisionCount = frame.callouts.reduce((n, p, i) => n + frame.callouts.slice(i + 1).filter((q) => circleOverlap(p, q, frame.paint.diameter / 2)).length, 0);
      return { questions, mappingHash: mapped, count: points.length, collisionCount, paint: frame.paint.diameter };
    });
    if (index % 20 === 0) console.log(`${label}: ${index + 1}/${denseFirst.length} ${asset.id}`);
    return { id: asset.id, title: asset.title, sourcePath: asset.localAssetPath, imageSha256: createHash('sha256').update(fs.readFileSync(path.join(root, asset.localAssetPath))).digest('hex'), markerCount: labels.length, snapshots, questionLayouts, override: asset.hotspotSizeOverride, avoidRects: asset.hotspotOverlayAvoidRects };
  });
  fs.writeFileSync(path.join(directory, 'inventory.json'), JSON.stringify(rows, null, 2));
  console.log(JSON.stringify({ inspected: rows.length, flagged: rows.filter((r) => r.snapshots.some((s) => s.tissueRisk)).map((r) => [r.id, r.snapshots.map((s) => s.tissueRisk)]) }));
  return rows;
}

if (process.argv[1]?.endsWith('bvr02-audit.ts')) runInspection(process.argv[2] ?? 'before', !process.argv.includes('--no-render'));
