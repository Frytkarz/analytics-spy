import { Component, OnDestroy } from '@angular/core';
import { Event } from '../../../../../common/src/firebase/firestore/models/events/event';
import { EChartOption, ECharts } from 'echarts';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import * as mathjs from 'mathjs';
import { config } from '../../../../../common/src/config/config';
import { Location } from '../../../../../common/src/firebase/firestore/models/locations/location';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnDestroy {
    optionsVisible = false;
    minutesBefore = 0;

    config = config;
    event: string;
    allEvents = Object.keys(config.events);

    echartsInstance: ECharts;
    chartOption: EChartOption = {
        backgroundColor: '#a0d4d8',
        title: {
            text: config.title,
            subtext: 'Realtime events reporting',
            left: 'center',
            top: 'top'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params: EChartOption.Tooltip.Format) {
                const event = params.data as SerieData;
                const name = event.events[0].name;
                const eventConfig = config.events[name];

                let result = `Event: ${eventConfig.displayName}
</br>Count: ${event.events.length}
</br>Location: ${event.location && `${event.location.country}, ${event.location.region}, ${event.location.city}` || 'Unknown'}`;

                if (eventConfig.valueInUSD !== undefined) {
                    const agg = eventConfig.valueInUSD.agregation;
                    const values = event.events.map(e => e.valueInUSD);
                    const value = agg === 'array' ? `[${values.join(', ')}]` : mathjs.round(mathjs[agg](...values), 2);
                    result = result + `</br>- Value in USD (${agg}): ${value}`;
                }
                if (eventConfig.params !== undefined) {
                    for (const param of Object.keys(eventConfig.params)) {
                        const agg = eventConfig.params[param].agregation;
                        const values = event.events.map(e => e.params[param]);
                        const value = agg === 'array' ? `[${values.join(', ')}]` : mathjs.round(mathjs[agg](...values), 2);
                        result = result + `</br>- ${param} (${agg}): ${value}`;
                    }
                }

                return result;
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
            data: [],
            formatter: id => config.events[id].displayName
        },
        series: []
    };

    subscription: Subscription = undefined;

    constructor(private data: DataService) {
    }

    onChartInit(e) {
        this.echartsInstance = e;
        this.refresh();
    }

    ngOnDestroy() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    }

    refresh() {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
        (this.chartOption.legend as any).data = [];
        this.chartOption.series = [];
        this.echartsInstance.setOption(this.chartOption, true);

        let from = firebase.firestore.Timestamp.now();
        if (this.minutesBefore > 0) {
            from = firebase.firestore.Timestamp.fromMillis((from.seconds - (this.minutesBefore * 60)) * 1000);
        }

        this.subscription = this.data.subscribeEvents(from, this.event).subscribe(events => {
            const legendData = (this.chartOption.legend as any).data = [];
            this.chartOption.series = [];
            const series = this.chartOption.series as Serie[];
            for (const e of events) {
                let serie = series.find(s => s.name === e.name);
                if (serie == null) {
                    legendData.push(e.name);
                    serie = {
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        name: e.name,
                        data: []
                    };
                    series.push(serie);
                }

                const element = serie.data.find(d =>
                    (d.location == null && e.location == null)
                    || (d.location && e.location && d.location.geoPoint.isEqual(e.location.geoPoint)));
                if (element != null) {
                    element.events.push(e);
                } else {
                    serie.data.push({
                        name: e.name,
                        value: e.location != null
                            ? [e.location.geoPoint.longitude, e.location.geoPoint.latitude]
                            : [31.158288, -40.293733],
                        events: [e],
                        location: e.location
                    });
                }
            }

            this.echartsInstance.setOption(this.chartOption, true);
        });

        this.optionsVisible = false;
    }

    onOptionsClick() {
        this.optionsVisible = !this.optionsVisible;
    }

    sliderValueFormatter(value: number): string {
        const mins = value % 60;
        return `${(value - mins) / 60}:${mins}`;
    }
}

interface Serie {
    type: string;
    coordinateSystem: string;
    name: string;
    data: SerieData[];
}

interface SerieData {
    name: string;
    value: number[];
    events: Event<firebase.firestore.Timestamp, firebase.firestore.GeoPoint>[];
    location?: Location<firebase.firestore.GeoPoint>;
}
