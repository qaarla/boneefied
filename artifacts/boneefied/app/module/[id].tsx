import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { AnatomyImageViewer } from '@/components/AnatomyImageViewer';
import { content } from '@/content/canonical';
import { useColors } from '@/hooks/useColors';

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const [mode, setMode] = useState<'learn' | 'recall'>('learn');
  const module = content.modules.find((item) => item.id === id) ?? content.modules[0];
  return <><Stack.Screen options={{ title: module.title, headerBackTitle: 'Study' }} /><Screen>
    <View style={styles.heading}><Text style={[styles.eyebrow, { color: colors.primary }]}>MODULE 01 · CONTENT BLOCKED</Text><Text style={[styles.title, { color: colors.foreground }]}>{module.title}</Text><Text style={[styles.intro, { color: colors.mutedForeground }]}>Learn and recall are ready for verified material. This module is waiting on an actual course source.</Text></View>
    <View style={[styles.switcher, { backgroundColor: colors.secondary }]}>{(['learn', 'recall'] as const).map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: mode === item }} onPress={() => setMode(item)} style={[styles.switch, mode === item && { backgroundColor: colors.card }]}><Text style={{ color: mode === item ? colors.foreground : colors.mutedForeground, fontWeight: '700' }}>{item === 'learn' ? 'Learn' : 'Recall'}</Text></Pressable>)}</View>
    <AnatomyImageViewer caption="No image asset supplied · provenance unavailable" revealLabels={mode === 'learn'} />
    <View style={[styles.notice, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.noticeTitle, { color: colors.foreground }]}>{mode === 'learn' ? 'Learn view' : 'Recall view'}</Text><Text style={[styles.noticeText, { color: colors.mutedForeground }]}>{mode === 'learn' ? 'A labeled image, source-supported structure names, and provenance will appear here once supplied.' : 'Labels are hidden in recall mode. There is no verified material to reveal yet.'}</Text></View>
    <Pressable disabled style={[styles.practice, { backgroundColor: colors.secondary }]}><Text style={{ color: colors.mutedForeground, fontWeight: '700' }}>Practice unavailable · 0 verified questions</Text></Pressable>
    <Pressable onPress={() => router.back()} style={styles.back}><Text style={{ color: colors.primary, fontWeight: '700' }}>Return to modules</Text></Pressable>
  </Screen></>;
}
const styles = StyleSheet.create({ heading: { gap: 7 }, eyebrow: { fontSize: 11, letterSpacing: 1.3, fontWeight: '700' }, title: { fontSize: 29, fontWeight: '700' }, intro: { fontSize: 14, lineHeight: 21 }, switcher: { borderRadius: 12, padding: 4, flexDirection: 'row' }, switch: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 9 }, notice: { borderWidth: 1, borderRadius: 14, padding: 15, gap: 5 }, noticeTitle: { fontSize: 15, fontWeight: '700' }, noticeText: { fontSize: 13, lineHeight: 19 }, practice: { minHeight: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }, back: { alignSelf: 'center', padding: 10 } });