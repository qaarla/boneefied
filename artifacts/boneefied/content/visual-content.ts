import type { Asset, Lesson, Question, SourceRecord, Structure } from './model';

export const SERVIER_SOURCE_ID = 'source-servier-medical-art';
export const HISTOLOGY_SOURCE_ID = 'source-commons-histology';
export const ORIGINAL_VISUAL_SOURCE_ID = 'source-boneefied-original-visuals';
const servierCredit = 'Adapted from Servier Medical Art (https://smart.servier.com), licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Changes: labels/targets added by Boneefied.';
export const visualSources: SourceRecord[] = [
  { id: SERVIER_SOURCE_ID, filename: 'Servier Medical Art anatomy illustrations', hash: 'servier-boneefied-anatomy-set', pageCount: null, title: 'Servier Medical Art illustrations', courseLabAssociation: null, sourceType: 'image', attributionLicenseStatus: servierCredit, notes: 'Label-free illustrations; Boneefied adds only verified labels and tap targets.', verificationStatus: 'verified', sourceUrl: 'https://smart.servier.com', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/' },
  { id: HISTOLOGY_SOURCE_ID, filename: 'Commons kidney cortex and alveolar sac specimens', hash: 'commons-boneefied-histology-set', pageCount: null, title: 'Wikimedia Commons histology specimens', courseLabAssociation: null, sourceType: 'image', attributionLicenseStatus: 'CC BY-SA 3.0 / CC BY-SA 4.0; individual asset credits recorded below.', notes: 'Specimen images are described only by visible broad features; no stain, magnification, organism, or pathology is claimed.', verificationStatus: 'verified', sourceUrl: 'https://commons.wikimedia.org', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { id: ORIGINAL_VISUAL_SOURCE_ID, filename: 'Boneefied original learning diagrams', hash: 'boneefied-original-visuals', pageCount: null, title: 'Boneefied original learning diagrams', courseLabAssociation: null, sourceType: 'image', attributionLicenseStatus: 'Original diagrams created for Boneefied.', notes: 'Label-free diagrams created for structured overlays and recall practice.', verificationStatus: 'verified' },
];

const path = (name: string) => `assets/images/anatomy/${name}`;
const hotspot = (structureId: string, x: number, y: number) => ({ structureId, x, y, radius: 0.08 });
const displayLabel = (structureId: string) => {
  const readable = structureId
    .replace(/^(cv|endo|lymph)-/, '')
    .replace(/^(digestive|urinary|respiratory)-system-/, '')
    .replace(/^(female|male)-reproductive-/, '')
    .replace(/-(cell|eye|ear)$/, '')
    .replaceAll('-', ' ');
  return readable.charAt(0).toUpperCase() + readable.slice(1);
};
const labelsFor = (targets: ReturnType<typeof hotspot>[]) => targets.map((target) => ({
  ...target,
  displayLabel: displayLabel(target.structureId),
}));
const servier = (id: string, file: string, title: string, targets: ReturnType<typeof hotspot>[], description: string): Asset => ({
  id, sourceId: SERVIER_SOURCE_ID, sourcePage: null, localAssetPath: path(file), assetType: 'diagram', labelStatus: 'unlabeled',
  attributionLicense: servierCredit, verificationStatus: 'verified', title, description, sourceUrl: 'https://smart.servier.com', rightsUrl: 'https://creativecommons.org/licenses/by/4.0/', hotspots: targets, labels: labelsFor(targets),
  adaptationNote: 'Boneefied added labels and targets; the underlying illustration is unchanged.',
});
const original = (id: string, file: string, title: string, targets: ReturnType<typeof hotspot>[], description: string): Asset => ({
  id, sourceId: ORIGINAL_VISUAL_SOURCE_ID, sourcePage: null, localAssetPath: path(file), assetType: 'diagram', labelStatus: 'unlabeled',
  attributionLicense: 'Original diagram created for Boneefied.', verificationStatus: 'verified', title, description, hotspots: targets, labels: labelsFor(targets),
  adaptationNote: 'Boneefied original artwork with structured labels and targets.',
});
export const visualAssets: Asset[] = [
  original('asset-original-cell-overview','original-cell-overview.png','Original cell overview',[hotspot('plasma-membrane',.08,.5),hotspot('cytoplasm',.52,.2),hotspot('nucleus-cell',.4,.46),hotspot('nucleolus-cell',.55,.54),hotspot('mitochondrion-cell',.28,.68),hotspot('smooth-er-cell',.7,.35),hotspot('golgi-apparatus-cell',.72,.65),hotspot('centrosome-cell',.82,.5)],'Original Boneefied diagram of a generalized cell; targets are broad visual regions.'),
  original('asset-original-mitosis-stages','original-mitosis-stages.png','Original mitosis stages',[hotspot('interphase',.1,.5),hotspot('prophase',.3,.5),hotspot('metaphase',.5,.5),hotspot('anaphase',.7,.5),hotspot('telophase',.9,.5)],'Original Boneefied stage comparison diagram.'),
  original('asset-original-anatomical-planes','original-anatomical-planes.png','Original anatomical planes',[hotspot('sagittal-plane',.2,.5),hotspot('coronal-plane',.5,.5),hotspot('transverse-plane',.8,.5)],'Original Boneefied plane diagram.'),
  original('asset-original-body-cavities','original-body-cavities.png','Original body cavities',[hotspot('cranial-cavity',.5,.12),hotspot('vertebral-cavity',.5,.3),hotspot('thoracic-cavity',.5,.52),hotspot('abdominal-cavity',.5,.72),hotspot('pelvic-cavity',.5,.88)],'Original Boneefied cavity diagram.'),
  { ...servier('asset-servier-elbow-joint','servier-elbow-joint.png','Elbow joint',[hotspot('humerus',.18,.18),hotspot('articular-cartilage',.23,.695),hotspot('joint-cavity',.365,.555),hotspot('fibrous-capsule',.391,.52)],'Servier elbow joint illustration; broad joint landmarks only.'), imageAspectRatio: 438 / 465, imageOrientation: 'portrait' },
  servier('asset-servier-brain-lateral','servier-brain-lateral.png','Brain lateral view',[hotspot('cerebrum',.48,.35),hotspot('cerebellum',.72,.7),hotspot('medulla-oblongata',.65,.62)],'Lateral brain illustration.'),
  servier('asset-servier-brain-sagittal','servier-brain-sagittal.png','Brain sagittal view',[hotspot('corpus-callosum',.45,.38),hotspot('thalamus',.52,.5),hotspot('cerebellum',.72,.68),hotspot('medulla-oblongata',.63,.72)],'Sagittal brain illustration; only clearly visible structures are targeted.'),
  servier('asset-servier-heart-anterior','servier-heart-anterior.png','Heart anterior view',[hotspot('cv-right-atrium',.35,.35),hotspot('cv-left-ventricle',.58,.7),hotspot('cv-pulmonary-trunk',.45,.18),hotspot('cv-ascending-aorta',.55,.15),hotspot('cv-right-coronary',.42,.55)],'Anterior heart illustration.'),
  servier('asset-servier-stomach-section','servier-stomach-section.png','Stomach section',[hotspot('digestive-system-stomach',.5,.5),hotspot('digestive-system-rugae',.5,.35)],'Stomach section with organ wall folds visible.'),
  servier('asset-servier-kidney','servier-kidney.png','Kidney section',[hotspot('urinary-system-renal-cortex',.3,.35),hotspot('urinary-system-renal-medulla',.5,.5),hotspot('urinary-system-renal-pelvis',.68,.58),hotspot('urinary-system-ureter',.75,.8)],'Kidney section showing broad regions and outflow.'),
  servier('asset-servier-thyroid-anterior','servier-thyroid-anterior.png','Thyroid anterior view',[hotspot('endo-thyroid-lobe',.35,.5),hotspot('endo-thyroid-isthmus',.5,.55)],'Anterior thyroid illustration.'),
  servier('asset-servier-ovary','servier-ovary.png','Ovary and follicles',[hotspot('female-reproductive-ovary',.5,.5),hotspot('female-reproductive-ovarian-cortex',.32,.35)],'Ovary illustration with broad follicular regions.'),
  servier('asset-servier-uterus','servier-uterus.png','Uterus',[hotspot('female-reproductive-uterus',.5,.45),hotspot('female-reproductive-cervix',.5,.76)],'Uterus illustration.'),
  servier('asset-servier-eye-section','servier-eye-section.png','Eye section',[hotspot('retina-eye',.72,.5),hotspot('optic-nerve-eye',.9,.5)],'Eye section with major wall and nerve regions.'),
  servier('asset-servier-ear-section','servier-ear-section.png','Ear section',[hotspot('tympanic-membrane-ear',.4,.45),hotspot('cochlea-ear',.72,.68),hotspot('semicircular-canals-ear',.7,.25)],'Ear section with major hearing and balance structures.'),
  servier('asset-servier-male-reproductive','servier-male-reproductive.png','Male reproductive system',[hotspot('male-reproductive-prostate-gland',.5,.45),hotspot('male-reproductive-testis',.3,.78),hotspot('male-reproductive-ductus-deferens',.32,.5)],'Male reproductive illustration; broad structures only.'),
  servier('asset-servier-lymph-node-section','servier-lymph-node-section.png','Lymph node section',[hotspot('lymph-cortex',.35,.45),hotspot('lymph-medulla',.6,.58),hotspot('lymph-hilum',.8,.6)],'Lymph node section with broad compartments.'),
  servier('asset-servier-respiratory-system','servier-respiratory-system.png','Respiratory system',[hotspot('respiratory-system-nasal-cavity',.5,.12),hotspot('respiratory-system-trachea',.5,.35),hotspot('respiratory-system-right-lung',.35,.62)],'Respiratory system illustration.'),
  { ...servier('asset-servier-pelvis','servier-pelvis.png','Pelvis',[hotspot('pelvis',.5,.45),hotspot('sacrum',.5,.44),hotspot('ilium',.25,.3),hotspot('pubis',.40,.61),hotspot('ischium',.3,.69),hotspot('acetabulum',.225,.58),hotspot('femur',.17,.84)],'Pelvic girdle illustration.'), imageAspectRatio: 256 / 294, imageOrientation: 'portrait' },
];
export const histologyAssets: Asset[] = [
  { id:'asset-commons-kidney-cortex-human', sourceId:HISTOLOGY_SOURCE_ID, sourcePage:null, localAssetPath:path('commons-kidney-cortex-human.jpg'), assetType:'histology', labelStatus:'unlabeled', attributionLicense:'Josef Reischig, CC BY-SA 3.0', verificationStatus:'verified', title:'Human kidney cortex specimen', description:'Human kidney cortex specimen; broad glomerular and tubular profiles are visible. Stain and magnification are not asserted.', sourceUrl:'https://commons.wikimedia.org/wiki/File:Kidney_cortex_(947_21)_Human.jpg', rightsUrl:'https://creativecommons.org/licenses/by-sa/3.0/' },
  { id:'asset-commons-alveolar-sac', sourceId:HISTOLOGY_SOURCE_ID, sourcePage:null, localAssetPath:path('commons-alveolar-sac.jpg'), assetType:'histology', labelStatus:'unlabeled', attributionLicense:'Jpogi, CC BY-SA 4.0', verificationStatus:'verified', title:'Alveolar sac specimen', description:'Alveolar sac specimen with broad air spaces and septa; organism, stain, and magnification are not asserted.', sourceUrl:'https://commons.wikimedia.org/wiki/File:Alveolar_sac.JPG', rightsUrl:'https://creativecommons.org/licenses/by-sa/4.0/' },
];

const q = (id:string,moduleId:string,structureIds:string[],taskType:Question['taskType'],prompt:string,answer:string|string[],options:string[]|undefined,assetId:string,explanation:string,sourceId=SERVIER_SOURCE_ID,hotspots?:Question['hotspots']):Question => ({id,moduleId,structureIds,taskType,prompt,answer,acceptedAliases:[],options,assetId,explanation,sourceId,sourcePage:null,examPriority:true,verificationStatus:'verified',...(hotspots ? { hotspots } : {})});
export const visualQuestions: Question[] = [
 q('q-visual-cell-nucleus','cells-tissues',['nucleus-cell'],'hotspot','Tap the nucleus.', 'nucleus-cell',undefined,'asset-original-cell-overview','The nucleus is the large central compartment in this generalized cell.','source-openstax-ap-2013-cells-tissues',[hotspot('nucleus-cell',.52,.52)]),
 q('q-visual-mitosis-metaphase','cytology-mitosis',['metaphase'],'hotspot','Tap the metaphase panel.','metaphase',undefined,'asset-original-mitosis-stages','Metaphase is the panel with chromosomes aligned at the cell center.','source-user-transcribed-lab2',[hotspot('metaphase',.5,.5)]),
 q('q-visual-plane-sagittal','anatomy-foundations',['sagittal-plane'],'multiple-choice','Which plane is marked in the original diagram?','Sagittal plane',['Sagittal plane','Coronal plane','Transverse plane'],'asset-original-anatomical-planes','The sagittal plane divides left and right portions.','source-openstax-ap-2013'),
 q('q-visual-cavity-thoracic','anatomy-foundations',['thoracic-cavity'],'hotspot','Tap the thoracic cavity.','thoracic-cavity',undefined,'asset-original-body-cavities','The thoracic cavity lies within the chest and superior to the abdominal cavity.',undefined,[hotspot('thoracic-cavity',.5,.52)]),
 q('q-visual-elbow-cartilage','joints-ligaments',['articular-cartilage'],'hotspot','Tap the articular cartilage at the elbow.', 'articular-cartilage',undefined,'asset-servier-elbow-joint','Articular cartilage covers the joint-facing bone surfaces.',undefined,[hotspot('articular-cartilage',.23,.695)]),
 q('q-visual-brain-cerebellum','nervous-system',['cerebellum'],'hotspot','Tap the cerebellum.', 'cerebellum',undefined,'asset-servier-brain-lateral','The cerebellum is the posterior, inferior folded region.',undefined,[hotspot('cerebellum',.72,.7)]),
 q('q-visual-brain-sagittal','nervous-system',['corpus-callosum'],'multiple-choice','Which structure is the curved commissural band marked in the sagittal view?','Corpus callosum',['Corpus callosum','Thalamus','Medulla oblongata','Cerebellum'],'asset-servier-brain-sagittal','The corpus callosum is the major commissural band between cerebral hemispheres.'),
 q('q-visual-heart-aorta','cardiovascular-system',['cv-ascending-aorta'],'hotspot','Tap the ascending aorta.', 'Ascending aorta',undefined,'asset-servier-heart-anterior','The ascending aorta is the large superior vessel leaving the left ventricle.',undefined,[hotspot('cv-ascending-aorta',.55,.15)]),
 q('q-visual-heart-ventricle','cardiovascular-system',['cv-left-ventricle'],'multiple-choice','Which chamber forms most of the apex in this view?','Left ventricle',['Left ventricle','Right atrium','Left atrium','Right ventricle'],'asset-servier-heart-anterior','The left ventricle forms most of the inferior apex.'),
 q('q-visual-stomach','digestive-system',['digestive-system-stomach'],'hotspot','Tap the stomach.', 'Stomach',undefined,'asset-servier-stomach-section','The stomach is the expanded organ shown between the esophagus and duodenum.',undefined,[hotspot('digestive-system-stomach',.5,.5)]),
 q('q-visual-kidney-cortex','urinary-system',['urinary-system-renal-cortex'],'hotspot','Tap the renal cortex.', 'Renal cortex',undefined,'asset-servier-kidney','The cortex forms the outer kidney region.',undefined,[hotspot('urinary-system-renal-cortex',.3,.35)]),
 q('q-visual-thyroid-isthmus','endocrine-system',['endo-thyroid-isthmus'],'hotspot','Tap the structure marked at the midline between the thyroid lobes.','endo-thyroid-isthmus',undefined,'asset-servier-thyroid-anterior','The isthmus bridges the two thyroid lobes.',SERVIER_SOURCE_ID,[hotspot('endo-thyroid-isthmus',.5,.55)]),
 q('q-visual-ovary','female-reproductive',['female-reproductive-ovary'],'hotspot','Tap the ovary.', 'Ovary',undefined,'asset-servier-ovary','The ovary is the gonad shown with follicles.',undefined,[hotspot('female-reproductive-ovary',.5,.5)]),
 q('q-visual-eye-retina','special-senses',['retina-eye'],'hotspot','Tap the retina.', 'Retina',undefined,'asset-servier-eye-section','The retina is the inner sensory layer lining the posterior eye.',undefined,[hotspot('retina-eye',.72,.5)]),
 q('q-visual-ear-cochlea','special-senses',['cochlea-ear'],'multiple-choice','Which spiral structure is visible in the ear section?','Cochlea',['Cochlea','Semicircular canals','Tympanic membrane','Auditory tube'],'asset-servier-ear-section','The cochlea is the spiral hearing organ.'),
 q('q-visual-male-testis','male-reproductive',['male-reproductive-testis'],'hotspot','Tap the testis.', 'Testis',undefined,'asset-servier-male-reproductive','The testis is the gonad in the scrotal region.',undefined,[hotspot('male-reproductive-testis',.3,.78)]),
 q('q-visual-lymph-node-cortex','lymphatic-system',['lymph-cortex'],'hotspot','Tap the broad compartment near the outer edge of the node.','lymph-cortex',undefined,'asset-servier-lymph-node-section','The cortex is peripheral to the medulla.',SERVIER_SOURCE_ID,[hotspot('lymph-cortex',.35,.45)]),
 q('q-visual-respiratory-trachea','respiratory-system',['respiratory-system-trachea'],'hotspot','Tap the trachea.', 'Trachea',undefined,'asset-servier-respiratory-system','The trachea is the central conducting tube superior to the main bronchi.',undefined,[hotspot('respiratory-system-trachea',.5,.35)]),
 q('q-visual-kidney-histology','urinary-system',['urinary-system-glomerulus'],'histology-identification','Identify the broad specimen shown.','Kidney cortex',['Kidney cortex','Alveolar sac','Skeletal muscle'],'asset-commons-kidney-cortex-human','The specimen is identified as human kidney cortex; glomerular and tubular profiles are the broad recognition cues.',HISTOLOGY_SOURCE_ID),
 q('q-visual-alveolar-histology','respiratory-system',['respiratory-system-alveolar-sac'],'histology-identification','Identify the broad specimen shown.','Alveolar sac',['Alveolar sac','Kidney cortex','Thyroid'],'asset-commons-alveolar-sac','The specimen shows broad air spaces separated by thin septa, consistent with an alveolar sac.',HISTOLOGY_SOURCE_ID),
];

export const cytologyStructures: Structure[] = [
 ['nucleus','Nucleus'],['nuclear-envelope-cytology','Nuclear envelope'],['nucleolus','Nucleolus'],['chromatin','Chromatin'],['centrosome','Centrosome'],['cytosol','Cytosol'],['golgi-apparatus','Golgi apparatus'],
].map(([id,canonicalName]) => ({id,canonicalName,acceptedAliases:[],moduleId:'cytology-mitosis',category:'cell structure',sourceId:'source-user-transcribed-lab2',sourcePage:7,examPriority:true,verificationStatus:'verified'}));
export const foundationVisualStructures: Structure[] = [
  ['sagittal-plane','Sagittal plane',['sagittal section']],['coronal-plane','Coronal plane',['frontal plane','frontal section']],
  ['transverse-plane','Transverse plane',['axial plane','horizontal plane','axial section']],
  ['cranial-cavity','Cranial cavity',[]],['vertebral-cavity','Vertebral cavity',['spinal cavity']],
  ['thoracic-cavity','Thoracic cavity',['chest cavity']],['abdominal-cavity','Abdominal cavity',[]],['pelvic-cavity','Pelvic cavity',[]],
 ].map(([id,canonicalName,acceptedAliases]) => ({id: id as string,canonicalName: canonicalName as string,acceptedAliases: acceptedAliases as string[],moduleId:'anatomy-foundations',category:'orientation',sourceId:'source-openstax-ap-2013',sourcePage:null,examPriority:true,verificationStatus:'verified'}));
const lesson = (id:string,title:string,summary:string,structureIds:string[],assetIds:string[]):Lesson => ({id,title,summary,structureIds,recognitionCues:['Use the verified diagram target and the supplied text definition.'],landmarks:[],relationships:[],commonConfusions:[],sourceIds:['source-user-transcribed-lab2'],assetIds});
export const cytologyLessons: Lesson[] = [
 lesson('cytology-cell-boundary','Cell boundary and cytosol','Separate the plasma membrane from the cytosol/cytoplasm inside it.',['plasma-membrane','cytosol'],['asset-original-cell-overview']),
 lesson('cytology-nucleus-genome','Nucleus and genome','Recognize the nucleus, nuclear envelope, nucleolus, and chromatin.',['nucleus','nuclear-envelope-cytology','nucleolus','chromatin'],['asset-original-cell-overview']),
 lesson('cytology-organelles','Organelles','Use the cell overview to locate mitochondria, ER, Golgi, and centrosome.',['mitochondrion','smooth-er','centrosome','golgi-apparatus'],['asset-original-cell-overview']),
 lesson('cytology-cell-cycle','Cell cycle and interphase','Place interphase in the cell cycle and distinguish its broad stages.',['interphase','g1','s-phase','g2'],['asset-original-mitosis-stages']),
 lesson('cytology-mitotic-recognition','Mitotic recognition','Identify prophase through telophase by chromosome arrangement cues.',['prophase','metaphase','anaphase','telophase'],['asset-original-mitosis-stages']),
 lesson('cytology-cytokinesis','Cytokinesis','Distinguish cytoplasmic division from nuclear mitosis.',['cytokinesis','plasma-membrane'],['asset-original-mitosis-stages']),
];
export const cytologyGapQuestions: Question[] = [
 q('q-cytology-stage-transfer','cytology-mitosis',['metaphase'],'multiple-choice','A cell image shows chromosomes aligned at the metaphase plate. Which stage is shown?','Metaphase',['Metaphase','Prophase','Anaphase','Telophase'],'asset-original-mitosis-stages','Alignment at the cell center is the supplied cue for metaphase.', 'source-user-transcribed-lab2'),
 q('q-cytology-mitosis-cytokinesis','cytology-mitosis',['mitosis','cytokinesis'],'multiple-choice','Which statement distinguishes mitosis from cytokinesis?','Mitosis separates chromosomes; cytokinesis divides the cytoplasm',['Mitosis separates chromosomes; cytokinesis divides the cytoplasm','Both terms mean DNA replication','Cytokinesis aligns chromosomes','Mitosis is only membrane division'],'asset-original-mitosis-stages','The source separates nuclear chromosome division from cytoplasmic division.', 'source-user-transcribed-lab2'),
 q('q-cytology-membrane-cytosol','cytology-mitosis',['plasma-membrane','cytosol'],'multiple-choice','Which pairing is correct?','Plasma membrane is the boundary; cytosol is the fluid interior',['Plasma membrane is the boundary; cytosol is the fluid interior','Cytosol is the outer bilayer; membrane is the nucleus','Both are chromosomes','Membrane is only present during mitosis'],'asset-original-cell-overview','The diagram and supplied definitions distinguish the boundary from internal cytosol.', 'source-user-transcribed-lab2'),
 q('q-cytology-organelle-contrast','cytology-mitosis',['mitochondrion','smooth-er'],'multiple-choice','Which contrast matches the supplied organelle functions?','Mitochondria support cellular respiration; smooth ER supports lipid production and detoxification',['Mitochondria support cellular respiration; smooth ER supports lipid production and detoxification','Both form the spindle','Smooth ER stores chromosomes','Mitochondria form the plasma membrane'],'asset-original-cell-overview','These contrasting functions are stated in the supplied quiz excerpt.', 'source-user-transcribed-lab2'),
];