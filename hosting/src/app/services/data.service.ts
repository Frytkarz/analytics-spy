import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../../../../common/src/firebase/firestore/models/events/event';
import { FSPath } from '../../../../common/src/firebase/firestore/fs-path';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private firestore: AngularFirestore) { }

    subscribeEvents(from: firebase.firestore.Timestamp, eventName?: string):
        Observable<Event<firebase.firestore.Timestamp, firebase.firestore.GeoPoint>[]> {
        return this.firestore.collection<Event<firebase.firestore.Timestamp, firebase.firestore.GeoPoint>>
            (FSPath.events(), ref => {
                let query = ref.where('timestamp', '>=', from);
                if (eventName !== undefined) {
                    query = query.where('name', '==', eventName);
                }
                return query;
            })
            .valueChanges();
    }
}
