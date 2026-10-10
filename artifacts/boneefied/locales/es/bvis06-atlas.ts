import type { SpanishAsset, SpanishQuestion, SpanishSource, SpanishStructure } from './types';
import { bvis06Plates } from '../../content/bvis06-plates.generated.ts';
import { bvis06QuestionCopy } from '../../content/bvis06-questions.ts';
import { BVIS06_SOURCE } from '../../content/bvis06-pack.ts';
import digestive from './modules/digestive-system.ts';
import urinary from './modules/urinary-system.ts';
import male from './modules/male-reproductive.ts';
import female from './modules/female-reproductive.ts';
import { bvis05SpanishName } from './bvis05-atlas.ts';

const structures: Record<string, SpanishStructure> = { ...digestive.structures, ...urinary.structures, ...male.structures, ...female.structures };
export const bvis06SpanishName = (id: string): string => structures[id]?.name ?? bvis05SpanishName(id);
const rights = 'Arte vectorial original del proyecto Boneefied (BVIS06); todos los derechos reservados. Los esquemas de tejidos no son fotomicrografías.';
export const bvis06SpanishAssets: Record<string, SpanishAsset> = Object.fromEntries(bvis06Plates.map((p) => [p.id, {
  title: p.title[1], description: `${p.description[1]} Orientación: ${p.orientationEs}.`,
  attributionLicense: rights, labels: p.labels.map((l) => bvis06SpanishName(l.structureId)),
  adaptationNote: 'Vectores originales a partir de hechos anatómicos; no se importaron ni trazaron ilustraciones y no hay texto incrustado. Los dibujos anteriores quedan archivados.',
  specimenNote: p.teachingKind === 'tissue-schematic' ? 'Esquema didáctico, no una muestra ni fotomicrografía.' : undefined,
}]));
export const bvis06SpanishSources: Record<string, SpanishSource> = {
  [BVIS06_SOURCE]: { title: 'Atlas Boneefied digestivo, urinario y reproductor', attributionLicenseStatus: rights,
    notes: 'Vectores originales; ninguna ilustración importada o trazada. Originales SVG, PNG, anotaciones, referencias y hashes: assets/images/anatomy/bvis06-atlas/provenance.json. Comprobaciones de texto: docs/atlas/BVIS06_FACT_CHECKS.json. Muestras reales separadas: docs/atlas/BVIS06_SPECIMEN_LICENSES.json.' },
};
export const bvis06SpanishQuestions: Record<string, Record<string, SpanishQuestion>> = {};
for (const { q, esPrompt, esExplanation } of bvis06QuestionCopy) {
  const id = q.structureIds[0], s = structures[id];
  const hotspot = q.taskType === 'hotspot', ordered = q.taskType === 'ordered-sequence';
  (bvis06SpanishQuestions[q.moduleId] ??= {})[q.id] = {
    prompt: esPrompt || `Localiza ${bvis06SpanishName(id)} en este diagrama anatómico${bvis06Plates.find((p) => p.id === q.assetId)?.teachingKind === 'tissue-schematic' ? ' didáctico' : ''}.`,
    explanation: ordered ? esExplanation : `${bvis06SpanishName(id)}. ${esExplanation}${hotspot ? '' : ' Marcador 1.'}`,
    answer: ordered ? (q.answer as string[]).map(bvis06SpanishName) : hotspot ? q.answer : s.name,
    options: ordered ? q.options!.map(bvis06SpanishName) : undefined,
    acceptedAliases: hotspot || ordered ? [] : q.acceptedAliases.map((_, i) => i === 0 ? s.name : s.aliases[i - 1] ?? s.name),
  };
}
