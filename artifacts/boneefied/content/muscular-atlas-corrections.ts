type Point = { structureId: string; x: number; y: number };
export const muscularAtlasCorrections: Record<string, { structureId: string; from: [number, number]; to: [number, number]; reason: string }[]> = {
  'asset-openstax-muscle-face-neck': [
    { structureId: 'temporalis', from: [.5094, .257], to: [.4911, .2484], reason: 'Same temporal belly within the complete, proportion-preserving face/neck composition.' },
    { structureId: 'scalenes', from: [.4703, .7309], to: [.4328, .7585], reason: 'Visible posterior-triangle scalene belly following its corrected course to the first rib.' },
    { structureId: 'sternocleidomastoid', from: [.5224, .6296], to: [.4858, .6068], reason: 'Visible SCM stem above its distinct sternal/clavicular heads.' },
    { structureId: 'buccinator', from: [.6248, .4892], to: [.6006, .4686], reason: 'Cheek belly in the complete face/neck composition.' },
    { structureId: 'masseter', from: [.5522, .446], to: [.5317, .4276], reason: 'Masseter over the mandibular ramus after the uniform composition adjustment.' },
    { structureId: 'platysma', from: [.6062, .7565], to: [.597, .722], reason: 'Remaining superficial anterior-neck sheet, not the exposed SCM heads.' },
    { structureId: 'frontalis', from: [.6025, .1679], to: [.5794, .1639], reason: 'Frontal belly after the uniform composition adjustment.' },
    { structureId: 'orbicularis-oculi', from: [.611, .264], to: [.5876, .308], reason: 'Orbicularis ring itself, not its central opening.' },
    { structureId: 'orbicularis-oris', from: [.6745, .498], to: [.6441, .478], reason: 'Orbicularis ring itself, not the oral opening.' },
  ],
  'asset-openstax-muscle-labeled-overview': [
    { structureId: 'vastus-lateralis', from: [.2097, .676], to: [.2005, .6353], reason: 'Exposed lateral quadriceps belly, rather than its narrow distal edge beside the iliotibial band.' },
  ],
  'asset-openstax-muscle-anterior-leg': [
    { structureId: 'vastus-lateralis', from: [.3324, .532], to: [.312, .514], reason: 'Center of the exposed vastus lateralis lateral to rectus femoris and medial to the iliotibial band.' },
  ],
};

/** Match exact view-specific old coordinates; preserve all identities and order. */
export function repairMuscularAtlasTargets<T extends Point>(id: string | undefined, points: T[]): T[] {
  const repairs = id ? muscularAtlasCorrections[id] : undefined;
  if (!repairs) return points;
  let changed = false;
  const next = points.map(p => {
    const r = repairs.find(r => r.structureId === p.structureId
      && Math.abs(r.from[0] - p.x) < .00001 && Math.abs(r.from[1] - p.y) < .00001);
    if (!r) return p;
    changed = true;
    return { ...p, x: r.to[0], y: r.to[1] };
  });
  return changed ? next : points;
}
