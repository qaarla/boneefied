import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { content } from '@/content/canonical';
import { useColors } from '@/hooks/useColors';

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const [mode, setMode] = useState<'learn' | 'recall'>('learn');
  const module = content.modules.find((item) => item.id === id) ?? content.modules[0];
  return <><Stack.Screen options={{ title: module.title, headerBackTitle: 'Study' }} /><Screen>
    <View style={styles.heading}><Text style={[styles.eyebrow, { color: colors.primary }]}>LAB 2 · SOURCE-CHECKED TEXT</Text><Text style={[styles.title, { color: colors.foreground }]}>{module.title}</Text><Text style={[styles.intro, { color: colors.mutedForeground }]}>Concise lessons transcribed from the user-supplied Lab 2 excerpts. Images and hotspots are intentionally unavailable until the source pack supplies them.</Text></View>
    <View style={[styles.switcher, { backgroundColor: colors.secondary }]}>{(['learn', 'recall'] as const).map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: mode === item }} onPress={() => setMode(item)} style={[styles.switch, mode === item && { backgroundColor: colors.card }]}><Text style={{ color: mode === item ? colors.foreground : colors.mutedForeground, fontWeight: '700' }}>{item === 'learn' ? 'Learn' : 'Recall'}</Text></Pressable>)}</View>
    <View style={[styles.lesson, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.noticeTitle, { color: colors.foreground }]}>{mode === 'learn' ? 'Learn · cell cycle and division' : 'Recall · key cues'}</Text>
      {mode === 'learn' ? <><Text style={[styles.noticeText, { color: colors.mutedForeground }]}>Interphase occupies most of the cycle: G1 supports growth and resource accumulation, S replicates DNA, and G2 is a second growth phase. After S, each chromosome has two identical sister chromatids joined at the centromere.</Text><Text style={[styles.noticeText, { color: colors.mutedForeground }]}>Mitosis divides nuclei: prophase, metaphase, anaphase, telophase. Cytokinesis separates cells; animals use an actin ring/cleavage furrow, while plants form a cell plate from Golgi-derived vesicles.</Text></> : <><Text style={[styles.noticeText, { color: colors.mutedForeground }]}>Prophase: nucleolus disappears, chromatin condenses, centrosomes separate, spindle forms. Metaphase: chromosomes align at the metaphase plate. Anaphase: chromatids move toward opposite poles. Telophase: nuclear envelopes form, chromosomes unfold, nucleoli reappear.</Text><Text style={[styles.noticeText, { color: colors.mutedForeground }]}>Source: user-supplied transcribed excerpts · Lab 2 pp. 5–8 (printed 35–38).</Text></>}
    </View>
    <Pressable onPress={() => router.push('/(tabs)/practice')} style={[styles.practice, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Practice this module · {content.questions.length} questions</Text></Pressable>
    <Pressable onPress={() => router.back()} style={styles.back}><Text style={{ color: colors.primary, fontWeight: '700' }}>Return to modules</Text></Pressable>
  </Screen></>;
}
 const styles = StyleSheet.create({ heading: { gap: 7 }, eyebrow: { fontSize: 11, letterSpacing: 1.3, fontWeight: '700' }, title: { fontSize: 29, fontWeight: '700' }, intro: { fontSize: 14, lineHeight: 21 }, switcher: { borderRadius: 12, padding: 4, flexDirection: 'row' }, switch: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 9 }, lesson: { borderWidth: 1, borderRadius: 14, padding: 15, gap: 12 }, noticeTitle: { fontSize: 15, fontWeight: '700' }, noticeText: { fontSize: 13, lineHeight: 19 }, practice: { minHeight: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }, back: { alignSelf: 'center', padding: 10 } });