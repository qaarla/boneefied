import type { ContentCatalog } from './model';

/** A consistent learner-facing citation; never renders a null page reference. */
export function sourceCitation(catalog: ContentCatalog, sourceId: string, page: number | null = null): string {
  const source = catalog.sources.find((item) => item.id === sourceId);
  if (!source) return 'Source unavailable';
  const license = source.attributionLicenseStatus.split(';')[0];
  const title = source.courseLabAssociation ? `${source.title} · ${source.courseLabAssociation}` : source.title;
  const pageReference = page === null ? '' : ` · p.${page}`;
  return `${title} · ${license}${pageReference}`;
}