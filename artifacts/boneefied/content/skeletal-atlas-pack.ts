import type { Asset, Module, Question, SourceRecord } from './model';
import { skeletalPlates } from './skeletal-atlas-plates.generated.ts';
import { OPENSTAX_SOURCE_ID, skeletalLandmarkStructures, skeletalStructures } from './anatomy.ts';
import { jointsStructures, skeletalExpansionStructures, SKELETAL_AXIAL_SOURCE_ID, SKELETAL_APPENDICULAR_SOURCE_ID } from './systems.ts';
import { visualAssets } from './visual-content.ts';

export const SKELETAL_ATLAS_SOURCE_ID = 'source-boneefied-skeletal-atlas';
export const SKELETAL_ATLAS_RIGHTS = 'Original Boneefied project artwork (skeletal atlas, BVIS02); all rights reserved by Boneefied. No CC0 or public-domain dedication is granted.';
export const SKELETAL_RETAINED_IDS = ['asset-servier-pelvis', 'asset-servier-elbow-joint'] as const;
export const SKELETAL_REPLACED_IDS = ['asset-skull-front', 'asset-skull-lateral', 'asset-cervical-vertebra'] as const;

export const skeletalAtlasSources: SourceRecord[] = [{
  id: SKELETAL_ATLAS_SOURCE_ID, filename: 'Boneefied skeletal atlas pack (22 SVG plates with PNG siblings)', hash: 'boneefied-skeletal-atlas-2026-10-10', pageCount: null,
  title: 'Boneefied skeletal atlas pack', courseLabAssociation: null, sourceType: 'image', attributionLicenseStatus: SKELETAL_ATLAS_RIGHTS,
  notes: '22 original vector plates drawn from scratch (19 additions, 3 in-place replacements). No third-party art traced or imported; NIH StatPearls figures are not public domain and were not used. Text-only factual references checked 2026-10-10: NBK499834, NBK535397, NBK535382, NBK545260, NBK535416, NBK559233, NBK507780, NBK535432. Provenance: assets/images/anatomy/skeletal-atlas/provenance.json.',
  verificationStatus: 'verified',
}];

const nameOf = new Map<string, string>();
const ownerOf = new Map<string, string>();
for (const s of [...skeletalStructures, ...skeletalLandmarkStructures, ...skeletalExpansionStructures, ...jointsStructures]) { nameOf.set(s.id, s.canonicalName); ownerOf.set(s.id, s.moduleId); }
export const skeletalLabelName = (id: string) => nameOf.get(id) ?? id;

const plateAssets: Asset[] = skeletalPlates.map((p) => {
  const labels = p.labels.map((l) => ({ structureId: l.structureId, displayLabel: skeletalLabelName(l.structureId), x: l.x, y: l.y, radius: l.radius }));
  return {
    id: p.id, sourceId: SKELETAL_ATLAS_SOURCE_ID, sourcePage: null, localAssetPath: p.pngPath, assetType: 'diagram', labelStatus: 'unlabeled',
    attributionLicense: SKELETAL_ATLAS_RIGHTS, verificationStatus: 'verified', title: p.title[0], description: `${p.description[0]} Orientation: ${p.orientation}.`,
    hotspots: labels.map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius })), labels,
    imageAspectRatio: 1.45, imageOrientation: 'landscape',
    adaptationNote: p.replaces
      ? `Original Boneefied vector art that replaces the retired legacy Gray plate under the same asset ID (${p.replaces}); the legacy Gray PNG stays in the repository, unused. No baked text; names come from labels metadata.`
      : 'Original Boneefied vector art (SVG master with PNG sibling). No baked text; names come from labels metadata.',
  } as Asset;
});
export const skeletalAtlasAssets: Asset[] = plateAssets;
export const skeletalAtlasKeyToId = new Map(skeletalPlates.map((p) => [p.key, p.id]));
const idOf = (key: string) => skeletalAtlasKeyToId.get(key)!;

/** Replaces the three legacy plates in place (same ID, same list position) and appends the 19 additions. */
export function applySkeletalAtlasAssets(assets: Asset[]): Asset[] {
  const byId = new Map(plateAssets.map((a) => [a.id, a]));
  const replaced = assets.map((a) => byId.get(a.id) ?? a);
  const have = new Set(replaced.map((a) => a.id));
  return [...plateAssets.filter((a) => !have.has(a.id)), ...replaced];
}

const L = (...keys: string[]) => keys.map(idOf);
const placements: Record<string, string[]> = {
  'skull-orientation': L('skull-anterior', 'skull-lateral'),
  'skull-landmarks': L('skull-lateral', 'skull-base-external', 'skull-sutures'),
  'cranial-fossae-foramina': L('cranial-floor-internal', 'skull-base-external'),
  'vertebral-column': L('vertebra-typical'),
  'vertebral-landmarks': L('vertebra-typical', 'atlas-axis'),
  'regional-vertebrae': L('vertebrae-regional'),
  'thoracic-cage': L('thoracic-cage', 'rib-detail'),
  'limb-girdles': [...L('scapula', 'pectoral-girdle', 'hip-bone'), 'asset-servier-pelvis'],
  'girdle-limb-landmarks': L('scapula', 'humerus', 'hip-bone'),
  'limb-bones': L('humerus', 'forearm', 'femur', 'leg-tibia-fibula'),
  'hand-wrist-bones': L('hand-palmar'),
  'foot-ankle-bones': L('foot-dorsal'),
  'knee-articular-landmarks': L('leg-tibia-fibula', 'femur', 'knee-joint'),
  'synovial-features': L('synovial-joint'),
  'upper-limb-joints': L('shoulder-joint'),
  'lower-limb-joints': L('knee-joint'),
  'joint-injury-cues': L('shoulder-joint', 'knee-joint'),
};
/** Small scoped selected-plate galleries for the skeletal and joints module screens (reuses the existing viewer). */
export const skeletalGalleryByModule: Record<string, string[]> = {
  'skeletal-system': L('skull-anterior', 'skull-base-external', 'vertebrae-regional', 'thoracic-cage', 'hand-palmar'),
  'joints-ligaments': [...L('synovial-joint', 'shoulder-joint', 'knee-joint')],
};

export function attachSkeletalAtlas(modules: Module[]): Module[] {
  return modules.map((module) => {
    if (module.id !== 'skeletal-system' && module.id !== 'joints-ligaments') return module;
    return {
      ...module,
      sourceIds: [...new Set([...module.sourceIds, SKELETAL_ATLAS_SOURCE_ID, ...(module.id === 'joints-ligaments' ? [OPENSTAX_SOURCE_ID, SKELETAL_AXIAL_SOURCE_ID, SKELETAL_APPENDICULAR_SOURCE_ID] : [])])],
      lessons: module.lessons?.map((lesson) => {
        const ids = placements[lesson.id];
        if (!ids) return lesson;
        return {
          ...lesson,
          assetIds: [...new Set([...ids, ...(lesson.assetIds ?? [])])],
          sourceIds: [...new Set([...lesson.sourceIds, SKELETAL_ATLAS_SOURCE_ID])],
        };
      }),
    };
  });
}

/* ---------------- questions ---------------- */
const plate = (key: string) => skeletalPlates.find((p) => p.key === key)!;
const pickPlate = (key: string, ids: string[]) => ids.map((id) => {
  const l = plate(key).labels.find((x) => x.structureId === id);
  if (!l) throw new Error(`Skeletal atlas question references ${id} missing from plate ${key}`);
  return { structureId: l.structureId, x: l.x, y: l.y, radius: l.radius };
});
const pickRetained = (assetId: string, ids: string[]) => ids.map((id) => {
  const h = visualAssets.find((a) => a.id === assetId)!.hotspots!.find((x) => x.structureId === id)!;
  return { structureId: h.structureId, x: h.x, y: h.y, radius: h.radius };
});
type Spec = { id: string; moduleId: string; key: string; assetId: string; answer: string; options: string[]; en: [string, string]; es: [string, string]; retained?: boolean };
const sp = (suffix: string, moduleId: string, key: string, answer: string, options: string[], en: [string, string], es: [string, string], retained = false): Spec =>
  ({ id: `q-skeletal-atlas-${suffix}`, moduleId: ownerOf.get(answer) ?? moduleId, key, assetId: retained ? key : idOf(key), answer, options, en, es, retained });

export const skeletalAtlasQuestionSpecs: Spec[] = [
  sp('skull-anterior-mental', 'skeletal-system', 'skull-anterior', 'mental-foramen', ['mental-foramen', 'supraorbital-foramen', 'nasal-bone', 'zygomatic-bone'], ['Tap the mental foramen on the patient\'s right side of the mandible.', 'The mental foramen opens on the body of the mandible below the premolars; the supraorbital foramen is on the upper orbital rim.'], ['Toca el foramen mentoniano en el lado derecho del paciente de la mandíbula.', 'El foramen mentoniano se abre en el cuerpo de la mandíbula bajo los premolares; el foramen supraorbitario está en el borde superior de la órbita.']),
  sp('skull-lateral-mastoid', 'skeletal-system', 'skull-lateral', 'mastoid-process', ['mastoid-process', 'zygomatic-arch', 'mental-foramen'], ['Tap the mastoid process of the temporal bone.', 'The mastoid process is the rounded bump behind the ear opening; the zygomatic arch is the bar in front of it.'], ['Toca la apófisis mastoides del hueso temporal.', 'La apófisis mastoides es la prominencia redondeada detrás del orificio del oído; el arco cigomático es la barra que está delante.']),
  sp('skull-base-ovale', 'skeletal-system', 'skull-base-external', 'foramen-ovale', ['foramen-ovale', 'jugular-foramen', 'incisive-foramen'], ['On the inferior skull base, tap the foramen ovale on the patient\'s right (viewer left).', 'Foramen ovale lies in the greater wing of the sphenoid behind the pterygoid process; the jugular foramen sits farther back between temporal and occipital bones.'], ['En la base inferior del cráneo, toca el foramen oval del lado derecho del paciente (izquierda del observador).', 'El foramen oval está en el ala mayor del esfenoides, detrás de la apófisis pterigoides; el foramen yugular queda más atrás, entre los huesos temporal y occipital.']),
  sp('cranial-floor-spinosum', 'skeletal-system', 'cranial-floor-internal', 'foramen-spinosum', ['foramen-spinosum', 'optic-canal', 'hypoglossal-canal'], ['On the cranial floor, tap the foramen spinosum on the patient\'s right (viewer right).', 'The foramen spinosum lies posterolateral to the foramen ovale in the middle cranial fossa.'], ['En el suelo craneal, toca el foramen espinoso del lado derecho del paciente (derecha del observador).', 'El foramen espinoso queda posterolateral al foramen oval en la fosa craneal media.']),
  sp('sutures-sagittal', 'skeletal-system', 'skull-sutures', 'sagittal-suture', ['coronal-suture', 'sagittal-suture', 'lambdoid-suture'], ['Tap the sagittal suture between the two parietal bones.', 'The sagittal suture runs front to back in the midline; the coronal suture crosses in front and the lambdoid suture behind.'], ['Toca la sutura sagital entre los dos huesos parietales.', 'La sutura sagital va de delante hacia atrás en la línea media; la coronal cruza por delante y la lambdoidea por detrás.']),
  sp('vertebra-foramen', 'skeletal-system', 'vertebra-typical', 'vertebral-foramen', ['vertebral-body', 'vertebral-foramen', 'spinous-process'], ['Tap the vertebral foramen that protects the spinal cord.', 'The vertebral foramen lies between the body in front and the arch behind; stacked foramina form the vertebral canal.'], ['Toca el foramen vertebral que protege la médula espinal.', 'El foramen vertebral queda entre el cuerpo, delante, y el arco, detrás; los forámenes apilados forman el conducto vertebral.']),
  sp('regional-costal-facet', 'skeletal-system', 'vertebrae-regional', 'superior-costal-facet', ['transverse-foramen', 'superior-costal-facet', 'mammillary-process'], ['Tap the feature that marks a vertebra as thoracic because ribs articulate there.', 'Costal facets on thoracic vertebrae receive rib heads; cervical vertebrae have transverse foramina and lumbar vertebrae have mammillary processes.'], ['Toca la característica que identifica una vértebra como torácica porque ahí se articulan las costillas.', 'Las carillas costales de las vértebras torácicas reciben las cabezas de las costillas; las cervicales tienen forámenes transversos y las lumbares apófisis mamilares.']),
  sp('atlas-axis-dens', 'skeletal-system', 'atlas-axis', 'dens', ['dens', 'transverse-foramen', 'atlas-c1'], ['Tap the dens of the axis.', 'The dens projects upward from the body of C2 and acts as a pivot for the atlas, which has no body.'], ['Toca el diente (apófisis odontoides) del axis.', 'El diente se proyecta hacia arriba desde el cuerpo de C2 y sirve de pivote para el atlas, que no tiene cuerpo.']),
  sp('thoracic-cage-xiphoid', 'skeletal-system', 'thoracic-cage', 'xiphoid-process', ['manubrium', 'body-of-sternum', 'xiphoid-process'], ['Tap the xiphoid process.', 'The xiphoid process is the small inferior tip of the sternum below the body.'], ['Toca la apófisis xifoides.', 'La apófisis xifoides es la pequeña punta inferior del esternón, debajo del cuerpo.']),
  sp('rib-groove', 'skeletal-system', 'rib-detail', 'costal-groove', ['rib-head', 'rib-tubercle', 'costal-groove'], ['Tap the costal groove on the inner surface of the rib.', 'The costal groove runs along the lower inner border of the rib; the head and tubercle are at its posterior end.'], ['Toca el surco costal en la cara interna de la costilla.', 'El surco costal recorre el borde interno inferior de la costilla; la cabeza y el tubérculo están en su extremo posterior.']),
  sp('scapula-coracoid', 'skeletal-system', 'scapula', 'coracoid-process', ['coracoid-process', 'glenoid-cavity', 'scapular-spine'], ['On the right scapula, tap the coracoid process.', 'The coracoid process projects forward from the anterior scapula; the spine appears only on the posterior surface.'], ['En la escápula derecha, toca la apófisis coracoides.', 'La apófisis coracoides se proyecta hacia delante desde la escápula anterior; la espina solo aparece en la cara posterior.']),
  sp('pectoral-clavicle', 'skeletal-system', 'pectoral-girdle', 'clavicle', ['clavicle', 'manubrium', 'humeral-head'], ['Tap the right clavicle.', 'The clavicle links the manubrium of the sternum to the acromion of the scapula.'], ['Toca la clavícula derecha.', 'La clavícula une el manubrio del esternón con el acromion de la escápula.']),
  sp('humerus-head', 'skeletal-system', 'humerus', 'humeral-head', ['humeral-head', 'medial-epicondyle', 'lateral-epicondyle'], ['On the anterior right humerus, tap the humeral head.', 'In an anterior view of the right humerus the head faces medially, toward the viewer\'s right.'], ['En el húmero derecho anterior, toca la cabeza del húmero.', 'En una vista anterior del húmero derecho la cabeza mira hacia medial, a la derecha del observador.']),
  sp('forearm-ulnar-styloid', 'skeletal-system', 'forearm', 'ulnar-styloid', ['radial-styloid', 'ulnar-styloid', 'radial-tuberosity'], ['Tap the ulnar styloid process.', 'In the anterior right forearm the ulna is medial (viewer right), so its styloid lies on the viewer\'s right at the wrist.'], ['Toca la apófisis estiloides del cúbito.', 'En el antebrazo derecho anterior el cúbito es medial (derecha del observador), por lo que su estiloides queda a la derecha en la muñeca.']),
  sp('hand-scaphoid', 'skeletal-system', 'hand-palmar', 'scaphoid', ['scaphoid', 'triquetrum', 'capitate'], ['On the right palmar hand, tap the scaphoid.', 'The scaphoid is the radial (thumb-side) bone of the proximal carpal row.'], ['En la mano derecha palmar, toca el escafoides.', 'El escafoides es el hueso radial (del lado del pulgar) de la fila proximal del carpo.']),
  sp('hip-obturator', 'skeletal-system', 'hip-bone', 'obturator-foramen', ['obturator-foramen', 'acetabulum', 'asis'], ['On the lateral right hip bone, tap the obturator foramen.', 'The obturator foramen is the large opening below the acetabulum, framed by the ischium and pubis.'], ['En el hueso coxal derecho lateral, toca el foramen obturador.', 'El foramen obturador es la gran abertura bajo el acetábulo, limitada por el isquion y el pubis.']),
  sp('femur-linea-aspera', 'skeletal-system', 'femur', 'femoral-linea-aspera', ['femoral-linea-aspera', 'femoral-head', 'greater-trochanter'], ['On the posterior femur, tap the linea aspera.', 'The linea aspera is the vertical ridge down the back of the femoral shaft where thigh muscles attach.'], ['En el fémur posterior, toca la línea áspera.', 'La línea áspera es la cresta vertical en la cara posterior de la diáfisis femoral donde se insertan músculos del muslo.']),
  sp('leg-tibial-tuberosity', 'skeletal-system', 'leg-tibia-fibula', 'tibial-tuberosity', ['tibial-tuberosity', 'medial-malleolus', 'lateral-malleolus'], ['On the anterior right leg, tap the tibial tuberosity.', 'The tibial tuberosity is the proximal anterior bump of the tibia that receives the patellar ligament.'], ['En la pierna derecha anterior, toca la tuberosidad tibial.', 'La tuberosidad tibial es la prominencia anterior proximal de la tibia que recibe el ligamento rotuliano.']),
  sp('foot-cuboid', 'skeletal-system', 'foot-dorsal', 'cuboid', ['cuboid', 'navicular', 'talus'], ['On the right dorsal foot, tap the cuboid.', 'The cuboid is the lateral tarsal bone in front of the calcaneus; the navicular is on the medial side.'], ['En el pie derecho dorsal, toca el cuboides.', 'El cuboides es el hueso tarsiano lateral delante del calcáneo; el navicular está en el lado medial.']),
  sp('synovial-cavity', 'joints-ligaments', 'synovial-joint', 'joint-cavity', ['joint-cavity', 'fibrous-capsule', 'ligament'], ['On the generic synovial joint, tap the joint cavity.', 'The joint cavity is the fluid-filled space between the cartilage-covered bone ends, inside the synovial membrane.'], ['En la articulación sinovial genérica, toca la cavidad articular.', 'La cavidad articular es el espacio lleno de líquido entre los extremos óseos cubiertos de cartílago, dentro de la membrana sinovial.']),
  sp('shoulder-glenoid', 'joints-ligaments', 'shoulder-joint', 'glenoid-cavity', ['glenoid-cavity', 'greater-tubercle', 'clavicle'], ['At the right shoulder, tap the glenoid cavity that receives the humeral head.', 'The shallow glenoid cavity of the scapula forms the socket of the glenohumeral joint.'], ['En el hombro derecho, toca la cavidad glenoidea que recibe la cabeza del húmero.', 'La cavidad glenoidea poco profunda de la escápula forma la cavidad de la articulación glenohumeral.']),
  sp('knee-mcl', 'joints-ligaments', 'knee-joint', 'mcl', ['mcl', 'lcl', 'patellar-ligament'], ['On the anterior right knee, tap the medial collateral ligament.', 'In the right knee seen from the front the medial side is at the viewer\'s right, opposite the fibular head and lateral collateral ligament.'], ['En la rodilla derecha anterior, toca el ligamento colateral medial.', 'En la rodilla derecha vista de frente el lado medial queda a la derecha del observador, opuesto a la cabeza del peroné y al ligamento colateral lateral.']),
  sp('retained-pelvis-pubis', 'skeletal-system', 'asset-servier-pelvis', 'pubis', ['ilium', 'pubis', 'sacrum'], ['On the pelvis illustration, tap the pubis.', 'The pubis is the anterior inferior part of the hip bone, below the ilium and in front of the sacrum.'], ['En la ilustración de la pelvis, toca el pubis.', 'El pubis es la parte anteroinferior del hueso coxal, bajo el ilion y por delante del sacro.'], true),
  sp('retained-elbow-humerus', 'joints-ligaments', 'asset-servier-elbow-joint', 'humerus', ['humerus', 'fibrous-capsule'], ['On the elbow illustration, tap the humerus that enters the joint from above.', 'The humerus is the long bone above the elbow; the fibrous capsule surrounds the joint itself.'], ['En la ilustración del codo, toca el húmero que entra en la articulación por arriba.', 'El húmero es el hueso largo sobre el codo; la cápsula fibrosa rodea la propia articulación.'], true),
];

export const skeletalAtlasQuestions: Question[] = skeletalAtlasQuestionSpecs.map((s): Question => ({
  id: s.id, moduleId: s.moduleId, structureIds: [s.answer], taskType: 'hotspot', prompt: s.en[0], answer: s.answer, options: s.options, acceptedAliases: [],
  assetId: s.assetId, explanation: s.en[1], sourceId: SKELETAL_ATLAS_SOURCE_ID, sourcePage: null, examPriority: true, verificationStatus: 'verified',
  hotspots: s.retained ? pickRetained(s.assetId, s.options) : pickPlate(s.key, s.options),
}));
