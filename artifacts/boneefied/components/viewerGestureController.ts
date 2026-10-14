import { touchCenter, touchDistance, type TouchPoint } from './viewerGestureGeometry.ts';

export type ViewerTransform = { zoom: number; offset: { x: number; y: number } };
export type ViewerScene = { width: number; height: number; image: { x: number; y: number; width: number; height: number } };
export const VIEWER_DRAG_THRESHOLD = 6;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/** Bound the shared image/overlay transform and retain visible source content. */
export function constrainViewer(transform: ViewerTransform, scene: ViewerScene): ViewerTransform {
  const zoom = clamp(transform.zoom, 1, 4);
  if (zoom === 1) return { zoom, offset: { x: 0, y: 0 } };
  const axis = (offset: number, frame: number, start: number, size: number) => {
    if (frame <= 0 || size <= 0) return 0;
    const frameLimit = frame * (zoom - 1) / 2;
    const firstEdge = frame / 2 + (start - frame / 2) * zoom;
    const lastEdge = firstEdge + size * zoom;
    // An oversized image covers the viewport at either pan limit. A smaller
    // letterboxed axis may move inside the frame, but never disappear past it.
    const lower = size * zoom >= frame ? frame - lastEdge : -firstEdge;
    const upper = size * zoom >= frame ? -firstEdge : frame - lastEdge;
    const min = Math.max(-frameLimit, lower), max = Math.min(frameLimit, upper);
    return clamp(offset, Math.min(min, max), Math.max(min, max));
  };
  return { zoom, offset: {
    x: axis(transform.offset.x, scene.width, scene.image.x, scene.image.width),
    y: axis(transform.offset.y, scene.height, scene.image.y, scene.image.height),
  } };
}

/** Shared native/web state machine; touch-count changes rebase without jumping. */
export class ViewerGestureController {
  transform: ViewerTransform = { zoom: 1, offset: { x: 0, y: 0 } };
  active = false;
  owns = false;
  moved = false;
  count = 0;
  private origin = { x: 0, y: 0 };
  private focal = { x: 0, y: 0 };
  private base: ViewerTransform = this.transform;
  private distance = 0;
  private suppressUntil = 0;

  start(touches: ArrayLike<TouchPoint>, scene: ViewerScene, frameOrigin: { x: number; y: number }, now = Date.now()) {
    if (!touches.length) return;
    if (!this.active) {
      this.active = true;
      this.moved = false;
      this.suppressUntil = 0;
    } else if (touches.length === this.count) return;
    this.count = touches.length;
    this.origin = touchCenter(touches);
    this.focal = { x: this.origin.x - frameOrigin.x - scene.width / 2, y: this.origin.y - frameOrigin.y - scene.height / 2 };
    this.base = this.transform;
    this.distance = touchDistance(touches);
    this.owns ||= touches.length > 1 || this.transform.zoom > 1;
    if (touches.length > 1) { this.moved = true; this.suppressUntil = now + 400; }
  }

  move(touches: ArrayLike<TouchPoint>, scene: ViewerScene, frameOrigin: { x: number; y: number }, now = Date.now()) {
    if (!this.active || !touches.length) return this.transform;
    if (touches.length !== this.count) { this.start(touches, scene, frameOrigin, now); return this.transform; }
    const center = touchCenter(touches), dx = center.x - this.origin.x, dy = center.y - this.origin.y;
    if (Math.hypot(dx, dy) >= VIEWER_DRAG_THRESHOLD || touches.length > 1) this.moved = true;
    if (this.moved) this.suppressUntil = now + 400;
    if (!this.owns || !this.moved) return this.transform;
    const distance = touchDistance(touches);
    const zoom = clamp(this.base.zoom * (this.distance > 0 && distance > 0 ? distance / this.distance : 1), 1, 4);
    const ratio = zoom / this.base.zoom;
    this.transform = constrainViewer({ zoom, offset: {
      x: this.focal.x + (this.base.offset.x - this.focal.x) * ratio + dx,
      y: this.focal.y + (this.base.offset.y - this.focal.y) * ratio + dy,
    } }, scene);
    return this.transform;
  }

  end(now = Date.now()) {
    if (this.moved) this.suppressUntil = now + 400;
    this.active = false;
    this.owns = false;
    this.count = 0;
  }
  refreshFrameOrigin(scene: ViewerScene, frameOrigin: { x: number; y: number }) {
    // Native measurement is async. Correct a newly started gesture before its
    // first transform, never change its focal point mid-pinch.
    if (this.active && this.transform === this.base) {
      this.focal = { x: this.origin.x - frameOrigin.x - scene.width / 2, y: this.origin.y - frameOrigin.y - scene.height / 2 };
    }
  }
  canPress(now = Date.now()) { return !(this.active && this.moved) && now >= this.suppressUntil; }
  reset() {
    this.end();
    this.moved = false;
    this.suppressUntil = 0;
    this.transform = { zoom: 1, offset: { x: 0, y: 0 } };
    return this.transform;
  }
  changeZoom(amount: number, scene: ViewerScene) {
    this.transform = constrainViewer({ zoom: this.transform.zoom + amount, offset: this.transform.offset }, scene);
    return this.transform;
  }
}
