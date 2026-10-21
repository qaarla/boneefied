import React from 'react';
import { Stack } from 'expo-router';
import { Screen } from '@/components/Screen';

/** The persistent dock owns navigation; Screen owns the top safe-area inset. */
export function ModuleScreen({ title, children }: { title: string; children: React.ReactNode }) {
  return <>
    <Stack.Screen options={{ title, headerShown: false }} />
    <Screen systemHeading>{children}</Screen>
  </>;
}
