import * as RA from 'fp-ts/ReadonlyArray';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import type {GeoLocation} from "./parsing";


export function toBins(
  scope: Immutable<DateRange>,
  locations: Immutable<GeoLocation[]>
): number[] {
  const BINS = 20;
  const [s, e] = [scope.s.valueOf(), scope.e.valueOf()];
  const width = (e - s) / BINS;
  return pipe(
    locations,
    RA.map(loc => Math.floor((loc.timestampMs.valueOf() - s) / width)),
    RA.filter(n => n < BINS),
    RA.reduce(
      A.makeBy(BINS, () => 0),
      (acc, next) => (acc[next] += 1, acc)
    ),
  )
}
