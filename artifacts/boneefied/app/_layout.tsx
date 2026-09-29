import React, { useEffect, useMemo } from 'react';
import { Appearance, Platform, Text, TextInput, useColorScheme, useWindowDimensions } from 'react-native';
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
         headerBackTitle: t('navigation.back'),
        headerBackButtonDisplayMode: Platform.OS === 'ios' && reflow ? 'minimal' : 'default',
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.foreground, fontSize: Platform.OS === 'ios' || (Platform.OS === 'web' && devPreviewFontScale() !== undefined)
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

  useEffect(() => {
    if (fontsLoaded) {
      (Text as any).defaultProps = { ...(Text as any).defaultProps, style: [{ fontFamily: 'Tinos_400Regular' }, (Text as any).defaultProps?.style] };
      (TextInput as any).defaultProps = { ...(TextInput as any).defaultProps, style: [{ fontFamily: 'Tinos_400Regular' }, (TextInput as any).defaultProps?.style] };
    }
  }, [fontsLoaded]);

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
