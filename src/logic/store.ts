import {derived, writable} from 'svelte/store';
import dayjs from 'dayjs';
import {findBounds} from '../utils';
import {toBins} from './processing';
import type {GeoLocation} from './parsing';


/** Raw locations loaded via file input */
export const locations = writable<Immutable<GeoLocation[]>>([]);

/** Min/max date range derived from the loaded locations */
export const range = derived(
  locations,
  locations => findBounds(locations) as ImmutableReturn<typeof findBounds>
)

/** Histogram of locations by date */
export const histogram = derived(
  [locations, range],
  ([locations, range]) => toBins(range, locations) as ImmutableReturn<typeof toBins>
)

/** Filter used to filter displayed markers on map */
export const filter = writable<Immutable<DateRange>>({s: dayjs(0), e: dayjs()})
