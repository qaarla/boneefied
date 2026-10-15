import type { CSSProperties } from 'react';
import { organicFiberSvg } from '../../../boneefied/components/organicFibers';

// Reuse the original family, not an additional decoration. An alpha mask lets
// the existing website ink follow its light/dark palette without recoloring art.
// Unsupported masks leave the original plain paper (no solid-color overlay).
const mask = `url("data:image/svg+xml,${encodeURIComponent(organicFiberSvg('#ffffff'))}")`;
const style = {
  maskImage: mask,
  WebkitMaskImage: mask,
} satisfies CSSProperties;

export function OrganicBackground() {
  return <div className="organic-background" aria-hidden="true" style={style} />;
}
