import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { AdaptiveButton, AdaptiveCard } from '@/components/AdaptiveLayout';
import { Heading, Text } from '@/components/ScaledText';
import { Screen } from '@/components/Screen';
import { content } from '@/content/canonical';
import { createGlossaryIndex } from '@/content/glossary';
import { useColors } from '@/hooks/useColors';

const entries = new Map(createGlossaryIndex(content).map((entry) => [entry.structure.id, entry]));

export default function GlossaryEntryScreen() {
  const { id, q } = useLocalSearchParams<{ id: string; q?: string }>();
  const router = useRouter();
  const colors = useColors();
  const entry = entries.get(id);

  return <Screen>
    <Stack.Screen options={{ title: 'Glossary' }} />
    {!entry ? <>
      <Heading style={[styles.title, { color: colors.foreground }]}>Definition not available</Heading>
      <Text style={{ color: colors.mutedForeground }}>This term has no published source-checked definition.</Text>
      <AdaptiveButton accessibilityRole="button" onPress={() => router.replace('/glossary')}
        style={[styles.action, { backgroundColor: colors.secondary }]}>
        <Text style={{ color: colors.foreground }}>Browse glossary</Text>
      </AdaptiveButton>
    </> : <>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>ANATOMY GLOSSARY</Text>
      <Heading style={[styles.title, { color: colors.foreground }]}>{entry.structure.canonicalName}</Heading>
      <AdaptiveCard style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.definition, { color: colors.foreground }]}>{entry.definition}</Text>
        <Text style={{ color: colors.mutedForeground }}>{entry.module.title} · {entry.structure.category}</Text>
      </AdaptiveCard>
      {entry.structure.acceptedAliases.length > 0 && <View style={styles.aliases}>
        <Heading style={[styles.subheading, { color: colors.foreground }]}>Accepted search terms</Heading>
        <Text style={{ color: colors.mutedForeground }}>{entry.structure.acceptedAliases.join(' · ')}</Text>
      </View>}
      <Text style={{ color: colors.mutedForeground }}>Source: {content.sources.find((source) => source.id === entry.structure.sourceId)?.title ?? entry.structure.sourceId}</Text>
      <AdaptiveButton accessibilityRole="button"
        onPress={() => router.push(`/module/${entry.module.id}`)}
        style={[styles.action, { backgroundColor: colors.primary }]}>
        <Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>Open {entry.module.title} lesson</Text>
      </AdaptiveButton>
      {typeof q === 'string' && q.length > 0 && <Pressable accessibilityRole="button"
        onPress={() => router.canGoBack() ? router.back() : router.replace({ pathname: '/glossary', params: { q } })}
        style={styles.back}><Text style={{ color: colors.primary }}>Back to results for “{q}”</Text></Pressable>}
    </>}
  </Screen>;
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  title: { fontSize: 28, fontWeight: '700' },
  card: { borderWidth: 1, borderRadius: 16, padding: 18, gap: 14 },
  definition: { fontSize: 18, lineHeight: 27 },
  aliases: { gap: 6 },
  subheading: { fontSize: 17, fontWeight: '700' },
  action: { minHeight: 44, padding: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  back: { minHeight: 44, justifyContent: 'center' },
});