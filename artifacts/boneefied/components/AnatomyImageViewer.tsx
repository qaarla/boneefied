import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { NormalizedHotspot } from '@/content/model';

/** Image-first viewer contract. Coordinates are normalized, keeping overlays device independent. */
export function AnatomyImageViewer({ source, hotspots = [], revealLabels = false, caption }: { source?: number; hotspots?: NormalizedHotspot[]; revealLabels?: boolean; caption?: string }) {
  const colors = useColors();
  return <View style={[styles.frame, { backgroundColor: colors.card, borderColor: colors.border }]}>
    {source ? <Image source={source} resizeMode="contain" style={styles.image} /> : <View style={styles.empty}><Text style={[styles.blocked, { color: colors.mutedForeground }]}>No verified course image available</Text></View>}
    {hotspots.map((hotspot) => <View key={`${hotspot.structureId}-${hotspot.x}`} style={[styles.hotspot, { left: `${hotspot.x * 100}%`, top: `${hotspot.y * 100}%`, width: `${hotspot.radius * 100}%`, aspectRatio: 1, borderColor: revealLabels ? colors.primary : 'transparent' }]} />)}
    {caption ? <Text style={[styles.caption, { color: colors.mutedForeground }]}>{caption}</Text> : null}
  </View>;
}
const styles = StyleSheet.create({
  frame: { width: '100%', aspectRatio: 1.45, borderRadius: 16, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  image: { width: '100%', height: '100%' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  blocked: { fontSize: 14, textAlign: 'center' },
  hotspot: { position: 'absolute', transform: [{ translateX: -10 }, { translateY: -10 }], borderWidth: 2, borderRadius: 999 },
  caption: { position: 'absolute', bottom: 10, left: 12, right: 12, fontSize: 11 },
});