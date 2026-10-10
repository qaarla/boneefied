// Existing real specimen evidence: no image download, modification or synthesis.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const file = path.join(root, 'docs/atlas/BVIS04_SPECIMEN_LICENSES.json');
const evidence = JSON.parse(fs.readFileSync(file, 'utf8'));
const specimens = [
  ['asset-commons-simple-squamous-epithelium', 'assets/images/anatomy/commons-simple-squamous-epithelium.jpg', 'Epithelial_Tissues_Simple_Squamous_Epithelium_(40823230315).jpg'],
  ['asset-commons-simple-cuboidal-epithelium', 'assets/images/anatomy/commons-simple-cuboidal-epithelium.jpg', 'Epithelial_Tissues_Simple_Cuboidal_Epithelium_(41681552782).jpg'],
  ['asset-commons-simple-columnar-epithelium', 'assets/images/anatomy/commons-simple-columnar-epithelium.jpg', 'Epithelial_Tissues_Simple_Columnar_Epithelium_(27854452618).jpg'],
  ['asset-openstax-spinal-cord-specimen', 'assets/images/anatomy/openstax-spinal-cord-specimen.jpg', '1313_Spinal_Cord_Cross_Section.jpg'],
];
function jpegDimensions(bytes) {
  if (bytes.readUInt16BE(0) !== 0xffd8) throw new Error('Expected a JPEG specimen');
  let p = 2;
  while (p < bytes.length) {
    if (bytes[p++] !== 0xff) continue;
    while (bytes[p] === 0xff) p++;
    const marker = bytes[p++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || marker >= 0xd0 && marker <= 0xd7) continue;
    const length = bytes.readUInt16BE(p);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
      return [bytes.readUInt16BE(p + 5), bytes.readUInt16BE(p + 3)];
    p += length;
  }
  throw new Error('JPEG has no supported size marker');
}
for (const [id, localPath, sourceFile] of specimens) {
  const r = evidence.licenses.find((r) => r.file === sourceFile);
  if (!r) throw new Error(`No exact licensing evidence for ${sourceFile}`);
  const bytes = fs.readFileSync(path.join(root, localPath));
  const dimensions = jpegDimensions(bytes);
  Object.assign(r, { assetId: id, localPath, sha256: createHash('sha256').update(bytes).digest('hex'),
    byteSize: bytes.length, dimensions, kind: 'real-specimen-photomicrograph',
    modificationsInBvis04: 'None. Existing local image bytes retained.',
    existingAdaptation: id.includes('spinal') ? 'Existing crop to the real photomicrograph panel; source diagram portion excluded.' : 'Existing display-sized specimen image; no new crop or tissue alteration.',
    stainMagnificationOrganism: 'Not newly asserted; no inference from color or appearance.' });
}
fs.writeFileSync(file, JSON.stringify(evidence, null, 2) + '\n');
console.log(`Audited ${specimens.length} existing real specimens; exact license URLs and local SHA-256 recorded.`);
