import React, { createContext, useContext } from 'react';
import { useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context';

const PageInsetsContext = createContext<EdgeInsets | null>(null);

/** Capture window safe areas before nested navigators can consume their insets. */
export function PageInsetsProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return <PageInsetsContext.Provider value={insets}>{children}</PageInsetsContext.Provider>;
}

/** All page stacks are headerless; their content must clear the window's notch. */
export function usePageInsets() {
  const windowInsets = useContext(PageInsetsContext);
  const localInsets = useSafeAreaInsets();
  return { ...localInsets, top: Math.max(windowInsets?.top ?? 0, localInsets.top) };
}

// A comfortable reading gap after the actual, device-specific safe area.
export const PAGE_CONTENT_TOP_GAP = 32;
