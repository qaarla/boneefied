import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const tabs = read('app/(tabs)/_layout.tsx');

test('reference dock retains all four existing destinations and navigation handlers', () => {
  assert.deepEqual([...tabs.matchAll(/<NativeTabs\.Trigger name="([^"]+)"/g)].map(match => match[1]), [
    '(study)', 'practice', 'missed', 'progress',
  ]);
  assert.match(tabs, /if \(!navigation\.isFocused\(\)\) return/);
  assert.match(tabs, /<TabHierarchyProvider>/);
});

test('reference icons and labels use Boneefied colors on classic and native tabs', () => {
  assert.match(tabs, /iconColor=\{\{ default: colors\.foreground, selected: colors\.primary \}\}/);
  assert.match(tabs, /tabBarActiveTintColor: colors\.primary/);
  assert.match(tabs, /tabBarInactiveTintColor: colors\.foreground/);
  assert.match(tabs, /name=\{focused \? "home" : "home-outline"\}/);
  assert.match(tabs, /fontFamily: APP_FONTS\.bold, fontWeight: 'normal', fontSize: 13/);
  assert.match(tabs, /tabBarIconStyle: \{ width: 32, height: 32 \}/);
  assert.doesNotMatch(tabs, /\bas any\b/);
});

test('reference dock has safe content clearance and retains large-text reflow', () => {
  const clearance = read('hooks/useDockClearance.ts');
  assert.match(tabs, /height: 72 \+ insets\.bottom/);
  assert.match(tabs, /height: 92/);
  assert.match(tabs, /flexWrap: 'wrap'/);
  assert.match(tabs, /minHeight: 44/);
  assert.match(clearance, /: 126/);
  assert.match(clearance, /104 \* \(shouldReflow/);
});
