import React from 'react';
import { Linking, Pressable, View } from 'react-native';
import { Text } from './ScaledText';
import type { Asset } from '@/content/model';
import { content } from '@/content/canonical';
import { readableAttribution, visualKind } from '@/content/visual-disclosure';
import { useLocale } from '@/locales/useLocale';
import { useColors } from '@/hooks/useColors';

/** One disclosure treatment for gallery, lesson, glossary and graded question images. */
export function VisualStudyContext({ asset, learn }: { asset: Asset; learn: boolean }) {
  const { language, source: localizeSource, t } = useLocale();
  const colors = useColors(), es = language === 'es', kind = visualKind(asset);
  const record = content.sources.find((s) => s.id === asset.sourceId);
  const source = record && localizeSource(record);
  const sourceUrl = asset.sourceUrl ?? record?.sourceUrl;
  const rightsUrl = asset.rightsUrl ?? record?.licenseUrl;
  const label = kind === 'histology'
    ? es ? 'Fotomicrografía real — no un esquema.' : 'Genuine photomicrograph — not a schematic.'
    : kind === 'specimen'
      ? es ? 'Fotografía de una muestra anatómica real.' : 'Genuine anatomical specimen photograph.'
      : kind === 'model'
        ? es ? 'Imagen de un modelo didáctico — no una muestra humana.' : 'Teaching-model image — not a human specimen.'
        : es ? 'Diagrama de estudio 2D — no una muestra ni fotomicrografía.' : '2D study diagram — not a specimen or photomicrograph.';
  return <View style={{ gap: 7, paddingHorizontal: 6 }}>
    <Text style={{ color: colors.mutedForeground }}>{label}</Text>
    {learn && asset.description && <Text style={{ color: colors.foreground }}>{asset.description}</Text>}
    {learn && asset.specimenNote && <Text style={{ color: colors.mutedForeground }}>{asset.specimenNote}</Text>}
    <Text style={{ color: colors.mutedForeground }}>{source?.title ? `${source.title} · ` : ''}{readableAttribution(asset.attributionLicense)}</Text>
    {(sourceUrl || rightsUrl) && <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
      {sourceUrl && <Pressable accessibilityRole="link" onPress={() => Linking.openURL(sourceUrl)} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: colors.primary }}>{t('module.sourceLink')}</Text></Pressable>}
      {rightsUrl && <Pressable accessibilityRole="link" onPress={() => Linking.openURL(rightsUrl)} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: colors.primary }}>{t('module.rightsLink')}</Text></Pressable>}
    </View>}
  </View>;
}
