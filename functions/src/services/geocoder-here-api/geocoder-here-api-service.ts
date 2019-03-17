import { GeoCode } from "./models/geo-code";
import * as request from 'request-promise-native';

export class GeocoderHereApiService {
    private baseUrl: string;

    public constructor(private appId: string, private appCode: string, version = '6.2') {
        this.baseUrl = `https://geocoder.api.here.com/${version}/`;
    }

    public async geocode(searchtext: string): Promise<GeoCode> {
        const options: request.Options = {
            uri: this.baseUrl + 'geocode.json',
            simple: false,
            resolveWithFullResponse: true,
            json: true,
            qs: {
                app_id: this.appId,
                app_code: this.appCode,
                searchtext: searchtext
            }
        }

        const response: request.FullResponse = await request.get(options);
        return response.body;
    }
}