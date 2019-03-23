import { Location } from '../locations/location';

export interface Event<Timestamp, GeoPoint> {
    timestamp: Timestamp;
    name: string;
    location?: Location<GeoPoint> | null;
    params?: { [key: string]: string | number } | null;
    valueInUSD?: number;
}