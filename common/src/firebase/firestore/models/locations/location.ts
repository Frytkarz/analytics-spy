export interface Location<GeoPoint> {
    continent: string | null;
    country: string | null;
    region: string | null;
    city: string | null;
    geoPoint: GeoPoint;
    geocoder: string;
}