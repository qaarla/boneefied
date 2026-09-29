import React from 'react';
import { Platform, Pressable, StyleSheet, Text as NativeText, useColorScheme, View, type ColorValue } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';
import { devPreviewFontScale, Text, useTypographyLayout } from '@/components/ScaledText';
import { typographyMetrics } from '@/context/typographyScale';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocale } from '@/locales/useLocale';

// IMPORTANT: iOS 26 uses NativeTabs for native tabs with liquid glass support.
// NativeTabs intentionally does NOT use custom design tokens — liquid glass
// is a system-level appearance provided by iOS and cannot be overridden.
// Custom brand colors are applied only on the ClassicTabLayout path (older iOS / Android / web).
function NativeTabLayout() {
  const { t } = useLocale();
  return (
    <NativeTabs>
         <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
        />
         <NativeTabs.Trigger.Label>{t('tabs.study')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="practice">
        <NativeTabs.Trigger.Icon sf={{ default: 'checkmark.circle', selected: 'checkmark.circle.fill' }} />
        <NativeTabs.Trigger.Label>{t('tabs.practice')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="missed">
        <NativeTabs.Trigger.Icon sf={{ default: 'arrow.counterclockwise', selected: 'arrow.counterclockwise.circle.fill' }} />
        <NativeTabs.Trigger.Label>{t('tabs.missed')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="progress">
        <NativeTabs.Trigger.Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
        <NativeTabs.Trigger.Label>{t('tabs.progress')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

// At Accessibility Larger Text, two columns let labels grow instead of
// shrinking four labels into narrow slots. Content determines the bar height.
function AccessibleTabBar({ state, descriptors, navigation }: TabBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  return <View style={[styles.expandedBar, { paddingBottom: insets.bottom, backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.background, borderTopColor: colors.border }]}>
    {Platform.OS === 'ios' && <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />}
    {state.routes.map((route, index) => {
      const options = descriptors[route.key].options;
      const focused = state.index === index;
      const color = focused ? colors.primary : colors.mutedForeground;
      const label = options.tabBarAccessibilityLabel ?? options.title ?? route.name;
      return <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityLabel={label}
        accessibilityState={{ selected: focused }}
        aria-selected={Platform.OS === 'web' ? focused : undefined}
        onPress={() => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        }}
        onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
        style={styles.expandedTab}
      >
        {options.tabBarIcon?.({ focused, color, size: 24 })}
        <Text style={{ color, fontSize: 11, textAlign: 'center' }}>{label}</Text>
      </Pressable>;
    })}
  </View>;
}

function ClassicTabLayout() {
  const colors = useColors();
  const { t } = useLocale();
  const { preferences } = useStudy();
  const { shouldReflow: reflow, isExpandedTabLayout } = useTypographyLayout();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  // Tab labels are genuinely one-line controls. Let Dynamic Type grow them,
  // then fit within their allocated tab rather than clipping the label.
  const tabLabel = (title: string) => ({ color }: { color: ColorValue }) => (
    <NativeText
      allowFontScaling
      maxFontSizeMultiplier={0}
      dynamicTypeRamp={isIOS ? 'footnote' : undefined}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.8}
      style={{ width: '100%', textAlign: 'center', color, fontSize: typographyMetrics(11, undefined, preferences.textScale).fontSize * (isWeb ? devPreviewFontScale() ?? 1 : 1) }}
    >{title}</NativeText>
  );

  return (
    <Tabs
      tabBar={isExpandedTabLayout ? (props) => <AccessibleTabBar {...props} /> : undefined}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        // These screens already have full-width in-content titles; at Larger Text
        // the one-line navigation title would compete for space without adding context.
        headerShown: !reflow,
        headerTitleStyle: { fontSize: typographyMetrics(18, undefined, preferences.textScale).fontSize },
        tabBarLabelPosition: reflow ? 'below-icon' : undefined,
        tabBarHideOnKeyboard: isIOS && reflow,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : colors.background,
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isIOS && reflow ? { height: 64 + insets.bottom, paddingTop: 4, paddingBottom: insets.bottom } : {}),
          ...(isWeb && !isExpandedTabLayout ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={100}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.background },
              ]}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
           title: t('tabs.study'),
           headerShown: false,
             tabBarAccessibilityLabel: t('tabs.study'),
             tabBarLabel: reflow ? tabLabel(t('tabs.study')) : undefined,
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={24} />
            ) : (
              <Feather name="home" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen name="practice" options={{ title: t('tabs.practice'), tabBarAccessibilityLabel: t('tabs.practice'), tabBarLabel: reflow ? tabLabel(t('tabs.practice')) : undefined, tabBarIcon: ({ color }) => isIOS ? <SymbolView name="checkmark.circle" tintColor={color} size={24} /> : <Feather name="check-circle" size={22} color={color} /> }} />
      <Tabs.Screen name="missed" options={{ title: t('tabs.missed'), tabBarAccessibilityLabel: t('tabs.missed'), tabBarLabel: reflow ? tabLabel(t('tabs.missed')) : undefined, tabBarIcon: ({ color }) => isIOS ? <SymbolView name="arrow.counterclockwise" tintColor={color} size={24} /> : <Feather name="rotate-ccw" size={22} color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: t('tabs.progress'), tabBarAccessibilityLabel: t('tabs.progress'), tabBarLabel: reflow ? tabLabel(t('tabs.progress')) : undefined, tabBarIcon: ({ color }) => isIOS ? <SymbolView name="chart.bar" tintColor={color} size={24} /> : <Feather name="bar-chart-2" size={22} color={color} /> }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}

const styles = StyleSheet.create({
  expandedBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    zIndex: 1,
  },
  expandedTab: {
    width: '50%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});
