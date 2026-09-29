import React from 'react';
import { Platform, ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useTypographyLayout } from '@/components/ScaledText';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';

export function Screen({ children, scroll = true, keyboardAware = false, scrollRef, onScroll, onViewportLayout, keyboardShouldPersistTaps }: {
  children: React.ReactNode;
  scroll?: boolean;
  keyboardAware?: boolean;
  scrollRef?: React.Ref<ScrollView>;
  onScroll?: ScrollViewProps['onScroll'];
  onViewportLayout?: (height: number, bottomClearance: number) => void;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
}) {
  const colors = useColors();
  const { shouldReflow, isExpandedTabLayout, systemFontScale } = useTypographyLayout();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const isTabScreen = segments[0] === '(tabs)';
  const bottomPadding = Platform.OS === 'web'
    ? isTabScreen && isExpandedTabLayout ? 32 + 96 * Math.max(1, systemFontScale) : 118
    : insets.bottom + 96 * (shouldReflow ? Math.max(1, systemFontScale) : 1) + (Platform.OS === 'ios' && isTabScreen ? 32 : 0);
  const content = <View style={[styles.content, { paddingTop: 18, paddingHorizontal: shouldReflow ? 16 : 20, ...(!scroll && { paddingBottom: bottomPadding }) }]}>{children}</View>;
  // The top inset belongs outside the scroll view so it cannot scroll under the status bar.
  // Bottom clearance belongs to the scrollable container so the final child can clear the fixed tabs.
  const scrollProps = {
    onScroll,
    keyboardShouldPersistTaps,
    scrollEventThrottle: 16,
    onLayout: ((event) => onViewportLayout?.(event.nativeEvent.layout.height, bottomPadding)) as NonNullable<ScrollViewProps['onLayout']>,
    contentContainerStyle: [styles.scroll, { paddingBottom: bottomPadding }],
    showsVerticalScrollIndicator: shouldReflow,
  };
  const scroller = keyboardAware
    ? <KeyboardAwareScrollViewCompat {...scrollProps} bottomOffset={64}>{content}</KeyboardAwareScrollViewCompat>
    : <ScrollView ref={scrollRef} {...scrollProps}>{content}</ScrollView>;
  return <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>{scroll ? scroller : content}</View>;
}
const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: { paddingHorizontal: 20, gap: 18, width: '100%', maxWidth: 720, alignSelf: 'center' },
});