/** Repairs two existing detail plates; no new structures, lessons or answers. */
export const sensesDetailTransforms = {
  'asset-bvis04-eye-anterior-segment': { x: -350, y: -300, scale: 1.6 },
  'asset-bvis04-middle-ear': { x: -538, y: -640, scale: 1.9 },
} as const;
const detailPoints: Record<string, Record<string, [number, number]>> = {
  'asset-bvis04-eye-anterior-segment': {
    'cornea-eye': [536, 420], 'anterior-chamber-eye': [570, 480],
    'aqueous-humor-eye': [571, 385], 'pupil-eye': [622, 500],
    'iris-eye': [621, 395], 'posterior-chamber-eye': [648, 402],
    'suspensory-ligaments-eye': [670, 405], 'lens-eye': [676, 500],
    'ciliary-body-eye': [650, 330],
  },
  'asset-bvis04-middle-ear': {
    'tympanic-membrane-ear': [488, 440], 'malleus-ear': [520, 430],
    'incus-ear': [574, 418], 'stapes-ear': [604, 493],
    'oval-window-ear': [627, 470], 'round-window-ear': [634, 566],
    'auditory-tube-ear': [680, 650],
  },
};
export function repairSensesAtlasTargets<T extends { structureId: string; x: number; y: number }>(
  assetId: string | undefined, points: T[],
): T[] {
  if (!assetId || !Object.hasOwn(detailPoints, assetId)) return points;
  const transform = sensesDetailTransforms[assetId as keyof typeof sensesDetailTransforms];
  return points.map(point => {
    const p = detailPoints[assetId][point.structureId];
    return p ? { ...point, x: (p[0] * transform.scale + transform.x) / 1450,
      y: (p[1] * transform.scale + transform.y) / 1000 } : point;
  });
}
