import { Component, OnInit } from '@angular/core';

import { Event } from '../../../../../common/src/firebase/firestore/models/events/event';

import { EChartOption } from 'echarts';


@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    chartOption: EChartOption = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
        }]
    };

    events: Event[];

    constructor() {
    }

    ngOnInit() {
    }

}
