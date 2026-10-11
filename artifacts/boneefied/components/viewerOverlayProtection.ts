import type { OverlayAvoidRect } from '../content/model';
import { atlasCalloutCells, circleIntersectsRect } from './viewerMarkerLayout.ts';

export function containedOverlayBox(width: number, height: number, aspect: number) {
  const frame = width / height;
  const w = Math.min(1, aspect / frame) * width, h = Math.min(1, frame / aspect) * height;
  return { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h };
}

export function protectedOverlayRects(width: number, height: number, aspect: number, rects: OverlayAvoidRect[]) {
  const box = containedOverlayBox(width, height, aspect);
  return rects.map((r) => ({ left: box.x + r.x * box.width, top: box.y + r.y * box.height, width: r.width * box.width, height: r.height * box.height }));
}

/** Add only the gutter space needed by this plate's protected anatomy. */
export function protectedOverlayHeight(anchors: { x: number; y: number }[], width: number, baseHeight: number, cellWidth: number, cellHeight: number, aspect: number, rects: OverlayAvoidRect[], radius: number) {
  if (!rects.length || !anchors.length || width <= 0) return baseHeight;
  for (let extraRows = 0; extraRows < 60; extraRows++) {
    const height = baseHeight + extraRows * (cellHeight + 8);
    const box = containedOverlayBox(width, height, aspect);
    const targets = anchors.map((a) => ({ x: box.x + a.x * box.width, y: box.y + a.y * box.height }));
    const protectedRects = protectedOverlayRects(width, height, aspect, rects);
    const safe = atlasCalloutCells(width, height, cellWidth, cellHeight).filter((p) =>
      !protectedRects.some((r) => circleIntersectsRect(p, radius, r))
      && !targets.some((a) => Math.hypot(p.x - a.x, p.y - a.y) < radius + 3));
    if (safe.length >= anchors.length) return height;
  }
  throw new Error('Protected overlay cannot fit measured touch targets');
}
