import { Platform } from 'react-native';
import { useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTypographyLayout } from '@/components/ScaledText';

/** Shared trailing scroll space for Screen and the nested study FlatLists. */
export function useDockClearance() {
  const insets = useSafeAreaInsets();
  const { shouldReflow, isExpandedTabLayout, systemFontScale } = useTypographyLayout();
  const segments = useSegments();
  const inDock = segments[0] === '(tabs)';
  return Platform.OS === 'web'
    ? inDock && isExpandedTabLayout ? 32 + 104 * Math.max(1, systemFontScale) : 126
    : insets.bottom + 104 * (shouldReflow ? Math.max(1, systemFontScale) : 1) + (Platform.OS === 'ios' && inDock ? 32 : 0);
}
