import assert from 'node:assert/strict';
import test from 'node:test';
import { typographyMetrics, type TextScale } from '../context/typographyScale.ts';

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