import { bvis04Plates } from '../../content/bvis04-plates.generated.ts';
import { bvis04QuestionCopy } from '../../content/bvis04-questions.ts';
import { bvis04FunctionCopy } from '../../content/bvis04-functions.ts';
import { BVIS04_SOURCE } from '../../content/bvis04-pack.ts';
import nervous from './modules/nervous-system.ts';
import senses from './modules/special-senses.ts';
import skin from './modules/integumentary-system.ts';
import tissues from './modules/cells-tissues.ts';
import type { SpanishAsset, SpanishQuestion, SpanishSource, SpanishStructure } from './types';

const structures: Record<string, SpanishStructure> = {
  ...nervous.structures, ...senses.structures, ...skin.structures, ...tissues.structures,
};
export const bvis04SpanishName = (id: string) => {
  if (!structures[id]) throw new Error(`Missing Spanish BVIS04 structure ${id}`);
  return structures[id].name;
};
const rights = 'Arte vectorial original del proyecto Boneefied (BVIS04); todos los derechos reservados. Los esquemas de tejidos no son fotomicrografías.';
export const bvis04SpanishAssets: Record<string, SpanishAsset> = Object.fromEntries(bvis04Plates.map((p) => [p.id, {
  title: p.title[1], description: `${p.description[1]} Orientación: ${p.orientationEs}.`,
  attributionLicense: rights,
  adaptationNote: 'Vectores originales dibujados a partir de hechos anatómicos; no se trazaron ni importaron ilustraciones. No hay texto incrustado.',
  specimenNote: p.teachingKind === 'tissue-schematic' ? 'Esquema didáctico, no una muestra ni fotomicrografía.' : undefined,
  labels: p.labels.map((l) => bvis04SpanishName(l.structureId)),
}]));
export const bvis04SpanishSources: Record<string, SpanishSource> = {
  [BVIS04_SOURCE]: { title: 'Atlas Boneefied de sistema nervioso, sentidos, piel y tejidos',
    attributionLicenseStatus: rights,
    notes: 'Vectores originales; no se importaron ni trazaron ilustraciones. SVG originales, PNG, anotaciones, referencias y hashes: assets/images/anatomy/bvis04-atlas/provenance.json. Las muestras reales conservan sus licencias de archivo exacto en docs/atlas/BVIS04_SPECIMEN_LICENSES.json.' },
};
export const bvis04SpanishQuestions: Record<string, Record<string, SpanishQuestion>> = {};
for (const copy of [...bvis04QuestionCopy, ...bvis04FunctionCopy]) {
  const { q } = copy, id = q.structureIds[0], s = structures[id];
  const choices = copy.optionIds?.map(bvis04SpanishName);
  const hotspot = q.taskType === 'hotspot';
  (bvis04SpanishQuestions[q.moduleId] ??= {})[q.id] = {
    prompt: copy.esPrompt || `Localiza ${bvis04SpanishName(id)} en el diagrama.`,
    explanation: `${bvis04SpanishName(id)}. ${copy.esExplanation}`,
    answer: hotspot ? q.answer : bvis04SpanishName(id), options: choices,
    acceptedAliases: hotspot || q.taskType === 'function-relationship' ? [] :
      q.acceptedAliases.map((_, i) => i === 0 ? s.name : s.aliases[i - 1] ?? s.name),
  };
}
