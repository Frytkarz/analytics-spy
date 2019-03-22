import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export interface IGeocoderService {
    getGeoPoint(info: functions.analytics.GeoInfo): Promise<admin.firestore.GeoPoint | null>;
}
