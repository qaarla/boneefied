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
export function spreadAtlasCallouts(anchors: { x: number; y: number }[], width: number, height: number, cellWidth: number, cellHeight: number, gap = 8) {
  const columns = Math.max(1, Math.floor((width - 8 + gap) / (cellWidth + gap)));
  const rows = Math.max(1, Math.floor((height - 8 + gap) / (cellHeight + gap)));
  const available = Array.from({ length: columns * rows }, (_, i) => ({
    x: 4 + cellWidth / 2 + (i % columns) * (cellWidth + gap),
    y: 4 + cellHeight / 2 + Math.floor(i / columns) * (cellHeight + gap),
  }));
  return anchors.map((anchor) => {
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
}
