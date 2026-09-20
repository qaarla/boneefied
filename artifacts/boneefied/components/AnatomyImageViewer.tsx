import React, { useRef, useState } from 'react';
import { Image, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { NormalizedHotspot, VerifiedLabel } from '@/content/model';

type Props = {
  source?: number;
  hotspots?: NormalizedHotspot[];
  revealLabels?: boolean;
  caption?: string;
  imageAspectRatio?: number;
  onHotspotPress?: (hotspot: NormalizedHotspot) => void;
  labels?: VerifiedLabel[];
  bakedLabels?: boolean;
};

/** Source-safe image viewer. Hotspots are normalized to the contained image, not the frame. */
export function AnatomyImageViewer({ source, hotspots = [], revealLabels = false, caption, imageAspectRatio = 1.45, onHotspotPress, labels = [], bakedLabels = false }: Props) {
  const colors = useColors();
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
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
  const showAll = () => setRevealed(new Set(labels.map((label) => label.structureId)));
  const hideAll = () => setRevealed(new Set());
  // Frame aspect ratio is 1.45. These percentages describe the contain box.
  const frameRatio = 1.45;
  const containedWidth = Math.min(1, frameRatio / imageAspectRatio);
  const containedHeight = Math.min(1, imageAspectRatio / frameRatio);
  return <View style={[styles.frame, { backgroundColor: colors.card, borderColor: colors.border }]} accessibilityLabel="Anatomy image viewer">
    <View {...responder.panHandlers} style={styles.gestureArea} accessibilityLabel="Pan or pinch to inspect image">
      {!source && <View style={styles.empty}><Text style={[styles.blocked, { color: colors.mutedForeground }]}>No verified course image available</Text></View>}
      {source && <View pointerEvents="box-none" style={[styles.canvas, { transform: [{ translateX: offset.x }, { translateY: offset.y }, { scale: zoom }] }]}>
        <Image source={source} resizeMode="contain" style={styles.image} />
        {hotspots.map((hotspot) => <Pressable key={`${hotspot.structureId}-${hotspot.x}-${hotspot.y}`} disabled={!onHotspotPress} onPress={() => onHotspotPress?.(hotspot)} accessibilityRole="button" accessibilityLabel={revealLabels ? hotspot.structureId : 'Hidden structure hotspot'} testID={`hotspot-${hotspot.structureId}`} style={[styles.hotspot, { left: `${(1 - containedWidth) * 50 + hotspot.x * containedWidth * 100}%`, top: `${(1 - containedHeight) * 50 + hotspot.y * containedHeight * 100}%`, width: `${hotspot.radius * containedWidth * 200}%`, height: `${hotspot.radius * containedHeight * 200}%`, borderColor: revealLabels ? colors.primary : 'transparent' }]} />)}
        {labels.map((label) => {
          const visible = revealLabels || revealed.has(label.structureId);
          return <Pressable key={`label-${label.structureId}`} onPress={() => setRevealed((current) => { const next = new Set(current); if (next.has(label.structureId)) next.delete(label.structureId); else next.add(label.structureId); return next; })} accessibilityRole="button" accessibilityState={{ selected: visible }} accessibilityLabel={visible ? `Hide ${label.displayLabel}` : `Reveal ${label.displayLabel}`} style={[styles.labelMarker, { left: `${(1 - containedWidth) * 50 + label.x * containedWidth * 100}%`, top: `${(1 - containedHeight) * 50 + label.y * containedHeight * 100}%`, borderColor: visible ? colors.primary : colors.foreground, backgroundColor: visible ? colors.primary : colors.card }]}>
            <Text style={{ color: visible ? colors.primaryForeground : colors.foreground, fontSize: 11, fontWeight: '700' }}>{visible ? label.displayLabel : '?'}</Text>
          </Pressable>;
        })}
      </View>}
    </View>
    {source ? <View style={styles.controls}><Pressable onPress={reset} accessibilityRole="button" accessibilityLabel="Reset image zoom and position" testID="viewer-reset" style={[styles.reset, { backgroundColor: colors.card }]}><Text style={{ color: colors.foreground }}>Reset</Text></Pressable>{labels.length > 0 && <><Pressable onPress={showAll} accessibilityRole="button" accessibilityLabel="Reveal all image labels"><Text style={{ color: colors.primary }}>Reveal all</Text></Pressable><Pressable onPress={hideAll} accessibilityRole="button" accessibilityLabel="Hide all image labels"><Text style={{ color: colors.primary }}>Hide all</Text></Pressable></>}</View> : null}
    {bakedLabels && <Text style={[styles.notice, { color: colors.mutedForeground }]}>Original labels are part of this source image and remain visible; this image is not recall-ready.</Text>}
    {caption ? <Text style={[styles.caption, { color: colors.mutedForeground }]}>{caption}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  frame: { width: '100%', borderRadius: 16, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  gestureArea: { aspectRatio: 1.45, overflow: 'hidden' },
  canvas: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  image: { width: '100%', height: '100%' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  blocked: { fontSize: 14, textAlign: 'center' },
  hotspot: { position: 'absolute', transform: [{ translateX: '-50%' }, { translateY: '-50%' }], borderWidth: 2, borderRadius: 999 },
  labelMarker: { position: 'absolute', transform: [{ translateX: '-50%' }, { translateY: '-50%' }], minWidth: 30, minHeight: 30, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderRadius: 999 },
  controls: { position: 'absolute', right: 10, top: 10, flexDirection: 'row', gap: 8, alignItems: 'center' },
  reset: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, opacity: 0.94 },
  notice: { paddingHorizontal: 12, paddingVertical: 7, fontSize: 11 },
  caption: { paddingHorizontal: 12, paddingVertical: 8, fontSize: 11 },
});