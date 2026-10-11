import type { TextStyle } from 'react-native';

export const APP_FONTS = {
  regular: 'Tinos_400Regular',
  bold: 'Tinos_700Bold',
} as const;

/** Choose the bundled face, not a synthetic weight of the regular face.
 * Explicit non-Tinos families are reserved for compact overlays/diagnostics. */
export function appTypeface(style?: Pick<TextStyle, 'fontFamily' | 'fontWeight'>): Pick<TextStyle, 'fontFamily' | 'fontWeight'> {
  if (style?.fontFamily && style.fontFamily !== APP_FONTS.regular && style.fontFamily !== APP_FONTS.bold) {
    return { fontFamily: style.fontFamily };
  }
  const bold = style?.fontFamily === APP_FONTS.bold
    || style?.fontWeight === 'bold'
    || Number(style?.fontWeight ?? 400) >= 500;
  return { fontFamily: bold ? APP_FONTS.bold : APP_FONTS.regular, fontWeight: 'normal' };
}
