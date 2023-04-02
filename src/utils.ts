import dayjs from "dayjs";
import type {GeoLocation} from "./logic/parsing";
import type {DataMarker} from "./logic/marker";


export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getEventCoords(e: MouseEvent | TouchEvent) {
  return "clientX" in e ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY];
}

export function findBounds(locations: Immutable<GeoLocation[]>): DateRange {
  return locations.reduce(
    (acc, next) => {
      if (next.timestampMs.isBefore(acc.s)) acc.s = next.timestampMs;
      if (next.timestampMs.isAfter(acc.e)) acc.e = next.timestampMs;
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
  filter: Immutable<DateRange>,
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
