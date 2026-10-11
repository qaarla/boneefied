import React from 'react';
import { Platform, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useColors } from '@/hooks/useColors';
import { moduleIconShapes, type ModuleIconKey } from './moduleIconCatalog';

/** 42x42, radius-12 tile with a matte anatomy glyph. Consumes a semantic key, never an index. */
export function ModuleIcon({ iconKey, label }: { iconKey: ModuleIconKey; label: string }) {
  const colors = useColors();
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label} style={{ width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border }}>
      <Svg width={26} height={26} viewBox="0 0 24 24" fill="none"
        {...(Platform.OS === 'web'
          ? { 'aria-hidden': true }
          : { accessible: false, accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const })}>
        {moduleIconShapes[iconKey].map((s, i) => (
          <Path key={i} d={s.d} stroke={colors.primary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill={s.f ? colors.primary : 'none'} fillOpacity={s.f ? 0.16 : 0} />
        ))}
      </Svg>
    </View>
  );
}
