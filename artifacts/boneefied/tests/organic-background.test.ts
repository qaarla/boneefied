import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { organicBranches, organicFibers, organicFiberSvg, ORGANIC_STRENGTH } from '../components/organicFibers.ts';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('original decorative family is sparse, static, self-contained and leaves a quiet center', () => {
  assert.equal(organicFibers.length, 12);
  assert.equal(organicBranches.length, 6);
  assert.ok(ORGANIC_STRENGTH >= .02 && ORGANIC_STRENGTH <= .05);
  const svg = organicFiberSvg('#25282a');
  assert.equal((svg.match(/<path /g) ?? []).length, 18);
  assert.doesNotMatch(svg, /<image|<text|<animate|<filter|href=|rotate|script/i);
  // All endpoints and control points stay in the outer 20% of the canvas.
  for (const d of [...organicFibers, ...organicBranches]) {
    const numbers = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    for (let i = 0; i < numbers.length; i += 2) {
      assert.ok(numbers[i] < 200 || numbers[i] > 800, `Not at the margin: ${d}`);
    }
  }
});

test('shared shell places the inaccessible touch-transparent underlay before content', () => {
  const shell = read('../components/Screen.tsx');
  const background = read('../components/OrganicBackground.tsx');
  assert.match(shell, /<OrganicBackground \/>\{scroll \? scroller : content\}/);
  assert.match(shell, /backgroundColor: colors\.background/);
  assert.match(background, /pointerEvents="none"/);
  assert.match(background, /accessible=\{false\}/);
  assert.match(background, /accessibilityElementsHidden/);
  assert.match(background, /importantForAccessibility="no-hide-descendants"/);
  assert.match(background, /StyleSheet\.absoluteFill/);
  assert.match(background, /return this\.state\.failed \? null/);
  assert.match(background, /fill=\{colors\.primary\}/);
  assert.doesNotMatch(background, /Animated|PanResponder|onTouch|onPress|fetch\(|https:|useEffect/);
  // A plain, opaque atlas frame masks the underlay; its pixels are never tinted.
  assert.match(read('../components/AnatomyImageViewer.tsx'), /styles\.frame, \{ backgroundColor: colors\.card/);
});

test('existing website and legal surface use the same original paths without drift', () => {
  const web = read('../../boneefied-site/src/components/organic-background.tsx');
  const privacy = read('../../boneefied-site/public/privacy-policy.html');
  const css = read('../../boneefied-site/src/index.css');
  assert.match(web, /boneefied\/components\/organicFibers/);
  assert.match(web, /aria-hidden="true"/);
  assert.match(css, /\.organic-background \{[^}]*pointer-events: none/);
  for (const d of [...organicFibers, ...organicBranches]) assert.ok(privacy.includes(`d="${d}"`));
  assert.match(privacy, /opacity: \.025/);
  assert.match(privacy, /class="organic-background" aria-hidden="true" focusable="false"/);
});
