import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../../../../common/src/firebase/firestore/models/events/event';
import { FSPath } from '../../../../common/src/firebase/firestore/fs-path';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { DistinctEvent } from '../models/distinct-event';
import { KeyValue } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private firestore: AngularFirestore) { }

    subscribeEvents(): Observable<DistinctEvent[]> {
        return this.firestore.collection<Event<firebase.firestore.Timestamp, firebase.firestore.GeoPoint>>
            (FSPath.events(), ref => ref.where('timestamp', '>=', firebase.firestore.Timestamp.now()))
            .valueChanges().pipe(map(events => {
                const result: DistinctEvent[] = [];
                for (const e of events) {
                    let distinct = result.find(r => r.name === e.name);
                    if (distinct == null) {
                        distinct = {
                            name: e.name,
                            placeEvents: []
                        };
                        result.push(distinct);
                    }

                    const place = distinct.placeEvents.find(p => (p.place == null && e.place == null)
                        || (p.place && e.place && p.place.geoPoint.isEqual(e.place.geoPoint)));
                    if (place != null) {
                        place.events.push(e);
                    } else {
                        distinct.placeEvents.push({
                            events: [e],
                            place: e.place
                        });
                    }
                }

                return result;
            }));
    }
}
