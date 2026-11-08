import React, { useId, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from './ScaledText';
import type { Asset } from '@/content/model';
import { visualKind } from '@/content/visual-disclosure';
import { conciseVisualCredit } from '@/content/module-rights';
import { useLocale } from '@/locales/useLocale';
import { useColors } from '@/hooks/useColors';

/** Shared across modules, lessons, glossary and revealed Practice feedback.
 * Descriptions remain intact, but no longer occupy space until requested.
 */
export function VisualStudyContext({ asset, learn }: { asset: Asset; learn: boolean }) {
  return <View style={styles.context}>
    <ImageDetails key={`${asset.id}:${learn}`} asset={asset} learn={learn} />
    <VisualCredit asset={asset} />
  </View>;
}

function ImageDetails({ asset, learn }: { asset: Asset; learn: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const detailId = useId();
  const { language } = useLocale();
  const colors = useColors(), es = language === 'es', kind = visualKind(asset);
  const title = es ? 'Detalles de la imagen' : 'Image details';
  const label = kind === 'histology'
    ? es ? 'Fotomicrografía real — no un esquema.' : 'Genuine photomicrograph — not a schematic.'
    : kind === 'specimen'
      ? es ? 'Fotografía de una muestra anatómica real.' : 'Genuine anatomical specimen photograph.'
      : kind === 'model'
        ? es ? 'Imagen de un modelo didáctico — no una muestra humana.' : 'Teaching-model image — not a human specimen.'
        : es ? 'Diagrama de estudio 2D — no una muestra ni fotomicrografía.' : '2D study diagram — not a specimen or photomicrograph.';
  return <View testID={`image-details-${asset.id}`}>
    <Pressable testID={`image-details-toggle-${asset.id}`}
      accessibilityRole="button" accessibilityLabel={title}
      accessibilityState={{ expanded }}
      {...(Platform.OS === 'web' ? { 'aria-expanded': expanded, 'aria-controls': detailId } : {})}
      onPress={() => setExpanded((current) => !current)}
      style={styles.toggle}>
      <Text style={[styles.title, { color: colors.mutedForeground }]}>{title}</Text>
      <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={17} color={colors.mutedForeground} accessible={false} />
    </Pressable>
    {expanded && <View nativeID={detailId} testID={`image-details-body-${asset.id}`} style={styles.body}>
      <Text style={{ color: colors.mutedForeground }}>{label}</Text>
      {learn && asset.description && <Text style={{ color: colors.readingForeground }}>{asset.description}</Text>}
      {learn && asset.specimenNote && <Text style={{ color: colors.mutedForeground }}>{asset.specimenNote}</Text>}
    </View>}
  </View>;
}

/** Keep creator/license/modification credit visible alongside the image. */
export function VisualCredit({ asset }: { asset: Asset }) {
  const colors = useColors();
  return <Text testID={`visual-credit-${asset.id}`} style={{ color: colors.mutedForeground, fontSize: 11 }}>{conciseVisualCredit(asset.attributionLicense)}</Text>;
}

const styles = StyleSheet.create({
  context: { gap: 4, paddingHorizontal: 12 },
  toggle: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { fontSize: 13, fontWeight: '700', flexShrink: 1 },
  body: { gap: 8, paddingBottom: 8 },
});
