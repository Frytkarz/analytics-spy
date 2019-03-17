import * as admin from 'firebase-admin';
import { Place } from '../../../../common/src/firebase/firestore/models/places/place';
import { FSPath } from '../../../../common/src/firebase/firestore/fs-path';
import { GeocoderHereApiService } from "../geocoder-here-api/geocoder-here-api-service";
const hash = require('object-hash');

export class PlacesService {
    public constructor(private geocoderHereApi: () => GeocoderHereApiService) {
    }

    public async getPlace(country: string, city?: string): Promise<Place<admin.firestore.GeoPoint> | null> {
        if (country == null || country === '') {
            console.error('Could not get place because country is null.')
            return null;
        }

        let place: Place<admin.firestore.GeoPoint> | null = null;
        const collection = admin.firestore().collection(FSPath.places());
        await admin.firestore().runTransaction(async t => {
            const snap = await t.get(collection.where('country', '==', country).where('city', '==', city || null));
            if (!snap.empty) {
                place = snap.docs[0].data() as Place<admin.firestore.GeoPoint>;
                if (snap.size > 1) {
                    console.error(`Found more than one place in firestore with country='${country}' and city='${city}'.`);
                }
            } else {
                const geoCode = await this.geocoderHereApi().geocode(country, city);
                if (geoCode.Response.View.length > 0) {
                    const position = geoCode.Response.View[0].Result[0].Location.DisplayPosition;
                    place = {
                        city: city || null,
                        country: country,
                        geoPoint: new admin.firestore.GeoPoint(position.Latitude, position.Longitude)
                    };
                    await t.set(collection.doc(hash(place)), place);

                    if (geoCode.Response.View.length > 1) {
                        console.error(`Found more than one place via HereAPI with country='${country}' and city='${city}'.`);
                    }
                } else {
                    console.error(`Could not find place via HereAPI with country='${country}' and city='${city}'.`);
                }
            }
        });

        return place;
    }
}