// ----------------------------------------------------------------------------------------------------------
// Imports
// ----------------------------------------------------------------------------------------------------------
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Services } from './services/services';
import { environment } from './environments/environment';
import { config } from '../../common/src/config/config';


// ----------------------------------------------------------------------------------------------------------
// Initialization
// ----------------------------------------------------------------------------------------------------------

Services.instance.init();


// ----------------------------------------------------------------------------------------------------------
// Analytics
// ----------------------------------------------------------------------------------------------------------

for (const eventName of Object.keys(config.events)) {
    exports[eventName] = functions.runWith({ memory: '128MB' }).analytics.event(eventName).onLog((event, context) => {
        return Services.instance.events.handleEvent(event);
    });
}

// ----------------------------------------------------------------------------------------------------------
// Https
// ----------------------------------------------------------------------------------------------------------

export const clearevents = functions.https.onRequest(async (req, res) => {
    if (req.query.apikey !== environment.apiKey) {
        res.status(401).send();
        return;
    }

    const timestamp = admin.firestore.Timestamp.fromMillis(
        req.query.olderthanmillis != undefined
            ? req.query.olderthanmillis
            : admin.firestore.Timestamp.now().toMillis() - 24 * 60 * 60 * 1000);

    try {
        await Services.instance.events.clearEvents(timestamp);
        res.status(200).send();
    } catch (e) {
        console.error('Error occured while clearing old events', e);
        res.status(500).send(e);
    }
});