import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** Paint only: normalized to this plate, never used for hit testing or scoring. */
export function hasFittedPracticeHighlight(assetId: string | undefined, structureId: string) {
  return assetId === 'asset-commons-axial-skeleton-blank' && structureId === 'mandible';
}

export function PracticeSelectionHighlight({ width, height, left, top, color }: {
  width: number; height: number; left: number; top: number; color: string;
}) {
  return <Svg pointerEvents="none" testID="practice-fitted-highlight"
    width={width} height={height} viewBox="0 0 1000 1000" preserveAspectRatio="none"
    style={{ position: 'absolute', left, top }}>
    <Path
      d="M 400 145 C 403 164 405 181 419 191 C 433 202 450 207 470 207 C 492 207 519 197 534 181 C 542 172 546 157 548 145 L 529 150 C 527 169 522 178 509 183 C 487 191 454 191 435 182 C 425 177 423 164 422 150 Z"
      fill={color} fillOpacity={0.06} stroke={color} strokeOpacity={0.9}
      strokeWidth={1.25} vectorEffect="non-scaling-stroke"
      strokeLinejoin="round" strokeLinecap="round"
    />
  </Svg>;
}
