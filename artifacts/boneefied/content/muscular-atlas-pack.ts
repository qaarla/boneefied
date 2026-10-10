import type { Asset, Module, Question, SourceRecord } from './model';
import { muscularPlates } from './muscular-atlas-plates.generated.ts';
import { muscularStructures } from './systems.ts';
import { muscleRegionStructures } from './muscle-region-visual-expansion.ts';
import { advancedMuscleStructures } from './advanced-muscle-expansion.ts';

export const MUSCULAR_ATLAS_SOURCE_ID = 'source-boneefied-muscular-atlas';
export const MUSCULAR_ATLAS_RIGHTS = 'Original Boneefied project artwork (muscular atlas, BVIS03); all rights reserved by Boneefied. No CC0 or public-domain dedication is granted.';
export const MUSCULAR_REPLACED_IDS = muscularPlates.filter((p) => p.replaces).map((p) => p.replaces as string);

export const muscularAtlasSources: SourceRecord[] = [{
  id: MUSCULAR_ATLAS_SOURCE_ID, filename: 'Boneefied muscular atlas pack (20 SVG plates with PNG siblings)', hash: 'boneefied-muscular-atlas-2026-10-11', pageCount: null,
  title: 'Boneefied muscular atlas pack', courseLabAssociation: null, sourceType: 'image', attributionLicenseStatus: MUSCULAR_ATLAS_RIGHTS,
  notes: '20 original vector plates drawn from scratch (11 additions, 9 in-place replacements of retired third-party muscle figures). No third-party art traced or imported; references were consulted as text only (NIH StatPearls NBK537012, NBK534836, NBK470334, NBK526040). Provenance: assets/images/anatomy/muscular-atlas/provenance.json.',
  verificationStatus: 'verified',
}];

const structs = [...muscularStructures, ...muscleRegionStructures, ...advancedMuscleStructures];
const nameOf = new Map<string, string>();
const aliasOf = new Map<string, string[]>();
for (const s of structs) { nameOf.set(s.id, s.canonicalName); aliasOf.set(s.id, s.acceptedAliases ?? []); }
export const muscularLabelName = (id: string) => nameOf.get(id) ?? id;

export const muscularAtlasAssets: Asset[] = muscularPlates.map((p) => {
  const labels = p.labels.map((l) => ({ structureId: l.structureId, displayLabel: muscularLabelName(l.structureId), x: l.x, y: l.y, radius: l.radius }));
  return {
    id: p.id, sourceId: MUSCULAR_ATLAS_SOURCE_ID, sourcePage: null, localAssetPath: p.pngPath, assetType: 'diagram', labelStatus: 'unlabeled',
    attributionLicense: MUSCULAR_ATLAS_RIGHTS, verificationStatus: 'verified', title: p.title[0], description: `${p.description[0]} Orientation: ${p.orientation}.`,
    hotspots: labels.map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius })), labels,
    imageAspectRatio: 1.45, imageOrientation: 'landscape',
    adaptationNote: p.replaces
      ? `Original Boneefied vector art that replaces a retired third-party muscle figure under the same asset ID (${p.replaces}); the retired file stays in the repository, unused. No baked text; names come from labels metadata.`
      : 'Original Boneefied vector art (SVG master with PNG sibling). No baked text; names come from labels metadata.',
  } as Asset;
});
const idSet = new Set(muscularAtlasAssets.map((a) => a.id));
export const isMuscularAtlasAssetId = (id: string | undefined | null): boolean => !!id && idSet.has(id);
export const muscularAtlasKeyToId = new Map(muscularPlates.map((p) => [p.key, p.id]));
const idOf = (key: string) => muscularAtlasKeyToId.get(key)!;
/** Parent-context helper: muscular plates whose labels include the structure. */
export const combinedMuscularAssetsForStructure = (structureId: string): Asset[] =>
  muscularAtlasAssets.filter((a) => a.labels?.some((l) => l.structureId === structureId));

export function applyMuscularAtlasAssets(assets: Asset[]): Asset[] {
  const byId = new Map(muscularAtlasAssets.map((a) => [a.id, a]));
  const replaced = assets.map((a) => byId.get(a.id) ?? a);
  const have = new Set(replaced.map((a) => a.id));
  return [...muscularAtlasAssets.filter((a) => !have.has(a.id)), ...replaced];
}

/** Curated 3-5 image gallery; all other plates open in their lesson viewers. */
export const muscularGalleryByModule: Record<string, string[]> = {
  'muscular-system': ['overview', 'deep-back', 'rotator-cuff', 'deep-thigh', 'diaphragm'].map(idOf),
};

export function attachMuscularAtlas(modules: Module[]): Module[] {
  return modules.map((module) => {
    if (module.id !== 'muscular-system') return module;
    return {
      ...module,
      sourceIds: [...new Set([...module.sourceIds, MUSCULAR_ATLAS_SOURCE_ID])],
      lessons: module.lessons?.map((lesson) => {
        const ids = muscularPlates.filter((p) => p.lessons.includes(lesson.id)).map((p) => p.id);
        if (!ids.length) return lesson;
        return { ...lesson, assetIds: [...new Set([...(lesson.assetIds ?? []).filter(isMuscularAtlasAssetId), ...ids])], sourceIds: [...new Set([...lesson.sourceIds, MUSCULAR_ATLAS_SOURCE_ID])] };
      }),
    };
  });
}

/* ---------------- questions ---------------- */
const plate = (key: string) => muscularPlates.find((p) => p.key === key)!;
const pick = (key: string, ids: string[]) => ids.map((id) => {
  const l = plate(key).labels.find((x) => x.structureId === id);
  if (!l) throw new Error(`Muscular atlas question references ${id} missing from plate ${key}`);
  return { structureId: l.structureId, x: l.x, y: l.y, radius: l.radius };
});

type Tap = { id: string; key: string; answer: string; options: string[]; en: [string, string]; es: [string, string] };
const tap = (suffix: string, key: string, answer: string, options: string[], en: [string, string], es: [string, string]): Tap => ({ id: `q-muscular-atlas-${suffix}`, key, answer, options, en, es });
export const muscularAtlasTapSpecs: Tap[] = [
  tap('overview-lats', 'overview', 'latissimus-dorsi', ['trapezius', 'latissimus-dorsi', 'deltoid'], ['On the posterior figure, tap latissimus dorsi, the broad sheet of the lower back.', 'Latissimus dorsi is the large lower-back sheet that narrows toward the humerus; trapezius forms the upper diamond.'], ['En la figura posterior, toca el dorsal ancho, la lámina amplia de la espalda baja.', 'El dorsal ancho es la lámina grande de la espalda baja que se estrecha hacia el húmero; el trapecio forma el rombo superior.']),
  tap('face-masseter', 'face-neck', 'masseter', ['masseter', 'temporalis', 'buccinator'], ['Tap the masseter on the cheek, over the angle of the jaw.', 'Masseter is the thick quadrangular muscle over the mandibular ramus; temporalis fans over the temple and buccinator forms the cheek wall.'], ['Toca el masetero en la mejilla, sobre el ángulo de la mandíbula.', 'El masetero es el músculo cuadrangular grueso sobre la rama mandibular; el temporal se abre sobre la sien y el buccinador forma la pared de la mejilla.']),
  tap('chest-pectoralis-minor', 'anterior-chest', 'pectoralis-minor', ['pectoralis-major', 'pectoralis-minor', 'serratus-anterior'], ['On the cutaway side, tap pectoralis minor, the small muscle exposed once pectoralis major is removed.', 'Pectoralis minor lies deep to pectoralis major and runs from the ribs to the coracoid process.'], ['En el lado con corte, toca el pectoral menor, el músculo pequeño expuesto al retirar el pectoral mayor.', 'El pectoral menor está profundo al pectoral mayor y va de las costillas a la apófisis coracoides.']),
  tap('chest-intercostals', 'anterior-chest', 'intercostals', ['intercostals', 'rectus-abdominis', 'pectoralis-minor'], ['Tap the intercostal muscles between the ribs on the cutaway side.', 'Intercostal muscles fill the spaces between adjacent ribs; rectus abdominis lies below the rib cage.'], ['Toca los músculos intercostales entre las costillas en el lado con corte.', 'Los músculos intercostales llenan los espacios entre costillas contiguas; el recto del abdomen queda bajo la caja torácica.']),
  tap('back-infraspinatus', 'superficial-back', 'infraspinatus', ['infraspinatus', 'teres-minor', 'teres-major'], ['On the scapula, tap infraspinatus below the scapular spine.', 'Infraspinatus fills the infraspinous fossa; teres minor and teres major lie along the lateral border.'], ['En la escápula, toca el infraespinoso bajo la espina de la escápula.', 'El infraespinoso llena la fosa infraespinosa; el redondo menor y el redondo mayor están a lo largo del borde lateral.']),
  tap('deep-back-multifidus', 'deep-back', 'multifidus', ['multifidus', 'quadratus-lumborum', 'erector-spinae'], ['On the side where the erector spinae is removed, tap multifidus beside the spinous processes.', 'Multifidus is a short deep spinal muscle beside the spinous processes; quadratus lumborum lies lateral in the lumbar region.'], ['En el lado donde se retira el erector de la columna, toca el multífido junto a las apófisis espinosas.', 'El multífido es un músculo espinal corto y profundo junto a las apófisis espinosas; el cuadrado lumbar queda lateral en la región lumbar.']),
  tap('arm-coracobrachialis', 'anterior-arm', 'coracobrachialis', ['biceps-brachii', 'brachialis', 'coracobrachialis'], ['In the deep panel, tap coracobrachialis high on the medial arm.', 'Coracobrachialis runs from the coracoid process to the medial humerus; brachialis lies lower, beneath biceps.'], ['En el panel profundo, toca el coracobraquial en la parte alta del brazo medial.', 'El coracobraquial va de la apófisis coracoides al húmero medial; el braquial está más abajo, bajo el bíceps.']),
  tap('posterior-arm-anconeus', 'posterior-arm', 'anconeus', ['anconeus', 'triceps-brachii', 'deltoid'], ['In the elbow inset, tap anconeus, the small triangle beside the olecranon.', 'Anconeus is a small triangular elbow extensor from the lateral epicondyle to the olecranon.'], ['En el recuadro del codo, toca el ancóneo, el pequeño triángulo junto al olécranon.', 'El ancóneo es un pequeño extensor triangular del codo, del epicóndilo lateral al olécranon.']),
  tap('forearm-supinator', 'forearm', 'supinator', ['supinator', 'extensor-carpi-radialis', 'pronator-teres'], ['In the posterior panel with the proximal extensors cut away, tap supinator wrapped around the proximal radius.', 'Supinator is deep to the superficial extensors; their proximal portions are removed in this panel to expose it.'], ['En el panel posterior con los extensores proximales retirados, toca el supinador enrollado alrededor del radio proximal.', 'El supinador queda profundo a los extensores superficiales; sus porciones proximales están retiradas en este panel para exponerlo.']),
  tap('abdominal-transversus', 'abdominal-wall', 'transversus-abdominis', ['external-oblique', 'internal-oblique', 'transversus-abdominis'], ['In the deepest panel, tap transversus abdominis with its horizontal fibres.', 'Transversus abdominis is the deepest flat abdominal muscle and its fibres run horizontally.'], ['En el panel más profundo, toca el transverso del abdomen con sus fibras horizontales.', 'El transverso del abdomen es el músculo plano abdominal más profundo y sus fibras son horizontales.']),
  tap('gluteal-medius', 'gluteal', 'gluteus-medius', ['gluteus-maximus', 'gluteus-medius'], ['In the cutaway panel, tap gluteus medius on the lateral ilium.', 'Gluteus medius is exposed on the lateral ilium once gluteus maximus is removed.'], ['En el panel con corte, toca el glúteo medio sobre el ilion lateral.', 'El glúteo medio queda expuesto sobre el ilion lateral al retirar el glúteo mayor.']),
  tap('thigh-gracilis', 'anterior-thigh', 'gracilis', ['gracilis', 'adductor-longus', 'sartorius'], ['Tap gracilis, the long thin strap on the medial thigh.', 'Gracilis is the slender medial thigh strap; adductor longus is the shorter triangular muscle higher up.'], ['Toca el grácil, la cinta larga y delgada del muslo medial.', 'El grácil es la cinta delgada del muslo medial; el aductor largo es el músculo triangular más corto, más arriba.']),
  tap('deep-thigh-articularis', 'deep-thigh', 'articularis-genus', ['vastus-intermedius', 'articularis-genus', 'semimembranosus'], ['In the anterior deep panel, tap articularis genus just above the knee.', 'Articularis genus is a small slip of vastus intermedius that draws the synovial capsule of the knee upward.'], ['En el panel anterior profundo, toca el articular de la rodilla justo sobre la rodilla.', 'El articular de la rodilla es una pequeña lengüeta del vasto intermedio que tira de la cápsula sinovial de la rodilla hacia arriba.']),
  tap('leg-biceps-femoris', 'posterior-leg', 'biceps-femoris', ['biceps-femoris', 'semitendinosus', 'gluteus-maximus'], ['On the patient\'s right posterior thigh, tap biceps femoris, the lateral hamstring.', 'Biceps femoris is the lateral hamstring; semitendinosus is medial and semimembranosus lies deep to it.'], ['En el muslo posterior derecho del paciente, toca el bíceps femoral, el isquiotibial lateral.', 'El bíceps femoral es el isquiotibial lateral; el semitendinoso es medial y el semimembranoso queda profundo a él.']),
  tap('anterior-leg-tibialis', 'anterior-leg', 'tibialis-anterior', ['tibialis-anterior', 'fibularis-longus'], ['Tap tibialis anterior against the lateral surface of the tibia.', 'Tibialis anterior lies against the tibia in the anterior compartment; fibularis longus is lateral.'], ['Toca el tibial anterior contra la cara lateral de la tibia.', 'El tibial anterior se apoya en la tibia en el compartimento anterior; el fibular largo es lateral.']),
  tap('calf-popliteus', 'calf', 'popliteus', ['gastrocnemius', 'soleus', 'popliteus'], ['In the cutaway panel, tap popliteus behind the knee.', 'Popliteus is a small deep muscle behind the knee that unlocks the extended knee.'], ['En el panel con corte, toca el poplíteo detrás de la rodilla.', 'El poplíteo es un músculo pequeño y profundo detrás de la rodilla que desbloquea la rodilla extendida.']),
  tap('cuff-supraspinatus', 'rotator-cuff', 'supraspinatus', ['supraspinatus', 'infraspinatus', 'teres-minor', 'teres-major'], ['On the posterior shoulder, tap supraspinatus above the scapular spine.', 'Supraspinatus sits above the spine; infraspinatus is below it, and teres major is not a rotator cuff muscle.'], ['En el hombro posterior, toca el supraespinoso sobre la espina de la escápula.', 'El supraespinoso está sobre la espina; el infraespinoso está bajo ella y el redondo mayor no es un músculo del manguito rotador.']),
  tap('diaphragm-dome', 'diaphragm', 'diaphragm', ['diaphragm'], ['In the coronal panel, tap the muscular periphery of the diaphragm dome.', 'The diaphragm is a dome-shaped sheet whose muscle fibres arise at the lower ribs and converge on the pale central tendon.'], ['En el panel coronal, toca la periferia muscular de la cúpula del diafragma.', 'El diafragma es una lámina en forma de cúpula cuyas fibras musculares nacen en las costillas inferiores y convergen en el tendón central pálido.']),
  tap('hand-hypothenar', 'hand', 'abductor-digiti-minimi-hand', ['abductor-pollicis-brevis', 'flexor-pollicis-brevis', 'abductor-digiti-minimi-hand'], ['On the little-finger side of the palm, tap abductor digiti minimi.', 'Abductor digiti minimi forms the hypothenar bulge; the thenar muscles are on the thumb side.'], ['En el lado del meñique de la palma, toca el abductor del meñique.', 'El abductor del meñique forma la eminencia hipotenar; los músculos tenares están del lado del pulgar.']),
  tap('foot-abductor-hallucis', 'foot', 'abductor-hallucis', ['abductor-hallucis', 'flexor-digitorum-brevis-foot', 'abductor-digiti-minimi-foot'], ['In the plantar panel, tap abductor hallucis along the medial border.', 'Abductor hallucis lies along the medial border of the sole; abductor digiti minimi runs along the lateral border.'], ['En el panel plantar, toca el abductor del dedo gordo a lo largo del borde medial.', 'El abductor del dedo gordo está en el borde medial de la planta; el abductor del dedo pequeño recorre el borde lateral.']),
  tap('foot-edb', 'foot', 'extensor-digitorum-brevis-foot', ['extensor-digitorum-brevis-foot', 'abductor-hallucis'], ['In the dorsal inset, tap extensor digitorum brevis on the lateral dorsum.', 'Extensor digitorum brevis is the small belly on the lateral dorsum of the foot.'], ['En el recuadro dorsal, toca el extensor corto de los dedos en el dorso lateral.', 'El extensor corto de los dedos es el pequeño vientre del dorso lateral del pie.']),
  tap('pelvic-pubococcygeus', 'pelvic-floor', 'pubococcygeus', ['pubococcygeus', 'iliococcygeus'], ['Tap pubococcygeus, the medial band running from the pubis toward the coccyx.', 'Pubococcygeus is the medial band beside the hiatus; iliococcygeus is the thinner lateral sheet.'], ['Toca el pubococcígeo, la banda medial que va del pubis hacia el cóccix.', 'El pubococcígeo es la banda medial junto al hiato; el iliococcígeo es la lámina lateral más delgada.']),
  tap('face-buccinator', 'face-neck', 'buccinator', ['buccinator', 'masseter', 'orbicularis-oris'], ['Tap buccinator, the muscle that forms the wall of the cheek.', 'Buccinator lies deep in the cheek and presses it against the teeth; masseter lies further back over the jaw angle.'], ['Toca el buccinador, el músculo que forma la pared de la mejilla.', 'El buccinador está en profundidad en la mejilla y la presiona contra los dientes; el masetero queda más atrás sobre el ángulo mandibular.']),
  tap('neck-platysma', 'face-neck', 'platysma', ['platysma', 'sternocleidomastoid', 'scalenes'], ['Tap platysma, the thin sheet over the anterior neck.', 'Platysma is a thin superficial sheet from the lower face over the anterior neck; sternocleidomastoid is the thicker oblique strap behind it.'], ['Toca el platisma, la lámina delgada sobre el cuello anterior.', 'El platisma es una lámina superficial delgada desde la parte baja de la cara sobre el cuello anterior; el esternocleidomastoideo es la cinta oblicua más gruesa detrás de él.']),
  tap('neck-scalenes', 'face-neck', 'scalenes', ['scalenes', 'sternocleidomastoid', 'platysma'], ['Tap the scalene muscles deep in the lateral neck.', 'The scalenes run from the cervical vertebrae to the first two ribs, deep to sternocleidomastoid.'], ['Toca los músculos escalenos en la profundidad del cuello lateral.', 'Los escalenos van de las vértebras cervicales a las dos primeras costillas, profundos al esternocleidomastoideo.']),
  tap('deep-back-rhomboid-minor', 'deep-back', 'rhomboid-minor', ['rhomboid-minor', 'rhomboid-major', 'levator-scapulae'], ['On the deep back plate, tap the small rhomboid minor at the top of the scapular border.', 'Rhomboid minor lies above rhomboid major along the medial scapular border; levator scapulae comes from the neck.'], ['En la lámina de espalda profunda, toca el pequeño romboides menor en la parte alta del borde escapular.', 'El romboides menor queda sobre el romboides mayor a lo largo del borde medial de la escápula; el elevador de la escápula viene del cuello.']),
  tap('cuff-teres-major', 'rotator-cuff', 'teres-major', ['supraspinatus', 'teres-minor', 'teres-major'], ['Tap teres major, the grey-toned muscle that is NOT part of the rotator cuff.', 'Teres major lies just below teres minor and medially rotates the arm but is not a rotator cuff muscle.'], ['Toca el redondo mayor, el músculo de tono gris que NO forma parte del manguito rotador.', 'El redondo mayor queda justo bajo el redondo menor y rota medialmente el brazo, pero no es un músculo del manguito rotador.']),
  tap('forearm-ecr', 'forearm', 'extensor-carpi-radialis', ['extensor-carpi-radialis', 'flexor-carpi-radialis', 'anconeus'], ['In the posterior forearm panel, tap extensor carpi radialis on the radial side.', 'Extensor carpi radialis lies on the radial side of the posterior forearm; flexor carpi radialis is on the anterior surface.'], ['En el panel posterior del antebrazo, toca el extensor radial del carpo en el lado radial.', 'El extensor radial del carpo está en el lado radial del antebrazo posterior; el flexor radial del carpo está en la superficie anterior.']),
  tap('abdominal-internal-oblique', 'abdominal-wall', 'internal-oblique', ['external-oblique', 'internal-oblique'], ['In the middle panel, tap internal oblique exposed beneath the external oblique.', 'Internal oblique lies deep to external oblique and its fibres run superomedially.'], ['En el panel central, toca el oblicuo interno expuesto bajo el oblicuo externo.', 'El oblicuo interno está profundo al oblicuo externo y sus fibras van en dirección superomedial.']),
  tap('deep-back-quadratus-lumborum', 'deep-back', 'quadratus-lumborum', ['multifidus', 'quadratus-lumborum', 'erector-spinae'], ['Tap quadratus lumborum in the lumbar region of the deep back plate.', 'Quadratus lumborum is a deep quadrilateral muscle of the posterior abdominal wall between the iliac crest and the twelfth rib.'], ['Toca el cuadrado lumbar en la región lumbar de la lámina de espalda profunda.', 'El cuadrado lumbar es un músculo cuadrilátero profundo de la pared abdominal posterior entre la cresta ilíaca y la duodécima costilla.']),
  tap('hand-fpb', 'hand', 'flexor-pollicis-brevis', ['abductor-pollicis-brevis', 'flexor-pollicis-brevis', 'lumbricals-hand'], ['Tap flexor pollicis brevis on the medial side of the thenar eminence.', 'Flexor pollicis brevis lies medial to abductor pollicis brevis in the thenar eminence.'], ['Toca el flexor corto del pulgar en el lado medial de la eminencia tenar.', 'El flexor corto del pulgar queda medial al abductor corto del pulgar en la eminencia tenar.']),
  tap('foot-adm', 'foot', 'abductor-digiti-minimi-foot', ['abductor-digiti-minimi-foot', 'flexor-digitorum-brevis-foot', 'abductor-hallucis'], ['In the plantar panel, tap abductor digiti minimi along the lateral border.', 'Abductor digiti minimi forms the lateral border of the sole, opposite abductor hallucis.'], ['En el panel plantar, toca el abductor del dedo pequeño a lo largo del borde lateral.', 'El abductor del dedo pequeño forma el borde lateral de la planta, opuesto al abductor del dedo gordo.']),
];

type Ident = { id: string; key: string; target: string; en: [string, string]; es: [string, string] };
export const muscularAtlasIdentSpecs: Ident[] = [
  { id: 'q-muscular-atlas-ident-scm', key: 'face-neck', target: 'sternocleidomastoid', en: ['Name the muscle marked 1 in this unlabeled lateral view of the neck.', 'Sternocleidomastoid is the oblique strap from the mastoid region down to the sternum and clavicle.'], es: ['Nombra el músculo marcado con 1 en esta vista lateral sin rótulos del cuello.', 'El esternocleidomastoideo es la cinta oblicua que va de la región mastoidea al esternón y la clavícula.'] },
  { id: 'q-muscular-atlas-ident-subscapularis', key: 'rotator-cuff', target: 'subscapularis', en: ['Name the rotator cuff muscle marked 1 on the anterior surface of the scapula.', 'Subscapularis fills the anterior scapular surface and inserts on the lesser tubercle of the humerus.'], es: ['Nombra el músculo del manguito rotador marcado con 1 en la cara anterior de la escápula.', 'El subescapular llena la cara anterior de la escápula y se inserta en el tubérculo menor del húmero.'] },
  { id: 'q-muscular-atlas-ident-vastus-intermedius', key: 'deep-thigh', target: 'vastus-intermedius', en: ['Name the deep quadriceps member marked 1 once the rectus femoris is removed.', 'Vastus intermedius is the fourth, deepest quadriceps member, lying under rectus femoris.'], es: ['Nombra el miembro profundo del cuádriceps marcado con 1 una vez retirado el recto femoral.', 'El vasto intermedio es el cuarto miembro, el más profundo, del cuádriceps y queda bajo el recto femoral.'] },
];

type Act = { id: string; key: string; target: string; source: string; where: [string, string] };
export const muscularAtlasActionSpecs: Act[] = [
  { id: 'q-muscular-atlas-action-fibularis', key: 'anterior-leg', target: 'fibularis-longus', source: 'q-muscle-action', where: ['the lateral compartment of the leg', 'el compartimento lateral de la pierna'] },
  { id: 'q-muscular-atlas-action-sartorius', key: 'anterior-thigh', target: 'sartorius', source: 'q-muscle-region-sartorius', where: ['the oblique strap across the anterior thigh', 'la cinta oblicua del muslo anterior'] },
  { id: 'q-muscular-atlas-action-thenar', key: 'hand', target: 'abductor-pollicis-brevis', source: 'q-advanced-muscle-thenar', where: ['the thumb side of the palm', 'el lado del pulgar de la palma'] },
  { id: 'q-muscular-atlas-action-lumbricals', key: 'hand', target: 'lumbricals-hand', source: 'q-advanced-muscle-lumbricals', where: ['the slender bellies between the metacarpals', 'los vientres delgados entre los metacarpianos'] },
  { id: 'q-muscular-atlas-action-plantar', key: 'foot', target: 'flexor-digitorum-brevis-foot', source: 'q-advanced-muscle-plantar', where: ['the central plantar muscle', 'el músculo plantar central'] },
  { id: 'q-muscular-atlas-action-floor', key: 'pelvic-floor', target: 'levator-ani', source: 'q-advanced-muscle-floor', where: ['the muscular sling of the pelvic floor', 'el cabestrillo muscular del suelo pélvico'] },
  { id: 'q-muscular-atlas-action-floor-lateral', key: 'pelvic-floor', target: 'iliococcygeus', source: 'q-advanced-muscle-floor-lateral', where: ['the thin lateral sheet of the pelvic floor', 'la lámina lateral delgada del suelo pélvico'] },
  { id: 'q-muscular-atlas-action-tibialis-posterior', key: 'calf', target: 'tibialis-posterior', source: 'q-advanced-muscle-posterior-leg', where: ['the deepest calf muscle on the medial border', 'el músculo más profundo de la pantorrilla en el borde medial'] },
];
export const actionPromptEn = (a: Act) => a.target === 'flexor-digitorum-brevis-foot'
  ? 'Which toes does the plantar muscle marked 1 primarily flex?'
  : a.target === 'iliococcygeus'
    ? 'Name the levator ani component marked 1: the thin lateral sheet that helps support the pelvic viscera.'
    : a.target === 'tibialis-posterior'
      ? 'Which deep calf muscle marked 1 plantarflexes and inverts the foot?'
      : `Marker 1 marks a muscle on this plate (${a.where[0]}). Which action is associated with that muscle?`;
export const actionPromptEs = (a: Act) => a.target === 'flexor-digitorum-brevis-foot'
  ? '¿Qué dedos flexiona principalmente el músculo plantar marcado con 1?'
  : a.target === 'iliococcygeus'
    ? 'Nombra el componente del elevador del ano marcado con 1: la lámina lateral fina que ayuda a sostener las vísceras pélvicas.'
    : a.target === 'tibialis-posterior'
      ? '¿Qué músculo profundo de la pantorrilla marcado con 1 realiza la flexión plantar y la inversión del pie?'
      : `El marcador 1 señala un músculo en esta lámina (${a.where[1]}). ¿Qué acción se asocia con ese músculo?`;

/** Old q-muscle-visual-* hotspot questions keep ID, answer, aliases and options; their target moves to the matching new plate. */
const RELOCATE: Record<string, string> = {
  brachialis: 'asset-openstax-muscle-anterior-arm', 'tibialis-anterior': 'asset-muscular-atlas-anterior-leg', 'fibularis-longus': 'asset-muscular-atlas-anterior-leg',
  soleus: 'asset-muscular-atlas-calf', semimembranosus: 'asset-muscular-atlas-deep-thigh', 'levator-scapulae': 'asset-muscular-atlas-deep-back',
  'rhomboid-major': 'asset-muscular-atlas-deep-back', 'erector-spinae': 'asset-muscular-atlas-deep-back',
};
export const RELOCATED_VISUAL_COPY: Record<string, { en: string; es: string }> = {
  brachialis: { en: 'Tap the brachialis in the deep panel of this anterior arm plate.', es: 'Toca el braquial en el panel profundo de esta lámina del brazo anterior.' },
  'tibialis-anterior': { en: 'Tap the tibialis anterior in this anterior and lateral leg view.', es: 'Toca el tibial anterior en esta vista anterior y lateral de la pierna.' },
  'fibularis-longus': { en: 'Tap the fibularis longus in this anterior and lateral leg view.', es: 'Toca el fibular largo en esta vista anterior y lateral de la pierna.' },
  soleus: { en: 'Tap the soleus in the cutaway panel of this calf plate.', es: 'Toca el sóleo en el panel con corte de esta lámina de la pantorrilla.' },
  semimembranosus: { en: 'Tap the semimembranosus in the posterior panel of this deep thigh plate.', es: 'Toca el semimembranoso en el panel posterior de esta lámina del muslo profundo.' },
  'levator-scapulae': { en: 'Tap the levator scapulae in this deep back dissection.', es: 'Toca el elevador de la escápula en esta disección profunda de la espalda.' },
  'rhomboid-major': { en: 'Tap the rhomboid major in this deep back dissection.', es: 'Toca el romboides mayor en esta disección profunda de la espalda.' },
  'erector-spinae': { en: 'Tap the erector spinae column in this deep back dissection.', es: 'Toca la columna del erector de la columna en esta disección profunda de la espalda.' },
};
const labelFor = (assetId: string, sid: string) => muscularPlates.find((p) => p.id === assetId)?.labels.find((l) => l.structureId === sid);

/**
 * Remaps old q-muscle-visual-* hotspots to the new plates, then appends the new atlas questions.
 * Takes the catalog's current questions so image-linked action questions can reuse their source options/aliases.
 */
export function applyMuscularAtlasQuestions(questions: Question[]): Question[] {
  const remapped = questions.map((q) => {
    if (q.moduleId === 'muscular-system' && q.taskType === 'image-identification' && q.assetId && !isMuscularAtlasAssetId(q.assetId)) {
      const sid = q.structureIds[0];
      const asset = combinedMuscularAssetsForStructure(sid)[0];
      const l = asset?.labels?.find((label) => label.structureId === sid);
      if (!asset || !l) throw new Error(`No original muscular plate for ${q.id}`);
      return { ...q, assetId: asset.id, hotspots: [{ structureId: sid, x: l.x, y: l.y, radius: l.radius }] };
    }
    if (!q.id.startsWith('q-muscle-visual-')) return q;
    const sid = q.structureIds[0];
    const assetId = RELOCATE[sid] ?? q.assetId!;
    const l = labelFor(assetId, sid);
    if (!l) throw new Error(`No label for ${sid} on ${assetId}`);
    return { ...q, assetId, sourceId: MUSCULAR_ATLAS_SOURCE_ID, hotspots: [{ structureId: sid, x: l.x, y: l.y, radius: l.radius }], ...(RELOCATE[sid] ? { prompt: RELOCATED_VISUAL_COPY[sid].en } : {}) };
  });
  const base = { moduleId: 'muscular-system', sourceId: MUSCULAR_ATLAS_SOURCE_ID, sourcePage: null, examPriority: true, verificationStatus: 'verified' as const };
  const taps = muscularAtlasTapSpecs.map((s): Question => ({ ...base, id: s.id, structureIds: [s.answer], taskType: 'hotspot', prompt: s.en[0], answer: s.answer, options: s.options, acceptedAliases: [], assetId: idOf(s.key), explanation: s.en[1], hotspots: pick(s.key, s.options) }));
  const idents = muscularAtlasIdentSpecs.map((s): Question => ({ ...base, id: s.id, structureIds: [s.target], taskType: 'image-identification', prompt: s.en[0], answer: muscularLabelName(s.target), acceptedAliases: aliasOf.get(s.target) ?? [], assetId: idOf(s.key), explanation: s.en[1], hotspots: pick(s.key, [s.target]) }));
  const actions = muscularAtlasActionSpecs.map((s): Question => {
    const src = questions.find((x) => x.id === s.source);
    if (!src) throw new Error(`Missing source action question ${s.source}`);
    return { ...base, id: s.id, structureIds: [s.target], taskType: 'muscle-action', prompt: actionPromptEn(s), answer: src.answer, options: src.options, acceptedAliases: src.acceptedAliases, assetId: idOf(s.key), explanation: src.explanation, hotspots: pick(s.key, [s.target]) };
  });
  return [...remapped, ...taps, ...idents, ...actions];
}
