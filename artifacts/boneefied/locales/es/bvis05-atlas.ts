import type { SpanishAsset, SpanishQuestion, SpanishSource, SpanishStructure } from './types';
import cardiovascular from './modules/cardiovascular-system.ts';
import vessels from './modules/blood-vessels.ts';
import respiratory from './modules/respiratory-system.ts';
import lymphatic from './modules/lymphatic-system.ts';
import endocrine from './modules/endocrine-system.ts';
import digestive from './modules/digestive-system.ts';
import urinary from './modules/urinary-system.ts';
import male from './modules/male-reproductive.ts';
import female from './modules/female-reproductive.ts';
import { bvis05Plates } from '../../content/bvis05-plates.generated.ts';
import { bvis05QuestionCopy } from '../../content/bvis05-questions.ts';
import { BVIS05_SOURCE } from '../../content/bvis05-pack.ts';

const structures: Record<string, SpanishStructure> = { ...cardiovascular.structures, ...vessels.structures,
  ...respiratory.structures, ...lymphatic.structures, ...endocrine.structures,
  ...digestive.structures, ...urinary.structures, ...male.structures, ...female.structures };
export function bvis05SpanishName(id: string): string {
  if (!structures[id]) throw new Error(`Missing BVIS05 Spanish target: ${id}`);
  return structures[id].name;
}
const rights = 'Arte vectorial original del proyecto Boneefied (BVIS05); todos los derechos reservados. Los esquemas de tejidos no son fotomicrografías.';
export const bvis05SpanishAssets: Record<string, SpanishAsset> = Object.fromEntries(bvis05Plates.map((p) => [p.id, {
  title: p.title[1], description: `${p.description[1]} Orientación: ${p.orientationEs}.`,
  attributionLicense: rights, labels: p.labels.map((l) => bvis05SpanishName(l.structureId)),
  adaptationNote: 'Vectores originales a partir de hechos anatómicos; no se importaron ni trazaron ilustraciones y no hay texto incrustado. Los dibujos anteriores quedan archivados.',
  specimenNote: p.teachingKind === 'tissue-schematic' ? 'Esquema didáctico, no una muestra ni fotomicrografía.' : undefined,
}]));
export const bvis05SpanishSources: Record<string, SpanishSource> = {
  [BVIS05_SOURCE]: { title: 'Atlas Boneefied cardiovascular, respiratorio, linfático y endocrino',
    attributionLicenseStatus: rights,
    notes: 'Vectores originales; no se importaron ni trazaron ilustraciones. SVG originales, PNG, anotaciones, referencias y hashes: assets/images/anatomy/bvis05-atlas/provenance.json. Las muestras reales conservan su procedencia de archivo exacto en docs/atlas/BVIS05_SPECIMEN_LICENSES.json.' },
};
export const bvis05SpanishQuestions: Record<string, Record<string, SpanishQuestion>> = {};
for (const { q, esPrompt, esExplanation } of bvis05QuestionCopy) {
  const id = q.structureIds[0], s = structures[id], hotspot = q.taskType === 'hotspot';
  (bvis05SpanishQuestions[q.moduleId] ??= {})[q.id] = {
    prompt: esPrompt || `Localiza ${bvis05SpanishName(id)} en este ${bvis05Plates.find((p) => p.id === q.assetId)?.teachingKind === 'tissue-schematic' ? 'esquema didáctico anatómico' : 'diagrama anatómico'}.`,
    explanation: `${bvis05SpanishName(id)}. ${esExplanation}${hotspot ? '' : ' Marcador 1.'}`,
    answer: hotspot ? q.answer : s.name,
    acceptedAliases: hotspot ? [] : q.acceptedAliases.map((_, i) => i === 0 ? s.name : s.aliases[i - 1] ?? s.name),
  };
}
