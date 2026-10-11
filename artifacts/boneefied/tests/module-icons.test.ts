import assert from 'node:assert/strict';
import test from 'node:test';
import { content } from '../content/canonical.ts';
import { moduleIconKeyById, moduleIconShapes } from '../components/moduleIconCatalog.ts';

test('every runtime module has a unique explicit icon with shapes', () => {
  const ids = content.modules.map((m) => m.id);
  const keys = ids.map((id) => moduleIconKeyById[id]);
  assert.ok(keys.every(Boolean), 'unmapped: ' + ids.filter((id) => !moduleIconKeyById[id]).join());
  assert.equal(new Set(keys).size, keys.length);
  assert.deepEqual(Object.keys(moduleIconKeyById).sort(), [...ids].sort());
  for (const k of keys) assert.ok(moduleIconShapes[k].length > 0);
});
