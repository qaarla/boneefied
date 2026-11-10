import React, { useMemo } from 'react';
import { Image as RasterImage } from 'expo-image';
import { Image, Platform, StyleSheet, type ImageSourcePropType } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { renderableAtlasXml } from './atlasVectorXml';

type Props = {
  xml?: string;
  source?: ImageSourcePropType;
  width: number;
  height: number;
};

/** Width/height are actual zoomed display points, not an inverse-scaled surface.
 * No ancestor scales this drawing: native SVG paints at its displayed size.
 */
export function SharpAtlasImage({ xml, source, width, height }: Props) {
  const renderXml = useMemo(() => xml ? renderableAtlasXml(xml) : undefined, [xml]);
  if (xml) {
    return <SvgXml
      testID="viewer-base-diagram"
      xml={renderXml!}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      style={styles.vector}
    />;
  }
  // Never invent raster detail. Decode the genuine full-resolution source;
  // Android/iOS must not reduce it to the initial small viewport before zoom.
  if (Platform.OS !== 'web') return <RasterImage testID="viewer-base-diagram" source={source} contentFit="contain" allowDownscaling={false} style={styles.image} />;
  return <Image testID="viewer-base-diagram" source={source} resizeMode="contain" style={styles.image} />;
}

const styles = StyleSheet.create({
  image: { width: '100%', height: '100%' },
  vector: { position: 'absolute', left: 0, top: 0 },
});
