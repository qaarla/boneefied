import type { Asset, Lesson, Module, Question, SourceRecord, Structure } from './model';

export const OPENSTAX_SOURCE_ID = 'source-openstax-ap-2013';
export const GRAY_SOURCE_ID = 'source-gray-1918-commons';

export const anatomySources: SourceRecord[] = [
  {
    id: OPENSTAX_SOURCE_ID,
    filename: 'OpenStax Anatomy and Physiology (2013)',
    hash: 'openstax-ap-2013-cc-by-4',
    pageCount: null,
    title: 'OpenStax Anatomy and Physiology (2013)',
    courseLabAssociation: null,
    sourceType: 'text',
    attributionLicenseStatus: 'CC BY 4.0; attribution to OpenStax and contributors required',
    notes: 'Original 2013 edition used for original study summaries and terminology. Not the noncommercial 2e edition.',
    sourceUrl: 'https://openstax.org/books/anatomy-and-physiology/pages/preface',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    verificationStatus: 'verified',
  },
  {
    id: GRAY_SOURCE_ID,
    filename: "Gray's Anatomy 1918 plates via Wikimedia Commons",
    hash: 'gray-1918-commons-public-domain',
    pageCount: null,
    title: "Gray's Anatomy of the Human Body (1918) plates",
    courseLabAssociation: null,
    sourceType: 'image',
    attributionLicenseStatus: 'Public domain; credit Henry Vandyke Carter and Henry Gray.',
    notes: 'Only individually checked public-domain plates are activated. No labels or hotspots are inferred beyond the original plates.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/Category:Gray%27s_Anatomy_plates',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    verificationStatus: 'verified',
  },
];

const skeletonModuleId = 'skeletal-system';
const foundationsModuleId = 'anatomy-foundations';
const structureRows: Array<[string, string, string, string[]]> = [
  ['skull','Skull','axial skeleton', ['cranium']], ['frontal-bone','Frontal bone','skull',[]], ['parietal-bone','Parietal bone','skull',[]],
  ['temporal-bone','Temporal bone','skull',[]], ['occipital-bone','Occipital bone','skull',[]], ['sphenoid-bone','Sphenoid bone','skull',[]],
  ['ethmoid-bone','Ethmoid bone','skull',[]], ['maxilla','Maxilla','skull',[]], ['mandible','Mandible','skull',['lower jaw']],
  ['zygomatic-bone','Zygomatic bone','skull',['cheekbone']], ['nasal-bone','Nasal bone','skull',[]], ['lacrimal-bone','Lacrimal bone','skull',[]],
  ['palatine-bone','Palatine bone','skull',[]], ['vomer','Vomer','skull',[]], ['inferior-nasal-concha','Inferior nasal concha','skull',[]],
  ['coronal-suture','Coronal suture','sutures',[]], ['sagittal-suture','Sagittal suture','sutures',[]], ['lambdoid-suture','Lambdoid suture','sutures',[]],
  ['foramen-magnum','Foramen magnum','skull foramina',[]], ['optic-canal','Optic canal','skull foramina',[]], ['jugular-foramen','Jugular foramen','skull foramina',[]],
  ['hyoid','Hyoid bone','axial skeleton',['hyoid']], ['atlas-c1','Atlas (C1)','vertebral column',['first cervical vertebra']], ['axis-c2','Axis (C2)','vertebral column',['second cervical vertebra']],
  ['cervical-vertebrae','Cervical vertebrae','vertebral column',['neck vertebrae']], ['thoracic-vertebrae','Thoracic vertebrae','vertebral column',['chest vertebrae']],
  ['lumbar-vertebrae','Lumbar vertebrae','vertebral column',['lower-back vertebrae']], ['sacrum','Sacrum','vertebral column',[]], ['coccyx','Coccyx','vertebral column',['tailbone']],
  ['vertebral-foramen','Vertebral foramen','vertebral landmarks',[]], ['spinous-process','Spinous process','vertebral landmarks',[]], ['transverse-process','Transverse process','vertebral landmarks',[]],
  ['intervertebral-disc','Intervertebral disc','vertebral relationships',[]], ['sternum','Sternum','thoracic cage',['breastbone']], ['manubrium','Manubrium','thoracic cage',[]],
  ['body-of-sternum','Body of sternum','thoracic cage',[]], ['xiphoid-process','Xiphoid process','thoracic cage',[]], ['true-ribs','True ribs','thoracic cage',[]],
  ['false-ribs','False ribs','thoracic cage',[]], ['floating-ribs','Floating ribs','thoracic cage',[]], ['clavicle','Clavicle','pectoral girdle',['collarbone']],
  ['scapula','Scapula','pectoral girdle',['shoulder blade']], ['humerus','Humerus','upper limb',[]], ['radius','Radius','forearm',['thumb-side forearm bone']],
  ['ulna','Ulna','forearm',['pinky-side forearm bone']], ['carpals','Carpals','hand',[]], ['metacarpals','Metacarpals','hand',[]], ['phalanges-hand','Phalanges of hand','hand',['finger bones']],
  ['pelvis','Pelvic girdle','pelvic girdle',[]], ['ilium','Ilium','pelvic girdle',[]], ['ischium','Ischium','pelvic girdle',[]], ['pubis','Pubis','pelvic girdle',[]],
  ['femur','Femur','lower limb',['thigh bone']], ['patella','Patella','lower limb',['kneecap']], ['tibia','Tibia','lower limb',['shin bone']],
  ['fibula','Fibula','lower limb',['lateral leg bone']], ['tarsals','Tarsals','foot',[]], ['talus','Talus','foot',[]], ['calcaneus','Calcaneus','foot',['heel bone']],
  ['metatarsals','Metatarsals','foot',[]], ['phalanges-foot','Phalanges of foot','foot',['toe bones']], ['acetabulum','Acetabulum','articulations',['hip socket']],
  ['glenoid-cavity','Glenoid cavity','articulations',['shoulder socket']], ['sacroiliac-joint','Sacroiliac joint','articulations',[]],
];

export const skeletalStructures: Structure[] = structureRows.map(([id, canonicalName, category, acceptedAliases]) => ({
  id, canonicalName, category, acceptedAliases, moduleId: skeletonModuleId, sourceId: OPENSTAX_SOURCE_ID,
  sourcePage: null, examPriority: false, verificationStatus: 'verified',
}));

const landmarkRows: Array<[string, string, string, string[]]> = [
  ['external-acoustic-meatus','External acoustic meatus','skull landmarks',['external auditory meatus']], ['internal-acoustic-meatus','Internal acoustic meatus','skull landmarks',['internal auditory meatus']],
  ['mastoid-process','Mastoid process','temporal bone landmarks',[]], ['styloid-process','Styloid process','temporal bone landmarks',[]],
  ['mandibular-condyle','Mandibular condyle','mandible landmarks',['condylar process']], ['mandibular-coronoid','Coronoid process of mandible','mandible landmarks',['coronoid process']],
  ['mental-foramen','Mental foramen','mandible landmarks',[]], ['supraorbital-foramen','Supraorbital foramen','skull foramina',['supraorbital notch']],
  ['zygomatic-arch','Zygomatic arch','skull landmarks',[]], ['sella-turcica','Sella turcica','skull landmarks',['hypophyseal fossa']],
  ['occipital-condyles','Occipital condyles','skull landmarks',[]], ['dens','Dens of axis','vertebral landmarks',['odontoid process']],
  ['vertebral-body','Vertebral body','vertebral landmarks',['centrum']], ['superior-articular-facet','Superior articular facet','vertebral landmarks',[]],
  ['inferior-articular-facet','Inferior articular facet','vertebral landmarks',[]], ['transverse-foramen','Transverse foramen','vertebral landmarks',[]],
  ['rib-head','Head of rib','rib landmarks',[]], ['rib-tubercle','Tubercle of rib','rib landmarks',[]], ['costal-groove','Costal groove','rib landmarks',[]],
  ['scapular-spine','Spine of scapula','scapular landmarks',[]], ['acromion','Acromion','scapular landmarks',[]], ['coracoid-process','Coracoid process','scapular landmarks',[]],
  ['humeral-head','Head of humerus','humerus landmarks',[]], ['greater-tubercle','Greater tubercle of humerus','humerus landmarks',[]],
  ['deltoid-tuberosity','Deltoid tuberosity','humerus landmarks',[]], ['medial-epicondyle','Medial epicondyle of humerus','humerus landmarks',[]],
  ['lateral-epicondyle','Lateral epicondyle of humerus','humerus landmarks',[]], ['capitulum','Capitulum of humerus','humerus landmarks',[]],
  ['trochlea','Trochlea of humerus','humerus landmarks',[]], ['radial-head','Head of radius','radius landmarks',[]], ['radial-styloid','Radial styloid process','radius landmarks',[]],
  ['olecranon','Olecranon','ulna landmarks',[]], ['trochlear-notch','Trochlear notch','ulna landmarks',[]], ['iliac-crest','Iliac crest','pelvic landmarks',[]],
  ['asis','Anterior superior iliac spine','pelvic landmarks',['ASIS']], ['ischial-tuberosity','Ischial tuberosity','pelvic landmarks',['sit bone']],
  ['obturator-foramen','Obturator foramen','pelvic landmarks',[]], ['femoral-head','Head of femur','femur landmarks',[]], ['femoral-neck','Neck of femur','femur landmarks',[]],
  ['greater-trochanter','Greater trochanter','femur landmarks',[]], ['femoral-condyles','Condyles of femur','femur landmarks',[]],
  ['tibial-tuberosity','Tibial tuberosity','tibia landmarks',[]], ['medial-malleolus','Medial malleolus','tibia landmarks',[]], ['lateral-malleolus','Lateral malleolus','fibula landmarks',[]],
];
export const skeletalLandmarkStructures: Structure[] = landmarkRows.map(([id, canonicalName, category, acceptedAliases]) => ({
  id, canonicalName, category, acceptedAliases, moduleId: skeletonModuleId, sourceId: OPENSTAX_SOURCE_ID,
  sourcePage: null, examPriority: false, verificationStatus: 'verified',
}));

export const skeletalAssets: Asset[] = [
  ['asset-skull-front','gray190-skull-front.png','Frontal skull plate','https://commons.wikimedia.org/wiki/File:Gray190.png'],
  ['asset-skull-lateral','gray188-skull-lateral.png','Lateral skull plate','https://commons.wikimedia.org/wiki/File:Gray188.png'],
  ['asset-vertebral-column','gray111-vertebral-column.png','Lateral vertebral column plate','https://commons.wikimedia.org/wiki/File:Gray_111_-_Vertebral_column.png'],
  ['asset-cervical-vertebra','gray84-cervical-vertebra.png','Cervical vertebra plate','https://commons.wikimedia.org/wiki/File:Gray84.png'],
].map(([id, filename, title, rightsUrl]) => ({
  id, sourceId: GRAY_SOURCE_ID, sourcePage: null, localAssetPath: `assets/images/anatomy/${filename}`,
  assetType: 'diagram' as const, labelStatus: 'labeled' as const,
  attributionLicense: 'Public domain; Henry Vandyke Carter / Henry Gray, via Wikimedia Commons',
  verificationStatus: 'verified' as const, title, description: title, sourceUrl: rightsUrl, rightsUrl,
}));

export const expandedGrayAssets: Asset[] = [
  ['asset-gray946-sweat-gland','gray946-sweat-gland.png','Sweat-gland histology plate','https://commons.wikimedia.org/wiki/File:Gray946.png'],
  ['asset-gray880-optic-nerve-head','gray880-optic-nerve-head.png','Optic nerve head cross-section','https://commons.wikimedia.org/wiki/File:Gray880.png'],
  ['asset-gray491-heart-posterior','gray491-heart-posterior.png','Posterior heart and coronary veins','https://commons.wikimedia.org/wiki/File:Gray491.png'],
  ['asset-gray1121-posterior-abdominal-wall','gray1121-posterior-abdominal-wall.png','Posterior abdominal wall','https://commons.wikimedia.org/wiki/File:Gray1121.png'],
].map(([id, filename, title, sourceUrl]) => ({
  id, sourceId: GRAY_SOURCE_ID, sourcePage: null, localAssetPath: `assets/images/anatomy/${filename}`,
  assetType: 'diagram' as const, labelStatus: 'labeled' as const,
  attributionLicense: 'Public domain; Henry Vandyke Carter / Henry Gray, via Wikimedia Commons',
  verificationStatus: 'verified' as const, title, description: title, sourceUrl, rightsUrl: sourceUrl,
}));

const lesson = (id: string, title: string, summary: string, structureIds: string[], recognitionCues: string[], landmarks: string[], relationships: string[], commonConfusions: string[], assetIds: string[] = []): Lesson => ({
  id, title, summary, structureIds, recognitionCues, landmarks, relationships, commonConfusions, assetIds, sourceIds: [OPENSTAX_SOURCE_ID, ...(assetIds.length ? [GRAY_SOURCE_ID] : [])],
});

export const skeletalLessons: Lesson[] = [
  lesson('skull-orientation','Skull orientation','The skull protects the brain and frames the openings for the face, airway, and neurovascular structures. Start with broad regions before memorizing smaller bones.', ['skull','frontal-bone','parietal-bone','temporal-bone','occipital-bone','sphenoid-bone','ethmoid-bone','maxilla','mandible','zygomatic-bone','nasal-bone','lacrimal-bone','palatine-bone','vomer','inferior-nasal-concha','coronal-suture','sagittal-suture','lambdoid-suture','foramen-magnum','optic-canal','jugular-foramen','hyoid'], ['Use the paired cranial bones as a left/right map; the mandible is the mobile lower jaw.', 'In a frontal view, the orbits and nasal opening give orientation.'], ['Foramen magnum opens inferiorly in the occipital bone.', 'The zygomatic bone forms the cheek prominence; the maxilla forms much of the upper jaw.'], ['Cranial bones surround the brain; facial bones shape the orbit, nasal cavity, and oral cavity.'], ['Do not confuse the zygomatic bone with the temporal process that joins it.', 'The mandible is a bone, while the temporomandibular joint is an articulation.'], ['asset-skull-front','asset-skull-lateral']),
  lesson('vertebral-column','Vertebral column','The vertebral column is a segmented axial support with regional differences that help you identify cervical, thoracic, and lumbar vertebrae.', ['atlas-c1','axis-c2','cervical-vertebrae','thoracic-vertebrae','lumbar-vertebrae','sacrum','coccyx','vertebral-foramen','spinous-process','transverse-process','intervertebral-disc'], ['Cervical vertebrae are in the neck; thoracic vertebrae articulate with ribs; lumbar vertebrae are the largest mobile vertebrae.', 'The vertebral foramen is the central opening in a typical vertebra.'], ['Spinous and transverse processes project posteriorly and laterally; intervertebral discs sit between vertebral bodies.'], ['The column encloses and protects the spinal cord; the sacrum transfers load to the pelvic girdle.'], ['Atlas is C1 and lacks a typical body; axis is C2 and has the dens.'], ['asset-vertebral-column','asset-cervical-vertebra']),
  lesson('thoracic-cage','Thoracic cage','The sternum and ribs form a flexible protective cage around the heart and lungs.', ['sternum','manubrium','body-of-sternum','xiphoid-process','true-ribs','false-ribs','floating-ribs'], ['The manubrium is superior; the xiphoid process is the small inferior projection.', 'Ribs 1–7 are true ribs because they attach directly to the sternum.'], ['False ribs connect indirectly; floating ribs do not attach anteriorly to the sternum.'], ['Ribs articulate posteriorly with thoracic vertebrae and move with respiration.'], ['The xiphoid process is not a separate bone from the sternum.']),
  lesson('limb-girdles','Girdles and limb orientation','The pectoral and pelvic girdles connect the limbs to the axial skeleton, but they differ in mobility and load-bearing.', ['clavicle','scapula','pelvis','ilium','ischium','pubis','glenoid-cavity','acetabulum','sacroiliac-joint'], ['The glenoid cavity is shallow and lateral; the acetabulum is deep and receives the femoral head.', 'The clavicle is an anterior strut; the scapula lies posteriorly.'], ['Ilium is superior, ischium posteroinferior, and pubis anteroinferior in anatomical position.'], ['The pectoral girdle prioritizes upper-limb mobility; the pelvic girdle transfers lower-limb forces through the sacroiliac joint.'], ['Do not call the entire pelvis the ilium; the ilium is one region of the hip bone.']),
  lesson('limb-bones','Upper and lower limb','Long bones are recognized by their position, articulations, and side-specific relationships.', ['humerus','radius','ulna','carpals','metacarpals','phalanges-hand','femur','patella','tibia','fibula','tarsals','talus','calcaneus','metatarsals','phalanges-foot'], ['Radius is lateral in anatomical position and aligns with the thumb; ulna is medial and aligns with the little finger.', 'Tibia is medial and weight-bearing; fibula is lateral and slender.'], ['The femur articulates proximally with the acetabulum and distally with tibia/patella; talus sits between leg and foot.'], ['Hands and feet use carpals/metacarpals/phalanges and tarsals/metatarsals/phalanges respectively.'], ['Radius and ulna cross when the forearm pronates; anatomical position is the reference for left/right identification.']),
  lesson('skull-landmarks','Skull landmarks and openings','Landmarks turn a flat bone list into an orientation system: processes project, foramina transmit structures, and fossae accommodate neighboring anatomy.', ['external-acoustic-meatus','internal-acoustic-meatus','mastoid-process','styloid-process','mandibular-condyle','mandibular-coronoid','mental-foramen','supraorbital-foramen','zygomatic-arch','sella-turcica','occipital-condyles'], ['The external acoustic meatus opens on the lateral skull; the internal acoustic meatus lies inside the cranial base.', 'The mandibular condyle participates in the temporomandibular joint; the coronoid process anchors muscle.'], ['The mental foramen opens on the anterior mandible; the supraorbital opening is in the frontal bone above the orbit.'], ['The occipital condyles articulate with atlas; the sella turcica houses the pituitary region.'], ['Do not confuse a process (projection) with a foramen (opening).']),
  lesson('vertebral-landmarks','Vertebral and rib landmarks','Regional vertebrae share a plan but their landmarks explain movement, rib articulation, and spinal-cord protection.', ['dens','vertebral-body','superior-articular-facet','inferior-articular-facet','transverse-foramen','rib-head','rib-tubercle','costal-groove'], ['The dens projects superiorly from C2; transverse foramina are distinctive openings in cervical vertebrae.', 'The rib head articulates posteriorly; the tubercle lies farther lateral and articulates with a transverse process.'], ['The costal groove runs along the inferior internal border of a rib and shelters an intercostal neurovascular bundle.'], ['Articular facets guide vertebral motion; bodies and discs transmit load.'], ['The dens belongs to axis, not atlas; the rib tubercle is not the rib head.'], ['asset-vertebral-column','asset-cervical-vertebra']),
  lesson('girdle-limb-landmarks','Girdle and limb landmarks','Processes and articular surfaces identify bones by what they receive, anchor, or connect.', ['scapular-spine','acromion','coracoid-process','humeral-head','greater-tubercle','deltoid-tuberosity','medial-epicondyle','lateral-epicondyle','capitulum','trochlea','radial-head','radial-styloid','olecranon','trochlear-notch','iliac-crest','asis','ischial-tuberosity','obturator-foramen','femoral-head','femoral-neck','greater-trochanter','femoral-condyles','tibial-tuberosity','medial-malleolus','lateral-malleolus'], ['The acromion continues from the scapular spine; the coracoid projects anteriorly.', 'The olecranon is posterior at the elbow; the radial styloid is distal and lateral.'], ['The humeral head enters the glenoid cavity; the femoral head enters the acetabulum.', 'The medial malleolus belongs to tibia; the lateral malleolus belongs to fibula.'], ['Tuberosities and trochanters are attachment sites; condyles and heads are articular regions.'], ['ASIS is anterior and superior; iliac crest is the palpable superior rim.']),
];

export const skeletalModule: Module = {
  id: skeletonModuleId, title: 'Skeletal System', ordering: 2, sourceIds: [OPENSTAX_SOURCE_ID, GRAY_SOURCE_ID],
  visible: true, published: true, contentStatus: 'available', system: 'Skeletal', category: 'Axial and appendicular skeleton',
  summary: 'Learn the bones, landmarks, regions, articulations, and orientation cues that organize the human skeleton.', coursePriority: false, lessons: skeletalLessons,
};

const foundationRows: Array<[string,string,string,string[]]> = [
  ['brain','Brain','nervous system',[]], ['heart','Heart','cardiovascular',[]], ['lungs','Lungs','respiratory',[]], ['liver','Liver','digestive',[]],
  ['stomach','Stomach','digestive',[]], ['kidneys','Kidneys','urinary',[]], ['pancreas','Pancreas','endocrine and digestive',[]], ['thyroid-gland','Thyroid gland','endocrine',[]],
  ['pituitary-gland','Pituitary gland','endocrine',[]], ['adrenal-glands','Adrenal glands','endocrine',[]], ['spleen','Spleen','lymphatic',[]], ['uterus','Uterus','female reproductive',[]],
];
export const foundationStructures: Structure[] = foundationRows.map(([id, canonicalName, category, acceptedAliases]) => ({
  id, canonicalName, category, acceptedAliases, moduleId: foundationsModuleId, sourceId: OPENSTAX_SOURCE_ID, sourcePage: null, examPriority: false, verificationStatus: 'verified',
}));
export const foundationLessons: Lesson[] = [
  lesson('organ-map','Organ map','Use body cavities and systems to build a mental map before learning isolated details.', foundationStructures.map((s) => s.id), ['Heart and lungs occupy the thoracic cavity; most digestive and urinary organs are in the abdominopelvic cavity.', 'Glands release chemical signals or secretions that coordinate body functions.'], ['The thyroid sits in the anterior neck; the kidneys are posterior in the abdominal region; the spleen is left-sided.'], ['Organs work in systems: the pancreas contributes to both digestion and endocrine regulation; the hypothalamus links nervous and endocrine control.'], ['The spleen is lymphatic, not a digestive organ; the adrenal glands sit superior to the kidneys.']),
];
export const foundationsModule: Module = {
  id: foundationsModuleId, title: 'Anatomy Foundations', ordering: 3, sourceIds: [OPENSTAX_SOURCE_ID],
  visible: true, published: true, contentStatus: 'available', system: 'Foundations', category: 'Anatomical orientation and organ systems',
  summary: 'Orient the body with standard terms, planes, regions, cavities, membranes, sections, and organ-system relationships.', coursePriority: false, lessons: foundationLessons,
};

export const anatomyQuestions: Question[] = [
  { id:'q-skeleton-radius', moduleId:skeletonModuleId, structureIds:['radius'], taskType:'bone-laterality', prompt:'Which forearm bone lies on the thumb side in anatomical position?', answer:'Radius', acceptedAliases:['radius'], options:['Radius','Ulna','Humerus','Scapula'], explanation:'The radius is lateral and aligns with the thumb in anatomical position.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-skeleton-tibia', moduleId:skeletonModuleId, structureIds:['tibia','fibula'], taskType:'multiple-choice', prompt:'Which bone is the medial, weight-bearing bone of the leg?', answer:'Tibia', acceptedAliases:[], options:['Tibia','Fibula','Femur','Talus'], explanation:'The tibia is medial and bears most leg weight; the fibula is lateral and slender.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-skeleton-vertebrae', moduleId:skeletonModuleId, structureIds:['cervical-vertebrae','thoracic-vertebrae','lumbar-vertebrae'], taskType:'ordered-sequence', prompt:'Order these vertebral regions from superior to inferior.', answer:['Cervical','Thoracic','Lumbar'], acceptedAliases:[], options:['Lumbar','Cervical','Thoracic'], explanation:'The vertebral column proceeds from cervical neck vertebrae to thoracic chest vertebrae to lumbar lower-back vertebrae.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-skeleton-skull', moduleId:skeletonModuleId, structureIds:['foramen-magnum'], taskType:'typed-recall', prompt:'What large opening in the occipital bone allows passage of the spinal cord?', answer:'Foramen magnum', acceptedAliases:['foramen magnum'], explanation:'The foramen magnum is the large inferior opening of the occipital bone.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-skeleton-skull-landmark', moduleId:skeletonModuleId, structureIds:['mandibular-condyle','mandibular-coronoid'], taskType:'function-relationship', prompt:'Which mandibular landmark participates in the temporomandibular joint?', answer:'Mandibular condyle', acceptedAliases:['condylar process'], options:['Mandibular condyle','Coronoid process','Mental foramen','Zygomatic arch'], explanation:'The mandibular condyle articulates with the temporal bone at the temporomandibular joint.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-skeleton-cervical-landmark', moduleId:skeletonModuleId, structureIds:['dens','transverse-foramen'], taskType:'multiple-choice', prompt:'Which landmark projects superiorly from the axis (C2)?', answer:'Dens', acceptedAliases:['odontoid process'], options:['Dens','Transverse foramen','Vertebral body','Inferior articular facet'], explanation:'The dens is the tooth-like projection of C2 and helps atlas rotation.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-skeleton-rib-landmark', moduleId:skeletonModuleId, structureIds:['rib-head','rib-tubercle','costal-groove'], taskType:'multiple-choice', prompt:'Which rib landmark articulates with a transverse process?', answer:'Tubercle of rib', acceptedAliases:['rib tubercle'], options:['Head of rib','Tubercle of rib','Costal groove','Xiphoid process'], explanation:'The rib tubercle articulates with the transverse process of a thoracic vertebra.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-skeleton-shoulder-landmark', moduleId:skeletonModuleId, structureIds:['scapular-spine','acromion','coracoid-process'], taskType:'typed-recall', prompt:'What scapular process continues laterally from the scapular spine?', answer:'Acromion', acceptedAliases:['acromion process'], explanation:'The acromion is the lateral continuation of the scapular spine.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-skeleton-humerus-landmark', moduleId:skeletonModuleId, structureIds:['humeral-head','greater-tubercle'], taskType:'function-relationship', prompt:'Which proximal humerus surface enters the glenoid cavity?', answer:'Head of humerus', acceptedAliases:['humeral head'], options:['Head of humerus','Greater tubercle','Capitulum','Trochlea'], explanation:'The rounded humeral head articulates with the glenoid cavity at the shoulder.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-skeleton-forearm-landmark', moduleId:skeletonModuleId, structureIds:['radial-head','radial-styloid','olecranon','trochlear-notch'], taskType: 'bone-laterality', prompt:'Which distal forearm landmark lies on the thumb side?', answer:'Radial styloid process', acceptedAliases:['radial styloid'], options:['Radial styloid process','Olecranon','Trochlear notch','Medial epicondyle'], explanation:'The radius is lateral in anatomical position and ends distally in the radial styloid process.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-skeleton-pelvis-landmark', moduleId:skeletonModuleId, structureIds:['iliac-crest','asis','ischial-tuberosity','obturator-foramen'], taskType:'multiple-choice', prompt:'Which pelvic landmark is the superior palpable rim?', answer:'Iliac crest', acceptedAliases:[], options:['Iliac crest','ASIS','Ischial tuberosity','Obturator foramen'], explanation:'The iliac crest forms the superior border of the ilium.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-skeleton-leg-landmark', moduleId:skeletonModuleId, structureIds:['femoral-head','femoral-neck','greater-trochanter','femoral-condyles','tibial-tuberosity','medial-malleolus','lateral-malleolus'], taskType:'bone-laterality', prompt:'Which ankle prominence belongs to the fibula?', answer:'Lateral malleolus', acceptedAliases:[], options:['Lateral malleolus','Medial malleolus','Tibial tuberosity','Greater trochanter'], explanation:'The fibula forms the lateral malleolus; the tibia forms the medial malleolus.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-organ-adrenal', moduleId:foundationsModuleId, structureIds:['adrenal-glands'], taskType:'multiple-choice', prompt:'Where are the adrenal glands located relative to the kidneys?', answer:'Superior to the kidneys', acceptedAliases:[], options:['Superior to the kidneys','Inside the kidneys','Inferior to the bladder','Within the thyroid'], explanation:'The paired adrenal glands sit superior to the kidneys.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-organ-thyroid', moduleId:foundationsModuleId, structureIds:['thyroid-gland'], taskType:'multiple-choice', prompt:'Where is the thyroid gland located?', answer:'Anterior neck', acceptedAliases:['front of neck'], options:['Anterior neck','Posterior abdomen','Thoracic cavity','Pelvic cavity'], explanation:'The thyroid lies in the anterior neck near the trachea.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
  { id:'q-organ-pancreas', moduleId:foundationsModuleId, structureIds:['pancreas'], taskType:'function-relationship', prompt:'Why is the pancreas associated with both digestive and endocrine systems?', answer:'It contributes digestive secretions and endocrine regulation', acceptedAliases:['both digestion and endocrine regulation'], options:['It contributes digestive secretions and endocrine regulation','It only stores bile','It filters blood','It pumps blood'], explanation:'The pancreas has exocrine digestive functions and endocrine hormone regulation.', sourceId:OPENSTAX_SOURCE_ID, sourcePage:null, examPriority:false, verificationStatus:'verified' },
];