import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { QUESTION_TYPES } from '@/content/model';
import { useColors } from '@/hooks/useColors';
import * as Haptics from 'expo-haptics';

export default function PracticeScreen() {
  const colors = useColors();
  return <Screen>
    <Text style={[styles.eyebrow, { color: colors.primary }]}>PRACTICE LAB</Text>
    <Text style={[styles.title, { color: colors.foreground }]}>Practice</Text>
    <Text style={[styles.intro, { color: colors.mutedForeground }]}>Configure a practical session from verified course material.</Text>
    <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.panelTitle, { color: colors.foreground }]}>Session settings</Text>
      <View style={styles.row}><Text style={{ color: colors.mutedForeground }}>Module</Text><Text style={{ color: colors.foreground, fontWeight: '600' }}>Cytology / Mitosis</Text></View>
      <View style={styles.row}><Text style={{ color: colors.mutedForeground }}>Question count</Text><Text style={{ color: colors.foreground, fontWeight: '600' }}>Verified only</Text></View>
      <View style={styles.row}><Text style={{ color: colors.mutedForeground }}>Focus</Text><Text style={{ color: colors.foreground, fontWeight: '600' }}>All material</Text></View>
    </View>
    <EmptyState icon="lock" title="Practice is unavailable" message="The supplied brief contains no anatomy teaching content, images, answers, or verified questions. Practice will unlock when a course source is added." />
    <Text style={[styles.section, { color: colors.foreground }]}>Supported question architecture</Text>
    <View style={styles.types}>{QUESTION_TYPES.map((type) => <Pressable key={type.id} disabled onPress={() => Haptics.selectionAsync()} style={[styles.type, { borderColor: colors.border, backgroundColor: colors.secondary }]}><Text style={{ color: colors.mutedForeground }}>{type.label}</Text><FeatherDot color={colors.mutedForeground} /></Pressable>)}</View>
  </Screen>;
}
function FeatherDot({ color }: { color: string }) { return <View style={[styles.dot, { backgroundColor: color }]} />; }
const styles = StyleSheet.create({ eyebrow: { fontSize: 11, letterSpacing: 1.6, fontWeight: '700' }, title: { fontSize: 32, fontWeight: '700', marginTop: -10 }, intro: { fontSize: 15, lineHeight: 22, marginTop: -10 }, panel: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 15 }, panelTitle: { fontSize: 16, fontWeight: '700' }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }, section: { fontSize: 17, fontWeight: '700', marginTop: 4 }, types: { gap: 8 }, type: { minHeight: 46, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, dot: { width: 7, height: 7, borderRadius: 7 } });