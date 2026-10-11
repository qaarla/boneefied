import { useEffect, useRef, useState } from 'react';
import { AppState, PanResponder, Platform, type GestureResponderEvent, type View } from 'react-native';
import { ViewerGestureController, constrainViewer, type ViewerScene } from './viewerGestureController';
import type { TouchPoint } from './viewerGestureGeometry';
import { useViewerScrollOwnership } from './ViewerScrollOwnership';

export function useAnatomyViewerGesture(source?: number) {
  const controller = useRef(new ViewerGestureController()).current;
  const [transform, setTransform] = useState(controller.transform);
  const areaRef = useRef<View>(null);
  const scene = useRef<ViewerScene>({ width: 0, height: 0, image: { x: 0, y: 0, width: 0, height: 0 } });
  const frameOrigin = useRef({ x: 0, y: 0 });
  const measuredAtScrollY = useRef(0);
  const frame = useRef<number | undefined>(undefined);
  const owner = useRef(Symbol('anatomy-viewer')).current;
  const { setOwnership, getScrollY } = useViewerScrollOwnership();
  const live = useRef({ source, setOwnership, getScrollY });
  live.current = { source, setOwnership, getScrollY };
  const ignoreMouseUntil = useRef(0);
  const mouseActive = useRef(false);
  const syncOwnership = () => live.current.setOwnership(owner, controller.active && controller.owns);
  const currentOrigin = () => Platform.OS === 'web' ? frameOrigin.current : {
    x: frameOrigin.current.x,
    y: frameOrigin.current.y + measuredAtScrollY.current - live.current.getScrollY(),
  };
  const commit = () => {
    if (frame.current !== undefined) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = undefined;
      setTransform(controller.transform);
    });
  };
  const finish = () => { controller.end(); mouseActive.current = false; syncOwnership(); commit(); };
  const begin = (touches: ArrayLike<TouchPoint>) => {
    if (!live.current.source || !touches.length) return;
    controller.start(touches, scene.current, currentOrigin());
    syncOwnership();
  };
  const move = (touches: ArrayLike<TouchPoint>) => {
    controller.move(touches, scene.current, currentOrigin());
    syncOwnership();
    commit();
  };
  const measure = () => {
    areaRef.current?.measureInWindow((x, y) => {
      frameOrigin.current = { x, y };
      measuredAtScrollY.current = live.current.getScrollY();
      controller.refreshFrameOrigin(scene.current, currentOrigin());
    });
  };
  const reset = () => {
    if (frame.current !== undefined) { cancelAnimationFrame(frame.current); frame.current = undefined; }
    controller.reset();
    mouseActive.current = false;
    syncOwnership();
    setTransform(controller.transform);
  };
  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: (e) => !!live.current.source && e.nativeEvent.touches.length > 1,
    onMoveShouldSetPanResponderCapture: (e) => {
      begin(e.nativeEvent.touches); move(e.nativeEvent.touches);
      return controller.owns && controller.moved;
    },
    onPanResponderGrant: (e) => begin(e.nativeEvent.touches),
    onPanResponderMove: (e) => move(e.nativeEvent.touches),
    onPanResponderRelease: finish,
    onPanResponderTerminationRequest: () => !controller.owns,
    onPanResponderTerminate: finish,
    onShouldBlockNativeResponder: () => controller.owns,
  })).current;
  const nativeHandlers = {
    ...responder.panHandlers,
    onTouchStart: (e: GestureResponderEvent) => { measure(); begin(e.nativeEvent.touches); },
    onTouchEnd: (e: GestureResponderEvent) => e.nativeEvent.touches.length ? begin(e.nativeEvent.touches) : finish(),
    onTouchCancel: finish,
  };

  useEffect(() => {
    reset();
    if (Platform.OS !== 'web') {
      const subscription = AppState.addEventListener('change', (state) => { if (state !== 'active') finish(); });
      return () => {
        subscription.remove();
        controller.end(); live.current.setOwnership(owner, false);
        if (frame.current !== undefined) { cancelAnimationFrame(frame.current); frame.current = undefined; }
      };
    }
    // React's delegated touch listeners may be passive. Native DOM listeners
    // must cancel scrolling synchronously once pinch/zoom owns the gesture.
    const node = areaRef.current as unknown as HTMLElement | null;
    if (!node) return;
    const locate = () => {
      const rect = node.getBoundingClientRect();
      frameOrigin.current = { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
    };
    const touchStart = (e: TouchEvent) => {
      ignoreMouseUntil.current = Date.now() + 1000;
      locate(); begin(e.touches);
      if (controller.owns && e.touches.length > 1 && e.cancelable) e.preventDefault();
    };
    const touchMove = (e: TouchEvent) => {
      move(e.touches);
      if (controller.owns && controller.moved && e.cancelable) e.preventDefault();
    };
    const touchEnd = (e: TouchEvent) => {
      if (!controller.active) return;
      if (e.touches.length) begin(e.touches); else finish();
    };
    const touchCancel = () => { if (controller.active) finish(); };
    const mouseDown = (e: MouseEvent) => {
      if (e.button !== 0 || Date.now() < ignoreMouseUntil.current) return;
      locate(); mouseActive.current = true;
      begin([{ pageX: e.pageX, pageY: e.pageY }]);
    };
    const mouseMove = (e: MouseEvent) => {
      if (!mouseActive.current) return;
      if (!(e.buttons & 1)) { finish(); return; }
      move([{ pageX: e.pageX, pageY: e.pageY }]);
      if (controller.owns && controller.moved) e.preventDefault();
    };
    const mouseUp = () => { if (mouseActive.current) finish(); };
    const dragStart = (e: Event) => e.preventDefault();
    node.addEventListener('touchstart', touchStart, { passive: false });
    node.addEventListener('touchmove', touchMove, { passive: false });
    node.addEventListener('touchend', touchEnd);
    node.addEventListener('touchcancel', finish);
    node.addEventListener('mousedown', mouseDown);
    node.addEventListener('dragstart', dragStart);
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);
    window.addEventListener('blur', finish);
    // A pinch can finish on a finger that started outside this element.
    // Capture ensures delegated child handlers cannot leave the lease stuck.
    window.addEventListener('touchend', touchEnd, true);
    window.addEventListener('touchcancel', touchCancel, true);
    return () => {
      node.removeEventListener('touchstart', touchStart);
      node.removeEventListener('touchmove', touchMove);
      node.removeEventListener('touchend', touchEnd);
      node.removeEventListener('touchcancel', finish);
      node.removeEventListener('mousedown', mouseDown);
      node.removeEventListener('dragstart', dragStart);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
      window.removeEventListener('blur', finish);
      window.removeEventListener('touchend', touchEnd, true);
      window.removeEventListener('touchcancel', touchCancel, true);
      controller.end(); live.current.setOwnership(owner, false);
      if (frame.current !== undefined) { cancelAnimationFrame(frame.current); frame.current = undefined; }
    };
    // Gesture callbacks deliberately use live refs, not captured render state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, controller, owner]);

  const webHandlers = {
    onMoveShouldSetResponderCapture: () => controller.owns && controller.moved,
    onResponderTerminationRequest: () => !controller.owns,
    onResponderTerminate: finish,
  };
  const updateScene = (next: ViewerScene) => {
    scene.current = next;
    const bounded = constrainViewer(controller.transform, next);
    if (bounded.offset.x !== controller.transform.offset.x || bounded.offset.y !== controller.transform.offset.y) {
      controller.transform = bounded; commit();
    }
  };
  return { ...transform, areaRef, updateScene, reset, measure,
    canPress: () => controller.canPress(),
    changeZoom: (amount: number) => { controller.changeZoom(amount, scene.current); commit(); },
    handlers: Platform.OS === 'web' ? webHandlers : nativeHandlers,
    webStyle: Platform.OS === 'web' ? { touchAction: transform.zoom > 1 ? 'none' : 'pan-y', userSelect: 'none' as const } : undefined,
  };
}
