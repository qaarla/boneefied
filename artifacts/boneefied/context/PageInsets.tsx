import React, { createContext, useContext } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context';
import { resolvePageTopInset } from './pageInsetsPolicy';

export { PAGE_CONTENT_TOP_GAP } from './pageInsetsPolicy';

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
  const { width } = useWindowDimensions();
  return {
    ...localInsets,
    top: resolvePageTopInset({
      windowTop: windowInsets?.top,
      localTop: localInsets.top,
      platform: Platform.OS,
      development: __DEV__,
      width,
    }),
  };
}
