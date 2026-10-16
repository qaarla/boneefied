import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { organicBranches, organicFibers, organicFiberSvg, organicStrands, organicBundles, ORGANIC_MOTIF_LENGTHS, ORGANIC_MAX_RIBBON, ORGANIC_STRAND_WIDTH, ORGANIC_BRANCH_WIDTH, ORGANIC_UNIT_PX, ORGANIC_STRENGTH, ORGANIC_SURFACE_STRENGTH } from '../components/organicFibers.ts';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('original material is short interlocking fascicles, dense, static and present in the centre', () => {
  const extent = (d: string) => {
    const n = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const xs = n.filter((_, i) => i % 2 === 0), ys = n.filter((_, i) => i % 2 === 1);
    return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  };
  assert.equal(organicBundles.length, 7);
  assert.ok(ORGANIC_MOTIF_LENGTHS.length === 70);
  assert.ok(Math.min(...ORGANIC_MOTIF_LENGTHS) >= 120 && Math.max(...ORGANIC_MOTIF_LENGTHS) <= 220);
  assert.ok(new Set(ORGANIC_MOTIF_LENGTHS).size > 20, 'motif lengths vary');
  assert.ok(organicFibers.length >= 140 && organicStrands.length >= 350 && organicBranches.length >= 120);
  // No wire: every ribbon, strand and branch stays local (no full-tile-height or long streaks).
  for (const d of [...organicFibers, ...organicStrands]) assert.ok(extent(d) <= 230, 'fascicle part too long');
  for (const d of organicBranches) assert.ok(extent(d) <= 110, 'branch too long');
  // Fine scale and gentle contrast.
  assert.ok(ORGANIC_MAX_RIBBON * ORGANIC_UNIT_PX <= 2.5, `widest ribbon ${ORGANIC_MAX_RIBBON * ORGANIC_UNIT_PX}px`);
  assert.ok(ORGANIC_STRAND_WIDTH * ORGANIC_UNIT_PX <= 1 && ORGANIC_BRANCH_WIDTH * ORGANIC_UNIT_PX <= 1);
  assert.ok(ORGANIC_STRENGTH <= .25 && ORGANIC_SURFACE_STRENGTH < ORGANIC_STRENGTH);
  const svg = organicFiberSvg('#25282a');
  assert.equal((svg.match(/<path /g) ?? []).length, organicFibers.length + organicStrands.length + organicBranches.length);
  assert.doesNotMatch(svg, /<image|<text|<animate|<filter|href=|rotate|script|random/i);
  // Center-only crop (x 350-650, y 300-700) holds many parts of the material.
  const inCentre = (d: string) => (d.match(/-?\d+(?:\.\d+)?/g)!.map(Number)).some((n, i, a) => i % 2 === 0 && n > 350 && n < 650 && a[i + 1] > 300 && a[i + 1] < 700);
  assert.ok(organicFibers.filter(inCentre).length >= 10, 'centre fibers');
  assert.ok(organicStrands.filter(inCentre).length >= 30, 'centre strands');
  assert.ok(organicBranches.filter(inCentre).length >= 8, 'centre branches');
  // Whole tile coverage: every 200-unit band in both axes holds material.
  const nums = (d: string) => d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  for (let band = 0; band < 5; band++) {
    assert.ok(organicStrands.some(d => nums(d).some((n, i) => i % 2 === 0 && n >= band * 200 && n < band * 200 + 200)), `x band ${band}`);
    assert.ok(organicStrands.some(d => nums(d).some((n, i) => i % 2 === 1 && n >= band * 200 && n < band * 200 + 200)), `y band ${band}`);
  }
  // Seamless vertical repeat: material crosses both seams as clipped copies.
  assert.ok(organicStrands.some(d => nums(d).some((n, i) => i % 2 === 1 && n < 0)));
  assert.ok(organicStrands.some(d => nums(d).some((n, i) => i % 2 === 1 && n > 1000)));
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
  assert.match(background, /onLayout/);
  assert.match(background, /return this\.state\.failed \? null/);
  assert.match(background, /ink=\{colors\.primary\}/);
  assert.match(background, /ORGANIC_UNIT_PX/);
  assert.match(background, /b\.maxX > x0 && b\.minX < x0 \+ vw/);
  assert.match(background, /ink \?\? colors\.primary/);
  assert.match(background, /export const OrganicSurface/);
  assert.doesNotMatch(background, /Animated|PanResponder|onTouch|onPress|fetch\(|https:|useEffect/);
  // A plain, opaque atlas frame masks the underlay; its pixels are never tinted.
  assert.match(read('../components/AnatomyImageViewer.tsx'), /styles\.frame, \{ backgroundColor: colors\.card/);
});

test('opaque app surfaces, bars and cards carry the same material, while the atlas frame stays pristine', () => {
  assert.match(read('../app/_layout.tsx'), /headerBackground: \(\) => <View[^>]*><OrganicSurface \/>/);
  const adaptive = read('../components/AdaptiveLayout.tsx');
  assert.match(adaptive, /OrganicSurface/);
  assert.match(adaptive, /flat\.backgroundColor/);
  for (const f of ['../app/(tabs)/_layout.tsx', '../app/(tabs)/index.tsx', '../components/ModuleSourcesDisclosure.tsx', '../components/WordPartResults.tsx', '../components/AtlasViewerControls.tsx']) {
    assert.match(read(f), /<OrganicSurface/, f);
  }
  // Glossary lists are not Screen-based: they own full material and local row/chip surfaces.
  for (const f of ['../app/glossary/index.tsx', '../app/glossary/word-parts.tsx']) {
    const src = read(f);
    assert.match(src, /<OrganicBackground \/>\s*<Stack\.Screen/, f);
    assert.match(src, /<OrganicSurface radius=\{12\}/, f);
    // Text inputs stay plain opaque so glyphs never sit on art.
    assert.doesNotMatch(src, /<TextInput[^>]*>\s*<OrganicSurface/, f);
  }
  assert.match(read('../app/glossary/index.tsx'), /<OrganicSurface radius=\{12\} shift=\{\(index \* 97\) % 400\} \/>/);
  assert.match(read('../components/ModuleScreen.tsx'), /<OrganicSurface \/>\s*<View style=\{styles\.headerRow\}>/);
  // Local ink follows local background (filled primary/destructive controls).
  assert.match(adaptive, /primaryForeground/);
  assert.match(adaptive, /destructiveForeground/);
  assert.match(read('../components/OrganicBackground.tsx'), /ink \?\? colors\.primary/);
  // iOS tabs keep the OS-owned glass/blur: art is only added on non-iOS bars.
  assert.match(read('../app/(tabs)/_layout.tsx'), /Platform\.OS !== "ios" && <OrganicSurface/);
  // Educational image pixels are never overlaid.
  assert.doesNotMatch(read('../components/AnatomyImageViewer.tsx'), /Organic/);
});

test('website and privacy page use the same generated paths without drift', () => {
  const web = read('../../boneefied-site/src/components/organic-background.tsx');
  const privacy = decodeURIComponent(read('../../boneefied-site/public/privacy-policy.html').match(/data:image\/svg\+xml,([^"]+)"/)![1]);
  const css = read('../../boneefied-site/src/index.css');
  assert.match(web, /boneefied\/components\/organicFibers/);
  assert.match(web, /aria-hidden="true"/);
  assert.match(css, /\.organic-background \{[^}]*pointer-events: none/);
  for (const d of [...organicFibers, ...organicStrands, ...organicBranches]) assert.ok(privacy.includes(`d="${d}"`));
});
