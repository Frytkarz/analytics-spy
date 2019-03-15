import * as functions from 'firebase-functions';

import { Event } from '../../common/src/firebase/firestore/models/events/event'

export const exampleEvent = functions.analytics.event('my-fancy-event').onLog((event, context) => {
    const fsEvent: Event = {
        name: event.name,
        timestamp: event.logTime
    };
    console.log(fsEvent);
});