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
  scale: number;
};

/** The outer viewer still owns all pan, zoom, clipping and marker geometry. */
export function SharpAtlasImage({ xml, source, width, height, scale }: Props) {
  const renderXml = useMemo(() => xml ? renderableAtlasXml(xml) : undefined, [xml]);
  if (xml) {
    // A native SVG also has a backing surface. Resize that surface at zoom,
    // then inverse-scale it inside the unchanged scene, so the parent's zoom
    // does not merely stretch a screen-sized texture. Native adds device DPR.
    const resolutionScale = Math.max(1, scale);
    return <SvgXml
      testID="viewer-base-diagram"
      xml={renderXml!}
      width={width * resolutionScale}
      height={height * resolutionScale}
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', left: 0, top: 0, transformOrigin: 'top left', transform: [{ scale: 1 / resolutionScale }] }}
    />;
  }
  // Never invent raster detail. Decode the genuine full-resolution source;
  // Android/iOS must not reduce it to the initial small viewport before zoom.
  if (Platform.OS !== 'web') return <RasterImage testID="viewer-base-diagram" source={source} contentFit="contain" allowDownscaling={false} style={styles.image} />;
  return <Image testID="viewer-base-diagram" source={source} resizeMode="contain" style={styles.image} />;
}

const styles = StyleSheet.create({ image: { width: '100%', height: '100%' } });
