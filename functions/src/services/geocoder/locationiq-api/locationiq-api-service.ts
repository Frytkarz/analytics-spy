import * as request from 'request-promise-native';
import { IGeocoderService } from "../igeocoder-service";
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Search } from './models/search';
import * as StatusCodes from 'http-status-codes';

export class LocationIQApiService implements IGeocoderService {
    private baseUrl: string;

    public constructor(private key: string, version = '1') {
        this.baseUrl = `https://us1.locationiq.com/v${version}/`;
    }

    async getGeoPoint(info: functions.analytics.GeoInfo): Promise<admin.firestore.GeoPoint | null> {
        const options: request.Options = {
            uri: this.baseUrl + 'search.php',
            simple: false,
            resolveWithFullResponse: true,
            json: true,
            qs: {
                key: this.key,
                format: 'json',
                country: info.country,
                state: info.region,
                city: info.city
            }
        }

        const response: request.FullResponse = await request.get(options);
        if (response.statusCode !== StatusCodes.OK) {
            if (response.statusCode != StatusCodes.NOT_FOUND) {
                console.error(`LocationIQ API returned unexpected response with status=${response.statusCode} and body='${response.body}'.`)
            }
            return null;
        }

        const result: Search = response.body[0];
        return new admin.firestore.GeoPoint(Number(result.lat), Number(result.lon));
    }
}