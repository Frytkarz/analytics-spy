import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { PlacesService } from '../places/places-service';
import { Event } from '../../../../common/src/firebase/firestore/models/events/event';
import { FSPath } from '../../../../common/src/firebase/firestore/fs-path';

export class EventsService {
    public constructor(private places: () => PlacesService) {
    }

    public async handleEvent(event: functions.analytics.AnalyticsEvent) {
        let place = null;
        if (event.user !== undefined)
            place = await this.places().getPlace(event.user.geoInfo);
        const newEvent: Event<admin.firestore.Timestamp, admin.firestore.GeoPoint> = {
            name: event.name,
            timestamp: admin.firestore.Timestamp.fromDate(new Date(event.logTime)),
            place: place
        };
        await admin.firestore().collection(FSPath.events()).add(newEvent);
    }
}