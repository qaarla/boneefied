import type { Lesson, Question, SourceRecord, Structure } from './model';

export const BLOOD_SOURCE_ID = 'source-openstax-ap-2013-blood-ch18';
const moduleId = 'cardiovascular-system';
// Original text-first summaries checked against OpenStax Anatomy and Physiology
// (2013), §§18.1–18.4. No source figures or unlabeled smear images are reused.
export const bloodSources: SourceRecord[] = [{
  id: BLOOD_SOURCE_ID,
  filename: 'OpenStax Anatomy and Physiology (2013), Chapter 18: Blood',
  hash: 'openstax-ap-2013-blood-ch18-cc-by-4',
  pageCount: null,
  title: 'OpenStax 2013 · Blood',
  courseLabAssociation: null,
  sourceType: 'text',
  attributionLicenseStatus: 'CC BY 4.0; attribution to OpenStax and contributors required',
  notes: 'Original-edition §§18.1–18.4 used for independently written blood-microanatomy summaries; no figures copied.',
  sourceUrl: 'https://openstax.org/books/anatomy-and-physiology/pages/18-1-an-overview-of-blood',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  verificationStatus: 'verified',
}];

const rows: Array<[string, string, string, string[]]> = [
  ['plasma','Blood plasma','blood liquid matrix',['plasma fraction']],
  ['serum','Serum','blood liquid after clotting',['blood serum']],
  ['formed-elements','Formed elements','blood tissue components',['cellular blood components']],
  ['buffy-coat','Buffy coat','centrifuged blood layer',['white cell and platelet layer']],
  ['erythrocyte','Erythrocyte','formed element',['red blood cell','RBC']],
  ['central-pallor','Central pallor','erythrocyte smear feature',['pale center of an RBC']],
  ['platelet','Platelet','formed element',['thrombocyte']],
  ['megakaryocyte','Megakaryocyte','marrow cell',['platelet precursor cell']],
  ['leukocyte','Leukocyte','formed element',['white blood cell','WBC']],
  ['granulocyte','Granulocyte','leukocyte group',['granular leukocyte']],
  ['agranulocyte','Agranulocyte','leukocyte group',['agranular leukocyte']],
  ['neutrophil','Neutrophil','granulocyte',['polymorphonuclear leukocyte','PMN']],
  ['eosinophil','Eosinophil','granulocyte',['eosinophilic granulocyte']],
  ['basophil','Basophil','granulocyte',['basophilic granulocyte']],
  ['lymphocyte','Lymphocyte','agranulocyte',['lymphocyte WBC']],
  ['monocyte','Monocyte','agranulocyte',['monocyte WBC']],
  ['red-bone-marrow','Red bone marrow','hematopoietic tissue',['hematopoietic marrow','red marrow']],
  ['hematopoiesis','Hematopoiesis','blood-cell production',['hemopoiesis']],
  ['hematopoietic-stem-cell','Hematopoietic stem cell','marrow precursor',['blood stem cell','hemocytoblast']],
  ['peripheral-blood-smear','Peripheral blood smear','microscopic preparation',['blood film','stained blood smear']],
];
const id = (name: string) => `cv-blood-${name}`;
export const bloodStructures: Structure[] = rows.map(([name, canonicalName, category, acceptedAliases]) => ({
  id: id(name), canonicalName, category, acceptedAliases, moduleId,
  sourceId: BLOOD_SOURCE_ID, sourcePage: null, examPriority: true, verificationStatus: 'verified',
}));

const lesson = (
  name: string, title: string, summary: string, terms: string[],
  recognitionCues: string[], landmarks: string[], relationships: string[], commonConfusions: string[],
): Lesson => ({
  id: `cv-blood-${name}`, title, summary, structureIds: terms.map(id),
  recognitionCues, landmarks, relationships, commonConfusions, sourceIds: [BLOOD_SOURCE_ID],
});
export const bloodLessons: Lesson[] = [
  lesson('tissue','Blood as a connective tissue',
    'Separate the liquid matrix from circulating cells and cell fragments before studying a smear.',
    ['plasma','serum','formed-elements','buffy-coat','erythrocyte','leukocyte','platelet'],
    ['Blood has a liquid extracellular matrix (plasma) and formed elements: erythrocytes, leukocytes, and platelets.',
      'Centrifuged anticoagulated blood separates into plasma above, a thin leukocyte/platelet buffy coat, and packed erythrocytes below.'],
    ['Serum is the liquid left after blood has clotted; unlike plasma, it lacks the clotting factors consumed or removed during clotting.'],
    ['The buffy coat concentrates white cells and platelets, not just erythrocytes. A peripheral smear spreads the formed elements on a slide rather than showing a plasma layer.'],
    ['Platelets are fragments, not full leukocytes.', 'Plasma is not the same specimen as serum, and a smear is not a centrifuged blood tube.']),
  lesson('red-cells-platelets','Red cells and platelets',
    'Use relative size, a nucleus, and central pallor to separate the common formed elements in a stained smear.',
    ['erythrocyte','central-pallor','platelet','megakaryocyte','peripheral-blood-smear'],
    ['Mature erythrocytes are numerous, anucleate biconcave discs; their thin centers often appear paler than their edges.',
      'Platelets are tiny anucleate cytoplasmic fragments, much smaller than erythrocytes, and may appear as purple specks or small clusters.'],
    ['Megakaryocytes are large cells in red bone marrow that shed platelets; they are not normal circulating smear cells.'],
    ['Biconcavity increases erythrocyte surface area for gas exchange; platelets provide a first structural plug at a damaged vessel.'],
    ['A pale erythrocyte center is not a nucleus.', 'A platelet is not a miniature erythrocyte or a whole megakaryocyte.']),
  lesson('white-cells','Five leukocytes at a glance',
    'Identify the five main leukocytes by nuclear shape and staining, with approximate normal abundance as context.',
    ['leukocyte','granulocyte','agranulocyte','neutrophil','lymphocyte','monocyte','eosinophil','basophil'],
    ['Granulocytes: neutrophils have fine pale granules and a segmented nucleus (usually 2–5 lobes); eosinophils have coarse red-orange granules and usually a two-lobed nucleus; basophils have dark blue-purple granules often obscuring the nucleus.',
      'Agranulocytes: a small lymphocyte has a large round nucleus and thin cytoplasmic rim; a monocyte is larger with an indented or kidney-shaped nucleus and more cytoplasm.'],
    ['In a typical adult differential, neutrophils are most frequent (about 50–70%), lymphocytes next (about 20–30%); monocytes (about 2–8%) and eosinophils (about 2–4%) are less frequent, and basophils are rarest (under 1%). Ranges overlap and vary.'],
    ['“Agranular” means no prominent stain-visible granules, not no granules at all; all five types are leukocytes, unlike anucleate red cells and platelet fragments.'],
    ['Eosinophil granules stain red-orange, not the deep purple of basophils.', 'A segmented neutrophil is not a round-nucleated lymphocyte.']),
  lesson('marrow','Where formed elements originate',
    'Connect adult red bone marrow to blood-cell lineages without memorizing detailed maturation stages.',
    ['red-bone-marrow','hematopoiesis','hematopoietic-stem-cell','megakaryocyte','erythrocyte','platelet','leukocyte'],
    ['Hematopoiesis takes place mainly in red bone marrow after birth; marrow stem cells ultimately yield red cells, white cells, and platelet-producing megakaryocytes.',
      'Adult red marrow is concentrated in axial bones and proximal ends of the humerus and femur.'],
    ['A marrow sample can show large nucleated megakaryocytes; a peripheral blood smear shows their much smaller released platelet fragments.'],
    ['Blood is a connective tissue continually renewed from marrow; erythrocytes lose their nuclei as they mature, while leukocytes retain nuclei.'],
    ['Yellow marrow is not the main routine blood-producing tissue.', 'Circulating platelets are made by megakaryocytes, not by erythrocytes.']),
  lesson('smear','Read a peripheral blood smear',
    'Apply a fixed visual checklist to a stained smear without assuming the description is an actual image.',
    ['peripheral-blood-smear','erythrocyte','central-pallor','platelet','neutrophil','lymphocyte','monocyte','eosinophil','basophil'],
    ['First distinguish many pale-centered anucleate red discs from tiny platelet fragments and the fewer nucleated white cells.',
      'For a white cell, compare nuclear form (segmented, round, indented, or bilobed), cytoplasm, and granule color before naming it.'],
    ['Segmented pale-granule cell → neutrophil; round nucleus with thin rim → small lymphocyte; larger indented nucleus → monocyte; orange-red coarse granules → eosinophil; dense dark purple granules → basophil.'],
    ['Smear identification is based on morphology; abundance helps prioritize a likely answer but does not replace nucleus and granule cues.'],
    ['Descriptions here are text-only recognition practice, not labeled micrographs.', 'Do not identify every purple speck as a basophil: platelets are tiny and lack a nucleus.']),
];

const choice = (name: string, terms: string[], prompt: string, answer: string, options: string[], explanation: string): Question => ({
  id: `q-bac03-${name}`, moduleId, structureIds: terms.map(id), taskType: 'multiple-choice',
  prompt, answer, acceptedAliases: [], options, explanation, sourceId: BLOOD_SOURCE_ID,
  sourcePage: null, examPriority: true, verificationStatus: 'verified',
});
const select = (name: string, terms: string[], prompt: string, answer: string[], options: string[], explanation: string): Question => ({
  ...choice(name, terms, prompt, answer[0], options, explanation), taskType: 'select-all', answer,
});
const recall = (name: string, terms: string[], prompt: string, answer: string, acceptedAliases: string[], explanation: string): Question => ({
  ...choice(name, terms, prompt, answer, [], explanation), taskType: 'typed-recall', acceptedAliases, options: undefined,
});
export const bloodQuestions: Question[] = [
  choice('matrix',['plasma','formed-elements'],'Which part of blood is its liquid extracellular matrix?','Plasma',['Plasma','Erythrocytes','Platelets','Buffy coat'],'Plasma is the liquid matrix; formed elements are cells or cell fragments suspended in it.'),
  select('formed',['formed-elements','erythrocyte','platelet','leukocyte'],'Select all formed-element categories in circulating blood.',['Erythrocytes','Leukocytes','Platelets'],['Plasma','Erythrocytes','Leukocytes','Platelets','Serum'],'Red cells, white cells, and platelets are formed elements; plasma and serum are liquids.'),
  choice('buffy',['buffy-coat','erythrocyte','leukocyte','platelet'],'Which formed elements chiefly make up the thin buffy coat above packed red cells in a centrifuged anticoagulated tube?','Leukocytes and platelets',['Leukocytes and platelets','Only erythrocytes','Only plasma proteins','Only serum'],'White cells and platelets concentrate between plasma and packed red cells.'),
  choice('serum',['serum','plasma'],'A sample is allowed to clot before the liquid is separated. What is the resulting liquid called?','Serum',['Serum','Anticoagulated plasma','Buffy coat','Hematocrit'],'Serum is the liquid remaining after clot formation, unlike plasma separated from anticoagulated blood.'),
  choice('red-shape',['erythrocyte','central-pallor'],'Many anucleate discs with pale centers dominate a stained smear. Which formed element is this?','Erythrocyte',['Erythrocyte','Neutrophil','Monocyte','Platelet'],'Mature red cells are anucleate biconcave discs whose thin centers create central pallor.'),
  choice('pallor',['erythrocyte','central-pallor'],'What explains the pale center of an otherwise intact mature erythrocyte in a stained smear?','Its biconcave shape makes the center thinner',['Its biconcave shape makes the center thinner','A faintly stained nucleus','A cluster of platelet granules','A central pocket of plasma'],'A normal erythrocyte has no nucleus; its biconcave center is thinner.'),
  choice('platelet-smear',['platelet','erythrocyte','peripheral-blood-smear'],'In a stained smear, which finding is most consistent with platelets rather than red cells?','Very small anucleate purple fragments, sometimes clustered',['Very small anucleate purple fragments, sometimes clustered','Numerous pale-centered discs','Large cells with indented nuclei','Two-lobed cells with orange granules'],'Platelets are tiny cytoplasmic fragments, not whole red or white blood cells.'),
  choice('platelet-origin',['megakaryocyte','platelet','red-bone-marrow'],'A platelet in peripheral blood is a fragment released from which marrow cell?','Megakaryocyte',['Megakaryocyte','Erythrocyte','Lymphocyte','Neutrophil'],'Megakaryocytes in red marrow shed cytoplasmic fragments that enter blood as platelets.'),
  choice('granular',['granulocyte','neutrophil','eosinophil','basophil'],'Which group contains all three granular leukocytes?','Neutrophils, eosinophils, basophils',['Neutrophils, eosinophils, basophils','Lymphocytes, monocytes, erythrocytes','Neutrophils, platelets, erythrocytes','Monocytes, lymphocytes, basophils'],'Neutrophils, eosinophils, and basophils are granulocytes.'),
  select('agranular',['agranulocyte','lymphocyte','monocyte'],'Which leukocytes are classified as agranulocytes?',['Lymphocytes','Monocytes'],['Lymphocytes','Monocytes','Neutrophils','Basophils','Eosinophils'],'Lymphocytes and monocytes lack the prominent stained granules of granulocytes.'),
  choice('smear-neutrophil',['neutrophil','peripheral-blood-smear'],'A nucleated smear cell has 3 connected nuclear lobes and fine pale granules. Identify it.','Neutrophil',['Neutrophil','Lymphocyte','Monocyte','Basophil'],'A segmented nucleus with fine pale granules is typical of a neutrophil.'),
  choice('smear-eosinophil',['eosinophil','peripheral-blood-smear'],'A smear cell has a usually bilobed nucleus and conspicuous coarse orange-red granules. Identify it.','Eosinophil',['Eosinophil','Basophil','Monocyte','Platelet'],'Eosinophil granules stain orange-red; a basophil has dark blue-purple granules.'),
  choice('smear-basophil',['basophil','peripheral-blood-smear'],'A rare nucleated smear cell has dense deep blue-purple granules that partly hide its nucleus. Identify it.','Basophil',['Basophil','Neutrophil','Erythrocyte','Lymphocyte'],'Basophil granules are dark and may obscure its bilobed nucleus.'),
  choice('smear-lymphocyte',['lymphocyte','peripheral-blood-smear'],'A small smear cell shows a large round nucleus surrounded by only a narrow rim of cytoplasm. Identify it.','Lymphocyte',['Lymphocyte','Monocyte','Eosinophil','Neutrophil'],'Small lymphocytes have a high nucleus-to-cytoplasm ratio and a round nucleus.'),
  choice('smear-monocyte',['monocyte','peripheral-blood-smear'],'A large smear leukocyte has abundant cytoplasm and a deeply indented or kidney-shaped nucleus. Identify it.','Monocyte',['Monocyte','Lymphocyte','Neutrophil','Platelet'],'Monocytes are large agranulocytes with indented nuclei and more cytoplasm than small lymphocytes.'),
  choice('most-common',['neutrophil','lymphocyte','basophil'],'In a typical adult white-cell differential, which type is normally most common?','Neutrophil',['Neutrophil','Basophil','Monocyte','Eosinophil'],'Neutrophils are generally the most abundant circulating leukocytes (about 50–70%).'),
  choice('second-common',['lymphocyte','neutrophil'],'Which type is generally the second most abundant circulating leukocyte?','Lymphocyte',['Lymphocyte','Basophil','Monocyte','Eosinophil'],'Lymphocytes are usually second to neutrophils (about 20–30%).'),
  choice('rarest',['basophil','eosinophil'],'Which leukocyte normally makes up less than 1% of the differential?','Basophil',['Basophil','Neutrophil','Lymphocyte','Monocyte'],'Basophils are normally the rarest of the five major leukocyte types.'),
  choice('marrow-location',['red-bone-marrow','hematopoiesis'],'Where does most blood-cell production occur after birth?','Red bone marrow',['Red bone marrow','Yellow marrow alone','Peripheral blood plasma','Heart endocardium'],'Red marrow is the principal site of hematopoiesis after birth.'),
  choice('marrow-vs-smear',['megakaryocyte','platelet','peripheral-blood-smear'],'Which would be expected in normal marrow, but not as a whole cell in a normal peripheral smear?','Megakaryocyte',['Megakaryocyte','Erythrocyte','Neutrophil','Lymphocyte'],'Megakaryocytes remain in marrow and release platelet fragments into circulation.'),
  choice('stem-lineage',['hematopoietic-stem-cell','formed-elements'],'Which precursor ultimately gives rise to the major formed-element lineages?','Hematopoietic stem cell',['Hematopoietic stem cell','Mature erythrocyte','Circulating platelet','Plasma protein'],'Multipotent marrow stem cells generate red-cell, white-cell, and megakaryocyte lineages.'),
  recall('red-cell-name',['erythrocyte','peripheral-blood-smear'],'Name the numerous anucleate, biconcave formed element in a typical blood smear.','Erythrocyte',['red blood cell','RBC'],'Mature erythrocytes lack nuclei and show a pale center in a stained smear.'),
  recall('marrow-process',['hematopoiesis','red-bone-marrow'],'Name the process of forming the cellular elements of blood in red marrow.','Hematopoiesis',['hemopoiesis'],'Hematopoiesis is the production of formed elements, primarily in red marrow after birth.'),
];