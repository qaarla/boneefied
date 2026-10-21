// Space below the safe area, not a substitute for the safe area itself.
export const PAGE_CONTENT_TOP_GAP = 40;
export const IPHONE_PREVIEW_SAFE_TOP = 59;

/**
 * A desktop browser inside the compact phone preview has no hardware notch:
 * CSS safe-area insets can be zero even though the surrounding frame has an
 * island. Simulate that inset only for the development phone-sized web view.
 * Native builds always retain the real device measurement.
 */
export function resolvePageTopInset({
  windowTop = 0,
  localTop,
  platform,
  development,
  width,
}: {
  windowTop?: number;
  localTop: number;
  platform: string;
  development: boolean;
  width: number;
}) {
  const compactPhonePreview = development && platform === 'web' && width > 0 && width <= 600;
  return Math.max(windowTop, localTop, compactPhonePreview ? IPHONE_PREVIEW_SAFE_TOP : 0);
}
