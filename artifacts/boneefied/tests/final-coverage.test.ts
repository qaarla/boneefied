import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { content } from '../content/canonical.ts';
import { bvis04Questions } from '../content/bvis04-questions.ts';
import { bvis04Plates } from '../content/bvis04-plates.generated.ts';
import { bvis05Questions } from '../content/bvis05-questions.ts';
import { bvis06Questions } from '../content/bvis06-questions.ts';
import { bvis06Plates } from '../content/bvis06-plates.generated.ts';
import { bvis05Plates } from '../content/bvis05-plates.generated.ts';
import { isQuestionScorable, resolvePublishedModule } from '../content/study.ts';
import { validateContent } from '../content/validation.ts';

test('BAC04 context stays in existing cards and every comparison is source-owned and playable', () => {
  const ids = [
    'skin-aging','bone-loss','joint-cartilage','muscle-atrophy','disc-and-nerve',
    'arterial-plaque','alveolar-walls','liver-scarring','prostatic-urethra',
    'enlarged-prostate','uterine-fibroid',
  ];
  const questions = content.questions.filter((item) => item.id.startsWith('q-bac04-'));
  assert.equal(questions.length, 22);
  for (const id of ids) {
    const question = questions.find((item) => item.id === `q-bac04-${id}`);
    assert.ok(question, id);
    assert.ok(isQuestionScorable(question, content), id);
    assert.equal(question.taskType, 'multiple-choice');
    assert.ok(question.options?.includes(question.answer as string));
    assert.ok(content.sources.some((source) => source.id === question.sourceId && source.verificationStatus === 'verified' && source.sourceUrl));
    const module = resolvePublishedModule(content, question.moduleId);
    assert.ok(module?.lessons?.some((lesson) => lesson.sourceIds.includes(question.sourceId)
      && question.structureIds.some((structureId) => lesson.structureIds.includes(structureId))
      && lesson.relationships.some((line) => /atrophy|aging|osteopor|osteoarth|herniat|plaque|emphysema|cirrhosis|enlarge|fibroid/i.test(line))), id);
  }
  assert.deepEqual(validateContent(content), []);
});

test('the assembled catalog matches its manifest and every lesson has related practice', () => {
  const manifest = JSON.parse(readFileSync(new URL('../content/module-manifest.json', import.meta.url), 'utf8')) as {
    modules: Array<{ id: string; structures: number; lessons: number; assets: number; questions: number }>;
  };
  assert.equal(content.modules.length, 18);
  assert.equal(content.structures.length, 1126);
  assert.equal(content.modules.reduce((sum, module) => sum + (module.lessons?.length ?? 0), 0), 152);
  assert.equal(content.questions.length, 904 + bvis04Questions.length + bvis05Questions.length + bvis06Questions.length);
  assert.equal(content.assets.length, 97 + bvis04Plates.filter((p) => !p.replaces).length + bvis05Plates.length + bvis06Plates.length);
  for (const module of content.modules) {
    const record = manifest.modules.find((entry) => entry.id === module.id);
    assert.ok(record, module.id);
    const structures = content.structures.filter((item) => item.moduleId === module.id);
    const questions = content.questions.filter((item) => item.moduleId === module.id);
    const lessons = module.lessons ?? [];
    const lessonAssets = new Set(lessons.flatMap((lesson) => lesson.assetIds ?? []));
    assert.deepEqual([structures.length, lessons.length, lessonAssets.size, questions.length],
      [record.structures, record.lessons, record.assets, record.questions], module.id);
    assert.ok(module.published && module.visible && module.contentStatus === 'available', module.id);
    assert.ok(structures.length > 0 && lessons.length > 0 && questions.length >= 18, module.id);
    assert.ok(questions.some((item) => isQuestionScorable(item, content)), module.id);
    for (const lesson of lessons) {
      assert.ok(questions.filter((item) => isQuestionScorable(item, content)
        && item.structureIds.some((id) => lesson.structureIds.includes(id))).length >= 2, `${module.id}:${lesson.id}`);
    }
  }
});

test('every displayed Study selector opens a nonempty module with Search terms and Practice questions', () => {
  const page = readFileSync(new URL('../app/(tabs)/index.tsx', import.meta.url), 'utf8');
  const selectorSource = page.match(/const systems = \[([\s\S]*?)\] as const;/)?.[1];
  assert.ok(selectorSource);
  const selectors = [...selectorSource.matchAll(/\['[^']+', '([^']+)'\]/g)].map((match) => match[1]);
  assert.equal(selectors.length, 17);
  const supported = new Set([
    'multiple-choice','typed-recall','ordered-sequence','select-all','bone-laterality',
    'function-relationship','muscle-action','muscle-origin-insertion','image-identification',
    'hotspot','histology-identification',
  ]);
  for (const selector of selectors) {
    const matches = content.modules.filter((module) => module.visible && module.published
      && (module.system === selector || module.id === selector || (selector === 'nerves' && module.id === 'nervous-system')));
    assert.ok(matches.length > 0, selector);
    assert.ok(matches.every((module) => module.lessons?.length
      && content.structures.some((item) => item.moduleId === module.id && item.canonicalName)
      && content.questions.some((item) => item.moduleId === module.id && supported.has(item.taskType)
        && isQuestionScorable(item, content))), selector);
  }
  assert.ok(resolvePublishedModule(content, 'anatomy-foundations')?.lessons?.length);
  assert.ok(resolvePublishedModule(content, 'cytology-mitosis')?.lessons?.length);
});