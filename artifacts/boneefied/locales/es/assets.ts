const graySource = 'Dominio público; Henry Vandyke Carter / Henry Gray, vía Wikimedia Commons.';
const originalSource = 'Diagrama original creado para Boneefied.';
const servierSource = 'Adaptado de Servier Medical Art (https://smart.servier.com), con licencia CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Cambios: Boneefied añadió etiquetas y objetivos.';
const servierAdaptation = 'Boneefied añadió etiquetas y objetivos; la ilustración subyacente no se modificó.';
const openStax2016 = 'OpenStax, 2016, CC BY 4.0.';
const openStax = 'OpenStax, CC BY 4.0.';
const openStaxAdaptation = 'Recorte de la lámina verificada de OpenStax sin etiquetas; Boneefied añadió objetivos normalizados. La anatomía no cambió.';
const unchangedPlate = 'Imagen JPEG original de Commons; las etiquetas y la anatomía permanecen intactas. No se usa como lámina de recuerdo sin etiquetas.';
const translatedCrop = 'Recorte anatómico regional para recordar; se excluyeron los nombres impresos externos y se conservaron las líneas guía originales.';

export default {
  'asset-skull-front': { title: 'Lámina frontal del cráneo', description: 'Lámina frontal del cráneo', attributionLicense: graySource },
  'asset-skull-lateral': { title: 'Lámina lateral del cráneo', description: 'Lámina lateral del cráneo', attributionLicense: graySource },
  'asset-vertebral-column': { title: 'Lámina lateral de la columna vertebral', description: 'Lámina lateral de la columna vertebral', attributionLicense: graySource },
  'asset-cervical-vertebra': { title: 'Lámina de una vértebra cervical', description: 'Lámina de una vértebra cervical', attributionLicense: graySource },
  'asset-gray946-sweat-gland': { title: 'Lámina histológica de una glándula sudorípara', description: 'Lámina histológica de una glándula sudorípara', attributionLicense: graySource },
  'asset-gray880-optic-nerve-head': { title: 'Corte de la cabeza del nervio óptico', description: 'Corte de la cabeza del nervio óptico', attributionLicense: graySource },
  'asset-gray491-heart-posterior': { title: 'Cara posterior del corazón y venas coronarias', description: 'Cara posterior del corazón y venas coronarias', attributionLicense: graySource },
  'asset-gray1121-posterior-abdominal-wall': { title: 'Pared abdominal posterior', description: 'Pared abdominal posterior', attributionLicense: graySource },
  'asset-original-cell-overview': {
    title: 'Vista general original de la célula',
    description: 'Diagrama original de Boneefied de una célula generalizada; los objetivos señalan regiones visuales amplias.',
    attributionLicense: originalSource, adaptationNote: 'Ilustración original de Boneefied con etiquetas y objetivos estructurados.',
    labels: ['Membrana plasmática', 'Citoplasma', 'Núcleo', 'Nucléolo', 'Mitocondria', 'Retículo endoplasmático liso', 'Aparato de Golgi', 'Centrosoma'],
  },
  'asset-original-mitosis-stages': {
    title: 'Etapas originales de la mitosis',
    description: 'Diagrama original de Boneefied que compara las etapas.',
    attributionLicense: originalSource, adaptationNote: 'Ilustración original de Boneefied con etiquetas y objetivos estructurados.',
    labels: ['Interfase', 'Profase', 'Metafase', 'Anafase', 'Telofase'],
  },
  'asset-original-anatomical-planes': {
    title: 'Planos anatómicos originales', description: 'Diagrama original de Boneefied de los planos anatómicos.',
    attributionLicense: originalSource, adaptationNote: 'Ilustración original de Boneefied con etiquetas y objetivos estructurados.',
    labels: ['Plano sagital', 'Plano coronal', 'Plano transversal'],
  },
  'asset-original-body-cavities': {
    title: 'Cavidades corporales originales', description: 'Diagrama original de Boneefied de las cavidades corporales.',
    attributionLicense: originalSource, adaptationNote: 'Ilustración original de Boneefied con etiquetas y objetivos estructurados.',
    labels: ['Cavidad craneal', 'Cavidad vertebral', 'Cavidad torácica', 'Cavidad abdominal', 'Cavidad pélvica'],
  },
  'asset-servier-elbow-joint': {
    title: 'Articulación del codo', description: 'Ilustración de la articulación del codo de Servier; solo se señalan referencias articulares generales.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation,
    labels: ['Húmero', 'Cartílago articular', 'Cavidad articular', 'Cápsula fibrosa'],
  },
  'asset-servier-brain-lateral': {
    title: 'Vista lateral del encéfalo', description: 'Ilustración lateral del encéfalo.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation,
    labels: ['Cerebro', 'Cerebelo', 'Bulbo raquídeo'],
  },
  'asset-servier-brain-sagittal': {
    title: 'Vista sagital del encéfalo', description: 'Ilustración sagital del encéfalo; solo se señalan las estructuras que se distinguen claramente.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation,
    labels: ['Cuerpo calloso', 'Tálamo', 'Cerebelo', 'Bulbo raquídeo'],
  },
  'asset-servier-heart-anterior': {
    title: 'Vista anterior del corazón', description: 'Ilustración anterior del corazón.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation,
    labels: ['Aurícula derecha', 'Ventrículo izquierdo', 'Tronco pulmonar', 'Aorta ascendente', 'Arteria coronaria derecha'],
  },
  'asset-servier-stomach-section': {
    title: 'Corte del estómago', description: 'Corte del estómago con pliegues visibles en la pared del órgano.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation, labels: ['Estómago', 'Pliegues gástricos'],
  },
  'asset-servier-kidney': {
    title: 'Corte del riñón', description: 'Corte del riñón que muestra las regiones principales y la vía de salida.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation,
    labels: ['Corteza renal', 'Médula renal', 'Pelvis renal', 'Uréter'],
  },
  'asset-servier-thyroid-anterior': {
    title: 'Vista anterior de la tiroides', description: 'Ilustración anterior de la tiroides.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation,
    labels: ['Lóbulo tiroideo', 'Istmo tiroideo'],
  },
  'asset-servier-ovary': {
    title: 'Ovario y folículos', description: 'Ilustración del ovario con regiones foliculares generales.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation, labels: ['Ovario', 'Corteza ovárica'],
  },
  'asset-servier-uterus': {
    title: 'Útero', description: 'Ilustración del útero.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation, labels: ['Útero', 'Cuello uterino'],
  },
  'asset-servier-eye-section': {
    title: 'Corte del ojo', description: 'Corte del ojo con las principales regiones de la pared y del nervio.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation, labels: ['Retina', 'Nervio óptico'],
  },
  'asset-servier-ear-section': {
    title: 'Corte del oído', description: 'Corte del oído con las principales estructuras de la audición y el equilibrio.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation,
    labels: ['Membrana timpánica', 'Cóclea', 'Conductos semicirculares'],
  },
  'asset-servier-male-reproductive': {
    title: 'Sistema reproductor masculino', description: 'Ilustración del aparato reproductor masculino; solo muestra estructuras generales.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation,
    labels: ['Próstata', 'Testículo', 'Conducto deferente'],
  },
  'asset-servier-lymph-node-section': {
    title: 'Corte de un ganglio linfático', description: 'Corte de un ganglio linfático con sus compartimentos principales.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation, labels: ['Corteza', 'Médula', 'Hilio'],
  },
  'asset-servier-respiratory-system': {
    title: 'Sistema respiratorio', description: 'Ilustración del sistema respiratorio.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation,
    labels: ['Cavidad nasal', 'Tráquea', 'Pulmón derecho'],
  },
  'asset-servier-pelvis': {
    title: 'Pelvis', description: 'Ilustración de la cintura pélvica.',
    attributionLicense: servierSource, adaptationNote: servierAdaptation,
    labels: ['Pelvis', 'Sacro', 'Ilion', 'Pubis', 'Isquion', 'Acetábulo', 'Fémur'],
  },
  'asset-commons-kidney-cortex-human': {
    title: 'Muestra de corteza renal humana',
    description: 'Muestra de corteza renal humana con perfiles generales de glomérulos y túbulos visibles. No se especifican tinción ni aumento.',
    attributionLicense: 'Josef Reischig, CC BY-SA 3.0',
  },
  'asset-commons-alveolar-sac': {
    title: 'Muestra de saco alveolar',
    description: 'Muestra de saco alveolar con espacios aéreos y tabiques generales; no se especifican organismo, tinción ni aumento.',
    attributionLicense: 'Jpogi, CC BY-SA 4.0',
  },
  'asset-commons-axial-skeleton-blank': {
    title: 'Esqueleto axial, vista anterior',
    description: 'Diagrama anterior sin etiquetas con el esqueleto axial resaltado para identificar las regiones.',
    attributionLicense: 'Dominio público; Mariana Ruiz Villarreal (LadyofHats), derivado sin etiquetas de Quico, vía Wikimedia Commons.',
    adaptationNote: 'Boneefied rasterizó el SVG sin etiquetas y añadió objetivos normalizados verificados; la anatomía subyacente no cambió.',
    labels: ['Cráneo', 'Mandíbula', 'Vértebras cervicales', 'Esternón', 'Costillas verdaderas', 'Vértebras torácicas', 'Vértebras lumbares', 'Sacro', 'Cóccix'],
  },
  'asset-commons-appendicular-skeleton-blank': {
    title: 'Esqueleto apendicular, vista anterior',
    description: 'Diagrama anterior sin etiquetas con el esqueleto apendicular resaltado para identificar regiones y orientar las extremidades.',
    attributionLicense: 'Dominio público; Mariana Ruiz Villarreal (LadyofHats), derivado sin etiquetas de Quico, vía Wikimedia Commons.',
    adaptationNote: 'Boneefied rasterizó el SVG sin etiquetas y añadió objetivos normalizados verificados; la anatomía subyacente no cambió.',
    labels: ['Clavícula', 'Escápula', 'Húmero', 'Radio', 'Ulna', 'Huesos del carpo', 'Metacarpianos', 'Cintura pélvica', 'Fémur', 'Rótula', 'Tibia', 'Fíbula', 'Huesos del tarso', 'Metatarsianos'],
  },
  'asset-openstax-spinal-cord-specimen': {
    title: 'Muestra de corte transversal de la médula espinal',
    description: 'Recorte de una muestra sin etiquetas que muestra la sustancia gris central con forma de mariposa y la sustancia blanca periférica.',
    attributionLicense: 'OpenStax Anatomy and Physiology, CC BY 4.0.',
    adaptationNote: 'Recorte del panel de fotomicrografía de la fuente; el contenido anatómico no cambió.',
  },
  'asset-commons-simple-squamous-epithelium': {
    title: 'Muestra de epitelio plano simple', description: 'Fotomicrografía de epitelio plano simple de estilo desconocido.',
    attributionLicense: 'Berkshire Community College Bioscience Image Library, CC0 1.0.',
  },
  'asset-commons-simple-cuboidal-epithelium': {
    title: 'Muestra de epitelio cúbico simple', description: 'Fotomicrografía de epitelio cúbico simple de estilo desconocido.',
    attributionLicense: 'Berkshire Community College Bioscience Image Library, CC0 1.0.',
  },
  'asset-commons-simple-columnar-epithelium': {
    title: 'Muestra de epitelio cilíndrico simple', description: 'Fotomicrografía de epitelio cilíndrico simple de estilo desconocido.',
    attributionLicense: 'Berkshire Community College Bioscience Image Library, CC0 1.0.',
  },
  'asset-openstax-muscle-face-neck': {
    title: 'Músculos de la cara y del cuello anterior', description: 'Recorte regional para recordar los músculos de la expresión facial, la masticación y el esternocleidomastoideo.',
    attributionLicense: openStax, adaptationNote: openStaxAdaptation,
    labels: ['Frontal', 'Temporal', 'Orbicular del ojo', 'Masetero', 'Orbicular de la boca'],
  },
  'asset-openstax-muscle-anterior-trunk': {
    title: 'Músculos anteriores del tronco', description: 'Recorte regional del hombro, el tórax, el brazo y la pared abdominal.',
    attributionLicense: openStax, adaptationNote: openStaxAdaptation,
    labels: ['Deltoides', 'Pectoral mayor', 'Serrato anterior', 'Bíceps braquial', 'Braquial', 'Recto del abdomen', 'Oblicuo externo'],
  },
  'asset-openstax-muscle-anterior-arm': {
    title: 'Hombro, brazo y antebrazo anteriores', description: 'Recorte regional de los músculos superficiales anteriores de la extremidad superior.',
    attributionLicense: openStax, adaptationNote: openStaxAdaptation,
    labels: ['Deltoides', 'Pectoral mayor', 'Bíceps braquial', 'Braquial', 'Pronador redondo', 'Flexor radial del carpo'],
  },
  'asset-openstax-muscle-anterior-leg': {
    title: 'Cadera, muslo y pierna anteriores', description: 'Recorte regional de los músculos anteriores y mediales del muslo y de la región anterior de la pierna.',
    attributionLicense: openStax, adaptationNote: openStaxAdaptation,
    labels: ['Tensor de la fascia lata', 'Iliopsoas', 'Aductor largo', 'Grácil', 'Sartorio', 'Recto femoral', 'Vasto lateral', 'Vasto medial', 'Tibial anterior', 'Fibular largo'],
  },
  'asset-openstax-muscle-posterior-back': {
    title: 'Músculos posteriores del hombro y de la espalda', description: 'Recorte regional de músculos superficiales y profundos del hombro posterior y la espalda.',
    attributionLicense: openStax, adaptationNote: openStaxAdaptation,
    labels: ['Elevador de la escápula', 'Romboides mayor', 'Trapecio', 'Deltoides', 'Infraespinoso', 'Redondo menor', 'Tríceps braquial', 'Dorsal ancho', 'Erector de la columna'],
  },
  'asset-openstax-muscle-posterior-leg': {
    title: 'Región glútea, muslo posterior y pantorrilla', description: 'Recorte regional de los músculos glúteos, isquiotibiales y de la pantorrilla.',
    attributionLicense: openStax, adaptationNote: openStaxAdaptation,
    labels: ['Glúteo medio', 'Glúteo mayor', 'Bíceps femoral', 'Semitendinoso', 'Semimembranoso', 'Gastrocnemio', 'Sóleo'],
  },
  'asset-openstax-muscle-labeled-overview': {
    title: 'Músculos principales, vistas anteriores y posteriores etiquetadas',
    description: 'Referencia de estudio etiquetada que compara vistas anteriores y posteriores superficiales y profundas.',
    attributionLicense: openStax,
  },
  'asset-openstax-diaphragm-labeled': {
    title: 'Diafragma, vista inferior',
    description: 'Referencia de estudio etiquetada que muestra el diafragma, el tendón central, las aberturas principales, las costillas y las relaciones musculares posteriores.',
    attributionLicense: openStax,
  },
  'asset-injurymap-rotator-cuff-labeled': {
    title: 'Manguito rotador, vistas anterior y posterior',
    description: 'Referencia de estudio etiquetada que muestra los músculos supraespinoso, infraespinoso, redondo menor y subescapular.',
    attributionLicense: 'InjuryMap, CC BY-SA 4.0.',
    adaptationNote: 'Rasterizado a partir del SVG de origen; la anatomía y las etiquetas no cambiaron.',
  },
  'asset-openstax-2016-humerus': {
    title: 'Hombro: vistas anterior superficial y profunda, y posterior superficial y profunda',
    description: 'Los paneles en corte muestran el subescapular anteriormente y los músculos supraespinoso, infraespinoso y redondo menor posteriormente; una vista superficial por sí sola no permite identificarlos.',
    attributionLicense: openStax2016,
    adaptationNote: 'JPEG original de Commons; las etiquetas impresas permanecen visibles. Solo para estudiar, no es una pregunta de recuerdo.',
  },
  'asset-openstax-2016-hand': {
    title: 'Músculos intrínsecos de la mano: capas palmar y dorsal izquierdas',
    description: 'Compara las eminencias tenar e hipotenar, los lumbricales y los interóseos palmares y dorsales. Las etiquetas están impresas en esta imagen original de estudio.',
    attributionLicense: openStax2016,
    adaptationNote: 'JPEG original de Commons; las etiquetas impresas permanecen visibles. Solo para estudiar, no es una pregunta de recuerdo.',
  },
  'asset-openstax-2016-leg': {
    title: 'Pierna derecha: vistas anterior, posterior y posterior profunda',
    description: 'Comparación de los compartimentos y, en la región posterior profunda, del tibial posterior y los flexores largos de los dedos.',
    attributionLicense: openStax2016,
    adaptationNote: 'JPEG original de Commons; las etiquetas impresas permanecen visibles. Solo para estudiar, no es una pregunta de recuerdo.',
  },
  'asset-openstax-2016-foot': {
    title: 'Músculos intrínsecos del pie: capas dorsales y plantares',
    description: 'Vista dorsal derecha y vistas plantares izquierdas en capas; los paneles difieren en lateralidad y profundidad.',
    attributionLicense: openStax2016,
    adaptationNote: 'JPEG original de Commons; las etiquetas impresas permanecen visibles. Solo para estudiar, no es una pregunta de recuerdo.',
  },
  'asset-openstax-2016-floor': {
    title: 'Diafragma pélvico: vista superior',
    description: 'Diafragma pélvico femenino visto desde arriba: el pubococcígeo y el iliococcígeo forman el elevador del ano alrededor de las aberturas pélvicas.',
    attributionLicense: openStax2016,
    adaptationNote: 'JPEG original de Commons; las etiquetas impresas permanecen visibles. Solo para estudiar, no es una pregunta de recuerdo.',
  },
  'asset-openstax-2016-perineum': {
    title: 'Músculos del periné: vistas inferiores masculina y femenina',
    description: 'Compara los músculos perineales superficiales pares y el elevador del ano; la dirección de observación difiere de la vista superior del diafragma pélvico.',
    attributionLicense: openStax2016,
    adaptationNote: 'JPEG original de Commons; las etiquetas impresas permanecen visibles. Solo para estudiar, no es una pregunta de recuerdo.',
  },
  'asset-openstax-2016-hand-palmar': {
    title: 'Mano izquierda en vista palmar: eminencias tenar e hipotenar y lumbricales',
    description: translatedCrop,
    attributionLicense: openStax2016,
    adaptationNote: 'Recorte del JPEG original etiquetado de 2016 a 545 × 900 en (340, 60); no se borró ni redibujó anatomía. Se excluyeron los nombres y se conservaron las líneas guía. Los centros de los objetivos se revisaron con respecto al original etiquetado.',
    labels: ['Abductor del meñique (mano)', 'Abductor corto del pulgar', 'Flexor corto del pulgar', 'Lumbricales de la mano'],
  },
  'asset-openstax-2016-foot-plantar': {
    title: 'Pie izquierdo en vista plantar: músculos superficiales',
    description: translatedCrop,
    attributionLicense: openStax2016,
    adaptationNote: 'Recorte del JPEG original etiquetado de 2016 a 282 × 680 en (233, 760); no se borró ni redibujó anatomía. Se excluyeron los nombres y se conservaron las líneas guía. Los centros de los objetivos se revisaron con respecto al original etiquetado.',
    labels: ['Abductor del dedo gordo', 'Flexor corto de los dedos (pie)', 'Abductor del meñique (pie)'],
  },
  'asset-openstax-2016-foot-dorsal': {
    title: 'Pie derecho en vista dorsolateral',
    description: translatedCrop,
    attributionLicense: openStax2016,
    adaptationNote: 'Recorte del JPEG original etiquetado de 2016 a 630 × 520 en (710, 20); no se borró ni redibujó anatomía. Se excluyeron los nombres y se conservaron las líneas guía. Los centros de los objetivos se revisaron con respecto al original etiquetado.',
    labels: ['Extensor corto de los dedos (pie)'],
  },
  'asset-openstax-historical-heart-valves': {
    title: 'Cuatro válvulas cardíacas: vista posterior desde arriba',
    description: 'Lámina de estudio etiquetada de las válvulas auriculoventriculares derecha e izquierda y de las válvulas semilunares aórtica y pulmonar. No interpretes esta vista como una fotografía externa anterior del corazón.',
    attributionLicense: 'OpenStax College, archivo histórico de Wikimedia Commons, CC BY 3.0.',
    adaptationNote: unchangedPlate,
  },
  'asset-openstax-historical-skin-structure': {
    title: 'Piel: folículos, glándula ecrina y tejidos en capas',
    description: 'Esquema transversal etiquetado de la epidermis, la dermis, la hipodermis, el aparato piloso y el conducto de una glándula sudorípara; no es histología ni una muestra.',
    attributionLicense: 'OpenStax College; J. Gordon Betts, Peter Desaix, Eddie Johnson, archivo histórico de Wikimedia Commons, CC BY 3.0.',
    adaptationNote: unchangedPlate,
  },
  'asset-openstax-historical-nephron': {
    title: 'Nefrona: irrigación sanguínea y recorrido tubular',
    description: 'Esquema de estudio etiquetado que relaciona las arteriolas aferente y eferente, la cápsula glomerular, el túbulo proximal, el asa, la red peritubular y el conducto colector. No es una lámina macroscópica del riñón.',
    attributionLicense: 'OpenStax College, archivo histórico de Wikimedia Commons, CC BY 3.0.',
    adaptationNote: unchangedPlate,
  },
  'asset-openstax-historical-peritoneum': {
    title: 'Peritoneo: sección abdominal transversal etiquetada',
    description: 'Corte transversal que muestra el peritoneo parietal y visceral, la cavidad potencial y las posiciones relativas del riñón, el páncreas y el intestino.',
    attributionLicense: 'OpenStax College, archivo histórico de Wikimedia Commons, CC BY 3.0.',
    adaptationNote: 'JPEG original descargado de Commons; las etiquetas y la anatomía no cambiaron; no se usa como lámina de recuerdo sin etiquetas.',
  },
} as const;