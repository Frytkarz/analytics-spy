import { Location } from '../locations/location';

export interface Event<Timestamp, GeoPoint> {
    timestamp: Timestamp;
    name: string;
    params?: { [key: string]: string | number } | null;
    location?: Location<GeoPoint> | null;
}