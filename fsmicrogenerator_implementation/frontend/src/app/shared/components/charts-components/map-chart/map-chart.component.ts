import { Component, Input, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMap from 'highcharts/modules/map';
import HC_tiledwebmap from 'highcharts/modules/tiledwebmap';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offlineExporting from 'highcharts/modules/offline-exporting';
import HC_accessibility from 'highcharts/modules/accessibility';
import { HelpersService } from 'src/app/shared/services/defaultServices/helpers.service';
HighchartsMap(Highcharts); // Initialize the map module
HC_tiledwebmap(Highcharts); // Initialize the tiled web map module
HC_exporting(Highcharts); // Initialize exporting module
HC_offlineExporting(Highcharts); // Initialize offline exporting module
HC_accessibility(Highcharts); // Initialize accessibility module
@Component({
  selector: 'app-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.scss']
})
export class MapChartComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor = 'mapChart';
  chartOptions: Highcharts.Options = {}
  @Input() data: any = []
  update: boolean = false;
  constructor(private helpers: HelpersService) { }
  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        margin: 0
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      navigation: {
        buttonOptions: {
          align: 'left',
          theme: {
            stroke: '#e6e6e6'
          }
        }
      },
      mapNavigation: {
        enabled: true,
        enableDoubleClickZoomTo: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },
      mapView: {
        fitToGeometry: {
          type: 'MultiPoint',
          coordinates: [
            // Alaska west
            [-164, 54],
            // Greenland north
            [-35, 84],
            // New Zealand east
            [179, -38],
            // Chile south
            [-68, -55]
          ]
        }
      },
      tooltip: {
        pointFormat: '{point.name}'
      },
      legend: {
        enabled: true,
        title: {
          text: 'Attractions in Oslo'
        },
        align: 'left',
        symbolWidth: 20,
        symbolHeight: 20,
        itemStyle: {
          textOutline: '1 1 1px rgba(255,255,255)'
        },
        backgroundColor: 'rgba(255,255,255,0.8)',
        floating: true,
        borderColor: '#e6e6e6',
        borderWidth: 1,
        borderRadius: 2,
        itemMarginBottom: 5
      },
      plotOptions: {
        mappoint: {
          dataLabels: {
            enabled: false
          },
          cluster: {
            enabled: true,
            allowOverlap: false,
            animation: {
              duration: 450
            },
            layoutAlgorithm: {
              type: 'grid',
              gridSize: 70
            },
            zones: [{
              from: 1,
              to: 4,
              marker: {
                radius: 13
              }
            }, {
              from: 5,
              to: 9,
              marker: {
                radius: 15
              }
            }, {
              from: 10,
              to: 15,
              marker: {
                radius: 17
              }
            }, {
              from: 16,
              to: 20,
              marker: {
                radius: 19
              }
            }, {
              from: 21,
              to: 100,
              marker: {
                radius: 21
              }
            }]
          }
        }
      },
      series: this.getSeries()
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.chartOptions = {
        ...this.chartOptions, series: this.getSeries()
      }
      this.update = true
    }
  }
  getSeries() {
    let data: any = []
    let ville = this.helpers.groupDataByAttribut(this.data, 'ville')
    for (let v of Object.keys(ville)) {
      data.push({
        type: 'mappoint',
        name: v,
        data: ville[v].map((item: any) => item = { name: item.refObjetConcerne, lon: item.longitude, lat: item.latitude })
      })
    }
    return [
      {
        type: 'tiledwebmap',
        name: 'Basemap Tiles',
        provider: {
          type: 'OpenStreetMap'
        },
        showInLegend: false
      },
      ...data
    ]
  }
}
