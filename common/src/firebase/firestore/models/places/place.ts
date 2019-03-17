export interface Place<GeoPoint> {
    city?: string | null;
    country: string;
    geoPoint: GeoPoint;
}