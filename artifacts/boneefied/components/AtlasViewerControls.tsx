import { OrganicSurface } from '@/components/OrganicBackground';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTypographyLayout } from '@/components/ScaledText';
import { useColors } from '@/hooks/useColors';
import { useLocale } from '@/locales/useLocale';
import { viewerControlRows, VIEWER_CONTROL_GAP, VIEWER_CONTROL_PADDING, VIEWER_CONTROL_TAP_SIZE, type ViewerControlName } from './viewerControlLayout';

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onRevealAll: () => void;
  onHideAll: () => void;
  showLabelActions: boolean;
};

/** Shared below-image controls. Geometry and reveal state remain in the viewer. */
export function AtlasViewerControls({ onZoomIn, onZoomOut, onReset, onRevealAll, onHideAll, showLabelActions }: Props) {
  const colors = useColors();
  const locale = useLocale();
  const { effectiveFontScale } = useTypographyLayout();
  const [width, setWidth] = useState(0);
  const [measured, setMeasured] = useState<{ key: string; widths: Partial<Record<ViewerControlName, number>> }>({ key: '', widths: {} });
  const actions = [
    { name: 'zoom-in', label: locale.t('imageViewer.zoomIn'), accessibility: locale.t('imageViewer.zoomIn'), onPress: onZoomIn },
    { name: 'zoom-out', label: locale.t('imageViewer.zoomOut'), accessibility: locale.t('imageViewer.zoomOut'), onPress: onZoomOut },
    { name: 'reset', label: locale.t('imageViewer.reset.visible'), accessibility: locale.t('imageViewer.reset.accessibility'), onPress: onReset },
    ...(showLabelActions ? [
      { name: 'reveal-all', label: locale.t('imageViewer.revealAll.visible'), accessibility: locale.t('imageViewer.revealAll.accessibility'), onPress: onRevealAll },
      { name: 'hide-all', label: locale.t('imageViewer.hideAll.visible'), accessibility: locale.t('imageViewer.hideAll.accessibility'), onPress: onHideAll },
    ] : []),
  ] as { name: ViewerControlName; label: string; accessibility: string; onPress: () => void }[];
  const key = `${Math.round(width)}:${effectiveFontScale}:${actions.map(action => action.label).join('|')}`;
  const textWidths = measured.key === key ? measured.widths : Object.fromEntries(actions.map(action =>
    [action.name, action.label.length * 13 * .6 * effectiveFontScale]));
  const rows = viewerControlRows(width, textWidths, showLabelActions);

  return <View testID="viewer-controls" onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
    style={[styles.block, { borderTopColor: colors.border, backgroundColor: colors.card }]}><OrganicSurface />
    {width > 0 && <View key={key} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" aria-hidden
      style={styles.measurements}>
      {actions.map(action => <Text key={action.name} style={[styles.label, styles.measureLabel]} onLayout={({ nativeEvent }) => {
        const textWidth = nativeEvent.layout.width;
        setMeasured(current => {
          const widths = current.key === key ? current.widths : {};
          if (widths[action.name] === textWidth) return current;
          return { key, widths: { ...widths, [action.name]: textWidth } };
        });
      }}>{action.label}</Text>)}
    </View>}
    {rows.map((row, index) => <View key={index} testID={`viewer-control-row-${index}`} style={styles.row}>
      {row.map(cell => {
        const action = actions.find(item => item.name === cell.name)!;
        const primary = cell.name === 'reveal-all';
        const neutral = cell.name === 'reset';
        return <Pressable key={cell.name} testID={`viewer-${cell.name}`} accessibilityRole="button"
          accessibilityLabel={action.accessibility} onPress={action.onPress}
          style={({ pressed }) => [styles.action, { width: cell.width, borderColor: primary ? colors.primary : colors.border,
            backgroundColor: primary ? colors.primary : colors.card, opacity: pressed ? .72 : 1 }]}>
          <OrganicSurface radius={8} shift={cell.name.length} ink={primary ? colors.primaryForeground : colors.primary} />
          <Text style={[styles.label, { color: primary ? colors.primaryForeground : neutral ? colors.foreground : colors.primary }]}>{action.label}</Text>
        </Pressable>;
      })}
    </View>)}
  </View>;
}

const styles = StyleSheet.create({
  block: { width: '100%', padding: VIEWER_CONTROL_PADDING, gap: VIEWER_CONTROL_GAP, borderTopWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', gap: VIEWER_CONTROL_GAP, alignItems: 'stretch' },
  action: { minWidth: VIEWER_CONTROL_TAP_SIZE, minHeight: VIEWER_CONTROL_TAP_SIZE, paddingHorizontal: 6, paddingVertical: 6,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 },
  label: { fontSize: 13, lineHeight: 17, fontWeight: '700', textAlign: 'center', includeFontPadding: false, maxWidth: '100%' },
  measurements: { position: 'absolute', left: VIEWER_CONTROL_PADDING + 6, right: VIEWER_CONTROL_PADDING + 6, top: 0, opacity: 0 },
  measureLabel: { position: 'absolute', left: 0, top: 0, alignSelf: 'flex-start' },
});
