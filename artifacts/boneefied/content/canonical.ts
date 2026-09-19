import type { ContentCatalog, SourceRecord } from './model';

export const BRIEF_SOURCE_ID = 'source-course-brief';
export const CYTOLOGY_SOURCE_ID = 'source-user-transcribed-lab2';

export const content: ContentCatalog = {
  sources: [
    {
      id: CYTOLOGY_SOURCE_ID,
      filename: 'User-supplied transcribed excerpts from Lab 2 Cytology and Quizes(2)',
      hash: 'user-supplied-transcription-lab2-excerpts',
      pageCount: null,
      title: 'Cytology / Mitosis source-checked transcribed excerpts',
      courseLabAssociation: 'BIOL 250 Lab 2 Cytology',
      sourceType: 'text',
      attributionLicenseStatus: 'User-supplied source excerpts; original files not present in this runtime',
      notes: 'Transcribed facts supplied by the user: Lab 2 PDF pp. 5–8 (printed 35–38) and Quizes(2).pdf pp. 11–12. Text-only provenance; no images or inferred labels.',
      verificationStatus: 'verified',
    },
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
    labNumber: '2',
    sourceIds: [CYTOLOGY_SOURCE_ID],
    visible: true,
    published: true,
    contentStatus: 'available',
  }],
  structures: [
    ...[
      ['interphase','Interphase','cell cycle',5],['g1','G1 phase','cell cycle',5],['s-phase','S phase','cell cycle',5],
      ['g2','G2 phase','cell cycle',5],['sister-chromatids','Sister chromatids','chromosome',5],
      ['centromere','Centromere','chromosome',5],['mitosis','Mitosis','cell division',6],
      ['cytokinesis','Cytokinesis','cell division',6],['prophase','Prophase','mitosis stage',7],
      ['metaphase','Metaphase','mitosis stage',7],['anaphase','Anaphase','mitosis stage',7],
      ['telophase','Telophase','mitosis stage',8],['plasma-membrane','Plasma membrane','cell structure',11],
      ['mitochondrion','Mitochondrion','organelle',12],['smooth-er','Smooth endoplasmic reticulum','organelle',12],
    ].map(([id, name, category, page]) => ({
      id: id as string, canonicalName: name as string, acceptedAliases: [], moduleId: 'cytology-mitosis',
      category: category as string, sourceId: CYTOLOGY_SOURCE_ID, sourcePage: page as number,
      examPriority: true, verificationStatus: 'verified' as const,
    })),
  ],
  assets: [],
  questions: [
    { id:'q-cycle-order', moduleId:'cytology-mitosis', structureIds:['g1','s-phase','g2'], taskType:'ordered-sequence', prompt:'Order the interphase stages from first to last.', answer:['G1','S','G2'], acceptedAliases:[], options:['G1','S','G2'], explanation:'The source describes G1 growth/resource accumulation, S DNA replication, then G2 second growth.', sourceId:CYTOLOGY_SOURCE_ID, sourcePage:5, examPriority:true, verificationStatus:'verified' },
    { id:'q-mitosis-order', moduleId:'cytology-mitosis', structureIds:['mitosis','prophase','metaphase','anaphase','telophase'], taskType:'ordered-sequence', prompt:'Order the traditional stages of mitosis.', answer:['Prophase','Metaphase','Anaphase','Telophase'], acceptedAliases:[], options:['Prophase','Metaphase','Anaphase','Telophase'], explanation:'The supplied quiz excerpt gives the four-stage order.', sourceId:CYTOLOGY_SOURCE_ID, sourcePage:11, examPriority:true, verificationStatus:'verified' },
    { id:'q-sister', moduleId:'cytology-mitosis', structureIds:['sister-chromatids','centromere'], taskType:'multiple-choice', prompt:'After S phase, what is true of each chromosome?', answer:'Two identical sister chromatids joined at the centromere', acceptedAliases:[], options:['Two identical sister chromatids joined at the centromere','One chromatid with no DNA','Two unrelated chromosomes','A cell plate forms'], explanation:'After S, each chromosome has two identical sister chromatids joined at the centromere.', sourceId:CYTOLOGY_SOURCE_ID, sourcePage:5, examPriority:true, verificationStatus:'verified' },
    { id:'q-animal-plant', moduleId:'cytology-mitosis', structureIds:['cytokinesis'], taskType:'select-all', prompt:'Select the source-supported cytokinesis statements.', answer:['Animal cells use an actin ring/cleavage furrow','Plant cells form a cell plate from Golgi-derived vesicles'], acceptedAliases:[], options:['Animal cells use an actin ring/cleavage furrow','Plant cells form a cell plate from Golgi-derived vesicles','Mitosis separates the cytoplasm','The spindle dissolves DNA'], explanation:'The source distinguishes animal cleavage furrows from plant cell plates.', sourceId:CYTOLOGY_SOURCE_ID, sourcePage:6, examPriority:true, verificationStatus:'verified' },
    { id:'q-prophase', moduleId:'cytology-mitosis', structureIds:['prophase'], taskType:'select-all', prompt:'Which events are described for prophase?', answer:['Nucleolus disappears','Chromatin condenses','Centrosomes separate','Spindle forms'], acceptedAliases:[], options:['Nucleolus disappears','Chromatin condenses','Centrosomes separate','Spindle forms','Chromosomes align at the metaphase plate'], explanation:'These four events are listed in the supplied p7 transcription.', sourceId:CYTOLOGY_SOURCE_ID, sourcePage:7, examPriority:true, verificationStatus:'verified' },
    { id:'q-metaphase', moduleId:'cytology-mitosis', structureIds:['metaphase'], taskType:'multiple-choice', prompt:'What happens in metaphase?', answer:'Chromosomes align at the metaphase plate', acceptedAliases:[], options:['Chromosomes align at the metaphase plate','Nuclear envelopes form','DNA replicates','A cell plate forms'], explanation:'The supplied transcription identifies metaphase by chromosome alignment at the metaphase plate.', sourceId:CYTOLOGY_SOURCE_ID, sourcePage:7, examPriority:true, verificationStatus:'verified' },
    { id:'q-anaphase', moduleId:'cytology-mitosis', structureIds:['anaphase'], taskType:'typed-recall', prompt:'In anaphase, what moves toward opposite poles?', answer:'Sister chromatids', acceptedAliases:['chromatids'], explanation:'The source says chromatids separate and move toward opposite poles.', sourceId:CYTOLOGY_SOURCE_ID, sourcePage:7, examPriority:true, verificationStatus:'verified' },
    { id:'q-telophase', moduleId:'cytology-mitosis', structureIds:['telophase'], taskType:'select-all', prompt:'Select the source-supported telophase events.', answer:['Nuclear envelopes form','Chromosomes unfold into chromatin','Nucleoli reappear'], acceptedAliases:[], options:['Nuclear envelopes form','Chromosomes unfold into chromatin','Nucleoli reappear','DNA replicates'], explanation:'All three selected events are in the supplied p8 transcription.', sourceId:CYTOLOGY_SOURCE_ID, sourcePage:8, examPriority:true, verificationStatus:'verified' },
    { id:'q-membrane', moduleId:'cytology-mitosis', structureIds:['plasma-membrane'], taskType:'typed-recall', prompt:'What surrounds the cell as the plasma membrane?', answer:'A phospholipid bilayer', acceptedAliases:['phospholipid bilayer'], explanation:'The supplied quiz excerpt defines the plasma membrane as a phospholipid bilayer surrounding the cell.', sourceId:CYTOLOGY_SOURCE_ID, sourcePage:11, examPriority:true, verificationStatus:'verified' },
    { id:'q-organelles', moduleId:'cytology-mitosis', structureIds:['mitochondrion','smooth-er'], taskType:'select-all', prompt:'Select the source-supported organelle functions.', answer:['Mitochondrion supports cellular respiration/energy','Smooth ER supports lipid production, carbohydrate metabolism, and detoxification'], acceptedAliases:[], options:['Mitochondrion supports cellular respiration/energy','Smooth ER supports lipid production, carbohydrate metabolism, and detoxification','Smooth ER makes the cleavage furrow'], explanation:'These functions are stated in the supplied quiz excerpt.', sourceId:CYTOLOGY_SOURCE_ID, sourcePage:12, examPriority:true, verificationStatus:'verified' },
  ],
  pathways: [],
};

export function getSource(id: string): SourceRecord | undefined {
  return content.sources.find((source) => source.id === id);
}