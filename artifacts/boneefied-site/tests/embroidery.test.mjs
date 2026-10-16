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
  assert.match(css, /\.organic-background \{ position: absolute; inset: 0;[^}]*opacity: .22/);
  assert.doesNotMatch(css.match(/\.organic-background \{[^}]*\}/g).join(''), /fixed|sticky|animation|transition|transform|min-height|padding/);
});

test('the shared original artwork follows approved ink in both themes and fails plain', () => {
  assert.match(component, /boneefied\/components\/organicFibers/);
  assert.match(component, /organicFiberSvg\('#ffffff'\)/);
  assert.match(component, /maskImage: mask/);
  assert.match(component, /WebkitMaskImage: mask/);
  assert.match(component, /aria-hidden="true"/);
  assert.doesNotMatch(component, /backgroundImage|#25282a|fetch\(|useEffect|onClick|onScroll|Math\.random/);
  assert.match(css, /@supports \(\(mask-image:[\s\S]*?background-color: var\(--organic-ink\)/);
  assert.match(css, /mask-repeat: repeat-y/);
  // Explicit square dimensions: an auto height can stretch a mask over the
  // entire document, turning short fascicles back into full-height cables.
  assert.match(css, /mask-size: max\(1000px, 100vw\) max\(1000px, 100vw\)/);
  assert.match(privacy, /mask-size: max\(1000px, 100vw\) max\(1000px, 100vw\)/);
  assert.match(css, /--organic-ink: #936012/);
  assert.match(css, /--organic-ink: #ecc176/);
  assert.doesNotMatch(css + privacy, /#86602a|#e2bf7c|#5a3d0e/);
  assert.match(css, /\.support-card::after[^{]*\{[^}]*mask-image: var\(--organic-mask\)|\.footer::after \{[^}]*mask-image: var\(--organic-mask\)/);
  assert.match(app, /style=\{organicShellStyle\}/);
  assert.match(css, /--ink: #25282a/);
  assert.match(css, /--ink: #f2eadb/);
  assert.match(css, /h1 em \{[^}]*color: #bd7918; background-color: var\(--paper\)/);
  assert.match(css, /\.organic-background \{[^}]*pointer-events: none; user-select: none/);
});

test('privacy uses the same detailed paths, tiled mask and strength', () => {
  const decoded = decodeURIComponent(privacy.match(/data:image\/svg\+xml,([^"]+)"/)[1]);
  const source = read('../../boneefied/components/organicFibers.ts');
  assert.match(source, /ORGANIC_STRENGTH = /);
  assert.equal((decoded.match(/<path d="/g) ?? []).length > 150, true);
  assert.match(privacy, /class="organic-background" aria-hidden="true"/);
  assert.match(privacy, /\.organic-background \{ position: absolute;[^}]*opacity: .22/);
  assert.match(privacy, /header::after, footer::after/);
  assert.match(privacy, /body \{ position: relative; isolation: isolate/);
  assert.match(privacy, /@supports not[\s\S]*\.organic-background, header::after, footer::after \{ display: none/);
  assert.doesNotMatch(privacy.match(/\.organic-background \{[^}]*\}/)[0], /fixed|animation|transform/);
});

test('surface art sits behind existing illustration pixels, never above them', () => {
  const rule = css.match(/\.workflow-card::after, [^{]*\.hero-art::after[^{]*\{[^}]*\}/)[0];
  assert.match(rule, /z-index: -1/);
  assert.match(rule, /pointer-events: none/);
  assert.match(css, /\.hero-art \{[^}]*isolation: isolate|\.hero-art \{ position: relative; overflow: hidden;[^}]*isolation: isolate/);
  assert.doesNotMatch(css, /\.(art-center|art-logo|qr-frame|orbit)[^{]*::after \{[^}]*--organic-mask/);
});
