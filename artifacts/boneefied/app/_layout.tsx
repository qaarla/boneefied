import React, { useEffect, useMemo } from 'react';
import { Appearance, Platform, Text, TextInput, useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Tinos_400Regular, Tinos_700Bold, useFonts } from '@expo-google-fonts/tinos';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StudyProvider, useStudy } from '@/context/StudyContext';
import { typographyMetrics } from '@/context/typographyScale';
import { TypographyProvider } from '@/components/ScaledText';
import { useColors } from '@/hooks/useColors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { hydrated, preferences } = useStudy();
  const colors = useColors();
  const systemScheme = useColorScheme();
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
    if (hydrated) SplashScreen.hideAsync();
  }, [hydrated]);

  if (!hydrated) return null;

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{
        headerBackTitle: 'Back',
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.foreground, fontSize: typographyMetrics(18, undefined, preferences.textScale).fontSize },
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
    </SafeAreaProvider>
  );
}
