import type {DataMarker} from "./marker";
import type {Dayjs} from "dayjs";
import dayjs from "dayjs";



export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getEventCoords(e: MouseEvent | TouchEvent) {
  return "clientX" in e ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY];
}

export function toLatLng(location: GeoLocation): [number, number] {
  return [+location.latitudeE7/10000000, +location.longitudeE7/10000000];
}

export function findBounds(markers: DataMarker[]): DateRange {
  return markers.reduce(
    (acc, next) => {
      if (next.date.isBefore(acc.s)) acc.s = next.date;
      if (next.date.isAfter(acc.e)) acc.e = next.date;
      return acc;
    },
    {s: dayjs(), e: dayjs(0)},
  );
}

export function createFilter({s, e}: DateRange, selection: SliderSelection): DateRange {
  const span = e.valueOf() - s.valueOf();
  return {
    s: dayjs(s.valueOf() + span * selection.s),
    e: dayjs(s.valueOf() + span * selection.e)
  }
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
