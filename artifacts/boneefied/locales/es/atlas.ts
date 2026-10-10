import { atlasPlates } from '../../content/atlas-plates.generated.ts';
import { atlasQuestionSpecs } from '../../content/atlas-pack.ts';
import type { SpanishAsset, SpanishQuestion, SpanishSource } from './types.ts';

const rights = 'Obra original del proyecto Boneefied; todos los derechos reservados por Boneefied. No se otorga CC0 ni dedicación al dominio público.';
const anterior = 'vista anterior; derecha del paciente = izquierda del observador';
const posterior = 'vista posterior; derecha del paciente = derecha del observador';
const orientations: Record<string, string> = {
  'anterior-position': `${anterior}; palmas hacia delante; pulgares laterales`,
  'posterior-position': `${posterior}; palmas hacia delante; pulgares laterales`,
  'body-planes': 'vistas anteriores; paneles ordenados: sagital, coronal, transversal',
  'body-cavities': 'sección lateral; anterior hacia la izquierda del observador; el recuadro muestra pulmón a la izquierda y pared torácica a la derecha',
  'abdominal-quadrants': 'torso anterior; derecha del paciente = izquierda del observador; división en el ombligo',
  'abdominal-regions': 'torso anterior; derecha del paciente = izquierda del observador; cuadrícula de 3 x 3',
  'organ-locations': anterior,
  'skeleton-anterior': anterior,
  'skeleton-posterior': posterior,
  'skeleton-axial-appendicular': `${anterior}; azul grisáceo = axial, arena = apendicular`,
};

export const atlasSpanishAssets: Record<string, SpanishAsset> = Object.fromEntries(atlasPlates.map((p) => [p.id, {
  title: p.title[1],
  description: `${p.description[1]} Orientación: ${orientations[p.key]}.`,
  attributionLicense: rights,
  adaptationNote: 'Arte vectorial original de Boneefied (SVG maestro con PNG asociado). Las copias modificadas deben conservar el aviso de autoría original. No contiene texto incrustado; los nombres provienen de los metadatos de rótulos.',
  labels: p.labels.map((l) => l.es),
}]));

export const atlasSpanishSources: Record<string, SpanishSource> = {
  'source-boneefied-foundational-atlas': {
    title: 'Paquete de atlas fundamental de Boneefied',
    attributionLicenseStatus: rights,
    notes: 'Diez láminas vectoriales originales dibujadas desde cero; no se trazó ni importó arte de terceros. Referencias fácticas solo de texto (sin imágenes): módulos de capacitación NCI SEER, MedlinePlus y el glosario NCI SEER, consultados el 2026-10-10.',
  },
};

export const atlasSpanishQuestions: Record<string, Record<string, SpanishQuestion>> = { 'anatomy-foundations': {}, 'skeletal-system': {} };
for (const s of atlasQuestionSpecs) {
  const plate = atlasPlates.find((p) => p.id === s.q.assetId)!;
  const options = s.q.options!.map((id) => plate.labels.find((l) => l.structureId === id)!.es);
  atlasSpanishQuestions[s.q.moduleId][s.q.id] = { prompt: s.es.prompt, explanation: s.es.explanation, answer: options[s.q.options!.indexOf(s.q.answer as string)], options, acceptedAliases: [] };
}
