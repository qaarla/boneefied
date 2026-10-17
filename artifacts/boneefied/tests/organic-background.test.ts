import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const material = () => read('../components/OrganicBackground.tsx');

// Source guards supplement, but do not replace, the rendered preview checks.
test('anatomical material uses optimized bundled raster assets, not traced decoration', () => {
  const src = material();
  for (const theme of ['dark', 'light']) {
    const name = `boneefied-muscle-fibers-${theme}.webp`;
    const bytes = readFileSync(new URL(`../assets/images/materials/${name}`, import.meta.url));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    assert.ok(bytes.length > 50_000 && bytes.length < 350_000, `${theme} raster budget`);
    assert.ok(src.includes(`require('../assets/images/materials/${name}')`));
  }
  assert.match(src, /from 'expo-image'/);
  assert.match(src, /colors\.background === palettes\.dark\.background|useColors\(\)\.background === palettes\.dark\.background/);
  assert.doesNotMatch(src, /react-native-svg|organicFibers|<Svg|<Path|fetch\(|https?:/);
});

test('material persists under screen content and never owns touches or accessibility focus', () => {
  const src = material();
  assert.match(read('../components/Screen.tsx'), /<OrganicBackground \/>\{scroll \? scroller : content\}/);
  assert.match(src, /pointerEvents="none"/);
  assert.match(src, /accessible=\{false\}/);
  assert.match(src, /accessibilityElementsHidden/);
  assert.match(src, /importantForAccessibility="no-hide-descendants"/);
  assert.match(src, /focusable=\{false\}/);
  assert.match(src, /StyleSheet\.absoluteFill/);
  assert.match(src, /overflow: 'hidden'/);
  assert.doesNotMatch(src, /Animated|PanResponder|onTouch|onPress|setInterval|requestAnimationFrame/);
});

test('bounded square crops preserve proportions and decoration errors leave plain UI usable', () => {
  const src = material();
  assert.match(src, /Math\.max\(MATERIAL_PX, size\.w, size\.h\)/);
  assert.match(src, /width: S, height: S/);
  assert.match(src, /contentFit="cover"/);
  assert.match(src, /cachePolicy="memory-disk"/);
  assert.match(src, /onError=\{\(\) => setFailed\(true\)\}/);
  assert.match(src, /return this\.state\.failed \? null/);
  assert.match(src, /!failed && <Image/);
});

test('cards, menus, bars and opaque actions use material, but educational canvases do not', () => {
  for (const path of [
    '../components/AdaptiveLayout.tsx',
    '../components/AtlasViewerControls.tsx',
    '../components/AnimatedAnswerPressable.tsx',
    '../components/ModuleScreen.tsx',
    '../app/(tabs)/_layout.tsx',
    '../app/(tabs)/index.tsx',
    '../app/glossary/index.tsx',
    '../app/glossary/word-parts.tsx',
  ]) assert.match(read(path), /<OrganicSurface/, path);
  assert.match(read('../app/(tabs)/_layout.tsx'), /headerBackground:/);
  assert.match(read('../components/AnimatedAnswerPressable.tsx'), /!contentOpaque && material/);
  assert.match(read('../components/AnimatedAnswerPressable.tsx'), /contentOpaque && material/);
  assert.doesNotMatch(read('../components/AnatomyImageViewer.tsx'), /OrganicBackground|OrganicSurface/);
  assert.match(read('../components/AnatomyImageViewer.tsx'), /decorate=\{false\}/);
  assert.match(read('../components/AnatomyImageViewer.tsx'), /styles\.frame, \{ backgroundColor: colors\.card/);
  for (const path of ['../app/glossary/index.tsx', '../app/glossary/word-parts.tsx']) {
    assert.match(read(path), /<OrganicBackground \/>/);
    assert.doesNotMatch(read(path), /<TextInput[^>]*>\s*<OrganicSurface/);
  }
});
