import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Location } from '../../../../common/src/firebase/firestore/models/locations/location';
import { FSPath } from '../../../../common/src/firebase/firestore/fs-path';
import { StringUtils } from '../../../../common/src/typescript/utils/string-utils';
import { GeocoderHereApiService } from "../geocoder-here-api/geocoder-here-api-service";
const hash = require('object-hash');

export class LocationsService {
    public constructor(private geocoderHereApi: () => GeocoderHereApiService) {
    }

    public async getLocation(info: functions.analytics.GeoInfo): Promise<Location<admin.firestore.GeoPoint> | null> {
        if (StringUtils.isNullOrEmpty(info.continent)
            && StringUtils.isNullOrEmpty(info.country)
            && StringUtils.isNullOrEmpty(info.region)
            && StringUtils.isNullOrEmpty(info.city)) {
            console.error('Could not get place because geo info does not contain any info.')
            return null;
        }

        let location: Location<admin.firestore.GeoPoint> | null = null;
        const collection = admin.firestore().collection(FSPath.places());
        await admin.firestore().runTransaction(async t => {
            const snap = await t.get(collection
                .where('continent', '==', info.continent || null)
                .where('country', '==', info.country || null)
                .where('region', '==', info.region || null)
                .where('city', '==', info.city || null));
            if (!snap.empty) {
                location = snap.docs[0].data() as Location<admin.firestore.GeoPoint>;
                if (snap.size > 1) {
                    console.error(`Found more than one place in firestore with geoInfo='${JSON.stringify(info)}'.`);
                }
            } else {
                const search = StringUtils.excludeNullsOrEmpties(info.continent, info.country, info.region, info.city);
                const geoCode = await this.geocoderHereApi().geocode(search.join(' '));
                if (geoCode.Response.View && geoCode.Response.View.length > 0) {
                    const position = geoCode.Response.View[0].Result[0].Location.DisplayPosition;
                    location = {
                        continent: info.continent || null,
                        country: info.country || null,
                        region: info.region || null,
                        city: info.city || null,
                        geoPoint: new admin.firestore.GeoPoint(position.Latitude, position.Longitude)
                    };
                    await t.set(collection.doc(hash(location)), location);

                    if (geoCode.Response.View.length > 1) {
                        console.error(`Found more than one place via HereAPI with geoInfo='${JSON.stringify(info)}'.`);
                    }
                } else {
                    console.error(`Could not find place via HereAPI with geoInfo='${JSON.stringify(info)}'.`);
                }
            }
        });

        return location;
    }
}