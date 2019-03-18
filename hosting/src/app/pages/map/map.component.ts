import { Component, OnDestroy } from '@angular/core';
import { Event } from '../../../../../common/src/firebase/firestore/models/events/event';
import { EChartOption, ECharts } from 'echarts';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { DistinctEvent, LocationEvent } from 'src/app/models/distinct-event';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnDestroy {
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
                const event = params.data.placeEvent as LocationEvent;
                return `Event: ${event.events[0].name}</br>
Count: ${event.events.length}</br>
Place: ${event.location && `${event.location.country}, ${event.location.region}, ${event.location.city}` || 'Unknown'}`;
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

    subscription: Subscription = undefined;

    constructor(private data: DataService) {
    }

    onChartInit(e) {
        this.echartsInstance = e;
        this.subscription = this.data.subscribeEvents().subscribe(distinctEvents => {
            const legendData = (this.chartOption.legend as any).data = [];
            this.chartOption.series = distinctEvents.map(de => {
                legendData.push(de.name);
                return {
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    name: de.name,
                    data: de.locationEvents.map(p => {
                        return {
                            name: de.name,
                            value: p.location != null
                                ? [p.location.geoPoint.longitude, p.location.geoPoint.latitude]
                                : [31.158288, -40.293733],
                            placeEvent: p
                        };
                    })
                };
            });
            this.echartsInstance.setOption(this.chartOption);
        });
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }
}
