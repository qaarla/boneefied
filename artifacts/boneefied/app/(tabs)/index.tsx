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
import { definitionForStructure } from '@/content/glossary';
import { wordMeaning } from '@/content/anatomical-terms';
import { searchWordParts } from '@/content/word-parts';
import { WordPartResults } from '@/components/WordPartResults';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';
import { useLocale } from '@/locales/useLocale';

const anatomySearchIndex = createAnatomySearchIndex(content);

export default function StudyScreen() {
  const colors = useColors();
  const { language, t, module: localizeModule, structure: localizeStructure, definition: localizeDefinition, number } = useLocale();
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
    ['study.system.cellsAndTissues', 'cell'], ['study.system.integumentary', 'skin'], ['study.system.skeletal', 'skeletal-system'], ['study.system.jointsAndLigaments', 'joints'],
    ['study.system.muscular', 'muscular'], ['study.system.nervousAndBrain', 'nervous'], ['study.system.cranialAndPeripheralNerves', 'nerves'], ['study.system.specialSenses', 'senses'],
    ['study.system.endocrine', 'endocrine'], ['study.system.bloodAndCardiovascular', 'cardiovascular'], ['study.system.bloodVessels', 'vessels'], ['study.system.lymphatic', 'lymphatic'],
    ['study.system.respiratory', 'respiratory'], ['study.system.digestive', 'digestive'], ['study.system.urinary', 'urinary'], ['study.system.maleReproductive', 'male-reproductive'], ['study.system.femaleReproductive', 'female-reproductive'],
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
  const matching = React.useMemo(() => searchAnatomy(anatomySearchIndex, query, 8, language), [query, language]);
  const wordMatches = React.useMemo(() => searchWordParts(query, language, 6), [query, language]);
   const systemChoices = systems.map(([key, id]) => <AdaptiveButton key={id} accessibilityRole="button" hitSlop={4} onPress={() => selectSystem(id)} style={[styles.system, reflow && responsive.systemLarge, { borderColor: selectedSystem === id ? colors.primary : colors.border, backgroundColor: selectedSystem === id ? colors.secondary : colors.card }]}><View style={[responsive.systemName, reflow && responsive.systemNameLarge]}><Text style={{ color: colors.foreground, fontWeight: '600' }}>{t(key)}</Text></View><Text style={[responsive.trailingStatus, reflow && responsive.systemStatusLarge, { color: colors.mutedForeground }]}>{t(content.modules.some((item) => matchesSystem(item, id)) ? 'study.system.openStatus' : 'study.system.comingNextStatus')}</Text></AdaptiveButton>);
  const searchResults = matching.map((match) => {
    const localizedStructure = localizeStructure(match.structure);
    const localizedModule = localizeModule(match.module);
    const meaning = match.term ? wordMeaning(match.term, language) : undefined;
    const name = meaning?.name ?? localizedStructure.canonicalName;
    const context = `${localizedModule.title} · ${localizedStructure.category}`;
    const englishDefinition = definitionForStructure(match.structure.id);
    const definition = meaning?.definition ?? (englishDefinition ? localizeDefinition(match.structure.id, englishDefinition) : undefined);
    return <View key={match.structure.id} style={[searchStyles.row, { borderTopColor: colors.border }]}>
      <Pressable
        testID={`search-result-${match.structure.id}`}
        accessibilityRole="button"
        accessibilityLabel={t(definition ? 'study.searchResultGlossaryAccessibility' : 'study.searchResultModuleAccessibility', {
          name, definition: definition ?? t('study.definitionReviewPending'), context,
        })}
        onPress={() => {
          if (preferences.haptics) void Haptics.selectionAsync();
          if (definition) router.push({ pathname: '/glossary/[id]', params: { id: match.structure.id, q: query } });
          else router.push(`/module/${match.module.id}`);
        }}
        style={searchStyles.target}
      >
        <Text style={[searchStyles.title, { color: colors.foreground }]}>{name}</Text>
        {match.matchedTerm !== name && <Text style={[searchStyles.context, { color: colors.mutedForeground }]}>{t('study.matchedTerm', { matchedTerm: match.matchedTerm })}</Text>}
        {definition
          ? <Text style={[searchStyles.definition, { color: colors.foreground }]}>{definition}</Text>
          : <Text style={[searchStyles.context, { color: colors.mutedForeground }]}>{t('study.definitionReviewPending')}</Text>}
        <Text style={[searchStyles.context, { color: colors.mutedForeground }]}>{context}</Text>
      </Pressable>
      <View style={searchStyles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('study.openModuleAccessibility', { name })}
          onPress={() => router.push(`/module/${match.module.id}`)} style={searchStyles.secondaryAction}>
          <Text style={{ color: colors.primary }}>{t('study.openLesson')}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={t(bookmarks.includes(match.structure.id) ? 'bookmark.removeAccessibility' : 'bookmark.addAccessibility', { name })} accessibilityState={{ selected: bookmarks.includes(match.structure.id) }} hitSlop={2} onPress={() => toggleBookmark(match.structure.id)} style={searchStyles.bookmark}>
          <Text style={{ color: colors.primary }}>{t(bookmarks.includes(match.structure.id) ? 'bookmark.saved' : 'bookmark.save')}</Text>
        </Pressable>
      </View>
    </View>;
  });
  return <Screen scrollRef={pageRef} keyboardShouldPersistTaps="handled" onScroll={(event) => { pageY.current = event.nativeEvent.contentOffset.y; }} onViewportLayout={(height, bottomClearance) => { viewport.current = { height, bottomClearance }; scheduleReveal(); }}>
    <View style={[styles.brand, Platform.OS === 'web' && styles.brandWebInset, reflow && responsive.brandReflow]}>
      <Image source={require('@/assets/images/logo-rounded.png')} style={styles.logo} accessibilityLabel={t('study.logoAccessibility')} />
      <Heading accessibilityLabel="Boneefied" style={[styles.brandTitle, reflow && responsive.brandTitleReflow, { color: colors.foreground }]}>Bonee{'\u00AD'}fied</Heading>
      <Pressable
        testID="study-settings-button"
        accessibilityLabel={t('study.settingsAccessibility')}
        accessibilityHint={t('study.settingsHint')}
        accessibilityRole="button"
        hitSlop={4}
        onPress={() => router.push('/settings')}
        style={({ pressed }) => [styles.settingsAction, reflow && responsive.settingsActionReflow, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Feather name="settings" size={21} color={colors.mutedForeground} />
      </Pressable>
    </View>
    <Text style={[styles.lede, { color: colors.mutedForeground }]}>{t('study.tagline')}</Text>
    <View style={searchStyles.container}>
        {reflow && <Text style={{ color: colors.mutedForeground }}>{t('study.searchAnatomy')}</Text>}
        <TextInput accessibilityLabel={t('study.searchAnatomy')} value={query} onChangeText={setQuery} placeholder={reflow ? t('study.searchCompactPlaceholder') : t('study.searchAnatomy')} placeholderTextColor={colors.mutedForeground} returnKeyType="search" style={[styles.search, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]} />
       <Pressable accessibilityRole="button" accessibilityLabel={t('study.browseGlossaryAccessibility')} onPress={() => router.push({ pathname: '/glossary', params: { q: query } })} style={searchStyles.glossaryLink}>
         <Text style={{ color: colors.primary, fontWeight: '600' }}>{t('study.browseGlossary')}</Text>
      </Pressable>
       {query.trim().length > 0 && <View testID="anatomy-search-results" accessibilityLabel={t('study.searchResultsAccessibility')} style={[searchStyles.panel, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {wordMatches.length > 0 && <View style={{ paddingHorizontal: 14, paddingBottom: 12 }}><WordPartResults parts={wordMatches} query={query} /></View>}
          {(matching.length > 0 || wordMatches.length === 0) && <Text style={[searchStyles.heading, { color: colors.mutedForeground }]}>{t(matching.length ? 'study.suggestedStructures' : 'study.noCloseMatch')}</Text>}
        {matching.length > 0 && (reflow
          ? <View style={[searchStyles.content, searchStyles.scrollNatural]}>{searchResults}</View>
          : <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="always" style={searchStyles.scroll} contentContainerStyle={searchStyles.content} showsVerticalScrollIndicator>{searchResults}</ScrollView>)}
      </View>}
    </View>
      <AdaptiveRow style={[styles.sectionHeader, responsive.sectionHeader, reflow && responsive.sectionHeaderStacked]}><Heading style={[styles.sectionTitle, responsive.sectionTitle, { color: colors.foreground }]}>{t('study.exploreBySystem')}</Heading><Text style={[styles.count, responsive.sectionCount, { color: colors.mutedForeground }]}>{t(Number(systems.length) === 1 ? 'study.systemCount.one' : 'study.systemCount.other', { count: number(systems.length) })}</Text></AdaptiveRow>
      <View style={[styles.systemsPanel, !reflow && { height: Math.min(width - 40, 300) }, { borderColor: colors.border, backgroundColor: colors.card }]}>
        {reflow
          ? <View testID="study-systems-scroll" accessibilityLabel={t('study.systemsAccessibility')} style={[styles.systems, styles.systemsContent]}>{systemChoices}</View>
          : <ScrollView testID="study-systems-scroll" accessibilityLabel={t('study.systemsAccessibility')} tabIndex={Platform.OS === 'web' ? 0 : undefined} nestedScrollEnabled keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.systems, styles.systemsContent]} showsVerticalScrollIndicator>{systemChoices}</ScrollView>}
      </View>
      <AdaptiveRow onLayout={(event) => { learningHeading.current = event.nativeEvent.layout; scheduleReveal(); }} style={[styles.sectionHeader, responsive.sectionHeader, reflow && responsive.sectionHeaderStacked]}><Heading style={[styles.sectionTitle, responsive.sectionTitle, { color: colors.foreground }]}>{t('study.learningModules')}</Heading><Text style={[styles.count, responsive.sectionCount, { color: colors.mutedForeground }]}>{t(visibleModules.length === 1 ? 'study.availableCount.one' : 'study.availableCount.other', { count: number(visibleModules.length) })}</Text></AdaptiveRow>
      {visibleModules.map((module, index) => <AdaptiveButton key={module.id} onLayout={index === 0 ? (event) => { firstResult.current = { id: module.id, layout: event.nativeEvent.layout }; scheduleReveal(); } : undefined} testID={`module-card-${module.id}`} accessibilityRole="button" onPress={() => { if (preferences.haptics) void Haptics.selectionAsync(); router.push(`/module/${module.id}`); }} style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
        <AdaptiveRow style={[styles.cardTop, reflow && responsive.cardTopStacked]}><View style={[styles.moduleMark, { backgroundColor: colors.primary }]}>{reflow ? <Feather name="book-open" size={20} color={colors.primaryForeground} /> : <Text style={[styles.moduleMarkText, { color: colors.primaryForeground }]}>{String(index + 1).padStart(2, '0')}</Text>}</View><View style={[styles.cardCopy, responsive.flexibleCopy, reflow && responsive.cardCopyStacked]}><Text style={[styles.cardTitle, { color: colors.foreground }]}>{localizeModule(module).title}</Text><Text style={[styles.cardSub, { color: colors.mutedForeground }]}>{localizeModule(module).summary ?? t(module.id === 'cytology-mitosis' ? 'study.cytologyModuleFallback' : 'study.moduleFallback')}</Text></View>{!reflow && <Text style={[styles.arrow, responsive.trailingStatus, { color: colors.primary }]}>›</Text>}</AdaptiveRow>
          <AdaptiveRow style={[styles.meta, responsive.meta, (stackModuleMeta || reflow) && responsive.metaStacked]}>
          <View style={responsive.metaDetails}>
             <Text style={{ color: colors.mutedForeground }}>{t(content.structures.filter((item) => item.moduleId === module.id).length === 1 ? 'study.moduleStructureCount.one' : 'study.moduleStructureCount.other', { count: number(content.structures.filter((item) => item.moduleId === module.id).length) })} · {t(content.questions.filter((item) => item.moduleId === module.id).length === 1 ? 'study.moduleQuestionCount.one' : 'study.moduleQuestionCount.other', { count: number(content.questions.filter((item) => item.moduleId === module.id).length) })}</Text>
          </View>
           <View style={[responsive.metaStatus, (stackModuleMeta || reflow) && responsive.metaStatusStacked, reflow && responsive.metaStatusReflow]}>
             <Text style={{ color: colors.mutedForeground, textAlign: reflow ? 'left' : 'right' }}>{mastery.length ? t('study.startedCount', { count: number(mastery.length) }) : t('study.notStarted')}</Text>
          </View>
          </AdaptiveRow>
      </AdaptiveButton>)}
      {selectedSystem && visibleModules.length === 0 && <View onLayout={(event) => { firstResult.current = { id: firstResultId, layout: event.nativeEvent.layout }; scheduleReveal(); }}><EmptyState icon="book-open" title={t('study.noModulesTitle')} message={t('study.noModulesMessage')} /></View>}
    <View style={[styles.offline, { backgroundColor: colors.secondary }]}><View style={[styles.signal, { backgroundColor: colors.primary }]} /><Text style={[styles.offlineText, { color: colors.foreground }]}>{t('study.offlineReady')}</Text></View>
  </Screen>;
}
const styles = StyleSheet.create({
   systemsPanel: { borderWidth: 1, borderRadius: 18, overflow: 'hidden' },
  systemsContent: { padding: 8 },
   brand: { flexDirection: 'row', alignItems: 'center', gap: 12 }, brandWebInset: { marginTop: 48 }, logo: { width: 48, height: 48, borderRadius: 14 }, brandTitle: { flex: 1, minWidth: 0, fontSize: 26, fontWeight: '700' }, settingsAction: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, lede: { fontSize: 15, lineHeight: 22, maxWidth: 560 }, search:{borderWidth:1,borderRadius:12,padding:13,fontSize:15,minHeight:44}, sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 5 }, sectionTitle: { fontSize: 19, fontWeight: '700' }, count: { fontSize: 12 }, systems:{gap:8}, system:{borderWidth:1,borderRadius:12,padding:12,flexDirection:'row',justifyContent:'space-between',gap:10}, card: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 16 }, cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 }, moduleMark: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, moduleMarkText: { fontSize: 13, fontWeight: '800' }, cardCopy: { flex: 1, gap: 3 }, cardTitle: { fontSize: 17, fontWeight: '700' }, cardSub: { fontSize: 12 }, arrow: { fontSize: 30, fontWeight: '300' }, progressTrack: { height: 6, borderRadius: 6, overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 6 }, meta: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 12 }, offline: { alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 99, flexDirection: 'row', alignItems: 'center', gap: 8 }, signal: { width: 7, height: 7, borderRadius: 7 }, offlineText: { fontSize: 12, fontWeight: '600' },
});
const searchStyles = StyleSheet.create({
  container: { gap: 8 },
  glossaryLink: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  panel: { borderWidth: 1, borderRadius: 16, overflow: 'hidden', paddingTop: 12 },
  heading: { fontSize: 12, fontWeight: '700', paddingHorizontal: 14, paddingBottom: 12 },
  scroll: { maxHeight: 300 },
  scrollNatural: { maxHeight: undefined, flexGrow: 0, flexShrink: 0 },
  content: { paddingBottom: 4 },
  row: { borderTopWidth: 1, paddingHorizontal: 14, paddingVertical: 8, gap: 4 },
  target: { minHeight: 44, justifyContent: 'center', gap: 3 },
  title: { fontSize: 16, fontWeight: '700' },
  definition: { fontSize: 14, lineHeight: 20 },
  context: { fontSize: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  secondaryAction: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  bookmark: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
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
