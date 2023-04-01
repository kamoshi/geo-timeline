import L from 'leaflet';
import type {GeoLocation} from "./logic/parsing";


export class DataMarker extends L.Marker {
  readonly #data: MarkerData;

  constructor(latLng: L.LatLngExpression, data: MarkerData, options?: L.MarkerOptions) {
    super(latLng, options);
    this.#data = {...data};
  }

  get date(): Dayjs {
    return this.#data.date;
  }

  static fromGeoLocations(locations: GeoLocation[]) {
    return locations.map(l => new DataMarker([l.latitudeE7, l.longitudeE7], {date: l.timestampMs}));
  }
}
