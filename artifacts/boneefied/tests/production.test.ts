import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { content, CYTOLOGY_SOURCE_ID } from '../content/canonical.ts';
import { GRAY_SOURCE_ID, OPENSTAX_SOURCE_ID } from '../content/anatomy.ts';
import { validateContent } from '../content/validation.ts';
import { sourceCitation } from '../content/sources.ts';
import { ORIGINAL_VISUAL_SOURCE_ID } from '../content/visual-content.ts';
import {
  completeSession,
  hydrateStudyState,
  isQuestionScorable,
  serializeStudyState,
  submitSessionAnswer,
  upsertSession,
} from '../content/study.ts';
import type { PracticeSession } from '../content/model.ts';
import { endocrineModule, endocrineStructures, cardiovascularModule, cardiovascularStructures, vesselsModule, vesselsStructures, lymphaticModule, lymphaticStructures } from '../content/circulation-systems.ts';
import { organSystemsModules, organSystemsStructures } from '../content/organ-systems.ts';
import { skeletalPracticeExpansion } from '../content/practice-skeletal-expansion.ts';
import { muscularPracticeExpansion, nervousPracticeExpansion } from '../content/practice-neuromuscular-expansion.ts';
import { respiratoryPracticeExpansion, digestivePracticeExpansion, urinaryPracticeExpansion, malePracticeExpansion, femalePracticeExpansion } from '../content/practice-organ-expansion.ts';
import { jointsPracticeExpansion, foundationsPracticeExpansion } from '../content/practice-joints-foundations-expansion.ts';
import { MUSCULAR_SOURCE_ID } from '../content/systems.ts';

test('production catalog validates with honest published counts and source provenance', () => {
  assert.deepEqual(validateContent(content), []);
  assert.equal(content.modules.filter((module) => module.published).length, 18);
  assert.equal(content.modules.find((module) => module.id === 'skeletal-system')?.contentStatus, 'available');
  assert.equal(content.structures.filter((structure) => structure.moduleId === 'skeletal-system').length, 155);
  assert.equal(content.modules.find((module) => module.id === 'skeletal-system')?.lessons?.length, 13);
  assert.equal(content.structures.filter((structure) => structure.moduleId === 'joints-ligaments').length, 36);
  assert.equal(content.modules.find((module) => module.id === 'joints-ligaments')?.lessons?.length, 6);
  assert.equal(content.structures.filter((structure) => structure.moduleId === 'muscular-system').length, 73);
  assert.equal(content.modules.find((module) => module.id === 'muscular-system')?.lessons?.length, 8);
  assert.equal(content.structures.filter((structure) => structure.moduleId === 'nervous-system').length, 63);
  assert.equal(content.modules.find((module) => module.id === 'nervous-system')?.lessons?.length, 8);
  assert.equal(content.modules.find((module) => module.id === 'joints-ligaments')?.system, 'joints');
  assert.equal(content.modules.find((module) => module.id === 'muscular-system')?.system, 'muscular');
  assert.equal(content.modules.find((module) => module.id === 'nervous-system')?.system, 'nervous');
  assert.ok(content.structures.some((structure) => structure.id === 'external-acoustic-meatus'));
  assert.ok(content.structures.some((structure) => structure.id === 'lateral-malleolus'));
  assert.equal(content.questions.filter((question) => question.moduleId === 'skeletal-system').length, 111);
  assert.equal(content.questions.filter((question) => question.moduleId === 'anatomy-foundations').length, 72);
  const expectedCounts: Record<string, [number, number, number]> = {
    'cytology-mitosis': [22, 6, 15], 'skeletal-system': [155, 13, 111], 'anatomy-foundations': [105, 15, 72],
    'joints-ligaments': [36, 6, 31], 'muscular-system': [73, 8, 129], 'nervous-system': [63, 8, 51],
    'cells-tissues': [57, 8, 28], 'integumentary-system': [38, 6, 20], 'special-senses': [71, 9, 33],
    'endocrine-system': [38, 6, 17], 'cardiovascular-system': [70, 11, 50], 'blood-vessels': [45, 10, 22],
    'lymphatic-system': [47, 7, 19], 'respiratory-system': [64, 7, 40], 'digestive-system': [81, 10, 44],
    'urinary-system': [49, 7, 39], 'male-reproductive': [47, 7, 41], 'female-reproductive': [65, 8, 47],
  };
  for (const [id, [structures, lessons, questions]] of Object.entries(expectedCounts)) {
    const module = content.modules.find((item) => item.id === id);
    assert.ok(module?.published, id);
    assert.equal(content.structures.filter((item) => item.moduleId === id).length, structures, id);
    assert.equal(module?.lessons?.length ?? 0, lessons, id);
    assert.equal(content.questions.filter((item) => item.moduleId === id).length, questions, id);
  }
  assert.equal(content.assets.length, 57);
  assert.ok(content.questions.filter((question) => question.assetId).length >= 23);
  assert.ok(content.questions.filter((question) => question.hotspots?.length).length >= 8);
  assert.equal(content.questions.filter((question) => question.taskType === 'histology-identification').length, 2);
  assert.equal(content.modules.find((module) => module.id === 'cytology-mitosis')?.sourceIds[0], CYTOLOGY_SOURCE_ID);
  const source = content.sources.find((item) => item.id === CYTOLOGY_SOURCE_ID);
  assert.ok(source);
  assert.equal(source?.sourceType, 'text');
  assert.match(source?.filename ?? '', /transcribed/i);
  assert.deepEqual([...new Set(content.questions.map((question) => question.sourcePage).filter((page): page is number => page !== null))].sort((a, b) => a - b), [5, 6, 7, 8, 11, 12]);
  assert.ok(content.questions.filter((question) => question.moduleId === 'cytology-mitosis').every((question) => question.sourceId === CYTOLOGY_SOURCE_ID));
  assert.ok(content.questions.every((question) => isQuestionScorable(question, content)));
  assert.ok(content.sources.some((source) => source.id === OPENSTAX_SOURCE_ID && source.attributionLicenseStatus.includes('CC BY 4.0')));
  assert.ok(content.sources.some((source) => source.id === GRAY_SOURCE_ID && source.attributionLicenseStatus.includes('Public domain')));
  assert.ok(content.assets.every((asset) => asset.verificationStatus === 'verified'));
  assert.ok(content.assets.filter((asset) => asset.sourceId !== ORIGINAL_VISUAL_SOURCE_ID).every((asset) => asset.rightsUrl));
  assert.ok(content.questions.every((question) => content.modules.find((module) => module.id === question.moduleId)?.published));
  assert.equal(sourceCitation(content, OPENSTAX_SOURCE_ID, null), 'OpenStax Anatomy and Physiology (2013) · CC BY 4.0');
  assert.equal(sourceCitation(content, OPENSTAX_SOURCE_ID, 42), 'OpenStax Anatomy and Physiology (2013) · CC BY 4.0 · p.42');
  assert.match(sourceCitation(content, CYTOLOGY_SOURCE_ID, 5), /Lab 2.*p\.5/);
  assert.doesNotMatch(sourceCitation(content, OPENSTAX_SOURCE_ID, null), /Lab 2|null/);
});

test('published module sequence and organ lesson cue depth remain stable', () => {
  assert.deepEqual(content.modules.map((module) => module.id), [
    'cells-tissues', 'lymphatic-system', 'cytology-mitosis', 'skeletal-system',
    'anatomy-foundations', 'joints-ligaments', 'muscular-system', 'nervous-system',
    'integumentary-system', 'special-senses', 'endocrine-system', 'cardiovascular-system',
    'blood-vessels', 'respiratory-system', 'digestive-system', 'urinary-system',
    'male-reproductive', 'female-reproductive',
  ]);
  for (const module of content.modules) {
    const lessonIds = (module.lessons ?? []).map((lesson) => lesson.id);
    assert.equal(new Set(lessonIds).size, lessonIds.length, `${module.id}: duplicate lesson IDs`);
  }
  const generic = new Set([
    'Orient by position, continuity, and distinctive wall or tissue features.',
    'Compare adjacent structures before selecting a label.',
    'Use named boundaries, layers, and connected passages as landmarks.',
    'Location predicts the structure’s contribution to the organ pathway or function.',
    'Do not substitute a neighboring structure or a different tissue layer.',
  ]);
  for (const module of content.modules.filter((item) => ['respiratory-system', 'digestive-system', 'urinary-system', 'male-reproductive', 'female-reproductive'].includes(item.id))) {
    for (const lesson of module.lessons ?? []) {
      assert.ok(lesson.recognitionCues.some((text) => !generic.has(text)), `${module.id}:${lesson.id} cue`);
      assert.ok(lesson.relationships.some((text) => !generic.has(text)), `${module.id}:${lesson.id} relationship`);
      assert.ok(lesson.commonConfusions.some((text) => !generic.has(text)), `${module.id}:${lesson.id} confusion`);
    }
  }
});

test('Cytology visual course preserves old IDs and has the six ordered study lessons', () => {
  const module = content.modules.find((item) => item.id === 'cytology-mitosis');
  assert.deepEqual(module?.lessons?.map((lesson) => lesson.id), [
    'cytology-cell-boundary', 'cytology-nucleus-genome', 'cytology-organelles',
    'cytology-cell-cycle', 'cytology-mitotic-recognition', 'cytology-cytokinesis',
  ]);
  for (const id of ['q-cycle-order', 'q-mitosis-order', 'q-sister', 'q-animal-plant', 'q-prophase', 'q-metaphase', 'q-anaphase', 'q-telophase', 'q-membrane', 'q-organelles']) {
    assert.ok(content.questions.some((question) => question.id === id), id);
  }
  assert.ok(content.questions.some((question) => question.id === 'q-cytology-stage-transfer'));
  assert.ok(content.questions.some((question) => question.id === 'q-cytology-mitosis-cytokinesis'));
  assert.ok(content.structures.some((structure) => structure.id === 'cytosol' && structure.moduleId === 'cytology-mitosis'));
});

test('every published asset has a local static resolver entry and honest rights metadata', () => {
  const resolver = readFileSync(new URL('../content/imageSources.ts', import.meta.url), 'utf8');
  for (const asset of content.assets) {
    assert.ok(asset.localAssetPath, asset.id);
    assert.match(resolver, new RegExp(`['"]${asset.id}['"]\\s*:`), `${asset.id}: missing static resolver`);
    assert.equal(asset.verificationStatus, 'verified', asset.id);
    if (asset.sourceId === ORIGINAL_VISUAL_SOURCE_ID) {
      assert.equal(asset.rightsUrl, undefined, `${asset.id}: original artwork must not claim external rights`);
      assert.match(asset.attributionLicense, /Original diagram created for Boneefied/);
    } else {
      assert.ok(asset.rightsUrl, `${asset.id}: missing rights URL`);
    }
    assert.ok(content.sources.some((source) => source.id === asset.sourceId), `${asset.id}: source`);
    for (const hotspot of asset.hotspots ?? []) {
      assert.ok(hotspot.x >= 0 && hotspot.x <= 1 && hotspot.y >= 0 && hotspot.y <= 1 && hotspot.radius > 0 && hotspot.radius <= 1, asset.id);
      assert.ok(content.structures.some((structure) => structure.id === hotspot.structureId), `${asset.id}:${hotspot.structureId}`);
    }
    if (asset.id.startsWith('asset-servier-') || asset.id.startsWith('asset-original-')) {
      assert.equal(asset.labels?.length, asset.hotspots?.length, `${asset.id}: every Study target needs a Learn label`);
      for (const label of asset.labels ?? []) {
        assert.ok(label.displayLabel.trim(), `${asset.id}:${label.structureId}: display label`);
      }
    }
  }
});

test('anatomy cue routes preserve named boundaries and drainage distinctions', () => {
  const lesson = (moduleId: string, lessonId: string) => content.modules.find((module) => module.id === moduleId)?.lessons?.find((item) => item.id === lessonId);
  const arteries = lesson('blood-vessels', 'ves-large-arteries');
  assert.match((arteries?.recognitionCues ?? []).join(' '), /muscular arteries distribute blood to regional territories/i);
  assert.doesNotMatch(`${arteries?.recognitionCues.join(' ')} ${arteries?.relationships.join(' ')}`, /common carotid.{0,50}muscular distributing artery/i);
  const lacrimal = lesson('special-senses', 'eye-accessory-structures');
  assert.match(`${lacrimal?.landmarks.join(' ')} ${lacrimal?.relationships.join(' ')} ${lacrimal?.recognitionCues.join(' ')}`, /puncta.*canaliculi.*lacrimal sac.*nasolacrimal duct.*nasal cavity/i);
  const ear = lesson('special-senses', 'inner-ear');
  assert.match(`${ear?.recognitionCues.join(' ')} ${ear?.relationships.join(' ')}`, /utricle.*saccule.*semicircular ducts.*equilibrium/i);
  assert.match(`${ear?.landmarks.join(' ')} ${ear?.relationships.join(' ')}`, /cochlear duct.*vestibular and tympanic scalae/i);
  const renal = lesson('urinary-system', 'urinary-vessels');
  assert.match(renal?.relationships.join(' ') ?? '', /cortical radiate veins.*arcuate veins.*interlobar veins.*renal vein/i);
  const airflow = lesson('respiratory-system', 'respiratory-airflow');
  assert.match(`${airflow?.recognitionCues.join(' ')} ${airflow?.relationships.join(' ')}`, /trachea ends at the carina and divides into main bronchi/i);
  assert.match(airflow?.relationships.join(' ') ?? '', /carina.*not a conduit/i);
  for (const id of ['male-ducts', 'male-relationships']) {
    const male = lesson('male-reproductive', id);
    assert.match(`${male?.recognitionCues.join(' ')} ${male?.relationships.join(' ')}`, /short straight tubules.*rete testis/i);
  }
});

test('verified Gray plates are local, labeled, and lesson-scoped', () => {
  const expected = new Map([
    ['asset-gray946-sweat-gland', ['integumentary-system', 'cutaneous-glands', 'assets/images/anatomy/gray946-sweat-gland.png', 'https://commons.wikimedia.org/wiki/File:Gray946.png']],
    ['asset-gray880-optic-nerve-head', ['special-senses', 'lens-retina', 'assets/images/anatomy/gray880-optic-nerve-head.png', 'https://commons.wikimedia.org/wiki/File:Gray880.png']],
    ['asset-gray491-heart-posterior', ['cardiovascular-system', 'cv-coronary', 'assets/images/anatomy/gray491-heart-posterior.png', 'https://commons.wikimedia.org/wiki/File:Gray491.png']],
  ]);
  assert.equal(new Set(content.assets.map((asset) => asset.id)).size, content.assets.length);
  for (const [id, [moduleId, lessonId, path, url]] of expected) {
    const asset = content.assets.find((item) => item.id === id);
    assert.ok(asset);
    assert.equal(asset?.localAssetPath, path);
    assert.equal(asset?.sourceId, 'source-gray-1918-commons');
    assert.equal(asset?.labelStatus, 'labeled');
    assert.equal(asset?.verificationStatus, 'verified');
    assert.equal(asset?.sourceUrl, url);
    assert.equal(asset?.rightsUrl, url);
    assert.match(asset?.attributionLicense ?? '', /Public domain/);
    const lesson = content.modules.find((module) => module.id === moduleId)?.lessons?.find((item) => item.id === lessonId);
    assert.ok(lesson?.assetIds?.includes(id), `${moduleId}:${lessonId}`);
    assert.ok(content.assets.some((asset) => asset.id === id), `${id}: catalog asset`);
  }
  const gray1121Lessons = content.modules.flatMap((module) => (module.lessons ?? []).filter((lesson) => lesson.assetIds?.includes('asset-gray1121-posterior-abdominal-wall')).map((lesson) => `${module.id}:${lesson.id}`));
  assert.deepEqual(gray1121Lessons.sort(), ['blood-vessels:ves-central-branches', 'endocrine-system:endo-adrenal']);
  const urinaryVisuals = content.modules.find((module) => module.id === 'urinary-system')?.lessons?.find((lesson) => lesson.id === 'urinary-kidney')?.assetIds ?? [];
  assert.ok(urinaryVisuals.includes('asset-servier-kidney'));
  assert.ok(urinaryVisuals.includes('asset-commons-kidney-cortex-human'));
  assert.equal(content.structures.some((structure) => structure.id === 'ves-carotid'), false);
  assert.equal(content.structures.filter((structure) => structure.canonicalName.toLowerCase().replace(/[^a-z0-9]/g, '') === 'commoncarotidartery').length, 1);
  const glottisLesson = content.modules.find((module) => module.id === 'respiratory-system')?.lessons?.find((lesson) => lesson.id === 'respiratory-larynx');
  assert.ok(glottisLesson?.structureIds.some((id) => content.structures.find((structure) => structure.id === id)?.canonicalName === 'Rima glottidis'));
  assert.match(glottisLesson?.summary ?? '', /glottis comprises.*rima glottidis.*opening/i);
  const mammaryLesson = content.modules.find((module) => module.id === 'female-reproductive')?.lessons?.find((lesson) => lesson.id === 'female-histology');
  assert.match(mammaryLesson?.summary ?? '', /alveoli.*smaller.*larger mammary ducts/i);
});

test('production questions expose supported playable task types', () => {
  const supported = new Set(['multiple-choice', 'typed-recall', 'ordered-sequence', 'select-all', 'bone-laterality', 'function-relationship', 'muscle-action', 'muscle-origin-insertion', 'image-identification', 'hotspot', 'histology-identification']);
  assert.ok(content.questions.every((question) => supported.has(question.taskType)));
  assert.equal(content.questions.filter((question) => question.taskType === 'multiple-choice').length, 375);
  assert.equal(content.questions.filter((question) => question.taskType === 'typed-recall').length, 30);
  assert.equal(content.questions.filter((question) => question.taskType === 'ordered-sequence').length, 59);
  assert.equal(content.questions.filter((question) => question.taskType === 'select-all').length, 76);
  assert.equal(content.questions.filter((question) => question.taskType === 'bone-laterality').length, 8);
  assert.equal(content.questions.filter((question) => question.taskType === 'function-relationship').length, 119);
  assert.equal(content.questions.filter((question) => question.taskType === 'muscle-action').length, 16);
  assert.equal(content.questions.filter((question) => question.taskType === 'muscle-origin-insertion').length, 12);
  const multipleChoiceLike = new Set(['multiple-choice', 'bone-laterality', 'function-relationship', 'muscle-action', 'muscle-origin-insertion']);
  for (const question of content.questions.filter((item) => multipleChoiceLike.has(item.taskType))) {
    const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
    assert.ok(answers.some((answer) => (question.options ?? []).includes(answer) || question.acceptedAliases.some((alias) => (question.options ?? []).includes(alias))), question.id);
  }
  for (const question of content.questions.filter((item) => Array.isArray(item.answer) && item.taskType !== 'histology-identification')) {
    for (const answer of question.answer as string[]) assert.ok((question.options ?? []).includes(answer), `${question.id}: ${answer}`);
  }
  const structureModules = new Map(content.structures.map((structure) => [structure.id, structure.moduleId]));
  for (const question of content.questions) {
    for (const structureId of question.structureIds) assert.equal(structureModules.get(structureId), question.moduleId, `${question.id}:${structureId}`);
    const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
    if (question.taskType !== 'typed-recall' && !question.assetId) for (const answer of answers) {
      if (answer.trim().length > 2) assert.ok(!new RegExp(`\\b${answer.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i').test(question.prompt), `${question.id} leaks answer`);
    }
    if (question.taskType === 'typed-recall') assert.ok(!/type the name of this study structure|name a structure|identify the structure/i.test(question.prompt), `${question.id} is broad category-only recall`);
  }
  for (const module of content.modules) for (const lesson of module.lessons ?? []) {
    for (const structureId of lesson.structureIds) assert.equal(structureModules.get(structureId), module.id, `${lesson.id}:${structureId}`);
  }
  for (const question of content.questions.filter((item) => item.assetId)) {
    const resolver = readFileSync(new URL('../content/imageSources.ts', import.meta.url), 'utf8');
    assert.match(resolver, new RegExp(`['"]${question.assetId}['"]\\s*:`), `${question.id}: resolver mapping`);
    assert.ok(content.assets.some((asset) => asset.id === question.assetId), `${question.id}: asset`);
    for (const target of question.hotspots ?? []) {
      assert.ok(target.x >= 0 && target.x <= 1 && target.y >= 0 && target.y <= 1 && target.radius > 0 && target.radius <= 1, question.id);
      assert.ok(content.structures.some((structure) => structure.id === target.structureId), `${question.id}:${target.structureId}`);
    }
  }
  for (const question of content.questions.filter((item) => item.id.startsWith('q-muscle-region-'))) {
    assert.equal(question.sourceId, MUSCULAR_SOURCE_ID, `${question.id}: factual muscle question must cite the muscle chapter`);
  }
});

test('practice questions expose their retained structures in answer evidence', () => {
  const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\b(the|a|an)\b/g, '').replace(/\b(\w+)s\b/g, '$1').replace(/\s+/g, ' ').trim();
  const rawPractice = [
    ...skeletalPracticeExpansion, ...muscularPracticeExpansion, ...nervousPracticeExpansion,
    ...respiratoryPracticeExpansion, ...digestivePracticeExpansion, ...urinaryPracticeExpansion,
    ...malePracticeExpansion, ...femalePracticeExpansion, ...jointsPracticeExpansion, ...foundationsPracticeExpansion,
  ];
  for (const question of rawPractice) {
    assert.ok(question.structureIds.length > 0, `${question.id}: no retained structures`);
    assert.doesNotMatch(question.explanation, /Assessed structures:/i, question.id);
    const evidence = normalize([
      ...(Array.isArray(question.answer) ? question.answer : [question.answer]),
      ...(question.acceptedAliases ?? []),
      question.explanation,
    ].join(' '));
    for (const structureId of question.structureIds) {
      const structure = content.structures.find((item) => item.id === structureId);
      assert.ok(structure, `${question.id}:${structureId}`);
      const names = [structure.canonicalName, ...structure.acceptedAliases].map(normalize);
      assert.ok(names.some((name) => name.length > 0 && evidence.includes(name)), `${question.id}:${structure.canonicalName}`);
    }
  }
});

test('practice task shapes remain unambiguous and source-owned', () => {
  const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const multipleChoiceLike = new Set(['multiple-choice', 'bone-laterality', 'function-relationship', 'muscle-action', 'muscle-origin-insertion']);
  for (const question of content.questions) {
    assert.notEqual(question.taskType, 'matching', question.id);
    assert.ok(!/^match\b/i.test(question.prompt), question.id);
    if (question.taskType === 'select-all') {
      const answers = new Set(question.answer as string[]);
      assert.ok((question.options ?? []).some((option) => !answers.has(option)), `${question.id}: no distractor`);
    }
    if (multipleChoiceLike.has(question.taskType)) {
      assert.ok((question.options ?? []).length >= 3, `${question.id}: trivial options`);
      const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
      assert.ok(answers.some((answer) => (question.options ?? []).includes(answer)), `${question.id}: answer not offered`);
    }
    if (question.taskType === 'ordered-sequence') {
      const answer = (question.answer as string[]).map(normalize).sort();
      const options = (question.options ?? []).map(normalize).sort();
      assert.deepEqual(options, answer, `${question.id}: sequence members`);
      assert.notDeepEqual(question.options, question.answer, `${question.id}: sequence is not scrambled`);
    }
    const module = content.modules.find((item) => item.id === question.moduleId);
    assert.ok(module?.sourceIds.includes(question.sourceId), `${question.id}: undeclared source`);
    for (const structureId of question.structureIds) {
      const structure = content.structures.find((item) => item.id === structureId);
      assert.ok(structure && module.sourceIds.includes(structure.sourceId), `${question.id}:${structureId}: source not declared by module`);
    }
  }
});

test('priority systems have broad practice structure coverage', () => {
  const targets: Record<string, number> = {
    'skeletal-system': 139, 'joints-ligaments': 30, 'anatomy-foundations': 8, 'muscular-system': 51,
    'nervous-system': 51, 'respiratory-system': 51, 'digestive-system': 61, 'urinary-system': 41,
    'male-reproductive': 37, 'female-reproductive': 52,
  };
  for (const [moduleId, minimum] of Object.entries(targets)) {
    const covered = new Set(content.questions.filter((question) => question.moduleId === moduleId).flatMap((question) => question.structureIds));
    assert.ok(covered.size >= minimum, `${moduleId}:${covered.size}`);
  }
});

test('published lesson coverage and domain provenance are complete', () => {
  const sourceIds = new Set(content.sources.map((source) => source.id));
  for (const module of content.modules.filter((item) => item.published)) {
    const used = new Set([
      ...content.structures.filter((item) => item.moduleId === module.id).map((item) => item.sourceId),
      ...content.questions.filter((item) => item.moduleId === module.id).map((item) => item.sourceId),
      ...(module.lessons ?? []).flatMap((item) => item.sourceIds),
    ]);
    for (const sourceId of module.sourceIds) assert.ok(sourceIds.has(sourceId), `${module.id}:${sourceId}`);
    for (const sourceId of used) assert.ok(module.sourceIds.includes(sourceId), `${module.id} does not declare ${sourceId}`);
    const covered = new Set((module.lessons ?? []).flatMap((lesson) => lesson.structureIds));
    for (const lesson of module.lessons ?? []) for (const sourceId of lesson.sourceIds) assert.ok(sourceIds.has(sourceId), `${lesson.id}:${sourceId}`);
    if (!module.id.includes('foundations') && module.id !== 'cytology-mitosis') {
      for (const structure of content.structures.filter((item) => item.moduleId === module.id)) assert.ok(covered.has(structure.id), `${module.id}:${structure.id}`);
    }
  }
  assert.equal(content.structures.find((item) => item.id === 'foramen-ovale')?.sourceId, 'source-openstax-ap-2013-skeletal-ch7');
  assert.equal(content.structures.find((item) => item.id === 'scaphoid')?.sourceId, 'source-openstax-ap-2013-skeletal-ch8');
  assert.equal(content.structures.find((item) => item.id === 'acl')?.sourceId, 'source-openstax-ap-2013-joints-ch9');
  assert.equal(content.structures.find((item) => item.id === 'deltoid')?.sourceId, 'source-openstax-ap-2013-muscle-ch11');
  assert.equal(content.structures.find((item) => item.id === 'cerebrum')?.sourceId, 'source-openstax-ap-2013-nervous-ch13');
  const skeletalLessons = content.modules.find((item) => item.id === 'skeletal-system')?.lessons ?? [];
  assert.ok(skeletalLessons.find((item) => item.id === 'skull-orientation')?.structureIds.includes('foramen-magnum'));
  assert.equal(skeletalLessons.find((item) => item.id === 'skull-orientation')?.structureIds.includes('sacroiliac-joint'), false);
  assert.ok(skeletalLessons.find((item) => item.id === 'limb-girdles')?.structureIds.includes('sacroiliac-joint'));
  const skeletalExpansion = skeletalLessons.find((item) => item.id === 'knee-articular-landmarks');
  assert.deepEqual(skeletalExpansion?.structureIds, ['tibial-plateau','intercondylar-eminence','femoral-linea-aspera']);
  assert.ok(skeletalLessons.find((item) => item.id === 'hand-wrist-bones')?.structureIds.includes('radial-tuberosity'));
  assert.ok(skeletalLessons.find((item) => item.id === 'hand-wrist-bones')?.structureIds.includes('ulnar-styloid'));
});

test('raw rewritten module exports cover their own structures before canonical assembly', () => {
  const raw = [
    [endocrineModule, endocrineStructures], [cardiovascularModule, cardiovascularStructures],
    [vesselsModule, vesselsStructures], [lymphaticModule, lymphaticStructures],
    ...organSystemsModules.map((module) => [module, organSystemsStructures.filter((structure) => structure.moduleId === module.id)] as const),
  ] as const;
  for (const [module, structures] of raw) {
    const covered = new Set((module.lessons ?? []).flatMap((lesson) => lesson.structureIds));
    for (const structure of structures) assert.ok(covered.has(structure.id), `${module.id}:${structure.id}`);
  }
});

test('domain source registry records match runtime source IDs and URLs', () => {
  const registry = JSON.parse(readFileSync(new URL('../content/sources.json', import.meta.url), 'utf8')) as Array<{ id: string; sourceUrl?: string; licenseUrl?: string }>;
  for (const source of content.sources.filter((item) => item.id.startsWith('source-openstax-ap-2013-') || item.id === 'source-gray-1918-commons')) {
    const record = registry.find((item) => item.id === source.id);
    assert.ok(record, source.id);
    if (source.sourceUrl) assert.equal(record?.sourceUrl, source.sourceUrl, source.id);
    if (source.id === 'source-gray-1918-commons') assert.equal(record?.licenseUrl, source.licenseUrl, source.id);
  }
});

const session: PracticeSession = {
  id: 'session-production-1',
  moduleId: 'cytology-mitosis',
  mode: 'practice',
  entryPoint: 'practice',
  questionIds: ['q-cycle-order', 'q-mitosis-order', 'q-sister'],
  position: 0,
  answers: [],
  startedAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  status: 'active',
};

test('PracticeSession preserves exact order, position, outcomes, pause/completion, and hydration', () => {
  let state = upsertSession({ attempts: [], missed: [], mastery: [] }, session);
  state = submitSessionAnswer(state, session.id, {
    questionId: 'q-cycle-order',
    answer: ['G1', 'S', 'G2'],
    outcome: 'correct',
    submittedAt: '2026-01-01T00:01:00.000Z',
  });
  state = upsertSession(state, {
    ...session,
    position: 1,
    answers: state.sessions?.[0].answers ?? [],
    updatedAt: '2026-01-01T00:02:00.000Z',
    status: 'paused',
  });
  const paused = state.sessions?.[0];
  assert.deepEqual(paused?.questionIds, session.questionIds);
  assert.equal(paused?.position, 1);
  assert.equal(paused?.status, 'paused');
  assert.equal(paused?.answers[0].outcome, 'correct');
  const completed = completeSession(state, session.id, '2026-01-01T00:03:00.000Z');
  assert.equal(completed.sessions?.[0].status, 'completed');
  assert.equal(completed.sessions?.[0].position, 3);
  assert.equal(completed.sessions?.[0].completedAt, '2026-01-01T00:03:00.000Z');
  const restored = hydrateStudyState(serializeStudyState(completed));
  assert.deepEqual(restored.sessions, completed.sessions);
});

test('PracticeSession distinguishes wrong, skipped, and unanswered and duplicate submit is idempotent', () => {
  let state = upsertSession({ attempts: [], missed: [], mastery: [] }, session);
  state = submitSessionAnswer(state, session.id, { questionId: 'q-cycle-order', answer: ['G2'], outcome: 'wrong', submittedAt: '2026-01-01T00:01:00.000Z' }, {
    questionId: 'q-cycle-order', structureId: 'g1', answer: ['G2'], correct: false,
  });
  state = submitSessionAnswer(state, session.id, { questionId: 'q-cycle-order', answer: ['G2'], outcome: 'wrong', submittedAt: '2026-01-01T00:01:01.000Z' }, {
    questionId: 'q-cycle-order', structureId: 'g1', answer: ['G2'], correct: false,
  });
  state = submitSessionAnswer(state, session.id, { questionId: 'q-mitosis-order', outcome: 'skipped', submittedAt: '2026-01-01T00:02:00.000Z' });
  state = submitSessionAnswer(state, session.id, { questionId: 'q-sister', outcome: 'unanswered', submittedAt: '2026-01-01T00:03:00.000Z' });
  assert.equal(state.attempts.length, 1);
  assert.deepEqual(state.sessions?.[0].answers.map((answer) => answer.outcome), ['wrong', 'skipped', 'unanswered']);
  assert.equal(state.sessions?.[0].answers.length, 3);
});