import type { Asset, Module, Question, SourceRecord, Structure, VerifiedLabel } from './model';
import { MUSCULAR_SOURCE_ID } from './systems.ts';

// These are the individually licensed 2016 Commons files, not a claim about
// the licensing of a later OpenStax edition or of the entire website.
const plates = [
  ['humerus', '1119 Muscles that Move the Humerus.jpg', '22f8d9e34a35c2819f3cf9fe7244f81136c5d8b20c6f6210248a1209b0d8318d', 2229, 2371],
  ['hand', '1121 Intrinsic Muscles of the Hand.jpg', 'b02203c22b3f29b9dcd0ee26b5638607df35e37120433403e01d66d87f58f05b', 2083, 2033],
  ['leg', '1123 Muscles of the Leg that Move the Foot and Toes.jpg', '861ed5951aa6beaa991a06e08a9b4859fb2ecfaa57e600ea86dd8c7b3c91bfe1', 2279, 1358],
  ['foot', '1124 Intrinsic Muscles of the Foot.jpg', '3ff14d4e30792dc53f5728765d8939b280c6f4a9319c9a4c32993d6ec1270d75', 2083, 1592],
  ['floor', '1115 Muscles of the Pelvic Floor.jpg', '20ab5c2dcb4ab10c233467d3567039a2e4d90105ec29bb7c6756892e99c5a5fc', 1917, 1396],
  ['perineum', '1116 Muscle of the Perineum.jpg', '9c8fc4d73430a4be1fdb0f23b45bab55564aebc2b4b246031928dee71202fb74', 2118, 1305],
] as const;
const sourceId = (key: string) => `source-openstax-2016-${key}`;
const sourceUrl = (filename: string) => `https://commons.wikimedia.org/wiki/File:${filename.replaceAll(' ', '_')}`;
const local = (file: string) => `assets/images/anatomy/${file}`;
export const advancedMuscleSources: SourceRecord[] = plates.map(([key, filename, hash]) => ({
  id: sourceId(key), filename, hash, pageCount: null,
  title: `OpenStax 2016: ${filename.replace('.jpg', '')}`,
  courseLabAssociation: null, sourceType: 'image',
  attributionLicenseStatus: 'OpenStax, 18 May 2016 Commons file, CC BY 4.0; not a course-supplied PDF.',
  notes: 'Individual Commons file metadata and license checked. Hash is the downloaded original JPEG. Crops are separately described in asset adaptation notes.',
  verificationStatus: 'verified', sourceUrl: sourceUrl(filename), licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
}));
const attribution = 'OpenStax, 2016, CC BY 4.0.';
const rightsUrl = 'https://creativecommons.org/licenses/by/4.0/';
const labeled = (key: typeof plates[number][0], title: string, description: string): Asset => {
  const plate = plates.find(([id]) => id === key)!;
  return {
    id: `asset-openstax-2016-${key}`, sourceId: sourceId(key), sourcePage: null,
    localAssetPath: local(`openstax-2016-${key}-labeled.jpg`), assetType: 'diagram',
    labelStatus: 'labeled', attributionLicense: attribution, verificationStatus: 'verified',
    title, description, sourceUrl: sourceUrl(plate[1]), rightsUrl,
    imageAspectRatio: plate[3] / plate[4], imageOrientation: plate[3] / plate[4] > 1.1 ? 'landscape' : 'portrait',
    adaptationNote: 'Original Commons JPEG; printed labels remain visible. Study only, not a recall question.',
  };
};
const target = (structureId: string, displayLabel: string, x: number, y: number, radius: number): VerifiedLabel => ({ structureId, displayLabel, x, y, radius });
// Coordinates checked against the original printed leader endpoints and the
// anatomy-only crops. They lie within the visible muscle belly, not a label.
const hand = [
  target('abductor-digiti-minimi-hand', 'Abductor digiti minimi (hand)', .13, .36, .065),
  target('abductor-pollicis-brevis', 'Abductor pollicis brevis', .76, .31, .07),
  target('flexor-pollicis-brevis', 'Flexor pollicis brevis', .65, .44, .055),
  target('lumbricals-hand', 'Hand lumbricals', .48, .60, .055),
];
const plantar = [
  target('abductor-hallucis', 'Abductor hallucis', .17, .36, .075),
  target('flexor-digitorum-brevis-foot', 'Flexor digitorum brevis (foot)', .49, .49, .075),
  target('abductor-digiti-minimi-foot', 'Abductor digiti minimi (foot)', .79, .36, .065),
];
const dorsal = [target('extensor-digitorum-brevis-foot', 'Extensor digitorum brevis (foot)', .66, .72, .065)];
const crop = (key: 'hand' | 'foot', suffix: string, title: string, width: number, height: number, geometry: string, labels: VerifiedLabel[]): Asset => ({
  id: `asset-openstax-2016-${suffix}`, sourceId: sourceId(key), sourcePage: null,
  localAssetPath: local(`openstax-2016-${suffix}-unlabeled.jpg`),
  assetType: 'diagram', labelStatus: 'unlabeled', attributionLicense: attribution,
  verificationStatus: 'verified', title, description: 'Anatomy-only regional crop for recall; external printed names are excluded. Original leader lines remain.',
  sourceUrl: sourceUrl(plates.find(([id]) => id === key)![1]), rightsUrl,
  adaptationNote: `Cropped original 2016 labeled JPEG to ${geometry}; no anatomy erased or redrawn. Names excluded; leader lines remain. Target centers reviewed against the labeled original.`,
  imageAspectRatio: width / height, imageOrientation: width / height > 1.1 ? 'landscape' : 'portrait',
  labels, hotspots: labels.map(({ structureId, x, y, radius }) => ({ structureId, x, y, radius })),
});
export const advancedMuscleAssets: Asset[] = [
  labeled('humerus', 'Shoulder: superficial and deeper anterior/posterior views', 'Cut-away panels expose subscapularis anteriorly and supraspinatus, infraspinatus, and teres minor posteriorly; a superficial view alone cannot identify them.'),
  labeled('hand', 'Intrinsic hand muscles: left palmar and dorsal layers', 'Compare thumb and little-finger eminences, lumbricals and palmar/dorsal interossei. Labels are printed into this Study original.'),
  labeled('leg', 'Right lower leg: anterior, posterior, and deep posterior views', 'Comparison of compartments and the deep posterior tibialis posterior and long toe flexors.'),
  labeled('foot', 'Intrinsic foot muscles: dorsal and plantar layers', 'Right dorsal view and layered left plantar views; side and depth differ between panels.'),
  labeled('floor', 'Pelvic diaphragm: superior view', 'Female pelvic diaphragm from above: pubococcygeus and iliococcygeus form levator ani around the pelvic openings.'),
  labeled('perineum', 'Perineal muscles: male and female inferior views', 'Compare paired superficial perineal muscles and levator ani; these are not the same viewing direction as the superior pelvic diaphragm.'),
  crop('hand', 'hand-palmar', 'Left palmar hand: thenar, hypothenar and lumbricals', 545, 900, '545×900 at (340,60)', hand),
  crop('foot', 'foot-plantar', 'Left plantar foot: superficial muscles', 282, 680, '282×680 at (233,760)', plantar),
  crop('foot', 'foot-dorsal', 'Right dorsolateral foot', 630, 520, '630×520 at (710,20)', dorsal),
];
const structure = (id: string, canonicalName: string, category: string, source: 'hand' | 'foot' | 'floor' | 'leg', aliases: string[] = []): Structure => ({
  id, canonicalName, acceptedAliases: aliases, moduleId: 'muscular-system', category, sourceId: sourceId(source), sourcePage: null,
  examPriority: false, verificationStatus: 'verified',
});
export const advancedMuscleStructures: Structure[] = [
  structure('abductor-digiti-minimi-hand', 'Abductor digiti minimi (hand)', 'hypothenar hand', 'hand'),
  structure('abductor-pollicis-brevis', 'Abductor pollicis brevis', 'thenar hand', 'hand'),
  structure('flexor-pollicis-brevis', 'Flexor pollicis brevis', 'thenar hand', 'hand'),
  structure('lumbricals-hand', 'Lumbricals (hand)', 'intrinsic hand', 'hand', ['hand lumbricals']),
  structure('abductor-hallucis', 'Abductor hallucis', 'plantar foot', 'foot'),
  structure('flexor-digitorum-brevis-foot', 'Flexor digitorum brevis (foot)', 'plantar foot', 'foot', ['flexor digitorum brevis']),
  structure('abductor-digiti-minimi-foot', 'Abductor digiti minimi (foot)', 'plantar foot', 'foot'),
  structure('extensor-digitorum-brevis-foot', 'Extensor digitorum brevis (foot)', 'dorsal foot', 'foot'),
  structure('levator-ani', 'Levator ani', 'pelvic diaphragm', 'floor'),
  structure('pubococcygeus', 'Pubococcygeus', 'pelvic diaphragm', 'floor'),
  structure('iliococcygeus', 'Iliococcygeus', 'pelvic diaphragm', 'floor'),
  structure('tibialis-posterior', 'Tibialis posterior', 'deep posterior leg', 'leg'),
];
const identify = (assetId: string, item: VerifiedLabel, source: 'hand' | 'foot', typed = false): Question => ({
  id: `q-advanced-muscle-${typed ? 'name' : 'tap'}-${item.structureId}`,
  moduleId: 'muscular-system', structureIds: [item.structureId],
  taskType: typed ? 'image-identification' : 'hotspot',
  prompt: typed ? 'Name the muscle marked by ? in this unlabeled regional view.' : `Tap the ${item.displayLabel.toLowerCase()} in this unlabeled regional view.`,
  answer: typed ? item.displayLabel : item.structureId,
  assetId, acceptedAliases: typed ? (advancedMuscleStructures.find(s => s.id === item.structureId)?.acceptedAliases ?? []) : [],
  hotspots: [{ structureId: item.structureId, x: item.x, y: item.y, radius: item.radius }],
  explanation: `${item.displayLabel} is identified by its visible muscle belly and its position among the adjacent tendons and muscles; compare the labeled regional plate after answering.`,
  sourceId: sourceId(source), sourcePage: null, examPriority: false, verificationStatus: 'verified',
});
const knowledge = (id: string, ids: string[], prompt: string, answer: string, options: string[], explanation: string, source: typeof plates[number][0] = 'hand', taskType: Question['taskType'] = 'muscle-action'): Question => ({
  id: `q-advanced-muscle-${id}`, moduleId: 'muscular-system', structureIds: ids, taskType,
  prompt, answer, options, acceptedAliases: [], explanation,
  sourceId: taskType === 'muscle-origin-insertion' ? MUSCULAR_SOURCE_ID : sourceId(source),
  sourcePage: null, examPriority: false, verificationStatus: 'verified',
});
export const advancedMuscleQuestions: Question[] = [
  // A tall plantar crop is narrow when contained in a phone-width viewer.
  // Mark one verified structure per question and type its name; do not force
  // learners to tap several overlapping, sub-44pt target areas.
  ...hand.map((item) => identify('asset-openstax-2016-hand-palmar', item, 'hand', true)),
  ...plantar.map((item) => identify('asset-openstax-2016-foot-plantar', item, 'foot', true)),
  ...dorsal.map((item) => identify('asset-openstax-2016-foot-dorsal', item, 'foot', true)),
  knowledge('thenar', ['abductor-pollicis-brevis'], 'What is the primary action of abductor pollicis brevis?', 'Abducts the thumb away from the palm', ['Abducts the thumb away from the palm', 'Adducts the thumb toward the index finger', 'Extends the wrist', 'Flexes the little finger'], 'The thenar abductor moves the thumb perpendicular to the palm; adductor pollicis draws it back.', 'hand'),
  knowledge('lumbricals', ['lumbricals-hand'], 'Which combined finger action identifies the hand lumbricals?', 'Flex metacarpophalangeal joints and extend interphalangeal joints', ['Flex metacarpophalangeal joints and extend interphalangeal joints', 'Extend all finger joints', 'Flex the thumb only', 'Abduct the shoulder'], 'Lumbricals pass palmar to the knuckles and join the dorsal extensor expansion.', 'hand'),
  knowledge('plantar', ['flexor-digitorum-brevis-foot'], 'What does flexor digitorum brevis act on?', 'The lesser toes', ['The lesser toes', 'The thumb', 'The great toe alone', 'The ankle alone'], 'The superficial plantar flexor runs from the heel toward the lesser toes; flexor hallucis brevis acts on the great toe.', 'foot'),
  knowledge('floor', ['levator-ani','pubococcygeus','iliococcygeus'], 'What is the principal supportive role of levator ani?', 'Supports pelvic viscera and helps maintain continence', ['Supports pelvic viscera and helps maintain continence', 'Extends the knee', 'Contracts the diaphragm for inspiration', 'Supinates the forearm'], 'Pubococcygeus and iliococcygeus contribute to the paired pelvic diaphragm surrounding pelvic openings; the pudendal nerve primarily supplies superficial perineal muscles, not all of levator ani.', 'floor'),
  knowledge('posterior-leg', ['tibialis-posterior'], 'Which deep posterior leg muscle inverts the foot and supports its medial arch?', 'Tibialis posterior', ['Tibialis posterior', 'Tibialis anterior', 'Fibularis longus', 'Gastrocnemius'], 'Tibialis posterior runs behind the medial malleolus toward the tarsus; it lies deep to the superficial calf and is supplied by the tibial nerve.', 'leg'),
  knowledge('posterior-leg-attachment', ['tibialis-posterior'], 'Where does tibialis posterior arise before its tendon passes behind the medial malleolus?', 'Posterior tibia and fibula with the interosseous membrane', ['Posterior tibia and fibula with the interosseous membrane', 'Anterior superior iliac spine', 'Lateral epicondyle of the humerus', 'Patella and quadriceps tendon'], 'Its deep origin on both leg bones and the interosseous membrane explains why a superficial calf image cannot expose its belly.', 'leg', 'muscle-origin-insertion'),
  knowledge('plantar-attachment', ['abductor-hallucis'], 'Which origin best identifies the superficial medial abductor hallucis?', 'Calcaneal tuberosity and plantar connective tissues', ['Calcaneal tuberosity and plantar connective tissues', 'Lateral epicondyle of the humerus', 'Greater trochanter of the femur', 'Scapular spine'], 'It begins near the heel and runs along the medial sole toward the big toe; the neighboring flexor digitorum brevis runs more centrally.', 'foot', 'muscle-origin-insertion'),
  knowledge('hand-attachment', ['lumbricals-hand'], 'What is unusual about the origins of the hand lumbricals?', 'They arise from flexor digitorum profundus tendons', ['They arise from flexor digitorum profundus tendons', 'They arise from the calcaneal tuberosity', 'They arise from the scapular spine', 'They arise only from the radial shaft'], 'These thin intrinsic muscles run from long flexor tendons to extensor expansions, allowing knuckle flexion alongside interphalangeal extension.', 'hand', 'muscle-origin-insertion'),
  knowledge('floor-attachment', ['pubococcygeus'], 'Which attachment pattern fits pubococcygeus in the pelvic floor?', 'Pubic region toward coccyx and pelvic midline', ['Pubic region toward coccyx and pelvic midline', 'Calcaneus toward the toes', 'Clavicle toward the mastoid process', 'Scapula toward the humerus'], 'The pubococcygeus is the more medial levator ani component around the openings; iliococcygeus fans more laterally.', 'floor', 'muscle-origin-insertion'),
  knowledge('floor-lateral', ['iliococcygeus'], 'Which levator ani portion fans laterally toward the coccyx?', 'Iliococcygeus', ['Iliococcygeus', 'Pubococcygeus', 'Rectus abdominis', 'Bulbospongiosus'], 'Iliococcygeus makes the broader lateral sheet of levator ani; pubococcygeus lies nearer the pelvic openings.', 'floor'),
];
const details: Record<string, { ids: string[]; assets: string[]; cues: string[]; relationships: string[]; confusions: string[]; sources: string[] }> = {
  'muscle-orientation': {
    ids: [], assets: [],
    cues: ['The facial-expression muscles surround the eye and mouth and move skin; masseter lies over the mandibular ramus and temporalis fans over the temporal fossa. Sternocleidomastoid runs diagonally from sternum and clavicle to the mastoid process.'],
    relationships: ['Facial expression is supplied mainly by facial nerve (VII), whereas mastication muscles including masseter and temporalis use the mandibular division of trigeminal nerve (V3). Accessory nerve (XI) supplies sternocleidomastoid and trapezius. One sternocleidomastoid turns the face toward the opposite side; acting together they flex the neck.'],
    confusions: ['Do not confuse a thick masseter at the jaw angle with the thinner buccinator of the cheek. A full-body superficial view cannot identify deep neck muscles.'],
    sources: [],
  },
  'shoulder-rotator-cuff': {
    ids: [], assets: ['asset-openstax-2016-humerus'],
    cues: ['The deep anterior shoulder cutaway shows subscapularis on the costal surface of the scapula; the posterior cutaway exposes supraspinatus above the scapular spine and infraspinatus below it. The cut deltoid is not a cuff muscle.'],
    relationships: ['The four cuff tendons reach the humeral tubercles and stabilize the head in its socket. Supraspinatus initiates abduction, infraspinatus and teres minor rotate laterally, and subscapularis rotates medially. The suprascapular nerve supplies supraspinatus and infraspinatus; the axillary nerve supplies teres minor.'],
    confusions: ['Teres major sits below teres minor and is not part of the cuff; do not label a deep cuff muscle on a superficial full-body view.'],
    sources: ['humerus'],
  },
  'arm-forearm': {
    ids: hand.map(t => t.structureId), assets: ['asset-openstax-2016-hand', 'asset-openstax-2016-hand-palmar'],
    cues: ['In the left palmar hand, the thumb is on the right of the plate. The thenar eminence is at its base; the hypothenar eminence lies beside the little finger. Thin lumbricals run beside the flexor tendons.'],
    relationships: ['Thenar muscles move the thumb, predominantly through the median nerve recurrent branch; most hypothenar muscles and the interossei use the deep ulnar branch. The hand lumbricals flex the knuckles while extending the interphalangeal joints; lateral and medial pairs have different nerve supply.'],
    confusions: ['Abductor digiti minimi of the HAND is a little-finger muscle, not the same structure as the one on the lateral sole. Palmar interossei adduct fingers; dorsal interossei abduct.'],
    sources: ['hand'],
  },
  'leg-and-ankle': {
    ids: [...plantar, ...dorsal].map(t => t.structureId).concat('tibialis-posterior'),
    assets: ['asset-openstax-2016-leg', 'asset-openstax-2016-foot', 'asset-openstax-2016-foot-plantar', 'asset-openstax-2016-foot-dorsal'],
    cues: ['Compare three RIGHT leg compartments: superficial anterior, superficial posterior, and deep posterior. Tibialis posterior is visible only after superficial calf layers are removed. The foot plate switches to the LEFT plantar surface and RIGHT dorsolateral surface.'],
    relationships: ['The deep fibular nerve supplies anterior leg extensors; superficial fibular nerve supplies lateral evertors; tibial nerve supplies posterior leg and most plantar intrinsic muscles. Dorsal extensor digitorum brevis uses the deep fibular nerve. The plantar flexor digitorum brevis arises near the calcaneus and flexes the lesser toes.'],
    confusions: ['Do not confuse the extrinsic extensor digitorum longus in the anterior leg with the short intrinsic extensor digitorum brevis on the dorsum of the foot. Tibialis anterior dorsiflexes/inverts; tibialis posterior plantarflexes/inverts and supports the arch.'],
    sources: ['leg','foot'],
  },
  'axial-muscles': {
    ids: ['levator-ani','pubococcygeus','iliococcygeus'], assets: ['asset-openstax-2016-floor','asset-openstax-2016-perineum'],
    cues: ['The superior pelvic-diaphragm view looks down into the pelvis: levator ani is paired and cups the openings. Pubococcygeus lies more medially around the openings; iliococcygeus fans laterally toward the coccyx.'],
    relationships: ['The phrenic nerve (C3–C5) supplies the diaphragm; intercostal nerves supply muscles between the ribs. Trapezius uses accessory nerve, latissimus dorsi the thoracodorsal nerve, and erector spinae the posterior rami of spinal nerves. The pelvic floor supports viscera and helps maintain continence. In the inferior perineal views, superficial bulbospongiosus and ischiocavernosus are separate from deeper levator ani.'],
    confusions: ['A superior pelvic diaphragm is not an inferior perineum. Do not infer every levator ani subdivision from the inferior surface or equate pudendal supply to the superficial perineum with the entire pelvic diaphragm.'],
    sources: ['floor','perineum'],
  },
  'abdominal-wall': {
    ids: [], assets: [],
    cues: ['Rectus abdominis is the paired vertical strap; the flat lateral layers are external oblique superficially, internal oblique beneath it, then transverse-fiber transversus abdominis deepest.'],
    relationships: ['External oblique fibers run inferomedially, internal oblique fibers generally superomedially, and transversus runs horizontally. Unilateral external oblique contributes to rotation toward the opposite side; internal oblique helps rotate toward the same side. Together these layers compress the abdomen and assist forced expiration. Thoracoabdominal nerves supply the wall.'],
    confusions: ['Do not identify transversus abdominis on a superficial plate with external oblique intact. Laterality of trunk rotation depends on which side contracts.'],
    sources: [],
  },
  'hip-thigh': {
    ids: [], assets: [],
    cues: ['Gluteus medius lies laterally and deep to much of gluteus maximus; the quadriceps form the anterior thigh, adductors form a medial group, and hamstrings form the posterior thigh.'],
    relationships: ['Superior gluteal nerve supplies gluteus medius for single-leg pelvic stabilization; inferior gluteal nerve supplies gluteus maximus for powerful hip extension. Femoral nerve drives quadriceps knee extension, obturator nerve most medial thigh adduction, and the tibial division of sciatic nerve most hamstring knee flexion/hip extension. Rectus femoris crosses hip and knee; the vasti cross only the knee.'],
    confusions: ['The medial thigh adductors are not hamstrings, even where they approach the posterior border. Biceps femoris is lateral; semitendinosus and semimembranosus lie medially.'],
    sources: [],
  },
};
export function attachAdvancedMuscleContent(modules: Module[]): Module[] {
  return modules.map(module => module.id !== 'muscular-system' ? module : ({
    ...module,
    sourceIds: [...new Set([...module.sourceIds, ...advancedMuscleSources.map(s => s.id)])],
    lessons: (module.lessons ?? []).map(lesson => {
      const extra = details[lesson.id];
      if (!extra) return lesson;
      return {
        ...lesson,
        structureIds: [...new Set([...lesson.structureIds, ...extra.ids])],
        assetIds: [...new Set([...(lesson.assetIds ?? []), ...extra.assets])],
        sourceIds: [...new Set([...lesson.sourceIds, ...extra.sources.map(sourceId)])],
        recognitionCues: [...lesson.recognitionCues, ...extra.cues],
        relationships: [...lesson.relationships, ...extra.relationships],
        commonConfusions: [...lesson.commonConfusions, ...extra.confusions],
      };
    }),
  }));
}