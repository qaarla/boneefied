import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const css = read('../src/index.css');
const component = read('../src/components/organic-background.tsx');
const app = read('../src/App.tsx');
const privacy = read('../public/privacy-policy.html');

test('exactly one website underlay covers the existing main content and footer', () => {
  assert.equal((app.match(/<OrganicBackground \/>/g) ?? []).length, 1);
  assert.ok(app.indexOf('<OrganicBackground />') < app.indexOf('<main'));
  assert.ok(app.indexOf('<footer') > app.indexOf('</main>'));
  assert.match(css, /\.site-shell \{[^}]*position: relative; isolation: isolate/);
  assert.match(css, /\.organic-background \{ position: absolute; inset: 0;[^}]*opacity: \.09/);
  assert.doesNotMatch(css.match(/\.organic-background \{[^}]*\}/g).join(''), /fixed|sticky|animation|transition|transform|min-height|padding/);
});

test('the shared original artwork follows approved ink in both themes and fails plain', () => {
  assert.match(component, /boneefied\/components\/organicFibers/);
  assert.match(component, /organicFiberSvg\('#ffffff'\)/);
  assert.match(component, /maskImage: mask/);
  assert.match(component, /WebkitMaskImage: mask/);
  assert.match(component, /aria-hidden="true"/);
  assert.doesNotMatch(component, /backgroundImage|#25282a|fetch\(|useEffect|onClick|onScroll|Math\.random/);
  assert.match(css, /@supports \(\(mask-image:[\s\S]*?background-color: var\(--ink\)/);
  assert.match(css, /mask-repeat: no-repeat/);
  assert.match(css, /--ink: #25282a/);
  assert.match(css, /--ink: #f2eadb/);
  assert.match(css, /h1 em \{[^}]*color: #bd7918; background-color: var\(--paper\)/);
  assert.match(css, /\.organic-background \{[^}]*pointer-events: none; user-select: none/);
});

test('privacy uses the same sparse paths and strength with normal document scrolling', () => {
  const source = read('../../boneefied/components/organicFibers.ts');
  const paths = [...source.matchAll(/'(M [^']+)'/g)].map(match => match[1]);
  assert.equal(paths.length, 18);
  for (const d of paths) assert.ok(privacy.includes(`d="${d}"`), `Missing original curve: ${d}`);
  assert.match(privacy, /class="organic-background" aria-hidden="true" focusable="false"/);
  assert.match(privacy, /\.organic-background \{ position: absolute;[^}]*opacity: \.09/);
  assert.match(privacy, /body \{ position: relative; isolation: isolate/);
  assert.doesNotMatch(privacy.match(/\.organic-background \{[^}]*\}/)[0], /fixed|animation|transform/);
});
