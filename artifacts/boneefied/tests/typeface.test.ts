import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { APP_FONTS, appTypeface } from '../context/typeface.ts';

test('ordinary body and input text selects actual Tinos regular without synthetic weight', () => {
  for (const fontWeight of [undefined, 'normal', '100', '300', '400', 400] as const) {
    assert.deepEqual(appTypeface({ fontWeight }), { fontFamily: APP_FONTS.regular, fontWeight: 'normal' });
  }
  assert.equal(appTypeface().fontFamily, APP_FONTS.regular);
});

test('all emphasized weights select the real Tinos bold face', () => {
  for (const fontWeight of ['bold', '500', '600', '700', '800', '900', 700] as const) {
    assert.deepEqual(appTypeface({ fontWeight }), { fontFamily: APP_FONTS.bold, fontWeight: 'normal' });
  }
  assert.equal(appTypeface({ fontFamily: APP_FONTS.bold }).fontFamily, APP_FONTS.bold);
  assert.equal(appTypeface({ fontFamily: APP_FONTS.regular, fontWeight: '700' }).fontFamily, APP_FONTS.bold);
});

test('explicit technical, icon and compact overlay families remain untouched', () => {
  for (const fontFamily of ['Menlo', 'monospace', 'Feather', 'System', 'sans-serif']) {
    assert.deepEqual(appTypeface({ fontFamily, fontWeight: '700' }), { fontFamily });
  }
});

test('all reading wrappers and native navigation use authoritative font faces, not global defaults', () => {
  const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const text = read('components/ScaledText.tsx');
  assert.match(text, /\.\.\.appTypeface\(flattened\)/);
  assert.ok(text.indexOf('...appTypeface(flattened)') > text.indexOf('return [style'));
  assert.match(text, /style=\{\[\{ fontWeight: '700', textAlign: 'center' \}, style\]\}/);
  const root = read('app/_layout.tsx');
  assert.doesNotMatch(root, /defaultProps/);
  assert.match(root, /headerTitleStyle: \{ fontFamily: APP_FONTS.bold/);
  assert.match(root, /headerBackTitleStyle: \{ fontFamily: APP_FONTS.bold/);
  const tabs = read('app/(tabs)/_layout.tsx');
  assert.match(tabs, /<NativeTabs labelStyle=\{\{ fontFamily: APP_FONTS.bold/);
  assert.match(tabs, /tabBarLabelStyle: \{ fontFamily: APP_FONTS.bold/);
  assert.match(tabs, /headerTitleStyle: \{ fontFamily: APP_FONTS.bold/);
  const nativeLabel = tabs.match(/<NativeText\b[\s\S]*?<\/NativeText>/)?.[0];
  assert.match(nativeLabel ?? '', /fontFamily: APP_FONTS.bold/);
  const marker = text.match(/export const MarkerText[\s\S]*?\n\}\);/)?.[0] ?? '';
  assert.doesNotMatch(marker, /appTypeface|Tinos/);
  assert.match(read('components/AnatomyImageViewer.tsx'), /fontFamily: compactOverlayFont/);
});
