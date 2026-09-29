import React from 'react';
import { StyleSheet } from 'react-native';
import { Heading, Text, useTypographyLayout } from '@/components/ScaledText';
import { AdaptiveButton } from '@/components/AdaptiveLayout';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { useStudy } from '@/context/StudyContext';
import { useColors } from '@/hooks/useColors';
import { content } from '@/content/canonical';

export default function MissedScreen() {
  const colors = useColors();
  const { isCompactTextLayout, isLargeText } = useTypographyLayout();
  const shouldReflow = isCompactTextLayout || isLargeText;
  const router = useRouter();
  const { missed, hydrated } = useStudy();
  return <Screen><Text style={[styles.eyebrow, { color: colors.primary }]}>REVIEW QUEUE</Text><Heading accessibilityLabel="Missed" style={[styles.title, { color: colors.foreground }]}>Miss{'\u00AD'}ed</Heading><Text style={[styles.intro, { color: colors.mutedForeground }]}>Incorrect answers stay here until a later successful recall clears them. History is never deleted.</Text>
    {!hydrated ? <Text style={{ color: colors.mutedForeground }}>Loading local review state…</Text> : missed.length === 0 ? <EmptyState icon="check-circle" title="Nothing to review" message="Your missed queue is empty. Verified questions will appear here after an incorrect answer." /> : <><EmptyState icon="rotate-ccw" title={`${missed.length} item${missed.length === 1 ? '' : 's'} to retry`} message="Your incorrect attempts remain in history even after recovery." />{missed.map((item) => {
      const question = content.questions.find((candidate) => candidate.id === item.questionId);
        return question ? <AdaptiveButton key={item.questionId} accessibilityLabel={`Retry: ${question.prompt}`} onPress={() => router.push(`/(tabs)/practice?questionId=${encodeURIComponent(item.questionId)}&retryId=${Date.now()}`)} style={[styles.retry, shouldReflow && styles.largeRetry, { backgroundColor: colors.primary }]}>
          <Text style={[shouldReflow && styles.largeRetryText, { color: colors.primaryForeground, fontWeight: '700' }]}>{question.prompt}</Text>
        <Text style={{ color: colors.primaryForeground, fontSize: 12 }}>{item.incorrectCount} incorrect attempt{item.incorrectCount === 1 ? '' : 's'} · Retry</Text>
       </AdaptiveButton> : <Text key={item.questionId} style={{ color: colors.mutedForeground }}>A previously missed question is no longer available; your attempt history remains saved.</Text>;
    })}</>}
  </Screen>;
}
const styles = StyleSheet.create({ eyebrow: { fontSize: 11, letterSpacing: 1.6, fontWeight: '700' }, title: { fontSize: 32, fontWeight: '700', marginTop: -10 }, intro: { fontSize: 15, lineHeight: 22, marginTop: -10 }, retry:{minHeight:48,borderRadius:12,paddingHorizontal:14,paddingVertical:10,alignItems:'flex-start',justifyContent:'center',gap:3}, largeRetry:{alignItems:'stretch'}, largeRetryText:{alignSelf:'stretch',minWidth:0} });