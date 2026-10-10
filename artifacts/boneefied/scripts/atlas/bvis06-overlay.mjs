// Draws pin dots + structure ids on the PNGs for visual QA: node scripts/atlas/bvis06-overlay.mjs [key...] -> /tmp/b6ov/KEY.png
import { readFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = readFileSync(join(root, 'content/bvis06-plates.generated.ts'), 'utf8');
const plates = JSON.parse(src.slice(src.indexOf('= [') + 2, src.lastIndexOf(';')));
mkdirSync('/tmp/b6ov', { recursive: true });
const only = process.argv.slice(2);
for (const p of plates) {
  if (only.length && !only.includes(p.key)) continue;
  const args = [join(root, p.pngPath)];
  p.labels.forEach((l, i) => { const x = Math.round(l.x * 1450), y = Math.round(l.y * 1000);
    args.push('-fill', 'none', '-stroke', '#1a1a1a', '-strokewidth', '3', '-draw', `circle ${x},${y} ${x + 7},${y}`, '-stroke', '#ffe14d', '-strokewidth', '1.5', '-draw', `circle ${x},${y} ${x + 7},${y}`,
      '-stroke', 'none', '-fill', '#111', '-font', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '-pointsize', '16', '-annotate', `+${x + 9}+${y - 6}`, String(i + 1)); });
  args.push(`/tmp/b6ov/${p.key}.png`);
  execFileSync('convert', args, { stdio: 'ignore' });
  console.log(p.key, p.labels.map((l, i) => `${i + 1}=${l.structureId}`).join(' '));
}
