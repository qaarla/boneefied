import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const content = <View style={[styles.content, { paddingTop: insets.top + 18, paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 18 }]}>{children}</View>;
  return <View style={[styles.screen, { backgroundColor: colors.background }]}>{scroll ? <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}</View>;
}
const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: { paddingHorizontal: 20, gap: 18, width: '100%', maxWidth: 720, alignSelf: 'center' },
});