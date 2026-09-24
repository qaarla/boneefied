import React, { useRef, useState } from 'react';
import { Image, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import type { NormalizedHotspot, VerifiedLabel } from '@/content/model';
import { AnimatedAnswerPressable, type AnswerFeedback } from '@/components/AnimatedAnswerPressable';
import { useOfflineImage } from '@/hooks/useOfflineImage';

type Props = {
  source?: number;
  hotspots?: NormalizedHotspot[];
  revealLabels?: boolean;
  caption?: string;
  imageAspectRatio?: number;
  onHotspotPress?: (hotspot: NormalizedHotspot) => void;
  labels?: VerifiedLabel[];
  bakedLabels?: boolean;
  selectedHotspotId?: string;
  correctHotspotId?: string;
  submitted?: boolean;
  reduceMotion?: boolean;
};

/** Source-safe image viewer. Hotspots are normalized to the contained image, not the frame. */
export function AnatomyImageViewer({ source, hotspots = [], revealLabels = false, caption, imageAspectRatio = 1.45, onHotspotPress, labels = [], bakedLabels = false, selectedHotspotId, correctHotspotId, submitted = false, reduceMotion = false }: Props) {
  const colors = useColors();
  const image = useOfflineImage(source);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const view = useRef({ zoom: 1, offset: { x: 0, y: 0 } });
  view.current = { zoom, offset };
  const start = useRef({ x: 0, y: 0, zoom: 1 });
  const pinchDistance = useRef(0);
  const distance = (touches: ReadonlyArray<{ pageX: number; pageY: number }>) => touches.length > 1
    ? Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY) : 0;
  const responder = useRef(PanResponder.create({
    // Let child buttons receive taps. Claim the gesture only once the user
    // actually drags or pinches, so panning cannot submit a hotspot answer.
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (event, gesture) => !!source && (event.nativeEvent.touches.length > 1 || Math.abs(gesture.dx) > 8 || Math.abs(gesture.dy) > 8),
    onPanResponderGrant: (event) => {
      start.current = { x: view.current.offset.x, y: view.current.offset.y, zoom: view.current.zoom };
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
      if (view.current.zoom <= 1) setOffset({ x: 0, y: 0 });
    },
  })).current;
  const reset = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };
  const showAll = () => setRevealed(new Set(labels.map((label) => label.structureId)));
  const hideAll = () => setRevealed(new Set());
  // Frame aspect ratio is 1.45. These percentages describe the contain box.
  const frameRatio = 1.45;
  const containedWidth = Math.min(1, imageAspectRatio / frameRatio);
  const containedHeight = Math.min(1, frameRatio / imageAspectRatio);
  return <View style={[styles.frame, { backgroundColor: colors.card, borderColor: colors.border }]} accessibilityLabel="Anatomy image viewer">
    <View {...responder.panHandlers} style={styles.gestureArea} accessibilityLabel="Pan or pinch to inspect image">
      {!source && <View style={styles.empty}><Text style={[styles.blocked, { color: colors.mutedForeground }]}>No verified course image available</Text></View>}
      {source && !image.source && <View style={styles.empty}><Text style={[styles.blocked, { color: colors.mutedForeground }]}>{image.error ?? 'Loading anatomy image…'}</Text></View>}
      {source && image.source && <View pointerEvents="box-none" style={[styles.canvas, { transform: [{ translateX: offset.x }, { translateY: offset.y }, { scale: zoom }] }]}>
        <Image source={image.source} resizeMode="contain" style={styles.image} />
        {hotspots.map((hotspot) => {
          const selected = selectedHotspotId === hotspot.structureId;
          const feedback: AnswerFeedback | undefined = submitted
            ? hotspot.structureId === correctHotspotId ? 'correct' : selected ? 'incorrect' : undefined
            : undefined;
          return <AnimatedAnswerPressable
            key={`${hotspot.structureId}-${hotspot.x}-${hotspot.y}`}
            disabled={!onHotspotPress || submitted}
            onPress={() => onHotspotPress?.(hotspot)}
            feedback={feedback}
            reduceMotion={reduceMotion}
            accessibilityLabel={feedback === 'correct' ? 'Correct structure hotspot' : feedback === 'incorrect' ? 'Incorrect selected hotspot' : revealLabels ? hotspot.structureId : 'Hidden structure hotspot'}
            accessibilityState={{ selected }}
            testID={`hotspot-${hotspot.structureId}`}
            containerStyle={[styles.hotspot, { left: `${(1 - containedWidth) * 50 + hotspot.x * containedWidth * 100}%`, top: `${(1 - containedHeight) * 50 + hotspot.y * containedHeight * 100}%`, width: `${hotspot.radius * containedWidth * 200}%`, height: `${hotspot.radius * containedHeight * 200}%` }]}
            contentStyle={[styles.hotspotContent, { borderColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : selected || revealLabels ? colors.primary : 'transparent', backgroundColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : selected ? colors.secondary : 'transparent' }]}
          >
            {feedback ? <Text style={{ color: feedback === 'correct' ? colors.successForeground : colors.destructiveForeground, fontWeight: '800' }}>{feedback === 'correct' ? '✓' : '✕'}</Text> : null}
          </AnimatedAnswerPressable>;
        })}
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
  hotspot: { position: 'absolute', transform: [{ translateX: '-50%' }, { translateY: '-50%' }] },
  hotspotContent: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderRadius: 999 },
  labelMarker: { position: 'absolute', transform: [{ translateX: '-50%' }, { translateY: '-50%' }], minWidth: 30, minHeight: 30, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderRadius: 999 },
  controls: { position: 'absolute', right: 10, top: 10, flexDirection: 'row', gap: 8, alignItems: 'center' },
  reset: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, opacity: 0.94 },
  notice: { paddingHorizontal: 12, paddingVertical: 7, fontSize: 11 },
  caption: { paddingHorizontal: 12, paddingVertical: 8, fontSize: 11 },
});