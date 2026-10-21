import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('all module content uses the shared shell and the actual localized title at every text size', () => {
  const page = read('app/module/[id].tsx');
  assert.match(page, /<ModuleScreen title=\{localizedModule\.title\}>/);
  assert.match(page, /<ModuleScreen title=\{t\('module\.unavailableTitle'\)\}>/);
  assert.doesNotMatch(page, /responsiveNavigationTitle|<Stack\.Screen/);
  assert.match(page, /onPress=\{\(\) => router\.back\(\)\}/);
});

test('the module stack owns top safe area while content keeps its ordinary reading gap', () => {
  const shell = read('components/ModuleScreen.tsx');
  const screen = read('components/Screen.tsx');
  assert.match(shell, /headerBackTitle: t\('tabs\.study'\)/);
  assert.match(shell, /headerTransparent: false/);
  assert.match(shell, /header: \(props\) => <ModuleHeader/);
  assert.match(shell, /paddingTop: insets\.top/);
  assert.match(shell, /<HeaderBackButton/);
  assert.match(shell, /onPress=\{\(\) => navigation\.goBack\(\)\}/);
  assert.doesNotMatch(shell, /module-navigation-title/);
  assert.doesNotMatch(shell, /numberOfLines|ellipsizeMode/);
  assert.match(shell, /<Screen belowHeader>/);
  assert.match(screen, /belowHeader = false/);
  assert.match(screen, /paddingTop: belowHeader \? 0 : insets\.top/);
  assert.match(screen, /contentInsetAdjustmentBehavior: 'never'/);
  assert.match(screen, /automaticallyAdjustContentInsets: false/);
  assert.match(screen, /paddingTop: 18/);
});

test('redundant navigation titles are removed app-wide without removing back navigation', () => {
  const root = read('app/_layout.tsx');
  const tabs = read('app/(tabs)/_layout.tsx');
  const page = read('app/module/[id].tsx');
  assert.match(root, /headerTitle: \(\) => null/);
  assert.match(tabs, /headerShown: false/);
  assert.doesNotMatch(tabs, /headerShown: !reflow/);
  assert.match(page, /<Heading[\s\S]*?localizedModule\.title/);
});
