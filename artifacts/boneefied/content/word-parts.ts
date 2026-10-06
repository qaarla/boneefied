import { normalizeSearchText } from './search.ts';

export type WordPartKind = 'prefix' | 'root' | 'suffix';
export type WordPart = {
  id: string;
  form: string;
  kind: WordPartKind;
  aliases: string[];
  meaning: string;
  spanishMeaning: string;
  example: string;
  spanishExample: string;
};

export const wordPartReference = 'https://medlineplus.gov/appendixa.html';
// Short, original teaching explanations. Combining forms use /o notation;
// the slash separates a root from its combining vowel, not two different words.
// These records are vocabulary, never additional accepted practice answers.
type Row = readonly [string, string, string, string, string, string?];
const prefixes: readonly Row[] = [
  ['a-', 'Without or lacking; an- is a related form.', 'Sin o carente de; an- es una forma relacionada.', 'Avascular — without blood vessels.', 'Avascular — sin vasos sanguíneos.', 'an-'],
  ['ab-', 'Away from.', 'Alejándose de.', 'Abduction — movement away from the midline.', 'Abducción — movimiento que se aleja de la línea media.', 'abs-'],
  ['ad-', 'Toward.', 'Hacia.', 'Adduction — movement toward the midline.', 'Aducción — movimiento hacia la línea media.'],
  ['ambi-', 'Both or both sides.', 'Ambos o ambos lados.', 'Ambidextrous — able to use both hands well.', 'Ambidiestro — capaz de usar bien ambas manos.'],
  ['ante-', 'Before or in front of.', 'Antes de o delante de.', 'Antepartum — before childbirth.', 'Anteparto — antes del parto.'],
  ['anti-', 'Against or opposing.', 'Contra o que se opone a.', 'Antibody — an immune protein that recognizes a specific target.', 'Anticuerpo — proteína inmunitaria que reconoce una diana específica.'],
  ['auto-', 'Self or one’s own.', 'Propio o de uno mismo.', 'Autologous — obtained from the same individual.', 'Autólogo — obtenido del mismo individuo.'],
  ['bi-', 'Two.', 'Dos.', 'Biceps — a muscle with two heads of origin.', 'Bíceps — músculo con dos cabezas de origen.'],
  ['brady-', 'Slow.', 'Lento.', 'Bradycardia — a slower-than-normal heart rate.', 'Bradicardia — frecuencia cardíaca más lenta de lo normal.'],
  ['circum-', 'Around.', 'Alrededor.', 'Circumduction — a circular movement of a limb.', 'Circunducción — movimiento circular de una extremidad.'],
  ['contra-', 'Against or opposite.', 'Contra u opuesto.', 'Contralateral — on the opposite side.', 'Contralateral — en el lado opuesto.'],
  ['de-', 'Away from, removal, or reversal, depending on the word.', 'Separación, eliminación o inversión, según la palabra.', 'Dehydration — loss of water.', 'Deshidratación — pérdida de agua.'],
  ['dia-', 'Through or across.', 'A través de.', 'Diapedesis — passage of blood cells through vessel walls.', 'Diapédesis — paso de células sanguíneas a través de las paredes vasculares.'],
  ['diplo-', 'Double.', 'Doble.', 'Diplopia — double vision.', 'Diplopía — visión doble.'],
  ['dys-', 'Difficult, abnormal, or impaired.', 'Difícil, anormal o alterado.', 'Dysphagia — difficulty swallowing.', 'Disfagia — dificultad para tragar.'],
  ['ecto-', 'Outside or outer.', 'Exterior o externo.', 'Ectoderm — the outer embryonic germ layer.', 'Ectodermo — capa germinal embrionaria externa.', 'ect-'],
  ['endo-', 'Inside or within.', 'Dentro de o interno.', 'Endocardium — the inner lining of the heart.', 'Endocardio — revestimiento interno del corazón.', 'end-'],
  ['epi-', 'On, upon, or over.', 'Sobre o encima de.', 'Epidermis — the skin layer over the dermis.', 'Epidermis — capa de la piel situada sobre la dermis.'],
  ['eu-', 'Good, normal, or well.', 'Bueno, normal o adecuado.', 'Eupnea — normal, quiet breathing.', 'Eupnea — respiración normal y tranquila.'],
  ['exo-', 'Outward or outside.', 'Hacia fuera o externo.', 'Exocrine — releasing a secretion through a duct.', 'Exocrino — libera una secreción por un conducto.'],
  ['extra-', 'Outside or beyond.', 'Fuera de o más allá de.', 'Extracellular — outside a cell.', 'Extracelular — fuera de una célula.', 'ex-'],
  ['hemi-', 'Half.', 'Mitad.', 'Hemisphere — one half of the cerebrum.', 'Hemisferio — una mitad del cerebro.'],
  ['hetero-', 'Different or other.', 'Diferente u otro.', 'Heterogeneous — made up of different kinds.', 'Heterogéneo — formado por tipos diferentes.'],
  ['homo-', 'Same or alike.', 'Igual o semejante.', 'Homogeneous — uniform in composition.', 'Homogéneo — de composición uniforme.'],
  ['hyper-', 'Above normal or excessive.', 'Por encima de lo normal o excesivo.', 'Hyperglycemia — an elevated blood glucose level.', 'Hiperglucemia — concentración elevada de glucosa en sangre.'],
  ['hypo-', 'Below normal, deficient, or beneath.', 'Por debajo de lo normal, deficiente o debajo.', 'Hypodermic — beneath the skin.', 'Hipodérmico — debajo de la piel.'],
  ['infra-', 'Below or beneath.', 'Debajo de.', 'Infraorbital — below the eye socket.', 'Infraorbitario — debajo de la órbita.'],
  ['inter-', 'Between.', 'Entre.', 'Intercostal — between the ribs.', 'Intercostal — entre las costillas.'],
  ['intra-', 'Within.', 'Dentro de.', 'Intracellular — within a cell.', 'Intracelular — dentro de una célula.'],
  ['iso-', 'Equal or the same.', 'Igual o el mismo.', 'Isometric — involving unchanged muscle length.', 'Isométrico — con longitud muscular constante.'],
  ['macro-', 'Large.', 'Grande.', 'Macroscopic — visible without magnification.', 'Macroscópico — visible sin aumento.'],
  ['mal-', 'Bad or abnormal.', 'Malo o anormal.', 'Malformation — abnormal development of a structure.', 'Malformación — desarrollo anormal de una estructura.'],
  ['mega-', 'Large or enlarged.', 'Grande o aumentado.', 'Megakaryocyte — a large bone-marrow cell that produces platelets.', 'Megacariocito — célula grande de la médula ósea que produce plaquetas.', 'megal-|megalo-'],
  ['meso-', 'Middle.', 'Medio.', 'Mesoderm — the middle embryonic germ layer.', 'Mesodermo — capa germinal embrionaria media.'],
  ['meta-', 'Change, beyond, or after, depending on the word.', 'Cambio, más allá de o después de, según la palabra.', 'Metaplasia — change from one mature cell type to another.', 'Metaplasia — cambio de un tipo celular maduro a otro.'],
  ['micro-', 'Small.', 'Pequeño.', 'Microscopic — requiring magnification to see clearly.', 'Microscópico — requiere aumento para verse claramente.'],
  ['mono-', 'One or single.', 'Uno o único.', 'Mononuclear — having one nucleus.', 'Mononuclear — con un núcleo.', 'mon-'],
  ['multi-', 'Many.', 'Muchos.', 'Multinucleated — having many nuclei.', 'Multinucleado — con muchos núcleos.'],
  ['neo-', 'New.', 'Nuevo.', 'Neonatal — relating to a newborn.', 'Neonatal — relativo a un recién nacido.'],
  ['oligo-', 'Few or little.', 'Pocos o escaso.', 'Oliguria — unusually low urine output.', 'Oliguria — producción de orina inusualmente baja.', 'olig-'],
  ['pan-', 'All or throughout.', 'Todo o en todas partes.', 'Pancytopenia — reduced numbers of all major blood-cell types.', 'Pancitopenia — reducción de los principales tipos de células sanguíneas.', 'panto-|pant-'],
  ['para-', 'Beside or near; sometimes abnormal, depending on the word.', 'Al lado de o cerca; a veces anormal, según la palabra.', 'Parathyroid — next to the thyroid gland.', 'Paratiroideo — junto a la glándula tiroides.'],
  ['per-', 'Through.', 'A través de.', 'Percutaneous — through the skin.', 'Percutáneo — a través de la piel.'],
  ['peri-', 'Around or surrounding.', 'Alrededor de.', 'Pericardium — the sac surrounding the heart.', 'Pericardio — saco que rodea el corazón.'],
  ['poly-', 'Many or much.', 'Muchos o mucho.', 'Polyuria — unusually high urine output.', 'Poliuria — producción de orina inusualmente alta.'],
  ['post-', 'After or behind.', 'Después de o detrás de.', 'Postnatal — after birth.', 'Posnatal — después del nacimiento.'],
  ['pre-', 'Before or in front of.', 'Antes de o delante de.', 'Prenatal — before birth.', 'Prenatal — antes del nacimiento.'],
  ['pseudo-', 'False or resembling without being the same.', 'Falso o semejante sin ser lo mismo.', 'Pseudostratified — appears layered, although every cell contacts the basement membrane.', 'Seudoestratificado — parece tener capas, aunque todas las células contactan la membrana basal.'],
  ['re-', 'Again or backward.', 'De nuevo o hacia atrás.', 'Reabsorption — uptake again, as from a kidney tubule into blood.', 'Reabsorción — captación de nuevo, como del túbulo renal a la sangre.'],
  ['retro-', 'Behind or backward.', 'Detrás de o hacia atrás.', 'Retroperitoneal — behind the peritoneum.', 'Retroperitoneal — detrás del peritoneo.'],
  ['semi-', 'Half or partial.', 'Mitad o parcial.', 'Semilunar — shaped like a half-moon.', 'Semilunar — con forma de media luna.'],
  ['sub-', 'Under or beneath.', 'Debajo de.', 'Subcutaneous — beneath the skin.', 'Subcutáneo — debajo de la piel.'],
  ['supra-', 'Above.', 'Encima de.', 'Suprarenal — above the kidney.', 'Suprarrenal — encima del riñón.', 'super-'],
  ['syn-', 'Together; sym- is a related form.', 'Junto; sym- es una forma relacionada.', 'Synarthrosis — a joint allowing little or no movement.', 'Sinartrosis — articulación con poco o ningún movimiento.', 'sym-'],
  ['tachy-', 'Fast or rapid.', 'Rápido.', 'Tachycardia — a faster-than-normal heart rate.', 'Taquicardia — frecuencia cardíaca más rápida de lo normal.'],
  ['tetra-', 'Four.', 'Cuatro.', 'Tetraplegia — paralysis affecting all four limbs.', 'Tetraplejía — parálisis que afecta las cuatro extremidades.', 'quadri-'],
  ['trans-', 'Across or through.', 'A través de.', 'Transverse — oriented across the long axis.', 'Transverso — orientado a través del eje largo.'],
  ['tri-', 'Three.', 'Tres.', 'Triceps — a muscle with three heads of origin.', 'Tríceps — músculo con tres cabezas de origen.'],
  ['uni-', 'One.', 'Uno.', 'Unilateral — on one side.', 'Unilateral — en un lado.'],
];

const roots: readonly Row[] = [
  ['acetabul/o', 'Acetabulum: the hip socket.', 'Acetábulo: la cavidad de la cadera.', 'Acetabular — relating to the hip socket.', 'Acetabular — relativo al acetábulo.', 'acetabul-'],
  ['aden/o', 'Gland.', 'Glándula.', 'Adenoma — a tumor with glandular origin or features.', 'Adenoma — tumor de origen o características glandulares.', 'aden-|adeno-'],
  ['adip/o', 'Fat.', 'Grasa.', 'Adipocyte — a fat-storing cell.', 'Adipocito — célula que almacena grasa.', 'adip-|adipo-'],
  ['adren/o', 'Adrenal gland.', 'Glándula suprarrenal.', 'Adrenal — relating to a gland above a kidney.', 'Suprarrenal — relativo a una glándula situada encima del riñón.', 'adren-|adreno-'],
  ['angi/o', 'Vessel, usually a blood or lymphatic vessel.', 'Vaso, habitualmente sanguíneo o linfático.', 'Angiography — imaging of blood vessels.', 'Angiografía — obtención de imágenes de vasos sanguíneos.', 'angi-|angio-'],
  ['arteri/o', 'Artery.', 'Arteria.', 'Arterial — relating to an artery.', 'Arterial — relativo a una arteria.', 'arteri-|arterio-'],
  ['arthr/o', 'Joint.', 'Articulación.', 'Arthritis — inflammation of a joint.', 'Artritis — inflamación de una articulación.', 'arthr-|arthro-'],
  ['bio-', 'Life.', 'Vida.', 'Biology — the study of living things.', 'Biología — estudio de los seres vivos.'],
  ['blephar/o', 'Eyelid.', 'Párpado.', 'Blepharitis — inflammation of the eyelid.', 'Blefaritis — inflamación del párpado.', 'blephar-|blepharo-'],
  ['bronch/o', 'Bronchus: an airway branching from the trachea.', 'Bronquio: vía aérea que se ramifica desde la tráquea.', 'Bronchial — relating to the bronchi.', 'Bronquial — relativo a los bronquios.', 'bronch-|broncho-|bronchi-'],
  ['bucc/o', 'Cheek.', 'Mejilla.', 'Buccal — relating to the cheek.', 'Bucal — relativo a la mejilla.', 'bucc-|bucco-'],
  ['burs/o', 'Bursa: a small fluid-filled sac that reduces friction.', 'Bursa: pequeño saco con líquido que reduce la fricción.', 'Bursitis — inflammation of a bursa.', 'Bursitis — inflamación de una bursa.', 'burs-|burso-'],
  ['cardi/o', 'Heart.', 'Corazón.', 'Cardiology — the study of the heart.', 'Cardiología — estudio del corazón.', 'cardi-|cardio-'],
  ['cephal/o', 'Head.', 'Cabeza.', 'Cephalic — relating to the head.', 'Cefálico — relativo a la cabeza.', 'cephal-|cephalo-'],
  ['chondr/o', 'Cartilage.', 'Cartílago.', 'Chondrocyte — a cartilage cell.', 'Condrocito — célula del cartílago.', 'chondr-|chondro-'],
  ['cost/o', 'Rib.', 'Costilla.', 'Intercostal — between the ribs.', 'Intercostal — entre las costillas.', 'cost-|costo-'],
  ['crani/o', 'Skull.', 'Cráneo.', 'Cranial — relating to the skull.', 'Craneal — relativo al cráneo.', 'crani-|cranio-'],
  ['cutane/o', 'Skin.', 'Piel.', 'Subcutaneous — beneath the skin.', 'Subcutáneo — debajo de la piel.', 'cutane-|cutaneo-'],
  ['cyst/o', 'Bladder, cyst, or sac; context determines the meaning.', 'Vejiga, quiste o saco; el contexto determina el significado.', 'Cystitis — inflammation of the urinary bladder.', 'Cistitis — inflamación de la vejiga urinaria.', 'cyst-|cysto-|cysti-'],
  ['cyt/o', 'Cell.', 'Célula.', 'Cytology — the study of cells.', 'Citología — estudio de las células.', 'cyt-|cyto-'],
  ['dactyl/o', 'Finger or toe.', 'Dedo de la mano o del pie.', 'Polydactyly — having extra fingers or toes.', 'Polidactilia — presencia de dedos adicionales.', 'dactyl-|dactylo-'],
  ['dermat/o', 'Skin.', 'Piel.', 'Dermatitis — inflammation of the skin.', 'Dermatitis — inflamación de la piel.', 'derm-|dermat-|dermato-|dermo-'],
  ['duoden/o', 'Duodenum: the first segment of the small intestine.', 'Duodeno: primer segmento del intestino delgado.', 'Duodenal — relating to the duodenum.', 'Duodenal — relativo al duodeno.', 'duodeno-'],
  ['encephal/o', 'Brain.', 'Encéfalo.', 'Encephalitis — inflammation of the brain.', 'Encefalitis — inflamación del encéfalo.', 'encephal-|encephalo-'],
  ['enter/o', 'Intestine, often the small intestine.', 'Intestino, a menudo el intestino delgado.', 'Enteritis — inflammation of the intestine.', 'Enteritis — inflamación del intestino.', 'enter-|entero-'],
  ['erythr/o', 'Red.', 'Rojo.', 'Erythrocyte — a red blood cell.', 'Eritrocito — glóbulo rojo.', 'erythr-|erythro-'],
  ['fibr/o', 'Fiber or fibrous tissue.', 'Fibra o tejido fibroso.', 'Fibroblast — a cell that makes connective-tissue fibers.', 'Fibroblasto — célula que produce fibras de tejido conjuntivo.', 'fibr-|fibro-'],
  ['gastr/o', 'Stomach.', 'Estómago.', 'Gastric — relating to the stomach.', 'Gástrico — relativo al estómago.', 'gastr-|gastro-'],
  ['gloss/o', 'Tongue.', 'Lengua.', 'Glossitis — inflammation of the tongue.', 'Glositis — inflamación de la lengua.', 'gloss-|glosso-'],
  ['glyc/o', 'Sugar, often glucose.', 'Azúcar, a menudo glucosa.', 'Hyperglycemia — elevated glucose in the blood.', 'Hiperglucemia — glucosa elevada en sangre.', 'glyco-|gluc/o|gluco-'],
  ['hemat/o', 'Blood.', 'Sangre.', 'Hematology — the study of blood.', 'Hematología — estudio de la sangre.', 'hemat-|hemato-|hem/o|hemo-|hem-|hema-'],
  ['hepat/o', 'Liver.', 'Hígado.', 'Hepatic — relating to the liver.', 'Hepático — relativo al hígado.', 'hepat-|hepato-|hepatico-'],
  ['hist/o', 'Tissue.', 'Tejido.', 'Histology — the study of tissues.', 'Histología — estudio de los tejidos.', 'hist-|histo-|histio-'],
  ['hydr/o', 'Water; do not confuse with hidr/o, meaning sweat.', 'Agua; no confundir con hidr/o, que significa sudor.', 'Hydrocephalus — excessive cerebrospinal fluid in brain ventricles.', 'Hidrocefalia — exceso de líquido cefalorraquídeo en los ventrículos encefálicos.', 'hydr-|hydro-'],
  ['hidr/o', 'Sweat; distinct from hydr/o, meaning water.', 'Sudor; diferente de hydr/o, que significa agua.', 'Hyperhidrosis — excessive sweating.', 'Hiperhidrosis — sudoración excesiva.', 'hidr-|hidro-'],
  ['hyster/o', 'Uterus.', 'Útero.', 'Hysterectomy — surgical removal of the uterus.', 'Histerectomía — extirpación quirúrgica del útero.', 'hyster-|hystero-'],
  ['ile/o', 'Ileum: the final segment of the small intestine, not the hip bone.', 'Íleon: segmento final del intestino delgado, no el hueso coxal.', 'Ileal — relating to the ileum.', 'Ileal — relativo al íleon.', 'ileo-'],
  ['ili/o', 'Ilium: the broad upper part of the hip bone, not the intestine.', 'Ilion: parte superior y ancha del hueso coxal, no el intestino.', 'Iliac — relating to the ilium.', 'Ilíaco — relativo al ilion.', 'ilio-'],
  ['irid/o', 'Iris: the colored part of the eye.', 'Iris: parte coloreada del ojo.', 'Iridectomy — removal of part of the iris.', 'Iridectomía — extirpación de parte del iris.', 'irid-|irido-'],
  ['ischi/o', 'Ischium: the lower posterior part of the hip bone.', 'Isquion: parte posteroinferior del hueso coxal.', 'Ischial — relating to the ischium.', 'Isquiático — relativo al isquion.', 'ischi-|ischio-'],
  ['kary/o', 'Cell nucleus.', 'Núcleo celular.', 'Karyotype — the chromosome complement of a cell.', 'Cariotipo — conjunto de cromosomas de una célula.', 'karyo-'],
  ['kerat/o', 'Cornea or hard, keratinized tissue; context matters.', 'Córnea o tejido duro queratinizado; depende del contexto.', 'Keratitis — inflammation of the cornea.', 'Queratitis — inflamación de la córnea.', 'kerat-|kerato-'],
  ['lacrim/o', 'Tear or tear-producing structures.', 'Lágrima o estructuras que la producen.', 'Lacrimal — relating to tears.', 'Lagrimal — relativo a las lágrimas.', 'lacrim-|lacrimo-'],
  ['laryng/o', 'Larynx: the voice box.', 'Laringe.', 'Laryngitis — inflammation of the larynx.', 'Laringitis — inflamación de la laringe.', 'laryng-|laryngo-'],
  ['leuk/o', 'White.', 'Blanco.', 'Leukocyte — a white blood cell.', 'Leucocito — glóbulo blanco.', 'leuk-|leuko-'],
  ['lingu/o', 'Tongue.', 'Lengua.', 'Sublingual — beneath the tongue.', 'Sublingual — debajo de la lengua.', 'lingu-|linguo-'],
  ['lip/o', 'Fat.', 'Grasa.', 'Lipoma — a tumor made of fat tissue.', 'Lipoma — tumor formado por tejido adiposo.', 'lip-|lipo-'],
  ['lymph/o', 'Lymph or the lymphatic system.', 'Linfa o sistema linfático.', 'Lymphatic — relating to lymph.', 'Linfático — relativo a la linfa.', 'lymph-|lympho-'],
  ['mamm/o', 'Breast.', 'Mama.', 'Mammary — relating to the breast.', 'Mamario — relativo a la mama.', 'mamm-|mammo-|mast/o|masto-'],
  ['melan/o', 'Black or dark pigment.', 'Negro o pigmento oscuro.', 'Melanocyte — a cell that produces melanin.', 'Melanocito — célula que produce melanina.', 'melan-|melano-'],
  ['mening/o', 'Meninges: the membranes around the brain and spinal cord.', 'Meninges: membranas que rodean el encéfalo y la médula espinal.', 'Meningitis — inflammation of the meninges.', 'Meningitis — inflamación de las meninges.', 'mening-|meningo-'],
  ['my/o', 'Muscle.', 'Músculo.', 'Myocyte — a muscle cell.', 'Miocito — célula muscular.', 'my-|myo-'],
  ['myel/o', 'Spinal cord or bone marrow; the full word determines which.', 'Médula espinal o médula ósea; la palabra completa determina cuál.', 'Myelitis — inflammation of the spinal cord; myelopoiesis — production of marrow-derived blood cells.', 'Mielitis — inflamación de la médula espinal; mielopoyesis — producción de células sanguíneas derivadas de la médula ósea.', 'myel-|myelo-'],
  ['nephr/o', 'Kidney.', 'Riñón.', 'Nephron — the functional unit of a kidney.', 'Nefrona — unidad funcional del riñón.', 'nephr-|nephro-'],
  ['neur/o', 'Nerve or nervous tissue.', 'Nervio o tejido nervioso.', 'Neural — relating to nerves.', 'Neural — relativo a los nervios.', 'neur-|neuro-|neuri-'],
  ['ocul/o', 'Eye.', 'Ojo.', 'Ocular — relating to the eye.', 'Ocular — relativo al ojo.', 'oculo-'],
  ['odont/o', 'Tooth.', 'Diente.', 'Odontoblast — a cell that forms dentin.', 'Odontoblasto — célula que forma dentina.', 'odont-|odonto-'],
  ['oophor/o', 'Ovary.', 'Ovario.', 'Oophorectomy — surgical removal of an ovary.', 'Ooforectomía — extirpación quirúrgica de un ovario.', 'oophor-|oophoro-'],
  ['ophthalm/o', 'Eye.', 'Ojo.', 'Ophthalmic — relating to the eye.', 'Oftálmico — relativo al ojo.', 'ophthalm-|ophthalmo-'],
  ['orchid/o', 'Testis.', 'Testículo.', 'Orchidectomy — surgical removal of a testis.', 'Orquiectomía — extirpación quirúrgica de un testículo.', 'orchid-|orchido-|orchi/o|orchio-'],
  ['oste/o', 'Bone.', 'Hueso.', 'Osteocyte — a mature bone cell.', 'Osteocito — célula ósea madura.', 'ost-|oste-|osteo-|osse/o|osseo-|ossi-'],
  ['ot/o', 'Ear.', 'Oído.', 'Otitis — inflammation of the ear.', 'Otitis — inflamación del oído.', 'ot-|oto-'],
  ['pharyng/o', 'Pharynx: the throat passage.', 'Faringe: conducto de la garganta.', 'Pharyngeal — relating to the pharynx.', 'Faríngeo — relativo a la faringe.', 'pharyng-|pharyngo-'],
  ['phleb/o', 'Vein.', 'Vena.', 'Phlebitis — inflammation of a vein.', 'Flebitis — inflamación de una vena.', 'phleb-|phlebo-'],
  ['phren/o', 'Diaphragm in anatomical terms.', 'Diafragma en términos anatómicos.', 'Phrenic nerve — the nerve supplying the diaphragm.', 'Nervio frénico — nervio que inerva el diafragma.', 'phren-|phreno-|phreni-'],
  ['pleur/o', 'Pleura: the membrane covering the lungs and lining the chest cavity.', 'Pleura: membrana que recubre los pulmones y reviste la cavidad torácica.', 'Pleural — relating to the pleura.', 'Pleural — relativo a la pleura.', 'pleur-|pleuro-'],
  ['pneum/o', 'Air or lung, depending on the word.', 'Aire o pulmón, según la palabra.', 'Pneumothorax — air in the pleural space.', 'Neumotórax — aire en el espacio pleural.', 'pneum-|pneumo-|pneumat/o|pneumato-'],
  ['pod/o', 'Foot.', 'Pie.', 'Podiatry — care of the feet.', 'Podología — atención de los pies.', 'pod-|podo-'],
  ['proct/o', 'Anus or rectum.', 'Ano o recto.', 'Proctitis — inflammation of the rectum.', 'Proctitis — inflamación del recto.', 'proct-|procto-'],
  ['pyel/o', 'Renal pelvis: the collecting region within a kidney, not the bony pelvis.', 'Pelvis renal: región colectora del riñón, no la pelvis ósea.', 'Pyelitis — inflammation of the renal pelvis.', 'Pielitis — inflamación de la pelvis renal.', 'pyel-|pyelo-'],
  ['ren/o', 'Kidney.', 'Riñón.', 'Renal — relating to a kidney.', 'Renal — relativo al riñón.', 'ren-|reno-'],
  ['retin/o', 'Retina: the light-sensitive tissue of the eye.', 'Retina: tejido del ojo sensible a la luz.', 'Retinal — relating to the retina.', 'Retiniano — relativo a la retina.', 'retin-|retino-'],
  ['rhin/o', 'Nose.', 'Nariz.', 'Rhinitis — inflammation of the nasal lining.', 'Rinitis — inflamación del revestimiento nasal.', 'rhin-|rhino-'],
  ['salping/o', 'Tube; often the uterine tube, sometimes the auditory tube.', 'Tubo; a menudo la trompa uterina, a veces la trompa auditiva.', 'Salpingitis — inflammation of a uterine tube.', 'Salpingitis — inflamación de una trompa uterina.', 'salping-|salpingo-'],
  ['somat/o', 'Body.', 'Cuerpo.', 'Somatic — relating to the body.', 'Somático — relativo al cuerpo.', 'somat-|somato-'],
  ['splanchn/o', 'Viscera: internal organs.', 'Vísceras: órganos internos.', 'Splanchnic nerves — nerves associated with internal organs.', 'Nervios esplácnicos — nervios asociados a órganos internos.', 'splanchn-|splanchno-'],
  ['splen/o', 'Spleen.', 'Bazo.', 'Splenic — relating to the spleen.', 'Esplénico — relativo al bazo.', 'splen-|spleno-'],
  ['spondyl/o', 'Vertebra.', 'Vértebra.', 'Spondylitis — inflammation involving vertebrae.', 'Espondilitis — inflamación que afecta las vértebras.', 'spondyl-|spondylo-'],
  ['stern/o', 'Sternum: the breastbone.', 'Esternón.', 'Sternal — relating to the sternum.', 'Esternal — relativo al esternón.', 'stern-|sterno-'],
  ['stomat/o', 'Mouth.', 'Boca.', 'Stomatitis — inflammation of the mouth lining.', 'Estomatitis — inflamación del revestimiento de la boca.', 'stom-|stomat-|stomato-'],
  ['thorac/o', 'Chest.', 'Tórax.', 'Thoracic — relating to the chest.', 'Torácico — relativo al tórax.', 'thorac-|thoraco-'],
  ['thromb/o', 'Blood clot.', 'Coágulo sanguíneo.', 'Thrombus — a clot formed within the cardiovascular system.', 'Trombo — coágulo formado dentro del sistema cardiovascular.', 'thromb-|thrombo-'],
  ['thyro-', 'Thyroid gland.', 'Glándula tiroides.', 'Thyroidectomy — surgical removal of thyroid tissue.', 'Tiroidectomía — extirpación quirúrgica de tejido tiroideo.', 'thyr-'],
  ['trache/o', 'Trachea: the windpipe.', 'Tráquea.', 'Tracheal — relating to the trachea.', 'Traqueal — relativo a la tráquea.', 'trache-|tracheo-'],
  ['tympan/o', 'Eardrum or the middle-ear cavity.', 'Tímpano o cavidad del oído medio.', 'Tympanic membrane — the eardrum.', 'Membrana timpánica — el tímpano.', 'tympan-|tympano-|myring/o|myringo-'],
  ['ur/o', 'Urine or the urinary tract.', 'Orina o vías urinarias.', 'Urology — the study of the urinary system and related organs.', 'Urología — estudio del sistema urinario y órganos relacionados.', 'ur-|uro-'],
  ['vascul/o', 'Blood vessel.', 'Vaso sanguíneo.', 'Vascular — relating to blood vessels.', 'Vascular — relativo a los vasos sanguíneos.', 'vasculo-'],
  ['ven/o', 'Vein.', 'Vena.', 'Venous — relating to veins.', 'Venoso — relativo a las venas.', 'ven-|veno-'],
  ['vertebr/o', 'Vertebra or spine.', 'Vértebra o columna vertebral.', 'Vertebral — relating to vertebrae.', 'Vertebral — relativo a las vértebras.', 'vertebr-|vertebro-'],
];

const suffixes: readonly Row[] = [
  ['-al', 'Of or relating to.', 'Perteneciente o relativo a.', 'Renal — relating to the kidney.', 'Renal — relativo al riñón.'],
  ['-ar', 'Of or relating to.', 'Perteneciente o relativo a.', 'Acetabular — relating to the acetabulum, the hip socket.', 'Acetabular — relativo al acetábulo, la cavidad de la cadera.'],
  ['-ary', 'Of or relating to.', 'Perteneciente o relativo a.', 'Pulmonary — relating to the lungs.', 'Pulmonar — relativo a los pulmones.'],
  ['-ac', 'Of or relating to.', 'Perteneciente o relativo a.', 'Cardiac — relating to the heart.', 'Cardíaco — relativo al corazón.'],
  ['-eal', 'Of or relating to.', 'Perteneciente o relativo a.', 'Laryngeal — relating to the larynx.', 'Laríngeo — relativo a la laringe.'],
  ['-ial', 'Of or relating to.', 'Perteneciente o relativo a.', 'Bronchial — relating to the bronchi.', 'Bronquial — relativo a los bronquios.'],
  ['-ic', 'Of or relating to.', 'Perteneciente o relativo a.', 'Gastric — relating to the stomach.', 'Gástrico — relativo al estómago.', '-ical'],
  ['-ous', 'Of or relating to; having the character of.', 'Relativo a; que tiene las características de.', 'Venous — relating to veins.', 'Venoso — relativo a las venas.'],
  ['-blast', 'An immature or precursor cell.', 'Célula inmadura o precursora.', 'Osteoblast — a cell that forms bone.', 'Osteoblasto — célula que forma hueso.', '-blastic'],
  ['-cele', 'A protrusion, hernia, or swelling.', 'Protrusión, hernia o hinchazón.', 'Meningocele — protrusion of the meninges through a defect.', 'Meningocele — protrusión de las meninges a través de un defecto.'],
  ['-centesis', 'Puncture to withdraw fluid.', 'Punción para extraer líquido.', 'Arthrocentesis — needle withdrawal of fluid from a joint.', 'Artrocentesis — extracción con aguja de líquido de una articulación.'],
  ['-cyte', 'Cell.', 'Célula.', 'Erythrocyte — a red blood cell.', 'Eritrocito — glóbulo rojo.', '-cytic'],
  ['-desis', 'Binding or surgical fusion.', 'Unión o fusión quirúrgica.', 'Arthrodesis — surgical fusion of a joint.', 'Artrodesis — fusión quirúrgica de una articulación.'],
  ['-dynia', 'Pain.', 'Dolor.', 'Mastodynia — breast pain.', 'Mastodinia — dolor mamario.', '-odynia|-algia'],
  ['-ectasis', 'Dilation or expansion.', 'Dilatación o expansión.', 'Bronchiectasis — persistent widening of bronchi.', 'Bronquiectasia — ensanchamiento persistente de los bronquios.'],
  ['-ectomy', 'Surgical removal.', 'Extirpación quirúrgica.', 'Appendectomy — surgical removal of the appendix.', 'Apendicectomía — extirpación quirúrgica del apéndice.'],
  ['-emia', 'A condition involving the blood.', 'Condición relacionada con la sangre.', 'Hyperglycemia — excessive glucose in the blood.', 'Hiperglucemia — exceso de glucosa en sangre.'],
  ['-gram', 'A record or recorded image.', 'Registro o imagen registrada.', 'Electrocardiogram — a record of the heart’s electrical activity.', 'Electrocardiograma — registro de la actividad eléctrica del corazón.'],
  ['-graphy', 'The process of recording or imaging.', 'Proceso de registrar u obtener imágenes.', 'Angiography — imaging of blood vessels.', 'Angiografía — obtención de imágenes de vasos sanguíneos.'],
  ['-ia', 'State or condition.', 'Estado o condición.', 'Anemia — a condition with reduced hemoglobin or red-cell mass.', 'Anemia — condición con hemoglobina o masa de glóbulos rojos reducida.'],
  ['-iasis', 'A condition, often involving formation or presence of something.', 'Condición, a menudo con formación o presencia de algo.', 'Cholelithiasis — the presence of gallstones.', 'Colelitiasis — presencia de cálculos biliares.'],
  ['-ism', 'State or condition.', 'Estado o condición.', 'Hyperthyroidism — excessive thyroid hormone activity.', 'Hipertiroidismo — actividad excesiva de hormonas tiroideas.'],
  ['-itis', 'Inflammation; this does not by itself specify the cause.', 'Inflamación; por sí sola no especifica la causa.', 'Arthritis — inflammation of a joint.', 'Artritis — inflamación de una articulación.'],
  ['-ium', 'A structure or tissue.', 'Estructura o tejido.', 'Pericardium — the sac around the heart.', 'Pericardio — saco que rodea el corazón.'],
  ['-logy', 'The study of.', 'Estudio de.', 'Histology — the study of tissues.', 'Histología — estudio de los tejidos.', '-ology'],
  ['-lysis', 'Breakdown, separation, or dissolution.', 'Descomposición, separación o disolución.', 'Hemolysis — breakdown of red blood cells.', 'Hemólisis — destrucción de glóbulos rojos.', '-lytic'],
  ['-malacia', 'Abnormal softening.', 'Reblandecimiento anormal.', 'Osteomalacia — softening of bone due to impaired mineralization.', 'Osteomalacia — reblandecimiento óseo por mineralización alterada.'],
  ['-megaly', 'Enlargement.', 'Aumento de tamaño.', 'Hepatomegaly — an enlarged liver.', 'Hepatomegalia — aumento del tamaño del hígado.'],
  ['-meter', 'An instrument for measuring.', 'Instrumento de medición.', 'Spirometer — an instrument measuring inhaled or exhaled air volumes.', 'Espirómetro — instrumento que mide volúmenes de aire inhalado o exhalado.'],
  ['-metry', 'The process of measuring.', 'Proceso de medición.', 'Spirometry — measurement of breathing volumes and airflow.', 'Espirometría — medición de volúmenes respiratorios y flujo de aire.'],
  ['-oid', 'Resembling or shaped like.', 'Semejante a o con forma de.', 'Deltoid — shaped like the Greek letter delta.', 'Deltoides — con forma de la letra griega delta.'],
  ['-oma', 'Tumor or mass; not automatically cancer.', 'Tumor o masa; no implica automáticamente cáncer.', 'Lipoma — a usually benign mass of fat tissue.', 'Lipoma — masa de tejido adiposo habitualmente benigna.'],
  ['-osis', 'A condition or process, often abnormal.', 'Condición o proceso, a menudo anormal.', 'Cyanosis — bluish coloration related to increased deoxygenated hemoglobin.', 'Cianosis — coloración azulada relacionada con aumento de hemoglobina desoxigenada.'],
  ['-ostomy', 'Creation of an opening.', 'Creación de una abertura.', 'Tracheostomy — creation of an opening into the trachea.', 'Traqueostomía — creación de una abertura en la tráquea.', '-stomy'],
  ['-otomy', 'Cutting into or making an incision.', 'Realización de un corte o incisión.', 'Tracheotomy — an incision into the trachea.', 'Traqueotomía — incisión en la tráquea.', '-tomy'],
  ['-pathy', 'Disease or disorder.', 'Enfermedad o trastorno.', 'Neuropathy — a disorder of nerves.', 'Neuropatía — trastorno de los nervios.'],
  ['-penia', 'A deficiency or reduced number.', 'Deficiencia o número reducido.', 'Leukopenia — a reduced white blood cell count.', 'Leucopenia — recuento reducido de glóbulos blancos.'],
  ['-pexy', 'Surgical fixation.', 'Fijación quirúrgica.', 'Nephropexy — surgical fixation of a kidney.', 'Nefropexia — fijación quirúrgica de un riñón.'],
  ['-phagia', 'Eating or swallowing.', 'Comer o deglutir.', 'Dysphagia — difficulty swallowing.', 'Disfagia — dificultad para tragar.', '-phagy'],
  ['-phasia', 'Speech.', 'Habla.', 'Aphasia — impairment of language ability.', 'Afasia — alteración de la capacidad lingüística.'],
  ['-plasia', 'Formation, development, or growth.', 'Formación, desarrollo o crecimiento.', 'Hyperplasia — increased tissue size due to more cells.', 'Hiperplasia — aumento del tamaño de un tejido por mayor número de células.', '-plastic'],
  ['-plasty', 'Surgical repair or reconstruction.', 'Reparación o reconstrucción quirúrgica.', 'Arthroplasty — surgical reconstruction or replacement of a joint.', 'Artroplastia — reconstrucción o sustitución quirúrgica de una articulación.'],
  ['-plegia', 'Paralysis.', 'Parálisis.', 'Hemiplegia — paralysis affecting one side of the body.', 'Hemiplejía — parálisis que afecta un lado del cuerpo.'],
  ['-pnea', 'Breathing.', 'Respiración.', 'Apnea — a pause or absence of breathing.', 'Apnea — pausa o ausencia de respiración.'],
  ['-poiesis', 'Production or formation.', 'Producción o formación.', 'Hematopoiesis — production of blood cells.', 'Hematopoyesis — producción de células sanguíneas.'],
  ['-ptosis', 'Drooping or downward displacement.', 'Caída o desplazamiento hacia abajo.', 'Blepharoptosis — drooping of the upper eyelid.', 'Blefaroptosis — caída del párpado superior.'],
  ['-rrhea', 'Flow or discharge.', 'Flujo o secreción.', 'Rhinorrhea — nasal discharge.', 'Rinorrea — secreción nasal.'],
  ['-sclerosis', 'Hardening.', 'Endurecimiento.', 'Arteriosclerosis — hardening of arterial walls.', 'Arteriosclerosis — endurecimiento de las paredes arteriales.'],
  ['-scope', 'An instrument for viewing.', 'Instrumento para observar.', 'Endoscope — an instrument for viewing inside the body.', 'Endoscopio — instrumento para observar el interior del cuerpo.'],
  ['-scopy', 'The process of viewing or examining.', 'Proceso de observar o examinar.', 'Endoscopy — examination inside the body using a viewing instrument.', 'Endoscopia — exploración del interior del cuerpo con un instrumento óptico.'],
  ['-stasis', 'Stopping, standing still, or maintaining a stable state.', 'Detención o mantenimiento de un estado estable.', 'Hemostasis — stopping bleeding.', 'Hemostasia — detención de una hemorragia.'],
  ['-trophy', 'Nourishment, development, or growth.', 'Nutrición, desarrollo o crecimiento.', 'Hypertrophy — enlargement due to increased cell size.', 'Hipertrofia — aumento de tamaño debido a células más grandes.'],
  ['-uria', 'A urine-related condition or presence of something in urine.', 'Condición urinaria o presencia de algo en la orina.', 'Hematuria — blood in the urine.', 'Hematuria — sangre en la orina.'],
];

export const wordParts: readonly WordPart[] = [
  ...prefixes.map((row) => ({ row, kind: 'prefix' as const })),
  ...roots.map((row) => ({ row, kind: 'root' as const })),
  ...suffixes.map((row) => ({ row, kind: 'suffix' as const })),
].map(({ row: [form, meaning, spanishMeaning, example, spanishExample, aliases], kind }) => ({
  id: `${kind}-${form.replace(/[^a-z]/g, '')}`, kind, form,
  meaning, spanishMeaning, example, spanishExample,
  aliases: aliases?.split('|') ?? [],
}));

export function wordPartCopy(part: WordPart, language: 'en' | 'es') {
  return {
    meaning: language === 'es' ? part.spanishMeaning : part.meaning,
    example: language === 'es' ? part.spanishExample : part.example,
    kind: language === 'es'
      ? { prefix: 'Prefijo', root: 'Raíz / forma combinante', suffix: 'Sufijo' }[part.kind]
      : { prefix: 'Prefix', root: 'Root / combining form', suffix: 'Suffix' }[part.kind],
  };
}

function normalizePart(value: string) {
  return normalizeSearchText(value.replace(/[-/]/g, ''));
}

export function searchWordParts(query: string, language: 'en' | 'es' = 'en', limit = 12): WordPart[] {
  const normalized = normalizePart(query);
  if (!normalized) return [];
  const explicitlySuffix = query.trim().startsWith('-');
  const explicitlyPrefix = query.trim().endsWith('-') && !explicitlySuffix;
  const scored = wordParts.flatMap((part) => {
    if (explicitlySuffix && part.kind !== 'suffix') return [];
    if (explicitlyPrefix && part.kind === 'suffix') return [];
    const forms = [part.form, ...part.aliases].map(normalizePart);
    const exact = forms.includes(normalized);
    const partial = normalized.length >= 2 && forms.some((form) => form.startsWith(normalized));
    const copy = wordPartCopy(part, language);
    const meaningMatch = normalized.length >= 3 && normalizeSearchText(copy.meaning).includes(normalized);
    // Do not guess a word decomposition just because a full word begins with a root.
    if (!exact && !partial && !meaningMatch) return [];
    return [{ part, score: exact ? 0 : partial ? 1 : 2 }];
  });
  return scored.sort((a, b) => a.score - b.score || a.part.form.localeCompare(b.part.form))
    .slice(0, limit).map(({ part }) => part);
}
