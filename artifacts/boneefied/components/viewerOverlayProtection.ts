import type { OverlayAvoidRect } from '../content/model';
import { atlasCalloutCells, circleIntersectsRect } from './viewerMarkerLayout.ts';

export function containedOverlayBox(width: number, height: number, aspect: number, inset = 0) {
  if (width <= 0 || height <= 0) return { x: 0, y: 0, width: 0, height: 0 };
  const innerWidth = Math.max(0, width - inset * 2), innerHeight = Math.max(0, height - inset * 2);
  const scale = Math.min(innerWidth / aspect, innerHeight);
  const w = scale * aspect, h = scale;
  return { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h };
}

export function protectedOverlayRects(width: number, height: number, aspect: number, rects: OverlayAvoidRect[], inset = 0) {
  const box = containedOverlayBox(width, height, aspect, inset);
  return rects.map((r) => ({ left: box.x + r.x * box.width, top: box.y + r.y * box.height, width: r.width * box.width, height: r.height * box.height }));
}

/** Add only the gutter space needed by this plate's protected anatomy. */
export function protectedOverlayHeight(anchors: { x: number; y: number }[], width: number, baseHeight: number, cellWidth: number, cellHeight: number, aspect: number, rects: OverlayAvoidRect[], radius: number, inset = 0, gap = 8) {
  if (!rects.length || !anchors.length || width <= 0) return baseHeight;
  for (let extraRows = 0; extraRows < 60; extraRows++) {
    const height = baseHeight + extraRows * (cellHeight + gap);
    const box = containedOverlayBox(width, height, aspect, inset);
    const targets = anchors.map((a) => ({ x: box.x + a.x * box.width, y: box.y + a.y * box.height }));
    const protectedRects = protectedOverlayRects(width, height, aspect, rects, inset);
    const safe = atlasCalloutCells(width, height, cellWidth, cellHeight, gap).filter((p) =>
      !protectedRects.some((r) => circleIntersectsRect(p, radius, r))
      && !targets.some((a) => Math.hypot(p.x - a.x, p.y - a.y) < radius + 3));
    if (safe.length >= anchors.length) return height;
  }
  throw new Error('Protected overlay cannot fit measured touch targets');
}
