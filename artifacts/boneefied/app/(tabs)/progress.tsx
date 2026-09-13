import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { content } from '@/content/canonical';
import { useStudy } from '@/context/StudyContext';
import { useColors } from '@/hooks/useColors';

export default function ProgressScreen() {
  const colors = useColors();
  const { attempts, mastery } = useStudy();
  const correct = attempts.filter((attempt) => attempt.correct).length;
  return <Screen><Text style={[styles.eyebrow, { color: colors.primary }]}>LOCAL RECORD</Text><Text style={[styles.title, { color: colors.foreground }]}>Progress</Text><Text style={[styles.intro, { color: colors.mutedForeground }]}>Deterministic structure-level mastery, stored only on this device.</Text>
    <View style={styles.metrics}>{[['Items', String(content.questions.length)], ['Attempts', String(attempts.length)], ['Accuracy', attempts.length ? `${Math.round(correct / attempts.length * 100)}%` : '—']].map(([label, value]) => <View key={label} style={[styles.metric, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.value, { color: colors.foreground }]}>{value}</Text><Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text></View>)}</View>
    <Text style={[styles.section, { color: colors.foreground }]}>Structure mastery</Text>
    {mastery.length === 0 ? <EmptyState icon="bar-chart-2" title="No structure records yet" message="Progress will be tracked at structure level after verified practice items are added." /> : mastery.map((item) => <View key={item.structureId} style={[styles.record, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={{ color: colors.foreground }}>{item.structureId}</Text><Text style={{ color: colors.primary }}>{item.state}</Text></View>)}
    <Text style={[styles.note, { color: colors.mutedForeground }]}>{content.modules[0]?.title}: 0 verified structures · 0% complete</Text>
  </Screen>;
}
const styles = StyleSheet.create({ eyebrow: { fontSize: 11, letterSpacing: 1.6, fontWeight: '700' }, title: { fontSize: 32, fontWeight: '700', marginTop: -10 }, intro: { fontSize: 15, lineHeight: 22, marginTop: -10 }, metrics: { flexDirection: 'row', gap: 8 }, metric: { flex: 1, borderWidth: 1, borderRadius: 14, padding: 14, gap: 5 }, value: { fontSize: 22, fontWeight: '700' }, label: { fontSize: 11 }, section: { fontSize: 17, fontWeight: '700', marginTop: 5 }, record: { borderWidth: 1, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between' }, note: { fontSize: 12, lineHeight: 18 } });