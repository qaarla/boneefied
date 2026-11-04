// Fetch exact-source replacements only. Never substitute a different specimen,
// silently stretch an image, or fabricate photographic detail.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { content } from '../../content/canonical.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const staging = resolve(root, '../../generated-artifacts/image-resolution');
mkdirSync(staging, { recursive: true });
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const curl = (url) => execFileSync('curl', ['--fail', '--location', '--silent', '--show-error', '--retry', '2', '--max-time', '60', url], { maxBuffer: 30 * 1024 * 1024 });
const dimensions = (file) => execFileSync('identify', ['-ping', '-format', '%w %h', file], { encoding: 'utf8' }).split(' ').map(Number);
const records = [];
const proofPath = join(root, 'assets/images/anatomy/source-resolution.json');
let previous = new Map();
try {
  previous = new Map(JSON.parse(readFileSync(proofPath, 'utf8')).records.map((r) => [r.id, r]));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

for (const asset of content.assets.filter((a) => a.sourceUrl?.includes('commons.wikimedia.org/wiki/File:'))) {
  const file = join(root, asset.localAssetPath);
  const before = readFileSync(file);
  const accepted = previous.get(asset.id);
  if (accepted?.result === 'upgraded-exact-source' && accepted.after.sha256 === sha(before)) {
    records.push(accepted);
    console.log(`${asset.id}: already verified at upgraded resolution`);
    continue;
  }
  const [oldWidth, oldHeight] = dimensions(file);
  const title = decodeURIComponent(new URL(asset.sourceUrl).pathname.split('/wiki/')[1]);
  const query = new URLSearchParams({ action: 'query', format: 'json', titles: title, prop: 'imageinfo', iiprop: 'url|size|extmetadata' });
  const data = JSON.parse(curl(`https://commons.wikimedia.org/w/api.php?${query}`));
  const info = Object.values(data.query.pages)[0]?.imageinfo?.[0];
  if (!info) throw new Error(`No original source metadata: ${asset.id}`);
  const record = { id: asset.id, path: asset.localAssetPath, sourcePage: asset.sourceUrl,
    originalUrl: info.url.split('?')[0], license: info.extmetadata?.LicenseShortName?.value,
    before: { width: oldWidth, height: oldHeight, sha256: sha(before) },
    upstream: { width: info.width, height: info.height } };
  // Only exact full-frame sources with an unchanged aspect are eligible.
  // Different aspect ratios identify existing crops: replacing them blindly
  // would move every study marker and might replace a photograph with a diagram.
  const ratioMatches = Math.abs(info.width / info.height / (oldWidth / oldHeight) - 1) < 0.002;
  const isVector = info.url.split('?')[0].endsWith('.svg');
  const improvement = info.width > oldWidth * 1.2 && info.height > oldHeight * 1.2;
  if ((ratioMatches && improvement) || (ratioMatches && isVector)) {
    const source = curl(record.originalUrl);
    const temp = join(staging, asset.id + (isVector ? '.svg' : '.jpg'));
    writeFileSync(temp, source);
    if (isVector) {
      // Keep the exact original aspect/field and the existing PNG asset path.
      // The SVG source is retained next to the PNG with its original attribution.
      const master = file.replace(/\.png$/, '.svg');
      writeFileSync(master, source);
      execFileSync('magick', ['-density', '288', '-background', 'white', temp,
        '-resize', `${oldWidth * 3}x${oldHeight * 3}!`, '-strip', file]);
    } else {
      // Keep the authentic original JPEG bytes, without another lossy encode.
      writeFileSync(file, source);
    }
    const [width, height] = dimensions(file);
    record.result = 'upgraded-exact-source';
    record.after = { width, height, sha256: sha(readFileSync(file)) };
  } else {
    record.result = ratioMatches ? 'already-at-original-resolution' : 'retained-existing-crop';
    record.after = record.before;
  }
  records.push(record);
  console.log(`${asset.id}: ${record.result} (${record.before.width}×${record.before.height} → ${record.after.width}×${record.after.height})`);
}
writeFileSync(proofPath, JSON.stringify({
  policy: 'Exact existing source images only; retain crops and attribution. No photographic synthesis or raster upscaling.',
  records,
}, null, 2) + '\n');
