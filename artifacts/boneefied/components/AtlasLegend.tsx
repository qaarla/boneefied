import React from 'react';
import { Platform, StyleSheet, Text as NativeText, View } from 'react-native';
import { useTypographyLayout } from '@/components/ScaledText';
import { appTypeface } from '@/context/typeface';
import { useColors } from '@/hooks/useColors';
import { useLocale } from '@/locales/useLocale';
import { atlasLegendTypography, atlasLegendNumberWidth, ATLAS_LEGEND_MAX_SCALE } from './atlasLegendTypography';

export type AtlasLegendEntry = { key: string; number: number; name: string };

/** A naturally growing, hanging-indent list, not a nested/fixed-height scroller.
 * Entries arrive with their original marker numbers; never renumber a revealed subset. */
export function AtlasLegend({ entries }: { entries: AtlasLegendEntry[] }) {
  const colors = useColors();
  const locale = useLocale();
  const { effectiveFontScale, systemFontScale } = useTypographyLayout();
  const metrics = atlasLegendTypography(effectiveFontScale, systemFontScale, Platform.OS !== 'web');
  const numbers = entries.map(entry => locale.number(entry.number));
  const numberWidth = atlasLegendNumberWidth(numbers, metrics.scale);
  const typography = { fontSize: metrics.fontSize, lineHeight: metrics.lineHeight };
  if (!entries.length) return null;
  return <View testID="atlas-legend" style={styles.list}>
    {entries.map((entry, index) => <View key={entry.key} testID={`atlas-legend-row-${numbers[index]}`}
      accessible accessibilityLabel={`${numbers[index]}. ${entry.name}`} style={styles.row}>
      <NativeText testID="atlas-legend-number" accessible={false} allowFontScaling maxFontSizeMultiplier={ATLAS_LEGEND_MAX_SCALE}
        dynamicTypeRamp={Platform.OS === 'ios' ? 'body' : undefined}
        style={[styles.number, typography, appTypeface({ fontWeight: '700' }), { width: numberWidth, color: colors.primary }]}>
        {numbers[index]}.
      </NativeText>
      <NativeText testID="atlas-legend-name" accessible={false} allowFontScaling maxFontSizeMultiplier={ATLAS_LEGEND_MAX_SCALE}
        dynamicTypeRamp={Platform.OS === 'ios' ? 'body' : undefined}
        style={[styles.name, typography, appTypeface(), { color: colors.foreground }]}>{entry.name}</NativeText>
    </View>)}
  </View>;
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 12, paddingVertical: 8, gap: 3 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  number: { flexShrink: 0, textAlign: 'right' },
  name: { flex: 1, minWidth: 0, flexShrink: 1 },
});
