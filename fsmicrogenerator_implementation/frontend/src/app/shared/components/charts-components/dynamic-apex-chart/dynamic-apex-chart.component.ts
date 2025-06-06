import { Component, Input, OnInit } from '@angular/core';
import { ApexChart, ApexNonAxisChartSeries, ApexPlotOptions, ApexDataLabels, ApexStroke, ApexGrid, ApexLegend } from "ng-apexcharts";
import { HelpersService } from 'src/app/shared/services/defaultServices/helpers.service';
@Component({
  selector: 'app-dynamic-apex-chart',
  templateUrl: './dynamic-apex-chart.component.html',
  styleUrl: './dynamic-apex-chart.component.scss'
})
export class DynamicApexChartComponent {
  @Input() data: any = []
  @Input() translateLabels: boolean = false
  @Input() chartType: string = 'donut'
  @Input() showlegend: boolean = false
  chartOptions!: {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    colors: string[];
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    grid: ApexGrid;
    plotOptions: ApexPlotOptions;
    responsive: any;
    states: any;
  };
  constructor(private helpers: HelpersService) {
  }
  ngOnInit(): void {
    switch (this.chartType) {
      case 'donut': this.donutChart(); break;
    }
  }
  donutChart() {
    let labels: any[] = this.data.data.map((d: any) => d._id)
    const initChart = () => {
      let total = this.data.data.map((d: any) => d.count).reduce((sum: any, d: any) => sum + d, 0);
      this.chartOptions = {
        series: this.data.data.map((d: any) => d.count),
        chart: {
          type: 'donut',
        },
        labels: labels,
        colors: this.data.data.map((d: any) => d.color),
        stroke: {
          width: 5,
          colors: ['#fff']
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ],
        dataLabels: {
          enabled: false,
          formatter: (val) => {
            return `${parseInt(val as string)}  ${this.data.suffix}`;
          }
        },
        legend: {
          show: this.showlegend,
          position: 'bottom',
          horizontalAlign: 'center',
        },
        grid: {
          padding: {
            top: 0,
            bottom: 0,
            right: 15
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '75%',
              labels: {
                show: true,
                value: {
                  fontSize: '18px',
                  fontFamily: 'Public Sans',
                  fontWeight: 500,
                  color: '#495057',
                  offsetY: -17,
                  formatter: (val) => {
                    return this.helpers.formatNumber((parseInt(val as string) * 100) / total) + '%';
                  }
                },
                name: {
                  offsetY: 17,
                  fontFamily: 'Public Sans'
                },
                total: {
                  show: true,
                  fontSize: '13px',
                  color: '#6c757d',
                  label: this.data.totalLabel,
                  formatter: () => {
                    return this.data.suffix ? `${total} ${this.data.suffix}` : `${total}`;
                  }
                }
              }
            }
          }
        },
        states: {
          hover: {
            filter: { type: 'none' }
          },
          active: {
            filter: { type: 'none' }
          }
        }
      };
    }
    if (this.translateLabels) {
      this.helpers.translateValues([...new Set([...labels, this.data.totalLabel])]).then((result) => {
        labels = labels.map((l) => result.find((r: any) => r.value === l).label)
        this.data.totalLabel = result.find((r: any) => r.value === this.data.totalLabel).label
        initChart()
      })
    } else {
      initChart()
    }
  }
}
