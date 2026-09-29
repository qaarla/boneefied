import { content } from '../../../content/canonical.ts';

const module = {
  title: 'Sistema esquelético',
  summary: 'Aprende los huesos, las referencias óseas, las regiones, las articulaciones y las claves de orientación que organizan el esqueleto humano.',
  system: 'Esquelético',
  category: 'Esqueleto axial y apendicular',
};

const lessons = {
  'skull-orientation': {
    title: 'Orientación del cráneo',
    summary: 'El cráneo protege el encéfalo y delimita las aberturas de la cara, las vías respiratorias y las estructuras neurovasculares. Empieza por las regiones amplias antes de memorizar los huesos más pequeños.',
    recognitionCues: [
      'Usa los huesos craneales pares como referencia para distinguir izquierda y derecha; la mandíbula es la parte móvil de la mandíbula inferior.',
      'En una vista frontal, las órbitas y la abertura nasal sirven para orientarte.',
    ],
    landmarks: [
      'El foramen magno se abre hacia abajo en el hueso occipital.',
      'El hueso cigomático forma la prominencia de la mejilla; el maxilar forma gran parte de la mandíbula superior.',
    ],
    relationships: [
      'Los huesos craneales rodean el encéfalo; los huesos faciales dan forma a la órbita, la cavidad nasal y la cavidad oral.',
    ],
    commonConfusions: [
      'No confundas el hueso cigomático con la apófisis temporal que se une a él.',
      'La mandíbula es un hueso, mientras que la articulación temporomandibular es una articulación.',
    ],
  },
  'vertebral-column': {
    title: 'Columna vertebral',
    summary: 'La columna vertebral es un soporte axial segmentado cuyas diferencias regionales ayudan a identificar las vértebras cervicales, torácicas y lumbares.',
    recognitionCues: [
      'Las vértebras cervicales están en el cuello; las torácicas se articulan con las costillas; las lumbares son las vértebras móviles más grandes.',
      'El foramen vertebral es la abertura central de una vértebra típica.',
    ],
    landmarks: [
      'Las apófisis espinosas y transversas se proyectan hacia atrás y hacia los lados; los discos intervertebrales se encuentran entre los cuerpos vertebrales.',
    ],
    relationships: [
      'La columna rodea y protege la médula espinal; el sacro transmite la carga a la cintura pélvica.',
      'El hueso osteoporótico ha perdido masa interna y soporte trabecular; un cuerpo vertebral puede comprimirse en vez de conservar su altura habitual.',
    ],
    commonConfusions: [
      'El atlas es C1 y carece de un cuerpo típico; el axis es C2 y tiene la apófisis odontoides.',
    ],
  },
  'thoracic-cage': {
    title: 'Caja torácica',
    summary: 'El esternón y las costillas forman una caja flexible que protege el corazón y los pulmones.',
    recognitionCues: [
      'El manubrio está en posición superior; la apófisis xifoides es la pequeña proyección inferior.',
      'Las costillas 1–7 son verdaderas porque se unen directamente al esternón.',
    ],
    landmarks: [
      'Las costillas falsas se unen de manera indirecta; las flotantes no se unen anteriormente al esternón.',
    ],
    relationships: [
      'Las costillas se articulan posteriormente con las vértebras torácicas y se mueven durante la respiración.',
    ],
    commonConfusions: [
      'La apófisis xifoides no es un hueso separado del esternón.',
    ],
  },
  'limb-girdles': {
    title: 'Cinturas y orientación de las extremidades',
    summary: 'Las cinturas pectoral y pélvica conectan las extremidades con el esqueleto axial, pero difieren en movilidad y soporte de carga.',
    recognitionCues: [
      'La cavidad glenoidea es poco profunda y lateral; el acetábulo es profundo y recibe la cabeza del fémur.',
      'La clavícula es un puntal anterior; la escápula se encuentra posteriormente.',
    ],
    landmarks: [
      'En posición anatómica, el ilion es superior, el isquion posteroinferior y el pubis anteroinferior.',
    ],
    relationships: [
      'La cintura pectoral prioriza la movilidad de la extremidad superior; la cintura pélvica transmite las fuerzas de la extremidad inferior a través de la articulación sacroilíaca.',
    ],
    commonConfusions: [
      'No llames ilion a toda la pelvis; el ilion es una región del hueso coxal.',
    ],
  },
  'limb-bones': {
    title: 'Extremidades superior e inferior',
    summary: 'Los huesos largos se reconocen por su posición, sus articulaciones y sus relaciones específicas de cada lado.',
    recognitionCues: [
      'En posición anatómica, el radio es lateral y está alineado con el pulgar; el cúbito es medial y está alineado con el meñique.',
      'La tibia es medial y soporta peso; el peroné es lateral y delgado.',
    ],
    landmarks: [
      'El fémur se articula proximalmente con el acetábulo y distalmente con la tibia y la rótula; el astrágalo se sitúa entre la pierna y el pie.',
    ],
    relationships: [
      'La mano y el pie contienen, respectivamente, huesos del carpo, metacarpianos y falanges, y huesos del tarso, metatarsianos y falanges.',
    ],
    commonConfusions: [
      'El radio y el cúbito se cruzan cuando el antebrazo prona; la posición anatómica es la referencia para identificar los lados.',
    ],
  },
  'skull-landmarks': {
    title: 'Referencias óseas y aberturas del cráneo',
    summary: 'Las referencias convierten una lista plana de huesos en un sistema de orientación: las apófisis se proyectan, los forámenes transmiten estructuras y las fosas alojan estructuras vecinas.',
    recognitionCues: [
      'El meato acústico externo se abre en la cara lateral del cráneo; el meato acústico interno está dentro de la base craneal.',
      'El cóndilo mandibular participa en la articulación temporomandibular; la apófisis coronoides sirve de anclaje muscular.',
    ],
    landmarks: [
      'El foramen mentoniano se abre en la parte anterior de la mandíbula; la abertura supraorbitaria está en el hueso frontal, por encima de la órbita.',
    ],
    relationships: [
      'Los cóndilos occipitales se articulan con el atlas; la silla turca alberga la región hipofisaria.',
    ],
    commonConfusions: [
      'No confundas una apófisis (proyección) con un foramen (abertura).',
    ],
  },
  'vertebral-landmarks': {
    title: 'Referencias vertebrales y costales',
    summary: 'Las vértebras regionales comparten un plan estructural, pero sus referencias explican el movimiento, la articulación con las costillas y la protección de la médula espinal.',
    recognitionCues: [
      'La apófisis odontoides se proyecta hacia arriba desde C2; los forámenes transversos son aberturas características de las vértebras cervicales.',
      'La cabeza de la costilla se articula posteriormente; el tubérculo está más lateral y se articula con una apófisis transversa.',
    ],
    landmarks: [
      'El surco costal recorre el borde interno inferior de una costilla y protege un haz neurovascular intercostal.',
    ],
    relationships: [
      'Las facetas articulares guían el movimiento vertebral; los cuerpos y discos transmiten la carga.',
    ],
    commonConfusions: [
      'La apófisis odontoides pertenece al axis, no al atlas; el tubérculo de la costilla no es su cabeza.',
    ],
  },
  'girdle-limb-landmarks': {
    title: 'Referencias de las cinturas y las extremidades',
    summary: 'Las apófisis y las superficies articulares identifican los huesos por las estructuras que reciben, anclan o conectan.',
    recognitionCues: [
      'El acromion continúa lateralmente desde la espina de la escápula; la apófisis coracoides se proyecta hacia delante.',
      'El olécranon está en la parte posterior del codo; la apófisis estiloides del radio es distal y lateral.',
    ],
    landmarks: [
      'La cabeza del húmero entra en la cavidad glenoidea; la cabeza del fémur entra en el acetábulo.',
      'El maléolo medial pertenece a la tibia; el maléolo lateral pertenece al peroné.',
    ],
    relationships: [
      'Las tuberosidades y los trocánteres son sitios de inserción; los cóndilos y las cabezas son regiones articulares.',
    ],
    commonConfusions: [
      'La EIAS es anterior y superior; la cresta ilíaca es el borde superior palpable.',
    ],
  },
  'cranial-fossae-foramina': {
    title: 'Fosas craneales y forámenes',
    summary: 'Las depresiones y aberturas de la base craneal organizan el paso de vasos y nervios.',
    recognitionCues: [
      'Las fosas se denominan anterior, media y posterior, de delante hacia atrás.',
      'Las fisuras orbitarias son aberturas en la transición entre la órbita y la base craneal.',
    ],
    landmarks: [
      'La lámina cribosa forma el techo de la cavidad nasal; el clivus desciende hacia el foramen magno.',
    ],
    relationships: [
      'Los forámenes permiten el paso de estructuras; las fosas son depresiones que sostienen o alojan estructuras vecinas.',
    ],
    commonConfusions: [
      'No consideres que toda abertura craneal sea una sutura o un seno.',
    ],
  },
  'regional-vertebrae': {
    title: 'Características vertebrales regionales',
    summary: 'Las referencias regionales distinguen las vértebras cervicales, torácicas y lumbares más allá de sus cuerpos y apófisis básicos.',
    recognitionCues: [
      'Las curvaturas cervical, torácica y lumbar alternan lordosis y cifosis.',
      'Las facetas costales torácicas reflejan la articulación con las costillas.',
    ],
    landmarks: [
      'Las apófisis mamilares y accesorias lumbares son referencias posteriores; las vértebras cervicales tienen apófisis características.',
    ],
    relationships: [
      'Las curvaturas distribuyen la carga mientras las facetas vertebrales guían el movimiento regional.',
    ],
    commonConfusions: [
      'Una curvatura vertebral no es un hueso individual; una faceta costal no es lo mismo que un foramen transverso.',
    ],
  },
  'hand-wrist-bones': {
    title: 'Huesos de la mano y la muñeca',
    summary: 'Los ocho huesos del carpo forman dos filas entre el radio y el cúbito, y los metacarpianos.',
    recognitionCues: [
      'El escafoides y el semilunar son referencias de la fila proximal; el grande es el hueso central grande de la fila distal.',
      'El ganchoso tiene un gancho palpable.',
    ],
    landmarks: [
      'Los huesos del carpo se articulan distalmente con los metacarpianos; el radio contribuye a la articulación de la muñeca.',
    ],
    relationships: [
      'La disposición del carpo permite movilidad y distribuye las cargas de la mano.',
    ],
    commonConfusions: [
      'No sustituyas los nombres de los huesos del carpo por los metacarpianos o las falanges.',
    ],
  },
  'foot-ankle-bones': {
    title: 'Huesos del pie y el tobillo',
    summary: 'Los huesos del tarso forman una plataforma estable pero adaptable desde la pierna hasta los dedos.',
    recognitionCues: [
      'El navicular y los tres cuneiformes están anteriores al astrágalo; el cuboides es lateral.',
      'La mortaja del tobillo recibe el astrágalo.',
    ],
    landmarks: [
      'La tibia y el peroné forman la mortaja del tobillo alrededor del astrágalo.',
    ],
    relationships: [
      'La geometría del tarso sostiene los arcos y transfiere el peso corporal.',
    ],
    commonConfusions: [
      'La mortaja del tobillo es una disposición articular, no un hueso independiente.',
    ],
  },
  'knee-articular-landmarks': {
    title: 'Referencias articulares de la rodilla',
    summary: 'Las superficies articulares y las crestas ayudan a orientar la rodilla y los huesos largos.',
    recognitionCues: [
      'La meseta tibial recibe los cóndilos femorales; la eminencia intercondílea se encuentra entre sus superficies.',
      'La línea áspera está en la cara posterior del fémur.',
    ],
    landmarks: [
      'Las superficies de la rodilla transmiten carga y la línea áspera sirve como referencia de orientación posterior del fémur.',
    ],
    relationships: [
      'Las referencias articulares identifican un hueso por su vecino y su posición.',
    ],
    commonConfusions: [
      'La meseta tibial no es el cóndilo femoral.',
    ],
  },
} as const;

const structures = {
  'skull': { name: 'Cráneo', category: 'Cráneo', aliases: ['cráneo'] },
  'frontal-bone': { name: 'Hueso frontal', category: 'Cráneo', aliases: [] },
  'parietal-bone': { name: 'Hueso parietal', category: 'Cráneo', aliases: [] },
  'temporal-bone': { name: 'Hueso temporal', category: 'Cráneo', aliases: [] },
  'occipital-bone': { name: 'Hueso occipital', category: 'Cráneo', aliases: [] },
  'sphenoid-bone': { name: 'Hueso esfenoides', category: 'Cráneo', aliases: [] },
  'ethmoid-bone': { name: 'Hueso etmoides', category: 'Cráneo', aliases: [] },
  'maxilla': { name: 'Maxilar', category: 'Cráneo', aliases: [] },
  'mandible': { name: 'Mandíbula', category: 'Cráneo', aliases: ['mandíbula inferior'] },
  'zygomatic-bone': { name: 'Hueso cigomático', category: 'Cráneo', aliases: ['hueso del pómulo'] },
  'nasal-bone': { name: 'Hueso nasal', category: 'Cráneo', aliases: [] },
  'lacrimal-bone': { name: 'Hueso lagrimal', category: 'Cráneo', aliases: [] },
  'palatine-bone': { name: 'Hueso palatino', category: 'Cráneo', aliases: [] },
  'vomer': { name: 'Vómer', category: 'Cráneo', aliases: [] },
  'inferior-nasal-concha': { name: 'Concha nasal inferior', category: 'Cráneo', aliases: [] },
  'coronal-suture': { name: 'Sutura coronal', category: 'Cráneo', aliases: [] },
  'sagittal-suture': { name: 'Sutura sagital', category: 'Cráneo', aliases: [] },
  'lambdoid-suture': { name: 'Sutura lambdoidea', category: 'Cráneo', aliases: [] },
  'foramen-magnum': { name: 'Foramen magno', category: 'Cráneo', aliases: [] },
  'optic-canal': { name: 'Conducto óptico', category: 'Cráneo', aliases: [] },
  'jugular-foramen': { name: 'Foramen yugular', category: 'Cráneo', aliases: [] },
  'hyoid': { name: 'Hueso hioides', category: 'Esqueleto axial', aliases: ['hioides'] },
  'atlas-c1': { name: 'Atlas (C1)', category: 'Columna vertebral', aliases: ['primera vértebra cervical'] },
  'axis-c2': { name: 'Axis (C2)', category: 'Columna vertebral', aliases: ['segunda vértebra cervical'] },
  'cervical-vertebrae': { name: 'Vértebras cervicales', category: 'Columna vertebral', aliases: ['vértebras del cuello'] },
  'thoracic-vertebrae': { name: 'Vértebras torácicas', category: 'Columna vertebral', aliases: ['vértebras del tórax'] },
  'lumbar-vertebrae': { name: 'Vértebras lumbares', category: 'Columna vertebral', aliases: ['vértebras de la región lumbar'] },
  'sacrum': { name: 'Sacro', category: 'Columna vertebral', aliases: [] },
  'coccyx': { name: 'Cóccix', category: 'Columna vertebral', aliases: ['rabadilla'] },
  'vertebral-foramen': { name: 'Foramen vertebral', category: 'Columna vertebral', aliases: [] },
  'spinous-process': { name: 'Apófisis espinosa', category: 'Columna vertebral', aliases: [] },
  'transverse-process': { name: 'Apófisis transversa', category: 'Columna vertebral', aliases: [] },
  'intervertebral-disc': { name: 'Disco intervertebral', category: 'Columna vertebral', aliases: [] },
  'sternum': { name: 'Esternón', category: 'Caja torácica', aliases: ['hueso del pecho'] },
  'manubrium': { name: 'Manubrio', category: 'Caja torácica', aliases: [] },
  'body-of-sternum': { name: 'Cuerpo del esternón', category: 'Caja torácica', aliases: [] },
  'xiphoid-process': { name: 'Apófisis xifoides', category: 'Caja torácica', aliases: [] },
  'true-ribs': { name: 'Costillas verdaderas', category: 'Caja torácica', aliases: [] },
  'false-ribs': { name: 'Costillas falsas', category: 'Caja torácica', aliases: [] },
  'floating-ribs': { name: 'Costillas flotantes', category: 'Caja torácica', aliases: [] },
  'clavicle': { name: 'Clavícula', category: 'Extremidades', aliases: ['hueso de la clavícula'] },
  'scapula': { name: 'Escápula', category: 'Extremidades', aliases: ['omóplato'] },
  'humerus': { name: 'Húmero', category: 'Extremidades', aliases: [] },
  'radius': { name: 'Radio', category: 'Extremidades', aliases: ['hueso lateral del antebrazo, del lado del pulgar'] },
  'ulna': { name: 'Cúbito', category: 'Extremidades', aliases: ['hueso medial del antebrazo, del lado del meñique'] },
  'carpals': { name: 'Huesos del carpo', category: 'Extremidades', aliases: [] },
  'metacarpals': { name: 'Metacarpianos', category: 'Extremidades', aliases: [] },
  'phalanges-hand': { name: 'Falanges de la mano', category: 'Extremidades', aliases: ['huesos de los dedos de la mano'] },
  'pelvis': { name: 'Cintura pélvica', category: 'Extremidades', aliases: [] },
  'ilium': { name: 'Ilion', category: 'Extremidades', aliases: [] },
  'ischium': { name: 'Isquion', category: 'Extremidades', aliases: [] },
  'pubis': { name: 'Pubis', category: 'Extremidades', aliases: [] },
  'femur': { name: 'Fémur', category: 'Extremidades', aliases: ['hueso del muslo'] },
  'patella': { name: 'Rótula', category: 'Extremidades', aliases: ['patela'] },
  'tibia': { name: 'Tibia', category: 'Extremidades', aliases: ['hueso de la espinilla'] },
  'fibula': { name: 'Peroné', category: 'Extremidades', aliases: ['fíbula'] },
  'tarsals': { name: 'Huesos del tarso', category: 'Extremidades', aliases: [] },
  'talus': { name: 'Astrágalo', category: 'Extremidades', aliases: [] },
  'calcaneus': { name: 'Calcáneo', category: 'Extremidades', aliases: ['hueso del talón'] },
  'metatarsals': { name: 'Metatarsianos', category: 'Extremidades', aliases: [] },
  'phalanges-foot': { name: 'Falanges del pie', category: 'Extremidades', aliases: ['huesos de los dedos del pie', 'hallux', 'dedo gordo del pie', 'dedo mayor del pie'] },
  'acetabulum': { name: 'Acetábulo', category: 'Articulaciones y referencias óseas', aliases: ['cavidad de la cadera'] },
  'glenoid-cavity': { name: 'Cavidad glenoidea', category: 'Articulaciones y referencias óseas', aliases: ['cavidad del hombro'] },
  'sacroiliac-joint': { name: 'Articulación sacroilíaca', category: 'Articulaciones y referencias óseas', aliases: [] },
  'external-acoustic-meatus': { name: 'Meato acústico externo', category: 'Referencias del cráneo', aliases: ['meato auditivo externo'] },
  'internal-acoustic-meatus': { name: 'Meato acústico interno', category: 'Referencias del cráneo', aliases: ['meato auditivo interno'] },
  'mastoid-process': { name: 'Apófisis mastoides', category: 'Referencias del cráneo', aliases: [] },
  'styloid-process': { name: 'Apófisis estiloides', category: 'Referencias del cráneo', aliases: [] },
  'mandibular-condyle': { name: 'Cóndilo mandibular', category: 'Referencias del cráneo', aliases: ['apófisis condilar'] },
  'mandibular-coronoid': { name: 'Apófisis coronoides de la mandíbula', category: 'Referencias del cráneo', aliases: ['apófisis coronoides'] },
  'mental-foramen': { name: 'Foramen mentoniano', category: 'Referencias del cráneo', aliases: [] },
  'supraorbital-foramen': { name: 'Foramen supraorbitario', category: 'Referencias del cráneo', aliases: ['escotadura supraorbitaria'] },
  'zygomatic-arch': { name: 'Arco cigomático', category: 'Referencias del cráneo', aliases: [] },
  'sella-turcica': { name: 'Silla turca', category: 'Referencias del cráneo', aliases: ['fosa hipofisaria'] },
  'occipital-condyles': { name: 'Cóndilos occipitales', category: 'Referencias del cráneo', aliases: [] },
  'dens': { name: 'Apófisis odontoides del axis', category: 'Referencias vertebrales', aliases: ['apófisis odontoides'] },
  'vertebral-body': { name: 'Cuerpo vertebral', category: 'Referencias vertebrales', aliases: ['centrum'] },
  'superior-articular-facet': { name: 'Carilla articular superior', category: 'Referencias vertebrales', aliases: [] },
  'inferior-articular-facet': { name: 'Carilla articular inferior', category: 'Referencias vertebrales', aliases: [] },
  'transverse-foramen': { name: 'Foramen transverso', category: 'Referencias vertebrales', aliases: [] },
  'rib-head': { name: 'Cabeza de la costilla', category: 'Referencias costales', aliases: [] },
  'rib-tubercle': { name: 'Tubérculo de la costilla', category: 'Referencias costales', aliases: [] },
  'costal-groove': { name: 'Surco costal', category: 'Referencias costales', aliases: [] },
  'scapular-spine': { name: 'Espina de la escápula', category: 'Referencias de la escápula', aliases: [] },
  'acromion': { name: 'Acromion', category: 'Referencias de la escápula', aliases: [] },
  'coracoid-process': { name: 'Apófisis coracoides', category: 'Referencias de la escápula', aliases: [] },
  'humeral-head': { name: 'Cabeza del húmero', category: 'Referencias del húmero', aliases: [] },
  'greater-tubercle': { name: 'Tubérculo mayor del húmero', category: 'Referencias del húmero', aliases: [] },
  'deltoid-tuberosity': { name: 'Tuberosidad deltoidea', category: 'Referencias del húmero', aliases: [] },
  'medial-epicondyle': { name: 'Epicóndilo medial del húmero', category: 'Referencias del húmero', aliases: [] },
  'lateral-epicondyle': { name: 'Epicóndilo lateral del húmero', category: 'Referencias del húmero', aliases: [] },
  'capitulum': { name: 'Capítulo del húmero', category: 'Referencias del húmero', aliases: [] },
  'trochlea': { name: 'Tróclea del húmero', category: 'Referencias del húmero', aliases: [] },
  'radial-head': { name: 'Cabeza del radio', category: 'Referencias del radio', aliases: [] },
  'radial-styloid': { name: 'Apófisis estiloides del radio', category: 'Referencias del radio', aliases: [] },
  'olecranon': { name: 'Olécranon', category: 'Referencias del cúbito', aliases: [] },
  'trochlear-notch': { name: 'Escotadura troclear', category: 'Referencias del cúbito', aliases: [] },
  'iliac-crest': { name: 'Cresta ilíaca', category: 'Referencias pélvicas', aliases: [] },
  'asis': { name: 'Espina ilíaca anterosuperior', category: 'Referencias pélvicas', aliases: ['EIAS'] },
  'ischial-tuberosity': { name: 'Tuberosidad isquiática', category: 'Referencias pélvicas', aliases: ['hueso para sentarse'] },
  'obturator-foramen': { name: 'Foramen obturador', category: 'Referencias pélvicas', aliases: [] },
  'femoral-head': { name: 'Cabeza del fémur', category: 'Referencias del fémur', aliases: [] },
  'femoral-neck': { name: 'Cuello del fémur', category: 'Referencias del fémur', aliases: [] },
  'greater-trochanter': { name: 'Trocánter mayor', category: 'Referencias del fémur', aliases: [] },
  'femoral-condyles': { name: 'Cóndilos del fémur', category: 'Referencias del fémur', aliases: [] },
  'tibial-tuberosity': { name: 'Tuberosidad tibial', category: 'Referencias de la tibia', aliases: [] },
  'medial-malleolus': { name: 'Maléolo medial', category: 'Referencias de la tibia', aliases: [] },
  'lateral-malleolus': { name: 'Maléolo lateral', category: 'Referencias del peroné', aliases: [] },
  'anterior-cranial-fossa': { name: 'Fosa craneal anterior', category: 'Fosas craneales', aliases: [] },
  'middle-cranial-fossa': { name: 'Fosa craneal media', category: 'Fosas craneales', aliases: [] },
  'posterior-cranial-fossa': { name: 'Fosa craneal posterior', category: 'Fosas craneales', aliases: [] },
  'cribriform-plate': { name: 'Lámina cribosa', category: 'Referencias del etmoides', aliases: [] },
  'crista-galli': { name: 'Crista galli', category: 'Referencias del etmoides', aliases: [] },
  'superior-orbital-fissure': { name: 'Fisura orbitaria superior', category: 'Forámenes y fisuras del cráneo', aliases: [] },
  'inferior-orbital-fissure': { name: 'Fisura orbitaria inferior', category: 'Forámenes y fisuras del cráneo', aliases: [] },
  'foramen-ovale': { name: 'Foramen oval', category: 'Forámenes y fisuras del cráneo', aliases: [] },
  'foramen-rotundum': { name: 'Foramen redondo', category: 'Forámenes y fisuras del cráneo', aliases: [] },
  'foramen-spinosum': { name: 'Foramen espinoso', category: 'Forámenes y fisuras del cráneo', aliases: [] },
  'carotid-canal': { name: 'Conducto carotídeo', category: 'Forámenes y fisuras del cráneo', aliases: [] },
  'hypoglossal-canal': { name: 'Conducto del hipogloso', category: 'Forámenes y fisuras del cráneo', aliases: [] },
  'stylomastoid-foramen': { name: 'Foramen estilomastoideo', category: 'Forámenes y fisuras del cráneo', aliases: [] },
  'incisive-foramen': { name: 'Foramen incisivo', category: 'Forámenes y fisuras del cráneo', aliases: [] },
  'greater-palatin-foramen': { name: 'Foramen palatino mayor', category: 'Forámenes y fisuras del cráneo', aliases: [] },
  'uncinate-process': { name: 'Apófisis unciforme del etmoides', category: 'Referencias del etmoides', aliases: [] },
  'pterygoid-process': { name: 'Apófisis pterigoides', category: 'Referencias del esfenoides', aliases: [] },
  'clivus': { name: 'Clivus', category: 'Base del cráneo', aliases: [] },
  'internal-occipital-crest': { name: 'Cresta occipital interna', category: 'Referencias del occipital', aliases: [] },
  'cervical-lordosis': { name: 'Lordosis cervical', category: 'Regiones vertebrales', aliases: [] },
  'thoracic-kyphosis': { name: 'Cifosis torácica', category: 'Regiones vertebrales', aliases: [] },
  'lumbar-lordosis': { name: 'Lordosis lumbar', category: 'Regiones vertebrales', aliases: [] },
  'uncinate-process-vertebra': { name: 'Apófisis unciforme de la vértebra cervical', category: 'Referencias cervicales', aliases: [] },
  'superior-costal-facet': { name: 'Carilla costal superior', category: 'Referencias torácicas', aliases: [] },
  'inferior-costal-facet': { name: 'Carilla costal inferior', category: 'Referencias torácicas', aliases: [] },
  'mammillary-process': { name: 'Apófisis mamilar', category: 'Referencias lumbares', aliases: [] },
  'accessory-process': { name: 'Apófisis accesoria', category: 'Referencias lumbares', aliases: [] },
  'scaphoid': { name: 'Escafoides', category: 'Huesos del carpo', aliases: [] },
  'lunate': { name: 'Semilunar', category: 'Huesos del carpo', aliases: [] },
  'triquetrum': { name: 'Piramidal', category: 'Huesos del carpo', aliases: [] },
  'pisiform': { name: 'Pisiforme', category: 'Huesos del carpo', aliases: [] },
  'trapezium': { name: 'Trapecio', category: 'Huesos del carpo', aliases: [] },
  'trapezoid': { name: 'Trapezoide', category: 'Huesos del carpo', aliases: [] },
  'capitate': { name: 'Hueso grande', category: 'Huesos del carpo', aliases: [] },
  'hamate': { name: 'Ganchoso', category: 'Huesos del carpo', aliases: ['unciforme'] },
  'hook-of-hamate': { name: 'Gancho del ganchoso', category: 'Referencias del carpo', aliases: [] },
  'navicular': { name: 'Navicular', category: 'Huesos del tarso', aliases: [] },
  'medial-cuneiform': { name: 'Cuneiforme medial', category: 'Huesos del tarso', aliases: [] },
  'intermediate-cuneiform': { name: 'Cuneiforme intermedio', category: 'Huesos del tarso', aliases: [] },
  'lateral-cuneiform': { name: 'Cuneiforme lateral', category: 'Huesos del tarso', aliases: [] },
  'cuboid': { name: 'Cuboides', category: 'Huesos del tarso', aliases: [] },
  'ankle-mortise': { name: 'Mortaja del tobillo', category: 'Referencias articulares', aliases: [] },
  'tibial-plateau': { name: 'Meseta tibial', category: 'Referencias articulares', aliases: [] },
  'intercondylar-eminence': { name: 'Eminencia intercondílea', category: 'Referencias articulares', aliases: [] },
  'radial-tuberosity': { name: 'Tuberosidad radial', category: 'Referencias del radio', aliases: [] },
  'ulnar-styloid': { name: 'Apófisis estiloides del cúbito', category: 'Referencias del cúbito', aliases: [] },
  'femoral-linea-aspera': { name: 'Línea áspera', category: 'Referencias del fémur', aliases: [] },
} as const;

const questionTexts: Record<string, { prompt: string; explanation: string }> = {
  'q-skeleton-radius': { prompt: '¿Qué hueso del antebrazo está del lado del pulgar en posición anatómica?', explanation: 'En posición anatómica, el radio es lateral y está alineado con el pulgar.' },
  'q-skeleton-tibia': { prompt: '¿Qué hueso es medial y soporta el peso en la pierna?', explanation: 'La tibia es medial y soporta la mayor parte del peso de la pierna; el peroné es lateral y delgado.' },
  'q-skeleton-vertebrae': { prompt: 'Ordena estas regiones vertebrales de superior a inferior.', explanation: 'La columna vertebral va de las vértebras cervicales del cuello a las torácicas del tórax y después a las lumbares de la región inferior de la espalda.' },
  'q-skeleton-skull': { prompt: '¿Qué abertura grande del hueso occipital permite el paso de la médula espinal?', explanation: 'El foramen magno es la gran abertura inferior del hueso occipital.' },
  'q-skeleton-skull-landmark': { prompt: '¿Qué referencia mandibular participa en la articulación temporomandibular?', explanation: 'El cóndilo mandibular se articula con el hueso temporal en la articulación temporomandibular.' },
  'q-skeleton-cervical-landmark': { prompt: '¿Qué referencia se proyecta superiormente desde el axis (C2)?', explanation: 'La apófisis odontoides es la proyección con forma de diente de C2 y ayuda a la rotación del atlas.' },
  'q-skeleton-rib-landmark': { prompt: '¿Qué referencia de una costilla se articula con una apófisis transversa?', explanation: 'El tubérculo de la costilla se articula con la apófisis transversa de una vértebra torácica.' },
  'q-skeleton-shoulder-landmark': { prompt: '¿Qué apófisis escapular continúa lateralmente desde la espina de la escápula?', explanation: 'El acromion es la continuación lateral de la espina de la escápula.' },
  'q-skeleton-humerus-landmark': { prompt: '¿Qué superficie proximal del húmero entra en la cavidad glenoidea?', explanation: 'La cabeza redondeada del húmero se articula con la cavidad glenoidea en el hombro.' },
  'q-skeleton-forearm-landmark': { prompt: '¿Qué referencia distal del antebrazo está del lado del pulgar?', explanation: 'En posición anatómica, el radio es lateral y termina distalmente en la apófisis estiloides radial.' },
  'q-skeleton-pelvis-landmark': { prompt: '¿Qué referencia pélvica forma el borde superior palpable?', explanation: 'La cresta ilíaca forma el borde superior del ilion.' },
  'q-skeleton-leg-landmark': { prompt: '¿Qué prominencia del tobillo pertenece al peroné?', explanation: 'El peroné forma el maléolo lateral; la tibia forma el maléolo medial.' },
  'q-skull-foramen-ovale': { prompt: '¿Qué abertura del esfenoides recibe su nombre por su forma ovalada?', explanation: 'El foramen oval es una abertura oval del esfenoides.' },
  'q-skull-fossa-posterior': { prompt: '¿Qué fosa craneal sostiene el cerebelo?', explanation: 'La fosa craneal posterior aloja el cerebelo y el tronco encefálico.' },
  'q-vertebra-costal': { prompt: '¿Qué referencia de una vértebra regional indica su articulación con las costillas?', explanation: 'Las vértebras torácicas tienen facetas costales para las costillas.' },
  'q-carpal-central': { prompt: '¿Qué hueso del carpo es el hueso central grande de la fila distal?', explanation: 'El hueso grande ocupa una posición central en la fila distal del carpo.' },
  'q-carpal-hook': { prompt: '¿Qué referencia del carpo es un gancho palpable?', explanation: 'El ganchoso tiene un gancho que se proyecta hacia la palma.' },
  'q-foot-mortise': { prompt: '¿Qué estructura recibe al astrágalo en el tobillo?', explanation: 'La tibia y el peroné forman la mortaja del tobillo alrededor del astrágalo.' },
  'q-radial-tuberosity': { prompt: '¿Qué referencia del radio sirve de zona de inserción cerca de su extremo proximal?', explanation: 'La tuberosidad radial es una referencia de inserción en la región proximal del radio.' },
  'q-femur-linea-aspera': { prompt: '¿Qué referencia recorre la cara posterior del cuerpo del fémur?', explanation: 'La línea áspera es una cresta en la cara posterior del cuerpo femoral.' },
  'q-depth-skeletal-skull-regions': { prompt: 'Selecciona los huesos clasificados como craneales y no como faciales.', explanation: 'Los huesos frontal, parietales, temporales, occipital, esfenoides y etmoides forman el neurocráneo; el maxilar y el vómer son huesos faciales.' },
  'q-depth-skeletal-skull-facial-group': { prompt: '¿Qué estructuras pertenecen al esqueleto facial?', explanation: 'Estos huesos dan forma a la órbita, la cavidad nasal y la cara; el parietal es un hueso craneal.' },
  'q-depth-skeletal-skull-sutures-order': { prompt: 'Ordena estas suturas de anterior a posterior a lo largo de la bóveda craneal.', explanation: 'La sutura coronal separa anteriormente los huesos frontal y parietales; la sagital discurre entre los parietales; la lambdoidea limita posteriormente con el occipital.' },
  'q-depth-skeletal-suture-confusion': { prompt: '¿Qué relación distingue correctamente la sutura sagital de la coronal?', explanation: 'La sutura sagital está en la línea media entre los huesos parietales; la coronal separa el frontal de los parietales.' },
  'q-depth-skeletal-orbital-fissures': { prompt: '¿Qué abertura es el conducto estrecho relacionado con el nervio óptico, y no una fisura orbitaria?', explanation: 'El conducto óptico es distinto de las fisuras orbitarias superior e inferior y transmite el nervio óptico.' },
  'q-depth-skeletal-cranial-openings': { prompt: 'Selecciona las aberturas situadas en la base del cráneo.', explanation: 'Estas aberturas se encuentran en regiones del esfenoides, el temporal o el occipital; los forámenes mentoniano y obturador están en otros lugares.' },
  'q-depth-skeletal-foramen-round-spiny': { prompt: '¿Qué abertura recibe su nombre por ser redonda, a diferencia de la abertura espinosa cercana?', explanation: 'Rotundum significa redondo; el foramen espinoso es la abertura vecina cuyo nombre alude a su borde relacionado con una espina.' },
  'q-depth-skeletal-carotid-hypoglossal': { prompt: '¿Qué asociación relaciona mejor los dos conductos de la base del cráneo?', explanation: 'Sus nombres y relaciones en la base del cráneo distinguen el conducto carotídeo del conducto del hipogloso.' },
  'q-depth-skeletal-temporal-openings': { prompt: '¿Qué estructuras son aberturas o conductos relacionados con el hueso temporal?', explanation: 'El foramen estilomastoideo y los meatos acústicos son referencias del hueso temporal; el foramen mentoniano pertenece a la mandíbula.' },
  'q-depth-skeletal-palatal-openings': { prompt: '¿Qué relación ubica correctamente los forámenes palatinos?', explanation: 'El foramen incisivo está cerca de la parte anterior del paladar duro; el foramen palatino mayor está más posterior y lateral.' },
  'q-depth-skeletal-ethmoid-landmarks': { prompt: 'Selecciona las referencias que pertenecen al hueso etmoides.', explanation: 'La lámina cribosa, la crista galli y la apófisis unciforme etmoidal son referencias del etmoides; la apófisis pterigoides pertenece al esfenoides y el clivus, a la base del cráneo.' },
  'q-depth-skeletal-cribriform-recognition': { prompt: '¿Qué relación identifica mejor la lámina cribosa y la crista galli?', explanation: 'Estas dos referencias del etmoides se reconocen por la proyección de la crista galli y porque la lámina forma el techo de la cavidad nasal.' },
  'q-depth-skeletal-sphenoid-landmarks': { prompt: '¿Qué estructuras están relacionadas con el hueso esfenoides?', explanation: 'El esfenoides tiene las apófisis pterigoides, la silla turca y los tres forámenes con nombre propio; la apófisis mastoides pertenece al temporal.' },
  'q-depth-skeletal-clivus-location': { prompt: '¿Qué referencia de la base del cráneo desciende hacia el foramen magno?', explanation: 'El clivus es la región inclinada de la base craneal, anterior al foramen magno.' },
  'q-depth-skeletal-occipital-internal': { prompt: '¿Qué referencia es una cresta interna del occipital relacionada con el foramen magno?', explanation: 'La cresta occipital interna es una referencia del occipital situada en la superficie interna del cráneo, cerca del foramen magno.' },
  'q-depth-skeletal-fossa-order': { prompt: 'Ordena las fosas craneales de anterior a posterior.', explanation: 'Las tres depresiones se suceden de anterior a media y a posterior a lo largo de la base craneal.' },
  'q-depth-skeletal-fossa-cues': { prompt: 'Selecciona las afirmaciones que usan correctamente la posición de las fosas craneales como clave de reconocimiento.', explanation: 'Los nombres indican sus posiciones relativas en la base del cráneo; el foramen magno está en la región occipital.' },
  'q-depth-skeletal-cervical-curves': { prompt: 'Ordena estas curvaturas de la columna de superior a inferior.', explanation: 'La curvatura cervical está en el cuello, la torácica en el tórax y la lumbar en la región inferior de la espalda.' },
  'q-depth-skeletal-curve-confusion': { prompt: '¿Qué curvatura corresponde a la región torácica cifótica y no a una región cervical o lumbar lordótica?', explanation: 'La cifosis torácica es la curvatura torácica convexa posteriormente; las curvaturas cervical y lumbar son lordóticas.' },
  'q-depth-skeletal-cervical-uncinate': { prompt: '¿Qué referencia con nombre propio se proyecta desde el borde superolateral del cuerpo de una vértebra cervical?', explanation: 'La apófisis unciforme de una vértebra cervical sirve como referencia regional, a diferencia de las facetas costales torácicas o las apófisis mamilares lumbares.' },
  'q-depth-skeletal-thoracic-facets': { prompt: '¿Qué referencias indican que una vértebra pertenece a la región torácica?', explanation: 'Las vértebras torácicas tienen facetas costales para articularse con las costillas; los forámenes transversos son cervicales y las apófisis mamilares son referencias lumbares.' },
  'q-depth-skeletal-lumbar-processes': { prompt: '¿Qué relación es una clave útil para reconocer una vértebra lumbar?', explanation: 'Las apófisis mamilares y accesorias son referencias posteriores de las vértebras lumbares.' },
  'q-depth-skeletal-carpal-proximal-row': { prompt: 'Ordena la fila proximal del carpo de lateral (lado del pulgar) a medial (lado del meñique).', explanation: 'De lateral a medial, la fila proximal está formada por el escafoides, el semilunar, el piramidal y el pisiforme.' },
  'q-depth-skeletal-carpal-distal-row': { prompt: 'Ordena la fila distal del carpo de lateral a medial.', explanation: 'De lado del pulgar a lado del meñique, la fila distal está formada por el trapecio, el trapezoide, el hueso grande y el ganchoso.' },
  'q-depth-skeletal-carpal-row-cues': { prompt: 'Selecciona los huesos que pertenecen a la fila proximal del carpo.', explanation: 'El escafoides, el semilunar, el piramidal y el pisiforme forman la fila proximal; el trapecio y el hueso grande están en la fila distal.' },
  'q-depth-skeletal-carpal-thumb': { prompt: '¿Qué hueso del carpo está del lado del pulgar en la fila distal y sostiene el primer metacarpiano?', explanation: 'El trapecio es el hueso lateral de la fila distal del carpo, del lado del pulgar.' },
  'q-depth-skeletal-carpal-central-cues': { prompt: '¿Qué afirmación distingue mejor al hueso grande del escafoides y el semilunar?', explanation: 'La fila y la posición son claves fiables: el hueso grande es central en la fila distal, mientras que el escafoides y el semilunar son proximales.' },
  'q-depth-skeletal-hamate-hook': { prompt: '¿Qué relación identifica el gancho del ganchoso?', explanation: 'El gancho es una referencia palmar palpable que pertenece al hueso ganchoso del carpo.' },
  'q-depth-skeletal-tarsal-group': { prompt: 'Selecciona los huesos del tarso situados anteriores al astrágalo en la región media del pie.', explanation: 'El navicular, los tres cuneiformes y el cuboides ocupan la región media del pie, anteriores al astrágalo; el escafoides pertenece al carpo.' },
  'q-depth-skeletal-tarsal-medial-order': { prompt: 'Ordena los tres cuneiformes de medial a lateral e identifica su vecino proximal.', explanation: 'El navicular es proximal a los tres cuneiformes; estos se disponen lado a lado en orden medial, intermedio y lateral, no en una fila proximal-distal.' },
  'q-depth-skeletal-cuboid-lateral': { prompt: '¿Qué hueso del tarso es la contraparte lateral de la región media del pie frente al grupo más medial de navicular y cuneiformes?', explanation: 'El cuboides es el hueso lateral de la región media del pie; el navicular y los cuneiformes ocupan la vía más medial y central.' },
  'q-depth-skeletal-ankle-bones': { prompt: '¿Qué relación describe correctamente la mortaja del tobillo?', explanation: 'La tibia y el peroné distales flanquean el astrágalo y forman la mortaja del tobillo.' },
  'q-depth-skeletal-tibial-plateau': { prompt: '¿Qué superficie recibe los cóndilos femorales en la rodilla?', explanation: 'La meseta tibial es la región articular proximal de la tibia que recibe los cóndilos femorales.' },
  'q-depth-skeletal-intercondylar-eminence': { prompt: '¿Dónde se encuentra la eminencia intercondílea?', explanation: 'La eminencia intercondílea se eleva entre las regiones medial y lateral de la meseta tibial.' },
  'q-depth-skeletal-radius-landmarks-new': { prompt: 'Ordena estas referencias del radio de proximal a distal.', explanation: 'La cabeza del radio es proximal, la tuberosidad está cerca de la porción proximal del cuerpo y la apófisis estiloides es distal.' },
  'q-depth-skeletal-ulnar-styloid-side': { prompt: '¿Qué referencia distal del antebrazo pertenece al hueso medial, del lado del meñique?', explanation: 'En posición anatómica, el cúbito es medial y termina distalmente en la apófisis estiloides cubital.' },
  'q-depth-skeletal-axial-vertebral-group': { prompt: 'Ordena estas estructuras axiales de superior a inferior.', explanation: 'C1 y C2 son vértebras cervicales superiores; el sacro y el cóccix son las regiones terminales inferiores de la columna.' },
  'q-depth-skeletal-thoracic-cage-groups': { prompt: 'Selecciona los grupos de costillas clasificados según su patrón de inserción anterior.', explanation: 'Los nombres distinguen las costillas por su inserción esternal anterior directa, indirecta o ausente.' },
  'q-depth-skeletal-sternum-order': { prompt: 'Ordena las partes del esternón de superior a inferior.', explanation: 'El manubrio es superior, el cuerpo ocupa la parte central y la apófisis xifoides es inferior.' },
  'q-depth-skeletal-pelvic-regions': { prompt: 'Selecciona las tres regiones que se unen para formar el hueso coxal alrededor del acetábulo.', explanation: 'El ilion, el isquion y el pubis contribuyen al hueso coxal y se unen en el acetábulo; el sacro y el fémur son huesos vecinos.' },
  'q-depth-skeletal-shoulder-girdle': { prompt: '¿Qué relación describe correctamente la cintura pectoral?', explanation: 'La clavícula y la escápula forman la cintura pectoral; la cavidad glenoidea es su cavidad lateral del hombro.' },
  'q-depth-skeletal-lower-limb-recognition': { prompt: 'Selecciona los huesos de la extremidad inferior entre la cintura pélvica y el tobillo.', explanation: 'El fémur, la rótula, la tibia y el peroné forman las regiones del muslo, la rodilla y la pierna; el húmero y el radio pertenecen a la extremidad superior.' },
  'q-depth-skeletal-foot-sequence': { prompt: 'Ordena estas estructuras del pie de proximal a distal.', explanation: 'El astrágalo es proximal; le sigue el navicular en la región del tarso y después los metatarsianos y las falanges de los dedos.' },
  'q-depth-skeletal-hand-sequence': { prompt: 'Ordena estas regiones de la mano de proximal a distal.', explanation: 'Los huesos del carpo forman la muñeca, los metacarpianos la palma y las falanges los dedos.' },
  'q-depth-skeletal-skull-orientation': { prompt: '¿Qué hueso facial es la mandíbula inferior móvil, en vez de un hueso fijo de la mandíbula superior o de la mejilla?', explanation: 'La mandíbula es la mandíbula inferior móvil; el maxilar y los huesos cigomático y nasal son huesos faciales fijos.' },
  'q-depth-skeletal-hyoid-region': { prompt: '¿Qué estructura es un hueso aislado del cuello que no se articula directamente con otro hueso?', explanation: 'El hueso hioides está suspendido por músculos y ligamentos en el cuello, en vez de formar una articulación ósea directa.' },
  'q-depth-skeletal-vertebral-landmark-group': { prompt: 'Selecciona las referencias típicas de una vértebra individual.', explanation: 'Una vértebra típica tiene un cuerpo, un foramen vertebral central y apófisis espinosa y transversas proyectadas.' },
  'q-depth-skeletal-rib-landmark-order': { prompt: 'Ordena estas referencias costales desde la articulación posterior y proximal hasta la referencia del borde inferior.', explanation: 'La cabeza de la costilla está en su extremo vertebral posterior; el tubérculo está lateral a ella y el surco costal recorre el borde interno inferior.' },
  'q-depth-skeletal-scapular-landmarks': { prompt: 'Selecciona las estructuras que son referencias de la escápula.', explanation: 'La espina, el acromion, la apófisis coracoides y la cavidad glenoidea pertenecen a la escápula; el acetábulo está en la pelvis.' },
  'q-depth-skeletal-humerus-landmark-group': { prompt: 'Selecciona las referencias que pertenecen al húmero.', explanation: 'La cabeza, el tubérculo, la tuberosidad, el capítulo y la tróclea indicados son referencias del húmero; la tuberosidad radial pertenece al radio.' },
  'q-depth-skeletal-elbow-landmarks': { prompt: '¿Qué relación distingue correctamente las referencias articulares del codo?', explanation: 'El capítulo del húmero es la superficie lateral para la cabeza del radio; la tróclea humeral es la superficie en forma de polea para el cúbito.' },
  'q-depth-skeletal-pelvis-landmark-group': { prompt: 'Selecciona las referencias que se encuentran en el hueso coxal.', explanation: 'La cresta, la espina ilíaca anterosuperior, la tuberosidad isquiática y el foramen obturador son referencias pélvicas; el trocánter mayor pertenece al fémur.' },
  'q-depth-skeletal-hip-landmarks': { prompt: '¿Qué relación identifica la articulación de la cadera?', explanation: 'La cabeza femoral es proximal al cuello y se articula con el acetábulo; el trocánter mayor se proyecta lateralmente.' },
  'q-depth-skeletal-leg-landmarks-group': { prompt: 'Selecciona las asociaciones correctas entre huesos y referencias de la pierna.', explanation: 'La tibia tiene la tuberosidad tibial y el maléolo medial; el peroné forma el maléolo lateral.' },
  'q-depth-skeletal-bone-orientation-upper': { prompt: 'En posición anatómica, ¿qué asociación ubica correctamente cada hueso del antebrazo y su apófisis estiloides distal?', explanation: 'En posición anatómica, el radio es lateral y está del lado del pulgar; el cúbito es medial y está del lado del meñique.' },
  'q-depth-skeletal-axial-articulations': { prompt: '¿Qué relación distingue las dos articulaciones cervicales superiores?', explanation: 'Los cóndilos occipitales se unen a C1; la apófisis odontoides de C2 sirve de pivote para la rotación atlantoaxial.' },
  'q-depth-skeletal-foramen-location-cues': { prompt: 'Selecciona las asociaciones correctas entre aberturas y regiones.', explanation: 'Estas aberturas se reconocen por su región: mandíbula, hueso frontal, hueso coxal y hueso occipital, respectivamente.' },
  'q-depth-skeletal-articulation-sockets': { prompt: 'Selecciona las asociaciones correctas entre cavidades articulares y cabezas óseas.', explanation: 'La cavidad glenoidea recibe la cabeza humeral en el hombro; el acetábulo recibe la cabeza femoral en la cadera.' },
  'q-depth-skeletal-bone-region-confusions': { prompt: '¿Qué asociación distingue correctamente la muñeca y la mano del tobillo y el pie?', explanation: 'Los huesos del carpo ocupan la muñeca y los del tarso, el tobillo y el pie; los metacarpianos forman la palma y los metatarsianos, la parte media del pie.' },
  'q-depth-skeletal-typed-ethmoid-ridge': { prompt: '¿Qué proyección del etmoides se eleva superiormente desde la lámina cribosa?', explanation: 'La crista galli es la proyección medial del etmoides relacionada con la lámina cribosa.' },
  'q-depth-skeletal-typed-foot-bone': { prompt: '¿Qué hueso del tarso está inmediatamente anterior al astrágalo y proximal a los cuneiformes?', explanation: 'El navicular ocupa esta posición proximal de la parte media del pie, entre el astrágalo y los cuneiformes.' },
  'q-depth-skeletal-typed-ulnar-landmark': { prompt: '¿Qué referencia distal nombra la proyección del cúbito del lado del meñique?', explanation: 'La apófisis estiloides cubital es la proyección distal del cúbito en su lado medial, en posición anatómica.' },
  'q-depth-skeletal-typed-sphenoid-process': { prompt: '¿Qué apófisis del esfenoides se proyecta inferiormente y contribuye a la región de inserción pterigoidea?', explanation: 'La apófisis pterigoides es una proyección inferior par del esfenoides.' },
  'q-depth-skeletal-typed-cervical-landmark': { prompt: '¿Qué referencia de una vértebra cervical se proyecta desde el borde superolateral de su cuerpo?', explanation: 'La apófisis unciforme de una vértebra cervical es una referencia para reconocer la región.' },
  'q-depth-skeletal-axial-appendicular': { prompt: 'Selecciona las estructuras que pertenecen al esqueleto axial o a su caja torácica, no a las cinturas apendiculares.', explanation: 'El cráneo, la columna vertebral (representada aquí por C1) y el esternón son axiales; la clavícula y la cintura pélvica son apendiculares.' },
  'q-depth-skeletal-appendicular-groups': { prompt: 'Selecciona las estructuras apendiculares de este grupo mixto.', explanation: 'Las cinturas y los huesos de las extremidades son apendiculares; el esternón forma parte de la caja torácica axial.' },
  'q-bac04-bone-loss': { prompt: 'Un cuerpo vertebral pierde masa ósea interna y se comprime. ¿Qué característica estructural normal ha cambiado?', explanation: 'La reducción del soporte óseo interno puede hacer que un cuerpo vertebral pierda altura; esto compara estructuras y no constituye un diagnóstico a partir de una imagen.' },
};

const practicalQuestionText: Record<string, { prompt: string; explanation: string }> = {};
for (const question of content.questions.filter((item) => item.moduleId === 'skeletal-system' && item.id.startsWith('q-practical-'))) {
  if (question.id === 'q-practical-pelvis-acetabulum') {
    practicalQuestionText[question.id] = {
      prompt: 'Toca el acetábulo.',
      explanation: 'El acetábulo es la cavidad lateral que recibe la cabeza del fémur.',
    };
  } else if (question.id === 'q-practical-pelvis-ischium') {
    practicalQuestionText[question.id] = {
      prompt: 'Toca el isquion.',
      explanation: 'El isquion forma la porción posteroinferior del hueso coxal.',
    };
  } else {
    const axial = question.id.startsWith('q-practical-axial-');
    const region = axial ? 'esqueleto axial' : 'esqueleto apendicular';
    const cue = axial ? 'por su posición' : 'por su posición y orientación';
    const target = structures[String(question.answer) as keyof typeof structures]?.name ?? String(question.answer);
    practicalQuestionText[question.id] = {
      prompt: `Toca la estructura que representa «${target}» en esta vista anterior del ${region}.`,
      explanation: `La estructura señalada se identifica ${cue} en el ${region} resaltado.`,
    };
  }
}

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const aliasTranslations: Record<string, string> = {
  cranium: 'cráneo',
  'lower jaw': 'mandíbula inferior',
  cheekbone: 'hueso del pómulo',
  hyoid: 'hioides',
  'first cervical vertebra': 'primera vértebra cervical',
  'second cervical vertebra': 'segunda vértebra cervical',
  'neck vertebrae': 'vértebras del cuello',
  'chest vertebrae': 'vértebras del tórax',
  'lower back vertebrae': 'vértebras de la región lumbar',
  tailbone: 'cóccix',
  breastbone: 'esternón',
  collarbone: 'clavícula',
  'shoulder blade': 'omóplato',
  'thumb side forearm bone': 'hueso del antebrazo del lado del pulgar',
  'pinky side forearm bone': 'hueso del antebrazo del lado del meñique',
  'finger bones': 'huesos de los dedos de la mano',
  'thigh bone': 'hueso del muslo',
  kneecap: 'rótula',
  'shin bone': 'hueso de la espinilla',
  'lateral leg bone': 'hueso lateral de la pierna',
  'heel bone': 'hueso del talón',
  'toe bones': 'huesos de los dedos del pie',
  hallux: 'hallux',
  'great toe': 'dedo gordo del pie',
  'big toe': 'dedo mayor del pie',
  'hip socket': 'cavidad de la cadera',
  'shoulder socket': 'cavidad del hombro',
  'external auditory meatus': 'meato auditivo externo',
  'internal auditory meatus': 'meato auditivo interno',
  'condylar process': 'apófisis condilar',
  'coronoid process': 'apófisis coronoides',
  'supraorbital notch': 'escotadura supraorbitaria',
  'hypophyseal fossa': 'fosa hipofisaria',
  'odontoid process': 'apófisis odontoides',
  centrum: 'cuerpo vertebral',
  asis: 'EIAS',
  'sit bone': 'hueso para sentarse',
  unciform: 'unciforme',
  'acromion process': 'apófisis acromial',
  'humeral head': 'cabeza del húmero',
  'radial styloid': 'apófisis estiloides radial',
  'rib tubercle': 'tubérculo de la costilla',
};
const termTranslations = new Map<string, string>();
for (const [id, structure] of Object.entries(structures)) {
  termTranslations.set(normalize(id), structure.name);
  termTranslations.set(normalize(structure.name), structure.name);
  for (const alias of structure.aliases) termTranslations.set(normalize(alias), alias);
}
for (const structure of content.structures.filter((item) => item.moduleId === 'skeletal-system')) {
  const translated = structures[structure.id as keyof typeof structures];
  if (translated) {
    termTranslations.set(normalize(structure.canonicalName), translated.name);
    for (const [index, alias] of structure.acceptedAliases.entries()) {
      termTranslations.set(normalize(alias), aliasTranslations[normalize(alias)] ?? translated.aliases[index] ?? translated.name);
    }
  }
}
for (const [alias, translation] of Object.entries(aliasTranslations)) {
  termTranslations.set(normalize(alias), translation);
}

const phraseTranslations: Record<string, string> = {
  'acetabulum—head of femur': 'Acetábulo—cabeza del fémur',
  'acetabulum—head of humerus': 'Acetábulo—cabeza del húmero',
  'all three are metacarpals': 'Los tres son metacarpianos',
  'anterior cranial fossa is most anterior': 'La fosa craneal anterior es la más anterior',
  'at the distal radius': 'En el extremo distal del radio',
  'atlas is the second cervical vertebra with the dens': 'El atlas es la segunda vértebra cervical y tiene la apófisis odontoides',
  'between the articular regions of the tibial plateau': 'Entre las regiones articulares de la meseta tibial',
  'both are located in the temporal bone': 'Ambos están en el hueso temporal',
  'both are parts of the femur': 'Ambos forman parte del fémur',
  'both are sutures of the cranial vault': 'Ambas son suturas de la bóveda craneal',
  'both bones lie on the thumb side': 'Ambos huesos están del lado del pulgar',
  'both epicondyles are articular surfaces for the wrist': 'Ambos epicóndilos son superficies articulares para la muñeca',
  'both foramina are in the mandible': 'Ambos forámenes están en la mandíbula',
  'both form the orbit': 'Ambos forman la órbita',
  'both styloids belong to the radius': 'Ambas apófisis estiloides pertenecen al radio',
  'calcaneus forms a mortise around the tibia': 'El calcáneo forma una mortaja alrededor de la tibia',
  'capitate is a distal-row central carpal, whereas scaphoid and lunate are proximal-row carpals': 'El hueso grande es central en la fila distal del carpo, mientras que el escafoides y el semilunar están en la fila proximal',
  'capitate is a tarsal and scaphoid is a femur landmark': 'El hueso grande es del tarso y el escafoides es una referencia del fémur',
  'capitulum': 'Capítulo',
  'capitulum of humerus articulates with the radius, while trochlea of humerus articulates with the ulna': 'El capítulo del húmero se articula con el radio, mientras que la tróclea del húmero se articula con el cúbito',
  'carotid canal is a vascular passage; hypoglossal canal is associated with the hypoglossal nerve': 'El conducto carotídeo es un pasaje vascular; el conducto del hipogloso se relaciona con el nervio hipogloso',
  'carotid canal is in the mandible; hypoglossal canal is in the maxilla': 'El conducto carotídeo está en la mandíbula; el conducto del hipogloso está en el maxilar',
  'carpals are toe bones and tarsals are finger bones': 'Los huesos del carpo son de los dedos del pie y los del tarso, de los dedos de la mano',
  'carpals are wrist bones and tarsals are ankle/foot bones': 'Los huesos del carpo son de la muñeca y los del tarso, del tobillo y el pie',
  'cervical': 'Cervical',
  'cervical ribs': 'Costillas cervicales',
  'clavicle and scapula connect the upper limb, with the glenoid cavity receiving the humeral head': 'La clavícula y la escápula conectan la extremidad superior; la cavidad glenoidea recibe la cabeza del húmero',
  'coronal suture lies between the two parietal bones': 'La sutura coronal está entre los dos huesos parietales',
  'costal facets occur only on lumbar vertebrae': 'Las facetas costales solo se encuentran en las vértebras lumbares',
  'dens': 'Apófisis odontoides',
  'dens articulates directly with the femur': 'La apófisis odontoides se articula directamente con el fémur',
  'foramen magnum—occipital bone': 'Foramen magno—hueso occipital',
  'glenoid cavity—head of femur': 'Cavidad glenoidea—cabeza del fémur',
  'glenoid cavity—head of humerus': 'Cavidad glenoidea—cabeza del húmero',
  'greater tubercle': 'Tubérculo mayor',
  'humeral head': 'Cabeza del húmero',
  'ilium and pubis form the shoulder socket': 'El ilion y el pubis forman la cavidad del hombro',
  'inside the ankle mortise': 'Dentro de la mortaja del tobillo',
  'it is a palmar projection of the hamate': 'Es una proyección palmar del ganchoso',
  'it is a process of the talus': 'Es una apófisis del astrágalo',
  'it is a projection of the radius': 'Es una proyección del radio',
  'it is the proximal head of the femur': 'Es la cabeza proximal del fémur',
  'lambdoid suture joins the mandible to the temporal bone': 'La sutura lambdoidea une la mandíbula con el hueso temporal',
  'lateral malleolus—femur': 'Maléolo lateral—fémur',
  'lateral malleolus—fibula': 'Maléolo lateral—peroné',
  'lumbar': 'Lumbar',
  'mammillary and accessory processes occur on lumbar vertebrae': 'Las apófisis mamilares y accesorias se encuentran en las vértebras lumbares',
  'mandibular fossa': 'Fosa mandibular',
  'medial epicondyle': 'Epicóndilo medial',
  'medial malleolus—tibia': 'Maléolo medial—tibia',
  'mental foramen—mandible': 'Foramen mentoniano—mandíbula',
  'mental foramen—temporal bone': 'Foramen mentoniano—hueso temporal',
  'metacarpals are ankle bones and metatarsals are wrist bones': 'Los metacarpianos son huesos del tobillo y los metatarsianos, de la muñeca',
  'middle cranial fossa lies between the other two': 'La fosa craneal media está entre las otras dos',
  'obturator foramen—pelvis': 'Foramen obturador—pelvis',
  'occipital condyles articulate with atlas, while atlas rotates around the dens of axis': 'Los cóndilos occipitales se articulan con el atlas, que rota alrededor de la apófisis odontoides del axis',
  'occipital condyles form the ankle mortise': 'Los cóndilos occipitales forman la mortaja del tobillo',
  'olecranon is a humeral articular surface': 'El olécranon es una superficie articular del húmero',
  'on the posterior shaft of the femur': 'En la cara posterior del cuerpo del fémur',
  'posterior cranial fossa is nearest the foramen magnum': 'La fosa craneal posterior es la más cercana al foramen magno',
  'posterior cranial fossa is part of the mandible': 'La fosa craneal posterior forma parte de la mandíbula',
  'radius and ulna form the mortise around the lunate': 'El radio y el cúbito forman la mortaja alrededor del semilunar',
  'radius—little-finger side with ulnar styloid; ulna—thumb side with radial styloid': 'Radio—lado del meñique con la apófisis estiloides cubital; cúbito—lado del pulgar con la apófisis estiloides radial',
  'radius—thumb side with radial styloid; ulna—little-finger side with ulnar styloid': 'Radio—lado del pulgar con la apófisis estiloides radial; cúbito—lado del meñique con la apófisis estiloides cubital',
  'sagittal suture lies between the two parietal bones': 'La sutura sagital está entre los dos huesos parietales',
  'sagittal suture surrounds the foramen magnum': 'La sutura sagital rodea el foramen magno',
  'scaphoid and lunate are distal-row bones only': 'El escafoides y el semilunar solo son huesos de la fila distal',
  'supraorbital foramen—frontal bone': 'Foramen supraorbitario—hueso frontal',
  'talus forms a mortise around the femur': 'El astrágalo forma una mortaja alrededor del fémur',
  'tarsals are wrist bones and carpals are ankle bones': 'Los huesos del tarso son de la muñeca y los del carpo, del tobillo',
  'the acromion receives the femoral head': 'El acromion recibe la cabeza del fémur',
  'the atlas dens': 'La apófisis odontoides del atlas',
  'the cribriform plate projects from the mandible': 'La lámina cribosa se proyecta desde la mandíbula',
  'the crista galli is a rib landmark': 'La crista galli es una referencia costal',
  'the crista galli projects from the cribriform plate, which forms the nasal cavity roof': 'La crista galli se proyecta desde la lámina cribosa, que forma el techo de la cavidad nasal',
  'the dens projects from a lumbar vertebra': 'La apófisis odontoides se proyecta desde una vértebra lumbar',
  'the femoral head enters the glenoid cavity': 'La cabeza del fémur entra en la cavidad glenoidea',
  'the femoral head passes through the femoral neck to enter the acetabulum; the greater trochanter is lateral': 'La cabeza del fémur pasa por el cuello femoral para entrar en el acetábulo; el trocánter mayor es lateral',
  'the femoral neck is a carpal': 'El cuello del fémur es un hueso del carpo',
  'the greater palatine foramen is in the cranial vault, while the incisive foramen is occipital': 'El foramen palatino mayor está en la bóveda craneal, mientras que el foramen incisivo es occipital',
  'the greater trochanter is part of the tibia': 'El trocánter mayor forma parte de la tibia',
  'the incisive foramen is anterior, while the greater palatine foramen is posterolateral': 'El foramen incisivo es anterior, mientras que el foramen palatino mayor es posterolateral',
  'the intervertebral foramen alone': 'Solo el foramen intervertebral',
  'the scapula is part of the vertebral column': 'La escápula forma parte de la columna vertebral',
  'the spinal cord central canal': 'El conducto central de la médula espinal',
  'the supporting trabecular bone of the vertebral body': 'El hueso trabecular que da soporte al cuerpo vertebral',
  'thoracic': 'Torácica',
  'tibia and fibula form the mortise around the talus': 'La tibia y el peroné forman la mortaja alrededor del astrágalo',
  'tibial tuberosity—tibia': 'Tuberosidad tibial—tibia',
  'transverse foramina occur only on lumbar vertebrae': 'Los forámenes transversos solo se encuentran en las vértebras lumbares',
  'trochlea': 'Tróclea',
  'trochlea of humerus articulates with the radius, while capitulum of humerus articulates with the femur': 'La tróclea del húmero se articula con el radio, mientras que el capítulo del húmero se articula con el fémur',
  'ulnar styloid': 'Apófisis estiloides cubital',
  'uncinate process': 'Apófisis unciforme',
};
const normalizedPhraseTranslations = new Map(Object.entries(phraseTranslations).map(([key, value]) => [normalize(key), value]));

function translateValue(value: string): string {
  return termTranslations.get(normalize(value)) ?? normalizedPhraseTranslations.get(normalize(value)) ?? '';
}

const questions = Object.fromEntries(content.questions
  .filter((question) => question.moduleId === 'skeletal-system')
  .map((question) => {
    const text = questionTexts[question.id] ?? practicalQuestionText[question.id];
    if (!text) throw new Error(`Falta la traducción al español de la pregunta ${question.id}.`);
    const translateAnswer = (answer: string | string[]) => Array.isArray(answer)
      ? answer.map((item) => {
        const translated = translateValue(item);
        if (!translated) throw new Error(`Falta la traducción al español de la respuesta «${item}» en ${question.id}.`);
        return translated;
      })
      : translateValue(answer) || (() => { throw new Error(`Falta la traducción al español de la respuesta «${answer}» en ${question.id}.`); })();
    const translatedOptions = question.options?.map((option) => {
      const translated = translateValue(option);
      if (!translated) throw new Error(`Falta la traducción al español de la opción «${option}» en ${question.id}.`);
      return translated;
    });
    return [question.id, {
      prompt: text.prompt,
      answer: translateAnswer(question.answer),
      acceptedAliases: question.acceptedAliases.map((alias) => {
        const translated = translateValue(alias);
        if (!translated) throw new Error(`Falta la traducción al español del sinónimo «${alias}» en ${question.id}.`);
        return translated;
      }),
      ...(translatedOptions ? { options: translatedOptions } : {}),
      explanation: text.explanation,
    }];
  }));

export default { module, lessons, structures, questions } as const;