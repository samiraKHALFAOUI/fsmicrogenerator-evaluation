import { Component, Input, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as HighStock from 'highcharts/highstock';
import HIndicatorsAll from 'highcharts/indicators/indicators-all';
import HDragPanes from 'highcharts/modules/drag-panes';
import HAnnotationsAdvanced from 'highcharts/modules/annotations-advanced';
import HPriceIndicator from 'highcharts/modules/price-indicator';
import HFullScreen from 'highcharts/modules/full-screen';
import HStockTools from 'highcharts/modules/stock-tools';
import { ChartType } from '../TypeCharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import HighchartsMore from 'highcharts/highcharts-more';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import { HelpersService } from '../../../services/defaultServices/helpers.service';
import Drilldown from 'highcharts/modules/drilldown';
import { SecureStorageService } from 'src/app/shared/services/defaultServices/secureStorage.service';
;
Exporting(Highcharts);
Exporting(HighStock);
ExportData(Highcharts);
ExportData(HighStock);
NoDataToDisplay(Highcharts);
NoDataToDisplay(HighStock);
HighchartsMore(Highcharts);
HighchartsMore(HighStock);
Drilldown(Highcharts)
@Component({
  selector: 'app-dynamic-charts',
  templateUrl: './dynamic-charts.component.html',
  styleUrl: './dynamic-charts.component.scss'
})
export class DynamicChartsComponent {
  @Input() statistiqueID!: string;
  @Input() title: string = ''
  @Input() subTitle: string = ''
  @Input() type: ChartType = 'line'
  @Input() xAxisTitle: string = ''
  @Input() yAxisTitle: string = ''
  @Input() valueSuffix: string = ''
  @Input() data: any
  @Input() dataType: string = 'simple'
  @Input() stacking: boolean = false;
  constructorType!: string
  lang: string = 'fr'
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  HighStock: typeof HighStock = HighStock;
  chartStockOptions: HighStock.Options = {};
  update: boolean = false
  public chart: any;
  public callback = this.chartCallback.bind(this);
  constructor(private helpers: HelpersService, private secureStorage: SecureStorageService,
  ) {
  }
  ngOnInit(): void {
    this.lang = this.secureStorage.getItem('lang') || this.lang
    let initialConfig: any = this.getConfigByChartType(this.type, this.data)
    let initialOptions: any = {
      months: [
        this.helpers.titleCase(this.helpers.translateTitle('code_1578')),
        this.helpers.titleCase(this.helpers.translateTitle('code_1579')),
        this.helpers.titleCase(this.helpers.translateTitle('code_1580')),
        this.helpers.titleCase(this.helpers.translateTitle('code_1581')),
        this.helpers.titleCase(this.helpers.translateTitle('code_1582')),
        this.helpers.titleCase(this.helpers.translateTitle('code_1583')),
        this.helpers.titleCase(this.helpers.translateTitle('code_1584')),
        this.helpers.titleCase(this.helpers.translateTitle('code_1585')),
        this.helpers.titleCase(this.helpers.translateTitle('code_1586')),
        this.helpers.titleCase(this.helpers.translateTitle('code_1587')),
        this.helpers.titleCase(this.helpers.translateTitle('code_1588')),
        this.helpers.titleCase(this.helpers.translateTitle('code_1589')),],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      weekdays: [this.helpers.titleCase(this.helpers.translateTitle('code_1576')), this.helpers.titleCase(this.helpers.translateTitle('code_1570')), this.helpers.titleCase(this.helpers.translateTitle('code_1571')), this.helpers.titleCase(this.helpers.translateTitle('code_1572')), this.helpers.titleCase(this.helpers.translateTitle('code_1573')), this.helpers.titleCase(this.helpers.translateTitle('code_1574')), this.helpers.titleCase(this.helpers.translateTitle('code_1575'))],
      rangeSelectorFrom: this.helpers.titleCase(this.helpers.translateTitle('code_4312')),
      rangeSelectorTo: this.helpers.titleCase(this.helpers.translateTitle('code_4311')),
      rangeSelectorZoom: this.helpers.titleCase(this.helpers.translateTitle('code_13895')),
      contextButtonTitle: 'show',
      numericSymbols: ["k", "M", "B", "T", "P", "E"],
      viewFullscreen: this.helpers.titleCase(this.helpers.translateTitle('code_17793')),
      printChart: this.helpers.titleCase(this.helpers.translateTitle('code_17794')),
      downloadJPEG: this.helpers.titleCase(this.helpers.translateTitle('code_17796')),
      downloadPNG: this.helpers.titleCase(this.helpers.translateTitle('code_17795')),
      downloadSVG: this.helpers.titleCase(this.helpers.translateTitle('code_17798')),
      downloadPDF: this.helpers.titleCase(this.helpers.translateTitle('code_17797')),
      downloadXLS: this.helpers.titleCase(this.helpers.translateTitle('code_17800')),
      downloadCSV: this.helpers.titleCase(this.helpers.translateTitle('code_17799')),
      downloadMIDI: 'Download MIDI',
      viewData: this.helpers.titleCase(this.helpers.translateTitle('code_17801')),
      exitFullscreen: 'Exit from full screen',
      exportInProgress: 'Exporting...',
      hideData: 'Hide data table',
      invalidDate: undefined,
      loading: 'Loading...',
      mainBreadcrumb: 'Main',
      noData: this.helpers.titleCase(this.helpers.translateTitle('code_17980')) || 'No data to display',
      numericSymbolMagnitude: 1000,
      playAsSound: 'Play as sound',
      resetZoom: 'Reset zoom',
      resetZoomTitle: 'Reset zoom level 1:1',
      shortWeekdays: undefined,
      thousandsSep: '\u0020',
    }
    if (this.dataType === 'stock') {
      this.initializeStockChartOptions(initialConfig, initialOptions)
      this.constructorType = 'stockChart'
    } else {
      this.initializeChartOptions(initialConfig, initialOptions);
      this.constructorType = 'chart'
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      if (this.dataType === 'stock') {
        this.chartStockOptions = { ...this.chartStockOptions, ...this.getSeriesByType(this.type) }
      } else {
        this.chartOptions = { ...this.chartOptions, ...this.getSeriesByType(this.type) }
      }
      if (changes['subTitle']) {
        if (this.dataType === 'stock') {
          this.chartStockOptions.subtitle = { ...this.chartStockOptions.subtitle, text: this.subTitle }
        } else {
          this.chartOptions.subtitle = { ...this.chartOptions.subtitle, text: this.subTitle }
        }
      }
      if (changes['title']) {
        if (this.dataType === 'stock') {
          this.chartStockOptions.title = { ...this.chartStockOptions.title, text: this.title }
        } else {
          this.chartOptions.title = { ...this.chartOptions.title, text: this.title }
        }
      }
      this.update = true
      this.checkSeries()
    }
  }
  public chartCallback(chart: Highcharts.Chart | HighStock.Chart) {
    this.chart = chart;
  }
  checkSeries() {
  }
  initializeChartOptions(initialConfig: any, initialOptions: any) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    Highcharts.setOptions({
      lang: { ...initialOptions },
      time: {
        timezone: userTimeZone
      }
    });
    let result = this.getSeriesByType(this.type)
    this.chartOptions = {
      ...initialConfig,
      series: result.series || result,
    };
    if (result.drilldown && result.drilldown.length)
      this.chartOptions['drilldown'] = { series: result.drilldown }
  }
  initializeStockChartOptions(initialConfig: any, initialOptions: any) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    HighStock.setOptions({
      lang: { ...initialOptions },
      time: {
        timezone: userTimeZone
      }
    });
    this.chartStockOptions = {
      ...initialConfig,
      legend: {
        enabled: this.data.length > 1
      }, xAxis: {
        ordinal: false
      },
      rangeSelector: {
        allButtonsEnabled: true,
        buttons: [{
          type: 'month',
          count: 3,
          text: this.helpers.titleCase(this.helpers.translateTitle('code_1731')),
          dataGrouping: {
            forced: true,
            units: [['day', [1]]]
          }
        }, {
          type: 'year',
          count: 1,
          text: this.helpers.titleCase(this.helpers.translateTitle('code_3536')),
          dataGrouping: {
            forced: true,
            units: [['week', [1]]]
          }
        }, {
          type: 'all',
          text: this.helpers.titleCase(this.helpers.translateTitle('code_7472')),
          dataGrouping: {
            forced: true,
            units: [['month', [1]]]
          }
        }],
        buttonTheme: {
          width: 60
        },
        selected: 0
      },
      series: this.data
    };
  }
  getConfigByChartType(type: any, data: any[] = []) {
    let config: any = {
      chart: {
        type: this.type,
      },
      title: {
        text: this.title,
      },
      subtitle: {
        text: this.subTitle,
      },
      tooltip: {
        valueSuffix: this.valueSuffix,
        valueDecimals: 2
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      navigation: {
        buttonOptions: {
          enabled: true
        }
      },
      xAxis: {
        title: {
          text: this.xAxisTitle
        },
        reversed: this.lang === 'ar' ? true : false,
      },
      yAxis: {
        title: {
          text: this.yAxisTitle
        },
        opposite: this.lang === 'ar' ? true : false,
      },
      exporting: {
        enabled: true,
        showTable: false,
      }
    }
    if (type === 'customBar') {
      config = {
        ...config,
        chart: {
          type: 'bar',
        },
        xAxis: {
          categories: data.map(item => item.data.map((elt: any) => elt.name)),
          labels: {
            useHTML: true,
            formatter: function (this: Highcharts.AxisLabelsFormatterContextObject): string {
              const item = data[this.pos];
              if (item.img)
                return `<img src="${item.img}" alt="${item.name}" style="border-radius: 50%;width:35px; height:35px; vertical-align:middle; margin-right:5px;" /><br>${item.name}`;
              return item.name
            },
          },
        },
        legend: {
          enabled: false
        }
      }
    } else if (type === 'bar' && this.stacking) {
      config = {
        chart: {
          type: 'bar'
        },
        title: {
          text: this.title,
        },
        subtitle: {
          text: this.subTitle,
        },
        xAxis: {
          title: {
            text: this.xAxisTitle
          },
          type: 'category',
        },
        yAxis: {
          opposite: true,
          title: {
            text: this.yAxisTitle
          },
        },
        legend: {
          reversed: true,
        },
        plotOptions: {
          series: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
              filter: {
                operator: '>',
                property: 'y',
                value: 0
              },
              formatter: function (): any {
                //@ts-ignore
                return (this.y % 1 !== 0) ? this.y.toFixed(2) : this.y;
              }
            },
          }
        },
      }
    } else if (type === 'bar') {
      config = {
        ...config,
        chart: {
          type: 'bar',
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          min: 0,
          opposite: true,
          title: {
            text: this.yAxisTitle
          },
          top: 100
        },
        legend: {
          enabled: data.length === 1 ? false : true
        }
      }
    }
    else if (['line', 'column'].includes(type)) {
      config = {
        ...config,
      }
      if (type === 'line') {
        config.plotOptions = {
          series: {
            marker: {
              enabled: true
            }
          }
        }
      }
    } else if (['pie'].includes(type)) {
      let op1 = {
        tooltip: {
          pointFormat: '<b>{point.percentage:.1f}%</b> of all {series.total} '
        },
        plotOptions: {
          series: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              connectorShape: 'crookedLine',
              crookDistance: '80%',
              alignTo: 'plotEdges',
              format: '{point.y}: <i>{point.name}</i>'
            }
          }
        }
      }
      let op2 = {
        plotOptions: {
          series: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: [{
              enabled: true,
              distance: 20
            }, {
              enabled: true,
              distance: -40,
              format: '{point.percentage:.1f}%',
              style: {
                fontSize: '1em',
                textOutline: 'none',
                opacity: 0.7
              },
              filter: {
                operator: '>',
                property: 'percentage',
                value: 0
              }
            }]
          }
        }
      }
      config = {
        ...config,
        ...op2
      }
    }
    return config
  }
  getSeriesByType(type: ChartType) {
    let series = [...this.data]
    let drilldown: any = []
    if (['pie'].includes(type)) {
      return this.getPieSeries(series)
    } else if (type === 'customBar') {
      return { series: [{ name: '', data: series.map((s) => s.value) }], drilldown: [] }
    }
    return { series, drilldown }
  }
  getPieSeries(series: any) {
    let data: any = []
    let drilldown: any = []
    series.map((s: any) => {
      let item: any = {
        name: s.name,
        colorByPoint: true,
        data: this.helpers.sortData(
          s.data.map((d: any) => {
            d = { name: d.name || d.label || d._id, y: Number(d.value || d.count || d.y), origine: d };
            if (d.origine.details?.length) {
              d.drilldown = d.name
              drilldown.push({ name: d.name, id: d.name, data: d.origine.details })
            }
            return d
          }), 'y', 'number', 'desc').filter((item) => item.y > 0)
      }
      if (item.data.length) {
        let index = item.data.filter((d: any) => d.y).length - 1
        item.data[0].sliced = true
        item.data[index] = { ...item.data[index], selected: true, sliced: true }
      }
      data.push(item)
    })
    return { series: data, drilldown }
  }
  getCategories() {
    let categories = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    return this.data.categories || categories
  }
  updateChartType(event: any) {
    if (this.chartOptions && this.chartOptions.series)
      this.chartOptions.series.map((s) => s.type = event)
    else if (this.chartStockOptions && this.chartStockOptions.series) {
      this.chartStockOptions.series.map((s) => s.type = event)
    }
    this.update = true
  }
}
