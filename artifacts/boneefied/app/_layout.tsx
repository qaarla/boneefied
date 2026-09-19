import React, { useEffect } from 'react';
import { Text, TextInput } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Tinos_400Regular, Tinos_700Bold, useFonts } from '@expo-google-fonts/tinos';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StudyProvider } from '@/context/StudyContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Tinos_400Regular,
    Tinos_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);
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
          <GestureHandlerRootView>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
            </StudyProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
