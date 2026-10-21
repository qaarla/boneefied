import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { Text, MarkerText, compactOverlayFont, useTypographyLayout } from '@/components/ScaledText';
import { useColors } from '@/hooks/useColors';
import type { HotspotSizeOverride, NormalizedHotspot, VerifiedLabel } from '@/content/model';
import { markerSizing } from '@/components/viewerMarkerSizing';
import { bvr02OverlayOverrides } from '@/content/bvr02-overlay-overrides';
import { repairDiagramTargets } from '@/content/repair5-targets';
import { AtlasViewerControls } from '@/components/AtlasViewerControls';
import { AtlasLegend } from '@/components/AtlasLegend';
import { containedOverlayBox, protectedOverlayHeight, protectedOverlayRects } from '@/components/viewerOverlayProtection';
import { AnimatedAnswerPressable, type AnswerFeedback } from '@/components/AnimatedAnswerPressable';
import { useOfflineImage } from '@/hooks/useOfflineImage';
import { useLocale } from '@/locales/useLocale';
import { content } from '@/content/canonical';
import { annotationIndex, annotationKey, clampMarkerCenter, hasMarkerOverlap, spreadAtlasCallouts } from '@/components/viewerMarkerLayout';
import { useAnatomyViewerGesture } from '@/components/useAnatomyViewerGesture';
import { fitViewerScene, viewerPanBounds, imageCenteredSceneBounds } from '@/components/viewerSceneFraming';
import { peripheralAtlasAssetIds } from '@/content/peripheral-atlas-corrections';

const IMAGE_INSET = 12;
const vascularAssets = new Set(content.modules.find(m => m.id === 'blood-vessels')?.lessons?.flatMap(l => l.assetIds ?? []) ?? []);
const lymphaticAssets = new Set(content.modules.find(m => m.id === 'lymphatic-system')?.lessons?.flatMap(l => l.assetIds ?? []) ?? []);
const respiratoryAssets = new Set(content.modules.find(m => m.id === 'respiratory-system')?.lessons?.flatMap(l => l.assetIds ?? []) ?? []);
// Include the two shared abdominal/renal context plates reached from digestive glossary entries.
const digestiveAssets = new Set(content.assets.filter(a => a.id.startsWith('asset-bvis06-') && a.labels?.some(l => l.structureId.startsWith('digestive-system-'))).map(a => a.id));
const urinaryAssets = new Set([
  ...content.modules.find(m => m.id === 'urinary-system')?.lessons?.flatMap(l => l.assetIds ?? []) ?? [],
  ...content.assets.filter(a => a.id.startsWith('asset-bvis06-') && a.labels?.some(l => l.structureId.startsWith('urinary-system-'))).map(a => a.id),
]);
const maleReproductiveAssets = new Set(content.modules.find(m => m.id === 'male-reproductive')?.lessons?.flatMap(l => l.assetIds ?? []) ?? []);
const femaleReproductiveAssets = new Set(content.modules.find(m => m.id === 'female-reproductive')?.lessons?.flatMap(l => l.assetIds ?? []) ?? []);
const centeredNervousAssets = new Set([
  // Final atlas validation: every published diagram/specimen uses the same
  // centered contain geometry. Earlier group-by-group opt-ins left some
  // skeletal, muscular and foundational plates on asymmetric legacy fitting.
  ...content.assets.filter(a => a.assetType === 'diagram' || a.assetType === 'histology').map(a => a.id),
  ...content.modules.find(m => m.id === 'nervous-system')?.lessons?.flatMap(l => l.assetIds ?? []) ?? [],
  'asset-bvis04-nervous-tissue',
  ...peripheralAtlasAssetIds,
  ...content.modules.find(m => m.id === 'special-senses')?.lessons?.flatMap(l => l.assetIds ?? []) ?? [],
  ...content.modules.find(m => m.id === 'endocrine-system')?.lessons?.flatMap(l => l.assetIds ?? []) ?? [],
  ...content.modules.find(m => m.id === 'cardiovascular-system')?.lessons?.flatMap(l => l.assetIds ?? []) ?? [],
  ...vascularAssets,
  ...lymphaticAssets,
  ...respiratoryAssets,
  ...digestiveAssets,
  ...urinaryAssets,
  ...maleReproductiveAssets,
  ...femaleReproductiveAssets,
]);

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
  markerSizeOverride?: HotspotSizeOverride;
  diagramMarkerCount?: number;
  diagramAssetId?: string;
};

/** Source-safe image viewer. Hotspots are normalized to the contained image, not the frame. */
export function AnatomyImageViewer({ source, hotspots: suppliedHotspots = [], revealLabels = false, caption, imageAspectRatio: suppliedAspectRatio = 1.45, onHotspotPress, labels: suppliedLabels = [], bakedLabels = false, selectedHotspotId, correctHotspotId, submitted = false, reduceMotion = false, atlasLayout = false, questionHotspotCallouts = false, markerSizeOverride, diagramMarkerCount, diagramAssetId }: Props) {
  const hotspots = useMemo(() => repairDiagramTargets(diagramAssetId, suppliedHotspots), [diagramAssetId, suppliedHotspots]);
  const labels = useMemo(() => repairDiagramTargets(diagramAssetId, suppliedLabels), [diagramAssetId, suppliedLabels]);
  const colors = useColors();
  const locale = useLocale();
  const { isLargeText, isCompactTextLayout, effectiveFontScale } = useTypographyLayout();
  // Pack/glossary assets can be pre-catalog aliases. Resolve tuning by the
  // published identity, not only by properties on that imported object.
  const tuning = diagramAssetId ? bvr02OverlayOverrides[diagramAssetId] : undefined;
  const sizeOverride = markerSizeOverride ?? tuning?.size;
  const avoidRects = tuning?.avoid ?? [];
  // Question markers and study labels are mutually exclusive below. In feedback,
  // repeated study targets can outnumber the question's planned marker cells.
  const labelCalloutLayout = !questionHotspotCallouts && (atlasLayout || (labels.length > 0 && avoidRects.length > 0));
  const image = useOfflineImage(source);
  const imageAspectRatio = useMemo(() => {
    const asset = source ? Asset.fromModule(source) : undefined;
    return asset?.width && asset?.height ? asset.width / asset.height : suppliedAspectRatio;
  }, [source, suppliedAspectRatio]);
  const gesture = useAnatomyViewerGesture(source);
   const { reset, changeZoom } = gesture;
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [markerSizes, setMarkerSizes] = useState<Record<string, { width: number; height: number }>>({});
  const [fullMarkerSizes, setFullMarkerSizes] = useState<Record<string, { width: number; height: number }>>({});
  const showAll = () => setRevealed(new Set(labels.map((label) => label.structureId)));
  const hideAll = () => setRevealed(new Set());
  const toggleLabel = (id: string) => {
    if (!gesture.canPress()) return;
    setRevealed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const structureName = (id: string) => {
    const structure = content.structures.find((item) => item.id === id);
    return structure ? locale.structure(structure).canonicalName : id;
  };
   const questionControlSize = isLargeText ? 60 : 44;
   // These three reviewed plates use adjacent (still disjoint) touch cells.
   // The former extra 8px between every cell forced long, mostly empty gutters.
   const calloutGap = femaleReproductiveAssets.has(diagramAssetId ?? '') ? 0 : 8;
   const cellWidth = questionHotspotCallouts ? questionControlSize : Math.max(44, ...labels.map((l) => markerSizes[l.structureId]?.width ?? 44));
   const cellHeight = questionHotspotCallouts ? questionControlSize : Math.max(44, ...labels.map((l) => markerSizes[l.structureId]?.height ?? 44));
   const columns = Math.max(1, Math.floor(canvasSize.width / (cellWidth + calloutGap)));
   const baseHeight = Math.max(canvasSize.width / 1.45, Math.ceil((questionHotspotCallouts ? hotspots.length : labels.length) / columns) * (cellHeight + calloutGap) + 8);
   const overlayTargets = questionHotspotCallouts ? hotspots : labels;
   const atlasHeight = useMemo(() => protectedOverlayHeight(overlayTargets, canvasSize.width, baseHeight, cellWidth, cellHeight, imageAspectRatio, avoidRects, (sizeOverride?.maxDiameter ?? 40) / 2, IMAGE_INSET, calloutGap), [overlayTargets, canvasSize.width, baseHeight, cellWidth, cellHeight, imageAspectRatio, avoidRects, sizeOverride?.maxDiameter, calloutGap]);
   // Use the planned frame immediately; never place endpoints using a stale
   // onLayout height while a plate-specific gutter is being applied.
   const layoutHeight = (labelCalloutLayout || questionHotspotCallouts) && canvasSize.width > 0 ? atlasHeight : canvasSize.height;
   const imageBox = containedOverlayBox(canvasSize.width, layoutHeight, imageAspectRatio, IMAGE_INSET);
   const containedWidth = canvasSize.width > 0 ? imageBox.width / canvasSize.width : 1;
   const containedHeight = layoutHeight > 0 ? imageBox.height / layoutHeight : 1;
   const paint = markerSizing(canvasSize.width * containedWidth, Math.max(diagramMarkerCount ?? 0, hotspots.length, labels.length), effectiveFontScale, sizeOverride);
  const labelBounds = labels.filter((label) => revealLabels || revealed.has(label.structureId)).map((label) => {
    const size = fullMarkerSizes[label.structureId] ?? { width: 30, height: 30 };
    const x = ((1 - containedWidth) / 2 + label.x * containedWidth) * canvasSize.width;
     const y = ((1 - containedHeight) / 2 + label.y * containedHeight) * layoutHeight;
     return { left: clampMarkerCenter(x, canvasSize.width, size.width, IMAGE_INSET) - size.width / 2, top: clampMarkerCenter(y, layoutHeight, size.height, IMAGE_INSET) - size.height / 2, ...size };
  });
  // Reuse the existing accessible numbered markers and legend only when the
  // measured full labels collide; keep readable uncrowded overlays unchanged.
   const reflow = questionHotspotCallouts || labelCalloutLayout || isCompactTextLayout || isLargeText || (canvasSize.width > 0 && hasMarkerOverlap(labelBounds));
    const protectedRects = useMemo(() => protectedOverlayRects(canvasSize.width, layoutHeight, imageAspectRatio, avoidRects, IMAGE_INSET), [canvasSize.width, layoutHeight, imageAspectRatio, avoidRects]);
   const callouts = useMemo(() => labelCalloutLayout && canvasSize.width > 0 ? spreadAtlasCallouts(labels.map((l) => ({
    x: ((1 - containedWidth) / 2 + l.x * containedWidth) * canvasSize.width,
     y: ((1 - containedHeight) / 2 + l.y * containedHeight) * layoutHeight,
   })), canvasSize.width, layoutHeight, cellWidth, cellHeight, calloutGap, { avoid: protectedRects, markerRadius: paint.diameter / 2 }) : [], [labelCalloutLayout, labels, canvasSize.width, layoutHeight, cellWidth, cellHeight, containedWidth, containedHeight, protectedRects, paint.diameter, calloutGap]);
   const hotspotCallouts = useMemo(() => questionHotspotCallouts && canvasSize.width > 0 ? spreadAtlasCallouts(hotspots.map((h) => ({
    x: ((1 - containedWidth) / 2 + h.x * containedWidth) * canvasSize.width,
     y: ((1 - containedHeight) / 2 + h.y * containedHeight) * layoutHeight,
   })), canvasSize.width, layoutHeight, cellWidth, cellHeight, calloutGap, { avoid: protectedRects, markerRadius: paint.diameter / 2 }) : [], [questionHotspotCallouts, hotspots, canvasSize.width, layoutHeight, cellWidth, cellHeight, containedWidth, containedHeight, protectedRects, paint.diameter, calloutGap]);
    const labelPosition = (label: VerifiedLabel, index: number) => {
      const size = reflow ? { width: cellWidth, height: cellHeight } : markerSizes[label.structureId] ?? { width: 30, height: 30 };
      return {
        x: callouts[index]?.x ?? clampMarkerCenter(imageBox.x + label.x * imageBox.width, canvasSize.width, size.width, IMAGE_INSET),
        y: callouts[index]?.y ?? clampMarkerCenter(imageBox.y + label.y * imageBox.height, layoutHeight, size.height, IMAGE_INSET),
        ...size,
      };
    };
    const hotspotPosition = (hotspot: NormalizedHotspot, index: number) => {
      const callout = hotspotCallouts[index];
      return {
        x: callout?.x ?? imageBox.x + hotspot.x * imageBox.width,
        y: callout?.y ?? imageBox.y + hotspot.y * imageBox.height,
        width: questionHotspotCallouts ? cellWidth : hotspot.radius * imageBox.width * 2,
        height: questionHotspotCallouts ? cellHeight : hotspot.radius * imageBox.height * 2,
      };
    };
    // Bounds include the full measured hit targets and leader endpoints, not
    // only the raster. Dense plates can keep their layout on a virtual canvas
    // while the viewport remains a consistent, near-square inspection frame.
    const annotationRects = [
      imageBox,
      ...(!questionHotspotCallouts ? labels.map((label, index) => {
        const p = labelPosition(label, index);
        return { x: p.x - p.width / 2, y: p.y - p.height / 2, width: p.width, height: p.height };
      }) : []),
      ...hotspots.map((hotspot, index) => {
        const p = hotspotPosition(hotspot, index);
        const hitInset = questionHotspotCallouts ? 0 : reflow ? 16 : 0;
        return { x: p.x - p.width / 2 - hitInset, y: p.y - p.height / 2 - hitInset, width: p.width + hitInset * 2, height: p.height + hitInset * 2 };
      }),
      ...overlayTargets.map(p => ({ x: imageBox.x + p.x * imageBox.width - 2, y: imageBox.y + p.y * imageBox.height - 2, width: 4, height: 4 })),
    ];
     // Individually reviewed plates keep the raster itself centered, not an
     // asymmetric image-plus-callout envelope. Other assets keep their policy.
     const fitRects = centeredNervousAssets.has(diagramAssetId ?? '')
       ? imageCenteredSceneBounds(annotationRects, imageBox) : annotationRects;
     const framing = fitViewerScene(canvasSize.width, canvasSize.height, canvasSize.width, layoutHeight, fitRects);
     const panBounds = viewerPanBounds(imageBox, canvasSize.width, layoutHeight, framing, vascularAssets.has(diagramAssetId ?? '') || lymphaticAssets.has(diagramAssetId ?? '') || respiratoryAssets.has(diagramAssetId ?? '') || digestiveAssets.has(diagramAssetId ?? '') || urinaryAssets.has(diagramAssetId ?? '') || maleReproductiveAssets.has(diagramAssetId ?? '') || femaleReproductiveAssets.has(diagramAssetId ?? '') || centeredNervousAssets.has(diagramAssetId ?? ''));
   useEffect(() => {
     gesture.updateScene({
        width: canvasSize.width, height: canvasSize.height,
           // Individually reviewed circulatory, digestive and urinary plates include marker gutters in their content
         // bounds, otherwise a correct but off-raster marker cannot be reached
         // after zooming. All other groups retain their existing raster limits.
         image: panBounds,
     });
     gesture.measure();
     // Scene geometry, not zoom, determines the clamp limits.
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasSize.width, canvasSize.height, panBounds.x, panBounds.y, panBounds.width, panBounds.height]);
  const recordMarkerSize = (id: string, size: { width: number; height: number }) => {
    const update = (current: Record<string, { width: number; height: number }>) => current[id]?.width === size.width && current[id]?.height === size.height ? current : { ...current, [id]: size };
    setMarkerSizes(update);
    if (!reflow) setFullMarkerSizes(update);
  };
  return <View style={[styles.frame, { backgroundColor: colors.card, borderColor: colors.border }]} accessibilityLabel={locale.t('imageViewer.accessibility')}>
      <ViewerGestureSurface gesture={gesture.nativeGesture}>
      <View ref={gesture.areaRef} collapsable={false} testID="viewer-gesture-area" {...gesture.handlers} onLayout={({ nativeEvent: { layout } }) => setCanvasSize((current) => current.width === layout.width && current.height === layout.height ? current : { width: layout.width, height: layout.height })} style={[styles.gestureArea, gesture.webStyle]} accessibilityLabel={locale.t('imageViewer.inspectGestures')}>
      {!source && <View style={styles.empty}><Text style={[styles.blocked, { color: colors.mutedForeground }]}>{locale.t('imageViewer.unavailable')}</Text></View>}
      {source && !image.source && <View style={styles.empty}><Text style={[styles.blocked, { color: colors.mutedForeground }]}>{image.error ? locale.t('offlineImage.unavailableOffline') : locale.t('imageViewer.loading')}</Text></View>}
       {source && image.source && <Animated.View testID="viewer-canvas" pointerEvents="box-none" style={[styles.canvas, gesture.canvasStyle]}>
        <View testID="viewer-plate" pointerEvents="box-none" style={{ position: 'absolute', left: framing.left, top: framing.top, width: canvasSize.width, height: layoutHeight, transform: [{ scale: framing.scale }] }}>
        {/* Round the fitted raster (including its paper background), not the
            annotation scene. Keep every callout/leader outside this mask. */}
        <View testID="viewer-image-surface" pointerEvents="none" style={[styles.imageSurface, { left: imageBox.x, top: imageBox.y, width: imageBox.width, height: imageBox.height, borderRadius: colors.radius }]}>
          <Image testID="viewer-base-diagram" source={image.source} resizeMode="contain" style={styles.image} />
        </View>
        {hotspots.map((hotspot, index) => {
          const selected = selectedHotspotId === hotspot.structureId;
          const feedback: AnswerFeedback | undefined = submitted
            ? hotspot.structureId === correctHotspotId ? 'correct' : selected ? 'incorrect' : undefined
            : undefined;
           const callout = hotspotCallouts[index];
           const position = hotspotPosition(hotspot, index);
          const ax = ((1 - containedWidth) / 2 + hotspot.x * containedWidth) * canvasSize.width;
           const ay = ((1 - containedHeight) / 2 + hotspot.y * containedHeight) * layoutHeight;
          const dx = callout ? callout.x - ax : 0, dy = callout ? callout.y - ay : 0;
          const length = Math.hypot(dx, dy);
          const targetColor = feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : colors.foreground;
          return <React.Fragment key={`${hotspot.structureId}-${hotspot.x}-${hotspot.y}`}>
            {callout && <><View pointerEvents="none" style={{ position: 'absolute', left: ax + dx / 2 - length / 2, top: ay + dy / 2, width: length, height: 1, backgroundColor: targetColor, opacity: 0.6, transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }] }} /><View pointerEvents="none" style={{ position: 'absolute', left: ax - 2, top: ay - 2, width: 4, height: 4, borderRadius: 2, backgroundColor: targetColor }} /></>}
            <AnimatedAnswerPressable
            key={`${hotspot.structureId}-${hotspot.x}-${hotspot.y}`}
            disabled={!onHotspotPress || submitted}
            onPress={() => { if (gesture.canPress()) onHotspotPress?.(hotspot); }}
            feedback={feedback}
            reduceMotion={reduceMotion}
            accessibilityLabel={feedback === 'correct' ? locale.t('imageViewer.correctHotspot') : feedback === 'incorrect' ? locale.t('imageViewer.incorrectHotspot') : revealLabels ? locale.t('imageViewer.structureHotspot', { structureId: structureName(hotspot.structureId) }) : locale.t('imageViewer.hotspotNumber', { index: locale.number(index + 1) })}
            accessibilityHint={onHotspotPress && !submitted ? locale.t('imageViewer.selectHotspotHint') : undefined}
            accessibilityState={{ selected }}
            hitSlop={questionHotspotCallouts ? undefined : reflow ? 16 : undefined}
            decorate={false}
            testID={`hotspot-${hotspot.structureId}`}
             containerStyle={[styles.hotspot, questionHotspotCallouts && { alignItems: 'center', justifyContent: 'center' }, { left: position.x - position.width / 2, top: position.y - position.height / 2, width: position.width, height: position.height }]}
             contentStyle={[styles.hotspotContent, questionHotspotCallouts && { width: paint.diameter, height: paint.diameter, alignSelf: 'center', borderWidth: paint.borderWidth }, { borderColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : selected || revealLabels ? colors.primary : questionHotspotCallouts ? colors.foreground : 'transparent', backgroundColor: feedback === 'correct' ? colors.success : feedback === 'incorrect' ? colors.destructive : selected ? colors.secondary : questionHotspotCallouts ? colors.card : 'transparent' }]}
          >
            {feedback ? reflow
              ? <Feather name={feedback === 'correct' ? 'check' : 'x'} size={questionHotspotCallouts ? paint.numeralSize : 16} color={feedback === 'correct' ? colors.successForeground : colors.destructiveForeground} />
              : <Text style={{ color: feedback === 'correct' ? colors.successForeground : colors.destructiveForeground, fontWeight: '800' }}>{feedback === 'correct' ? '✓' : '✕'}</Text> : questionHotspotCallouts ? <MarkerText style={{ color: colors.foreground, fontSize: paint.numeralSize, fontWeight: '700', textAlign: 'center' }}>{locale.number(index + 1)}</MarkerText> : null}
           </AnimatedAnswerPressable></React.Fragment>;
        })}
         {!questionHotspotCallouts && labels.map((label, index) => {
          const visible = revealLabels || revealed.has(label.structureId);
          const x = (1 - containedWidth) / 2 + label.x * containedWidth;
          const y = (1 - containedHeight) / 2 + label.y * containedHeight;
          const callout = callouts[index];
           const marker = labelPosition(label, index);
           const position = {
             left: marker.x, top: marker.y,
             maxWidth: Math.max(0, canvasSize.width - IMAGE_INSET * 2),
             transform: [{ translateX: -marker.width / 2 }, { translateY: -marker.height / 2 }],
             ...(reflow && { width: marker.width, height: marker.height }),
           };
          const dx = callout ? callout.x - x * canvasSize.width : 0;
           const dy = callout ? callout.y - y * layoutHeight : 0;
          const length = Math.hypot(dx, dy);
          return <React.Fragment key={`label-${annotationKey(label)}`}>
             {callout && <View pointerEvents="none" style={{ position: 'absolute', left: x * canvasSize.width + dx / 2 - length / 2, top: y * layoutHeight + dy / 2, width: length, height: 1, backgroundColor: visible ? colors.primary : colors.foreground, opacity: 0.6, transform: [{ rotate: `${Math.atan2(dy, dx)}rad` }] }} />}
             {callout && <View pointerEvents="none" style={{ position: 'absolute', left: x * canvasSize.width - 2, top: y * layoutHeight - 2, width: 4, height: 4, borderRadius: 2, backgroundColor: visible ? colors.primary : colors.foreground }} />}
              <Pressable onLayout={({ nativeEvent: { layout } }) => recordMarkerSize(label.structureId, { width: layout.width, height: layout.height })} disabled={revealLabels} onPress={() => toggleLabel(label.structureId)} accessibilityRole="button" accessibilityState={{ selected: visible, disabled: revealLabels }} accessibilityLabel={revealLabels ? locale.t('imageViewer.structureHotspot', { structureId: label.displayLabel }) : visible ? locale.t('imageViewer.hideMarker', { index: locale.number(index + 1), label: label.displayLabel }) : locale.t('imageViewer.revealMarker', { index: locale.number(index + 1), label: label.displayLabel })} accessibilityHint={revealLabels ? undefined : locale.t('imageViewer.markerHint')} hitSlop={labelCalloutLayout ? undefined : reflow ? 7 : undefined} style={[styles.labelMarker, labelCalloutLayout && { minWidth: 44, minHeight: 44 }, position, { borderColor: visible ? colors.primary : colors.foreground, backgroundColor: visible ? colors.primary : colors.card }, reflow && { minWidth: 44, minHeight: 44, paddingHorizontal: 0, borderWidth: 0, backgroundColor: 'transparent' }]}>
               {reflow ? <View pointerEvents="none" testID={`marker-paint-${index + 1}`} style={{ width: paint.diameter, height: paint.diameter, borderRadius: paint.diameter / 2, borderWidth: paint.borderWidth, borderColor: visible ? colors.primary : colors.foreground, backgroundColor: visible ? colors.primary : colors.card, alignItems: 'center', justifyContent: 'center' }}>
                 {/* Numerals scale explicitly with typography settings, capped to fit;
                     accessible names remain complete; the dense legend has its own bounded scaling. */}
                 <MarkerText style={{ color: visible ? colors.primaryForeground : colors.foreground, fontSize: paint.numeralSize, fontWeight: '700', textAlign: 'center' }}>{visible ? locale.number(index + 1) : '?'}</MarkerText>
               </View> : <Text style={{ color: visible ? colors.primaryForeground : colors.foreground, fontSize: 11, fontWeight: '700', fontFamily: compactOverlayFont }}>{visible ? label.displayLabel : '?'}</Text>}
          </Pressable></React.Fragment>;
        })}
        </View>
       </Animated.View>}
    </View>
     </ViewerGestureSurface>
      {source ? <AtlasViewerControls onZoomIn={() => changeZoom(0.5)} onZoomOut={() => changeZoom(-0.5)}
        onReset={reset} onRevealAll={showAll} onHideAll={hideAll} showLabelActions={labels.length > 0 && !revealLabels} /> : null}
      {reflow && <AtlasLegend entries={labels.flatMap((label, index) => (revealLabels || revealed.has(label.structureId)) ? [{
        key: annotationKey(label), number: questionHotspotCallouts ? annotationIndex(hotspots, label) + 1 : index + 1,
        name: label.displayLabel,
      }] : [])} />}
     {bakedLabels && <Text style={[styles.notice, { color: colors.mutedForeground }]}>{locale.t('imageViewer.bakedLabelsNotice')}</Text>}
    {caption ? <Text style={[styles.caption, { color: colors.mutedForeground }]}>{caption}</Text> : null}
  </View>;
}

function ViewerGestureSurface({ gesture, children }: { gesture: ReturnType<typeof useAnatomyViewerGesture>['nativeGesture']; children: React.ReactElement }) {
  return Platform.OS === 'web' ? children : <GestureDetector gesture={gesture}>{children}</GestureDetector>;
}

const styles = StyleSheet.create({
  frame: { width: '100%', borderRadius: 16, borderWidth: 1, overflow: 'hidden', position: 'relative' },
   gestureArea: { aspectRatio: 1, overflow: 'hidden' },
  canvas: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
   imageSurface: { position: 'absolute', overflow: 'hidden' },
   image: { width: '100%', height: '100%' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  blocked: { fontSize: 14, textAlign: 'center' },
   hotspot: { position: 'absolute' },
  hotspotContent: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderRadius: 999 },
   labelMarker: { position: 'absolute', minWidth: 30, minHeight: 30, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderRadius: 999 },
  notice: { paddingHorizontal: 12, paddingVertical: 7, fontSize: 11 },
  caption: { paddingHorizontal: 12, paddingVertical: 12, fontSize: 11 },
});