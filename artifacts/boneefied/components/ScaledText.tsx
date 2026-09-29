import React, { createContext, forwardRef, useContext, useMemo } from 'react';
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
    isLargeText: needsLargeTextLayout(systemFontScale, preference),
    isCompactTextLayout: needsCompactTextLayout(width, systemFontScale, preference),
    isExpandedTabLayout: needsExpandedTabLayout(systemFontScale, preference),
    shouldReflow: needsResponsiveTextLayout(width, systemFontScale, preference),
  };
}

function scaledStyle(style: StyleProp<TextStyle>, scale: TextScale, previewFontScale: number) {
  const flattened = StyleSheet.flatten(style);
  const factor = TEXT_SCALE_FACTORS[scale] * previewFontScale;
  return [style, {
    fontSize: (flattened?.fontSize ?? 14) * factor,
    ...(flattened?.lineHeight === undefined ? {} : { lineHeight: flattened.lineHeight * factor }),
  }];
}

export const Text = forwardRef<NativeText, TextProps>(function Text({ style, ...props }, ref) {
  const { preference, systemFontScale, previewFontScale, width } = useContext(TypographyContext);
  const size = StyleSheet.flatten(style)?.fontSize ?? 14;
  return <NativeText ref={ref} {...props}
    allowFontScaling={Platform.OS === 'web' ? props.allowFontScaling : true}
    maxFontSizeMultiplier={Platform.OS === 'web' ? props.maxFontSizeMultiplier : 0}
    dynamicTypeRamp={Platform.OS === 'ios' ? props.dynamicTypeRamp ?? dynamicTypeRampForSize(size) : props.dynamicTypeRamp}
    numberOfLines={needsResponsiveTextLayout(width, systemFontScale, preference) ? undefined : props.numberOfLines}
    style={[{ flexShrink: 1, minWidth: 0 }, ...scaledStyle(style, preference, previewFontScale)]}
  />;
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
export const Heading = forwardRef<NativeText, TextProps>(function Heading({ style, ...props }, ref) {
  return <Text ref={ref} {...props} accessibilityRole="header" numberOfLines={undefined} style={style} />;
});