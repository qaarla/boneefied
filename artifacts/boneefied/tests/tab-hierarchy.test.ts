import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { moduleCategory, moduleMatchesCategory, practiceParent, studyParent } from '../navigation/tabHierarchy.ts';
import { content } from '../content/canonical.ts';

const modules = [
  { id: 'cytology-mitosis' },
  { id: 'skeletal-system', system: 'Skeletal' },
  { id: 'nervous-system', system: 'nervous' },
  { id: 'new-module', system: 'new-system' },
];
const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('every real published module has a matching logical category, including legacy sparse metadata', () => {
  for (const module of content.modules.filter(item => item.published)) {
    const parent = studyParent(`/module/${module.id}`, content.modules);
    assert.equal(parent?.pathname, '/(tabs)/(study)');
    assert.ok(parent?.params?.system, module.id);
    assert.ok(moduleMatchesCategory(module, parent.params.system), module.id);
  }
  const legacy = content.modules.find(item => item.id === 'cytology-mitosis')!;
  assert.equal(moduleCategory(legacy), 'cell');
});

test('Study content has a declared system overview parent even on a cold detail link', () => {
  assert.deepEqual(studyParent('/module/cytology-mitosis', modules), {
    pathname: '/(tabs)/(study)', params: { system: 'cell' },
  });
  assert.deepEqual(studyParent('/module/skeletal-system', modules), {
    pathname: '/(tabs)/(study)', params: { system: 'skeletal-system' },
  });
  assert.equal(moduleCategory(modules[2], 'nerves'), 'nerves');
  assert.equal(moduleCategory(modules[2], 'digestive'), 'nervous', 'unrelated parents are rejected');
  assert.equal(moduleCategory(modules[3]), 'new-module', 'new content still has a filterable overview');
  assert.deepEqual(studyParent('/module/unknown', modules), { pathname: '/(tabs)/(study)' });
});

test('terms and word parts skip browsing history and intermediate topics', () => {
  assert.deepEqual(studyParent('/glossary/humerus', modules, { q: 'bone' }), {
    pathname: '/glossary', params: { q: 'bone' },
  });
  assert.deepEqual(studyParent('/glossary/word-part/osteo', modules), {
    pathname: '/glossary/word-parts', params: undefined,
  });
  for (const path of ['/glossary', '/glossary/word-parts', '/settings']) {
    assert.deepEqual(studyParent(path, modules), { pathname: '/(tabs)/(study)' });
  }
  assert.equal(studyParent('/', modules), null);
});

test('Practice reselection takes exactly one step and is a no-op at root', () => {
  for (const phase of ['quiz', 'results'] as const) {
    assert.equal(practiceParent(phase, true), 'category');
    assert.equal(practiceParent(phase, false), 'category');
  }
  assert.equal(practiceParent('setup', true), 'root');
  assert.equal(practiceParent('setup', false), null);
});

test('classic and native reselection disable built-in root resets without changing section switches', () => {
  const tabs = read('app/(tabs)/_layout.tsx');
  assert.equal((tabs.match(/disablePopToTop disableScrollToTop/g) ?? []).length, 4);
  assert.match(tabs, /if \(!navigation\.isFocused\(\)\) return/);
  assert.match(tabs, /event\.preventDefault\(\)/);
  for (const section of ['study', 'practice', 'missed', 'progress']) {
    assert.ok(tabs.includes(`if (navigation.isFocused()) up('${section}')`));
  }
  assert.doesNotMatch(tabs, /resetStudyStack|router\.navigate|router\.back/);
  const registry = read('context/TabHierarchy.tsx');
  assert.match(registry, /useFocusEffect/);
  assert.match(registry, /actions\.current\.get\(section\) === action/);
});

test('going up preserves Practice drafts and never scores, ends, or clears a session', () => {
  const practice = read('app/(tabs)/practice.tsx');
  const up = practice.match(/useTabUpAction\('practice', \(\) => \{([\s\S]*?)\n  \}\);/)?.[1];
  assert.ok(up);
  assert.match(up, /saveDraft\(answer\)/);
  assert.match(up, /setPhase\('setup'\)/);
  assert.doesNotMatch(up, /submitSessionAnswer|submit\(|completeSession|setAnswer\(|setQuestions\(|setAnswers\(|setSessionId\(/);
  const restore = practice.slice(practice.indexOf("if (activeSession && phase === 'setup')"), practice.indexOf('const start ='));
  assert.doesNotMatch(restore, /setPhase\('quiz'\)/, 'restoring a session cannot bypass the category overview');
  assert.match(practice, /testID="practice-root"/);
  assert.match(practice, /testID="resume-practice"/);
});
