import React from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTypographyLayout } from '@/components/ScaledText';
import { useColors } from '@/hooks/useColors';
import { OrganicSurface } from '@/components/OrganicBackground';

// Opaque surfaces (an explicit backgroundColor) receive their own expression of
// the shared material. The ink follows the local background: filled primary and
// destructive controls use their foreground colours. Transparent wrappers are untouched.
function Surface({ style }: { style: StyleProp<ViewStyle> }) {
  const colors = useColors();
  const flat = StyleSheet.flatten(style) ?? {};
  if (!flat.backgroundColor || flat.backgroundColor === 'transparent') return null;
  const radius = typeof flat.borderRadius === 'number' ? flat.borderRadius : 0;
  const ink = flat.backgroundColor === colors.primary ? colors.primaryForeground
    : flat.backgroundColor === colors.destructive ? colors.destructiveForeground : colors.primary;
  return <OrganicSurface radius={radius} shift={(radius * 37) % 300} ink={ink} />;
}

// Use for copy + status, labels + controls, and other horizontally arranged
// content. At Larger Text the children get their own full-width lines.
export function AdaptiveRow({ children, style, ...props }: ViewProps) {
  const { shouldReflow } = useTypographyLayout();
  return <View {...props} style={[styles.row, style, shouldReflow && styles.stacked]}><Surface style={style} />{children}</View>;
}

// Cards grow with their contents; callers supply the existing visual styling.
export function AdaptiveCard({ children, style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]}><Surface style={style} />{children}</View>;
}

// A button's touch target has a minimum height, never a text-clipping height.
// Use ScaledText for its label; callers supply its existing visual styling.
export function AdaptiveButton({ children, style, accessibilityRole, ...props }: PressableProps) {
  return <Pressable
    {...props}
    accessibilityRole={accessibilityRole ?? 'button'}
    style={(state) => [styles.button, typeof style === 'function' ? style(state) : style]}
  >{(state) => <><Surface style={typeof style === 'function' ? style(state) : style as StyleProp<ViewStyle>} />{typeof children === 'function' ? children(state) : children}</>}</Pressable>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', minWidth: 0 },
  stacked: { flexDirection: 'column', alignItems: 'stretch' },
  card: { minWidth: 0 },
  button: { minWidth: 0, minHeight: 44, justifyContent: 'center' },
});
