import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';
import { useOptionalStudy } from '@/context/StudyContext';

/**
 * Returns the design tokens for the current color scheme.
 *
 * The returned object contains all color tokens for the active palette
 * plus scheme-independent values like `radius`.
 *
 * Falls back to the light palette when no dark key is defined in
 * constants/colors.ts (the scaffold ships light-only by default).
 * When a sibling web artifact's dark tokens are synced into a `dark`
 * key, this hook will automatically switch palettes based on the
 * device's appearance setting.
 */
export function useColors() {
  const systemScheme = useColorScheme();
  const study = useOptionalStudy();
  const preference = study?.preferences.theme ?? 'system';
  const scheme = preference === 'system' ? systemScheme : preference;
  const palette = scheme === 'dark' ? colors.dark : colors.light;
  // Opt-in ordinary reading copy only; existing UI/semantic tokens stay intact.
  // Dark copy retains its exact established foreground. Light charcoal is
  // checked against the darkest pixels of the existing anatomical material.
  return { ...palette, readingForeground: scheme === 'dark' ? palette.foreground : '#353535', radius: colors.radius };
}
