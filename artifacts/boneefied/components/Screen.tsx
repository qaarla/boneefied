import React from 'react';
import { Platform, ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, scroll = true, scrollRef, onScroll, onViewportLayout }: {
  children: React.ReactNode;
  scroll?: boolean;
  scrollRef?: React.Ref<ScrollView>;
  onScroll?: ScrollViewProps['onScroll'];
  onViewportLayout?: (height: number, bottomClearance: number) => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const isTabScreen = segments[0] === '(tabs)';
  const bottomPadding = Platform.OS === 'web'
    ? 118
    : insets.bottom + 96 + (Platform.OS === 'ios' && isTabScreen ? 32 : 0);
  const content = <View style={[styles.content, { paddingTop: 18, ...(!scroll && { paddingBottom: bottomPadding }) }]}>{children}</View>;
  // The top inset belongs outside the scroll view so it cannot scroll under the status bar.
  // Bottom clearance belongs to the scrollable container so the final child can clear the fixed tabs.
  return <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>{scroll ? <ScrollView ref={scrollRef} onScroll={onScroll} scrollEventThrottle={16} onLayout={(event) => onViewportLayout?.(event.nativeEvent.layout.height, bottomPadding)} contentContainerStyle={[styles.scroll, { paddingBottom: bottomPadding }]} showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}</View>;
}
const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: { paddingHorizontal: 20, gap: 18, width: '100%', maxWidth: 720, alignSelf: 'center' },
});