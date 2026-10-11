// Keep a measured label inside the unzoomed viewer without moving anatomical
// hotspot coordinates or changing the canvas's pan/zoom transform.
export function clampMarkerCenter(center: number, frameSize: number, markerSize: number, inset = 2): number {
  if (frameSize <= inset * 2) return frameSize / 2;
  const halfSize = Math.min(markerSize, frameSize - inset * 2) / 2;
  return Math.max(inset + halfSize, Math.min(frameSize - inset - halfSize, center));
}

export type MarkerBounds = { left: number; top: number; width: number; height: number };
type Annotation = { structureId: string; x: number; y: number };

/** One canonical structure may have separate targets in comparison panels. */
export function annotationKey(target: Annotation): string {
  return `${target.structureId}:${target.x}:${target.y}`;
}

export function annotationIndex(targets: Annotation[], target: Annotation): number {
  const exact = targets.findIndex((t) => annotationKey(t) === annotationKey(target));
  return exact >= 0 ? exact : targets.findIndex((t) => t.structureId === target.structureId);
}

export function hasMarkerOverlap(markers: MarkerBounds[]): boolean {
  return markers.some((marker, index) => markers.slice(index + 1).some((other) =>
    marker.left < other.left + other.width
    && marker.left + marker.width > other.left
    && marker.top < other.top + other.height
    && marker.top + marker.height > other.top));
}

/** Spread label callouts, never anatomical targets, into disjoint measured cells. */
export function atlasCalloutCells(width: number, height: number, cellWidth: number, cellHeight: number, gap = 8) {
  const columns = Math.max(1, Math.floor((width - 8 + gap) / (cellWidth + gap)));
  const rows = Math.max(1, Math.floor((height - 8 + gap) / (cellHeight + gap)));
  return Array.from({ length: columns * rows }, (_, i) => ({
    x: 4 + cellWidth / 2 + (i % columns) * (cellWidth + gap),
    y: 4 + cellHeight / 2 + Math.floor(i / columns) * (cellHeight + gap),
  }));
}

export function circleIntersectsRect(point: { x: number; y: number }, radius: number, rect: MarkerBounds) {
  const x = Math.max(rect.left, Math.min(point.x, rect.left + rect.width));
  const y = Math.max(rect.top, Math.min(point.y, rect.top + rect.height));
  return (point.x - x) ** 2 + (point.y - y) ** 2 < (radius + 1) ** 2;
}

type CalloutOptions = { avoid?: MarkerBounds[]; markerRadius?: number };
export function spreadAtlasCallouts(anchors: { x: number; y: number }[], width: number, height: number, cellWidth: number, cellHeight: number, gap = 8, options?: CalloutOptions) {
  const radius = options?.markerRadius ?? Math.min(cellWidth, cellHeight) / 2;
  const protectedLayout = !!options?.avoid?.length;
  const available = atlasCalloutCells(width, height, cellWidth, cellHeight, gap).filter((p) =>
    !protectedLayout || !options!.avoid!.some((rect) => circleIntersectsRect(p, radius, rect))
      && !anchors.some((a) => Math.hypot(p.x - a.x, p.y - a.y) < radius + 3));
  const result = anchors.map((anchor) => {
    let closest = 0;
    for (let i = 1; i < available.length; i++) {
      const distance = (p: { x: number; y: number }) => {
        const coversTarget = anchors.some((target) => Math.abs(p.x - target.x) < cellWidth / 2 + 4 && Math.abs(p.y - target.y) < cellHeight / 2 + 4);
        return (p.x - anchor.x) ** 2 + (p.y - anchor.y) ** 2 + (coversTarget ? 1_000_000 : 0);
      };
      if (distance(available[i]) < distance(available[closest])) closest = i;
    }
    const point = available.splice(closest, 1)[0];
    if (!point) throw new Error('Atlas callout canvas has insufficient measured space');
    return point;
  });
  if (protectedLayout) {
    // Swap only bubble cells, never the anchor order/number mapping. Prefer
    // shorter, less crossed leaders after moving bubbles outside anatomy.
    const crosses = (a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }, d: { x: number; y: number }) => {
      const side = (p: typeof a, q: typeof a, r: typeof a) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
      return side(a, b, c) * side(a, b, d) < -0.01 && side(c, d, a) * side(c, d, b) < -0.01;
    };
    const pairCost = (i: number, j: number) => {
      let cost = (result[i].x - anchors[i].x) ** 2 + (result[i].y - anchors[i].y) ** 2
        + (result[j].x - anchors[j].x) ** 2 + (result[j].y - anchors[j].y) ** 2;
      for (let k = 0; k < anchors.length; k++) {
        if (k !== i && crosses(anchors[i], result[i], anchors[k], result[k])) cost += 50_000;
        if (k !== i && k !== j && crosses(anchors[j], result[j], anchors[k], result[k])) cost += 50_000;
      }
      return cost;
    };
    for (let pass = 0; pass < 2; pass++) for (let i = 0; i < result.length; i++) for (let j = i + 1; j < result.length; j++) {
      const before = pairCost(i, j);
      [result[i], result[j]] = [result[j], result[i]];
      if (pairCost(i, j) >= before) [result[i], result[j]] = [result[j], result[i]];
    }
  }
  return result;
}
