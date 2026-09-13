import type { ContentCatalog, SourceRecord } from './model';

export const BRIEF_SOURCE_ID = 'source-course-brief';

export const content: ContentCatalog = {
  sources: [
    {
      id: BRIEF_SOURCE_ID,
      filename: 'Pasted-MODE-ECONOMY-EFFORT-HIGH-PROJECT-BIOL-250-HUMAN-ANATOMY_1789181970650.txt',
      hash: '3c073563d28360c26577cc3998f94595b80bb68dc128225f24a5c05ad0e60863',
      pageCount: null,
      title: 'BIOL 250 Human Anatomy Mobile Study App implementation brief',
      courseLabAssociation: 'BIOL 250 Human Anatomy',
      sourceType: 'brief',
      attributionLicenseStatus: 'Supplied project source; license not stated',
      notes: 'Implementation requirements only. Contains no anatomy teaching content, answers, or course images.',
      verificationStatus: 'verified',
    },
    {
      id: 'source-approved-icon',
      filename: 'assets/images/icon.png',
      hash: 'd1887a799a33adfad23b4a27d7baa1b69e86011a89f9477008f8e9db5a6cdf95',
      pageCount: null,
      title: 'Approved Boneefied application icon',
      courseLabAssociation: null,
      sourceType: 'image',
      attributionLicenseStatus: 'Supplied project asset; license not stated',
      notes: 'Brand asset only; not anatomy course content.',
      verificationStatus: 'verified',
    },
    {
      id: 'source-approved-logo',
      filename: 'assets/images/logo-rounded.png',
      hash: '557de13cd2ac17b1f141d0fe5fcbcdb8ba5aa16be54504f0bdbc36a828705c38',
      pageCount: null,
      title: 'Approved transparent in-app logo',
      courseLabAssociation: null,
      sourceType: 'image',
      attributionLicenseStatus: 'Supplied project asset; license not stated',
      notes: 'Brand asset only; not anatomy course content.',
      verificationStatus: 'verified',
    },
  ],
  modules: [{
    id: 'cytology-mitosis',
    title: 'Cytology / Mitosis',
    ordering: 1,
    sourceIds: [BRIEF_SOURCE_ID],
    visible: true,
    published: false,
    contentStatus: 'content-blocked',
  }],
  structures: [],
  assets: [],
  questions: [],
  pathways: [],
};

export function getSource(id: string): SourceRecord | undefined {
  return content.sources.find((source) => source.id === id);
}