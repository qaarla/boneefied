import React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heading, Text, TextInput, useTypographyLayout } from '@/components/ScaledText';
import { content } from '@/content/canonical';
import { createGlossaryIndex, filterGlossary, type GlossaryEntry } from '@/content/glossary';
import { useColors } from '@/hooks/useColors';

const glossary = createGlossaryIndex(content);
const systems = [...new Map(glossary.map(({ module }) => [module.id, module])).values()]
  .sort((a, b) => a.title.localeCompare(b.title));

export default function GlossaryScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { shouldReflow } = useTypographyLayout();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = React.useState(typeof q === 'string' ? q : '');
  const [system, setSystem] = React.useState<string | undefined>();
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const listRef = React.useRef<FlatList<GlossaryEntry>>(null);
  const entries = React.useMemo(() => filterGlossary(glossary, query, system), [query, system]);
  const searching = !!query.trim();
  const filters = [{ id: undefined, title: 'All systems' }, ...systems].map((item) => {
    const selected = system === item.id;
    return <Pressable key={item.id ?? 'all'} accessibilityRole="button" accessibilityState={{ selected }}
      onPress={() => { setSystem(item.id); setFiltersOpen(false); listRef.current?.scrollToOffset({ offset: 0, animated: false }); }}
      style={[styles.filter, { backgroundColor: selected ? colors.secondary : colors.card, borderColor: selected ? colors.primary : colors.border }]}>
      <Text style={{ color: colors.foreground }}>{item.title}</Text>
    </Pressable>;
  });

  return <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
    <Stack.Screen options={{ title: 'Glossary' }} />
    <View style={[styles.container, { paddingHorizontal: shouldReflow ? 16 : 20 }]}>
      <FlatList
        ref={listRef}
        keyExtractor={(entry) => entry.structure.id}
        data={entries}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}
        ListHeaderComponent={<View style={styles.header}>
          <Heading style={[styles.title, { color: colors.foreground }]}>{shouldReflow ? 'Browse terms' : 'Anatomy glossary'}</Heading>
          <Text style={{ color: colors.mutedForeground }}>Quick, source-checked definitions from your study catalog.</Text>
          <TextInput
            accessibilityLabel="Filter glossary terms"
            value={query}
            onChangeText={(value) => { setQuery(value); listRef.current?.scrollToOffset({ offset: 0, animated: false }); }}
            placeholder={shouldReflow ? 'Filter terms' : 'Filter by term or alias'}
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="search"
            style={[styles.input, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
          />
          {shouldReflow
            ? <View style={styles.verticalFilters}>
              <Pressable accessibilityRole="button" accessibilityLabel="Choose anatomy system"
                accessibilityState={{ expanded: filtersOpen }} onPress={() => setFiltersOpen((open) => !open)}
                style={[styles.filter, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Text style={{ color: colors.foreground }}>{systems.find((item) => item.id === system)?.title ?? 'All systems'} {filtersOpen ? '▲' : '▼'}</Text>
              </Pressable>
              {filtersOpen && <View style={styles.filterMenu}>{filters}</View>}
            </View>
            : <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="always"
              accessibilityLabel="Filter glossary by system" style={styles.filters} contentContainerStyle={styles.filterContent}>
              {filters}
            </ScrollView>}
          <Text style={{ color: colors.mutedForeground }}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}{system ? ` · ${systems.find((item) => item.id === system)?.title}` : ''}</Text>
        </View>}
        ListEmptyComponent={<Text style={{ color: colors.mutedForeground, paddingVertical: 16 }}>No source-checked definition matches this filter.</Text>}
        renderItem={({ item, index }) => {
          const letter = item.structure.canonicalName.charAt(0).toUpperCase();
          const previous = entries[index - 1]?.structure.canonicalName.charAt(0).toUpperCase();
          return <View>
            {!searching && letter !== previous && <Heading style={[styles.letter, { color: colors.primary }]}>{letter}</Heading>}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${item.structure.canonicalName}. ${item.definition}. Open glossary entry`}
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