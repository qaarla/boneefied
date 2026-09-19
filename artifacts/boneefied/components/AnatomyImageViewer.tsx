import React, { useRef, useState } from 'react';
import { Image, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { NormalizedHotspot } from '@/content/model';

type Props = {
  source?: number;
  hotspots?: NormalizedHotspot[];
  revealLabels?: boolean;
  caption?: string;
  imageAspectRatio?: number;
  onHotspotPress?: (hotspot: NormalizedHotspot) => void;
};

/** Source-safe image viewer. Hotspots are normalized to the contained image, not the frame. */
export function AnatomyImageViewer({ source, hotspots = [], revealLabels = false, caption, imageAspectRatio = 1.45, onHotspotPress }: Props) {
  const colors = useColors();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const start = useRef({ x: 0, y: 0, zoom: 1 });
  const pinchDistance = useRef(0);
  const distance = (touches: ReadonlyArray<{ pageX: number; pageY: number }>) => touches.length > 1
    ? Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY) : 0;
  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !!source,
    onMoveShouldSetPanResponder: () => !!source,
    onPanResponderGrant: (event) => {
      start.current = { x: offset.x, y: offset.y, zoom };
      pinchDistance.current = distance(event.nativeEvent.touches);
    },
    onPanResponderMove: (event, gesture) => {
      const currentDistance = distance(event.nativeEvent.touches);
      const pinchScale = pinchDistance.current > 0 && currentDistance > 0 ? currentDistance / pinchDistance.current : 1;
      const nextZoom = Math.max(1, Math.min(4, start.current.zoom * (gesture.numberActiveTouches > 1 ? pinchScale : 1)));
      setZoom(nextZoom);
      setOffset({ x: start.current.x + gesture.dx, y: start.current.y + gesture.dy });
    },
    onPanResponderRelease: () => {
      pinchDistance.current = 0;
      if (zoom <= 1) setOffset({ x: 0, y: 0 });
    },
  })).current;
  const reset = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };
  // Frame aspect ratio is 1.45. These percentages describe the contain box.
  const frameRatio = 1.45;
  const containedWidth = Math.min(1, frameRatio / imageAspectRatio);
  const containedHeight = Math.min(1, imageAspectRatio / frameRatio);
  return <View style={[styles.frame, { backgroundColor: colors.card, borderColor: colors.border }]} accessibilityLabel="Anatomy image viewer">
    <View {...responder.panHandlers} style={styles.gestureArea} accessibilityLabel="Pan or pinch to inspect image">
      {source ? <Image source={source} resizeMode="contain" style={[styles.image, { transform: [{ translateX: offset.x }, { translateY: offset.y }, { scale: zoom }] }]} /> : <View style={styles.empty}><Text style={[styles.blocked, { color: colors.mutedForeground }]}>No verified course image available</Text></View>}
      {source && hotspots.map((hotspot) => <Pressable key={`${hotspot.structureId}-${hotspot.x}-${hotspot.y}`} disabled={!onHotspotPress} onPress={() => onHotspotPress?.(hotspot)} accessibilityRole="button" accessibilityLabel={revealLabels ? hotspot.structureId : 'Hidden structure hotspot'} testID={`hotspot-${hotspot.structureId}`} style={[styles.hotspot, { left: `${(1 - containedWidth) * 50 + hotspot.x * containedWidth * 100}%`, top: `${(1 - containedHeight) * 50 + hotspot.y * containedHeight * 100}%`, width: `${hotspot.radius * containedWidth * 200}%`, height: `${hotspot.radius * containedHeight * 200}%`, borderColor: revealLabels ? colors.primary : 'transparent' }]} />)}
    </View>
    {source ? <Pressable onPress={reset} accessibilityRole="button" accessibilityLabel="Reset image zoom and position" testID="viewer-reset" style={[styles.reset, { backgroundColor: colors.card }]}><Text style={{ color: colors.foreground }}>Reset</Text></Pressable> : null}
    {caption ? <Text style={[styles.caption, { color: colors.mutedForeground }]}>{caption}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  frame: { width: '100%', borderRadius: 16, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  gestureArea: { aspectRatio: 1.45, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  blocked: { fontSize: 14, textAlign: 'center' },
  hotspot: { position: 'absolute', transform: [{ translateX: '-50%' }, { translateY: '-50%' }], borderWidth: 2, borderRadius: 999 },
  reset: { position: 'absolute', right: 10, top: 10, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, opacity: 0.94 },
  caption: { paddingHorizontal: 12, paddingVertical: 8, fontSize: 11 },
});