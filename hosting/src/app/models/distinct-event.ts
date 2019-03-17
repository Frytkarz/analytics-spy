import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Location } from '../../../../common/src/firebase/firestore/models/locations/location';
import { Event } from '../../../../common/src/firebase/firestore/models/events/event';

export interface DistinctEvent {
    name: string;
    locationEvents: LocationEvent[];
}

export interface LocationEvent {
    events: Event<firebase.firestore.Timestamp, firebase.firestore.GeoPoint>[];
    location?: Location<firebase.firestore.GeoPoint>;
}
