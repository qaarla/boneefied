import type { HotspotSizeOverride } from '../content/model';

/** Painted marker geometry only: never changes anchors, callout cells or hit regions. */
export function markerSizing(imageWidth: number, count: number, textScale = 1, override?: HotspotSizeOverride) {
  const width = Number.isFinite(imageWidth) && imageWidth > 0 ? imageWidth : 300;
  const density = Math.max(0, Math.min(1, (Math.max(1, count) - 4) / 20));
  const base = Math.max(22, Math.min(30, width * 0.078)) - density * 5;
  const scale = Math.max(1, Math.min(1.5, Number.isFinite(textScale) ? textScale : 1));
  // Enlarged text must not grow sparse callouts back toward a full tap box.
  // The separate 44/60px hit regions and normalized targets stay unchanged.
  const cap = Math.max(18, Math.min(40, override?.maxDiameter ?? (28 - density * 4)));
  const diameter = Math.max(18, Math.min(cap, (override?.diameter ?? base) * scale));
  const numeralSize = Math.max(10, Math.min(diameter * 0.56, (override?.numeralSize ?? base * 0.46) * scale));
  return { diameter, numeralSize, padding: 0, borderWidth: 1.5 };
}
