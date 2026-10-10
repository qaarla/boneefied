import React from 'react';
import { View } from 'react-native';
import { Text } from './ScaledText';
import type { Asset } from '@/content/model';
import { bvis05Plates } from '@/content/bvis05-plates.generated';
import { useLocale } from '@/locales/useLocale';
import { useColors } from '@/hooks/useColors';

export function Bvis05PlateContext({ asset, learn }: { asset: Asset; learn: boolean }) {
  const { language } = useLocale(), colors = useColors(), es = language === 'es';
  const p = bvis05Plates.find((p) => p.id === asset.id);
  if (!p && asset.assetType !== 'histology') return null;
  return <View style={{ gap: 6, paddingHorizontal: 6 }}>
    <Text style={{ color: colors.mutedForeground }}>{asset.assetType === 'histology'
      ? es ? 'Muestra real — fotomicrografía. No se afirma tinción ni aumento.' : 'Real specimen — photomicrograph. Stain and magnification are not asserted.'
      : p?.teachingKind === 'tissue-schematic'
        ? es ? 'Esquema didáctico — no una fotomicrografía.' : 'Teaching schematic — not a photomicrograph.'
        : es ? 'Diagrama anatómico simplificado.' : 'Simplified anatomical diagram.'}</Text>
    {p && learn && <Text style={{ color: colors.mutedForeground }}>{es ? 'Vista' : 'View'}: {es ? p.orientationEs : p.orientation}</Text>}
    {learn && <Text style={{ color: colors.foreground }}>{p ? p.description[es ? 1 : 0] : asset.description}</Text>}
    <Text style={{ color: colors.mutedForeground }}>{asset.attributionLicense}</Text>
  </View>;
}
