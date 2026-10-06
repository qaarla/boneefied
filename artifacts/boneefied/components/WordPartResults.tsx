import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Heading, Text } from '@/components/ScaledText';
import { useColors } from '@/hooks/useColors';
import { useLocale } from '@/locales/useLocale';
import { wordPartCopy, type WordPart } from '@/content/word-parts';

export function WordPartResults({ parts, query, heading = true }: { parts: readonly WordPart[]; query: string; heading?: boolean }) {
  const colors = useColors();
  const { language } = useLocale();
  const router = useRouter();
  if (!parts.length) return null;
  return <View style={styles.group}>
    {heading && <Heading style={[styles.heading, { color: colors.primary }]}>{language === 'es' ? 'Partes de las palabras' : 'Word parts'}</Heading>}
    {parts.map((part) => {
      const copy = wordPartCopy(part, language);
      return <Pressable key={part.id} accessibilityRole="button"
        accessibilityLabel={`${part.form}. ${copy.kind}. ${copy.meaning}`}
        testID={`word-part-${part.id}`}
        onPress={() => router.push({ pathname: '/glossary/word-part/[id]', params: { id: part.id, q: query } })}
        style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Text style={[styles.form, { color: colors.foreground }]}>{part.form}</Text>
        <Text style={{ color: colors.mutedForeground }}>{copy.kind}</Text>
        <Text style={{ color: colors.foreground }}>{copy.meaning}</Text>
        <Text style={{ color: colors.mutedForeground }}>{copy.example}</Text>
      </Pressable>;
    })}
  </View>;
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  heading: { fontSize: 18, fontWeight: '700' },
  card: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 6, minHeight: 44 },
  form: { fontSize: 20, fontWeight: '700' },
});
