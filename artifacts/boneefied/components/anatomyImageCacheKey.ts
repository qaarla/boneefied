// Metro's web-preview URLs retain their path when the local raster changes.
// Only these corrected drawings need a fresh cache identity; leave every other
// previously saved image accessible offline. Production content-hashed URLs
// and native bundled images already change identity with the actual asset.
const revisedSkeletalRasters = [
  'skeletal-atlas-08-atlas-axis.png',
  'skeletal-atlas-10-rib-detail.png',
  'skeletal-atlas-12-pectoral-girdle.png',
  'skeletal-atlas-18-leg-tibia-fibula.png',
];
const revisedJointRasters = [
  'skeletal-atlas-20-synovial-joint.png',
  'skeletal-atlas-21-shoulder-joint.png',
  'skeletal-atlas-22-knee-joint.png',
];
const revisedMuscularRasters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 16];
const revisedNervousRasters = [
  'bvis04-02-brain-medial.png', 'bvis04-04-brainstem-cerebellum.png',
  'bvis04-05-csf-meninges.png', 'bvis04-06-spinal-cross-section.png',
  'bvis04-07-spinal-roots-rami.png', 'bvis04-08-plexus-overview.png',
  'bvis04-09-upper-limb-nerves.png', 'bvis04-10-lower-limb-nerves.png',
];

export function anatomyImageCacheKey(uri: string): string {
  const revision = /bvis06-(17-female-gross|19-uterine-wall)\.png/.test(uri) ? 'female-relations-1'
    : /bvis06-(15-male-system|16-testis-ducts)\.png/.test(uri) ? 'male-relations-1'
    : /bvis06-(11-kidney-section|12-renal-vessels|14-renal-corpuscle)\.png/.test(uri) ? 'urinary-relations-1'
    : uri.includes('bvis06-06-digestive-wall-layers.png') ? 'digestive-fibres-1'
    : /bvis05-(23-upper-airway|24-larynx-glottis|25-trachea-bronchial-tree|27-pleura-diaphragm|29-respiratory-membrane-histology)\.png/.test(uri) ? 'resp-airways-1'
    : uri.includes('bvis05-31-lymph-node-structure.png') ? 'lymph-drainage-2'
    : /bvis05-(30-lymph-overview|33-thymus-lobule|34-tonsil-map-structure|35-gut-lymphoid-lacteal)\.png/.test(uri) ? 'lymph-drainage-1'
    : /bvis05-(12-vessel-wall-types|13-vessel-flow-chain|15-body-artery-vein-maps|16-head-neck-vessels|17-upper-limb-arteries|18-upper-limb-veins|20-great-saphenous-route|21-hepatic-portal-system|22-celiac-renal-context)\.png/.test(uri) ? 'vessels-routes-1'
    : /bvis05-(03-heart-valves-superior|05-coronary-anterior|06-coronary-posterior|08-blood-composition|11-marrow-hematopoiesis)\.png/.test(uri) ? 'cardiovascular-geometry-1'
    : /bvis05-(36-endocrine-body-map|37-hypothalamus-pituitary-axis|40-pancreas-islet)\.png/.test(uri) ? 'endocrine-connections-1'
    : /bvis04-(14-eye-anterior-segment|18-middle-ear)\.png/.test(uri) ? 'senses-detail-fit-1'
    : /bvis04-(11-cranial-nerves-i-vi|12-cranial-nerves-vii-xii)\.png/.test(uri) ? 'cranial-shared-exits-1'
    : uri.includes('bvis04-05-csf-meninges.png') ? 'nervous-csf-outlet-1'
    : revisedNervousRasters.some(name => uri.includes(name)) ? 'nervous-continuity-1'
    : revisedMuscularRasters.some(n => uri.includes(`muscular-atlas-${String(n).padStart(2, '0')}-`)) ? 'muscle-contours-1'
    : revisedJointRasters.some(name => uri.includes(name)) ? 'joint-continuity-1'
    : revisedSkeletalRasters.some(name => uri.includes(name)) ? 'skeletal-continuity-1' : undefined;
  if (!revision) return uri;
  const hashAt = uri.indexOf('#');
  const resource = hashAt === -1 ? uri : uri.slice(0, hashAt);
  const fragment = hashAt === -1 ? '' : uri.slice(hashAt);
  return `${resource}${resource.includes('?') ? '&' : '?'}boneefiedArt=${revision}${fragment}`;
}
