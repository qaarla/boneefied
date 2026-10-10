import { muscularPlates } from '../../content/muscular-atlas-plates.generated.ts';
import { muscularAtlasTapSpecs, muscularAtlasIdentSpecs, muscularAtlasActionSpecs, actionPromptEs, RELOCATED_VISUAL_COPY } from '../../content/muscular-atlas-pack.ts';
import muscularSystem from './modules/muscular-system.ts';
import type { SpanishAsset, SpanishQuestion, SpanishSource } from './types.ts';

const names: Record<string, string> = {};
for (const [id, s] of Object.entries(muscularSystem.structures)) names[id] = (s as { name: string }).name;
export const spanishMuscleName = (id: string) => names[id] ?? id;
const rights = 'Arte original del proyecto Boneefied (atlas muscular, BVIS03); todos los derechos reservados por Boneefied. No se concede dedicación CC0 ni de dominio público.';

export const muscularSpanishAssets: Record<string, SpanishAsset> = Object.fromEntries(muscularPlates.map((p) => [p.id, {
  title: p.title[1],
  description: `${p.description[1]} Orientación: ${p.orientationEs}.`,
  attributionLicense: rights,
  adaptationNote: 'Arte vectorial original de Boneefied (SVG maestro con PNG asociado). No contiene texto incrustado; los nombres provienen de los metadatos de etiquetas.',
  labels: p.labels.map((l) => spanishMuscleName(l.structureId)),
}]));

export const muscularSpanishSources: Record<string, SpanishSource> = {
  'source-boneefied-muscular-atlas': {
    title: 'Paquete de atlas muscular de Boneefied',
    attributionLicenseStatus: rights,
    notes: '20 láminas vectoriales originales dibujadas desde cero (11 nuevas y 9 reemplazos en el mismo ID de figuras musculares de terceros retiradas); no se trazó ni importó arte de terceros. Referencias solo de texto (NIH StatPearls NBK537012, NBK534836, NBK470334, NBK526040).',
  },
};

export const muscularSpanishQuestions: Record<string, SpanishQuestion> = {};
for (const s of muscularAtlasTapSpecs) muscularSpanishQuestions[s.id] = { prompt: s.es[0], explanation: s.es[1], answer: spanishMuscleName(s.answer), options: s.options.map(spanishMuscleName), acceptedAliases: [] };
for (const s of muscularAtlasIdentSpecs) muscularSpanishQuestions[s.id] = {
  prompt: s.es[0], explanation: s.es[1], answer: spanishMuscleName(s.target),
  acceptedAliases: [...(muscularSystem.structures as Record<string, { aliases: readonly string[] }>)[s.target].aliases],
};
for (const s of muscularAtlasActionSpecs) {
  const src = (muscularSystem.questions as Record<string, SpanishQuestion>)[s.source];
  if (!src) throw new Error(`Missing Spanish source question ${s.source}`);
  muscularSpanishQuestions[s.id] = { prompt: actionPromptEs(s), explanation: src.explanation, answer: src.answer, options: src.options, acceptedAliases: src.acceptedAliases };
}
for (const [sid, copy] of Object.entries(RELOCATED_VISUAL_COPY)) {
  const id = `q-muscle-visual-${sid}`;
  const old = (muscularSystem.questions as Record<string, SpanishQuestion>)[id];
  if (old) muscularSpanishQuestions[id] = { ...old, prompt: copy.es };
}
