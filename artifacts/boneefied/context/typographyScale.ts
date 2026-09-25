export type TextScale = 'small' | 'default' | 'large';

export const TEXT_SCALE_FACTORS: Record<TextScale, number> = {
  small: 0.9,
  default: 1,
  large: 1.12,
};

export function typographyMetrics(fontSize: number, lineHeight: number | undefined, scale: TextScale) {
  const factor = TEXT_SCALE_FACTORS[scale] ?? 1;
  return {
    fontSize: fontSize * factor,
    ...(lineHeight === undefined ? {} : { lineHeight: lineHeight * factor }),
  };
}