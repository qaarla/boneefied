// Rasterize the approved vector artwork at 2x, without regenerating anatomy or
// moving semantic anchors. SVG coordinates remain the logical coordinate system.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

export const ATLAS_EXPORT_SCALE = 2;
export function renderAtlasPng(svgPath, pngPath, width, height, background = '#ECEAE2') {
  execFileSync('magick', [
    '-density', String(96 * ATLAS_EXPORT_SCALE), '-background', background, svgPath,
    '-resize', `${width * ATLAS_EXPORT_SCALE}x${height * ATLAS_EXPORT_SCALE}!`,
    '-strip', pngPath,
  ], { stdio: 'pipe' });
}

const sha = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
export function exportApprovedAtlas() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const assets = join(root, 'assets/images/anatomy');
  let count = 0;
  for (const dir of ['atlas', 'skeletal-atlas', 'muscular-atlas', 'bvis04-atlas', 'bvis05-atlas', 'bvis06-atlas', 'foundations-corrections']) {
    const folder = join(assets, dir);
    for (const name of readdirSync(folder).filter((n) => n.endsWith('.svg'))) {
      const svgPath = join(folder, name);
      const pngPath = join(dir === 'foundations-corrections' ? assets : folder, name.replace(/\.svg$/, '.png'));
      if (!existsSync(pngPath)) throw new Error(`Missing published raster: ${pngPath}`);
      const svg = readFileSync(svgPath, 'utf8');
      const viewBox = svg.match(/viewBox=["']0 0 ([\d.]+) ([\d.]+)["']/);
      const width = Number(viewBox?.[1] ?? svg.match(/\bwidth=["']([\d.]+)["']/)?.[1]);
      const height = Number(viewBox?.[2] ?? svg.match(/\bheight=["']([\d.]+)["']/)?.[1]);
      if (!(width > 0 && height > 0)) throw new Error(`Missing vector dimensions: ${svgPath}`);
      renderAtlasPng(svgPath, pngPath, width, height);
      count++;
      console.log(`Exported ${dir}/${name}: ${width * 2} × ${height * 2}`);
    }
    const provenancePath = join(folder, 'provenance.json');
    const provenance = JSON.parse(readFileSync(provenancePath, 'utf8'));
    for (const record of provenance.plates ?? provenance.records) {
      if (record.pngPath && record.sha256?.png) record.sha256.png = sha(join(root, record.pngPath));
      if (record.pngPath && record.pngSha256) record.pngSha256 = sha(join(root, record.pngPath));
    }
    provenance.rasterExport = { scale: ATLAS_EXPORT_SCALE, method: 'Rendered directly from unchanged SVG masters; no raster upscaling.' };
    writeFileSync(provenancePath, JSON.stringify(provenance, null, 2) + '\n');
  }
  console.log(`Updated ${count} original plates; SVG masters, annotations, and content are unchanged.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) exportApprovedAtlas();
