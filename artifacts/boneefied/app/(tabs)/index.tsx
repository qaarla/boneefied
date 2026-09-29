import React from 'react';
import { AccessibilityInfo, Image, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View, type LayoutRectangle } from 'react-native';
import { Heading, Text, TextInput, useTypographyLayout } from '@/components/ScaledText';
import { AdaptiveButton, AdaptiveRow } from '@/components/AdaptiveLayout';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';
import { content } from '@/content/canonical';
import { createAnatomySearchIndex, searchAnatomy } from '@/content/search';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';

const anatomySearchIndex = createAnatomySearchIndex(content);

export default function StudyScreen() {
  const colors = useColors();
  const { isLargeText, isCompactTextLayout } = useTypographyLayout();
  const reflow = isCompactTextLayout || isLargeText;
  const router = useRouter();
  const { width } = useWindowDimensions();
  const stackModuleMeta = width < 480;
  const [selectedSystem, setSelectedSystem] = React.useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = React.useState(true);
  const pageRef = React.useRef<ScrollView>(null);
  const pageY = React.useRef(0);
  const viewport = React.useRef({ height: 0, bottomClearance: 0 });
  const learningHeading = React.useRef<LayoutRectangle | null>(null);
  const firstResult = React.useRef<{ id: string; layout: LayoutRectangle } | null>(null);
  const pendingReveal = React.useRef(false);
  const revealFrame = React.useRef<number | null>(null);
  const systems = [
    ['Cells & tissues', 'cell'], ['Integumentary', 'skin'], ['Skeletal', 'skeletal-system'], ['Joints & ligaments', 'joints'],
    ['Muscular', 'muscular'], ['Nervous system & brain', 'nervous'], ['Cranial & peripheral nerves', 'nerves'], ['Special senses', 'senses'],
    ['Endocrine', 'endocrine'], ['Blood & cardiovascular', 'cardiovascular'], ['Blood vessels', 'vessels'], ['Lymphatic', 'lymphatic'],
    ['Respiratory', 'respiratory'], ['Digestive', 'digestive'], ['Urinary', 'urinary'], ['Male reproductive', 'male-reproductive'], ['Female reproductive', 'female-reproductive'],
  ] as const;
   const matchesSystem = (item: (typeof content.modules)[number], system: string) => item.system === system || item.id === system || (system === 'nerves' && item.id === 'nervous-system');
   const visibleModules = content.modules.filter((item) => item.visible && item.published && (!selectedSystem || matchesSystem(item, selectedSystem)));
  const firstResultId = visibleModules[0]?.id ?? `empty:${selectedSystem}`;
  React.useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);
  React.useEffect(() => () => {
    if (revealFrame.current !== null) cancelAnimationFrame(revealFrame.current);
  }, []);
  const revealIfNeeded = () => {
    if (!pendingReveal.current || !selectedSystem || !learningHeading.current || firstResult.current?.id !== firstResultId) return;
    const usableHeight = viewport.current.height - viewport.current.bottomClearance;
    if (usableHeight <= 0) return;
    const { y, height } = firstResult.current.layout;
    const visibleTop = pageY.current;
    const visibleBottom = visibleTop + usableHeight;
    const resultVisible = y >= visibleTop && y + Math.min(height, usableHeight * 0.35) <= visibleBottom;
    pendingReveal.current = false;
    if (!resultVisible) pageRef.current?.scrollTo({ y: learningHeading.current.y, animated: !reduceMotion });
  };
  const scheduleReveal = () => {
    if (!pendingReveal.current) return;
    if (revealFrame.current !== null) cancelAnimationFrame(revealFrame.current);
    revealFrame.current = requestAnimationFrame(() => {
      revealFrame.current = null;
      revealIfNeeded();
    });
  };
  React.useEffect(() => {
    if (selectedSystem) scheduleReveal();
  }, [selectedSystem, firstResultId]);
  const selectSystem = (id: string) => {
    const next = selectedSystem === id ? null : id;
    pendingReveal.current = next !== null;
    setSelectedSystem(next);
  };
  const { mastery, bookmarks, preferences, toggleBookmark } = useStudy();
  const [query, setQuery] = React.useState('');
  const matching = React.useMemo(() => searchAnatomy(anatomySearchIndex, query), [query]);
   const systemChoices = systems.map(([label, id]) => <AdaptiveButton key={id} accessibilityRole="button" hitSlop={4} onPress={() => selectSystem(id)} style={[styles.system, reflow && responsive.systemLarge, { borderColor: selectedSystem === id ? colors.primary : colors.border, backgroundColor: selectedSystem === id ? colors.secondary : colors.card }]}><View style={[responsive.systemName, reflow && responsive.systemNameLarge]}><Text style={{ color: colors.foreground, fontWeight: '600' }}>{label}</Text></View><Text style={[responsive.trailingStatus, reflow && responsive.systemStatusLarge, { color: colors.mutedForeground }]}>{content.modules.some((item) => matchesSystem(item, id)) ? 'Open' : 'Coming next'}</Text></AdaptiveButton>);
  const searchResults = matching.map((match) => {
    const name = match.matchedTerm === match.structure.canonicalName ? match.structure.canonicalName : match.matchedTerm;
    const context = `${match.matchedTerm === match.structure.canonicalName ? '' : `${match.structure.canonicalName} · `}${match.module.title} · ${match.structure.category}`;
    return <View key={match.structure.id} style={[searchStyles.row, { borderTopColor: colors.border }]}>
      <Pressable
        testID={`search-result-${match.structure.id}`}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${context}. Open study module`}
        onPress={() => { if (preferences.haptics) void Haptics.selectionAsync(); router.push(`/module/${match.module.id}`); }}
        style={searchStyles.target}
      >
        <Text style={[searchStyles.title, { color: colors.foreground }]}>{name}</Text>
        <Text style={[searchStyles.context, { color: colors.mutedForeground }]}>{context}</Text>
      </Pressable>
       <Pressable accessibilityRole="button" accessibilityLabel={`${bookmarks.includes(match.structure.id) ? 'Remove bookmark for' : 'Bookmark'} ${match.structure.canonicalName}`} accessibilityState={{ selected: bookmarks.includes(match.structure.id) }} hitSlop={2} onPress={() => toggleBookmark(match.structure.id)} style={[searchStyles.bookmark, reflow && searchStyles.bookmarkLarge]}>
        <Text style={{ color: colors.primary }}>{bookmarks.includes(match.structure.id) ? '★ Saved' : '☆ Save'}</Text>
      </Pressable>
    </View>;
  });
  return <Screen scrollRef={pageRef} keyboardShouldPersistTaps="handled" onScroll={(event) => { pageY.current = event.nativeEvent.contentOffset.y; }} onViewportLayout={(height, bottomClearance) => { viewport.current = { height, bottomClearance }; scheduleReveal(); }}>
    <View style={[styles.brand, Platform.OS === 'web' && styles.brandWebInset, reflow && responsive.brandReflow]}>
      <Image source={require('@/assets/images/logo-rounded.png')} style={styles.logo} accessibilityLabel="Boneefied skull and atom logo" />
      <Heading accessibilityLabel="Boneefied" style={[styles.brandTitle, reflow && responsive.brandTitleReflow, { color: colors.foreground }]}>Bonee{'\u00AD'}fied</Heading>
      <Pressable
        testID="study-settings-button"
        accessibilityLabel="Settings"
        accessibilityHint="Opens settings"
        accessibilityRole="button"
        hitSlop={4}
        onPress={() => router.push('/settings')}
        style={({ pressed }) => [styles.settingsAction, reflow && responsive.settingsActionReflow, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Feather name="settings" size={21} color={colors.mutedForeground} />
      </Pressable>
    </View>
    <Text style={[styles.lede, { color: colors.mutedForeground }]}>Comprehensive anatomy study.</Text>
    <View style={searchStyles.container}>
       {reflow && <Text style={{ color: colors.mutedForeground }}>Search anatomy</Text>}
       <TextInput accessibilityLabel="Search anatomy" value={query} onChangeText={setQuery} placeholder={reflow ? 'Search' : 'Search anatomy'} placeholderTextColor={colors.mutedForeground} returnKeyType="search" style={[styles.search, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} />
      {query.trim().length > 0 && <View testID="anatomy-search-results" accessibilityLabel="Anatomy search results" style={[searchStyles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[searchStyles.heading, { color: colors.mutedForeground }]}>{matching.length ? 'Suggested structures' : 'No close match'}</Text>
        {matching.length > 0 && (reflow
          ? <View style={[searchStyles.content, searchStyles.scrollNatural]}>{searchResults}</View>
          : <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="always" style={searchStyles.scroll} contentContainerStyle={searchStyles.content} showsVerticalScrollIndicator>{searchResults}</ScrollView>)}
      </View>}
    </View>
      <AdaptiveRow style={[styles.sectionHeader, responsive.sectionHeader, reflow && responsive.sectionHeaderStacked]}><Heading style={[styles.sectionTitle, responsive.sectionTitle, { color: colors.foreground }]}>Explore by system</Heading><Text style={[styles.count, responsive.sectionCount, { color: colors.mutedForeground }]}>{systems.length} systems</Text></AdaptiveRow>
      <View style={[styles.systemsPanel, !reflow && { height: Math.min(width - 40, 300) }, { borderColor: colors.border, backgroundColor: colors.card }]}>
        {reflow
          ? <View testID="study-systems-scroll" accessibilityLabel="Explore by system choices" style={[styles.systems, styles.systemsContent]}>{systemChoices}</View>
          : <ScrollView testID="study-systems-scroll" accessibilityLabel="Explore by system choices" tabIndex={Platform.OS === 'web' ? 0 : undefined} nestedScrollEnabled keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.systems, styles.systemsContent]} showsVerticalScrollIndicator>{systemChoices}</ScrollView>}
      </View>
      <AdaptiveRow onLayout={(event) => { learningHeading.current = event.nativeEvent.layout; scheduleReveal(); }} style={[styles.sectionHeader, responsive.sectionHeader, reflow && responsive.sectionHeaderStacked]}><Heading style={[styles.sectionTitle, responsive.sectionTitle, { color: colors.foreground }]}>Learning modules</Heading><Text style={[styles.count, responsive.sectionCount, { color: colors.mutedForeground }]}>{visibleModules.length} available</Text></AdaptiveRow>
      {visibleModules.map((module, index) => <AdaptiveButton key={module.id} onLayout={index === 0 ? (event) => { firstResult.current = { id: module.id, layout: event.nativeEvent.layout }; scheduleReveal(); } : undefined} testID={`module-card-${module.id}`} accessibilityRole="button" onPress={() => { if (preferences.haptics) void Haptics.selectionAsync(); router.push(`/module/${module.id}`); }} style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
        <AdaptiveRow style={[styles.cardTop, reflow && responsive.cardTopStacked]}><View style={[styles.moduleMark, { backgroundColor: colors.primary }]}>{reflow ? <Feather name="book-open" size={20} color={colors.primaryForeground} /> : <Text style={[styles.moduleMarkText, { color: colors.primaryForeground }]}>{String(index + 1).padStart(2, '0')}</Text>}</View><View style={[styles.cardCopy, responsive.flexibleCopy, reflow && responsive.cardCopyStacked]}><Text style={[styles.cardTitle, { color: colors.foreground }]}>{module.title}</Text><Text style={[styles.cardSub, { color: colors.mutedForeground }]}>{module.summary ?? (module.id === 'cytology-mitosis' ? 'Lab 2 · source-checked text lessons' : 'Open learning module')}</Text></View>{!reflow && <Text style={[styles.arrow, responsive.trailingStatus, { color: colors.primary }]}>›</Text>}</AdaptiveRow>
          <AdaptiveRow style={[styles.meta, responsive.meta, (stackModuleMeta || reflow) && responsive.metaStacked]}>
          <View style={responsive.metaDetails}>
            <Text style={{ color: colors.mutedForeground }}>{content.structures.filter((item) => item.moduleId === module.id).length} structures · {content.questions.filter((item) => item.moduleId === module.id).length} questions</Text>
          </View>
           <View style={[responsive.metaStatus, (stackModuleMeta || reflow) && responsive.metaStatusStacked, reflow && responsive.metaStatusReflow]}>
            <Text style={{ color: colors.mutedForeground, textAlign: reflow ? 'left' : 'right' }}>{mastery.length ? `${mastery.length} started` : 'Not started'}</Text>
          </View>
          </AdaptiveRow>
      </AdaptiveButton>)}
      {selectedSystem && visibleModules.length === 0 && <View onLayout={(event) => { firstResult.current = { id: firstResultId, layout: event.nativeEvent.layout }; scheduleReveal(); }}><EmptyState icon="book-open" title="No learning modules yet" message="No published learning content is available for this system yet." /></View>}
    <View style={[styles.offline, { backgroundColor: colors.secondary }]}><View style={[styles.signal, { backgroundColor: colors.primary }]} /><Text style={[styles.offlineText, { color: colors.foreground }]}>Offline-ready · local content and progress</Text></View>
  </Screen>;
}
const styles = StyleSheet.create({
   systemsPanel: { borderWidth: 1, borderRadius: 18, overflow: 'hidden' },
  systemsContent: { padding: 8 },
   brand: { flexDirection: 'row', alignItems: 'center', gap: 12 }, brandWebInset: { marginTop: 48 }, logo: { width: 48, height: 48, borderRadius: 14 }, brandTitle: { flex: 1, minWidth: 0, fontSize: 26, fontWeight: '700' }, settingsAction: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, lede: { fontSize: 15, lineHeight: 22, maxWidth: 560 }, search:{borderWidth:1,borderRadius:12,padding:13,fontSize:15,minHeight:44}, sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 5 }, sectionTitle: { fontSize: 19, fontWeight: '700' }, count: { fontSize: 12 }, systems:{gap:8}, system:{borderWidth:1,borderRadius:12,padding:12,flexDirection:'row',justifyContent:'space-between',gap:10}, card: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 16 }, cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 }, moduleMark: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, moduleMarkText: { fontSize: 13, fontWeight: '800' }, cardCopy: { flex: 1, gap: 3 }, cardTitle: { fontSize: 17, fontWeight: '700' }, cardSub: { fontSize: 12 }, arrow: { fontSize: 30, fontWeight: '300' }, progressTrack: { height: 6, borderRadius: 6, overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 6 }, meta: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 12 }, offline: { alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 99, flexDirection: 'row', alignItems: 'center', gap: 8 }, signal: { width: 7, height: 7, borderRadius: 7 }, offlineText: { fontSize: 12, fontWeight: '600' },
});
const searchStyles = StyleSheet.create({
  container: { gap: 8 },
  panel: { borderWidth: 1, borderRadius: 16, overflow: 'hidden', paddingTop: 12 },
  heading: { fontSize: 12, fontWeight: '700', paddingHorizontal: 14, paddingBottom: 12 },
  scroll: { maxHeight: 300 },
  scrollNatural: { maxHeight: undefined, flexGrow: 0, flexShrink: 0 },
  content: { paddingBottom: 4 },
  row: { borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 8, gap: 4 },
  target: { minHeight: 44, justifyContent: 'center', gap: 3 },
  title: { fontSize: 16, fontWeight: '700' },
  context: { fontSize: 12 },
   bookmark: { alignSelf: 'flex-end', minHeight: 40, justifyContent: 'center', paddingHorizontal: 8 },
   bookmarkLarge: { minHeight: 44 },
});
const responsive = StyleSheet.create({
  brandReflow: { flexDirection: 'column', alignItems: 'stretch', position: 'relative' },
  brandTitleReflow: { flex: 0, alignSelf: 'stretch' },
  settingsActionReflow: { position: 'absolute', top: 2, right: 0 },
   systemLarge: { flexDirection: 'column', alignItems: 'stretch', minHeight: 44 },
  systemNameLarge: { flex: 0, alignSelf: 'stretch' },
  systemStatusLarge: { flexShrink: 1, alignSelf: 'stretch', textAlign: 'left' },
  sectionHeader: { alignItems: 'flex-end', gap: 12 },
  sectionHeaderStacked: { flexDirection: 'column', alignItems: 'flex-start', gap: 3 },
  sectionTitle: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
  sectionCount: { flexShrink: 0, textAlign: 'right' },
  systemName: { flex: 1, minWidth: 0 },
  trailingStatus: { flexShrink: 0, textAlign: 'right' },
  flexibleCopy: { minWidth: 0 },
  meta: { alignItems: 'flex-start', gap: 8 },
  metaStacked: { flexDirection: 'column', alignItems: 'stretch' },
  metaDetails: { flexShrink: 1, minWidth: 0 },
  metaStatus: { flexShrink: 0, maxWidth: '100%' },
  metaStatusStacked: { alignSelf: 'flex-end' },
  metaStatusReflow: { alignSelf: 'stretch' },
  cardTopStacked: { flexDirection: 'column', alignItems: 'stretch' },
  cardCopyStacked: { flex: 0, alignSelf: 'stretch' },
});
