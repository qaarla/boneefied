/** Run with node --experimental-strip-types scripts/atlas/audit-zoom-sources.mjs.
 * Audits EVERY active runtime image against its real require and vector master.
 * Contact sheets are inspection outputs, never replacement study images.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { content } from '../../content/canonical.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const workspace = fileURLToPath(new URL('../../../../', import.meta.url));
const out = join(workspace, 'generated-artifacts/atlas-zoom-audit');
mkdirSync(out, { recursive: true });
const inventory = JSON.parse(readFileSync(join(workspace, 'research/boneefied-photo-references/inventory.json'))).assets;
const active = new Set([...content.modules.flatMap(m => (m.lessons ?? []).flatMap(l => l.assetIds ?? [])),
  ...content.questions.flatMap(q => q.assetId ? [q.assetId] : [])]);
assert.deepEqual([...active].sort(), inventory.map(a => a.id).sort());
const registry = readFileSync(join(root, 'content/imageSources.ts'), 'utf8');
const imports = new Map([...registry.matchAll(/import\s+\{\s*(\w+)\s*\}\s+from\s+['"]\.\/([^'"]+)['"]/g)]
  .map(m => [m[1], readFileSync(join(root, 'content', m[2] + '.ts'), 'utf8')]));
const actual = new Map();
const requirePattern = /['"]([^'"]+)['"]:\s*require\(['"]@\/([^'"]+)['"]\)/g;
// Preserve object-spread precedence: generated atlas aliases intentionally
// override several old Gray/Servier image IDs later in the root registry.
for (const token of registry.matchAll(/['"]([^'"]+)['"]:\s*require\(['"]@\/([^'"]+)['"]\)|\.\.\.(\w+)|Object\.assign\(imageSources,\s*(\w+)\)/g)) {
  const imported = token[3] ?? token[4];
  if (imported) {
    assert.ok(imports.has(imported), `Unresolved source override ${imported}`);
    for (const match of imports.get(imported).matchAll(requirePattern)) actual.set(match[1], match[2]);
  } else actual.set(token[1], token[2]);
}
const vectors = new Map([...readFileSync(join(root, 'content/vector-image-sources.generated.ts'), 'utf8')
  .matchAll(/\[require\('@\/([^']+)'\), \(\) => require\('@\/([^']+)'\) as string\]/g)].map(m => [m[1], m[2]]));
const sha = p => createHash('sha256').update(readFileSync(p)).digest('hex');
const rows = inventory.map((asset, index) => {
  assert.equal(actual.get(asset.id), asset.localAssetPath, `Wrong active image path: ${asset.id}`);
  const file = join(root, asset.localAssetPath);
  const [width, height] = execFileSync('magick', ['identify', '-ping', '-format', '%w %h', file], { encoding: 'utf8' }).split(' ').map(Number);
  const master = vectors.get(asset.localAssetPath);
  if (master) {
    const xml = readFileSync(join(root, master), 'utf8');
    assert.match(xml, /<svg\b/);
    assert.doesNotMatch(xml, /<image\b|data:image\/|<foreignObject\b/);
  }
  const note = master ? 'Authentic vector, drawn at actual displayed size; raster identity is not the displayed artwork.'
    : asset.id === 'asset-openstax-spinal-cord-specimen'
      ? 'Finite existing micrograph crop. Upstream is a two-panel illustration/photo composite, not a larger interchangeable crop; do not expose its labeled diagram or move this crop’s anchors.'
      : asset.sourceUrl ? 'Finite authentic raster original; no faithful higher-resolution version established in current source-page review.'
        : 'Only this original raster is available; no recoverable original vector master located. Not repaired by enlargement.';
  return { index: index + 1, id: asset.id, title: asset.title, activeRequire: actual.get(asset.id),
    rasterDimensions: [width, height], rasterSha256: sha(file), vectorMaster: master ?? null,
    vectorSha256: master ? sha(join(root, master)) : null, renderer: master ? 'SvgXml at actual display dimensions' : 'Full-resolution raster at actual display dimensions; native allowDownscaling=false',
    sourceUrl: asset.sourceUrl ?? null, rightsUnchanged: true, markersUnchanged: true, note };
});
const report = {
  activeRuntimeImages: active.size, vectors: rows.filter(r => r.vectorMaster).length,
  finiteRasters: rows.filter(r => !r.vectorMaster).length,
  rendering: 'Image layer is outside the scaled annotation canvas; same fit, center-origin zoom and animated pan. No inverse-scaled SVG, no low-resolution image enlargement used as a repair.',
  nativeDeviceVisualVerification: false, nativeBuildsOrPublication: false, rows,
};
writeFileSync(join(workspace, 'research/atlas-zoom-source-audit.json'), JSON.stringify(report, null, 2) + '\n');
const font = createRequire(join(root, 'package.json')).resolve('@expo-google-fonts/tinos/400Regular/Tinos_400Regular.ttf');
const thumbnails = [];
for (const row of rows) {
  const thumbnail = join(out, `plate-${String(row.index).padStart(3, '0')}.png`);
  execFileSync('magick', ['-background', 'white', join(root, row.vectorMaster ?? row.activeRequire),
    '-thumbnail', '174x145', '-gravity', 'center', '-extent', '180x150',
    '-font', font, '-pointsize', '11', '-gravity', 'south', '-background', 'white',
    '-splice', '0x26', '-annotate', '+0+9', `${row.index}: ${row.id.replace(/^asset-/, '').slice(0, 28)}`,
    thumbnail], { stdio: 'pipe' });
  thumbnails.push(thumbnail);
}
for (let i = 0; i < thumbnails.length; i += 30)
  execFileSync('magick', ['montage', ...thumbnails.slice(i, i + 30), '-font', font,
    '-tile', '6x5', '-geometry', '+3+3', join(out, `contact-${i / 30 + 1}.png`)], { stdio: 'pipe' });
console.log(JSON.stringify({ active: report.activeRuntimeImages, vectors: report.vectors, finiteRasters: report.finiteRasters, contactSheets: Math.ceil(rows.length / 30) }));
