import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { LocationsService } from '../locations/locations-service';
import { Event } from '../../../../common/src/firebase/firestore/models/events/event';
import { FSPath } from '../../../../common/src/firebase/firestore/fs-path';
import { config } from '../../../../common/src/config/config';

export class EventsService {
    public constructor(private locations: () => LocationsService) {
    }

    public async handleEvent(event: functions.analytics.AnalyticsEvent) {
        let location = null;
        if (event.user !== undefined)
            location = await this.locations().getLocation(event.user.geoInfo);
        const newEvent: Event<admin.firestore.Timestamp, admin.firestore.GeoPoint> = {
            name: event.name,
            timestamp: admin.firestore.Timestamp.fromDate(new Date(event.logTime)),
            location: location
        };

        // params
        const eventConfig = config.events[event.name];
        if (eventConfig.valueInUSD != undefined) {
            newEvent.valueInUSD = event.valueInUSD;
        }
        if (eventConfig.params != undefined) {
            newEvent.params = {};
            for (const param of Object.keys(eventConfig.params)) {
                newEvent.params[param] = event.params[param];
            }
        }

        await admin.firestore().collection(FSPath.events()).add(newEvent);
    }

    public async clearEvents(olderThan: admin.firestore.Timestamp) {
        const snap = await admin.firestore().collection(FSPath.events()).where('timestamp', '<', olderThan).get();
        console.info(`Removing ${snap.size} events that is older than timestamp ${olderThan.seconds} (seconds).`);
        let batch = admin.firestore().batch();

        for (let i = 0; i < snap.size; i++) {
            batch.delete(snap.docs[i].ref);

            // commit every 500 operations, because of limitation
            if ((i + 1) % 500 === 0) {
                await batch.commit();
                batch = admin.firestore().batch();
            }
        }

        await batch.commit();
    }
}