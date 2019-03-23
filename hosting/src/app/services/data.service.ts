import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../../../../common/src/firebase/firestore/models/events/event';
import { FSPath } from '../../../../common/src/firebase/firestore/fs-path';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { DistinctEvent } from '../models/distinct-event';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private firestore: AngularFirestore) { }

    subscribeEvents(from: firebase.firestore.Timestamp, eventName?: string): Observable<DistinctEvent[]> {
        return this.firestore.collection<Event<firebase.firestore.Timestamp, firebase.firestore.GeoPoint>>
            (FSPath.events(), ref => {
                let query = ref.where('timestamp', '>=', from);
                if (eventName !== undefined) {
                    query = query.where('name', '==', eventName);
                }
                return query;
            })
            .valueChanges().pipe(map(events => {
                const result: DistinctEvent[] = [];
                for (const e of events) {
                    let distinct = result.find(r => r.name === e.name);
                    if (distinct == null) {
                        distinct = {
                            name: e.name,
                            locationEvents: []
                        };
                        result.push(distinct);
                    }

                    const place = distinct.locationEvents.find(p => (p.location == null && e.location == null)
                        || (p.location && e.location && p.location.geoPoint.isEqual(e.location.geoPoint)));
                    if (place != null) {
                        place.events.push(e);
                    } else {
                        distinct.locationEvents.push({
                            events: [e],
                            location: e.location
                        });
                    }
                }

                return result;
            }));
    }
}
