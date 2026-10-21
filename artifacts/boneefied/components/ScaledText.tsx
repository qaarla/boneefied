import React, { createContext, forwardRef, useContext, useMemo, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text as NativeText,
  TextInput as NativeTextInput,
  useWindowDimensions,
  type TextProps,
  type TextInputProps,
  type TextStyle,
  type StyleProp,
} from 'react-native';
import { useStudy } from '@/context/StudyContext';
import { appTypeface } from '@/context/typeface';
import { wholeWordFontFactor } from '@/context/wholeWordFit';
import { dynamicTypeRampForSize, needsCompactTextLayout, needsExpandedTabLayout, needsLargeTextLayout, needsResponsiveTextLayout, TEXT_SCALE_FACTORS, type TextScale } from '@/context/typographyScale';

type TypographySettings = { preference: TextScale; systemFontScale: number; previewFontScale: number; width: number };
const TypographyContext = createContext<TypographySettings>({ preference: 'default', systemFontScale: 1, previewFontScale: 1, width: 390 });

// Web-only development aid for checking native-style text reflow. It never
// affects a production bundle or native app, and stays fixed during navigation
// without leaking into a fresh page load.
let previewScaleInitialized = false;
let previewScale: number | undefined;
export function devPreviewFontScale(): number | undefined {
  if (!__DEV__ || Platform.OS !== 'web' || typeof window === 'undefined') return undefined;
  if (!previewScaleInitialized) {
    const requested = new URLSearchParams(window.location.search).get('qaFontScale');
    previewScale = requested && ['1', '1.3', '1.8', '2.5'].includes(requested) ? Number(requested) : undefined;
    previewScaleInitialized = true;
  }
  return previewScale;
}

export function TypographyProvider({ children }: { children: React.ReactNode }) {
  const { preferences } = useStudy();
  const { fontScale, width } = useWindowDimensions();
  const preview = devPreviewFontScale();
  const settings = useMemo(() => ({ preference: preferences.textScale, systemFontScale: preview ?? fontScale, previewFontScale: preview ?? 1, width }), [preferences.textScale, fontScale, preview, width]);
  return <TypographyContext.Provider value={settings}>{children}</TypographyContext.Provider>;
}

export function useTypographyLayout() {
  const { preference, systemFontScale, width } = useContext(TypographyContext);
  return {
    systemFontScale,
    effectiveFontScale: TEXT_SCALE_FACTORS[preference] * systemFontScale,
    isLargeText: needsLargeTextLayout(systemFontScale, preference),
    isCompactTextLayout: needsCompactTextLayout(width, systemFontScale, preference),
    isExpandedTabLayout: needsExpandedTabLayout(systemFontScale, preference, width),
    shouldReflow: needsResponsiveTextLayout(width, systemFontScale, preference),
  };
}

function scaledStyle(style: StyleProp<TextStyle>, scale: TextScale, previewFontScale: number) {
  const flattened = StyleSheet.flatten(style);
  const factor = TEXT_SCALE_FACTORS[scale] * previewFontScale;
  return [style, {
    ...appTypeface(flattened),
    fontSize: (flattened?.fontSize ?? 14) * factor,
    ...(flattened?.lineHeight === undefined ? {} : { lineHeight: flattened.lineHeight * factor }),
  }];
}

type ReadingTextProps = TextProps & { wholeWords?: boolean };
function readingCopy(children: React.ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(readingCopy).join('');
  if (React.isValidElement<{ children?: React.ReactNode }>(children)) return readingCopy(children.props.children);
  return '';
}

export const Text = forwardRef<NativeText, ReadingTextProps>(function Text({ style, wholeWords = true, ...props }, ref) {
  const { preference, systemFontScale, previewFontScale, width } = useContext(TypographyContext);
  const flat = StyleSheet.flatten(style);
  const size = flat?.fontSize ?? 14;
  const copy = wholeWords ? readingCopy(props.children) : '';
  const fitEnabled = wholeWords && needsLargeTextLayout(systemFontScale, preference);
  const layoutKey = `${width}/${systemFontScale}/${preference}/${copy}`;
  const [measured, setMeasured] = useState<{ key: string; width: number }>();
  const padding = (value: unknown) => typeof value === 'number' ? value : 0;
  const horizontalInset = padding(flat?.paddingLeft ?? flat?.paddingHorizontal ?? flat?.padding)
    + padding(flat?.paddingRight ?? flat?.paddingHorizontal ?? flat?.padding)
    + padding(flat?.borderLeftWidth ?? flat?.borderWidth) + padding(flat?.borderRightWidth ?? flat?.borderWidth);
  const factor = fitEnabled && measured?.key === layoutKey
    ? wholeWordFontFactor(copy, measured.width - horizontalInset, size * TEXT_SCALE_FACTORS[preference] * systemFontScale, Number(flat?.fontWeight) >= 600 || flat?.fontWeight === 'bold')
    : 1;
  const adjusted = factor < 1 ? {
    fontSize: size * TEXT_SCALE_FACTORS[preference] * previewFontScale * factor,
    ...(flat?.lineHeight && { lineHeight: flat.lineHeight * TEXT_SCALE_FACTORS[preference] * previewFontScale * factor }),
  } : undefined;
  return <NativeText ref={ref} {...props}
    onLayout={fitEnabled ? event => {
      props.onLayout?.(event);
      const available = event.nativeEvent.layout.width;
      // Keep the original available width while a shrink-to-fit chip reflows;
      // reset when content, viewport or scaling changes, so it can grow again.
      setMeasured(previous => previous?.key === layoutKey && previous.width >= available - 0.5
        ? previous : { key: layoutKey, width: available });
    } : props.onLayout}
    allowFontScaling={Platform.OS === 'web' ? props.allowFontScaling : true}
    maxFontSizeMultiplier={Platform.OS === 'web' ? props.maxFontSizeMultiplier : 0}
    dynamicTypeRamp={Platform.OS === 'ios' ? props.dynamicTypeRamp ?? dynamicTypeRampForSize(size) : props.dynamicTypeRamp}
    numberOfLines={needsResponsiveTextLayout(width, systemFontScale, preference) ? undefined : props.numberOfLines}
    style={[{ flexShrink: 1, minWidth: 0 }, ...scaledStyle(style, preference, previewFontScale), adjusted]}
  />;
});

/** Numeric image controls only: supplied size includes responsive typography.
 * Compensate for the native multiplier rather than scaling it twice; keep
 * native Dynamic Type enabled. Reading text uses normal Text; dense atlas
 * annotations use the separately bounded AtlasLegend treatment. */
export const MarkerText = forwardRef<NativeText, TextProps>(function MarkerText({ style, ...props }, ref) {
  const { systemFontScale } = useContext(TypographyContext);
  const size = StyleSheet.flatten(style)?.fontSize ?? 14;
  return <NativeText ref={ref} {...props} allowFontScaling maxFontSizeMultiplier={0}
    dynamicTypeRamp={Platform.OS === 'ios' ? 'body' : undefined}
    style={[style, Platform.OS !== 'web' && { fontSize: size / Math.max(1, systemFontScale) }]} />;
});

export const TextInput = forwardRef<NativeTextInput, TextInputProps>(function TextInput({ style, ...props }, ref) {
  const { preference, systemFontScale, previewFontScale, width } = useContext(TypographyContext);
  const shouldReflow = needsResponsiveTextLayout(width, systemFontScale, preference);
  return <NativeTextInput ref={ref} {...props}
    allowFontScaling={Platform.OS === 'web' ? props.allowFontScaling : true}
    maxFontSizeMultiplier={Platform.OS === 'web' ? props.maxFontSizeMultiplier : 0}
    multiline={props.multiline ?? shouldReflow}
    submitBehavior={props.submitBehavior ?? (shouldReflow ? 'blurAndSubmit' : undefined)}
    style={[{ flexShrink: 1, minWidth: 0, minHeight: 44 }, ...scaledStyle(style, preference, previewFontScale)]}
  />;
});

// A heading is reading content, not a single-line control. Never truncate it.
export const Heading = forwardRef<NativeText, ReadingTextProps>(function Heading({ style, ...props }, ref) {
  return <Text ref={ref} wholeWords {...props} accessibilityRole="header" numberOfLines={undefined} style={[{ fontWeight: '700', textAlign: 'center' }, style]} />;
});

// Deliberately preserve the established sans-serif tiny floating label treatment.
export const compactOverlayFont = Platform.OS === 'android' ? 'sans-serif' : 'System';