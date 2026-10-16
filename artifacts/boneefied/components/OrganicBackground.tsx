import React, { memo, useState } from 'react';
import { Platform, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useColors } from '@/hooks/useColors';
import {
  organicBundles, ORGANIC_BRANCH_WIDTH, ORGANIC_STRAND_WIDTH, ORGANIC_STRENGTH, ORGANIC_SURFACE_STRENGTH, ORGANIC_UNIT_PX,
} from './organicFibers';

// A decorative renderer failure must leave the existing plain screen usable.
class DecorationFallback extends React.Component<React.PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

// Joined once per bundle so each surface only renders the bundles it can show.
const JOINED = organicBundles.map(b => ({ minX: b.minX, maxX: b.maxX, key: b.x, fibers: b.fibers.join(' '), strands: b.strands.join(' '), branches: b.branches.join(' ') }));
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/**
 * Draws a window of the shared tile at a FIXED fiber scale (about 1.3px per unit),
 * so a small card shows the same fine detail as a full screen, just less of it.
 */
function Material({ ink, strength, w, h, shiftX, shiftY }: { ink: string; strength: number; w: number; h: number; shiftX: number; shiftY: number }) {
  const k = Math.max(ORGANIC_UNIT_PX, w / 1000, h / 1000);
  const vw = w / k, vh = h / k;
  const x0 = clamp(500 + shiftX - vw / 2, 0, 1000 - vw), y0 = clamp(500 + shiftY - vh / 2, 0, 1000 - vh);
  const shown = JOINED.filter(b => b.maxX > x0 && b.minX < x0 + vw);
  return (
    <Svg
      width={w} height={h} viewBox={`${x0} ${y0} ${vw} ${vh}`} preserveAspectRatio="none" opacity={strength}
      {...(Platform.OS === 'web' ? { 'aria-hidden': true as const } : { accessible: false })}
      focusable={false}
    >
      {shown.map(b => <React.Fragment key={b.key}>
        <Path d={b.fibers} fill={ink} />
        <Path d={b.strands} fill="none" stroke={ink} strokeWidth={ORGANIC_STRAND_WIDTH} strokeLinecap="round" />
        <Path d={b.branches} fill="none" stroke={ink} strokeWidth={ORGANIC_BRANCH_WIDTH} strokeLinecap="round" />
      </React.Fragment>)}
    </Svg>
  );
}

function Layer({ testID, ink, strength, radius = 0, shiftX = 0, shiftY = 0 }: { testID: string; ink: string; strength: number; radius?: number; shiftX?: number; shiftY?: number }) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize(prev => (Math.abs(prev.w - width) < 1 && Math.abs(prev.h - height) < 1 ? prev : { w: Math.round(width), h: Math.round(height) }));
  };
  return (
    <View
      testID={testID}
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={onLayout}
      style={[styles.decoration, { borderRadius: radius }]}
    >
      <DecorationFallback>
        {size.w > 0 && size.h > 0 && <Material ink={ink} strength={strength} w={size.w} h={size.h} shiftX={shiftX} shiftY={shiftY} />}
      </DecorationFallback>
    </View>
  );
}

/** Screen-wide material, edge to edge including the centre. */
export const OrganicBackground = memo(function OrganicBackground() {
  const colors = useColors();
  return <Layer testID="organic-background" ink={colors.primary} strength={ORGANIC_STRENGTH} />;
});

/**
 * The same material for an opaque card, panel, sheet or bar. Place as the first
 * child; it never covers content and is never used above educational images.
 * `ink` follows the local background; `shift` varies the crop between neighbours.
 */
export const OrganicSurface = memo(function OrganicSurface({ radius = 0, shift = 0, ink }: { radius?: number; shift?: number; ink?: string }) {
  const colors = useColors();
  return <Layer testID="organic-surface" ink={ink ?? colors.primary} strength={ORGANIC_SURFACE_STRENGTH} radius={radius}
    shiftX={((shift * 53) % 600) - 300} shiftY={((shift * 29) % 600) - 300} />;
});

const styles = StyleSheet.create({
  decoration: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
});
