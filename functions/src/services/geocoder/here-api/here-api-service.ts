import { GeoCode } from "./models/geo-code";
import * as request from 'request-promise-native';
import { IGeocoderService } from "../igeocoder-service";
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export class HereApiService implements IGeocoderService {
    private baseUrl: string;

    public constructor(private appId: string, private appCode: string, version = '6.2') {
        this.baseUrl = `https://geocoder.api.here.com/${version}/`;
    }

    async getGeoPoint(info: functions.analytics.GeoInfo): Promise<admin.firestore.GeoPoint | null> {
        const options: request.Options = {
            uri: this.baseUrl + 'geocode.json',
            simple: false,
            resolveWithFullResponse: true,
            json: true,
            qs: {
                app_id: this.appId,
                app_code: this.appCode,
                country: info.country,
                state: info.region,
                city: info.city
            }
        }

        const response: request.FullResponse = await request.get(options);
        const geoCode: GeoCode = response.body;

        if (geoCode.Response.View && geoCode.Response.View.length > 0) {
            if (geoCode.Response.View.length > 1) {
                console.error(`Found more than one place via HereAPI with geoInfo='${JSON.stringify(info)}'.`);
            }

            const position = geoCode.Response.View[0].Result[0].Location.DisplayPosition;
            return new admin.firestore.GeoPoint(position.Latitude, position.Longitude);
        }
        return null;
    }
}