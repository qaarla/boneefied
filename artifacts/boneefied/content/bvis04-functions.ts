import type { Bvis04QuestionCopy } from './bvis04-questions';
import { BVIS04_SOURCE, bvis04Name, bvis04PlateFor } from './bvis04-pack.ts';

type Row = [string, string[], string, string, string, string];
const rows: Row[] = [
  ['phrenic-nerve', ['phrenic-nerve','median-nerve','ulnar-nerve','radial-nerve'],
    'Which named peripheral nerve supplies the diaphragm?', '¿Qué nervio periférico proporciona inervación motora al diafragma?',
    'The phrenic nerve, chiefly C3–C5, supplies the diaphragm.', 'El nervio frénico, principalmente C3–C5, inerva el diafragma.'],
  ['median-nerve', ['median-nerve','ulnar-nerve','radial-nerve','phrenic-nerve'],
    'Which upper-limb nerve supplies most thenar muscles and the lateral two lumbricals?', '¿Qué nervio del miembro superior inerva la mayoría de los músculos tenares y los dos lumbricales laterales?',
    'The median nerve supplies most thenar muscles and the first two lumbricals; it does not supply every intrinsic hand muscle.', 'El nervio mediano inerva la mayoría de los músculos tenares y los dos primeros lumbricales; no inerva todos los músculos intrínsecos de la mano.'],
  ['ulnar-nerve', ['ulnar-nerve','median-nerve','radial-nerve','phrenic-nerve'],
    'Which nerve supplies the hand interossei used to spread and bring together the fingers?', '¿Qué nervio inerva los interóseos de la mano que separan y aproximan los dedos?',
    'The ulnar nerve supplies the palmar and dorsal interossei.', 'El nervio cubital inerva los interóseos palmares y dorsales.'],
  ['radial-nerve', ['radial-nerve','median-nerve','ulnar-nerve','phrenic-nerve'],
    'Which nerve is associated with the main wrist and finger extensor compartments?', '¿Qué nervio se asocia con los principales compartimentos extensores de la muñeca y los dedos?',
    'The radial nerve and its deep branch supply the major upper-limb extensor compartments.', 'El nervio radial y su rama profunda inervan los principales compartimentos extensores del miembro superior.'],
  ['femoral-nerve', ['femoral-nerve','sciatic-nerve','phrenic-nerve','radial-nerve'],
    'Which major nerve supplies quadriceps for knee extension?', '¿Qué nervio principal inerva el cuádriceps para extender la rodilla?',
    'The femoral nerve supplies quadriceps in the anterior thigh.', 'El nervio femoral inerva el cuádriceps del compartimento anterior del muslo.'],
  ['sciatic-nerve', ['sciatic-nerve','femoral-nerve','median-nerve','phrenic-nerve'],
    'Which large nerve runs through the posterior thigh and supplies most hamstrings?', '¿Qué nervio grande recorre el muslo posterior e inerva la mayoría de los isquiotibiales?',
    'The sciatic nerve travels in the posterior thigh; its divisions continue to the leg and foot.', 'El nervio ciático recorre el muslo posterior; sus divisiones continúan hacia la pierna y el pie.'],
  ['dorsal-root', ['dorsal-root','ventral-root','dorsal-ramus','ventral-ramus'],
    'Which root carries sensory input toward the spinal cord?', '¿Qué raíz conduce información sensitiva hacia la médula espinal?',
    'The dorsal root carries afferent input and has the dorsal root ganglion. Both rami are mixed nerves.', 'La raíz dorsal conduce aferencias y presenta el ganglio de la raíz dorsal. Ambos ramos son nervios mixtos.'],
  ['ventral-root', ['ventral-root','dorsal-root','ventral-ramus','dorsal-ramus'],
    'Which root carries motor output away from the spinal cord?', '¿Qué raíz conduce la salida motora desde la médula espinal?',
    'The ventral root carries efferent output. Dorsal and ventral roots join before the mixed spinal nerve divides into rami.', 'La raíz ventral conduce eferencias. Las raíces dorsal y ventral se unen antes de que el nervio espinal mixto se divida en ramos.'],
  ['cranial-nerve-ii', ['cranial-nerve-ii','cranial-nerve-i','cranial-nerve-viii','cranial-nerve-v'],
    'Which cranial nerve carries visual information from the retina?', '¿Qué nervio craneal conduce información visual desde la retina?',
    'Cranial nerve II is the optic nerve.', 'El nervio craneal II es el nervio óptico.'],
  ['cranial-nerve-viii', ['cranial-nerve-viii','cranial-nerve-ii','cranial-nerve-vii','cranial-nerve-x'],
    'Which cranial nerve carries hearing and balance information?', '¿Qué nervio craneal conduce información de audición y equilibrio?',
    'Cranial nerve VIII has cochlear and vestibular components.', 'El nervio craneal VIII tiene componentes coclear y vestibular.'],
  ['lens-eye', ['lens-eye','retina-eye','iris-eye','cornea-eye'],
    'Which marked transparent structure changes shape during accommodation?', '¿Qué estructura transparente señalada cambia de forma durante la acomodación?',
    'The lens changes curvature during accommodation; the cornea provides substantial fixed refraction.', 'El cristalino cambia su curvatura durante la acomodación; la córnea aporta una refracción importante y relativamente fija.'],
  ['semicircular-canals-ear', ['semicircular-canals-ear','cochlea-ear','tympanic-membrane-ear','auditory-tube-ear'],
    'Which inner-ear structures are associated with sensing rotational head movement?', '¿Qué estructuras del oído interno se asocian con la detección de rotación de la cabeza?',
    'The semicircular ducts within the canals detect angular acceleration; utricle and saccule concern linear acceleration and head position.', 'Los conductos semicirculares dentro de los canales detectan aceleración angular; el utrículo y el sáculo se relacionan con aceleración lineal y posición de la cabeza.'],
  ['eccrine-sweat-gland', ['eccrine-sweat-gland','sebaceous-gland-skin','apocrine-sweat-gland','arrector-pili-skin'],
    'Which gland opens onto the skin surface and contributes to evaporative cooling?', '¿Qué glándula desemboca en la superficie de la piel y contribuye al enfriamiento por evaporación?',
    'Eccrine sweat glands have ducts to the skin surface. Sebaceous glands release sebum, usually into hair follicles.', 'Las glándulas sudoríparas ecrinas presentan conductos hasta la superficie cutánea. Las sebáceas liberan sebo, normalmente hacia folículos pilosos.'],
  ['stratum-lucidum', ['stratum-lucidum','stratum-basale','stratum-spinosum','stratum-corneum'],
    'Which epidermal stratum is characteristic of thick skin, not ordinary thin hairy skin?', '¿Qué estrato epidérmico es característico de piel gruesa y no de piel fina con pelo?',
    'The stratum lucidum is identified in thick skin of the palms and soles.', 'El estrato lúcido se identifica en la piel gruesa de las palmas y plantas.'],
];

export const bvis04FunctionCopy: Bvis04QuestionCopy[] = rows.map(([id, options, en, es, explanation, esExplanation], i) => {
  const p = bvis04PlateFor(id);
  if (!p) throw new Error(`Missing BVIS04 function diagram for ${id}`);
  const l = p.labels.find((l) => l.structureId === id)!;
  const order = [...options.slice(i % options.length), ...options.slice(0, i % options.length)];
  return { q: {
    id: `q-bvis04-function-${id}`, moduleId: p.moduleId, structureIds: [id],
    taskType: 'function-relationship', prompt: en, assetId: p.id, answer: bvis04Name(id), acceptedAliases: [],
    options: order.map(bvis04Name), explanation, sourceId: BVIS04_SOURCE, sourcePage: null,
    examPriority: false, verificationStatus: 'verified',
    hotspots: [{ structureId: id, x: l.x, y: l.y, radius: l.radius }],
  }, esPrompt: es, esExplanation, optionIds: order };
});
