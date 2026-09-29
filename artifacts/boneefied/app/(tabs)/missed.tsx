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
import { useLocale } from '@/locales/useLocale';

export default function MissedScreen() {
  const colors = useColors();
  const { t, question: localizeQuestion, number } = useLocale();
  const { isCompactTextLayout, isLargeText } = useTypographyLayout();
  const shouldReflow = isCompactTextLayout || isLargeText;
  const router = useRouter();
  const { missed, hydrated } = useStudy();
  return <Screen><Text style={[styles.eyebrow, { color: colors.primary }]}>{t('missed.reviewQueue')}</Text><Heading accessibilityLabel={t('missed.heading')} style={[styles.title, { color: colors.foreground }]}>{t('missed.heading')}</Heading><Text style={[styles.intro, { color: colors.mutedForeground }]}>{t('missed.intro')}</Text>
    {!hydrated ? <Text style={{ color: colors.mutedForeground }}>{t('missed.loading')}</Text> : missed.length === 0 ? <EmptyState icon="check-circle" title={t('missed.emptyTitle')} message={t('missed.emptyMessage')} /> : <><EmptyState icon="rotate-ccw" title={t(missed.length === 1 ? 'missed.retryCount.one' : 'missed.retryCount.other', { count: number(missed.length) })} message={t('missed.historyPreserved')} />{missed.map((item) => {
      const question = content.questions.find((candidate) => candidate.id === item.questionId);
      const localizedQuestion = question ? localizeQuestion(question) : undefined;
      return question && localizedQuestion ? <AdaptiveButton key={item.questionId} accessibilityLabel={t('missed.retryQuestion', { question: localizedQuestion.prompt })} onPress={() => router.push(`/(tabs)/practice?questionId=${encodeURIComponent(item.questionId)}&retryId=${Date.now()}`)} style={[styles.retry, shouldReflow && styles.largeRetry, { backgroundColor: colors.primary }]}>
        <Text style={[shouldReflow && styles.largeRetryText, { color: colors.primaryForeground, fontWeight: '700' }]}>{localizedQuestion.prompt}</Text>
         <Text style={{ color: colors.primaryForeground, fontSize: 12 }}>{t(item.incorrectCount === 1 ? 'missed.incorrectAttempts.one' : 'missed.incorrectAttempts.other', { count: number(item.incorrectCount) })}</Text>
      </AdaptiveButton> : <Text key={item.questionId} style={{ color: colors.mutedForeground }}>{t('missed.unavailableQuestion')}</Text>;
    })}</>}
  </Screen>;
}
const styles = StyleSheet.create({ eyebrow: { fontSize: 11, letterSpacing: 1.6, fontWeight: '700' }, title: { fontSize: 32, fontWeight: '700', marginTop: -10 }, intro: { fontSize: 15, lineHeight: 22, marginTop: -10 }, retry:{minHeight:48,borderRadius:12,paddingHorizontal:14,paddingVertical:10,alignItems:'flex-start',justifyContent:'center',gap:3}, largeRetry:{alignItems:'stretch'}, largeRetryText:{alignSelf:'stretch',minWidth:0} });