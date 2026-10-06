/** Authored word meanings, separate from accepted identification answers.
 * Each word links to the existing, source-linked structure it describes.
 * Do not infer adjectives by suffix: similar words can describe different anatomy.
 */
export type AnatomicalTerm = {
  structureId: string;
  en: string;
  es: string;
  definition: string;
  spanishDefinition: string;
};

// English word, related structure, plain-English referent, Spanish word/referent.
const words: ReadonlyArray<readonly [string, string, string, string, string]> = [
  ['acetabular', 'acetabulum', 'the acetabulum, the socket in the pelvis that receives the head of the femur to form the hip joint', 'acetabular', 'el acetábulo, la cavidad de la pelvis que recibe la cabeza del fémur para formar la articulación de la cadera'],
  ['femoral', 'femur', 'the femur, the thigh bone', 'femoral', 'el fémur, el hueso del muslo'],
  ['humeral', 'humerus', 'the humerus, the bone of the upper arm', 'humeral', 'el húmero, el hueso del brazo'],
  ['tibial', 'tibia', 'the tibia, the larger shin bone', 'tibial', 'la tibia, el hueso más grande de la pierna'],
  ['fibular', 'fibula', 'the fibula, the slender bone on the outer side of the lower leg', 'fibular', 'la fíbula, el hueso delgado del lado externo de la pierna'],
  ['radial', 'radius', 'the radius, the forearm bone on the thumb side; in other contexts, radial can mean arranged around a center', 'radial', 'el radio, el hueso del antebrazo del lado del pulgar; en otros contextos, radial puede indicar una disposición alrededor de un centro'],
  ['ulnar', 'ulna', 'the ulna, the forearm bone on the little-finger side', 'ulnar', 'la ulna, el hueso del antebrazo del lado del meñique'],
  ['scapular', 'scapula', 'the scapula, the shoulder blade', 'escapular', 'la escápula, el omóplato'],
  ['clavicular', 'clavicle', 'the clavicle, the collarbone', 'clavicular', 'la clavícula'],
  ['patellar', 'patella', 'the patella, the kneecap', 'patelar', 'la patela, la rótula'],
  ['sternal', 'sternum', 'the sternum, the breastbone in the front of the chest', 'esternal', 'el esternón, el hueso del centro anterior del tórax'],
  ['iliac', 'ilium', 'the ilium, the broad upper part of the hip bone', 'ilíaco', 'el ilion, la parte ancha y superior del hueso coxal'],
  ['ischial', 'ischium', 'the ischium, the lower posterior part of the hip bone that includes the sitting-bone prominence', 'isquiático', 'el isquion, la parte posteroinferior del hueso coxal que incluye la prominencia sobre la que nos sentamos'],
  ['pubic', 'pubis', 'the pubis, the front portion of the hip bone', 'púbico', 'el pubis, la parte anterior del hueso coxal'],
  ['sacral', 'sacrum', 'the sacrum, the fused bone at the base of the spine between the hip bones', 'sacro', 'el sacro, el hueso fusionado de la base de la columna entre los huesos coxales'],
  ['coccygeal', 'coccyx', 'the coccyx, the tailbone', 'coccígeo', 'el cóccix'],
  ['mandibular', 'mandible', 'the mandible, the lower jaw', 'mandibular', 'la mandíbula, el maxilar inferior'],
  ['maxillary', 'maxilla', 'the maxilla, a bone of the upper jaw', 'maxilar', 'el maxilar, un hueso de la mandíbula superior'],
  ['frontal', 'frontal-bone', 'the forehead or frontal bone; frontal also names a plane dividing the body into front and back portions', 'frontal', 'la frente o el hueso frontal; frontal también nombra un plano que divide el cuerpo en partes anterior y posterior'],
  ['parietal', 'parietal-bone', 'a wall of a body cavity, or the parietal bones forming the upper sides of the skull', 'parietal', 'la pared de una cavidad corporal o los huesos parietales que forman las partes superiores y laterales del cráneo'],
  ['temporal', 'temporal-bone', 'the temple region of the head or the temporal bone of the skull', 'temporal', 'la región de la sien o el hueso temporal del cráneo'],
  ['occipital', 'occipital-bone', 'the back of the head or the occipital bone of the skull', 'occipital', 'la parte posterior de la cabeza o el hueso occipital del cráneo'],
  ['zygomatic', 'zygomatic-bone', 'the zygomatic bone, the cheekbone', 'cigomático', 'el hueso cigomático, el pómulo'],
  ['nasal', 'nasal-bone', 'the nose and its structures, including the nasal bones', 'nasal', 'la nariz y sus estructuras, incluidos los huesos nasales'],
  ['renal', 'urinary-system-kidney', 'the kidney, an organ that filters blood and forms urine', 'renal', 'el riñón, un órgano que filtra la sangre y forma orina'],
  ['hepatic', 'liver', 'the liver', 'hepático', 'el hígado'],
  ['cardiac', 'heart', 'the heart', 'cardíaco', 'el corazón'],
  ['gastric', 'stomach', 'the stomach', 'gástrico', 'el estómago'],
  ['splenic', 'spleen', 'the spleen', 'esplénico', 'el bazo'],
  ['pancreatic', 'pancreas', 'the pancreas', 'pancreático', 'el páncreas'],
  ['duodenal', 'digestive-system-duodenum', 'the duodenum, the first part of the small intestine after the stomach', 'duodenal', 'el duodeno, la primera parte del intestino delgado después del estómago'],
  ['jejunal', 'digestive-system-jejunum', 'the jejunum, the middle part of the small intestine', 'yeyunal', 'el yeyuno, la parte media del intestino delgado'],
  ['ileal', 'digestive-system-ileum', 'the ileum, the last part of the small intestine; not the ilium of the hip bone', 'ileal', 'el íleon, la última parte del intestino delgado; no el ilion del hueso coxal'],
  ['rectal', 'digestive-system-rectum', 'the rectum, the final segment of the large intestine before the anal canal', 'rectal', 'el recto, el segmento final del intestino grueso antes del conducto anal'],
  ['esophageal', 'digestive-system-esophagus', 'the esophagus, the tube carrying swallowed food toward the stomach', 'esofágico', 'el esófago, el tubo que lleva los alimentos deglutidos hacia el estómago'],
  ['tracheal', 'respiratory-system-trachea', 'the trachea, the windpipe', 'traqueal', 'la tráquea'],
  ['laryngeal', 'respiratory-system-larynx', 'the larynx, the voice box', 'laríngeo', 'la laringe'],
  ['pharyngeal', 'digestive-system-pharynx', 'the pharynx, the throat passage behind the nose and mouth', 'faríngeo', 'la faringe, el conducto situado detrás de la nariz y la boca'],
  ['uterine', 'uterus', 'the uterus, the womb', 'uterino', 'el útero, la matriz'],
  ['ovarian', 'female-reproductive-ovary', 'the ovary', 'ovárico', 'el ovario'],
  ['testicular', 'male-reproductive-testis', 'the testis, an organ that produces sperm and testosterone', 'testicular', 'el testículo, un órgano que produce espermatozoides y testosterona'],
  ['prostatic', 'male-reproductive-prostate-gland', 'the prostate gland', 'prostático', 'la próstata'],
  ['vesical', 'urinary-system-urinary-bladder', 'the urinary bladder, which stores urine', 'vesical', 'la vejiga urinaria, que almacena orina'],
  ['ureteral', 'urinary-system-ureter', 'the ureter, the tube carrying urine from a kidney to the bladder', 'ureteral', 'el uréter, el tubo que lleva la orina del riñón a la vejiga'],
  ['urethral', 'urinary-system-urethra', 'the urethra, the tube carrying urine from the bladder out of the body', 'uretral', 'la uretra, el tubo que lleva la orina de la vejiga al exterior'],
  ['cerebral', 'cerebrum', 'the cerebrum, the largest part of the brain', 'cerebral', 'el cerebro, la parte más grande del encéfalo'],
  ['cerebellar', 'cerebellum', 'the cerebellum, the brain region important for coordination and balance', 'cerebeloso', 'el cerebelo, la región encefálica importante para la coordinación y el equilibrio'],
  ['spinal', 'spinal-cord', 'the spine or spinal cord; the spinal cord is nervous tissue within the vertebral canal', 'espinal', 'la columna vertebral o la médula espinal; la médula es tejido nervioso dentro del conducto vertebral'],
  ['retinal', 'retina-eye', 'the retina, the light-sensitive tissue at the back of the eye', 'retiniano', 'la retina, el tejido sensible a la luz de la parte posterior del ojo'],
  ['corneal', 'cornea-eye', 'the cornea, the transparent front surface of the eye', 'corneal', 'la córnea, la superficie anterior transparente del ojo'],
  ['scleral', 'sclera-eye', 'the sclera, the white outer coat of the eye', 'escleral', 'la esclerótica, la cubierta externa blanca del ojo'],
  ['iridal', 'iris-eye', 'the iris, the colored part of the eye surrounding the pupil', 'iridiano', 'el iris, la parte coloreada del ojo que rodea la pupila'],
  ['lenticular', 'lens-eye', 'a lens or a lens-like shape; in eye anatomy, it describes the crystalline lens', 'lenticular', 'una lente o una forma de lente; en la anatomía ocular, describe el cristalino'],
  ['optic', 'optic-nerve-eye', 'vision or the eye; the optic nerve carries visual signals from the retina toward the brain', 'óptico', 'la visión o el ojo; el nervio óptico lleva señales visuales de la retina hacia el encéfalo'],
  ['aortic', 'ves-aorta', 'the aorta, the main artery carrying blood from the left ventricle', 'aórtico', 'la aorta, la arteria principal que lleva sangre desde el ventrículo izquierdo'],
  ['articular', 'articular-cartilage', 'a joint, where bones meet; articular cartilage covers bone surfaces in synovial joints', 'articular', 'una articulación, donde se unen los huesos; el cartílago articular recubre las superficies óseas de las articulaciones sinoviales'],
  ['epidermal', 'epidermis-skin', 'the epidermis, the outer layer of the skin', 'epidérmico', 'la epidermis, la capa externa de la piel'],
  ['dermal', 'dermis-skin', 'the dermis, the connective-tissue layer beneath the epidermis', 'dérmico', 'la dermis, la capa de tejido conjuntivo situada debajo de la epidermis'],
  ['glomerular', 'urinary-system-glomerulus', 'the glomerulus, a tuft of capillaries that filters blood in a renal corpuscle', 'glomerular', 'el glomérulo, un ovillo de capilares que filtra la sangre en un corpúsculo renal'],
  ['thyroidal', 'thyroid-gland', 'the thyroid gland in the neck', 'tiroideo', 'la glándula tiroides del cuello'],
  ['pituitary', 'pituitary-gland', 'the pituitary gland, an endocrine gland beneath the hypothalamus', 'hipofisario', 'la hipófisis, una glándula endocrina situada debajo del hipotálamo'],
  ['adrenal', 'endo-adrenal', 'an adrenal gland, located above a kidney', 'suprarrenal', 'una glándula suprarrenal, situada encima de un riñón'],
];

export const anatomicalTerms: readonly AnatomicalTerm[] = words.map(([en, structureId, referent, es, spanishReferent]) => ({
  en, es, structureId,
  definition: `Of or relating to ${referent}.`,
  spanishDefinition: `Perteneciente o relativo a ${spanishReferent}.`,
}));

export function wordMeaning(term: AnatomicalTerm, language: 'en' | 'es' = 'en') {
  const word = language === 'es' ? term.es : term.en;
  return {
    name: word.charAt(0).toUpperCase() + word.slice(1),
    definition: language === 'es' ? term.spanishDefinition : term.definition,
  };
}
