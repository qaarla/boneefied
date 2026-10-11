// @ts-nocheck — ignored QA rasters, not application assets.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { content } from '../../content/canonical.ts';
import { overlayFrame } from './bvr02-audit.ts';

const phase = process.argv[2] ?? 'after';
const dir = `generated-artifacts/bvr02/${phase}`;
const rows = JSON.parse(fs.readFileSync(`${dir}/inventory.json`, 'utf8'));
fs.mkdirSync(`${dir}/sheets`, { recursive: true });
const run = (args) => execFileSync('magick', args[0] === 'montage'
  ? ['montage', '-limit', 'thread', '1', ...args.slice(1)]
  : ['-limit', 'thread', '1', ...args], { stdio: ['ignore', 'ignore', 'pipe'] });
const pairs = [];
for (let i = 0; i < rows.length; i++) {
  const pair = `${dir}/sheets/pair-${i}.png`;
  if (process.argv.includes('--resume') && fs.existsSync(pair)) {
    try {
      run([pair, 'null:']); // An interrupted render can leave a partial PNG.
      pairs.push(pair); continue;
    } catch { /* Decode failed; regenerate this pair instead of trusting existence. */ }
  }
  const row = rows[i], catalogAsset = content.assets.find(a => a.id === row.id);
  const asset = phase === 'before' ? { ...catalogAsset, hotspotSizeOverride: undefined, hotspotOverlayAvoidRects: undefined } : catalogAsset;
  const points = asset.labels?.length ? asset.labels : asset.hotspots ?? content.questions.find(q => q.assetId === asset.id && q.hotspots?.length)?.hotspots;
  const cells = [];
  for (const mode of ['normal', 'large']) {
    const frame = overlayFrame(asset, points, mode === 'normal' ? 348 : 271, mode === 'normal' ? 1 : 2.8);
    const low = Math.max(0, Math.floor(Math.min(frame.box.y, ...frame.callouts.map(p => p.y - frame.paint.diameter / 2)) - 5));
    const high = Math.ceil(Math.max(frame.box.y + frame.box.height, ...frame.callouts.map(p => p.y + frame.paint.diameter / 2)) + 5);
    const file = `${dir}/sheets/crop-${i}-${mode}.png`;
    run([`${dir}/${row.id}-${mode}.png`, '-crop', `${frame.width}x${high - low}+0+${low}`, '+repage', '-resize', '235x345', '-background', 'white', '-gravity', 'center', '-extent', '235x345', file]);
    cells.push(file);
  }
  run([...cells, '+append', '-gravity', 'south', '-background', 'white', '-splice', '0x28', '-font', 'DejaVu-Sans', '-pointsize', '11', '-fill', 'black', '-annotate', '+0+6', `${i + 1} ${row.id.replace('asset-', '')} | n${row.markerCount}`, pair]);
  pairs.push(pair);
}
for (let i = 0; i < pairs.length; i += 9) {
  run(['montage', ...pairs.slice(i, i + 9), '+set', 'label', '-font', 'DejaVu-Sans', '-tile', '3x3', '-geometry', '470x373+3+3', '-background', '#888', `${dir}/sheets/sheet-${Math.floor(i / 9) + 1}.jpg`]);
}
console.log(`${Math.ceil(pairs.length / 9)} sheets for ${pairs.length} individually identified visuals`);
