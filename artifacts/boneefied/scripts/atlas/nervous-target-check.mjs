import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { content } from '../../content/canonical.ts';
import { Scene } from './bvis04-lib.mjs';
import { plates as nervous } from './bvis04-nervous.mjs';
import { plates as tissues } from './bvis04-tissue.mjs';
import { plates as senses } from './bvis04-senses.mjs';
import { plates as skin } from './bvis04-skin.mjs';
import { peripheralAtlasAssetIds } from '../../content/peripheral-atlas-corrections.ts';
import { Scene as EndocrineScene } from './bvis05-lib.mjs';
import { plates as endocrine } from './bvis05-endo.mjs';
import { plates as heart } from './bvis05-heart.mjs';
import { plates as blood } from './bvis05-blood.mjs';
import { plates as vessels1 } from './bvis05-vessels.mjs';
import { plates as vessels2 } from './bvis05-vessels2.mjs';

const peripheral = process.argv.includes('--peripheral');
const specialSenses = process.argv.includes('--senses');
const endo = process.argv.includes('--endocrine');
const cardio = process.argv.includes('--cardiovascular');
const vessels = process.argv.includes('--vessels');
const bvis05 = endo || cardio || vessels;
const dir = `generated-artifacts/atlas-${vessels ? 'vessels' : cardio ? 'cardiovascular' : endo ? 'endocrine' : specialSenses ? 'senses' : peripheral ? 'peripheral' : 'nervous'}-repair`;
const inventory = JSON.parse(fs.readFileSync(`${dir}/inventory-after.json`, 'utf8'));
const rows = [];
const candidates = vessels ? [...vessels1, ...vessels2] : cardio ? [...heart, ...blood] : endo ? endocrine : specialSenses ? senses : peripheral
  ? [...nervous, ...senses, ...skin].filter(p => peripheralAtlasAssetIds.includes(p.replaces ?? `asset-bvis04-${p.key}`))
  : [...nervous, ...tissues.filter(p => p.key === 'nervous-tissue')];
for (const p of candidates) {
  const id = p.replaces ?? `asset-bvis0${bvis05 ? 5 : 4}-${p.key}`;
  const a = content.assets.find(a => a.id === id);
  const s = new (bvis05 ? EndocrineScene : Scene)(p.key);
  p.draw(s);
  const file = `/tmp/nervous-final-${p.key}`;
  fs.writeFileSync(`${file}.svg`, s.idsvg());
  execFileSync('convert', [`${file}.svg`, '-depth', '8', `${file}.rgb`], { stdio: 'ignore' });
  const rgb = fs.readFileSync(`${file}.rgb`);
  const checks = a.labels.map((l, i) => {
    const x = Math.round(l.x * 1450), y = Math.round(l.y * 1000);
    const offset = (y * 1450 + x) * 3;
    const color = `#${rgb.subarray(offset, offset + 3).toString('hex')}`;
    const expected = s.pins[i].key.split('+').map(key => s.hex(key));
    const onOwnRegion = expected.includes(color);
    if (!onOwnRegion) throw Error(`${id} ${l.structureId}: ${x},${y} ${color} != ${expected}`);
    return { structureId: l.structureId, x: l.x, y: l.y, onOwnRegion };
  });
  rows.push({ id, checks });
}
const total = rows.reduce((n, r) => n + r.checks.length, 0);
fs.writeFileSync(`${dir}/target-review.json`, JSON.stringify({
  inspected: inventory.length, targetCount: total, rows,
  note: 'Semantic-region evidence supplements individual rendered anatomical review; it does not independently establish anatomical correctness.',
}, null, 2));
console.log(`${rows.length} diagrams; ${total} published endpoints match their own visible source regions.`);
