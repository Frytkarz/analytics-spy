import { GeoCode } from "./models/geo-code";
import * as request from 'request-promise-native';
import { IGeocoderService } from "../igeocoder-service";
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as StatusCodes from 'http-status-codes';

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
        if (response.statusCode != StatusCodes.OK) {
            console.error(`Here API returned unexpected response with status=${response.statusCode} and body='${response.body}'.`)
            return null;
        }

        if (geoCode && geoCode.Response && geoCode.Response.View && geoCode.Response.View.length > 0) {
            const position = geoCode.Response.View[0].Result[0].Location.DisplayPosition;
            return new admin.firestore.GeoPoint(position.Latitude, position.Longitude);
        }
        return null;
    }
}