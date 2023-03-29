interface ActivityType {
  type: string;
  confidence: number;
}

interface GeoActivity {
  timestampMs: string;
  activity: ActivityType[];
}

interface GeoLocation {
  timestampMs: string;
  latitudeE7: number;
  longitudeE7: number;
  accuracy: number;
  activity: GeoActivity[];
  source: string;
  deviceTag: number;
}

interface LocationData {
  locations: GeoLocation[];
}
