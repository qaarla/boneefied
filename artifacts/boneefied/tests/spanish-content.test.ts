import assert from 'node:assert/strict';
import test from 'node:test';
import { content } from '../content/canonical.ts';
import { bvis04Questions } from '../content/bvis04-questions.ts';
import { bvis05Questions } from '../content/bvis05-questions.ts';
import { bvis06Questions } from '../content/bvis06-questions.ts';
import { createGlossaryIndex } from '../content/glossary.ts';
import { answerIsCorrect } from '../content/study.ts';
import {
  canonicalOptionForSpanish, requireSpanishQuestion, spanishAssets, spanishGlossary, spanishResponseForScoring,
  spanishGlossaryGroups, spanishModules, spanishSources, spanishUi, spanishUiGroups,
} from '../locales/es/index.ts';

const sorted = (values: Iterable<string>) => [...values].sort();
const keys = (record: object) => Object.keys(record);
const equalIds = (actual: object, expected: string[], label: string) =>
  assert.deepEqual(sorted(keys(actual)), sorted(expected), label);
const text = (value: unknown, label: string) => {
  assert.equal(typeof value, 'string', label);
  assert.ok((value as string).trim(), label);
};
const textPair = (original: string, translated: unknown, label: string) => {
  text(translated, label);
  const numerals = (value: string) => sorted(value.match(/\d+/g) ?? []);
  assert.deepEqual(numerals(translated as string), numerals(original), `${label}: numerical values changed`);
};
const optional = (original: string | undefined | null, localized: unknown, label: string) => {
  if (original == null) assert.equal(localized, undefined, `${label}: unexpectedly added`);
  else textPair(original, localized, label);
};
const list = (original: readonly string[], localized: readonly string[], label: string) => {
  assert.ok(Array.isArray(localized), label);
  assert.equal(localized.length, original.length, label);
  localized.forEach((value, index) => textPair(original[index], value, `${label}[${index}]`));
};

test('Spanish learning catalog matches every assembled English entity, field and array shape', () => {
  equalIds(spanishModules, content.modules.map((module) => module.id), 'modules');
  assert.equal(content.modules.length, 18);
  assert.equal(content.modules.flatMap((module) => module.lessons ?? []).length, 152);
  assert.equal(content.structures.length, 1126);
  assert.equal(content.questions.length, 904 + bvis04Questions.length + bvis05Questions.length + bvis06Questions.length);

  for (const module of content.modules) {
    const es = spanishModules[module.id];
    assert.ok(es, module.id);
    textPair(module.title, es.module.title, `${module.id}.title`);
    for (const field of ['summary', 'system', 'category'] as const) {
      optional(module[field], es.module[field], `${module.id}.${field}`);
    }
    const lessons = module.lessons ?? [];
    equalIds(es.lessons, lessons.map((lesson) => lesson.id), `${module.id}.lessons`);
    for (const lesson of lessons) {
      const translated = es.lessons[lesson.id];
      textPair(lesson.title, translated.title, `${lesson.id}.title`);
      textPair(lesson.summary, translated.summary, `${lesson.id}.summary`);
      for (const field of ['recognitionCues', 'landmarks', 'relationships', 'commonConfusions'] as const) {
        list(lesson[field], translated[field], `${lesson.id}.${field}`);
      }
    }
    const structures = content.structures.filter((structure) => structure.moduleId === module.id);
    equalIds(es.structures, structures.map((structure) => structure.id), `${module.id}.structures`);
    for (const structure of structures) {
      const translated = es.structures[structure.id];
      textPair(structure.canonicalName, translated.name, `${structure.id}.name`);
      textPair(structure.category, translated.category, `${structure.id}.category`);
      list(structure.acceptedAliases, translated.aliases, `${structure.id}.aliases`);
    }
    const questions = content.questions.filter((question) => question.moduleId === module.id);
    equalIds(es.questions, questions.map((question) => question.id), `${module.id}.questions`);
    for (const question of questions) {
      const translated = requireSpanishQuestion(question);
      textPair(question.prompt, translated.prompt, `${question.id}.prompt`);
      optional(question.explanation, translated.explanation, `${question.id}.explanation`);
      list(question.acceptedAliases, translated.acceptedAliases, `${question.id}.acceptedAliases`);
      if (Array.isArray(question.answer)) {
        assert.ok(Array.isArray(translated.answer), `${question.id}.answer`);
        list(question.answer, translated.answer as readonly string[], `${question.id}.answer`);
      } else {
        assert.equal(typeof translated.answer, 'string', `${question.id}.answer`);
        textPair(question.answer, translated.answer, `${question.id}.answer`);
      }
      if (question.options) {
        assert.ok(translated.options, `${question.id}.options`);
        list(question.options, translated.options, `${question.id}.options`);
        for (let i = 0; i < translated.options!.length; i++) {
          assert.equal(canonicalOptionForSpanish(question, translated.options![i]), question.options[i], `${question.id}.option[${i}]`);
        }
        const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
        const translatedAnswers = Array.isArray(translated.answer) ? translated.answer : [translated.answer];
        answers.forEach((answer, index) => {
          const optionIndex = question.options!.indexOf(answer);
          if (optionIndex >= 0) assert.equal(translatedAnswers[index], translated.options![optionIndex], `${question.id}.answer[${index}]`);
        });
      } else assert.equal(translated.options, undefined, `${question.id}.options`);
      if (!Array.isArray(question.answer) && question.structureIds.includes(question.answer)) {
        assert.ok(content.structures.some((structure) => structure.id === question.answer), `${question.id}: canonical hotspot target missing`);
        // A Spanish answer label may differ, but the target ID in the English
        // question and its hotspot coordinates must remain untouched.
      }
    }
  }
});

test('all definitions, assets, source citations, and interface copy have Spanish sidecars', () => {
  const glossaryIds = createGlossaryIndex(content).map((entry) => entry.structure.id);
  equalIds(spanishGlossary, glossaryIds, 'glossary');
  assert.equal(spanishGlossaryGroups.flatMap(keys).length, glossaryIds.length, 'duplicate glossary keys');
  for (const entry of createGlossaryIndex(content)) {
    textPair(entry.definition, spanishGlossary[entry.structure.id], `${entry.structure.id}.definition`);
  }

  equalIds(spanishAssets, content.assets.map((asset) => asset.id), 'assets');
  for (const asset of content.assets) {
    const es = spanishAssets[asset.id];
    for (const field of ['title', 'description', 'adaptationNote', 'organism', 'specimenNote'] as const) {
      optional(asset[field], es[field], `${asset.id}.${field}`);
    }
    textPair(asset.attributionLicense, es.attributionLicense, `${asset.id}.attributionLicense`);
    if (asset.labels) list(asset.labels.map((label) => label.displayLabel), es.labels!, `${asset.id}.labels`);
    else assert.equal(es.labels, undefined, `${asset.id}.labels`);
  }
  equalIds(spanishSources, content.sources.map((source) => source.id), 'sources');
  for (const source of content.sources) {
    const es = spanishSources[source.id];
    textPair(source.title, es.title, `${source.id}.title`);
    textPair(source.notes, es.notes, `${source.id}.notes`);
    textPair(source.attributionLicenseStatus, es.attributionLicenseStatus, `${source.id}.license`);
    optional(source.courseLabAssociation, es.courseLabAssociation, `${source.id}.courseLabAssociation`);
  }
  assert.equal(content.pathways.length, 0, 'new pathways need Spanish titles');

  assert.equal(spanishUiGroups.flatMap(keys).length, keys(spanishUi).length, 'duplicate UI message keys');
  assert.ok(keys(spanishUi).length > 150, 'interface translation should not be only a menu subset');
  for (const [id, message] of Object.entries(spanishUi)) {
    text(message.en, `${id}.en`);
    text(message.es, `${id}.es`);
    textPair(message.en, message.es, `${id}.numbers`);
    assert.deepEqual(sorted(message.en.match(/\{[a-zA-Z]\w*\}/g) ?? []),
      sorted(message.es.match(/\{[a-zA-Z]\w*\}/g) ?? []), `${id}: interpolated value changed`);
  }
});

test('Spanish translation data never changes canonical English answers or persisted IDs', () => {
  const question = content.questions.find((item) => item.id === 'q-cycle-order')!;
  const original = [...question.answer];
  requireSpanishQuestion(question);
  assert.deepEqual(question.answer, original);
  assert.equal(question.id, 'q-cycle-order');
  assert.match(spanishGlossary['phalanges-foot'], /hallux.*dedo gordo/i);
  const hotspot = content.questions.find((item) => item.id === 'q-visual-lymph-node-cortex')!;
  const originalSpanishAnswer = requireSpanishQuestion(hotspot).answer as string;
  const forScoring = spanishResponseForScoring(hotspot, originalSpanishAnswer);
  assert.equal(forScoring, hotspot.answer);
  assert.ok(answerIsCorrect(forScoring, hotspot));
  assert.equal(originalSpanishAnswer, 'Corteza del ganglio linfático');
  const translatedSequence = requireSpanishQuestion(question).answer as string[];
  const canonicalSequence = spanishResponseForScoring(question, translatedSequence);
  assert.deepEqual(canonicalSequence, question.answer);
  assert.ok(answerIsCorrect(canonicalSequence, question));
  assert.equal(spanishResponseForScoring(hotspot, 'respuesta personal sin coincidencia'), 'respuesta personal sin coincidencia');
  for (const item of content.questions) {
    const localizedAnswer = requireSpanishQuestion(item).answer;
    const scoredValue = spanishResponseForScoring(item, localizedAnswer as string | string[]);
    assert.ok(answerIsCorrect(scoredValue, item), `${item.id}: Spanish correct answer cannot be scored`);
    assert.ok(answerIsCorrect(spanishResponseForScoring(item, item.answer), item), `${item.id}: English correct answer changed`);
  }
});