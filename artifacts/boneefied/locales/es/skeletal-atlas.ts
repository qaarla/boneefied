import { skeletalPlates } from '../../content/skeletal-atlas-plates.generated.ts';
import { skeletalAtlasQuestionSpecs, SKELETAL_ATLAS_RIGHTS } from '../../content/skeletal-atlas-pack.ts';
import skeletalSystem from './modules/skeletal-system.ts';
import jointsLigaments from './modules/joints-ligaments.ts';
import type { SpanishAsset, SpanishQuestion, SpanishSource } from './types.ts';

void SKELETAL_ATLAS_RIGHTS;
const names: Record<string, string> = {};
for (const m of [skeletalSystem, jointsLigaments]) for (const [id, s] of Object.entries(m.structures)) names[id] = (s as { name: string }).name;
export const spanishStructureName = (id: string) => names[id] ?? id;

const rights = 'Arte original del proyecto Boneefied (atlas esquelético, BVIS02); todos los derechos reservados por Boneefied. No se concede dedicación CC0 ni de dominio público.';
const orientations: Record<string, string> = {
  'skull-anterior': 'vista anterior; derecha del paciente = izquierda del observador',
  'skull-lateral': 'vista lateral izquierda; anterior hacia la izquierda del observador',
  'skull-base-external': 'vista inferior; anterior arriba; derecha del paciente = izquierda del observador; sin mandíbula',
  'cranial-floor-internal': 'vista superior; anterior arriba; derecha del paciente = derecha del observador',
  'skull-sutures': 'panel izquierdo vista superior, anterior arriba; panel derecho vista posterior; derecha del paciente = derecha del observador',
  'vertebra-typical': 'principal: vista superior, cuerpo/anterior arriba; recuadro: vista lateral, anterior a la izquierda del observador',
  'vertebrae-regional': 'vistas superiores; cuerpo/anterior arriba; paneles cervical, torácica, lumbar',
  'atlas-axis': 'izquierda: C1 vista superior, anterior arriba; derecha: C2 vista lateral, anterior a la izquierda del observador',
  'thoracic-cage': 'vista anterior; derecha del paciente = izquierda del observador; sin clavículas',
  'rib-detail': 'izquierda: vista posterior de costilla derecha, columna a la izquierda; derecha: cara interna',
  scapula: 'escápula derecha; panel anterior: glenoides a la izquierda; panel posterior: glenoides a la derecha',
};
const orient = (key: string, en: string) => orientations[key] ?? en;

export const skeletalSpanishAssets: Record<string, SpanishAsset> = Object.fromEntries(skeletalPlates.map((p) => [p.id, {
  title: p.title[1],
  description: `${p.description[1]} Orientación: ${orient(p.key, p.orientation)}.`,
  attributionLicense: rights,
  adaptationNote: 'Arte vectorial original de Boneefied (SVG maestro con PNG asociado). No contiene texto incrustado; los nombres provienen de los metadatos de etiquetas.',
  labels: p.labels.map((l) => spanishStructureName(l.structureId)),
}]));

export const skeletalSpanishSources: Record<string, SpanishSource> = {
  'source-boneefied-skeletal-atlas': {
    title: 'Paquete de atlas esquelético de Boneefied',
    attributionLicenseStatus: rights,
    notes: '22 láminas vectoriales originales dibujadas desde cero (19 nuevas y 3 reemplazos en el mismo ID); no se trazó ni importó arte de terceros. Referencias fácticas solo de texto, revisadas el 2026-10-10: NBK499834, NBK535397, NBK535382, NBK545260, NBK535416, NBK559233, NBK507780, NBK535432.',
  },
};

export const skeletalSpanishQuestions: Record<string, Record<string, SpanishQuestion>> = { 'skeletal-system': {}, 'joints-ligaments': {} };
for (const s of skeletalAtlasQuestionSpecs) {
  const options = s.options.map(spanishStructureName);
  skeletalSpanishQuestions[s.moduleId][s.id] = { prompt: s.es[0], explanation: s.es[1], answer: spanishStructureName(s.answer), options, acceptedAliases: [] };
}
