import * as RA from 'fp-ts/ReadonlyArray';
import * as A from 'fp-ts/Array';
import {pipe} from 'fp-ts/function';
import type {GeoLocation} from "./parsing";


export function toBins(
  scope: Immutable<DateRange>,
  locations: Immutable<GeoLocation[]>
) {
  const BINS = 100;
  const [s, e] = [scope.s.valueOf(), scope.e.valueOf()];
  const width = (e - s) / BINS;
  const bins = pipe(
    locations,
    RA.map(loc => Math.floor((loc.timestampMs.valueOf() - s) / width)),
    RA.takeLeftWhile(n => n < BINS),
    RA.reduce(
      A.makeBy(BINS, () => 0),
      (acc, next) => (acc[next] += 1, acc)
    ),
    A.map(count => ({count, normalized: count / (locations.length || 1)})),
  )
  const max = bins.reduce((acc, next) => Math.max(acc, next.normalized), 0);
  return bins.map(bin => ({...bin, scaled: bin.normalized / max || 0}))
}
