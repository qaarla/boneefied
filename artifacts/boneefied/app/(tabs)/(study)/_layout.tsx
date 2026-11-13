import React from 'react';
import { Stack } from 'expo-router';
import { useColors } from '@/hooks/useColors';

// Direct links keep the library as the Study stack's root. All nested pages
// stay inside the existing four-tab navigator, on native and web alike.
export const unstable_settings = { initialRouteName: 'index' };

export default function StudyLayout() {
  const colors = useColors();
  return <Stack initialRouteName="index" screenOptions={{
    headerShown: false,
    // Disable before touch-down: toggling this after the viewer claims a drag
    // races iOS's interactive-pop recognizer. The dock's Up still navigates.
    gestureEnabled: false,
    fullScreenGestureEnabled: false,
    contentStyle: { backgroundColor: colors.background },
  }} />;
}
