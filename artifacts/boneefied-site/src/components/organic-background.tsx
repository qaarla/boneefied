import type { CSSProperties } from 'react';
import { organicFiberSvg } from '../../../boneefied/components/organicFibers';

// One shared material, as an alpha mask so the existing ink follows both palettes.
// Unsupported masks leave the original plain paper (no solid-color overlay).
const mask = `url("data:image/svg+xml,${encodeURIComponent(organicFiberSvg('#ffffff'))}")`;
const style = {
  maskImage: mask,
  WebkitMaskImage: mask,
} satisfies CSSProperties;

// Cards, panels and the footer read the same mask through this custom property.
export const organicShellStyle = { '--organic-mask': mask } as CSSProperties;

export function OrganicBackground() {
  return <div className="organic-background" aria-hidden="true" style={style} />;
}
