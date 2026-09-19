import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { content } from '@/content/canonical';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';

export default function StudyScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selectedSystem, setSelectedSystem] = React.useState<string | null>(null);
  const systems = [
    ['Cells & tissues', 'cell'], ['Integumentary', 'skin'], ['Skeletal', 'skeletal-system'], ['Joints & ligaments', 'joints'],
    ['Muscular', 'muscular'], ['Nervous system & brain', 'nervous'], ['Cranial & peripheral nerves', 'nerves'], ['Special senses', 'senses'],
    ['Endocrine', 'endocrine'], ['Blood & cardiovascular', 'cardiovascular'], ['Blood vessels', 'vessels'], ['Lymphatic', 'lymphatic'],
    ['Respiratory', 'respiratory'], ['Digestive', 'digestive'], ['Urinary', 'urinary'], ['Male reproductive', 'male-reproductive'], ['Female reproductive', 'female-reproductive'],
  ] as const;
   const matchesSystem = (item: (typeof content.modules)[number], system: string) => item.system === system || item.id === system || (system === 'nerves' && item.id === 'nervous-system');
   const visibleModules = content.modules.filter((item) => item.visible && (!selectedSystem || matchesSystem(item, selectedSystem)));
  const { mastery, bookmarks, toggleBookmark } = useStudy();
  const [query, setQuery] = React.useState('');
  const matching = content.structures.filter((item) => `${item.canonicalName} ${item.acceptedAliases.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  return <Screen>
    <View style={styles.brand}><Image source={require('@/assets/images/logo-rounded.png')} style={styles.logo} /><View style={styles.cardCopy}><Text style={[styles.kicker, { color: colors.primary }]}>BONEEFIED</Text><Text style={[styles.heading, { color: colors.foreground }]}>Study lab</Text></View><Pressable accessibilityLabel="Open settings" onPress={() => router.push('/settings')}><Text style={{ color: colors.primary, fontWeight: '700' }}>Settings</Text></Pressable></View>
    <Text style={[styles.lede, { color: colors.mutedForeground }]}>A comprehensive anatomy library for learning locations, relationships, landmarks, and recognition cues—not just lab review.</Text>
    <TextInput accessibilityLabel="Search structures and aliases" value={query} onChangeText={setQuery} placeholder="Search structures or aliases" placeholderTextColor={colors.mutedForeground} style={[styles.search, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} />
     <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Explore by system</Text><Text style={[styles.count, { color: colors.mutedForeground }]}>{systems.length} systems</Text></View>
     <View style={styles.systems}>{systems.map(([label, id]) => <Pressable key={id} onPress={() => setSelectedSystem(selectedSystem === id ? null : id)} style={[styles.system, { borderColor: selectedSystem === id ? colors.primary : colors.border, backgroundColor: selectedSystem === id ? colors.secondary : colors.card }]}><Text style={{ color: colors.foreground, fontWeight: '600' }}>{label}</Text><Text style={{ color: colors.mutedForeground }}>{content.modules.some((item) => matchesSystem(item, id)) ? 'Open' : 'Coming next'}</Text></Pressable>)}</View>
     <View style={styles.sectionHeader}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Learning modules</Text><Text style={[styles.count, { color: colors.mutedForeground }]}>{visibleModules.length} available</Text></View>
     {visibleModules.map((module, index) => <Pressable key={module.id} testID={`module-card-${module.id}`} accessibilityRole="button" onPress={() => { Haptics.selectionAsync(); router.push(`/module/${module.id}`); }} style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
       <View style={styles.cardTop}><View style={[styles.moduleMark, { backgroundColor: colors.primary }]}><Text style={[styles.moduleMarkText, { color: colors.primaryForeground }]}>{String(index + 1).padStart(2, '0')}</Text></View><View style={styles.cardCopy}><Text style={[styles.cardTitle, { color: colors.foreground }]}>{module.title}</Text><Text style={[styles.cardSub, { color: colors.mutedForeground }]}>{module.summary ?? (module.id === 'cytology-mitosis' ? 'Lab 2 · source-checked text lessons' : 'Open learning module')}</Text></View><Text style={[styles.arrow, { color: colors.primary }]}>›</Text></View>
       <View style={styles.meta}><Text style={{ color: colors.mutedForeground }}>{content.structures.filter((item) => item.moduleId === module.id).length} structures · {content.questions.filter((item) => item.moduleId === module.id).length} questions</Text><Text style={{ color: colors.mutedForeground }}>{mastery.length ? `${mastery.length} started` : 'Not started'}</Text></View>
     </Pressable>)}
     {query.length > 0 && <View style={[styles.results, { backgroundColor: colors.card, borderColor: colors.border }]}>{matching.slice(0, 8).map((item) => <View key={item.id} style={styles.resultRow}><Text style={{ color: colors.foreground }}>{item.canonicalName}</Text><Pressable onPress={() => { toggleBookmark(item.id); }}><Text style={{ color: colors.primary }}>{bookmarks.includes(item.id) ? '★ Saved' : '☆ Save'}</Text></Pressable></View>)}</View>}
    <View style={[styles.offline, { backgroundColor: colors.secondary }]}><View style={[styles.signal, { backgroundColor: colors.primary }]} /><Text style={[styles.offlineText, { color: colors.foreground }]}>Offline-ready · local content and progress</Text></View>
  </Screen>;
}
const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12 }, logo: { width: 48, height: 48, borderRadius: 14 }, kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.8 }, heading: { fontSize: 28, fontWeight: '700', marginTop: 1 }, lede: { fontSize: 15, lineHeight: 22, maxWidth: 560 }, search:{borderWidth:1,borderRadius:12,padding:13,fontSize:15}, sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 5 }, sectionTitle: { fontSize: 19, fontWeight: '700' }, count: { fontSize: 12 }, systems:{gap:8}, system:{borderWidth:1,borderRadius:12,padding:12,flexDirection:'row',justifyContent:'space-between',gap:10}, card: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 16 }, cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 }, moduleMark: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, moduleMarkText: { fontSize: 13, fontWeight: '800' }, cardCopy: { flex: 1, gap: 3 }, cardTitle: { fontSize: 17, fontWeight: '700' }, cardSub: { fontSize: 12 }, arrow: { fontSize: 30, fontWeight: '300' }, progressTrack: { height: 6, borderRadius: 6, overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 6 }, meta: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 12 }, results:{borderWidth:1,borderRadius:14,padding:14,gap:12},resultRow:{flexDirection:'row',justifyContent:'space-between'}, offline: { alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 99, flexDirection: 'row', alignItems: 'center', gap: 8 }, signal: { width: 7, height: 7, borderRadius: 7 }, offlineText: { fontSize: 12, fontWeight: '600' },
});
