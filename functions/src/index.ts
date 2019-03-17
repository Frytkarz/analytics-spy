// ----------------------------------------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------------------------------------
import * as functions from 'firebase-functions';
import { Services } from './services/services';
import { environment } from './environments/environment';


// ----------------------------------------------------------------------------------------------------------
// Initialization
// ----------------------------------------------------------------------------------------------------------

Services.instance.init();


// ----------------------------------------------------------------------------------------------------------
// Analytics
// ----------------------------------------------------------------------------------------------------------

for (const eventName of environment.events) {
    exports[eventName] = functions.analytics.event(eventName).onLog((event, context) => {
        return Services.instance.events.handleEvent(event);
    });
}