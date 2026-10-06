import type { ContentCatalog, Module, Structure } from './model';
import { spanishModules } from '../locales/es/index.ts';
import { anatomicalTerms, type AnatomicalTerm } from './anatomical-terms.ts';

type Name = {
  label: string;
  normalized: string;
  singular: string;
  canonical: boolean;
  englishLabel: string;
  spanishLabel: string;
  term?: AnatomicalTerm;
};
export type AnatomySearchEntry = { structure: Structure; module: Module; names: Name[] };
export type AnatomySearchMatch = {
  structure: Structure;
  module: Module;
  matchedTerm: string;
  kind: 'exact-canonical' | 'exact-alias' | 'partial' | 'fuzzy';
  term?: AnatomicalTerm;
};

export function normalizeSearchText(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/['’]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

function singularToken(token: string): string {
  const irregular: Record<string, string> = { feet: 'foot', teeth: 'tooth', phalanges: 'phalanx' };
  if (irregular[token]) return irregular[token];
  if (token.length > 4 && (token.endsWith('uli') || token.endsWith('ii'))) return `${token.slice(0, -1)}us`;
  if (token.length > 4 && token.endsWith('ae')) return token.slice(0, -1);
  if (token.length > 4 && token.endsWith('ies')) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && /(?:ch|sh|ss|x|z)es$/.test(token)) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith('s') && !/(?:ss|us|is)$/.test(token)) return token.slice(0, -1);
  return token;
}

function singularize(text: string): string {
  return text.split(' ').map(singularToken).join(' ');
}

export function createAnatomySearchIndex(catalog: ContentCatalog): AnatomySearchEntry[] {
  const modules = new Map(catalog.modules.filter((module) => module.visible && module.published && module.contentStatus === 'available').map((module) => [module.id, module]));
  const indexedStructureIds = new Set<string>();
  return catalog.structures.flatMap((structure) => {
    const module = modules.get(structure.moduleId);
    if (!module || structure.verificationStatus !== 'verified' || indexedStructureIds.has(structure.id)) return [];
    indexedStructureIds.add(structure.id);
    const spanishStructure = spanishModules[module.id]?.structures[structure.id];
    const englishNames = [structure.canonicalName, ...structure.acceptedAliases];
    const spanishNames = spanishStructure ? [spanishStructure.name, ...spanishStructure.aliases] : [];
    const pairedNames = [
      ...englishNames.map((englishLabel, index) => ({
        label: englishLabel,
        englishLabel,
        spanishLabel: spanishNames[index] ?? spanishNames[0] ?? englishLabel,
        canonical: index === 0,
      })),
      ...spanishNames.map((spanishLabel, index) => ({
        label: spanishLabel,
        englishLabel: englishNames[index] ?? englishNames[0],
        spanishLabel,
        canonical: index === 0,
      })),
    ];
    const names = pairedNames.map(({ label, englishLabel, spanishLabel, canonical }) => {
      const normalized = normalizeSearchText(label);
      return { label, normalized, singular: singularize(normalized), canonical, englishLabel, spanishLabel };
    }).filter((name) => name.normalized);
    const wordNames: Name[] = anatomicalTerms.filter((term) => term.structureId === structure.id)
      .flatMap((term) => [...new Set([term.en, term.es])].map((label) => {
        const normalized = normalizeSearchText(label);
        return { label, normalized, singular: singularize(normalized), canonical: false,
          englishLabel: term.en, spanishLabel: term.es, term };
      }));
    return [{ structure, module, names: [...names, ...wordNames] }];
  });
}

// Optimal-string-alignment distance: insertions, deletions, substitutions, and adjacent swaps.
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const rows = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) rows[i][0] = i;
  for (let j = 0; j <= b.length; j++) rows[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMinimum = max + 1;
    for (let j = 1; j <= b.length; j++) {
      let cost = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + Number(a[i - 1] !== b[j - 1]));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        cost = Math.min(cost, rows[i - 2][j - 2] + 1);
      }
      rows[i][j] = cost;
      rowMinimum = Math.min(rowMinimum, cost);
    }
    if (rowMinimum > max) return max + 1;
  }
  return rows[a.length][b.length];
}

type Scored = AnatomySearchMatch & { tier: number; detail: number };

export function searchAnatomy(index: AnatomySearchEntry[], query: string, limit = 8, language: 'en' | 'es' = 'en'): AnatomySearchMatch[] {
  const normalized = normalizeSearchText(query);
  if (!normalized || limit <= 0) return [];
  const singular = singularize(normalized);
  const maxDistance = normalized.length >= 8 ? 2 : normalized.length >= 5 ? 1 : 0;
  const scored: Scored[] = [];

  for (const { structure, module, names } of index) {
    let best: Scored | undefined;
    for (const name of names) {
      const candidates = [name.normalized, name.singular];
      let tier = 4;
      let detail = Infinity;
      if (candidates.some((candidate) => candidate === normalized || candidate === singular)) {
        tier = name.canonical ? 0 : 1;
        detail = 0;
      } else {
        const position = Math.min(...candidates.map((candidate) => candidate.indexOf(normalized)).filter((at) => at >= 0));
        if (Number.isFinite(position)) {
          tier = 2;
          detail = position + (name.canonical ? 0 : 1);
        } else if (maxDistance && normalized.length <= 40) {
          const terms = normalized.includes(' ') ? candidates : [...candidates, ...candidates.flatMap((candidate) => candidate.split(' '))];
          for (const candidate of new Set(terms)) {
            const distance = editDistance(singular, candidate, maxDistance);
            const length = Math.max(singular.length, candidate.length);
            if (distance < 1 || distance > maxDistance || distance / length > 0.25) continue;
            if (distance === 2 && singular.slice(0, 2) !== candidate.slice(0, 2)) continue;
            tier = 3;
            detail = Math.min(detail, distance * 100 + Math.abs(singular.length - candidate.length) * 10 + (name.canonical ? 0 : 1));
          }
        }
      }
      if (tier === 4) continue;
      const match: Scored = {
        structure, module,
        matchedTerm: language === 'es' ? name.spanishLabel : name.englishLabel,
        kind: tier === 0 ? 'exact-canonical' : tier === 1 ? 'exact-alias' : tier === 2 ? 'partial' : 'fuzzy',
        tier, detail,
        ...(name.term ? { term: name.term } : {}),
      };
    if (!best || match.tier < best.tier || (match.tier === best.tier &&
      (match.detail < best.detail || (match.detail === best.detail && match.term && !best.term)))) best = match;
    }
    if (best) scored.push(best);
  }
  // Only offer guesses when literal name/alias matches have not already answered the query.
  const confident = scored.some((match) => match.tier < 3) ? scored.filter((match) => match.tier < 3) : scored;
  return confident.sort((a, b) => a.tier - b.tier || a.detail - b.detail || a.structure.canonicalName.localeCompare(b.structure.canonicalName) || a.structure.id.localeCompare(b.structure.id))
    .slice(0, limit).map(({ tier: _tier, detail: _detail, ...match }) => match);
}