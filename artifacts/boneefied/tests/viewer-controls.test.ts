import test from 'node:test';
import assert from 'node:assert/strict';
import { viewerControlRows, VIEWER_CONTROL_GAP, VIEWER_CONTROL_PADDING, type ViewerControlName } from '../components/viewerControlLayout.ts';

const names: ViewerControlName[] = ['zoom-in', 'zoom-out', 'reset', 'reveal-all', 'hide-all'];

test('compact row is used whenever the five measured labels fit', () => {
  const rows = viewerControlRows(348, { 'zoom-in': 40, 'zoom-out': 47, reset: 30, 'reveal-all': 51, 'hide-all': 41 }, true);
  assert.equal(rows.length, 1);
  assert.deepEqual(rows.flat().map(cell => cell.name), names);
});

test('phone widths and enlarged labels preserve every action and comfortable non-overlapping cells', () => {
  for (const width of [239, 278, 301, 348, 390]) for (const scale of [1, 1.3, 1.8, 2.5, 2.8, 4]) {
    for (const base of [[40, 47, 30, 51, 41], [42, 36, 72, 82, 82]]) {
      const widths = Object.fromEntries(names.map((name, index) => [name, base[index] * scale]));
      const rows = viewerControlRows(width, widths, true);
      assert.deepEqual(rows.flat().map(cell => cell.name), names);
      for (const row of rows) {
        assert.ok(row.every(cell => cell.width >= 44));
        const occupied = row.reduce((sum, cell) => sum + cell.width, 0) + (row.length - 1) * VIEWER_CONTROL_GAP;
        assert.ok(Math.abs(occupied - (width - VIEWER_CONTROL_PADDING * 2)) < .001, `${width}/${scale}`);
        for (const cell of row) assert.ok(cell.width >= Math.min(width - 12, Math.ceil(widths[cell.name]) + 14));
      }
    }
  }
});

test('overflow splits only when needed, grouping zoom and reveal actions rather than wrapping randomly', () => {
  const rows = viewerControlRows(239, { 'zoom-in': 40, 'zoom-out': 47, reset: 30, 'reveal-all': 51, 'hide-all': 41 }, true);
  assert.deepEqual(rows.map(row => row.map(cell => cell.name)), [names.slice(0, 3), names.slice(3)]);
});

test('unlabelled or already-revealed diagrams retain their existing three-action mode', () => {
  assert.deepEqual(viewerControlRows(301, {}, false).flat().map(cell => cell.name), names.slice(0, 3));
});

test('a tight Large-text row budgets both button borders so Reset cannot split inside a word', () => {
  const widths = { 'zoom-in': 52, 'zoom-out': 59, reset: 34, 'reveal-all': 63, 'hide-all': 52 };
  const rows = viewerControlRows(348, widths, true);
  assert.equal(rows.length, 2);
  const reset = rows.flat().find(cell => cell.name === 'reset')!;
  assert.ok(reset.width - 12 - 2 >= widths.reset);
});
