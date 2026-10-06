import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heading, Text, TextInput } from '@/components/ScaledText';
import { WordPartResults } from '@/components/WordPartResults';
import { wordParts, searchWordParts, type WordPartKind } from '@/content/word-parts';
import { useColors } from '@/hooks/useColors';
import { useLocale } from '@/locales/useLocale';

export default function WordPartsScreen() {
  const colors = useColors();
  const { language } = useLocale();
  const es = language === 'es';
  const insets = useSafeAreaInsets();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = React.useState(typeof q === 'string' ? q : '');
  const [kind, setKind] = React.useState<WordPartKind | undefined>();
  const available = query.trim() ? searchWordParts(query, language, wordParts.length)
    : [...wordParts].sort((a, b) => a.form.replace(/^-/, '').localeCompare(b.form.replace(/^-/, '')));
  const entries = available.filter((part) => !kind || part.kind === kind);
  const filters: Array<{ kind?: WordPartKind; label: string }> = [
    { label: es ? 'Todas' : 'All' },
    { kind: 'prefix', label: es ? 'Prefijos' : 'Prefixes' },
    { kind: 'root', label: es ? 'Raíces' : 'Roots' },
    { kind: 'suffix', label: es ? 'Sufijos' : 'Suffixes' },
  ];
  return <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
    <Stack.Screen options={{ title: es ? 'Partes de palabras' : 'Word parts' }} />
    <FlatList data={entries} keyExtractor={(part) => part.id} keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 48 }]}
      ListHeaderComponent={<View style={styles.header}>
        <Heading style={[styles.title, { color: colors.foreground }]}>{es ? 'Prefijos, raíces y sufijos' : 'Prefixes, roots & suffixes'}</Heading>
        <Text style={{ color: colors.mutedForeground }}>{es
          ? 'Busca una parte o su significado. peri- = alrededor; cardi/o = corazón; -itis = inflamación. /o indica la vocal de enlace.'
          : 'Search a word part or its meaning. peri- = around; cardi/o = heart; -itis = inflammation. /o marks a combining vowel.'}</Text>
        <TextInput value={query} onChangeText={setQuery} autoCapitalize="none" autoCorrect={false}
          accessibilityLabel={es ? 'Buscar partes de palabras' : 'Search word parts'}
          placeholder={es ? 'peri-, cardi/o, -itis…' : 'peri-, cardi/o, -itis…'}
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card }]} />
        <View style={styles.filters}>{filters.map((filter) => <Pressable key={filter.kind ?? 'all'}
          accessibilityRole="button" accessibilityState={{ selected: kind === filter.kind }} onPress={() => setKind(filter.kind)}
          style={[styles.filter, { borderColor: colors.border, backgroundColor: kind === filter.kind ? colors.secondary : colors.card }]}>
          <Text style={{ color: colors.foreground }}>{filter.label}</Text>
        </Pressable>)}</View>
        <Text style={{ color: colors.mutedForeground }}>{entries.length} {es ? 'partes de palabras' : 'word parts'}</Text>
      </View>}
      ListEmptyComponent={<Text style={{ color: colors.mutedForeground }}>{es ? 'No hay coincidencias. Prueba otra forma o consulta todas las partes.' : 'No matches. Try another form or browse all word parts.'}</Text>}
      renderItem={({ item }) => <View style={styles.item}><WordPartResults parts={[item]} query={query} heading={false} /></View>}
    />
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, content: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 20 },
  header: { gap: 12, paddingTop: 18, paddingBottom: 16 }, title: { fontSize: 26, fontWeight: '700' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 44, fontSize: 16 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filter: { borderWidth: 1, borderRadius: 12, minHeight: 44, padding: 12, justifyContent: 'center' },
  item: { marginBottom: 10 },
});
