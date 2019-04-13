import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Location } from '../../../../common/src/firebase/firestore/models/locations/location';
import { FSPath } from '../../../../common/src/firebase/firestore/fs-path';
import { StringUtils } from '../../../../common/src/typescript/utils/string-utils';
import { Multiton } from '../../../../common/src/typescript/utils/multiton';
import { IGeocoderService } from '../geocoder/igeocoder-service';

const hash = require('object-hash');

export class LocationsService {
    public constructor(private geocoders: () => Multiton<IGeocoderService>) {
    }

    public async getLocation(info: functions.analytics.GeoInfo): Promise<Location<admin.firestore.GeoPoint> | null> {
        if ((StringUtils.isNullOrEmpty(info.continent) || info.continent === '(not set)')
            && StringUtils.isNullOrEmpty(info.country)
            && StringUtils.isNullOrEmpty(info.region)
            && StringUtils.isNullOrEmpty(info.city)) {
            console.error(`Could not search location because of no info. GeoInfo='${JSON.stringify(info)}'.`);
            return null;
        }

        let location: Location<admin.firestore.GeoPoint> | null = null;
        const collection = admin.firestore().collection(FSPath.locations());
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
                let geoPoint: admin.firestore.GeoPoint | null = null;
                for (const id of this.geocoders().getIds()) {
                    geoPoint = await this.geocoders().getInstance(id).getGeoPoint(info);
                    if (geoPoint != null) {
                        location = {
                            continent: info.continent || null,
                            country: info.country || null,
                            region: info.region || null,
                            city: info.city || null,
                            geoPoint: geoPoint,
                            geocoder: id
                        };
                        await t.set(collection.doc(hash(location)), location);
                        break;
                    }
                }

                if (geoPoint == null) {
                    console.error(`Could not find location with geoInfo='${JSON.stringify(info)}' via any geocoder.`);
                }
            }
        });

        return location;
    }
}