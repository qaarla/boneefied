import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('all module content uses the shared shell and the actual localized title at every text size', () => {
  const page = read('app/(tabs)/(study)/module/[id].tsx');
  assert.match(page, /<ModuleScreen title=\{localizedModule\.title\}>/);
  assert.match(page, /<ModuleScreen title=\{t\('module\.unavailableTitle'\)\}>/);
  assert.doesNotMatch(page, /responsiveNavigationTitle|<Stack\.Screen/);
  assert.doesNotMatch(page, /router\.back\(\)|module\.returnToLibrary/);
});

test('the dock replaces module headers and Screen owns safe area and reading gap', () => {
  const shell = read('components/ModuleScreen.tsx');
  const screen = read('components/Screen.tsx');
  assert.match(shell, /headerShown: false/);
  assert.doesNotMatch(shell, /HeaderBackButton|ModuleHeader/);
  assert.doesNotMatch(shell, /module-navigation-title/);
  assert.doesNotMatch(shell, /numberOfLines|ellipsizeMode/);
  assert.match(shell, /<Screen systemHeading>/);
  assert.match(screen, /belowHeader = false/);
  assert.match(screen, /paddingTop: belowHeader \? 0 : insets\.top/);
  assert.match(screen, /contentInsetAdjustmentBehavior: 'never'/);
  assert.match(screen, /automaticallyAdjustContentInsets: false/);
  assert.match(screen, /paddingTop: systemHeading \? SYSTEM_HEADING_TOP_GAP : PAGE_CONTENT_TOP_GAP/);
  assert.match(screen, /systemHeading = false/);
  assert.doesNotMatch(read('app/(tabs)/(study)/index.tsx'), /<Screen[^>]*systemHeading/);
  assert.match(screen, /usePageInsets/);
});

test('redundant navigation titles are removed app-wide while preserving page headings', () => {
  const root = read('app/_layout.tsx');
  const tabs = read('app/(tabs)/_layout.tsx');
  const page = read('app/(tabs)/(study)/module/[id].tsx');
  assert.match(root, /headerTitle: \(\) => null/);
  assert.match(tabs, /headerShown: false/);
  assert.doesNotMatch(tabs, /headerShown: !reflow/);
  assert.match(page, /<Heading[\s\S]*?localizedModule\.title/);
});

test('all study routes are nested inside the persistent four-option dock', () => {
  const tabs = read('app/(tabs)/_layout.tsx');
  const nested = read('app/(tabs)/(study)/_layout.tsx');
  assert.match(nested, /initialRouteName="index"/);
  assert.match(nested, /headerShown: false/);
  assert.match(tabs, /NativeTabs\.Trigger name="\(study\)"/);
  assert.match(tabs, /name="\(study\)" disablePopToTop disableScrollToTop listeners=/);
  assert.match(read('context/TabHierarchy.tsx'), /router\.dismissTo\(parent\)/);
  assert.doesNotMatch(tabs, /navigation\.getState\(\)/);
  for (const path of ['index.tsx', 'module/[id].tsx', 'glossary/index.tsx', 'glossary/[id].tsx', 'glossary/word-parts.tsx', 'glossary/word-part/[id].tsx', 'settings.tsx']) {
    assert.ok(read(`app/(tabs)/(study)/${path}`).length > 0, path);
  }
  for (const path of ['glossary/index.tsx', 'glossary/word-parts.tsx']) {
    assert.match(read(`app/(tabs)/(study)/${path}`), /paddingBottom: bottomPadding/);
  }
});

test('headerless pages retain window safe-area clearance and a shared reading gap', () => {
  const root = read('app/_layout.tsx');
  const insets = read('context/PageInsets.tsx');
  assert.match(root, /SafeAreaProvider initialMetrics=\{initialWindowMetrics\}/);
  assert.match(root, /<PageInsetsProvider>/);
  assert.match(insets, /top: resolvePageTopInset\(/);
  assert.match(insets, /windowTop: windowInsets\?\.top/);
  assert.match(insets, /localTop: localInsets\.top/);
  assert.match(read('context/pageInsetsPolicy.ts'), /PAGE_CONTENT_TOP_GAP = 32/);
  assert.match(read('context/pageInsetsPolicy.ts'), /SYSTEM_HEADING_TOP_GAP = 40/);
  assert.match(read('components/ModuleScreen.tsx'), /<Screen systemHeading>/);
  for (const path of ['components/Screen.tsx', 'app/(tabs)/(study)/glossary/index.tsx', 'app/(tabs)/(study)/glossary/word-parts.tsx']) {
    assert.match(read(path), /usePageInsets/);
    assert.match(read(path), /paddingTop: (?:systemHeading \? SYSTEM_HEADING_TOP_GAP : )?PAGE_CONTENT_TOP_GAP/);
  }
});

test('headings are centered and module headers no longer show system-code eyebrows', () => {
  const text = read('components/ScaledText.tsx');
  const page = read('app/(tabs)/(study)/module/[id].tsx');
  assert.match(text, /fontWeight: '700', textAlign: 'center'/);
  assert.doesNotMatch(page, /localizedModule\.system\?\.toUpperCase/);
  assert.match(page, /styles\.intro, \{ textAlign: 'center'/);
  assert.match(page, /styles\.meta, \{ textAlign: 'center'/);
  assert.match(page, /styles\.lessonTitle, \{ textAlign: 'center'/);
  assert.match(page, /styles\.lessonSummary, \{ textAlign: 'center'/);
});
