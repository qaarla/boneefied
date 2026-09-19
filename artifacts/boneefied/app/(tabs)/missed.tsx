import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { useStudy } from '@/context/StudyContext';
import { useColors } from '@/hooks/useColors';

export default function MissedScreen() {
  const colors = useColors();
  const router = useRouter();
  const { missed, hydrated } = useStudy();
  return <Screen><Text style={[styles.eyebrow, { color: colors.primary }]}>REVIEW QUEUE</Text><Text style={[styles.title, { color: colors.foreground }]}>Missed</Text><Text style={[styles.intro, { color: colors.mutedForeground }]}>Incorrect answers stay here until a later successful recall clears them. History is never deleted.</Text>
    {!hydrated ? <Text style={{ color: colors.mutedForeground }}>Loading local review state…</Text> : missed.length === 0 ? <EmptyState icon="check-circle" title="Nothing to review" message="Your missed queue is empty. Verified questions will appear here after an incorrect answer." /> : <><EmptyState icon="rotate-ccw" title={`${missed.length} item${missed.length === 1 ? '' : 's'} to retry`} message="Your incorrect attempts remain in history even after recovery." /><Pressable onPress={() => router.push('/(tabs)/practice')} style={[styles.retry, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Retry module practice</Text></Pressable></>}
  </Screen>;
}
const styles = StyleSheet.create({ eyebrow: { fontSize: 11, letterSpacing: 1.6, fontWeight: '700' }, title: { fontSize: 32, fontWeight: '700', marginTop: -10 }, intro: { fontSize: 15, lineHeight: 22, marginTop: -10 }, retry:{minHeight:48,borderRadius:12,alignItems:'center',justifyContent:'center'} });