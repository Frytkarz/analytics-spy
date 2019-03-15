import { Component, OnInit } from '@angular/core';

import { Event } from '../../../../../common/src/firebase/firestore/models/events/event';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    events: Event[];

    constructor() {
    }

    ngOnInit() {
    }

}
