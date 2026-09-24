import type { Asset, Module, SourceRecord } from './model';

// Individual, older Commons files were checked, rather than assuming that
// today's OpenStax site or its other figures carry the same license.
const figures = [
  {
    key: 'heart-valves', filename: '2011 Heart Valves.jpg', hash: 'a47a1417bca0a29b588af0e2c330bf112537d92289d7e3027400066a9244f177',
    width: 1525, height: 1217, module: 'cardiovascular-system', lesson: 'cv-valves',
    title: 'Four heart valves: posterior view from above',
    description: 'Labeled Study plate of the right and left atrioventricular valves and the aortic and pulmonary semilunar valves. Do not interpret this view as an anterior external-heart photograph.',
    cues: ['From above with posterior at the top, the tricuspid orifice is on the anatomical right of the mitral orifice. The smaller aortic and pulmonary valves have three semilunar cusps; aortic lies behind pulmonary in this drawing.'],
    relationships: ['The tricuspid and mitral valves lie between atria and ventricles. Their leaflets are tethered by chordae tendineae to papillary muscles; the semilunar valves guard the arterial outlets without chordae.'],
    confusions: ['Left and right in a superior view are anatomical positions, not a promise about the viewer’s screen side. A labeled plate is for Study, not an unlabeled identification question.'],
    author: 'OpenStax College',
  },
  {
    key: 'skin-structure', filename: '501 Structure of the skin.jpg', hash: '1f08f33002a885c6c61d11c00de210c0f3becf2b6a841292148b27281c29e61e',
    width: 1200, height: 941, module: 'integumentary-system', lesson: 'skin-layers-strata',
    title: 'Skin: follicles, eccrine gland and layered tissues',
    description: 'Labeled cross-sectional schematic of epidermis, dermis, hypodermis, hair apparatus and sweat-gland duct; it is not histology or a specimen.',
    cues: ['Trace the eccrine sweat-gland duct from a deep coiled gland directly to a surface pore; the sebaceous gland empties beside a hair follicle instead. The hypodermis beneath the dermis contains adipose tissue.'],
    relationships: ['The small oblique arrector pili links dermis and follicle; contraction raises the hair. The deeper Pacinian corpuscle senses vibration and pressure.'],
    confusions: ['The layers shown are a gross schematic, not enough to identify all five microscopic epidermal strata; the labeled image is not a histology slide.'],
    author: 'OpenStax College; J. Gordon Betts, Peter Desaix, Eddie Johnson',
  },
  {
    key: 'nephron', filename: '2611 Blood Flow in the Nephron.jpg', hash: 'dfe4dc0262e76f42826ede3f77737630568e2e1074bced3eb61b8268a8e27d97',
    width: 1379, height: 1946, module: 'urinary-system', lesson: 'urinary-nephron',
    title: 'Nephron: blood supply and tubular route',
    description: 'Labeled Study schematic relating the afferent/efferent arterioles, glomerular capsule, proximal tubule, loop, peritubular network and collecting passage. Not a kidney gross plate.',
    cues: ['Follow blood from the afferent arteriole INTO the glomerular capillaries and OUT by the efferent arteriole; the filtrate enters the capsular space and then the proximal convoluted tubule.'],
    relationships: ['The loop descends and returns before fluid reaches the distal nephron and collecting passage. The nearby peritubular network exchanges materials with the tubules; it is a blood route, not the urinary lumen.'],
    confusions: ['A collecting duct contains tubular fluid, not blood. This schematic is not a microscopic section, so do not assign a stain, species, or magnification.'],
    author: 'OpenStax College',
  },
  {
    key: 'peritoneum', filename: '2403 The PeritoneumN.jpg', hash: '465731f09d40e2bf5ad8db4cdd1fbd47a95f70a41811152d907194b9bcba1d22',
    width: 826, height: 589, module: 'digestive-system', lesson: 'digestive-peritoneum',
    title: 'Peritoneum: labeled transverse abdominal section',
    description: 'Cross-section showing parietal and visceral peritoneum, the potential cavity and relative positions of kidney, pancreas and bowel.',
    cues: ['In the transverse section, the parietal layer lines the body wall, whereas visceral peritoneum turns onto organ surfaces; the narrow potential space between them is the peritoneal cavity.'],
    relationships: ['The kidneys lie posterior to the peritoneal cavity; much of the pancreas is also retroperitoneal. Mesenteries are double folds carrying vessels and nerves to suspended viscera.'],
    confusions: ['Do not confuse the peritoneal cavity with the lumen of the gut or treat the kidneys as intraperitoneal. This is a schematic section, not a specimen.'],
    author: 'OpenStax College',
  },
] as const;
const id = (key: string) => `source-openstax-historical-${key}`;
const fileUrl = (name: string) => `https://commons.wikimedia.org/wiki/File:${name.replaceAll(' ', '_')}`;
export const nonmuscleViewSources: SourceRecord[] = figures.map(f => ({
  id: id(f.key), filename: f.filename, hash: f.hash, pageCount: null,
  title: `${f.author}: ${f.filename.replace('.jpg','')}`,
  courseLabAssociation: null, sourceType: 'image', verificationStatus: 'verified',
  attributionLicenseStatus: 'Individual historical Wikimedia Commons file: CC BY 3.0; not a claim about newer OpenStax editions.',
  notes: `Original labeled image used unchanged as a Study reference; author: ${f.author}. SHA-256 refers to the bundled original JPEG.`,
  sourceUrl: fileUrl(f.filename), licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
}));
export const nonmuscleViewAssets: Asset[] = figures.map(f => ({
  id: `asset-openstax-historical-${f.key}`, sourceId: id(f.key), sourcePage: null,
  localAssetPath: `assets/images/anatomy/openstax-historical-${f.key}-labeled.jpg`,
  assetType: 'diagram', labelStatus: 'labeled',
  attributionLicense: `${f.author}, historical Wikimedia Commons file, CC BY 3.0.`,
  verificationStatus: 'verified', title: f.title, description: f.description,
  sourceUrl: fileUrl(f.filename), rightsUrl: 'https://creativecommons.org/licenses/by/3.0/',
  adaptationNote: 'Downloaded original Commons JPEG; labels and anatomy are unchanged; not used as an unlabeled recall plate.',
  imageAspectRatio: f.width / f.height, imageOrientation: f.width / f.height > 1.1 ? 'landscape' : 'portrait',
}));

export function attachNonmuscleStudyViews(modules: Module[]): Module[] {
  const existing: Record<string, Record<string, string[]>> = {
    'anatomy-foundations': { 'organ-map': ['asset-original-anatomical-planes', 'asset-original-body-cavities'] },
    'lymphatic-system': { 'lymph-node': ['asset-servier-lymph-node-section'] },
    'special-senses': { 'external-middle-ear': ['asset-servier-ear-section'], 'inner-ear': ['asset-servier-ear-section'] },
    'digestive-system': { 'digestive-stomach': ['asset-servier-stomach-section'] },
  };
  return modules.map(module => {
    const attached = figures.filter(f => f.module === module.id);
    return {
      ...module,
      sourceIds: [...new Set([...module.sourceIds, ...attached.map(f => id(f.key))])],
      lessons: module.lessons?.map(lesson => {
        const images = [...(existing[module.id]?.[lesson.id] ?? []), ...attached.filter(f => f.lesson === lesson.id).map(f => `asset-openstax-historical-${f.key}`)];
        const detailed = attached.filter(f => f.lesson === lesson.id);
        return {
          ...lesson,
          assetIds: images.length ? [...new Set([...(lesson.assetIds ?? []), ...images])] : lesson.assetIds,
          sourceIds: [...new Set([...lesson.sourceIds, ...detailed.map(f => id(f.key))])],
          recognitionCues: [...lesson.recognitionCues, ...detailed.flatMap(f => f.cues)],
          relationships: [...lesson.relationships, ...detailed.flatMap(f => f.relationships)],
          commonConfusions: [...lesson.commonConfusions, ...detailed.flatMap(f => f.confusions)],
        };
      }),
    };
  });
}