import React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heading, Text, TextInput, useTypographyLayout } from '@/components/ScaledText';
import { content } from '@/content/canonical';
import { createGlossaryIndex, filterGlossary, type GlossaryEntry } from '@/content/glossary';
import { normalizeSearchText } from '@/content/search';
import { useColors } from '@/hooks/useColors';
import { useLocale } from '@/locales/useLocale';

const glossary = createGlossaryIndex(content);
const systems = [...new Map(glossary.map(({ module }) => [module.id, module])).values()]
  .sort((a, b) => a.title.localeCompare(b.title));

export default function GlossaryScreen() {
  const colors = useColors();
  const { language, t, module: localizeModule, structure: localizeStructure, definition, number } = useLocale();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { shouldReflow } = useTypographyLayout();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = React.useState(typeof q === 'string' ? q : '');
  const [system, setSystem] = React.useState<string | undefined>();
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const listRef = React.useRef<FlatList<GlossaryEntry>>(null);
  const displayEntries = React.useMemo(() => glossary.map((entry) => ({
    ...entry,
    structure: localizeStructure(entry.structure),
    module: localizeModule(entry.module),
    definition: definition(entry.structure.id, entry.definition),
  })), [language, localizeModule, localizeStructure, definition]);
  const entries = React.useMemo(() => {
    const englishMatches = filterGlossary(glossary, query, system);
    const normalizedQuery = normalizeSearchText(query);
    const localizedMatches = normalizedQuery
      ? displayEntries.filter((entry) => (!system || entry.module.id === system) && [
        entry.structure.canonicalName,
        ...entry.structure.acceptedAliases,
        entry.structure.category,
        entry.module.title,
      ].some((term) => normalizeSearchText(term).includes(normalizedQuery)))
      : [];
    const byId = new Map<string, (typeof displayEntries)[number]>();
    for (const entry of englishMatches) byId.set(entry.structure.id, displayEntries.find((item) => item.structure.id === entry.structure.id)!);
    for (const entry of localizedMatches) byId.set(entry.structure.id, entry);
    if (!normalizedQuery) {
      return displayEntries.filter((entry) => !system || entry.module.id === system)
        .sort((a, b) => a.structure.canonicalName.localeCompare(b.structure.canonicalName) || a.module.title.localeCompare(b.module.title));
    }
    return [...byId.values()];
  }, [displayEntries, language, query, system]);
  const searching = !!query.trim();
  const filters = [{ id: undefined, title: t('glossary.allSystems') }, ...systems.map((item) => localizeModule(item))].map((item) => {
    const selected = system === item.id;
    return <Pressable key={item.id ?? 'all'} accessibilityRole="button" accessibilityState={{ selected }}
      onPress={() => { setSystem(item.id); setFiltersOpen(false); listRef.current?.scrollToOffset({ offset: 0, animated: false }); }}
      style={[styles.filter, { backgroundColor: selected ? colors.secondary : colors.card, borderColor: selected ? colors.primary : colors.border }]}>
       <Text style={{ color: colors.foreground }}>{item.title}</Text>
    </Pressable>;
  });

  return <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
    <Stack.Screen options={{ title: t('glossary.navigationTitle') }} />
    <View style={[styles.container, { paddingHorizontal: shouldReflow ? 16 : 20 }]}>
      <FlatList
        ref={listRef}
        keyExtractor={(entry) => entry.structure.id}
        data={entries}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}
        ListHeaderComponent={<View style={styles.header}>
          <Heading style={[styles.title, { color: colors.foreground }]}>{t(shouldReflow ? 'glossary.reflowTitle' : 'glossary.title')}</Heading>
          <Text style={{ color: colors.mutedForeground }}>{t('glossary.introduction')}</Text>
          <TextInput
            accessibilityLabel={t('glossary.filterAccessibility')}
            value={query}
            onChangeText={(value) => { setQuery(value); listRef.current?.scrollToOffset({ offset: 0, animated: false }); }}
            placeholder={t(shouldReflow ? 'glossary.filterCompactPlaceholder' : 'glossary.filterPlaceholder')}
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="search"
            style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
          />
          {shouldReflow
            ? <View style={styles.verticalFilters}>
              <Pressable accessibilityRole="button" accessibilityLabel={t('glossary.chooseSystemAccessibility')}
                accessibilityState={{ expanded: filtersOpen }} onPress={() => setFiltersOpen((open) => !open)}
                style={[styles.filter, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Text style={{ color: colors.foreground }}>{systems.find((item) => item.id === system) ? localizeModule(systems.find((item) => item.id === system)!).title : t('glossary.allSystems')} {filtersOpen ? '▲' : '▼'}</Text>
              </Pressable>
              {filtersOpen && <View style={styles.filterMenu}>{filters}</View>}
            </View>
            : <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="always"
              accessibilityLabel={t('glossary.filterBySystemAccessibility')} style={styles.filters} contentContainerStyle={styles.filterContent}>
              {filters}
            </ScrollView>}
          <Text style={{ color: colors.mutedForeground }}>{t(`glossary.entryCount.${entries.length === 1 ? 'one' : 'other'}`, { count: number(entries.length) })}{system ? ` · ${localizeModule(systems.find((item) => item.id === system)!).title}` : ''}</Text>
        </View>}
        ListEmptyComponent={<Text style={{ color: colors.mutedForeground, paddingVertical: 16 }}>{t('glossary.noFilterMatches')}</Text>}
        renderItem={({ item, index }) => {
          const letter = item.structure.canonicalName.charAt(0).toUpperCase();
          const previous = entries[index - 1]?.structure.canonicalName.charAt(0).toUpperCase();
          return <View>
            {!searching && letter !== previous && <Heading style={[styles.letter, { color: colors.primary }]}>{letter}</Heading>}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('glossary.entryAccessibility', { name: item.structure.canonicalName, definition: item.definition })}
              onPress={() => router.push({ pathname: '/glossary/[id]', params: { id: item.structure.id, q: query } })}
              style={[styles.entry, { borderColor: colors.border, backgroundColor: colors.card }]}
            >
              <Text style={[styles.entryTitle, { color: colors.foreground }]}>{item.structure.canonicalName}</Text>
              <Text style={{ color: colors.foreground }}>{item.definition}</Text>
              <Text style={[styles.context, { color: colors.mutedForeground }]}>{item.module.title} · {item.structure.category}</Text>
            </Pressable>
          </View>;
        }}
      />
    </View>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' },
  header: { gap: 10, paddingTop: 18, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '700' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, minHeight: 44, flexShrink: 0 },
  filters: { flexGrow: 0, flexShrink: 0, minHeight: 44 },
  filterContent: { gap: 8, paddingVertical: 2 },
  verticalFilters: { alignItems: 'stretch', gap: 8 },
  filterMenu: { gap: 8 },
  filter: { borderWidth: 1, borderRadius: 12, minHeight: 44, paddingHorizontal: 12, paddingVertical: 8, justifyContent: 'center' },
  letter: { fontSize: 18, fontWeight: '700', marginTop: 14, marginBottom: 8 },
  entry: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 5, minHeight: 44, marginBottom: 8 },
  entryTitle: { fontSize: 17, fontWeight: '700' },
  context: { fontSize: 12 },
});