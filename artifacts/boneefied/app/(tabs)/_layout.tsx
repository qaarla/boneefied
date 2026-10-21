import { OrganicSurface } from '@/components/OrganicBackground';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text as NativeText, useColorScheme, View, type ColorValue } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { useStudy } from '@/context/StudyContext';
import { devPreviewFontScale, Text, useTypographyLayout } from '@/components/ScaledText';
import { typographyMetrics } from '@/context/typographyScale';
import { APP_FONTS } from '@/context/typeface';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { TabHierarchyProvider, useTabHierarchy } from '@/context/TabHierarchy';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocale } from '@/locales/useLocale';

// IMPORTANT: iOS 26 uses NativeTabs for native tabs with liquid glass support.
// iOS owns the liquid glass material. Supported icon and label options follow
// the same Boneefied-colored dock reference as the classic fallback.
export const unstable_settings = { initialRouteName: '(study)' };

function NativeTabLayout() {
  const { t } = useLocale();
  const { up } = useTabHierarchy();
  const colors = useColors();
  return (
    <NativeTabs
      tintColor={colors.primary}
      iconColor={{ default: colors.foreground, selected: colors.primary }}
      backgroundColor={colors.background + 'D9'}
      labelStyle={{
        default: { fontFamily: APP_FONTS.bold, fontSize: 13, fontWeight: 'normal', color: colors.foreground },
        selected: { fontFamily: APP_FONTS.bold, fontSize: 13, fontWeight: 'normal', color: colors.primary },
      }}
    >
         <NativeTabs.Trigger name="(study)" disablePopToTop disableScrollToTop listeners={({ navigation }) => ({
           tabPress: () => { if (navigation.isFocused()) up('study'); },
         })}>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
        />
         <NativeTabs.Trigger.Label>{t('tabs.study')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="practice" disablePopToTop disableScrollToTop listeners={({ navigation }) => ({
        tabPress: () => { if (navigation.isFocused()) up('practice'); },
      })}>
        <NativeTabs.Trigger.Icon sf={{ default: 'clipboard', selected: 'clipboard.fill' }} />
        <NativeTabs.Trigger.Label>{t('tabs.practice')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="missed" disablePopToTop disableScrollToTop listeners={({ navigation }) => ({
        tabPress: () => { if (navigation.isFocused()) up('missed'); },
      })}>
        <NativeTabs.Trigger.Icon sf={{ default: 'arrow.counterclockwise', selected: 'arrow.counterclockwise.circle.fill' }} />
        <NativeTabs.Trigger.Label>{t('tabs.missed')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="progress" disablePopToTop disableScrollToTop listeners={({ navigation }) => ({
        tabPress: () => { if (navigation.isFocused()) up('progress'); },
      })}>
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
  return <View style={[styles.expandedBar, { paddingBottom: insets.bottom, backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.background + 'E6', borderTopColor: 'transparent' }]}>
    {Platform.OS === 'ios' && <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />}
    <OrganicSurface />
    {state.routes.map((route, index) => {
      const options = descriptors[route.key].options;
      const focused = state.index === index;
      const color = focused ? colors.primary : colors.foreground;
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
        {options.tabBarIcon?.({ focused, color, size: 28 })}
        <Text style={{ color, fontSize: 13, fontFamily: APP_FONTS.bold, textAlign: 'center' }}>{label}</Text>
      </Pressable>;
    })}
  </View>;
}

function ClassicTabLayout() {
  const colors = useColors();
  const { up } = useTabHierarchy();
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
      style={{ width: '100%', textAlign: 'center', color, fontFamily: APP_FONTS.bold, fontWeight: 'normal', fontSize: typographyMetrics(13, undefined, preferences.textScale).fontSize * (isWeb ? devPreviewFontScale() ?? 1 : 1) }}
    >{title}</NativeText>
  );

  return (
    <Tabs
      screenListeners={({ navigation, route }) => ({
        tabPress: (event) => {
          if (!navigation.isFocused()) return; // Normal section switch; never reset it.
          event.preventDefault(); // Prevent React Navigation's automatic pop-to-root.
          up(route.name === '(study)' ? 'study' : route.name as 'practice' | 'missed' | 'progress');
        },
      })}
      tabBar={isExpandedTabLayout ? (props) => <AccessibleTabBar {...props} /> : undefined}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.foreground,
        // These screens already have full-width in-content titles; at Larger Text
        // the one-line navigation title would compete for space without adding context.
        headerShown: false,
        headerTitleStyle: { fontFamily: APP_FONTS.bold, fontWeight: 'normal', fontSize: typographyMetrics(18, undefined, preferences.textScale).fontSize },
        tabBarLabelStyle: { fontFamily: APP_FONTS.bold, fontWeight: 'normal', fontSize: 13 },
        tabBarIconStyle: { width: 32, height: 32 },
        tabBarLabelPosition: reflow ? 'below-icon' : undefined,
        tabBarHideOnKeyboard: isIOS && reflow,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS || isWeb ? 'transparent' : colors.background + 'E6',
          borderTopWidth: 0,
          elevation: 0,
          height: 72 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 8),
          ...(isIOS && reflow ? { height: 72 + insets.bottom, paddingTop: 6, paddingBottom: insets.bottom } : {}),
          ...(isWeb && !isExpandedTabLayout ? { height: 92, paddingTop: 6 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={60}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            ><OrganicSurface /></BlurView>
          ) : isWeb ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.background + 'E6' },
              ]}
            ><OrganicSurface /></View>
          ) : <View style={StyleSheet.absoluteFill}><OrganicSurface /></View>,
        headerBackground: () => <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}><OrganicSurface /></View>,
      }}
    >
      <Tabs.Screen
        name="(study)"
        options={{
           title: t('tabs.study'),
           headerShown: false,
             tabBarAccessibilityLabel: t('tabs.study'),
             tabBarLabel: reflow ? tabLabel(t('tabs.study')) : undefined,
          tabBarIcon: ({ color, focused }) =>
            isIOS ? (
              <SymbolView name={focused ? "house.fill" : "house"} tintColor={color} size={28} />
            ) : (
              <Ionicons name={focused ? "home" : "home-outline"} size={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen name="practice" options={{ title: t('tabs.practice'), tabBarAccessibilityLabel: t('tabs.practice'), tabBarLabel: reflow ? tabLabel(t('tabs.practice')) : undefined, tabBarIcon: ({ color, focused }) => isIOS ? <SymbolView name={focused ? "clipboard.fill" : "clipboard"} tintColor={color} size={28} /> : <Ionicons name={focused ? "clipboard" : "clipboard-outline"} size={28} color={color} /> }} />
      <Tabs.Screen name="missed" options={{ title: t('tabs.missed'), tabBarAccessibilityLabel: t('tabs.missed'), tabBarLabel: reflow ? tabLabel(t('tabs.missed')) : undefined, tabBarIcon: ({ color, focused }) => isIOS ? <SymbolView name={focused ? "arrow.counterclockwise.circle.fill" : "arrow.counterclockwise"} tintColor={color} size={28} /> : <Ionicons name={focused ? "refresh-circle" : "refresh-outline"} size={28} color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: t('tabs.progress'), headerShown: false, tabBarAccessibilityLabel: t('tabs.progress'), tabBarLabel: reflow ? tabLabel(t('tabs.progress')) : undefined, tabBarIcon: ({ color, focused }) => isIOS ? <SymbolView name={focused ? "chart.bar.fill" : "chart.bar"} tintColor={color} size={28} /> : <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={28} color={color} /> }} />
    </Tabs>
  );
}

export default function TabLayout() {
  return <TabHierarchyProvider>
    {isLiquidGlassAvailable() ? <NativeTabLayout /> : <ClassicTabLayout />}
  </TabHierarchyProvider>;
}

const styles = StyleSheet.create({
  expandedBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 0,
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
