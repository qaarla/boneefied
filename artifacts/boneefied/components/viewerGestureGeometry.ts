export type TouchPoint = { pageX: number; pageY: number };

/** Browser TouchList is indexed/array-like, not necessarily an Array. */
export function touchCenter(touches: ArrayLike<TouchPoint>) {
  if (!touches.length) throw new RangeError('A gesture needs at least one touch');
  let x = 0, y = 0;
  for (let i = 0; i < touches.length; i++) {
    x += touches[i].pageX;
    y += touches[i].pageY;
  }
  return { x: x / touches.length, y: y / touches.length };
}

export function touchDistance(touches: ArrayLike<TouchPoint>) {
  return touches.length > 1
    ? Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY) : 0;
}
