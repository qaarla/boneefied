/** Background-only copies; originals remain the geometry and provenance source.
 * Vector plates and scientific photos are deliberately not recolored.
 */
const canvasCopies = new Map<number, number>([
  [require('@/assets/images/anatomy/original-cell-overview.png'), require('@/assets/images/anatomy/soft-canvas/original-cell-overview.png')],
  [require('@/assets/images/anatomy/original-anatomical-planes.png'), require('@/assets/images/anatomy/soft-canvas/original-anatomical-planes.png')],
  [require('@/assets/images/anatomy/gray111-vertebral-column.png'), require('@/assets/images/anatomy/soft-canvas/gray111-vertebral-column.png')],
]);

export function atlasCanvasRasterSource(source?: number): number | undefined {
  return source === undefined ? undefined : canvasCopies.get(source) ?? source;
}
