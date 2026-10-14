import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { atlasLegendTypography, atlasLegendNumberWidth } from '../components/atlasLegendTypography.ts';

test('dense legends remain readable and bounded, including accessibility-size inputs', () => {
  for (const scale of [.8, 1, 1.3, 1.8, 2.5, 2.8, 4, 10]) {
    const metrics = atlasLegendTypography(scale);
    assert.ok(metrics.fontSize >= 13.5 && metrics.fontSize <= 20.25);
    assert.ok(metrics.lineHeight >= 18 && metrics.lineHeight <= 27);
    assert.ok(Math.abs(metrics.lineHeight / metrics.fontSize - 18 / 13.5) < .0001);
  }
});

test('native preference/system scaling affects font and line height exactly once', () => {
  for (const preference of [1, 1.12, 1.25, 1.4]) for (const system of [.8, 1, 1.3, 1.8, 2.5, 4]) {
    const native = atlasLegendTypography(preference * system, system, true);
    const web = atlasLegendTypography(preference * system);
    const multiplier = Math.min(1.5, system);
    assert.ok(Math.abs(native.fontSize * multiplier - web.fontSize) < .0001);
    assert.ok(Math.abs(native.lineHeight * multiplier - web.lineHeight) < .0001);
  }
});

test('number columns accommodate multi-digit labels at normal and capped sizes', () => {
  for (const scale of [1, 1.3, 1.5]) {
    assert.ok(atlasLegendNumberWidth(['1', '25'], scale) >= 27 * scale);
    assert.ok(atlasLegendNumberWidth(['1', '125'], scale) > atlasLegendNumberWidth(['1', '25'], scale));
  }
});

test('shared list preserves assigned numbers and long names without fixed heights or truncation', () => {
  const viewer = fs.readFileSync(new URL('../components/AnatomyImageViewer.tsx', import.meta.url), 'utf8');
  const legend = fs.readFileSync(new URL('../components/AtlasLegend.tsx', import.meta.url), 'utf8');
  assert.match(viewer, /number: questionHotspotCallouts \? annotationIndex\(hotspots, label\) \+ 1 : index \+ 1/);
  assert.match(viewer, /name: label\.displayLabel/);
  assert.match(legend, /locale\.number\(entry\.number\)/);
  assert.doesNotMatch(legend, /numberOfLines|ellipsizeMode|ScrollView|maxHeight/);
  assert.match(legend, /allowFontScaling maxFontSizeMultiplier/);
  assert.match(legend, /flex: 1, minWidth: 0/);
});
