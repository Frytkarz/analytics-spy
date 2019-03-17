import { Place } from '../places/place';

export interface Event<Timestamp, GeoPoint> {
    timestamp: Timestamp;
    name: string;
    params?: { [key: string]: string | number } | null;
    place?: Place<GeoPoint> | null;
}