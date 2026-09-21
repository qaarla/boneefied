import type { Asset, Module, NormalizedHotspot, Question, SourceRecord } from './model';
import { SERVIER_SOURCE_ID } from './visual-content.ts';

export const PRACTICAL_COMMONS_SOURCE_ID = 'source-commons-practical-anatomy';
export const OPENSTAX_SPINAL_VISUAL_SOURCE_ID = 'source-openstax-spinal-cord-visual';
export const COMMONS_HISTOLOGY_SOURCE_ID = 'source-commons-epithelial-histology';

export const practicalVisualSources: SourceRecord[] = [
  {
    id: PRACTICAL_COMMONS_SOURCE_ID,
    filename: 'Blank axial and appendicular skeleton diagrams',
    hash: 'commons-blank-skeleton-diagrams-verified-2026-09-21',
    pageCount: null,
    title: 'Blank axial and appendicular skeleton diagrams',
    courseLabAssociation: null,
    sourceType: 'image',
    attributionLicenseStatus: 'Public domain; Mariana Ruiz Villarreal (LadyofHats), blank derivatives by Quico.',
    notes: 'Blank source variants were selected so Boneefied can add its own verified tap targets without exposing answer labels.',
    verificationStatus: 'verified',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Axial_skeleton_diagram_blank.svg',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  {
    id: OPENSTAX_SPINAL_VISUAL_SOURCE_ID,
    filename: 'OpenStax spinal cord cross-section specimen crop',
    hash: 'fe8415b361505ba745b9063c29ad192549ecd5300ed44ae3ada0132c779da8e6',
    pageCount: null,
    title: 'Spinal cord cross-section',
    courseLabAssociation: null,
    sourceType: 'image',
    attributionLicenseStatus: 'OpenStax Anatomy and Physiology, CC BY 4.0.',
    notes: 'Boneefied cropped the unlabeled photomicrograph panel from the source figure; anatomy was not altered.',
    verificationStatus: 'verified',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:1313_Spinal_Cord_Cross_Section.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    id: COMMONS_HISTOLOGY_SOURCE_ID,
    filename: 'Berkshire Community College epithelial tissue photomicrographs',
    hash: 'commons-bcc-epithelial-histology-cc0',
    pageCount: null,
    title: 'Epithelial tissue photomicrographs',
    courseLabAssociation: null,
    sourceType: 'image',
    attributionLicenseStatus: 'CC0 1.0; Berkshire Community College Bioscience Image Library.',
    notes: 'Unknown-style tissue images retain only source-supported tissue identity and visible recognition cues.',
    verificationStatus: 'verified',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Histology_of_epithelial_tissue',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
];

const h = (structureId: string, x: number, y: number, radius = 0.055): NormalizedHotspot => ({ structureId, x, y, radius });
const label = (structureId: string, displayLabel: string, x: number, y: number, radius = 0.055) => ({ structureId, displayLabel, x, y, radius });

const axialTargets = [
  label('skull', 'Skull', .50, .11, .09),
  label('mandible', 'Mandible', .50, .18),
  label('cervical-vertebrae', 'Cervical vertebrae', .50, .245),
  label('sternum', 'Sternum', .50, .36),
  label('true-ribs', 'True ribs', .40, .41, .07),
  label('thoracic-vertebrae', 'Thoracic vertebrae', .50, .43, .065),
  label('lumbar-vertebrae', 'Lumbar vertebrae', .50, .58, .065),
  label('sacrum', 'Sacrum', .50, .70, .065),
  label('coccyx', 'Coccyx', .50, .75, .045),
];

const appendicularTargets = [
  label('clavicle', 'Clavicle', .43, .205),
  label('scapula', 'Scapula', .35, .235, .065),
  label('humerus', 'Humerus', .28, .335, .075),
  label('radius', 'Radius', .245, .465, .055),
  label('ulna', 'Ulna', .205, .455, .055),
  label('carpals', 'Carpals', .165, .535, .045),
  label('metacarpals', 'Metacarpals', .145, .57, .05),
  label('pelvis', 'Pelvic girdle', .50, .48, .09),
  label('femur', 'Femur', .42, .63, .08),
  label('patella', 'Patella', .42, .72, .045),
  label('tibia', 'Tibia', .43, .82, .065),
  label('fibula', 'Fibula', .375, .82, .055),
  label('tarsals', 'Tarsals', .42, .925, .045),
  label('metatarsals', 'Metatarsals', .405, .955, .045),
];

export const practicalVisualAssets: Asset[] = [
  {
    id: 'asset-commons-axial-skeleton-blank',
    sourceId: PRACTICAL_COMMONS_SOURCE_ID,
    sourcePage: null,
    localAssetPath: 'assets/images/anatomy/commons-axial-skeleton-blank.png',
    assetType: 'diagram',
    labelStatus: 'unlabeled',
    attributionLicense: 'Public domain; Mariana Ruiz Villarreal (LadyofHats), blank derivative by Quico, via Wikimedia Commons.',
    verificationStatus: 'verified',
    title: 'Axial skeleton, anterior view',
    description: 'Blank anterior diagram with the axial skeleton highlighted for regional identification.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Axial_skeleton_diagram_blank.svg',
    rightsUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    adaptationNote: 'Boneefied rasterized the blank SVG and added verified normalized targets; underlying anatomy is unchanged.',
    imageAspectRatio: 960 / 1377,
    imageOrientation: 'portrait',
    hotspots: axialTargets.map(({ structureId, x, y, radius }) => h(structureId, x, y, radius)),
    labels: axialTargets,
  },
  {
    id: 'asset-commons-appendicular-skeleton-blank',
    sourceId: PRACTICAL_COMMONS_SOURCE_ID,
    sourcePage: null,
    localAssetPath: 'assets/images/anatomy/commons-appendicular-skeleton-blank.png',
    assetType: 'diagram',
    labelStatus: 'unlabeled',
    attributionLicense: 'Public domain; Mariana Ruiz Villarreal (LadyofHats), blank derivative by Quico, via Wikimedia Commons.',
    verificationStatus: 'verified',
    title: 'Appendicular skeleton, anterior view',
    description: 'Blank anterior diagram with the appendicular skeleton highlighted for regional identification and limb orientation.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Appendicular_skeleton_diagram_blank.svg',
    rightsUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    adaptationNote: 'Boneefied rasterized the blank SVG and added verified normalized targets; underlying anatomy is unchanged.',
    imageAspectRatio: 960 / 1774,
    imageOrientation: 'portrait',
    hotspots: appendicularTargets.map(({ structureId, x, y, radius }) => h(structureId, x, y, radius)),
    labels: appendicularTargets,
  },
  {
    id: 'asset-openstax-spinal-cord-specimen',
    sourceId: OPENSTAX_SPINAL_VISUAL_SOURCE_ID,
    sourcePage: null,
    localAssetPath: 'assets/images/anatomy/openstax-spinal-cord-specimen.jpg',
    assetType: 'histology',
    labelStatus: 'unlabeled',
    attributionLicense: 'OpenStax Anatomy and Physiology, CC BY 4.0.',
    verificationStatus: 'verified',
    title: 'Spinal cord cross-section specimen',
    description: 'Unlabeled specimen crop showing the central butterfly-shaped gray matter and peripheral white matter.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:1313_Spinal_Cord_Cross_Section.jpg',
    rightsUrl: 'https://creativecommons.org/licenses/by/4.0/',
    adaptationNote: 'Cropped to the source photomicrograph panel; no anatomical content changed.',
    imageAspectRatio: 1200 / 749,
    imageOrientation: 'landscape',
  },
  ...[
    ['asset-commons-simple-squamous-epithelium','commons-simple-squamous-epithelium.jpg','Simple squamous epithelium','https://commons.wikimedia.org/wiki/File:Epithelial_Tissues_Simple_Squamous_Epithelium_(40823230315).jpg'],
    ['asset-commons-simple-cuboidal-epithelium','commons-simple-cuboidal-epithelium.jpg','Simple cuboidal epithelium','https://commons.wikimedia.org/wiki/File:Epithelial_Tissues_Simple_Cuboidal_Epithelium_(41681552782).jpg'],
    ['asset-commons-simple-columnar-epithelium','commons-simple-columnar-epithelium.jpg','Simple columnar epithelium','https://commons.wikimedia.org/wiki/File:Epithelial_Tissues_Simple_Columnar_Epithelium_(27854452618).jpg'],
  ].map(([id, file, title, sourceUrl]): Asset => ({
    id,
    sourceId: COMMONS_HISTOLOGY_SOURCE_ID,
    sourcePage: null,
    localAssetPath: `assets/images/anatomy/${file}`,
    assetType: 'histology',
    labelStatus: 'unlabeled',
    attributionLicense: 'Berkshire Community College Bioscience Image Library, CC0 1.0.',
    verificationStatus: 'verified',
    title: `${title} specimen`,
    description: `Unknown-style ${title.toLowerCase()} photomicrograph.`,
    sourceUrl,
    rightsUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    imageAspectRatio: 1280 / 722,
    imageOrientation: 'landscape',
  })),
];

export const attachPracticalVisuals = (modules: Module[]): Module[] => modules.map((module) => {
  if (module.id === 'cells-tissues') {
    return {
      ...module,
      sourceIds: [...new Set([...module.sourceIds, COMMONS_HISTOLOGY_SOURCE_ID])],
      lessons: (module.lessons ?? []).map((lesson) => lesson.id === 'epithelial-patterns'
        ? {
          ...lesson,
          assetIds: [...new Set([...(lesson.assetIds ?? []), 'asset-commons-simple-squamous-epithelium', 'asset-commons-simple-cuboidal-epithelium', 'asset-commons-simple-columnar-epithelium'])],
          sourceIds: [...new Set([...lesson.sourceIds, COMMONS_HISTOLOGY_SOURCE_ID])],
        }
        : lesson),
    };
  }
  if (module.id === 'skeletal-system') {
    return {
      ...module,
      sourceIds: [...new Set([...module.sourceIds, PRACTICAL_COMMONS_SOURCE_ID])],
      lessons: (module.lessons ?? []).map((lesson) => lesson.id === 'skull-orientation'
        ? { ...lesson, assetIds: [...new Set([...(lesson.assetIds ?? []), 'asset-commons-axial-skeleton-blank'])], sourceIds: [...new Set([...lesson.sourceIds, PRACTICAL_COMMONS_SOURCE_ID])] }
        : lesson.id === 'limb-bones'
          ? { ...lesson, assetIds: [...new Set([...(lesson.assetIds ?? []), 'asset-commons-appendicular-skeleton-blank'])], sourceIds: [...new Set([...lesson.sourceIds, PRACTICAL_COMMONS_SOURCE_ID])] }
          : lesson),
    };
  }
  if (module.id === 'nervous-system') {
    return {
      ...module,
      sourceIds: [...new Set([...module.sourceIds, OPENSTAX_SPINAL_VISUAL_SOURCE_ID])],
      lessons: (module.lessons ?? []).map((lesson) => lesson.id === 'spinal-cord'
        ? { ...lesson, assetIds: [...new Set([...(lesson.assetIds ?? []), 'asset-openstax-spinal-cord-specimen'])], sourceIds: [...new Set([...lesson.sourceIds, OPENSTAX_SPINAL_VISUAL_SOURCE_ID])] }
        : lesson),
    };
  }
  return module;
});

const tap = (
  id: string,
  moduleId: string,
  structureId: string,
  prompt: string,
  assetId: string,
  target: NormalizedHotspot,
  explanation: string,
  sourceId = SERVIER_SOURCE_ID,
): Question => ({
  id, moduleId, structureIds: [structureId], taskType: 'hotspot', prompt,
  answer: structureId, acceptedAliases: [], assetId, hotspots: [target],
  explanation, sourceId, sourcePage: null, examPriority: true, verificationStatus: 'verified',
});

const skeletalTapQuestions: Question[] = [
  ...axialTargets.map((target) => tap(
    `q-practical-axial-${target.structureId}`, 'skeletal-system', target.structureId,
    `Tap the ${target.displayLabel.toLowerCase()} in this anterior axial-skeleton view.`,
    'asset-commons-axial-skeleton-blank', h(target.structureId, target.x, target.y, target.radius),
    `${target.displayLabel} is identified by its position in the highlighted axial skeleton.`,
    PRACTICAL_COMMONS_SOURCE_ID,
  )),
  ...appendicularTargets.map((target) => tap(
    `q-practical-appendicular-${target.structureId}`, 'skeletal-system', target.structureId,
    `Tap the ${target.displayLabel.toLowerCase()} in this anterior appendicular-skeleton view.`,
    'asset-commons-appendicular-skeleton-blank', h(target.structureId, target.x, target.y, target.radius),
    `${target.displayLabel} is identified by its position and orientation in the highlighted appendicular skeleton.`,
    PRACTICAL_COMMONS_SOURCE_ID,
  )),
];

const existingDiagramQuestions: Question[] = [
  tap('q-practical-elbow-joint-cavity','joints-ligaments','joint-cavity','Tap the joint cavity.','asset-servier-elbow-joint',h('joint-cavity',.55,.58),'The joint cavity is the narrow space between the cartilage-covered surfaces.'),
  tap('q-practical-elbow-capsule','joints-ligaments','fibrous-capsule','Tap the fibrous capsule.','asset-servier-elbow-joint',h('fibrous-capsule',.5,.65),'The fibrous capsule surrounds the synovial joint.'),
  tap('q-practical-brain-cerebrum','nervous-system','cerebrum','Tap the cerebrum.','asset-servier-brain-lateral',h('cerebrum',.48,.35),'The cerebrum forms the large superior portion of the brain.'),
  tap('q-practical-brain-medulla','nervous-system','medulla-oblongata','Tap the medulla oblongata.','asset-servier-brain-lateral',h('medulla-oblongata',.65,.62),'The medulla is the inferior brainstem region continuous with the spinal cord.'),
  tap('q-practical-brain-thalamus','nervous-system','thalamus','Tap the thalamus in this midsagittal view.','asset-servier-brain-sagittal',h('thalamus',.52,.5),'The thalamus lies centrally, inferior to the corpus callosum.'),
  tap('q-practical-heart-right-atrium','cardiovascular-system','cv-right-atrium','Tap the right atrium.','asset-servier-heart-anterior',h('cv-right-atrium',.35,.35),'In anterior view, the right atrium forms the right border of the heart.'),
  tap('q-practical-heart-pulmonary-trunk','cardiovascular-system','cv-pulmonary-trunk','Tap the pulmonary trunk.','asset-servier-heart-anterior',h('cv-pulmonary-trunk',.45,.18),'The pulmonary trunk exits the right ventricle superiorly.'),
  tap('q-practical-heart-right-coronary','cardiovascular-system','cv-right-coronary','Tap the right coronary artery.','asset-servier-heart-anterior',h('cv-right-coronary',.42,.55),'The right coronary artery courses in the coronary sulcus.'),
  tap('q-practical-kidney-medulla','urinary-system','urinary-system-renal-medulla','Tap the renal medulla.','asset-servier-kidney',h('urinary-system-renal-medulla',.5,.5),'The medulla is the inner region containing the renal pyramids.'),
  tap('q-practical-kidney-pelvis','urinary-system','urinary-system-renal-pelvis','Tap the renal pelvis.','asset-servier-kidney',h('urinary-system-renal-pelvis',.68,.58),'The renal pelvis is the central collecting funnel leading to the ureter.'),
  tap('q-practical-kidney-ureter','urinary-system','urinary-system-ureter','Tap the ureter.','asset-servier-kidney',h('urinary-system-ureter',.75,.8),'The ureter continues inferiorly from the renal pelvis.'),
  tap('q-practical-eye-optic-nerve','special-senses','optic-nerve-eye','Tap the optic nerve.','asset-servier-eye-section',h('optic-nerve-eye',.9,.5),'The optic nerve exits the posterior globe.'),
  tap('q-practical-ear-tympanic-membrane','special-senses','tympanic-membrane-ear','Tap the tympanic membrane.','asset-servier-ear-section',h('tympanic-membrane-ear',.4,.45),'The tympanic membrane separates the external canal from the middle ear.'),
  tap('q-practical-ear-semicircular-canals','special-senses','semicircular-canals-ear','Tap the semicircular canals.','asset-servier-ear-section',h('semicircular-canals-ear',.7,.25),'The semicircular canals form looped structures superior to the cochlea.'),
  tap('q-practical-lymph-medulla','lymphatic-system','lymph-medulla','Tap the lymph-node medulla.','asset-servier-lymph-node-section',h('lymph-medulla',.6,.58),'The medulla occupies the deeper central region of a lymph node.'),
  tap('q-practical-lymph-hilum','lymphatic-system','lymph-hilum','Tap the lymph-node hilum.','asset-servier-lymph-node-section',h('lymph-hilum',.8,.6),'The hilum is the indented region where vessels enter and leave.'),
  tap('q-practical-respiratory-nasal-cavity','respiratory-system','respiratory-system-nasal-cavity','Tap the nasal cavity.','asset-servier-respiratory-system',h('respiratory-system-nasal-cavity',.5,.12),'The nasal cavity is the superior entry to the conducting pathway.'),
  tap('q-practical-respiratory-right-lung','respiratory-system','respiratory-system-right-lung','Tap the right lung.','asset-servier-respiratory-system',h('respiratory-system-right-lung',.35,.62),'The right lung lies lateral to the mediastinum.'),
  tap('q-practical-male-prostate','male-reproductive','male-reproductive-prostate-gland','Tap the prostate gland.','asset-servier-male-reproductive',h('male-reproductive-prostate-gland',.5,.45),'The prostate lies inferior to the bladder around the proximal urethra.'),
  tap('q-practical-male-ductus','male-reproductive','male-reproductive-ductus-deferens','Tap the ductus deferens.','asset-servier-male-reproductive',h('male-reproductive-ductus-deferens',.32,.5),'The ductus deferens ascends from the testis toward the pelvic cavity.'),
  tap('q-practical-uterus','female-reproductive','female-reproductive-uterus','Tap the uterus.','asset-servier-uterus',h('female-reproductive-uterus',.5,.45),'The uterus is the central muscular organ superior to the cervix.'),
  tap('q-practical-cervix','female-reproductive','female-reproductive-cervix','Tap the cervix.','asset-servier-uterus',h('female-reproductive-cervix',.5,.76),'The cervix is the narrowed inferior portion of the uterus.'),
  tap('q-practical-pelvis-acetabulum','skeletal-system','acetabulum','Tap the acetabulum.','asset-servier-pelvis',h('acetabulum',.3,.5),'The acetabulum is the lateral socket receiving the femoral head.'),
  tap('q-practical-pelvis-ischium','skeletal-system','ischium','Tap the ischium.','asset-servier-pelvis',h('ischium',.3,.7),'The ischium forms the posteroinferior portion of the hip bone.'),
];

export const practicalVisualQuestions: Question[] = [
  ...skeletalTapQuestions,
  ...existingDiagramQuestions,
  {
    id: 'q-practical-spinal-cord-specimen',
    moduleId: 'nervous-system',
    structureIds: ['spinal-cord'],
    taskType: 'image-identification',
    prompt: 'Identify this unknown specimen from its butterfly-shaped central gray matter.',
    answer: 'Spinal cord',
    acceptedAliases: ['spinal cord cross-section', 'spinal cord cross section'],
    assetId: 'asset-openstax-spinal-cord-specimen',
    explanation: 'A spinal cord cross-section has butterfly-shaped central gray matter surrounded by peripheral white matter.',
    sourceId: OPENSTAX_SPINAL_VISUAL_SOURCE_ID,
    sourcePage: null,
    examPriority: true,
    verificationStatus: 'verified',
  },
  {
    id: 'q-practical-histology-simple-squamous',
    moduleId: 'cells-tissues',
    structureIds: ['simple-squamous-epithelium'],
    taskType: 'image-identification',
    prompt: 'Identify this unknown tissue from its single layer of very thin, flattened cells.',
    answer: 'Simple squamous epithelium',
    acceptedAliases: ['simple squamous'],
    assetId: 'asset-commons-simple-squamous-epithelium',
    explanation: 'Simple squamous epithelium is recognized by one delicate layer of flattened cells with flattened nuclei.',
    sourceId: COMMONS_HISTOLOGY_SOURCE_ID,
    sourcePage: null,
    examPriority: true,
    verificationStatus: 'verified',
  },
  {
    id: 'q-practical-histology-simple-cuboidal',
    moduleId: 'cells-tissues',
    structureIds: ['simple-cuboidal-epithelium'],
    taskType: 'image-identification',
    prompt: 'Identify this unknown tissue from its round lumens lined by one layer of cube-shaped cells.',
    answer: 'Simple cuboidal epithelium',
    acceptedAliases: ['simple cuboidal'],
    assetId: 'asset-commons-simple-cuboidal-epithelium',
    explanation: 'Simple cuboidal epithelium forms a single layer of roughly cube-shaped cells around small lumens.',
    sourceId: COMMONS_HISTOLOGY_SOURCE_ID,
    sourcePage: null,
    examPriority: true,
    verificationStatus: 'verified',
  },
  {
    id: 'q-practical-histology-simple-columnar',
    moduleId: 'cells-tissues',
    structureIds: ['simple-columnar-epithelium'],
    taskType: 'image-identification',
    prompt: 'Identify this unknown tissue from its single layer of tall cells lining the gut.',
    answer: 'Simple columnar epithelium',
    acceptedAliases: ['simple columnar'],
    assetId: 'asset-commons-simple-columnar-epithelium',
    explanation: 'Simple columnar epithelium is recognized by one layer of tall cells with elongated nuclei and an apical surface facing the lumen.',
    sourceId: COMMONS_HISTOLOGY_SOURCE_ID,
    sourcePage: null,
    examPriority: true,
    verificationStatus: 'verified',
  },
];