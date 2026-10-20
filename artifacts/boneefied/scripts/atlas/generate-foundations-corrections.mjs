// Regenerate only the two corrected retained diagrams. No app/native build.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const out = path.join(root, 'assets/images/anatomy/foundations-corrections');
mkdirSync(out, { recursive: true });
const C = { bg: '#EDEAE2', cell: '#EFD9CA', membrane: '#947568', nuclear: '#D7CBDD', chromatin: '#80708F', spindle: '#7B999B' };
const ellipse = (cx, cy, rx, ry, fill, stroke, width = 2.5, extra = '') =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
const line = (d, stroke = C.chromatin, width = 4, extra = '') =>
  `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const nucleus = (x, y, rx, ry, dashed = false) =>
  ellipse(x, y, rx, ry, C.nuclear, C.chromatin, 2.5, dashed ? 'stroke-dasharray="10 9"' : '');
const chromatin = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">
  ${line('M-52-28C-20-57 30-44 43-12S1 27-33 6S-64 38-26 43S32 12 49 37', C.chromatin, 3)}
  ${line('M-45-5C-14-23 28-5 12 17S-6 52 30 49', C.chromatin, 2.5)}
  </g>`;
const chromosome = (x, y, size = 1) => `<g transform="translate(${x} ${y}) scale(${size})">
  ${line('M-12-20L12 20M12-20L-12 20', C.chromatin, 7)}
  ${ellipse(0, 0, 3.5, 3.5, '#5F526E', '#5F526E', 1)}</g>`;
const pole = (x, y) => ellipse(x, y, 6, 6, C.spindle, C.spindle, 1);
const cell = (x, y, rx = 155, ry = 155) => ellipse(x, y, rx, ry, C.cell, C.membrane, 3);
const fibers = (left, right, y, targets) => targets.map(([x, yy]) =>
  line(`M${left} ${y}Q${(left + x) / 2} ${yy} ${x} ${yy}M${right} ${y}Q${(right + x) / 2} ${yy} ${x} ${yy}`, C.spindle, 1.7)).join('');
const svg = (w, h, title, desc, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<title>${title}</title><desc>${desc}</desc><rect width="${w}" height="${h}" fill="${C.bg}"/>${body}</svg>`;

let art = '<g id="interphase">' + cell(400, 270) + nucleus(400, 270, 94, 94)
  + chromatin(400, 270) + ellipse(424, 246, 16, 16, C.chromatin, C.chromatin) + '</g>';
art += '<g id="prophase">' + cell(1050, 270) + nucleus(1050, 270, 95, 95, true)
  + fibers(918, 1182, 270, [[1018, 230], [1080, 292]])
  + [[1010, 226], [1082, 228], [1025, 300], [1090, 302]].map(([x, y]) => chromosome(x, y, .8)).join('')
  + pole(918, 270) + pole(1182, 270) + '</g>';
const metaphaseYs = [655, 705, 755, 805];
art += '<g id="metaphase">' + cell(270, 730)
  + line('M270 595V865', '#B5A794', 1.4, 'stroke-dasharray="5 7"')
  + fibers(135, 405, 730, metaphaseYs.map(y => [270, y]))
  + metaphaseYs.map(y => chromosome(270, y, .78)).join('') + pole(135, 730) + pole(405, 730) + '</g>';
const anaYs = [655, 705, 755, 805];
art += '<g id="anaphase">' + cell(725, 730, 180, 155)
  + anaYs.map(y => line(`M565 730Q610 ${y} 660 ${y}M885 730Q837 ${y} 790 ${y}`, C.spindle, 1.7)).join('');
for (const y of anaYs) art += line(`M680 ${y - 15}L660 ${y}L680 ${y + 15}M770 ${y - 15}L790 ${y}L770 ${y + 15}`, C.chromatin, 6);
art += pole(565, 730) + pole(885, 730) + '</g>';
art += `<g id="telophase"><path d="M1180 674C1130 587 1020 583 1020 730C1020 877 1130 873 1180 786C1230 873 1340 877 1340 730C1340 583 1230 587 1180 674Z" fill="${C.cell}" stroke="${C.membrane}" stroke-width="3"/>
  ${nucleus(1108, 730, 60, 69)}${nucleus(1252, 730, 60, 69)}
  ${chromatin(1108, 730, .65)}${chromatin(1252, 730, .65)}
  ${ellipse(1123, 713, 9, 9, C.chromatin, C.chromatin)}${ellipse(1267, 713, 9, 9, C.chromatin, C.chromatin)}</g>`;
const mitosis = svg(1450, 1000, 'Cell-cycle stage comparison',
  'Reading order: interphase, prophase, metaphase, anaphase, telophase with early cytokinesis. Interphase is outside mitosis. Four chromosomes are schematic, not the human chromosome count. No embedded stage names or numerals.', art);

// Extract the existing original sagittal figure, with all nested groups intact.
const source = readFileSync(path.join(root, 'assets/images/anatomy/atlas/atlas-04-body-cavities.svg'), 'utf8');
const start = source.indexOf('<g id="lateral-section"');
if (start < 0) throw new Error('Missing original sagittal figure');
let depth = 0, end = -1;
for (const match of source.slice(start).matchAll(/<\/?g\b[^>]*>/g)) {
  depth += match[0].startsWith('</') ? -1 : 1;
  if (depth === 0) { end = start + match.index + match[0].length; break; }
}
if (end < 0) throw new Error('Unbalanced sagittal SVG groups');
const cavities = svg(800, 1100, 'Sagittal body cavities',
  'Anterior left, posterior right. Cranial cavity continuous with the vertebral canal behind thoracic and abdominopelvic cavities. Original Boneefied foundational vector, isolated without the serous inset and uniformly scaled.',
  `<g transform="translate(-150 0) scale(1.1)">${source.slice(start, end)}</g>`);
const records = [];
for (const [id, stem, master] of [
  ['asset-original-mitosis-stages', 'original-mitosis-stages', mitosis],
  ['asset-original-body-cavities', 'original-body-cavities', cavities],
]) {
  const svgPath = path.join(out, stem + '.svg');
  const pngPath = path.join(root, 'assets/images/anatomy', stem + '.png');
  writeFileSync(svgPath, master + '\n');
  execFileSync('convert', ['-background', C.bg, svgPath, '-strip', pngPath], { stdio: 'pipe' });
  records.push({ id, svgPath: path.relative(root, svgPath), pngPath: path.relative(root, pngPath),
    svgSha256: createHash('sha256').update(readFileSync(svgPath)).digest('hex'),
    pngSha256: createHash('sha256').update(readFileSync(pngPath)).digest('hex') });
}
writeFileSync(path.join(out, 'provenance.json'), JSON.stringify({
  rights: 'Original Boneefied project vector artwork; all rights reserved. Schematics, not photomicrographs.',
  origin: 'Mitosis: original vectors from anatomical facts, not traced. Cavities: isolated existing Boneefied foundational original sagittal vector; no imported art.',
  factualReferences: [
    'https://openstax.org/books/anatomy-and-physiology-2e/pages/3-5-cell-growth-and-division',
    'https://openstax.org/books/anatomy-and-physiology-2e/pages/1-6-anatomical-terminology',
  ], records,
}, null, 2) + '\n');
console.log('Regenerated 2 bounded original diagrams and exact-file provenance; no application build.');
