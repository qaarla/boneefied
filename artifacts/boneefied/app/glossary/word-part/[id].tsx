import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { AdaptiveButton, AdaptiveCard } from '@/components/AdaptiveLayout';
import { Screen } from '@/components/Screen';
import { Heading, Text } from '@/components/ScaledText';
import { useColors } from '@/hooks/useColors';
import { useLocale } from '@/locales/useLocale';
import { wordParts, wordPartCopy, wordPartReference } from '@/content/word-parts';

export default function WordPartScreen() {
  const { id, q } = useLocalSearchParams<{ id: string; q?: string }>();
  const colors = useColors();
  const { language } = useLocale();
  const es = language === 'es';
  const router = useRouter();
  const part = wordParts.find((item) => item.id === id);
  const copy = part ? wordPartCopy(part, language) : undefined;
  return <Screen>
    <Stack.Screen options={{ title: es ? 'Parte de palabra' : 'Word part' }} />
    {!part || !copy ? <Heading style={{ color: colors.foreground }}>{es ? 'Parte no encontrada' : 'Word part not found'}</Heading> : <>
      <Text style={{ color: colors.primary }}>{copy.kind}</Text>
      <Heading style={[styles.title, { color: colors.foreground }]}>{part.form}</Heading>
      <AdaptiveCard style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <Text style={[styles.meaning, { color: colors.foreground }]}>{copy.meaning}</Text>
        <Heading style={[styles.subheading, { color: colors.foreground }]}>{es ? 'Ejemplo' : 'Example'}</Heading>
        <Text style={{ color: colors.foreground }}>{copy.example}</Text>
      </AdaptiveCard>
      {part.aliases.length > 0 && <View style={styles.aliases}>
        <Heading style={[styles.subheading, { color: colors.foreground }]}>{es ? 'Otras formas' : 'Other forms'}</Heading>
        <Text style={{ color: colors.mutedForeground }}>{part.aliases.join(' · ')}</Text>
      </View>}
      <Text style={{ color: colors.mutedForeground }}>{es
        ? 'El significado depende de la palabra completa. /o separa una raíz de su vocal de enlace. Un guion final indica un prefijo; un guion inicial indica un sufijo.'
        : 'Meaning depends on the complete word. /o separates a root from its combining vowel. A trailing hyphen marks a prefix; a leading hyphen marks a suffix.'}</Text>
      <AdaptiveButton accessibilityRole="link" onPress={() => Linking.openURL(wordPartReference)}
        style={[styles.action, { backgroundColor: colors.secondary }]}>
        <Text style={{ color: colors.foreground }}>{es ? 'Referencia de terminología: MedlinePlus' : 'Terminology reference: MedlinePlus'}</Text>
      </AdaptiveButton>
    </>}
    <AdaptiveButton onPress={() => router.canGoBack() ? router.back() : router.replace({ pathname: '/glossary/word-parts', params: { q: typeof q === 'string' ? q : '' } })}
      style={[styles.action, { backgroundColor: colors.primary }]}>
      <Text style={{ color: colors.primaryForeground }}>{es ? 'Volver a las partes de palabras' : 'Back to word parts'}</Text>
    </AdaptiveButton>
  </Screen>;
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700' }, card: { borderWidth: 1, borderRadius: 16, padding: 18, gap: 14 },
  meaning: { fontSize: 18, lineHeight: 27 }, subheading: { fontSize: 17, fontWeight: '700' },
  aliases: { gap: 6 }, action: { minHeight: 44, padding: 14, borderRadius: 12, justifyContent: 'center' },
});
