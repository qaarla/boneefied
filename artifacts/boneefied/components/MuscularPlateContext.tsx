import React from 'react';
import { View } from 'react-native';
import { Text } from './ScaledText';
import type { Asset } from '@/content/model';
import { muscularPlates } from '@/content/muscular-atlas-plates.generated';
import { useLocale } from '@/locales/useLocale';
import { useColors } from '@/hooks/useColors';

/** View and layer context stays outside the artwork, so it can be localized. */
export function MuscularPlateContext({ asset, learn }: { asset: Asset; learn: boolean }) {
  const { language } = useLocale();
  const colors = useColors();
  const plate = muscularPlates.find((p) => p.id === asset.id);
  if (!plate) return null;
  return <View style={{ gap: 6 }}>
    <Text style={{ color: colors.mutedForeground }}>
      {language === 'es' ? 'Vista y capa' : 'View and layer'}: {language === 'es' ? plate.orientationEs : plate.orientation}
    </Text>
    {learn && <Text style={{ color: colors.foreground }}>{plate.description[language === 'es' ? 1 : 0]}</Text>}
    <Text style={{ color: colors.mutedForeground }}>{asset.attributionLicense}</Text>
  </View>;
}
