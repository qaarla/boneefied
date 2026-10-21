import React, { useState } from 'react';
import { Platform, StyleSheet, Text as NativeText } from 'react-native';
import { useTypographyLayout } from '@/components/ScaledText';
import { APP_FONTS } from '@/context/typeface';
import { wholeWordFontFactor } from '@/context/wholeWordFit';

/** A compact brand control, not a wrapping reading heading. Native Text keeps
 * its own single-line fitting contract even when reading copy must reflow. */
export function HomeBrandTitle({ color }: { color: string }) {
  const { effectiveFontScale, systemFontScale } = useTypographyLayout();
  const [availableWidth, setAvailableWidth] = useState(0);
  const baseSize = 26 * effectiveFontScale / systemFontScale;
  const requestedWebSize = 26 * effectiveFontScale;
  const webSize = requestedWebSize
    * wholeWordFontFactor('Boneefied', availableWidth, requestedWebSize, true);

  return <NativeText
    testID="study-brand-title"
    accessibilityRole="header"
    accessibilityLabel="Boneefied"
    allowFontScaling
    maxFontSizeMultiplier={0}
    numberOfLines={1}
    adjustsFontSizeToFit
    minimumFontScale={0.1}
    dynamicTypeRamp={Platform.OS === 'ios' ? 'title2' : undefined}
    onLayout={Platform.OS === 'web' ? event => {
      const width = event.nativeEvent.layout.width;
      setAvailableWidth(previous => Math.abs(previous - width) < 0.5 ? previous : width);
    } : undefined}
    style={[styles.title, { color, fontSize: Platform.OS === 'web' ? webSize : baseSize }]}
  >Boneefied</NativeText>;
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    minWidth: 0,
    maxHeight: 48,
    fontFamily: APP_FONTS.bold,
    fontWeight: 'normal',
    textAlign: 'center',
    flexShrink: 1,
  },
});
