import type { Module, Question, SourceRecord } from './model';

// Original text only. OpenStax A&P (2013) §§4.6, 5.3, 6.6, 7.3, 9.4:
// https://openstax.org/books/anatomy-and-physiology/pages/4-6-tissue-injury-and-aging
// https://openstax.org/books/anatomy-and-physiology/pages/5-3-functions-of-the-integumentary-system
// https://openstax.org/books/anatomy-and-physiology/pages/6-6-exercise-nutrition-hormones-and-bone-tissue
// https://openstax.org/books/anatomy-and-physiology/pages/7-3-the-vertebral-column
// https://openstax.org/books/anatomy-and-physiology/pages/9-4-synovial-joints
const openstaxBoneId = 'source-openstax-ap-2013-bone-change-ch6';
const federal = (id: string, title: string, sourceUrl: string): SourceRecord => ({
  id, title, sourceUrl, filename: title, hash: id, pageCount: null,
  courseLabAssociation: null, sourceType: 'text', verificationStatus: 'verified',
  attributionLicenseStatus: 'U.S. federal health reference; original paraphrase only; no figures reused',
  notes: 'Structural comparison only; not a source of diagnosis or treatment instructions.',
});
export const structuralContextSources: SourceRecord[] = [
  {
    id: openstaxBoneId, title: 'OpenStax 2013 · Bone tissue change',
    filename: 'OpenStax Anatomy and Physiology (2013), §6.6', hash: openstaxBoneId,
    pageCount: null, courseLabAssociation: null, sourceType: 'text',
    sourceUrl: 'https://openstax.org/books/anatomy-and-physiology/pages/6-6-exercise-nutrition-hormones-and-bone-tissue',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    attributionLicenseStatus: 'CC BY 4.0; attribution to OpenStax and contributors required',
    notes: 'Original structural summary; no figures reused.', verificationStatus: 'verified',
  },
  federal('source-nhlbi-atherosclerosis', 'NHLBI · Atherosclerosis', 'https://www.nhlbi.nih.gov/health/atherosclerosis'),
  federal('source-nhlbi-copd', 'NHLBI · COPD and emphysema', 'https://www.nhlbi.nih.gov/health/copd'),
  federal('source-niddk-cirrhosis', 'NIDDK · Cirrhosis', 'https://www.niddk.nih.gov/health-information/liver-disease/cirrhosis/definition-facts'),
  federal('source-niddk-enlarged-prostate', 'NIDDK · Enlarged prostate', 'https://www.niddk.nih.gov/health-information/urologic-diseases/prostate-problems/enlarged-prostate-benign-prostatic-hyperplasia'),
  federal('source-nichd-uterine-fibroids', 'NICHD · Uterine fibroids', 'https://www.nichd.nih.gov/health/topics/uterine/conditioninfo'),
];

type Context = {
  moduleId: string; lessonId: string; sourceId: string; structureIds: string[];
  note: string; key: string; prompt: string; answer: string; options: string[]; explanation: string;
};
const examples: Context[] = [
  {
    moduleId: 'integumentary-system', lessonId: 'dermis-hypodermis', sourceId: 'source-openstax-ap-2013-integument',
    structureIds: ['elastic-fibers-skin','hypodermis-skin'], key: 'skin-aging',
    note: 'With aging, dermal elasticity decreases and the hypodermal fat layer can thin or redistribute; compare these layers with intact young skin.',
    prompt: 'In an age-related comparison, loss of skin elasticity points chiefly to changes in which layer?',
    answer: 'Dermis', options: ['Dermis','Stratum corneum only','Nail plate','Hair shaft'],
    explanation: 'Elastic fibers are part of the dermis; the underlying hypodermis can also change with age.',
  },
  {
    moduleId: 'skeletal-system', lessonId: 'vertebral-column', sourceId: openstaxBoneId,
    structureIds: ['lumbar-vertebrae'], key: 'bone-loss',
    note: 'Osteoporotic bone has lost internal mass and trabecular support; a vertebral body can compress instead of retaining its usual height.',
    prompt: 'A vertebral body loses internal bone mass and becomes compressed. Which normal structural feature has changed?',
    answer: 'The supporting trabecular bone of the vertebral body',
    options: ['The supporting trabecular bone of the vertebral body','The spinal cord central canal','The intervertebral foramen alone','The atlas dens'],
    explanation: 'Reduced internal bone support can allow a vertebral body to lose height; this is a structural comparison, not a diagnosis from an image.',
  },
  {
    moduleId: 'joints-ligaments', lessonId: 'synovial-features', sourceId: 'source-openstax-ap-2013-joints-ch9',
    structureIds: ['articular-cartilage'], key: 'joint-cartilage',
    note: 'In osteoarthritis, articular cartilage at a synovial joint thins or wears away, changing the normally smooth bone-to-bone interface.',
    prompt: 'At a synovial joint, what normally smooth tissue is thinned in osteoarthritis?',
    answer: 'Articular cartilage', options: ['Articular cartilage','Synovial fluid','Skeletal muscle belly','Periosteum of the shaft'],
    explanation: 'Articular cartilage covers opposing bone ends and can become thinner in a degenerative joint.',
  },
  {
    moduleId: 'muscular-system', lessonId: 'muscle-actions', sourceId: 'source-openstax-ap-2013-cells-tissues',
    structureIds: ['rectus-femoris'], key: 'muscle-atrophy',
    note: 'Atrophy reduces the cross-sectional bulk of skeletal muscle; do not confuse the smaller muscle with a change in its origin or insertion.',
    prompt: 'Compared with a normal skeletal muscle, what structural change describes atrophy?',
    answer: 'Reduced muscle bulk', options: ['Reduced muscle bulk','An extra bony attachment','A widened joint cavity','Replacement by articular cartilage'],
    explanation: 'Atrophy is loss of tissue mass; the lesson’s attachment and action map remains the same.',
  },
  {
    moduleId: 'nervous-system', lessonId: 'spinal-cord', sourceId: 'source-openstax-ap-2013-skeletal-ch7',
    structureIds: ['dorsal-root','ventral-root'], key: 'disc-and-nerve',
    note: 'A posteriorly herniated intervertebral disc can bulge toward an exiting spinal nerve; the disc is outside the cord, not a lesion of the central canal.',
    prompt: 'A posterior disc protrusion near an intervertebral foramen may encroach on which structure leaving the spine?',
    answer: 'An exiting spinal nerve', options: ['An exiting spinal nerve','A vertebral body','The brain ventricle','A cranial suture'],
    explanation: 'An exiting spinal nerve passes close to the disc at the intervertebral foramen.',
  },
  {
    moduleId: 'blood-vessels', lessonId: 'ves-wall', sourceId: 'source-nhlbi-atherosclerosis',
    structureIds: ['ves-intima','ves-endothelium'], key: 'arterial-plaque',
    note: 'An atherosclerotic plaque builds within an arterial wall and narrows the normally open lumen; it is not a normal capillary wall layer.',
    prompt: 'An arterial cross-section shows a wall plaque protruding into its normally open channel. What space is narrowed?',
    answer: 'The arterial lumen', options: ['The arterial lumen','A lymph-node follicle','The venous valve leaflet','The endocardial cavity'],
    explanation: 'Plaque within an artery reduces the available lumen compared with a normal vessel section.',
  },
  {
    moduleId: 'respiratory-system', lessonId: 'respiratory-exchange', sourceId: 'source-nhlbi-copd',
    structureIds: ['respiratory-system-alveolar-septum','respiratory-system-alveolus'], key: 'alveolar-walls',
    note: 'In emphysema, walls between alveoli are damaged, leaving fewer intact septa than in normal small air spaces.',
    prompt: 'Compared with normal alveoli, which boundary is lost or damaged in emphysema?',
    answer: 'Alveolar septa', options: ['Alveolar septa','Tracheal cartilage rings','Vocal folds','Pleural cavity'],
    explanation: 'Septa are the walls separating adjacent alveoli; emphysema damages these walls.',
  },
  {
    moduleId: 'digestive-system', lessonId: 'digestive-accessory', sourceId: 'source-niddk-cirrhosis',
    structureIds: ['digestive-system-liver-lobule','digestive-system-hepatic-sinusoid'], key: 'liver-scarring',
    note: 'In cirrhosis, scar tissue replaces healthy liver tissue and disrupts the usual lobular arrangement and blood passages.',
    prompt: 'What interrupts the usual liver-tissue architecture in cirrhosis?',
    answer: 'Scar tissue', options: ['Scar tissue','Extra intestinal villi','New pancreatic islets','Thickened gallbladder mucosa alone'],
    explanation: 'Fibrous scar replaces normal liver tissue; this is a tissue-pattern comparison, not a clinical assessment.',
  },
  {
    moduleId: 'urinary-system', lessonId: 'urinary-tract', sourceId: 'source-niddk-enlarged-prostate',
    structureIds: ['urinary-system-urethra','urinary-system-urinary-bladder'], key: 'prostatic-urethra',
    note: 'The prostatic segment of the male urethra runs through the gland below the bladder; enlargement can narrow that passage.',
    prompt: 'Which urinary passage runs through the prostate and can be narrowed when the gland enlarges?',
    answer: 'Urethra', options: ['Urethra','Ureter','Renal pelvis','Collecting duct'],
    explanation: 'The prostatic urethra passes through the gland immediately below the urinary bladder.',
  },
  {
    moduleId: 'male-reproductive', lessonId: 'male-glands', sourceId: 'source-niddk-enlarged-prostate',
    structureIds: ['male-reproductive-prostate-gland'], key: 'enlarged-prostate',
    note: 'Benign prostate enlargement changes the size of the gland surrounding the prostatic urethra; keep gland and urethral lumen distinct.',
    prompt: 'An enlarged gland immediately below the male bladder surrounds which urinary passage?',
    answer: 'Prostatic urethra', options: ['Prostatic urethra','Ureter','Epididymis','Vas deferens'],
    explanation: 'The prostate encircles the prostatic urethra; the passage may be narrowed as the gland enlarges.',
  },
  {
    moduleId: 'female-reproductive', lessonId: 'female-wall', sourceId: 'source-nichd-uterine-fibroids',
    structureIds: ['female-reproductive-myometrium'], key: 'uterine-fibroid',
    note: 'A uterine fibroid is a localized growth of smooth-muscle-rich tissue in or on the uterine wall; distinguish it from the normal endometrial lining.',
    prompt: 'A smooth-muscle-rich fibroid grows in the uterine wall. Which normal layer contains uterine smooth muscle?',
    answer: 'Myometrium', options: ['Myometrium','Endometrium','Perimetrium','Ovarian cortex'],
    explanation: 'The myometrium is the uterine muscular wall; the endometrium is its lining.',
  },
];

const question = (id: string, moduleId: string, structureIds: string[], sourceId: string, prompt: string, answer: string, options: string[], explanation: string): Question => ({
  id: `q-bac04-${id}`, moduleId, structureIds, sourceId, sourcePage: null,
  taskType: 'multiple-choice', prompt, answer, options, explanation,
  acceptedAliases: [], examPriority: true, verificationStatus: 'verified',
});

export const structuralContextQuestions: Question[] = examples.map((item) =>
  question(item.key, item.moduleId, item.structureIds, item.sourceId, item.prompt, item.answer, item.options, item.explanation));

// Four existing cards had no related question; seven more had only one.
export const coverageQuestions: Question[] = [
  question('exocrine-duct','cells-tissues',['exocrine-gland-tissue','duct-gland-tissue'],'source-openstax-ap-2013-cells-tissues',
    'Which gland type releases its product onto a surface through a duct?',
    'Exocrine gland',['Exocrine gland','Endocrine gland','Thyroid follicle','Islet endocrine cell'],
    'Exocrine glands use ducts; endocrine glands release products to the surrounding fluid and blood.'),
  question('nucleolus','cytology-mitosis',['nucleolus','nucleus'],'source-user-transcribed-lab2',
    'Which small nuclear structure is associated with ribosomal-subunit assembly?',
    'Nucleolus',['Nucleolus','Plasma membrane','Centriole','Smooth ER'],
    'The nucleolus is a region within the nucleus, not a separate membrane-bound organelle.'),
  question('tear-drainage','special-senses',['lacrimal-sac-sense','nasolacrimal-duct-sense'],'source-openstax-ap-2013-special-senses',
    'After collecting in the lacrimal sac, tears pass into which duct toward the nasal cavity?',
    'Nasolacrimal duct',['Nasolacrimal duct','Auditory tube','Optic canal','Ciliary body'],
    'The nasolacrimal duct is downstream of the lacrimal sac.'),
  question('renal-artery','blood-vessels',['ves-renal-artery'],'source-openstax-ap-2013-vessels-ch20',
    'Which named arterial branch carries blood toward a kidney?',
    'Renal artery',['Renal artery','Brachiocephalic vein','Subclavian vein','Celiac trunk'],
    'The renal arteries branch toward the kidneys; the celiac trunk supplies abdominal digestive organs.'),
  question('endocrine-ductless','cells-tissues',['endocrine-gland-tissue','duct-gland-tissue'],'source-openstax-ap-2013-cells-tissues',
    'A gland releases its product near capillaries without an outlet duct. Which gland type fits?',
    'Endocrine gland',['Endocrine gland','Exocrine gland','Sebaceous duct','Sweat duct'],
    'Endocrine secretory cells are ductless; exocrine secretions pass along a duct to a surface.'),
  question('neuroglia','cells-tissues',['neuroglia-tissue','neuron-tissue'],'source-openstax-ap-2013-cells-tissues',
    'In a nervous-tissue section, which cells support neurons rather than forming the large conducting soma?',
    'Neuroglia',['Neuroglia','Neurons','Erythrocytes','Osteocytes'],
    'Glial cells surround and support neurons; a neuron typically has a prominent cell body and processes.'),
  question('nuclear-envelope','cytology-mitosis',['nuclear-envelope-cytology','chromatin'],'source-user-transcribed-lab2',
    'Which boundary encloses the chromatin-containing nucleus?',
    'Nuclear envelope',['Nuclear envelope','Plasma membrane','Cell wall','Golgi stack'],
    'The nuclear envelope borders the nucleus; the plasma membrane borders the whole cell.'),
  question('s-phase','cytology-mitosis',['s-phase','g1','g2'],'source-user-transcribed-lab2',
    'In the G1–S–G2 interphase sequence, which stage replicates DNA?',
    'S phase',['S phase','G1 phase','G2 phase','Cytokinesis'],
    'DNA synthesis takes place during S phase, between G1 and G2.'),
  question('conjunctiva','special-senses',['conjunctiva-sense','eyelid-sense'],'source-openstax-ap-2013-special-senses',
    'Which thin membrane lines the inner eyelid and reflects over the anterior sclera?',
    'Conjunctiva',['Conjunctiva','Cornea','Retina','Lens capsule'],
    'The conjunctiva covers the inner lid and anterior sclera but not the cornea.'),
  question('pancreatic-islets','endocrine-system',['endo-pancreas','endo-endocrine-gland'],'source-openstax-ap-2013-endocrine-ch17',
    'Which part of the pancreas has ductless endocrine tissue rather than an exocrine duct system?',
    'Pancreatic islets',['Pancreatic islets','Pancreatic ducts','Acinar lumens','Common bile duct'],
    'Pancreatic islets are endocrine clusters within an organ that also contains exocrine acini.'),
  question('subclavian-return','blood-vessels',['ves-subclavian-vein','ves-brachiocephalic-vein'],'source-openstax-ap-2013-vessels-ch20',
    'Blood in the subclavian vein next passes into which named great vein after joining the internal jugular vein?',
    'Brachiocephalic vein',['Brachiocephalic vein','Celiac trunk','Renal artery','Pulmonary artery'],
    'The subclavian and internal jugular veins unite to form a brachiocephalic vein.'),
];

export const attachStructuralContext = (modules: Module[]): Module[] => modules.map((module) => {
  const additions = examples.filter((item) => item.moduleId === module.id);
  if (!additions.length) return module;
  return {
    ...module,
    sourceIds: [...new Set([...module.sourceIds, ...additions.map((item) => item.sourceId)])],
    lessons: module.lessons?.map((lesson) => {
      const forLesson = additions.filter((item) => item.lessonId === lesson.id);
      if (!forLesson.length) return lesson;
      return {
        ...lesson,
        relationships: [...lesson.relationships, ...forLesson.map((item) => item.note)],
        sourceIds: [...new Set([...lesson.sourceIds, ...forLesson.map((item) => item.sourceId)])],
      };
    }),
  };
});