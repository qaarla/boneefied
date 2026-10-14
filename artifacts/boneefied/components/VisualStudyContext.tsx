import React from 'react';
import { View } from 'react-native';
import { Text } from './ScaledText';
import type { Asset } from '@/content/model';
import { visualKind } from '@/content/visual-disclosure';
import { conciseVisualCredit } from '@/content/module-rights';
import { useLocale } from '@/locales/useLocale';
import { useColors } from '@/hooks/useColors';

/** Study descriptions are unchanged; detailed provenance belongs in the bottom disclosure. */
export function VisualStudyContext({ asset, learn }: { asset: Asset; learn: boolean }) {
  const { language } = useLocale();
  const colors = useColors(), es = language === 'es', kind = visualKind(asset);
  const label = kind === 'histology'
    ? es ? 'Fotomicrografía real — no un esquema.' : 'Genuine photomicrograph — not a schematic.'
    : kind === 'specimen'
      ? es ? 'Fotografía de una muestra anatómica real.' : 'Genuine anatomical specimen photograph.'
      : kind === 'model'
        ? es ? 'Imagen de un modelo didáctico — no una muestra humana.' : 'Teaching-model image — not a human specimen.'
        : es ? 'Diagrama de estudio 2D — no una muestra ni fotomicrografía.' : '2D study diagram — not a specimen or photomicrograph.';
  return <View style={{ gap: 8, paddingHorizontal: 12 }}>
    <Text style={{ color: colors.mutedForeground }}>{label}</Text>
    {learn && asset.description && <Text style={{ color: colors.foreground }}>{asset.description}</Text>}
    {learn && asset.specimenNote && <Text style={{ color: colors.mutedForeground }}>{asset.specimenNote}</Text>}
    <VisualCredit asset={asset} />
  </View>;
}

/** Keep creator/license/modification credit visible alongside the image. */
export function VisualCredit({ asset }: { asset: Asset }) {
  const colors = useColors();
  return <Text testID={`visual-credit-${asset.id}`} style={{ color: colors.mutedForeground, fontSize: 11 }}>{conciseVisualCredit(asset.attributionLicense)}</Text>;
}
