export type SceneRect = { x: number; y: number; width: number; height: number };

/** Include asymmetric annotations while keeping the actual image at center. */
export function imageCenteredSceneBounds(rects: SceneRect[], image: SceneRect): SceneRect[] {
  const cx = image.x + image.width / 2, cy = image.y + image.height / 2;
  const halfWidth = Math.max(image.width / 2, ...rects.flatMap(r => [Math.abs(r.x - cx), Math.abs(r.x + r.width - cx)]));
  const halfHeight = Math.max(image.height / 2, ...rects.flatMap(r => [Math.abs(r.y - cy), Math.abs(r.y + r.height - cy)]));
  return [{ x: cx - halfWidth, y: cy - halfHeight, width: halfWidth * 2, height: halfHeight * 2 }];
}

/** Fit the actual raster AND annotation hit boxes, without changing aspect. */
export function fitViewerScene(width: number, height: number, sceneWidth: number, sceneHeight: number, rects: SceneRect[], inset = 4) {
  if (width <= 0 || height <= 0 || sceneWidth <= 0 || sceneHeight <= 0 || !rects.length) {
    return { scale: 1, left: 0, top: 0, bounds: { x: 0, y: 0, width: 0, height: 0 } };
  }
  const left = Math.min(...rects.map(r => r.x));
  const top = Math.min(...rects.map(r => r.y));
  const right = Math.max(...rects.map(r => r.x + r.width));
  const bottom = Math.max(...rects.map(r => r.y + r.height));
  const w = Math.max(1, right - left), h = Math.max(1, bottom - top);
  // Never enlarge a scene at reset; zoom is a separate user action.
  const scale = Math.min(1, Math.max(1, width - inset * 2) / w, Math.max(1, height - inset * 2) / h);
  const x = (width - w * scale) / 2, y = (height - h * scale) / 2;
  return {
    scale,
    // React Native scales about the view center, not its top-left corner.
    left: x - left * scale - sceneWidth * (1 - scale) / 2,
    top: y - top * scale - sceneHeight * (1 - scale) / 2,
    bounds: { x, y, width: w * scale, height: h * scale },
  };
}

/** Project any source-space rectangle through the same centered fit as paint. */
export function fittedSceneRect(rect: SceneRect, sceneWidth: number, sceneHeight: number, fit: ReturnType<typeof fitViewerScene>): SceneRect {
  return {
    x: fit.left + sceneWidth * (1 - fit.scale) / 2 + rect.x * fit.scale,
    y: fit.top + sceneHeight * (1 - fit.scale) / 2 + rect.y * fit.scale,
    width: rect.width * fit.scale,
    height: rect.height * fit.scale,
  };
}

/** External numbered callouts must remain reachable, not just their raster. */
export function viewerPanBounds(image: SceneRect, sceneWidth: number, sceneHeight: number, fit: ReturnType<typeof fitViewerScene>, includeAnnotations = false): SceneRect {
  return includeAnnotations ? fit.bounds : fittedSceneRect(image, sceneWidth, sceneHeight, fit);
}
