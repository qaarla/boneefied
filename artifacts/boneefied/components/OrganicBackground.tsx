import React, { memo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useColors } from '@/hooks/useColors';
import { organicBranches, organicFibers, ORGANIC_STRENGTH, ORGANIC_VIEWBOX } from './organicFibers';

// A decorative renderer failure must leave the existing plain screen usable.
class DecorationFallback extends React.Component<React.PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export const OrganicBackground = memo(function OrganicBackground() {
  const colors = useColors();
  return (
    <View
      testID="organic-background"
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.decoration}
    >
      <DecorationFallback>
        <Svg
          width="100%" height="100%" viewBox={ORGANIC_VIEWBOX}
          preserveAspectRatio="none" opacity={ORGANIC_STRENGTH}
          {...(Platform.OS === 'web' ? { 'aria-hidden': true as const } : { accessible: false })}
          focusable={false}
        >
          {organicFibers.map(d => <Path key={d} d={d} fill={colors.primary} />)}
          {organicBranches.map(d => <Path key={d} d={d} fill="none" stroke={colors.primary} strokeWidth={0.9} strokeLinecap="round" />)}
        </Svg>
      </DecorationFallback>
    </View>
  );
});

const styles = StyleSheet.create({
  decoration: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
});
