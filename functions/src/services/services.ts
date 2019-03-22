import { Lazy } from "../../../common/src/typescript/utils/lazy";
import { Multiton } from "../../../common/src/typescript/utils/multiton";
import * as admin from 'firebase-admin';
import { EventsService } from "./events/events-service";
import { HereApiService } from "./geocoder/here-api/here-api-service";
import { environment } from "../environments/environment";
import { LocationsService } from "./locations/locations-service";
import { IGeocoderService } from "./geocoder/igeocoder-service";


export class Services {
    private static _instance: Services;

    public static get instance(): Services {
        if (this._instance === undefined)
            this._instance = new Services();

        return this._instance;
    }

    private eventsInstance = new Lazy<EventsService>(() => new EventsService(() => this.places));
    private placesInstance = new Lazy<LocationsService>(() => new LocationsService(() => this.geocoders));

    public get events(): EventsService { return this.eventsInstance.value; }
    public get places(): LocationsService { return this.placesInstance.value; }


    public geocoders = new Multiton<IGeocoderService>({
        here: () => new HereApiService(environment.geocoderHereApi.app_id, environment.geocoderHereApi.app_code)
    })

    private constructor() {
    }

    public init(): void {
        admin.initializeApp();
    }
}