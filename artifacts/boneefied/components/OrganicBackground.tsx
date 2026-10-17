import React, { memo, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Image } from 'expo-image';
import { useColors } from '@/hooks/useColors';
import palettes from '@/constants/colors';

const DARK_ART = require('../assets/images/materials/boneefied-muscle-fibers-dark.webp');
const LIGHT_ART = require('../assets/images/materials/boneefied-muscle-fibers-light.webp');
const MATERIAL_PX = 768; // fixed material scale; cards are crops of the same-size material
const BG_OPACITY = { dark: 0.38, light: 0.5 };
const SURFACE_OPACITY = { dark: 0.24, light: 0.34 };

// A decorative renderer failure must leave the existing plain screen usable.
class DecorationFallback extends React.Component<React.PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

// Use the app preference-resolved palette, not just the operating-system theme.
function useIsDark() { return useColors().background === palettes.dark.background; }
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

function Layer({ testID, dark, strength, radius = 0, shiftX = 0, shiftY = 0 }: { testID: string; dark: boolean; strength: number; radius?: number; shiftX?: number; shiftY?: number }) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [failed, setFailed] = useState(false);
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize(prev => (Math.abs(prev.w - width) < 1 && Math.abs(prev.h - height) < 1 ? prev : { w: Math.round(width), h: Math.round(height) }));
  };
  const S = Math.max(MATERIAL_PX, size.w, size.h);
  const left = clamp((size.w - S) / 2 - shiftX, size.w - S, 0);
  const top = clamp((size.h - S) / 2 - shiftY, size.h - S, 0);
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
        {size.w > 0 && size.h > 0 && !failed && <Image
          source={dark ? DARK_ART : LIGHT_ART}
          contentFit="cover"
          cachePolicy="memory-disk"
          priority={testID === 'organic-background' ? 'high' : 'normal'}
          loading={testID === 'organic-background' ? 'eager' : 'lazy'}
          accessible={false}
          focusable={false}
          pointerEvents="none"
          onError={() => setFailed(true)}
          style={{ position: 'absolute', width: S, height: S, left, top, opacity: strength }}
        />}
      </DecorationFallback>
    </View>
  );
}

/** Screen-wide material, edge to edge including the centre. */
export const OrganicBackground = memo(function OrganicBackground() {
  const dark = useIsDark();
  return <Layer testID="organic-background" dark={dark} strength={dark ? BG_OPACITY.dark : BG_OPACITY.light} />;
});

/**
 * The same material for an opaque card, panel, sheet or bar. Place as the first
 * child; it never covers content and is never used above educational images.
 * `ink` follows the local background; `shift` varies the crop between neighbours.
 */
export const OrganicSurface = memo(function OrganicSurface({ radius = 0, shift = 0, ink }: { radius?: number; shift?: number; ink?: string }) {
  const colors = useColors();
  const dark = useIsDark();
  const filled = !!ink && ink !== colors.primary;
  return <Layer testID="organic-surface" dark={dark} strength={filled ? 0.12 : dark ? SURFACE_OPACITY.dark : SURFACE_OPACITY.light} radius={radius}
    shiftX={((shift * 53) % 600) - 300} shiftY={((shift * 29) % 600) - 300} />;
});

const styles = StyleSheet.create({
  decoration: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
});
