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

// React Native applies the iOS Dynamic Type multiplier to Text, TextInput and their
// line heights natively. These helpers are for native headers and layout only:
// multiplying Text styles by the system scale would apply it twice.
export function needsLargeTextLayout(systemFontScale: number, preference: TextScale): boolean {
  return systemFontScale * TEXT_SCALE_FACTORS[preference] >= 1.5;
}

// Treat a narrow phone with moderately enlarged text like a larger-text layout,
// but leave default-size and wider layouts alone while their rows still fit.
export function needsCompactTextLayout(width: number, systemFontScale: number, preference: TextScale): boolean {
  const effectiveScale = systemFontScale * TEXT_SCALE_FACTORS[preference];
  return effectiveScale > 1 && width / effectiveScale < 320;
}

// A single policy for content reflow. Text should still grow natively; this
// only decides when surrounding rows/navigation need more vertical space.
export function needsResponsiveTextLayout(width: number, systemFontScale: number, preference: TextScale): boolean {
  return needsLargeTextLayout(systemFontScale, preference)
    || needsCompactTextLayout(width, systemFontScale, preference);
}

// Four equally narrow tabs cannot display genuinely enlarged labels. Switch
// classic tabs to a two-column layout before fitting labels would shrink them.
// An optional width also expands when four slots (width / 4) cannot hold a
// one-line label such as "Practice" at the effective size (about 4.4 em wide).
export function needsExpandedTabLayout(systemFontScale: number, preference: TextScale, width?: number): boolean {
  const effective = systemFontScale * TEXT_SCALE_FACTORS[preference];
  if (effective >= 2) return true;
  return width !== undefined && effective > 1 && (width / 4 - 8) < 11 * effective * 4.4;
}

export function nativeHeaderTitleSize(baseSize: number, preference: TextScale, systemFontScale: number): number {
  return typographyMetrics(baseSize, undefined, preference).fontSize * systemFontScale;
}

export function dynamicTypeRampForSize(size: number) {
  if (size >= 32) return 'largeTitle' as const;
  if (size >= 27) return 'title1' as const;
  if (size >= 21) return 'title2' as const;
  if (size >= 18) return 'headline' as const;
  if (size >= 15) return 'body' as const;
  if (size >= 13) return 'subheadline' as const;
  return 'footnote' as const;
}