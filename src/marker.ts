import dayjs from "dayjs";
import L from 'leaflet';
import {toLatLng} from "./utils";
import type {GeoLocation} from "./logic/validation";


export class DataMarker extends L.Marker {
  readonly #data: MarkerData;

  constructor(latLng: L.LatLngExpression, data: MarkerData, options?: L.MarkerOptions) {
    super(latLng, options);
    this.#data = {...data};
  }

  get date(): dayjs.Dayjs {
    return this.#data.date;
  }

  static fromGeoLocations(locations: GeoLocation[]) {
    return locations.map(l => new DataMarker(toLatLng(l), {date: dayjs(+l.timestampMs)}));
  }
}
