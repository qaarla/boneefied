import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useTypographyLayout } from '@/components/ScaledText';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { ViewerScrollOwnership } from '@/components/ViewerScrollOwnership';

export function Screen({ children, scroll = true, keyboardAware = false, belowHeader = false, scrollRef, onScroll, onViewportLayout, keyboardShouldPersistTaps }: {
  children: React.ReactNode;
  scroll?: boolean;
  keyboardAware?: boolean;
  belowHeader?: boolean;
  scrollRef?: React.Ref<ScrollView>;
  onScroll?: ScrollViewProps['onScroll'];
  onViewportLayout?: (height: number, bottomClearance: number) => void;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
}) {
  const colors = useColors();
  const scrollNode = useRef<ScrollView | null>(null);
  const owners = useRef(new Set<symbol>());
  const scrollY = useRef(0);
  const lockedScrollY = useRef<number | null>(null);
  const [viewerOwnsGesture, setViewerOwnsGesture] = useState(false);
  const setOwnership = useCallback((owner: symbol, active: boolean) => {
    if (active === owners.current.has(owner)) return;
    if (active) owners.current.add(owner); else owners.current.delete(owner);
    const locked = owners.current.size > 0;
    // Stop native scroll interception before the next render commits.
    if (Platform.OS !== 'web') scrollNode.current?.setNativeProps({ scrollEnabled: !locked });
    if (locked && lockedScrollY.current === null) {
      lockedScrollY.current = scrollY.current;
      // Stop page momentum as well as future interception, before React commits.
      scrollNode.current?.scrollTo({ y: lockedScrollY.current, animated: false });
    } else if (!locked) {
      lockedScrollY.current = null;
    }
    setViewerOwnsGesture(locked);
  }, []);
  const ownership = useMemo(() => ({ setOwnership, getScrollY: () => scrollY.current }), [setOwnership]);
  const attachScroll = useCallback((node: ScrollView | null) => {
    scrollNode.current = node;
    if (typeof scrollRef === 'function') scrollRef(node);
    else if (scrollRef) scrollRef.current = node;
  }, [scrollRef]);
  const { shouldReflow, isExpandedTabLayout, systemFontScale } = useTypographyLayout();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const isTabScreen = segments[0] === '(tabs)';
  const bottomPadding = Platform.OS === 'web'
    ? isTabScreen && isExpandedTabLayout ? 32 + 96 * Math.max(1, systemFontScale) : 118
    : insets.bottom + 96 * (shouldReflow ? Math.max(1, systemFontScale) : 1) + (Platform.OS === 'ios' && isTabScreen ? 32 : 0);
  const content = <View style={[styles.content, { paddingTop: 18, paddingHorizontal: shouldReflow ? 16 : 20, ...(!scroll && { paddingBottom: bottomPadding }) }]}>{children}</View>;
  // The top inset belongs outside the scroll view so it cannot scroll under the status bar.
  // Bottom clearance belongs to the scrollable container so the final child can clear the fixed tabs.
  const scrollProps = {
    // A non-transparent stack header already lays content below the safe area.
    ...(belowHeader && { contentInsetAdjustmentBehavior: 'never' as const, automaticallyAdjustContentInsets: false }),
    scrollEnabled: !viewerOwnsGesture,
    onScroll: ((event) => {
      if (owners.current.size > 0 && lockedScrollY.current !== null) {
        if (Math.abs(event.nativeEvent.contentOffset.y - lockedScrollY.current) > 0.5) {
          scrollNode.current?.scrollTo({ y: lockedScrollY.current, animated: false });
        }
        return;
      }
      scrollY.current = event.nativeEvent.contentOffset.y;
      onScroll?.(event);
    }) as NonNullable<ScrollViewProps['onScroll']>,
    keyboardShouldPersistTaps,
    scrollEventThrottle: 16,
    onLayout: ((event) => onViewportLayout?.(event.nativeEvent.layout.height, bottomPadding)) as NonNullable<ScrollViewProps['onLayout']>,
    contentContainerStyle: [styles.scroll, { paddingBottom: bottomPadding }],
    showsVerticalScrollIndicator: shouldReflow,
  };
  const scroller = keyboardAware
    ? <KeyboardAwareScrollViewCompat viewerScrollRef={attachScroll} {...scrollProps} bottomOffset={64}>{content}</KeyboardAwareScrollViewCompat>
    : <ScrollView ref={attachScroll} {...scrollProps}>{content}</ScrollView>;
  return <ViewerScrollOwnership.Provider value={ownership}><View style={[styles.screen, { backgroundColor: colors.background, paddingTop: belowHeader ? 0 : insets.top }]}>{scroll ? scroller : content}</View></ViewerScrollOwnership.Provider>;
}
const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: { paddingHorizontal: 20, gap: 18, width: '100%', maxWidth: 720, alignSelf: 'center' },
});