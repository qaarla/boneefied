import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { content } from '@/content/canonical';
import { useColors } from '@/hooks/useColors';

export default function StudyScreen() {
  const colors = useColors();
  const router = useRouter();
  const module = content.modules[0];
  return <Screen>
    <View style={styles.brand}><Image source={require('@/assets/images/logo-rounded.png')} style={styles.logo} /><View><Text style={[styles.kicker, { color: colors.primary }]}>BONEEFIED</Text><Text style={[styles.heading, { color: colors.foreground }]}>Study lab</Text></View></View>
    <Text style={[styles.lede, { color: colors.mutedForeground }]}>A focused anatomy practical companion, built from verified course sources.</Text>
    <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Modules</Text><Text style={[styles.count, { color: colors.mutedForeground }]}>{content.modules.length} module</Text></View>
    <Pressable testID="module-card" accessibilityRole="button" onPress={() => { Haptics.selectionAsync(); router.push(`/module/${module.id}`); }} style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
      <View style={styles.cardTop}><View style={[styles.moduleMark, { backgroundColor: colors.primary }]}><Text style={[styles.moduleMarkText, { color: colors.primaryForeground }]}>01</Text></View><View style={styles.cardCopy}><Text style={[styles.cardTitle, { color: colors.foreground }]}>{module.title}</Text><Text style={[styles.cardSub, { color: colors.mutedForeground }]}>Module shell · source pending</Text></View><Text style={[styles.arrow, { color: colors.primary }]}>›</Text></View>
      <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}><View style={[styles.progressFill, { backgroundColor: colors.primary, width: '0%' }]} /></View>
      <View style={styles.meta}><Text style={{ color: colors.mutedForeground }}>0 verified items</Text><Text style={{ color: colors.mutedForeground }}>0% started</Text></View>
    </Pressable>
    <EmptyState icon="file-text" title="Source audit in progress" message="Cytology / Mitosis is visible as a content-blocked shell. The only supplied course file is an implementation brief, so no anatomy material is published." />
    <View style={[styles.offline, { backgroundColor: colors.secondary }]}><View style={[styles.signal, { backgroundColor: colors.primary }]} /><Text style={[styles.offlineText, { color: colors.foreground }]}>Offline-ready · local content and progress</Text></View>
  </Screen>;
}
const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 }, logo: { width: 48, height: 48, borderRadius: 14 }, kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.8 }, heading: { fontSize: 28, fontWeight: '700', marginTop: 1 }, lede: { fontSize: 15, lineHeight: 22, maxWidth: 560 }, sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 5 }, sectionTitle: { fontSize: 19, fontWeight: '700' }, count: { fontSize: 12 }, card: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 16 }, cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 }, moduleMark: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, moduleMarkText: { fontSize: 13, fontWeight: '800' }, cardCopy: { flex: 1, gap: 3 }, cardTitle: { fontSize: 17, fontWeight: '700' }, cardSub: { fontSize: 12 }, arrow: { fontSize: 30, fontWeight: '300' }, progressTrack: { height: 6, borderRadius: 6, overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 6 }, meta: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 12 }, offline: { alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 99, flexDirection: 'row', alignItems: 'center', gap: 8 }, signal: { width: 7, height: 7, borderRadius: 7 }, offlineText: { fontSize: 12, fontWeight: '600' },
});
