import * as functions from 'firebase-functions';
import { environment } from '../../environments/environment';
import { GeocoderHereApiService } from '../geocoder-here-api/geocoder-here-api-service';

export class EventsService {
    public constructor(private geocoderHereApi: () => GeocoderHereApiService) {
    }

    public async handleEvent(event: functions.analytics.AnalyticsEvent) {
        const geoCode = await this.geocoderHereApi().geocode((event.user && event.user.geoInfo.country) as string, (event.user && event.user.geoInfo.city) as string);
    }
}