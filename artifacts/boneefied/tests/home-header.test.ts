import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { wholeWordFontFactor } from '../context/wholeWordFit.ts';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const screen = read('app/(tabs)/(study)/index.tsx');
const title = read('components/HomeBrandTitle.tsx');
const header = screen.slice(screen.indexOf('<View testID="study-brand-row"'), screen.indexOf('<Text style={[styles.lede'));

test('only the brand row opts out of large-text stacking with equal fixed side spaces', () => {
  assert.match(header, /headerStyles\.row/);
  assert.doesNotMatch(header, /reflow|responsive\.brand|<Heading|\u00ad/);
  assert.match(screen, /row: \{ flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center' \}/);
  for (const name of ['side', 'settingsSlot']) {
    assert.ok(screen.includes(`${name}: { width: 48, height: 48, flexShrink: 0`));
  }
  assert.match(header, /logo-rounded\.png/);
  assert.match(header, /testID="study-settings-button"/);
  assert.match(header, /router\.push\('\/settings'\)/);
  assert.match(header, /hitSlop=\{4\}/);
});

test('native brand title keeps a genuine scaling, single-line fitting contract', () => {
  assert.match(title, /Text as NativeText/);
  assert.match(title, /numberOfLines=\{1\}/);
  assert.match(title, /adjustsFontSizeToFit/);
  assert.match(title, /allowFontScaling/);
  assert.match(title, /maxFontSizeMultiplier=\{0\}/);
  assert.match(title, /minimumFontScale=\{0\.1\}/);
  assert.match(title, /fontFamily: APP_FONTS\.bold/);
  assert.match(title, /textAlign: 'center'/);
  assert.match(title, /maxHeight: 48/);
  assert.match(title, />Boneefied<\/NativeText>/);
  assert.doesNotMatch(title, /allowFontScaling=\{false\}|<Heading/);
});

test('Tinos brand fitting preserves the full word at phone widths and enlarged text', () => {
  // Tinos bold advance widths for Boneefied, matching the shared font metrics.
  const wordEm = (667 + 500 + 556 + 444 + 444 + 333 + 278 + 444 + 556) / 1000;
  for (const width of [320, 360, 375, 390, 393, 402, 414, 430, 440]) {
    const available = width - 40 - 48 * 2 - 12 * 2;
    for (const preference of [0.9, 1, 1.12]) {
      for (const system of [1, 1.15, 1.3, 1.5, 1.8, 2, 2.4, 2.8, 3.2]) {
        const requested = 26 * preference * system;
        const fitted = requested * wholeWordFontFactor('Boneefied', available, requested, true);
        assert.ok(wordEm * fitted <= available + 0.5, `${width}/${preference}/${system}`);
        assert.ok(fitted >= 26 * preference - 0.01, 'enlarging text never makes the brand smaller than its default');
        assert.ok(fitted / requested >= 0.1, 'native minimumFontScale permits the required fit');
      }
    }
  }
});
