import { Component, OnInit } from '@angular/core';
import { Event } from '../../../../../common/src/firebase/firestore/models/events/event';
import { EChartOption, ECharts } from 'echarts';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { DistinctEvent, PlaceEvent } from 'src/app/models/distinct-event';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    echartsInstance: ECharts;
    chartOption: EChartOption = {
        backgroundColor: '#a0d4d8',
        title: {
            text: 'My super app',
            subtext: 'Realtime events reporting',
            left: 'center',
            top: 'top'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params: EChartOption.Tooltip.Format) {
                const event = params.data.placeEvent as PlaceEvent;
                return `Event: ${event.events[0].name}</br>
Count: ${event.events.length}</br>
Place: ${event.place && `${event.place.country}, ${event.place.region}, ${event.place.city}` || 'Unknown'}`;
            }
        },
        geo: {
            type: 'map',
            map: 'world',
            roam: true,
            label: {
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#64c2c9',
                    borderColor: '#111'
                },
                emphasis: {
                    areaColor: '#55acb2'
                }
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: []
        },
        series: []
    };

    events: Event<firebase.firestore.Timestamp, firebase.firestore.GeoPoint>[];

    constructor(private data: DataService) {
    }

    ngOnInit() {

    }

    onChartInit(e) {
        this.echartsInstance = e;
        this.data.subscribeEvents().subscribe(distinctEvents => {
            const legendData = (this.chartOption.legend as any).data = [];
            this.chartOption.series = distinctEvents.map(de => {
                legendData.push(de.name);
                return {
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    name: de.name,
                    data: de.placeEvents.map(p => {
                        return {
                            name: de.name,
                            value: p.place != null
                                ? [p.place.geoPoint.longitude, p.place.geoPoint.latitude]
                                : [31.158288, -40.293733],
                            placeEvent: p
                        };
                    })
                };
            });
            this.echartsInstance.setOption(this.chartOption);
            console.log(this.chartOption);
        });
    }

    //     {
    //         name: 'Buy',
    //         timestamp: firebase.firestore.Timestamp.now(),
    //         place: {
    //             city: 'Katowice',
    //             country: 'Poland',
    //             geoPoint: new firebase.firestore.GeoPoint(18.987528, 50.228532)
    //         }
    //     } as Event<firebase.firestore.Timestamp, firebase.firestore.GeoPoint>
}
