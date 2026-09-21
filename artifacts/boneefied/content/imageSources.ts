/**
 * The one static asset registry used by both Expo screens.
 *
 * Keep these as static require calls: Metro cannot discover a dynamically
 * constructed require path in a production bundle. The IDs intentionally
 * mirror content.Asset.id, so a published asset can never silently render as
 * an empty image.
 */
export const imageSources: Record<string, number> = {
  'asset-skull-front': require('@/assets/images/anatomy/gray190-skull-front.png'),
  'asset-skull-lateral': require('@/assets/images/anatomy/gray188-skull-lateral.png'),
  'asset-vertebral-column': require('@/assets/images/anatomy/gray111-vertebral-column.png'),
  'asset-cervical-vertebra': require('@/assets/images/anatomy/gray84-cervical-vertebra.png'),
  'asset-gray946-sweat-gland': require('@/assets/images/anatomy/gray946-sweat-gland.png'),
  'asset-gray880-optic-nerve-head': require('@/assets/images/anatomy/gray880-optic-nerve-head.png'),
  'asset-gray491-heart-posterior': require('@/assets/images/anatomy/gray491-heart-posterior.png'),
  'asset-gray1121-posterior-abdominal-wall': require('@/assets/images/anatomy/gray1121-posterior-abdominal-wall.png'),
  'asset-commons-axial-skeleton-blank': require('@/assets/images/anatomy/commons-axial-skeleton-blank.png'),
  'asset-commons-appendicular-skeleton-blank': require('@/assets/images/anatomy/commons-appendicular-skeleton-blank.png'),
  'asset-openstax-spinal-cord-specimen': require('@/assets/images/anatomy/openstax-spinal-cord-specimen.jpg'),
  'asset-commons-simple-squamous-epithelium': require('@/assets/images/anatomy/commons-simple-squamous-epithelium.jpg'),
  'asset-commons-simple-cuboidal-epithelium': require('@/assets/images/anatomy/commons-simple-cuboidal-epithelium.jpg'),
  'asset-commons-simple-columnar-epithelium': require('@/assets/images/anatomy/commons-simple-columnar-epithelium.jpg'),
  'asset-original-cell-overview': require('@/assets/images/anatomy/original-cell-overview.png'),
  'asset-original-mitosis-stages': require('@/assets/images/anatomy/original-mitosis-stages.png'),
  'asset-original-anatomical-planes': require('@/assets/images/anatomy/original-anatomical-planes.png'),
  'asset-original-body-cavities': require('@/assets/images/anatomy/original-body-cavities.png'),
  'asset-servier-elbow-joint': require('@/assets/images/anatomy/servier-elbow-joint.png'),
  'asset-servier-brain-lateral': require('@/assets/images/anatomy/servier-brain-lateral.png'),
  'asset-servier-brain-sagittal': require('@/assets/images/anatomy/servier-brain-sagittal.png'),
  'asset-servier-heart-anterior': require('@/assets/images/anatomy/servier-heart-anterior.png'),
  'asset-servier-stomach-section': require('@/assets/images/anatomy/servier-stomach-section.png'),
  'asset-servier-kidney': require('@/assets/images/anatomy/servier-kidney.png'),
  'asset-servier-thyroid-anterior': require('@/assets/images/anatomy/servier-thyroid-anterior.png'),
  'asset-servier-ovary': require('@/assets/images/anatomy/servier-ovary.png'),
  'asset-servier-uterus': require('@/assets/images/anatomy/servier-uterus.png'),
  'asset-servier-eye-section': require('@/assets/images/anatomy/servier-eye-section.png'),
  'asset-servier-ear-section': require('@/assets/images/anatomy/servier-ear-section.png'),
  'asset-servier-muscle-overview': require('@/assets/images/anatomy/servier-muscle-overview.png'),
  'asset-servier-male-reproductive': require('@/assets/images/anatomy/servier-male-reproductive.png'),
  'asset-servier-lymph-node-section': require('@/assets/images/anatomy/servier-lymph-node-section.png'),
  'asset-servier-pelvis': require('@/assets/images/anatomy/servier-pelvis.png'),
  'asset-servier-adrenal-vessels': require('@/assets/images/anatomy/servier-adrenal-vessels.png'),
  'asset-servier-respiratory-system': require('@/assets/images/anatomy/servier-respiratory-system.png'),
  'asset-commons-kidney-cortex-human': require('@/assets/images/anatomy/commons-kidney-cortex-human.jpg'),
  'asset-commons-alveolar-sac': require('@/assets/images/anatomy/commons-alveolar-sac.jpg'),
};

export function hasImageSource(assetId: string): boolean {
  return Object.prototype.hasOwnProperty.call(imageSources, assetId);
}