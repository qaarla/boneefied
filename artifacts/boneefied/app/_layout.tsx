import React, { useEffect, useMemo } from 'react';
import { Appearance, Platform, StyleSheet, View, useColorScheme, useWindowDimensions } from 'react-native';
import { OrganicSurface } from '@/components/OrganicBackground';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Tinos_400Regular, Tinos_700Bold, useFonts } from '@expo-google-fonts/tinos';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StudyProvider, useStudy } from '@/context/StudyContext';
import { nativeHeaderTitleSize, needsResponsiveTextLayout, typographyMetrics } from '@/context/typographyScale';
import { devPreviewFontScale, TypographyProvider } from '@/components/ScaledText';
import { useColors } from '@/hooks/useColors';
import { APP_FONTS } from '@/context/typeface';
import { LocaleProvider, useLocale } from '@/locales/useLocale';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { hydrated, preferences } = useStudy();
  const { hydrated: localeHydrated, t } = useLocale();
  const colors = useColors();
  const systemScheme = useColorScheme();
  const { width, fontScale: reportedFontScale } = useWindowDimensions();
  const fontScale = devPreviewFontScale() ?? reportedFontScale;
  const reflow = needsResponsiveTextLayout(width, fontScale, preferences.textScale);
  const isDark = preferences.theme === 'dark' || (preferences.theme === 'system' && systemScheme === 'dark');
  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      fonts: {
        regular: { fontFamily: APP_FONTS.regular, fontWeight: 'normal' as const },
        medium: { fontFamily: APP_FONTS.bold, fontWeight: 'normal' as const },
        bold: { fontFamily: APP_FONTS.bold, fontWeight: 'normal' as const },
        heavy: { fontFamily: APP_FONTS.bold, fontWeight: 'normal' as const },
      },
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.background,
        text: colors.foreground,
        border: colors.border,
        notification: colors.primary,
      },
    };
  }, [isDark, colors.primary, colors.background, colors.foreground, colors.border]);
  useEffect(() => {
    // iOS glass header controls follow native appearance, not just navigation colors.
    if (Platform.OS === 'ios' && hydrated) {
      Appearance.setColorScheme(preferences.theme === 'system' ? 'unspecified' : preferences.theme);
    }
  }, [hydrated, preferences.theme]);
  useEffect(() => {
    if (hydrated && localeHydrated) SplashScreen.hideAsync();
  }, [hydrated, localeHydrated]);

  if (!hydrated || !localeHydrated) return null;

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{
        // The full, accessible heading lives in the page content. Keep only
        // navigation controls here, never a second title under the camera.
        headerTitle: () => null,
         headerBackTitle: t('navigation.back'),
        headerBackButtonDisplayMode: Platform.OS === 'ios' && reflow ? 'minimal' : 'default',
        headerStyle: { backgroundColor: colors.background },
        headerBackground: () => <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}><OrganicSurface /></View>,
        headerTintColor: colors.primary,
        headerBackTitleStyle: { fontFamily: APP_FONTS.bold },
        headerTitleStyle: { fontFamily: APP_FONTS.bold, fontWeight: 'normal', color: colors.foreground, fontSize: Platform.OS === 'ios' || (Platform.OS === 'web' && devPreviewFontScale() !== undefined)
          ? nativeHeaderTitleSize(18, preferences.textScale, fontScale)
          : typographyMetrics(18, undefined, preferences.textScale).fontSize },
        headerShadowVisible: false,
        statusBarStyle: isDark ? 'light' : 'dark',
        contentStyle: { backgroundColor: colors.background },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Tinos_400Regular,
    Tinos_700Bold,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <LocaleProvider>
       <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <StudyProvider>
              <TypographyProvider>
                <GestureHandlerRootView>
                  <KeyboardProvider>
                    <RootLayoutNav />
                  </KeyboardProvider>
                </GestureHandlerRootView>
              </TypographyProvider>
            </StudyProvider>
        </QueryClientProvider>
       </ErrorBoundary>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
