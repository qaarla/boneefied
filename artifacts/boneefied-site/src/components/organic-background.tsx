import type { CSSProperties } from 'react';
import { organicFiberSvg, ORGANIC_STRENGTH } from '../../../boneefied/components/organicFibers';

// Same original curves as native. Self-contained: no request, load handler,
// animation, or interactive/accessible descendants. CSS failure leaves paper.
const style = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(organicFiberSvg('#25282a'))}")`,
  opacity: ORGANIC_STRENGTH * 0.75,
} satisfies CSSProperties;

export function OrganicBackground() {
  return <div className="organic-background" aria-hidden="true" style={style} />;
}
