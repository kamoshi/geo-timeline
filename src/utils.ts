import type {DataMarker} from "./marker";
import type {Dayjs} from "dayjs";


export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getEventCoords(e: MouseEvent | TouchEvent) {
  return "clientX" in e ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY];
}

export function toLatLng(location: GeoLocation): [number, number] {
  return [+location.latitudeE7/10000000, +location.longitudeE7/10000000];
}

export function filterMarkers(
  filter: {s: Dayjs, e: Dayjs},
  markers: DataMarker[],
): {show: DataMarker[]; hide: DataMarker[]} {
  const show: DataMarker[] = [];
  const hide: DataMarker[] = [];

  for (const marker of markers) {
    marker.date.isBefore(filter.s, 'day') || marker.date.isAfter(filter.e, 'day')
      ? hide.push(marker)
      : show.push(marker);
  }

  return {show, hide};
}
