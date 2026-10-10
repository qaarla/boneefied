import React, { useRef, useState } from 'react';
import { Image, PanResponder, Platform, Pressable, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text, useTypographyLayout } from '@/components/ScaledText';
import { useColors } from '@/hooks/useColors';
import type { NormalizedHotspot, VerifiedLabel } from '@/content/model';
import { AnimatedAnswerPressable, type AnswerFeedback } from '@/components/AnimatedAnswerPressable';
import { useOfflineImage } from '@/hooks/useOfflineImage';
import { useLocale } from '@/locales/useLocale';
import { content } from '@/content/canonical';
import { annotationIndex, annotationKey, clampMarkerCenter, hasMarkerOverlap, spreadAtlasCallouts } from '@/components/viewerMarkerLayout';
import { touchCenter, touchDistance, type TouchPoint } from '@/components/viewerGestureGeometry';

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
  /** New atlas plates use disjoint numbered callouts with lines to unchanged targets. */
  atlasLayout?: boolean;
  /** BVIS02 practice uses numbered touch targets, not overlapping tiny openings. */
  questionHotspotCallouts?: boolean;
};

/** Source-safe image viewer. Hotspots are normalized to the contained image, not the frame. */
export function AnatomyImageViewer({ source, hotspots = [], revealLabels = false, caption, imageAspectRatio = 1.45, onHotspotPress, labels = [], bakedLabels = false, selectedHotspotId, correctHotspotId, submitted = false, reduceMotion = false, atlasLayout = false, questionHotspotCallouts = false }: Props) {
  const colors = useColors();
  const locale = useLocale();
  const { isLargeText, isCompactTextLayout } = useTypographyLayout();
  const image = useOfflineImage(source);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [markerSizes, setMarkerSizes] = useState<Record<string, { width: number; height: number }>>({});
  const [fullMarkerSizes, setFullMarkerSizes] = useState<Record<string, { width: number; height: number }>>({});
  const view = useRef({ zoom: 1, offset: { x: 0, y: 0 } });
  view.current = { zoom, offset };
  const start = useRef({ x: 0, y: 0, zoom: 1 });
  const pinchDistance = useRef(0);
 const distance = touchDistance;
  const responder = useRef(PanResponder.create({
    // Let child buttons receive taps. Claim the gesture only once the user
    // actually drags or pinches, so panning cannot submit a hotspot answer.
    onStartShouldSetPanResponder: () => false,
   onMoveShouldSetPanResponder: (event, gesture) => !!source && (event.nativeEvent.touches.length > 1 || view.current.zoom > 1 && (Math.abs(gesture.dx) > 8 || Math.abs(gesture.dy) > 8)),
    onPanResponderGrant: (event) => {
      start.current = { x: view.current.offset.x, y: view.current.offset.y, zoom: view.current.zoom };
      pinchDistance.current = distance(event.nativeEvent.touches);
    },
    onPanResponderMove: (event, gesture) => {
      const currentDistance = distance(event.nativeEvent.touches);
      const pinchScale = pinchDistance.current > 0 && currentDistance > 0 ? currentDistance / pinchDistance.current : 1;
      const nextZoom = Math.max(1, Math.min(4, start.current.zoom * (gesture.numberActiveTouches > 1 ? pinchScale : 1)));
     const nextOffset = { x: start.current.x + gesture.dx, y: start.current.y + gesture.dy };
     view.current = { zoom: nextZoom, offset: nextOffset };
     setZoom(nextZoom);
     setOffset(nextOffset);
    },
    onPanResponderRelease: () => {
      pinchDistance.current = 0;
      if (view.current.zoom <= 1) setOffset({ x: 0, y: 0 });
    },
   onPanResponderTerminate: () => {
     pinchDistance.current = 0;
     if (view.current.zoom <= 1) setOffset({ x: 0, y: 0 });
   },
  })).current;
 const reset = () => {
   webDragging.current = false;
   webMoved.current = false;
   view.current = { zoom: 1, offset: { x: 0, y: 0 } };
   start.current = { x: 0, y: 0, zoom: 1 };
   pinchDistance.current = 0;
   setZoom(1);
   setOffset({ x: 0, y: 0 });
 };
 // Let the page scroll at rest; once zoomed, touch drags belong to the image.
 const webGestureStyle = Platform.OS === 'web'
   ? { width: '100%' as const, touchAction: zoom > 1 ? 'none' : 'pan-y' } : undefined;
 const webOrigin = useRef({ x: 0, y: 0 });
 const webDragging = useRef(false);
 const webMoved = useRef(false);
 const beginWebGesture = (touches: ArrayLike<TouchPoint>) => {
   webDragging.current = touches.length > 1 || touches.length === 1 && view.current.zoom > 1;
   webMoved.current = false;
   if (!webDragging.current) return;
   webOrigin.current = touchCenter(touches);
   start.current = { x: view.current.offset.x, y: view.current.offset.y, zoom: view.current.zoom };
   pinchDistance.current = distance(touches);
 };
 const moveWebGesture = (touches: ArrayLike<TouchPoint>) => {
   if (!webDragging.current || !touches.length) return;
   const point = touchCenter(touches);
   const dx = point.x - webOrigin.current.x, dy = point.y - webOrigin.current.y;
   const d = distance(touches);
   if (Math.abs(dx) > 8 || Math.abs(dy) > 8 || touches.length > 1) webMoved.current = true;
   const z = Math.max(1, Math.min(4, start.current.zoom * (pinchDistance.current > 0 && d > 0 ? d / pinchDistance.current : 1)));
   const next = { x: start.current.x + dx, y: start.current.y + dy };
   view.current = { zoom: z, offset: next };
   setZoom(z);
   setOffset(next);
 };
 const endWebGesture = () => { webDragging.current = false; pinchDistance.current = 0; };
 // RN Web's responder gesture deltas can remain zero during a touch drag.
 // Use touch centroids directly on web; retain native PanResponder behavior.
 const webHandlers = {
   onTouchStart: (e: GestureResponderEvent) => beginWebGesture(e.nativeEvent.touches),
   onTouchMove: (e: GestureResponderEvent) => moveWebGesture(e.nativeEvent.touches),
   onTouchEnd: (e: GestureResponderEvent) => e.nativeEvent.touches.length ? beginWebGesture(e.nativeEvent.touches) : endWebGesture(),
   onTouchCancel: endWebGesture,
   onMoveShouldSetResponderCapture: () => webDragging.current && webMoved.current,
   onResponderTerminationRequest: () => !webDragging.current,
   onResponderTerminate: endWebGesture,
   onMouseDown: (e: React.MouseEvent) => beginWebGesture([{ pageX: e.pageX, pageY: e.pageY }]),
   onMouseMove: (e: React.MouseEvent) => moveWebGesture([{ pageX: e.pageX, pageY: e.pageY }]),
   onMouseUp: endWebGesture,
   onMouseLeave: endWebGesture,
 };
  const showAll = () => setRevealed(new Set(labels.map((label) => label.structureId)));
  const hideAll = () => setRevealed(new Set());
  const structureName = (id: string) => {
    const structure = content.structures.find((item) => item.id === id);
    return structure ? locale.structure(structure).canonicalName : id;
  };
  // Frame aspect ratio is 1.45. These percentages describe the contain box.
  const frameRatio = canvasSize.height > 0 ? canvasSize.width / canvasSize.height : 1.45;
  const containedWidth = Math.min(1, imageAspectRatio / frameRatio);
  const containedHeight = Math.min(1, frameRatio / imageAspectRatio);
  const labelBounds = labels.filter((label) => revealLabels || revealed.has(label.structureId)).map((label) => {
    const size = fullMarkerSizes[label.structureId] ?? { width: 30, height: 30 };
    const x = ((1 - containedWidth) / 2 + label.x * containedWidth) * canvasSize.width;
    const y = ((1 - containedHeight) / 2 + label.y * containedHeight) * canvasSize.height;
    return { left: clampMarkerCenter(x, canvasSize.width, size.width) - size.width / 2, top: clampMarkerCenter(y, canvasSize.height, size.height) - size.height / 2, ...size };
  });
  // Reuse the existing accessible numbered markers and legend only when the
  // measured full labels collide; keep readable uncrowded overlays unchanged.
  const reflow = questionHotspotCallouts || atlasLayout || isCompactTextLayout || isLargeText || (canvasSize.width > 0 && hasMarkerOverlap(labelBounds));
  const questionControlSize = isLargeText ? 60 : 44;
  const cellWidth = questionHotspotCallouts ? questionControlSize : Math.max(44, ...labels.map((l) => markerSizes[l.structureId]?.width ?? 44));
  const cellHeight = questionHotspotCallouts ? questionControlSize : Math.max(44, ...labels.map((l) => markerSizes[l.structureId]?.height ?? 44));
  const columns = Math.max(1, Math.floor(canvasSize.width / (cellWidth + 8)));
  // Reserve enough margin cells to keep dense callouts off the anatomy itself.
  const atlasHeight = Math.max(canvasSize.width / 1.45, Math.ceil((questionHotspotCallouts ? hotspots.length : labels.length) / Math.min(columns, 2)) * (cellHeight + 8));
  const callouts = atlasLayout && canvasSize.width > 0 ? spreadAtlasCallouts(labels.map((l) => ({
    x: ((1 - containedWidth) / 2 + l.x * containedWidth) * canvasSize.width,
    y: ((1 - containedHeight) / 2 + l.y * containedHeight) * canvasSize.height,
  })), canvasSize.width, Math.max(canvasSize.height, atlasHeight), cellWidth, cellHeight) : [];
  const hotspotCallouts = questionHotspotCallouts && canvasSize.width > 0 ? spreadAtlasCallouts(hotspots.map((h) => ({
    x: ((1 - containedWidth) / 2 + h.x * containedWidth) * canvasSize.width,
    y: ((1 - containedHeight) / 2 + h.y * containedHeight) * canvasSize.height,
  })), canvasSize.width, Math.max(canvasSize.height, atlasHeight), cellWidth, cellHeight) : [];
  const recordMarkerSize = (id: string, size: { width: number; height: number }) => {
    const update = (current: Record<string, { width: number; height: number }>) => current[id]?.width === size.width && current[id]?.height === size.height ? current : { ...current, [id]: size };
    setMarkerSizes(update);
    if (!reflow) setFullMarkerSizes(update);
  };
  return <View style={[styles.frame, { backgroundColor: colors.card, borderColor: colors.border }]} accessibilityLabel={locale.t('imageViewer.accessibility')}>
    <View {...(Platform.OS === 'web' ? webHandlers : responder.panHandlers)} onLayout={({ nativeEvent: { layout } }) => setCanvasSize((current) => current.width === layout.width && current.height === layout.height ? current : { width: layout.width, height: layout.height })} style={[styles.gestureArea, webGestureStyle, (atlasLayout || questionHotspotCallouts) && canvasSize.width > 0 && { aspectRatio: undefined, height: atlasHeight }]} accessibilityLabel={locale.t('imageViewer.inspectGestures')}>
      {!source && <View style={styles.empty}><Text style={[styles.blocked, { color: colors.mutedForeground }]}>{locale.t('imageViewer.unavailable')}</Text></View>}
      {source && !image.source && <View style={styles.empty}><Text style={[styles.blocked, { color: colors.mutedForeground }]}>{image.error ? locale.t('offlineImage.unavailableOffline') : locale.t('imageViewer.loading')}</Text></View>}
      {source && image.source && <View pointerEvents="box-none" style={[styles.canvas, { transform: [{ translateX: offset.x }, { translateY: offset.y }, { scale: zoom }] }]}>
        <Image source={image.source} resizeMode="contain" style={styles.image} />
        {hotspots.map((hotspot, index) => {
          const selected = selectedHotspotId === hotspot.structureId;
          const feedback: AnswerFeedback | undefined = submitted
            ? hotspot.structureId === correctHotspotId ? 'correct' : selected ? 'incorrect' : undefined
            : undefined;
          const callout = hotspotCallouts[index];
          const ax = ((1 - containedWidth) / 2 + hotspot.x * containedWidth) * canvasSize.width;
          const ay = ((1 - containedHeight) / 2 + hotspot.y * containedHeight) * canvasSize.height;
          const dx = callout ? callout.x - ax : 0, dy = callout ? callout.y - ay : 0;
          const length = Math.hypot(dx, dy);
          const targetColor = feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : colors.foreground;
          return <React.Fragment key={`${hotspot.structureId}-${hotspot.x}-${hotspot.y}`}>
            {callout && <><View pointerEvents="none" style={{ position: 'absolute', left: ax + dx / 2 - length / 2, top: ay + dy / 2, width: length, height: 1, backgroundColor: targetColor, opacity: 0.6, transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }] }} /><View pointerEvents="none" style={{ position: 'absolute', left: ax - 2, top: ay - 2, width: 4, height: 4, borderRadius: 2, backgroundColor: targetColor }} /></>}
            <AnimatedAnswerPressable
            key={`${hotspot.structureId}-${hotspot.x}-${hotspot.y}`}
            disabled={!onHotspotPress || submitted}
            onPress={() => onHotspotPress?.(hotspot)}
            feedback={feedback}
            reduceMotion={reduceMotion}
            accessibilityLabel={feedback === 'correct' ? locale.t('imageViewer.correctHotspot') : feedback === 'incorrect' ? locale.t('imageViewer.incorrectHotspot') : revealLabels ? locale.t('imageViewer.structureHotspot', { structureId: structureName(hotspot.structureId) }) : locale.t('imageViewer.hotspotNumber', { index: locale.number(index + 1) })}
            accessibilityHint={onHotspotPress && !submitted ? locale.t('imageViewer.selectHotspotHint') : undefined}
            accessibilityState={{ selected }}
            hitSlop={questionHotspotCallouts ? undefined : reflow ? 16 : undefined}
            testID={`hotspot-${hotspot.structureId}`}
            containerStyle={[styles.hotspot, callout ? { left: callout.x, top: callout.y, width: cellWidth, height: cellHeight } : { left: `${(1 - containedWidth) * 50 + hotspot.x * containedWidth * 100}%`, top: `${(1 - containedHeight) * 50 + hotspot.y * containedHeight * 100}%`, width: questionHotspotCallouts ? cellWidth : `${hotspot.radius * containedWidth * 200}%`, height: questionHotspotCallouts ? cellHeight : `${hotspot.radius * containedHeight * 200}%` }]}
            contentStyle={[styles.hotspotContent, { borderColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : selected || revealLabels ? colors.primary : questionHotspotCallouts ? colors.foreground : 'transparent', backgroundColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : selected ? colors.secondary : questionHotspotCallouts ? colors.card : 'transparent' }]}
          >
            {feedback ? reflow
              ? <Feather name={feedback === 'correct' ? 'check' : 'x'} size={16} color={feedback === 'correct' ? colors.successForeground : colors.destructiveForeground} />
              : <Text style={{ color: feedback === 'correct' ? colors.successForeground : colors.destructiveForeground, fontWeight: '800' }}>{feedback === 'correct' ? '✓' : '✕'}</Text> : questionHotspotCallouts ? <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '700' }}>{locale.number(index + 1)}</Text> : null}
           </AnimatedAnswerPressable></React.Fragment>;
        })}
         {!questionHotspotCallouts && labels.map((label, index) => {
          const visible = revealLabels || revealed.has(label.structureId);
          const markerSize = markerSizes[label.structureId] ?? { width: 30, height: 30 };
          const x = (1 - containedWidth) / 2 + label.x * containedWidth;
          const y = (1 - containedHeight) / 2 + label.y * containedHeight;
          const callout = callouts[index];
          const position = callout ? { left: callout.x, top: callout.y } : canvasSize.width > 0 && canvasSize.height > 0
            ? { left: clampMarkerCenter(x * canvasSize.width, canvasSize.width, markerSize.width), top: clampMarkerCenter(y * canvasSize.height, canvasSize.height, markerSize.height), maxWidth: Math.max(0, canvasSize.width - 4) }
            : { left: `${x * 100}%` as `${number}%`, top: `${y * 100}%` as `${number}%` };
          const dx = callout ? callout.x - x * canvasSize.width : 0;
          const dy = callout ? callout.y - y * canvasSize.height : 0;
          const length = Math.hypot(dx, dy);
          return <React.Fragment key={`label-${annotationKey(label)}`}>
            {callout && <View pointerEvents="none" style={{ position: 'absolute', left: x * canvasSize.width + dx / 2 - length / 2, top: y * canvasSize.height + dy / 2, width: length, height: 1, backgroundColor: visible ? colors.primary : colors.foreground, opacity: 0.6, transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }] }} />}
            {callout && <View pointerEvents="none" style={{ position: 'absolute', left: x * canvasSize.width - 2, top: y * canvasSize.height - 2, width: 4, height: 4, borderRadius: 2, backgroundColor: visible ? colors.primary : colors.foreground }} />}
            <Pressable onLayout={({ nativeEvent: { layout } }) => recordMarkerSize(label.structureId, { width: layout.width, height: layout.height })} disabled={revealLabels} onPress={() => setRevealed((current) => { const next = new Set(current); if (next.has(label.structureId)) next.delete(label.structureId); else next.add(label.structureId); return next; })} accessibilityRole="button" accessibilityState={{ selected: visible, disabled: revealLabels }} accessibilityLabel={revealLabels ? locale.t('imageViewer.structureHotspot', { structureId: label.displayLabel }) : visible ? locale.t('imageViewer.hideMarker', { index: locale.number(index + 1), label: label.displayLabel }) : locale.t('imageViewer.revealMarker', { index: locale.number(index + 1), label: label.displayLabel })} accessibilityHint={revealLabels ? undefined : locale.t('imageViewer.markerHint')} hitSlop={atlasLayout ? undefined : reflow ? 7 : undefined} style={[styles.labelMarker, atlasLayout && { minWidth: 44, minHeight: 44 }, position, { borderColor: visible ? colors.primary : colors.foreground, backgroundColor: visible ? colors.primary : colors.card }]}>
              <Text style={{ color: visible ? colors.primaryForeground : colors.foreground, fontSize: reflow ? 14 : 11, fontWeight: '700' }}>{visible ? (reflow ? locale.number(index + 1) : label.displayLabel) : '?'}</Text>
          </Pressable></React.Fragment>;
        })}
      </View>}
    </View>
      {source ? <View style={[styles.controls, reflow && styles.controlsLarge]}><Pressable onPress={reset} hitSlop={4} accessibilityRole="button" accessibilityLabel={locale.t('imageViewer.reset.accessibility')} testID="viewer-reset" style={[styles.reset, reflow && styles.controlActionLarge, { backgroundColor: colors.card }]}><Text style={{ color: colors.foreground }}>{locale.t('imageViewer.reset.visible')}</Text></Pressable>{labels.length > 0 && !revealLabels && <><Pressable onPress={showAll} hitSlop={4} accessibilityRole="button" accessibilityLabel={locale.t('imageViewer.revealAll.accessibility')} style={reflow && styles.controlActionLarge}><Text style={{ color: colors.primary }}>{locale.t('imageViewer.revealAll.visible')}</Text></Pressable><Pressable onPress={hideAll} hitSlop={4} accessibilityRole="button" accessibilityLabel={locale.t('imageViewer.hideAll.accessibility')} style={reflow && styles.controlActionLarge}><Text style={{ color: colors.primary }}>{locale.t('imageViewer.hideAll.visible')}</Text></Pressable></>}</View> : null}
      {reflow && labels.some((label) => revealLabels || revealed.has(label.structureId)) && <View style={styles.labelList}>
         {labels.map((label, index) => (revealLabels || revealed.has(label.structureId)) && <Text key={annotationKey(label)} style={{ color: colors.foreground }}>{locale.number(questionHotspotCallouts ? annotationIndex(hotspots, label) + 1 : index + 1)}. {label.displayLabel}</Text>)}
     </View>}
     {bakedLabels && <Text style={[styles.notice, { color: colors.mutedForeground }]}>{locale.t('imageViewer.bakedLabelsNotice')}</Text>}
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
  controlsLarge: { position: 'relative', right: 0, top: 0, width: '100%', alignSelf: 'stretch', justifyContent: 'flex-start', flexWrap: 'wrap', padding: 10 },
  controlActionLarge: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  labelList: { paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  reset: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, opacity: 0.94 },
  notice: { paddingHorizontal: 12, paddingVertical: 7, fontSize: 11 },
  caption: { paddingHorizontal: 12, paddingVertical: 8, fontSize: 11 },
});