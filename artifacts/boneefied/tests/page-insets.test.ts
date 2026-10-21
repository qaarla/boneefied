import assert from 'node:assert/strict';
import test from 'node:test';
import { IPHONE_PREVIEW_SAFE_TOP, PAGE_CONTENT_TOP_GAP, resolvePageTopInset } from '../context/pageInsetsPolicy.ts';

const zeroInsetWeb = { platform: 'web', development: true, localTop: 0, windowTop: 0 };

test('phone-sized framed web previews reserve space for the Dynamic Island', () => {
  for (const width of [320, 390, 430, 600]) {
    assert.equal(resolvePageTopInset({ ...zeroInsetWeb, width }), IPHONE_PREVIEW_SAFE_TOP);
  }
  assert.equal(resolvePageTopInset({ ...zeroInsetWeb, width: 390 }) + PAGE_CONTENT_TOP_GAP, 99);
});

test('native iPhones retain actual insets, including nested navigators reporting zero', () => {
  for (const top of [0, 20, 47, 59, 62]) {
    for (const development of [true, false]) {
      assert.equal(resolvePageTopInset({
        platform: 'ios', development, width: 390, windowTop: top, localTop: 0,
      }), top);
    }
  }
  assert.equal(resolvePageTopInset({
    platform: 'ios', development: false, width: 390, windowTop: 59, localTop: 64,
  }), 64);
});

test('preview compensation does not alter Android, desktop or production web', () => {
  assert.equal(resolvePageTopInset({ ...zeroInsetWeb, width: 390, platform: 'android', localTop: 24 }), 24);
  assert.equal(resolvePageTopInset({ ...zeroInsetWeb, width: 900 }), 0);
  assert.equal(resolvePageTopInset({ ...zeroInsetWeb, width: 390, development: false }), 0);
  assert.equal(resolvePageTopInset({ ...zeroInsetWeb, width: 0 }), 0);
});

test('real browser safe-area measurements are never added twice or reduced', () => {
  assert.equal(resolvePageTopInset({ ...zeroInsetWeb, width: 390, windowTop: 59, localTop: 59 }), 59);
  assert.equal(resolvePageTopInset({ ...zeroInsetWeb, width: 390, windowTop: 70 }), 70);
  assert.equal(resolvePageTopInset({
    platform: 'ios', development: false, width: 430, localTop: 59,
  }) + PAGE_CONTENT_TOP_GAP, 99);
});
