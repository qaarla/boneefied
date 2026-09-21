import type { Asset, Lesson, Module, NormalizedHotspot, Question, SourceRecord, Structure } from './model';
import { MUSCULAR_SOURCE_ID } from './systems.ts';

export const OPENSTAX_MUSCLE_VISUAL_SOURCE_ID = 'source-openstax-muscle-visuals';
export const ROTATOR_CUFF_VISUAL_SOURCE_ID = 'source-injurymap-rotator-cuff';

export const muscleRegionSources: SourceRecord[] = [
  {
    id: OPENSTAX_MUSCLE_VISUAL_SOURCE_ID,
    filename: 'OpenStax anterior and posterior muscle plates, labeled and unlabeled',
    hash: 'openstax-muscle-regional-crops-cc-by-4',
    pageCount: null,
    title: 'OpenStax major muscles of the body',
    courseLabAssociation: null,
    sourceType: 'image',
    attributionLicenseStatus: 'OpenStax, CC BY 4.0.',
    notes: 'Boneefied uses the verified label-removed anterior and posterior plates and crops them by region without altering anatomy.',
    verificationStatus: 'verified',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:1105_Anterior_and_Posterior_Views_of_Muscles.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    id: ROTATOR_CUFF_VISUAL_SOURCE_ID,
    filename: 'Rotator cuff muscles.svg',
    hash: '30c8e7247bac3fa11dbd90748df9c306f51a3280ac39cbcd6b9cc556a7c54ea5',
    pageCount: null,
    title: 'Rotator cuff muscles',
    courseLabAssociation: null,
    sourceType: 'image',
    attributionLicenseStatus: 'InjuryMap, CC BY-SA 4.0.',
    notes: 'Labeled anterior and posterior shoulder illustration used as a Study reference.',
    verificationStatus: 'verified',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rotator_cuff_muscles.svg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
];

const h = (structureId: string, x: number, y: number, radius = 0.055): NormalizedHotspot => ({ structureId, x, y, radius });
const lab = (structureId: string, displayLabel: string, x: number, y: number, radius = 0.055) => ({ structureId, displayLabel, x, y, radius });
const path = (name: string) => `assets/images/anatomy/${name}`;

const face = [
  lab('frontalis','Frontalis',.50,.20,.07), lab('temporalis','Temporalis',.34,.26,.06),
  lab('orbicularis-oculi','Orbicularis oculi',.43,.34,.055), lab('masseter','Masseter',.34,.43,.06),
  lab('orbicularis-oris','Orbicularis oris',.47,.48,.055),
];
const anteriorTrunk = [
  lab('deltoid','Deltoid',.16,.28,.075), lab('pectoralis-major','Pectoralis major',.30,.39,.09),
  lab('serratus-anterior','Serratus anterior',.67,.46,.075), lab('biceps-brachii','Biceps brachii',.11,.52,.07),
  lab('brachialis','Brachialis',.87,.54,.06), lab('rectus-abdominis','Rectus abdominis',.50,.67,.09),
  lab('external-oblique','External oblique',.30,.75,.08),
];
const anteriorArm = [
  lab('deltoid','Deltoid',.23,.29,.075), lab('pectoralis-major','Pectoralis major',.36,.42,.085),
  lab('biceps-brachii','Biceps brachii',.20,.58,.075), lab('brachialis','Brachialis',.78,.60,.065),
  lab('pronator-teres','Pronator teres',.80,.78,.06), lab('flexor-carpi-radialis','Flexor carpi radialis',.82,.89,.055),
];
const anteriorLeg = [
  lab('tensor-fasciae-latae','Tensor fasciae latae',.69,.20,.06), lab('iliopsoas','Iliopsoas',.56,.27,.065),
  lab('adductor-longus','Adductor longus',.56,.41,.07), lab('gracilis','Gracilis',.58,.49,.055),
  lab('sartorius','Sartorius',.33,.38,.065), lab('rectus-femoris','Rectus femoris',.40,.47,.075),
  lab('vastus-lateralis','Vastus lateralis',.27,.53,.075), lab('vastus-medialis','Vastus medialis',.47,.60,.07),
  lab('tibialis-anterior','Tibialis anterior',.37,.79,.07), lab('fibularis-longus','Fibularis longus',.26,.76,.065),
];
const posteriorBack = [
  lab('levator-scapulae','Levator scapulae',.36,.22,.055), lab('rhomboid-major','Rhomboid major',.35,.35,.07),
  lab('trapezius','Trapezius',.67,.32,.09), lab('deltoid','Deltoid',.85,.44,.075),
  lab('infraspinatus','Infraspinatus',.21,.41,.07), lab('teres-minor','Teres minor',.18,.49,.055),
  lab('triceps-brachii','Triceps brachii',.09,.64,.07), lab('latissimus-dorsi','Latissimus dorsi',.63,.74,.10),
  lab('erector-spinae','Erector spinae',.43,.80,.075),
];
const posteriorLeg = [
  lab('gluteus-medius','Gluteus medius',.65,.15,.075), lab('gluteus-maximus','Gluteus maximus',.63,.27,.10),
  lab('biceps-femoris','Biceps femoris',.64,.45,.075), lab('semitendinosus','Semitendinosus',.52,.45,.065),
  lab('semimembranosus','Semimembranosus',.39,.45,.065), lab('gastrocnemius','Gastrocnemius',.60,.73,.09),
  lab('soleus','Soleus',.67,.70,.065),
];

const recallAsset = (id:string, file:string, title:string, aspect:number, targets:typeof face, description:string):Asset => ({
  id, sourceId:OPENSTAX_MUSCLE_VISUAL_SOURCE_ID, sourcePage:null, localAssetPath:path(file), assetType:'diagram',
  labelStatus:'unlabeled', attributionLicense:'OpenStax, CC BY 4.0.', verificationStatus:'verified',
  title, description, sourceUrl:'https://commons.wikimedia.org/wiki/File:Muscles;_anterior_view;_unlabeled.png',
  rightsUrl:'https://creativecommons.org/licenses/by/4.0/', adaptationNote:'Boneefied cropped the verified label-removed OpenStax plate and added normalized targets; anatomy is unchanged.',
  imageAspectRatio:aspect, imageOrientation:aspect > 1.1 ? 'landscape' : aspect < .9 ? 'portrait' : 'square',
  hotspots:targets.map(({structureId,x,y,radius})=>h(structureId,x,y,radius)), labels:targets,
});

export const muscleRegionAssets: Asset[] = [
  recallAsset('asset-openstax-muscle-face-neck','openstax-muscles-face-neck-unlabeled.png','Face and anterior neck muscles',300/220,face,'Regional recall crop for facial expression, mastication, and sternocleidomastoid.'),
  recallAsset('asset-openstax-muscle-anterior-trunk','openstax-muscles-anterior-trunk-unlabeled.png','Anterior trunk muscles',390/330,anteriorTrunk,'Regional recall crop for shoulder, chest, arm, and abdominal wall.'),
  recallAsset('asset-openstax-muscle-anterior-arm','openstax-muscles-anterior-upper-limb-unlabeled.png','Anterior shoulder, arm, and forearm',500/310,anteriorArm,'Regional recall crop for superficial anterior upper-limb muscles.'),
  recallAsset('asset-openstax-muscle-anterior-leg','openstax-muscles-anterior-lower-limb-unlabeled.png','Anterior hip, thigh, and leg',390/421,anteriorLeg,'Regional recall crop for anterior and medial thigh and anterior leg muscles.'),
  recallAsset('asset-openstax-muscle-posterior-back','openstax-muscles-posterior-back-unlabeled.png','Posterior shoulder and back muscles',1,posteriorBack,'Regional recall crop for superficial and dissected posterior shoulder and back muscles.'),
  recallAsset('asset-openstax-muscle-posterior-leg','openstax-muscles-posterior-lower-limb-unlabeled.png','Gluteal region, posterior thigh, and calf',300/429,posteriorLeg,'Regional recall crop for gluteal, hamstring, and calf muscles.'),
  {
    id:'asset-openstax-muscle-labeled-overview', sourceId:OPENSTAX_MUSCLE_VISUAL_SOURCE_ID, sourcePage:null,
    localAssetPath:path('openstax-muscles-anterior-posterior-labeled.jpg'), assetType:'diagram', labelStatus:'labeled',
    attributionLicense:'OpenStax, CC BY 4.0.', verificationStatus:'verified', title:'Major muscles, anterior and posterior labeled views',
    description:'Labeled Study reference comparing superficial and deeper anterior and posterior views.',
    sourceUrl:'https://commons.wikimedia.org/wiki/File:1105_Anterior_and_Posterior_Views_of_Muscles.jpg',
    rightsUrl:'https://creativecommons.org/licenses/by/4.0/', imageAspectRatio:1304/3033, imageOrientation:'portrait',
  },
  {
    id:'asset-openstax-diaphragm-labeled', sourceId:OPENSTAX_MUSCLE_VISUAL_SOURCE_ID, sourcePage:null,
    localAssetPath:path('openstax-diaphragm-labeled.jpg'), assetType:'diagram', labelStatus:'labeled',
    attributionLicense:'OpenStax, CC BY 4.0.', verificationStatus:'verified', title:'Diaphragm, inferior view',
    description:'Labeled Study reference showing the diaphragm, central tendon, major openings, ribs, and posterior muscular relationships.',
    sourceUrl:'https://commons.wikimedia.org/wiki/File:1113_The_Diaphragm.jpg',
    rightsUrl:'https://creativecommons.org/licenses/by/4.0/', imageAspectRatio:1863/1363, imageOrientation:'landscape',
  },
  {
    id:'asset-injurymap-rotator-cuff-labeled', sourceId:ROTATOR_CUFF_VISUAL_SOURCE_ID, sourcePage:null,
    localAssetPath:path('commons-rotator-cuff.png'), assetType:'diagram', labelStatus:'labeled',
    attributionLicense:'InjuryMap, CC BY-SA 4.0.', verificationStatus:'verified', title:'Rotator cuff, anterior and posterior views',
    description:'Labeled Study reference showing supraspinatus, infraspinatus, teres minor, and subscapularis.',
    sourceUrl:'https://commons.wikimedia.org/wiki/File:Rotator_cuff_muscles.svg',
    rightsUrl:'https://creativecommons.org/licenses/by-sa/4.0/', adaptationNote:'Rasterized from the source SVG; anatomy and labels are unchanged.',
    imageAspectRatio:1600/772, imageOrientation:'landscape',
  },
];

export const muscleRegionStructures: Structure[] = [
  {id:'masseter',canonicalName:'Masseter',acceptedAliases:[],moduleId:'muscular-system',category:'muscles of mastication',sourceId:OPENSTAX_MUSCLE_VISUAL_SOURCE_ID,sourcePage:null,examPriority:true,verificationStatus:'verified'},
  {id:'temporalis',canonicalName:'Temporalis',acceptedAliases:['temporal muscle'],moduleId:'muscular-system',category:'muscles of mastication',sourceId:OPENSTAX_MUSCLE_VISUAL_SOURCE_ID,sourcePage:null,examPriority:true,verificationStatus:'verified'},
];

const tap = (assetId:string, target:(typeof face)[number], region:string):Question => ({
  id:`q-muscle-visual-${target.structureId}`, moduleId:'muscular-system', structureIds:[target.structureId], taskType:'hotspot',
  prompt:`Tap the ${target.displayLabel.toLowerCase()} in this ${region} view.`, answer:target.structureId, acceptedAliases:[],
  assetId, hotspots:[h(target.structureId,target.x,target.y,target.radius)],
  explanation:`${target.displayLabel} is identified by its regional position, fiber direction, and nearby muscle relationships.`,
  sourceId:OPENSTAX_MUSCLE_VISUAL_SOURCE_ID, sourcePage:null, examPriority:true, verificationStatus:'verified',
});
export const muscleVisualQuestions: Question[] = [
  ...face.map(t=>tap('asset-openstax-muscle-face-neck',t,'face and neck')),
  ...anteriorTrunk.map(t=>tap('asset-openstax-muscle-anterior-trunk',t,'anterior trunk')),
  ...anteriorArm.filter(t=>!['deltoid','pectoralis-major','biceps-brachii','brachialis'].includes(t.structureId)).map(t=>tap('asset-openstax-muscle-anterior-arm',t,'anterior upper-limb')),
  ...anteriorLeg.map(t=>tap('asset-openstax-muscle-anterior-leg',t,'anterior lower-limb')),
  ...posteriorBack.filter(t=>!['deltoid'].includes(t.structureId)).map(t=>tap('asset-openstax-muscle-posterior-back',t,'posterior shoulder and back')),
  ...posteriorLeg.map(t=>tap('asset-openstax-muscle-posterior-leg',t,'posterior lower-limb')),
];

const q = (id:string, structureIds:string[], taskType:Question['taskType'], prompt:string, answer:string|string[], options:string[]|undefined, explanation:string):Question => ({
  id,moduleId:'muscular-system',structureIds,taskType,prompt,answer,acceptedAliases:[],options,explanation,
  sourceId:MUSCULAR_SOURCE_ID,sourcePage:null,examPriority:true,verificationStatus:'verified',
});
export const muscleKnowledgeQuestions: Question[] = [
  q('q-muscle-region-mastication',['masseter','temporalis'],'select-all','Select the major muscles of mastication in this set.',['Masseter','Temporalis'],['Masseter','Temporalis','Frontalis','Orbicularis oris'],'Masseter and temporalis elevate the mandible; the other choices are facial-expression muscles.'),
  q('q-muscle-region-face-confusion',['orbicularis-oculi','orbicularis-oris'],'multiple-choice','Which pairing correctly separates the two circular facial muscles?','Orbicularis oculi closes the eyelids; orbicularis oris closes and protrudes the lips',['Orbicularis oculi closes the eyelids; orbicularis oris closes and protrudes the lips','Both elevate the mandible','Orbicularis oris closes the eyelids','Both extend the neck'],'Oculi surrounds the eye; oris surrounds the mouth.'),
  q('q-muscle-region-scm-attachments',['sternocleidomastoid'],'muscle-origin-insertion','Which attachment pattern identifies sternocleidomastoid?','Sternum and clavicle to mastoid process',['Sternum and clavicle to mastoid process','Scapular spine to humerus','Ilium to tibia','Ribs to linea alba'],'Its name records the sterno-, cleido-, and mastoid attachment regions.'),
  q('q-muscle-region-trap-lat',['trapezius','latissimus-dorsi'],'multiple-choice','Which superficial posterior pairing is correct?','Trapezius is superior; latissimus dorsi forms the broad lower back',['Trapezius is superior; latissimus dorsi forms the broad lower back','Latissimus dorsi surrounds the eye','Trapezius is a calf muscle','Both are rotator-cuff muscles'],'Trapezius spans the upper back and neck; latissimus dorsi is broad and inferior.'),
  q('q-muscle-region-breathing',['diaphragm','intercostals'],'select-all','Select the muscles that directly change thoracic dimensions during breathing.',['Diaphragm','Intercostal muscles'],['Diaphragm','Intercostal muscles','Masseter','Gluteus medius'],'The diaphragm and intercostals are the primary regional breathing muscles in this set.'),
  q('q-muscle-region-abdominal-layers',['external-oblique','internal-oblique','transversus-abdominis'],'ordered-sequence','Order the lateral abdominal wall layers from superficial to deep.',['External oblique','Internal oblique','Transversus abdominis'],['Internal oblique','Transversus abdominis','External oblique'],'The three flat layers proceed external oblique, internal oblique, then transversus abdominis.'),
  q('q-muscle-region-cuff-group',['supraspinatus','infraspinatus','teres-minor','subscapularis'],'select-all','Select all four rotator-cuff muscles.',['Supraspinatus','Infraspinatus','Teres minor','Subscapularis'],['Supraspinatus','Infraspinatus','Teres minor','Subscapularis','Teres major','Deltoid'],'SITS names the four cuff muscles; teres major and deltoid are not cuff members.'),
  q('q-muscle-region-cuff-anterior',['subscapularis'],'multiple-choice','Which rotator-cuff muscle occupies the anterior surface of the scapula?','Subscapularis',['Subscapularis','Infraspinatus','Teres minor','Supraspinatus'],'Subscapularis fills the subscapular fossa on the anterior scapula.'),
  q('q-muscle-region-arm-compartments',['biceps-brachii','brachialis','triceps-brachii'],'multiple-choice','Which muscle is in the posterior arm compartment?','Triceps brachii',['Triceps brachii','Biceps brachii','Brachialis','Pronator teres'],'Triceps is posterior; biceps and brachialis are anterior arm muscles.'),
  q('q-muscle-region-biceps-insertion',['biceps-brachii'],'muscle-origin-insertion','Biceps brachii inserts on which forearm bone?','Radius',['Radius','Ulna','Scapula','Clavicle'],'Biceps inserts at the radial tuberosity and is therefore a strong supinator.'),
  q('q-muscle-region-forearm-groups',['flexor-carpi-radialis','extensor-carpi-radialis'],'multiple-choice','Which statement separates the superficial forearm groups?','Flexors are primarily anterior; extensors are primarily posterior',['Flexors are primarily anterior; extensors are primarily posterior','Both groups are in the thigh','Extensors are only medial','Flexors do not cross the wrist'],'Anterior and posterior compartments provide the broad practical grouping.'),
  q('q-muscle-region-gluteal',['gluteus-maximus','gluteus-medius'],'multiple-choice','Which gluteal muscle is most associated with pelvic stabilization during single-leg stance?','Gluteus medius',['Gluteus medius','Gluteus maximus','Sartorius','Adductor longus'],'Gluteus medius abducts the hip and stabilizes the pelvis.'),
  q('q-muscle-region-sartorius',['sartorius'],'muscle-action','Which combined action pattern is associated with sartorius?','Flexes, abducts, and laterally rotates the hip while flexing the knee',['Flexes, abducts, and laterally rotates the hip while flexing the knee','Extends the knee only','Plantarflexes the ankle','Closes the jaw'],'Sartorius crosses both hip and knee and runs obliquely across the anterior thigh.'),
  q('q-muscle-region-quadriceps',['rectus-femoris','vastus-lateralis','vastus-medialis','vastus-intermedius'],'select-all','Select the four quadriceps muscles.',['Rectus femoris','Vastus lateralis','Vastus medialis','Vastus intermedius'],['Rectus femoris','Vastus lateralis','Vastus medialis','Vastus intermedius','Biceps femoris','Sartorius'],'Rectus femoris and the three vasti form quadriceps femoris.'),
  q('q-muscle-region-vasti-confusion',['vastus-lateralis','vastus-medialis'],'multiple-choice','Which quadriceps muscle forms the medial teardrop near the knee?','Vastus medialis',['Vastus medialis','Vastus lateralis','Biceps femoris','Gracilis'],'Vastus medialis is medial and has a prominent distal portion near the patella.'),
  q('q-muscle-region-hamstrings',['biceps-femoris','semitendinosus','semimembranosus'],'select-all','Select the three major hamstring muscles.',['Biceps femoris','Semitendinosus','Semimembranosus'],['Biceps femoris','Semitendinosus','Semimembranosus','Rectus femoris','Gracilis'],'The major posterior-thigh hamstrings are biceps femoris, semitendinosus, and semimembranosus.'),
  q('q-muscle-region-calf-confusion',['gastrocnemius','soleus'],'multiple-choice','Which calf muscle crosses the knee as well as the ankle?','Gastrocnemius',['Gastrocnemius','Soleus','Tibialis anterior','Fibularis longus'],'Gastrocnemius originates above the knee; soleus does not cross the knee.'),
  q('q-muscle-region-leg-compartments',['tibialis-anterior','fibularis-longus','gastrocnemius'],'multiple-choice','Which mapping is correct?','Tibialis anterior—anterior; fibularis longus—lateral; gastrocnemius—posterior',['Tibialis anterior—anterior; fibularis longus—lateral; gastrocnemius—posterior','All three are anterior','All three are posterior','Fibularis longus is medial thigh'],'These three muscles anchor the anterior, lateral, and posterior practical compartments of the leg.'),
  q('q-muscle-region-fibularis-alias',['fibularis-longus'],'typed-recall','What older standard name may be used for fibularis longus?','Peroneus longus',undefined,'Fibularis longus is also commonly called peroneus longus.'),
  q('q-muscle-region-calcaneal-tendon',['gastrocnemius','soleus'],'muscle-origin-insertion','Which two major calf muscles converge into the calcaneal tendon?','Gastrocnemius and soleus',['Gastrocnemius and soleus','Tibialis anterior and fibularis longus','Sartorius and gracilis','Rectus femoris and biceps femoris'],'Gastrocnemius and soleus form the triceps surae and share the calcaneal tendon.'),
];

const aliasMap:Record<string,string[]> = {
  frontalis:['frontal belly of occipitofrontalis'], trapezius:['traps'], 'latissimus-dorsi':['lats'],
  'pectoralis-major':['pec major'], 'pectoralis-minor':['pec minor'], 'tensor-fasciae-latae':['TFL'],
  'fibularis-longus':['peroneus longus'], 'gastrocnemius':['gastroc'], sternocleidomastoid:['SCM'],
};

const lessonAssets:Record<string,string[]> = {
  'muscle-orientation':['asset-openstax-muscle-labeled-overview','asset-openstax-muscle-face-neck'],
  'axial-muscles':['asset-openstax-muscle-anterior-trunk','asset-openstax-muscle-posterior-back','asset-openstax-diaphragm-labeled'],
  'shoulder-rotator-cuff':['asset-injurymap-rotator-cuff-labeled','asset-openstax-muscle-posterior-back'],
  'arm-forearm':['asset-openstax-muscle-anterior-arm','asset-openstax-muscle-posterior-back'],
  'abdominal-wall':['asset-openstax-muscle-anterior-trunk'],
  'hip-thigh':['asset-openstax-muscle-anterior-leg','asset-openstax-muscle-posterior-leg'],
  'leg-and-ankle':['asset-openstax-muscle-anterior-leg','asset-openstax-muscle-posterior-leg'],
  'muscle-actions':['asset-openstax-muscle-labeled-overview'],
};
const lessonEnhancements:Record<string,Partial<Lesson>> = {
  'muscle-orientation':{
    recognitionCues:['Facial muscles form rings or sheets around openings; masseter lies over the mandibular ramus and temporalis fans over the temporal fossa.','Sternocleidomastoid forms an oblique neck strap from sternum/clavicle toward the mastoid.'],
    relationships:['Muscles of facial expression insert into skin; muscles of mastication act on the mandible.'],
    commonConfusions:['Do not confuse masseter and buccinator: masseter is a thick jaw closer; buccinator compresses the cheek.'],
  },
  'axial-muscles':{
    recognitionCues:['Trapezius is the broad superficial upper-back sheet; latissimus dorsi is broad and inferior.','Rectus abdominis is vertical and segmented; external oblique fibers run inferomedially.'],
    relationships:['Intercostals occupy rib spaces; the diaphragm separates thoracic and abdominal cavities.'],
  },
  'arm-forearm':{
    commonConfusions:['Brachialis is deep to biceps and is a pure elbow flexor; biceps also supinates.','Flexor carpi radialis is anterior; extensor carpi radialis belongs to the posterior group.'],
  },
  'hip-thigh':{
    recognitionCues:['Sartorius is the long oblique strap; rectus femoris is central; vastus lateralis and medialis flank it.','Biceps femoris is lateral in the posterior thigh; semitendinosus and semimembranosus are medial.'],
  },
};

export const attachMuscleRegionContent = (modules:Module[], structures:Structure[]) => ({
  modules:modules.map(module=>module.id !== 'muscular-system' ? module : ({
    ...module,
    sourceIds:[...new Set([...module.sourceIds,OPENSTAX_MUSCLE_VISUAL_SOURCE_ID,ROTATOR_CUFF_VISUAL_SOURCE_ID])],
    lessons:(module.lessons ?? []).map(lesson=>{
      const extra=lessonEnhancements[lesson.id];
      return {
        ...lesson,
        structureIds:lesson.id === 'muscle-orientation' ? [...new Set([...lesson.structureIds,'masseter','temporalis'])] : lesson.structureIds,
        assetIds:[...new Set([...(lesson.assetIds ?? []),...(lessonAssets[lesson.id] ?? [])])],
        sourceIds:[...new Set([...lesson.sourceIds,OPENSTAX_MUSCLE_VISUAL_SOURCE_ID,...(lesson.id === 'shoulder-rotator-cuff' ? [ROTATOR_CUFF_VISUAL_SOURCE_ID] : [])])],
        recognitionCues:[...lesson.recognitionCues,...(extra?.recognitionCues ?? [])],
        relationships:[...lesson.relationships,...(extra?.relationships ?? [])],
        commonConfusions:[...lesson.commonConfusions,...(extra?.commonConfusions ?? [])],
      };
    }),
  })),
  structures:structures.map(structure=>aliasMap[structure.id] ? {...structure,acceptedAliases:[...new Set([...structure.acceptedAliases,...aliasMap[structure.id]])],examPriority:true} : structure),
});