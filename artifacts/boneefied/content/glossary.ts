import type { ContentCatalog } from './model.ts';
import { createAnatomySearchIndex, normalizeSearchText, searchAnatomy, type AnatomySearchEntry } from './search.ts';
import skeletal from './glossary/skeletal.ts';
import foundationsCytology from './glossary/foundations-cytology.ts';
import movementNervous from './glossary/movement-nervous.ts';
import cellsSkinSenses from './glossary/cells-skin-senses.ts';
import endocrineCirculation from './glossary/endocrine-circulation.ts';
import respiratoryDigestiveUrinary from './glossary/respiratory-digestive-urinary.ts';
import reproductive from './glossary/reproductive.ts';

// Definitions are keyed only by existing structure IDs. Names, aliases,
// categories, source provenance, and module links always come from the catalog.
const definitionGroups: ReadonlyArray<Readonly<Record<string, string>>> = [
  skeletal, foundationsCytology, movementNervous, cellsSkinSenses,
  endocrineCirculation, respiratoryDigestiveUrinary, reproductive,
];
const definitions = Object.assign({}, ...definitionGroups) as Record<string, string>;

export type GlossaryEntry = AnatomySearchEntry & { definition: string };

export function definitionForStructure(id: string): string | undefined {
  return definitions[id]?.trim() || undefined;
}

export function createGlossaryIndex(catalog: ContentCatalog): GlossaryEntry[] {
  return createAnatomySearchIndex(catalog).flatMap((entry) => {
    const definition = definitionForStructure(entry.structure.id);
    return definition ? [{ ...entry, definition }] : [];
  });
}

export function glossaryCoverage(catalog: ContentCatalog) {
  const eligible = createAnatomySearchIndex(catalog);
  const ids = new Set(eligible.map(({ structure }) => structure.id));
  const definitionIds = definitionGroups.flatMap((group) => Object.keys(group));
  return {
    eligible: eligible.length,
    published: eligible.filter(({ structure }) => definitionForStructure(structure.id)).length,
    unresolved: eligible.filter(({ structure }) => !definitionForStructure(structure.id)).map(({ structure }) => structure.id),
    orphaned: definitionIds.filter((id) => !ids.has(id)),
    duplicates: definitionIds.filter((id, index) => definitionIds.indexOf(id) !== index),
  };
}

export function filterGlossary(index: GlossaryEntry[], query: string, system?: string): GlossaryEntry[] {
  const available = system ? index.filter((entry) => entry.module.id === system) : index;
  if (!normalizeSearchText(query)) {
    return [...available].sort((a, b) =>
      a.structure.canonicalName.localeCompare(b.structure.canonicalName)
      || a.module.title.localeCompare(b.module.title));
  }
  const byId = new Map(available.map((entry) => [entry.structure.id, entry]));
  return searchAnatomy(available, query, available.length).flatMap((match) => {
    const entry = byId.get(match.structure.id);
    return entry ? [entry] : [];
  });
}