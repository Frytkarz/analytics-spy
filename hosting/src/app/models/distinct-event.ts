import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Place } from '../../../../common/src/firebase/firestore/models/places/place';
import { Event } from '../../../../common/src/firebase/firestore/models/events/event';

export interface DistinctEvent {
    name: string;
    placeEvents: PlaceEvent[];
}

export interface PlaceEvent {
    events: Event<firebase.firestore.Timestamp, firebase.firestore.GeoPoint>[];
    place?: Place<firebase.firestore.GeoPoint>;
}
