import React from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type ViewProps } from 'react-native';
import { useTypographyLayout } from '@/components/ScaledText';

// Use for copy + status, labels + controls, and other horizontally arranged
// content. At Larger Text the children get their own full-width lines.
export function AdaptiveRow({ children, style, ...props }: ViewProps) {
  const { shouldReflow } = useTypographyLayout();
  return <View {...props} style={[styles.row, style, shouldReflow && styles.stacked]}>{children}</View>;
}

// Cards grow with their contents; callers supply the existing visual styling.
export function AdaptiveCard({ children, style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]}>{children}</View>;
}

// A button's touch target has a minimum height, never a text-clipping height.
// Use ScaledText for its label; callers supply its existing visual styling.
export function AdaptiveButton({ children, style, accessibilityRole, ...props }: PressableProps) {
  return <Pressable
    {...props}
    accessibilityRole={accessibilityRole ?? 'button'}
    style={(state) => [styles.button, typeof style === 'function' ? style(state) : style]}
  >{children}</Pressable>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', minWidth: 0 },
  stacked: { flexDirection: 'column', alignItems: 'stretch' },
  card: { minWidth: 0 },
  button: { minWidth: 0, minHeight: 44, justifyContent: 'center' },
});