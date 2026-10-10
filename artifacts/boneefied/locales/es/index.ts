import type { Question } from '../../content/model.ts';
import { normalizeAnswer } from '../../content/study.ts';
import type { SpanishAsset, SpanishModule, SpanishSource, SpanishUiMessage } from './types.ts';
import cellsTissues from './modules/cells-tissues.ts';
import lymphaticSystem from './modules/lymphatic-system.ts';
import cytologyMitosis from './modules/cytology-mitosis.ts';
import skeletalSystem from './modules/skeletal-system.ts';
import anatomyFoundations from './modules/anatomy-foundations.ts';
import jointsLigaments from './modules/joints-ligaments.ts';
import muscularSystem from './modules/muscular-system.ts';
import nervousSystem from './modules/nervous-system.ts';
import integumentarySystem from './modules/integumentary-system.ts';
import specialSenses from './modules/special-senses.ts';
import endocrineSystem from './modules/endocrine-system.ts';
import cardiovascularSystem from './modules/cardiovascular-system.ts';
import bloodVessels from './modules/blood-vessels.ts';
import respiratorySystem from './modules/respiratory-system.ts';
import digestiveSystem from './modules/digestive-system.ts';
import urinarySystem from './modules/urinary-system.ts';
import maleReproductive from './modules/male-reproductive.ts';
import femaleReproductive from './modules/female-reproductive.ts';
import glossarySkeletal from './glossary/skeletal.ts';
import glossaryFoundations from './glossary/foundations-cytology.ts';
import glossaryMovement from './glossary/movement-nervous.ts';
import glossaryCells from './glossary/cells-skin-senses.ts';
import glossaryCirculation from './glossary/endocrine-circulation.ts';
import glossaryOrganSystems from './glossary/respiratory-digestive-urinary.ts';
import glossaryReproductive from './glossary/reproductive.ts';
import assets from './assets.ts';
import sources from './sources.ts';
import uiNavigationStudy from './ui-navigation-study.ts';
import uiPracticeProgress from './ui-practice-progress.ts';
import { atlasSpanishAssets, atlasSpanishQuestions, atlasSpanishSources } from './atlas.ts';
import { muscularSpanishAssets, muscularSpanishQuestions, muscularSpanishSources } from './muscular-atlas.ts';
import { bvis04SpanishAssets, bvis04SpanishQuestions, bvis04SpanishSources } from './bvis04-atlas.ts';
import { bvis05SpanishAssets, bvis05SpanishQuestions, bvis05SpanishSources } from './bvis05-atlas.ts';
import { bvis06SpanishAssets, bvis06SpanishQuestions, bvis06SpanishSources } from './bvis06-atlas.ts';
import { skeletalSpanishAssets, skeletalSpanishQuestions, skeletalSpanishSources } from './skeletal-atlas.ts';
import uiSettingsShared from './ui-settings-shared.ts';

/** Copy-only sidecars: the English catalog remains authoritative for IDs and scoring. */
export const spanishModules: Readonly<Record<string, SpanishModule>> = {
  'cells-tissues': { ...cellsTissues, questions: { ...cellsTissues.questions, ...bvis04SpanishQuestions['cells-tissues'] } },
  'lymphatic-system': { ...lymphaticSystem, questions: { ...lymphaticSystem.questions, ...bvis05SpanishQuestions['lymphatic-system'] } },
  'cytology-mitosis': cytologyMitosis,
  'skeletal-system': { ...skeletalSystem, questions: { ...skeletalSystem.questions, ...atlasSpanishQuestions['skeletal-system'], ...skeletalSpanishQuestions['skeletal-system'] } },
  'anatomy-foundations': { ...anatomyFoundations, questions: { ...anatomyFoundations.questions, ...atlasSpanishQuestions['anatomy-foundations'] } },
  'joints-ligaments': { ...jointsLigaments, questions: { ...jointsLigaments.questions, ...skeletalSpanishQuestions['joints-ligaments'] } },
  'muscular-system': { ...muscularSystem, questions: { ...muscularSystem.questions, ...muscularSpanishQuestions } },
  'nervous-system': { ...nervousSystem, questions: { ...nervousSystem.questions, ...bvis04SpanishQuestions['nervous-system'] } },
  'integumentary-system': { ...integumentarySystem, questions: { ...integumentarySystem.questions, ...bvis04SpanishQuestions['integumentary-system'] } },
  'special-senses': { ...specialSenses, questions: { ...specialSenses.questions, ...bvis04SpanishQuestions['special-senses'] } },
  'endocrine-system': { ...endocrineSystem, questions: { ...endocrineSystem.questions, ...bvis05SpanishQuestions['endocrine-system'] } },
  'cardiovascular-system': { ...cardiovascularSystem, questions: { ...cardiovascularSystem.questions, ...bvis05SpanishQuestions['cardiovascular-system'] } },
  'blood-vessels': { ...bloodVessels, questions: { ...bloodVessels.questions, ...bvis05SpanishQuestions['blood-vessels'] } },
  'respiratory-system': { ...respiratorySystem, questions: { ...respiratorySystem.questions, ...bvis05SpanishQuestions['respiratory-system'] } },
  'digestive-system': { ...digestiveSystem, questions: { ...digestiveSystem.questions, ...bvis06SpanishQuestions['digestive-system'] } },
  'urinary-system': { ...urinarySystem, questions: { ...urinarySystem.questions, ...bvis06SpanishQuestions['urinary-system'] } },
  'male-reproductive': { ...maleReproductive, questions: { ...maleReproductive.questions, ...bvis06SpanishQuestions['male-reproductive'] } },
  'female-reproductive': { ...femaleReproductive, questions: { ...femaleReproductive.questions, ...bvis06SpanishQuestions['female-reproductive'] } },
};

export const spanishGlossaryGroups: ReadonlyArray<Readonly<Record<string, string>>> = [
  glossarySkeletal, glossaryFoundations, glossaryMovement, glossaryCells,
  glossaryCirculation, glossaryOrganSystems, glossaryReproductive,
];
export const spanishGlossary: Readonly<Record<string, string>> = Object.assign({}, ...spanishGlossaryGroups);
export const spanishAssets: Readonly<Record<string, SpanishAsset>> = { ...assets, ...atlasSpanishAssets, ...skeletalSpanishAssets, ...muscularSpanishAssets, ...bvis04SpanishAssets, ...bvis05SpanishAssets, ...bvis06SpanishAssets };
export const spanishSources: Readonly<Record<string, SpanishSource>> = { ...sources, ...atlasSpanishSources, ...skeletalSpanishSources, ...muscularSpanishSources, ...bvis04SpanishSources, ...bvis05SpanishSources, ...bvis06SpanishSources };

export const spanishUiGroups: ReadonlyArray<Readonly<Record<string, SpanishUiMessage>>> = [
  uiNavigationStudy, uiPracticeProgress, uiSettingsShared,
];
export const spanishUi: Readonly<Record<string, SpanishUiMessage>> = Object.assign({}, ...spanishUiGroups);

export function requireSpanishQuestion(question: Question) {
  const translated = spanishModules[question.moduleId]?.questions[question.id];
  if (!translated) throw new Error(`Spanish question content missing for ${question.id}`);
  return translated;
}

/** For selectable answers only: never store localized labels as canonical answer IDs. */
export function canonicalOptionForSpanish(question: Question, spanishOption: string): string | undefined {
  const options = requireSpanishQuestion(question).options;
  const index = options?.indexOf(spanishOption) ?? -1;
  return index < 0 ? undefined : question.options?.[index];
}

/**
 * Map a Spanish response to the English value used ONLY for scoring.
 * Keep the student's original response when recording an Attempt or session.
 * Unknown free text remains unchanged and is never silently rewritten.
 */
export function spanishResponseForScoring(question: Question, response: string | string[]): string | string[] {
  const translated = requireSpanishQuestion(question);
  const originalAnswers = Array.isArray(question.answer) ? question.answer : [question.answer];
  const spanishAnswers = Array.isArray(translated.answer) ? translated.answer : [translated.answer];
  const candidates: [string, string][] = [
    ...(translated.options ?? []).map((option, index): [string, string] => [option, question.options![index]]),
    ...spanishAnswers.map((answer, index): [string, string] => [answer, originalAnswers[index]]),
    ...translated.acceptedAliases.map((alias, index): [string, string] => [alias, question.acceptedAliases[index]]),
  ];
  const mapOne = (value: string) =>
    candidates.find(([spanish]) => normalizeAnswer(spanish) === normalizeAnswer(value))?.[1] ?? value;
  return Array.isArray(response) ? response.map(mapOne) : mapOne(response);
}