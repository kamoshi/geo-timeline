export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getEventCoords(e: MouseEvent | TouchEvent) {
  return "clientX" in e ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY];
}
