export const ATLAS_LEGEND_BASE_SIZE = 13.5;
export const ATLAS_LEGEND_LINE_HEIGHT = 18;
export const ATLAS_LEGEND_MAX_SCALE = 1.5;

/** Only dense annotations are bounded. Ordinary reading text is unaffected.
 * Native Text applies its own capped system multiplier to font AND line height;
 * compensate for that multiplier so preference/system scaling is applied once. */
export function atlasLegendTypography(effectiveScale: number, systemScale = 1, native = false) {
  const scale = Math.min(ATLAS_LEGEND_MAX_SCALE, Math.max(1, Number.isFinite(effectiveScale) ? effectiveScale : 1));
  const nativeMultiplier = native ? Math.min(ATLAS_LEGEND_MAX_SCALE, Number.isFinite(systemScale) && systemScale > 0 ? systemScale : 1) : 1;
  const renderScale = scale / nativeMultiplier;
  return { scale, fontSize: ATLAS_LEGEND_BASE_SIZE * renderScale, lineHeight: ATLAS_LEGEND_LINE_HEIGHT * renderScale };
}

export function atlasLegendNumberWidth(formattedNumbers: string[], scale: number) {
  const characters = Math.max(1, ...formattedNumbers.map(number => Array.from(number).length));
  return Math.ceil(Math.max(24, (characters + 1) * ATLAS_LEGEND_BASE_SIZE * .67) * scale);
}
