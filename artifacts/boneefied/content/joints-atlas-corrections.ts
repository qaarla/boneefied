type Point = { structureId: string; x: number; y: number };
type Repair = { structureId: string; from: [number, number]; to: [number, number]; reason: string };

/** Exact prior coordinates only: do not move another view of the same tissue. */
export const jointsAtlasCorrections: Record<string, Repair[]> = {
  'asset-skeletal-atlas-synovial-joint': [
    { structureId: 'synovial-joint', from: [710 / 1450, .48], to: [.5, .49], reason: 'Inside the continuous capsule-enclosed joint space.' },
    { structureId: 'fibrous-capsule', from: [.3759, .4592], to: [530 / 1450, .5], reason: 'Center of the fibrous capsule wall, not the neighboring interval.' },
    { structureId: 'synovial-membrane', from: [.4103, .4925], to: [551 / 1450, .5], reason: 'Actual thin lining against the inner capsule face.' },
    { structureId: 'articular-cartilage', from: [.5, .445], to: [.5, .437], reason: 'Attached cartilage cap, not the space below its edge.' },
    { structureId: 'joint-cavity', from: [.5, .5117], to: [685 / 1450, .52], reason: 'Space between the cartilage-covered ends, within the membrane.' },
    { structureId: 'synovial-fluid', from: [.5, .52], to: [760 / 1450, .535], reason: 'Fluid occupying that same continuous cavity; not a detached object.' },
    { structureId: 'ligament', from: [.3897, .3328], to: [495 / 1450, .47], reason: 'External continuous band attached to both bones.' },
  ],
  'asset-skeletal-atlas-shoulder-joint': [
    { structureId: 'clavicle', from: [.6655, .254], to: [880 / 1450, .23], reason: 'Clavicular shaft rather than empty area below it.' },
  ],
  'asset-skeletal-atlas-knee-joint': [
    { structureId: 'mcl', from: [.3598, .5], to: [520 / 1450, .48], reason: 'Continuous medial band with its distal attachment reaching tibial bone.' },
    { structureId: 'knee-joint', from: [.2759, .48], to: [490 / 1450, .48], reason: 'Exposed joint interval beside, not beneath, the anterior patellar ligament.' },
  ],
};

export function repairJointsAtlasTargets<T extends Point>(assetId: string | undefined, points: T[]): T[] {
  const repairs = assetId ? jointsAtlasCorrections[assetId] : undefined;
  if (!repairs) return points;
  let changed = false;
  const result = points.map(point => {
    const fix = repairs.find(r => r.structureId === point.structureId
      && Math.abs(point.x - r.from[0]) < .00001 && Math.abs(point.y - r.from[1]) < .00001);
    if (!fix) return point;
    changed = true;
    return { ...point, x: fix.to[0], y: fix.to[1] };
  });
  return changed ? result : points;
}
