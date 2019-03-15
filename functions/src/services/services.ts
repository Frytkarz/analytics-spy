import { Lazy } from "../../../common/src/typescript/utils/lazy";
import * as admin from 'firebase-admin';
import { EventsService } from "./events/events-service";
import { GeocoderHereApiService } from "./geocoder-here-api/geocoder-here-api-service";
import { environment } from "../environments/environment";


export class Services {
    private static _instance: Services;

    public static get instance(): Services {
        if (this._instance === undefined)
            this._instance = new Services();

        return this._instance;
    }

    private eventsInstance = new Lazy<EventsService>(() => new EventsService(() => this.geocoderHereApi));
    private geocoderHereApiInstance = new Lazy<GeocoderHereApiService>(() => new GeocoderHereApiService(environment.hereApi.app_id, environment.hereApi.app_code));

    public get events(): EventsService { return this.eventsInstance.value; }
    public get geocoderHereApi(): GeocoderHereApiService { return this.geocoderHereApiInstance.value; }

    private constructor() {
    }

    public init(): void {
        admin.initializeApp();
    }
}