import type { ContentCatalog, NormalizedHotspot } from './model';

export type ValidationIssue = { code: string; message: string; id?: string };

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase()
    .replace(/[.,!?;:'"()[\]{}]/g, '')
    .replace(/\s+/g, ' ');
}

export function answersMatch(input: string, answer: string, aliases: string[] = []): boolean {
  const normalized = normalizeAnswer(input);
  return [answer, ...aliases].some((candidate) => normalizeAnswer(candidate) === normalized);
}

export function isValidHotspot(hotspot: NormalizedHotspot): boolean {
  return hotspot.x >= 0 && hotspot.x <= 1 && hotspot.y >= 0 && hotspot.y <= 1 && hotspot.radius > 0 && hotspot.radius <= 1;
}

export function validateContent(catalog: ContentCatalog): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();
  const register = (id: string, kind: string) => {
    if (ids.has(id)) issues.push({ code: 'duplicate-id', message: `${kind} ID is duplicated: ${id}`, id });
    ids.add(id);
  };
  catalog.sources.forEach((item) => register(item.id, 'Source'));
  catalog.modules.forEach((item) => register(item.id, 'Module'));
  catalog.structures.forEach((item) => register(item.id, 'Structure'));
  catalog.assets.forEach((item) => register(item.id, 'Asset'));
  catalog.questions.forEach((item) => register(item.id, 'Question'));
  catalog.pathways.forEach((item) => register(item.id, 'Pathway'));
  const sourceIds = new Set(catalog.sources.map((item) => item.id));
  const moduleIds = new Set(catalog.modules.map((item) => item.id));
  const structureIds = new Set(catalog.structures.map((item) => item.id));
  const assetIds = new Set(catalog.assets.map((item) => item.id));
  catalog.structures.forEach((item) => {
    if (!sourceIds.has(item.sourceId)) issues.push({ code: 'missing-source', message: `Structure references missing source: ${item.sourceId}`, id: item.id });
    if (!moduleIds.has(item.moduleId)) issues.push({ code: 'missing-module', message: `Structure references missing module: ${item.moduleId}`, id: item.id });
  });
  catalog.questions.forEach((item) => {
    if (!sourceIds.has(item.sourceId)) issues.push({ code: 'missing-source', message: `Question references missing source: ${item.sourceId}`, id: item.id });
    if (!moduleIds.has(item.moduleId)) issues.push({ code: 'missing-module', message: `Question references missing module: ${item.moduleId}`, id: item.id });
    item.structureIds.forEach((id) => { if (!structureIds.has(id)) issues.push({ code: 'missing-structure', message: `Question references missing structure: ${id}`, id: item.id }); });
    if (item.assetId && !assetIds.has(item.assetId)) issues.push({ code: 'missing-asset', message: `Question references missing asset: ${item.assetId}`, id: item.id });
    if (item.verificationStatus === 'verified' && !sourceIds.has(item.sourceId)) issues.push({ code: 'unverified-production', message: 'Verified question has no valid provenance', id: item.id });
    item.hotspots?.forEach((hotspot) => { if (!isValidHotspot(hotspot)) issues.push({ code: 'invalid-hotspot', message: 'Hotspot coordinates must be normalized 0..1', id: item.id }); });
  });
  return issues;
}