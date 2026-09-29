import assert from 'node:assert/strict';
import test from 'node:test';
import { dynamicTypeRampForSize, nativeHeaderTitleSize, needsCompactTextLayout, needsExpandedTabLayout, needsLargeTextLayout, needsResponsiveTextLayout, typographyMetrics, type TextScale } from '../context/typographyScale.ts';

test('each preference produces a distinct, proportional type size and line height', () => {
  const choices: TextScale[] = ['small', 'default', 'large'];
  const metrics = choices.map((choice) => typographyMetrics(16, 24, choice));
  assert.ok(metrics[0].fontSize < metrics[1].fontSize);
  assert.ok(metrics[1].fontSize < metrics[2].fontSize);
  assert.equal(metrics[1].fontSize, 16);
  assert.equal(metrics[1].lineHeight, 24);
  for (const metric of metrics) {
    assert.equal(metric.lineHeight / metric.fontSize, 1.5);
    assert.ok(metric.fontSize >= 14 && metric.fontSize <= 18);
  }
  assert.deepEqual(typographyMetrics(14, undefined, 'small'), { fontSize: 12.6 });
});

test('system Larger Text combines with the app preference only in layout and native headers', () => {
  assert.equal(nativeHeaderTitleSize(18, 'default', 1), 18);
  assert.ok(Math.abs(nativeHeaderTitleSize(18, 'large', 1) - 20.16) < 0.0001);
  assert.equal(nativeHeaderTitleSize(18, 'default', 2.5), 45);
  assert.ok(Math.abs(nativeHeaderTitleSize(18, 'large', 2.5) - 50.4) < 0.0001);
  assert.equal(needsLargeTextLayout(1, 'large'), false);
  assert.equal(needsLargeTextLayout(1.4, 'large'), true);
  assert.equal(needsLargeTextLayout(2.5, 'small'), true);
  // App style metrics never include the OS factor: React Native scales Text itself.
  assert.deepEqual(typographyMetrics(16, 24, 'default'), { fontSize: 16, lineHeight: 24 });
});

test('responsive text layout covers default, narrow, enlarged, accessibility, and wide layouts', () => {
  assert.equal(needsResponsiveTextLayout(390, 1, 'default'), false);
  assert.equal(needsResponsiveTextLayout(320, 1.3, 'default'), true);
  assert.equal(needsResponsiveTextLayout(390, 1.8, 'default'), true);
  assert.equal(needsResponsiveTextLayout(390, 2.5, 'default'), true);
  assert.equal(needsResponsiveTextLayout(768, 1.3, 'default'), false);
});

test('classic navigation expands to two columns before enlarged labels need shrinking', () => {
  assert.equal(needsExpandedTabLayout(1, 'default'), false);
  assert.equal(needsExpandedTabLayout(1.8, 'default'), false);
  assert.equal(needsExpandedTabLayout(1.8, 'large'), true);
  assert.equal(needsExpandedTabLayout(2.5, 'default'), true);
});

test('narrow phones reflow before text gets squeezed, while default and wide layouts stay put', () => {
  assert.equal(needsCompactTextLayout(390, 1, 'default'), false);
  assert.equal(needsCompactTextLayout(320, 1, 'default'), false);
  assert.equal(needsCompactTextLayout(390, 1.3, 'default'), true);
  assert.equal(needsCompactTextLayout(430, 1.3, 'default'), false);
  assert.equal(needsCompactTextLayout(768, 2, 'default'), false);
  assert.equal(needsCompactTextLayout(320, 1, 'large'), true);
});

test('iOS text roles select Dynamic Type ramps without changing base point sizes', () => {
  assert.equal(dynamicTypeRampForSize(11), 'footnote');
  assert.equal(dynamicTypeRampForSize(16), 'body');
  assert.equal(dynamicTypeRampForSize(18), 'headline');
  assert.equal(dynamicTypeRampForSize(29), 'title1');
  assert.equal(dynamicTypeRampForSize(40), 'largeTitle');
});