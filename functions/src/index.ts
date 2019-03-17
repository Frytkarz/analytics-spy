// ----------------------------------------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------------------------------------
import * as functions from 'firebase-functions';
import { Services } from './services/services';


// ----------------------------------------------------------------------------------------------------------
// Initialization
// ----------------------------------------------------------------------------------------------------------

Services.instance.init();


// ----------------------------------------------------------------------------------------------------------
// Analytics
// ----------------------------------------------------------------------------------------------------------

export const sessionStart = functions.analytics.event('session_start').onLog((event, context) => {
    return Services.instance.events.handleEvent(event);
});

export const firstOpen = functions.analytics.event('first_open').onLog((event, context) => {
    return Services.instance.events.handleEvent(event);
});