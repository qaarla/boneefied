import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Heading, Text, useTypographyLayout } from '@/components/ScaledText';
import { AdaptiveCard, AdaptiveRow } from '@/components/AdaptiveLayout';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { content } from '@/content/canonical';
import { progressRollups } from '@/content/study';
import { useStudy } from '@/context/StudyContext';
import { TEXT_SCALE_FACTORS } from '@/context/typographyScale';
import { useColors } from '@/hooks/useColors';

export default function ProgressScreen() {
  const colors = useColors();
  const { isCompactTextLayout, isLargeText, systemFontScale } = useTypographyLayout();
  const shouldReflow = isCompactTextLayout || isLargeText;
  const { width } = useWindowDimensions();
  const { attempts, mastery, preferences } = useStudy();
  const metricMinWidth = Math.min(
    Math.ceil(100 * TEXT_SCALE_FACTORS[preferences.textScale] * systemFontScale),
    Math.max(0, Math.min(width, 720) - (shouldReflow ? 32 : 40)),
  );
  const correct = attempts.filter((attempt) => attempt.correct).length;
  const rollups = progressRollups(content, attempts, mastery);
  return <Screen><Text style={[styles.eyebrow, { color: colors.primary }]}>LOCAL RECORD</Text><Heading accessibilityLabel="Progress" style={[styles.title, { color: colors.foreground }]}>Pro{'\u00AD'}gress</Heading><Text style={[styles.intro, { color: colors.mutedForeground }]}>Deterministic structure-level mastery, stored only on this device.</Text>
    <View style={styles.metrics}>{[['Items', String(content.questions.length)], ['Attempts', String(attempts.length)], ['Accuracy', attempts.length ? `${Math.round(correct / attempts.length * 100)}%` : '—']].map(([label, value]) => <AdaptiveCard key={label} style={[styles.metric, { flexBasis: metricMinWidth, minWidth: metricMinWidth, backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.value, { color: colors.foreground }]}>{value}</Text><Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text></AdaptiveCard>)}</View>
    <Heading style={[styles.section, { color: colors.foreground }]}>Curriculum coverage</Heading>
    {rollups.modules.map((module) => <View key={module.id}>
        <AdaptiveRow style={[styles.record, responsive.record, shouldReflow && responsive.largeRecord, { backgroundColor: colors.card, borderColor: colors.border }]}>
         <Text style={[styles.recordTitle, shouldReflow && responsive.largeRecordTitle, { color: colors.foreground }]}>{module.title}</Text>
         <Text style={[responsive.recordStatus, shouldReflow && responsive.largeRecordStatus, { color: colors.primary }]}>
          {module.coveredCount}/{module.structureCount} · {module.attempts ? `${Math.round((module.accuracy ?? 0) * 100)}%` : '—'}
          {'\n'}{module.attempts} attempts
        </Text>
       </AdaptiveRow>
      {rollups.lessons.filter((lesson) => lesson.moduleId === module.id).map((lesson) =>
        <View key={lesson.id} style={[styles.lessonRecord, { borderBottomColor: colors.border }]}>
          <Text style={[styles.lessonTitle, { color: colors.foreground }]}>{lesson.title}</Text>
          <Text style={{ color: colors.mutedForeground }}>
            {lesson.coveredCount}/{lesson.structureCount} · {lesson.attempts ? `${Math.round((lesson.accuracy ?? 0) * 100)}% accuracy` : 'No attempts'}
          </Text>
        </View>,
      )}
    </View>)}
    {rollups.modules.length === 0 && <EmptyState icon="bar-chart-2" title="No published modules" message="Published curriculum progress will appear here." />}
    <Text style={[styles.note, { color: colors.mutedForeground }]}>Coverage counts canonical structures with a local attempt or mastery record. Accuracy is based on submitted attempts; each attempt is assigned to one structure.</Text>
  </Screen>;
}
const styles = StyleSheet.create({ eyebrow: { fontSize: 11, letterSpacing: 1.6, fontWeight: '700' }, title: { fontSize: 32, fontWeight: '700', marginTop: -10 }, intro: { fontSize: 15, lineHeight: 22, marginTop: -10 }, metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, metric: { flexGrow: 1, flexShrink: 0, borderWidth: 1, borderRadius: 14, padding: 14, gap: 5 }, value: { fontSize: 22, fontWeight: '700' }, label: { fontSize: 11 }, section: { fontSize: 17, fontWeight: '700', marginTop: 5 }, record: { borderWidth: 1, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between' }, recordTitle: { flex: 1, fontWeight: '600' }, lessonRecord: { paddingVertical: 9, paddingLeft: 14, borderBottomWidth: StyleSheet.hairlineWidth, gap: 3 }, lessonTitle: { fontSize: 13, fontWeight: '500' }, note: { fontSize: 12, lineHeight: 18 } });
const responsive = StyleSheet.create({
  record: { flexWrap: 'wrap', alignItems: 'flex-start', gap: 8 },
  recordStatus: { flexShrink: 1, minWidth: 0, alignSelf: 'flex-end', textAlign: 'right' },
  largeRecord: { flexDirection: 'column', alignItems: 'stretch' },
  largeRecordTitle: { flex: 0, alignSelf: 'stretch' },
  largeRecordStatus: { flexShrink: 1, alignSelf: 'stretch', textAlign: 'left' },
});