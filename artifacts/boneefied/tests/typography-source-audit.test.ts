import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appRoot = path.join(projectRoot, 'app');
const componentRoot = path.join(projectRoot, 'components');

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(absolutePath);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [absolutePath] : [];
  });
}

function readSource(file: string) {
  return readFileSync(file, 'utf8');
}

function displayPath(file: string) {
  return path.relative(projectRoot, file);
}

const appFiles = sourceFiles(appRoot);
const componentFiles = sourceFiles(componentRoot);
const mobileSources = [...appFiles, ...componentFiles].map((file) => ({ file, source: readSource(file) }));

test('mobile source keeps native Dynamic Type enabled and uncapped', () => {
  const violations: string[] = [];
  for (const { file, source } of mobileSources) {
    if (/\ballowFontScaling\s*=\s*\{\s*false\s*\}/.test(source)
      || /\ballowFontScaling\s*:\s*false\b/.test(source)) {
      violations.push(`${displayPath(file)} disables native font scaling`);
    }
    for (const match of source.matchAll(/\bmaxFontSizeMultiplier\s*(?:=\s*\{\s*(\d+(?:\.\d+)?)\s*\}|:\s*(\d+(?:\.\d+)?))/g)) {
      const multiplier = Number(match[1] ?? match[2]);
      if (multiplier > 0) violations.push(`${displayPath(file)} caps native font scaling at ${multiplier}`);
    }
  }
  assert.deepEqual(violations, []);
});

test('screens and components use shared scaled text and do not truncate reading content', () => {
  const violations: string[] = [];
  const tabLayout = path.join(appRoot, '(tabs)', '_layout.tsx');
  const sharedText = path.join(componentRoot, 'ScaledText.tsx');

  for (const file of [...appFiles, ...componentFiles]) {
    let source = readSource(file);
    const relative = displayPath(file);
    const isFontSetup = relative === 'app/_layout.tsx';
    const isTabLayout = file === tabLayout;
    const isSharedText = file === sharedText;

    const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    for (const statement of parsed.statements) {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)
        || statement.moduleSpecifier.text !== 'react-native') continue;
      const bindings = statement.importClause?.namedBindings;
      if (!bindings || !ts.isNamedImports(bindings)) continue;
      const directTextImports = bindings.elements
        .filter((element) => ['Text', 'TextInput'].includes((element.propertyName ?? element.name).text))
        .map((element) => `${(element.propertyName ?? element.name).text} as ${element.name.text}`);
      if (directTextImports.length && !isFontSetup && !isSharedText
        && !(isTabLayout && directTextImports.length === 1 && directTextImports[0] === 'Text as NativeText')) {
        violations.push(`${relative} imports React Native ${directTextImports.join(', ')} directly`);
      }
    }

    if (isTabLayout) {
      const nativeLabel = source.match(/<NativeText\b[\s\S]*?<\/NativeText>/)?.[0];
      assert.ok(nativeLabel, 'the classic tab label should remain a native, single-line control');
      assert.match(nativeLabel, /allowFontScaling\b/);
      assert.match(nativeLabel, /maxFontSizeMultiplier=\{0\}/);
      assert.match(nativeLabel, /numberOfLines=\{1\}/);
      assert.match(nativeLabel, /adjustsFontSizeToFit/);
      source = source.replace(nativeLabel, '');
    }
    if (!isSharedText && /numberOfLines\s*=/.test(source)) {
      violations.push(`${relative} truncates reading text with numberOfLines`);
    }
  }

  assert.deepEqual(violations, []);
});

test('fixed-height styles do not constrain font-sized reading content', () => {
  const violations: string[] = [];
  for (const { file, source } of mobileSources) {
    // Inspect flat object literals only, and only fixed numeric heights paired
    // with typography metrics. Image, hotspot, and tab-bar geometry is not a
    // violation unless the same style object also fixes text dimensions.
    for (const match of source.matchAll(/\{([^{}]*)\}/gs)) {
      const style = match[1];
      if (/\bheight\s*:\s*\d+(?:\.\d+)?\b/.test(style)
        && /\b(?:fontSize|lineHeight)\s*:/.test(style)) {
        violations.push(`${displayPath(file)} has a fixed-height typography style: ${style.trim().replace(/\s+/g, ' ')}`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test('shared typography and layout primitives preserve responsive content contracts', () => {
  const scaledText = readSource(path.join(componentRoot, 'ScaledText.tsx'));
  assert.match(scaledText, /export const Text = forwardRef/);
  assert.match(scaledText, /export const TextInput = forwardRef/);
  assert.match(scaledText, /export const Heading = forwardRef/);
  assert.match(scaledText, /allowFontScaling=\{Platform\.OS === 'web' \? props\.allowFontScaling : true\}/);
  assert.match(scaledText, /maxFontSizeMultiplier=\{Platform\.OS === 'web' \? props\.maxFontSizeMultiplier : 0\}/);
  assert.match(scaledText, /numberOfLines=\{needsResponsiveTextLayout\(width, systemFontScale, preference\) \? undefined : props\.numberOfLines\}/);
  assert.match(scaledText, /numberOfLines=\{undefined\}/);
  assert.match(scaledText, /multiline=\{props\.multiline \?\? shouldReflow\}/);

  const screen = readSource(path.join(componentRoot, 'Screen.tsx'));
  assert.match(screen, /insets\.bottom/);
  assert.match(screen, /paddingBottom: bottomPadding/);
  assert.match(screen, /insets\.bottom \+ 96 \* \(shouldReflow \? Math\.max\(1, systemFontScale\) : 1\)/);

  const adaptiveLayout = readSource(path.join(componentRoot, 'AdaptiveLayout.tsx'));
  assert.match(adaptiveLayout, /export function AdaptiveRow/);
  assert.match(adaptiveLayout, /shouldReflow && styles\.stacked/);
  assert.match(adaptiveLayout, /export function AdaptiveCard/);
  assert.match(adaptiveLayout, /card: \{ minWidth: 0 \}/);
  assert.match(adaptiveLayout, /export function AdaptiveButton/);
  assert.match(adaptiveLayout, /button: \{ minWidth: 0, minHeight: 44/);

  const tabs = readSource(path.join(appRoot, '(tabs)', '_layout.tsx'));
  assert.match(tabs, /tabBar=\{isExpandedTabLayout \?/);
  assert.match(tabs, /flexWrap: 'wrap'/);
  assert.match(tabs, /width: '50%'/);
  assert.match(tabs, /<Text style=\{\{ color, fontSize: 11, textAlign: 'center' \}\}>\{label\}<\/Text>/);
  assert.match(tabs, /aria-selected=\{Platform\.OS === 'web' \? focused : undefined\}/);
  assert.doesNotMatch(tabs, /expandedBar:\s*\{[^}]*\bheight\s*:/);
});