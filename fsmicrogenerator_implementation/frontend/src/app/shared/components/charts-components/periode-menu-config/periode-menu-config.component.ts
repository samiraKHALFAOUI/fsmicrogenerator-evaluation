import { Component, Output, ViewChild, EventEmitter, Input } from '@angular/core';
@Component({
  selector: 'app-periode-menu-config',
  templateUrl: './periode-menu-config.component.html',
  styleUrl: './periode-menu-config.component.scss'
})
export class PeriodeMenuConfigComponent {
  @ViewChild('menu') menu: any;
  @Output() onPeriodeUpdate: EventEmitter<any> = new EventEmitter()
  @Input() showCount!: boolean;
  @Input() showOnlyCount !: boolean;
  items: any[] = [];
  @Input() fromDate: Date | null = null;
  @Input() toDate: Date | null = null;
  today: Date = new Date(new Date().setHours(23, 59, 59, 999))
  @Input() N: number = 5
  @Input() defaultN: number = 5
  constructor() {
  }
  ngOnInit(): void {
    this.initializeMenuItems();
  }
  initializeMenuItems() {
    if (!this.showOnlyCount)
      this.items = [
        {
          label: 'code_17767',
          icon: 'pi pi-fw pi-calendar',
          type: 'simple',
          command: (event: any) => { if (event && event.item) this.onSelectPreset('lastWeek') }
        },
        {
          label: 'code_17768',
          icon: 'pi pi-fw pi-calendar',
          type: 'simple',
          command: (event: any) => { if (event && event.item) this.onSelectPreset('lastMonth') }
        },
        {
          label: 'code_17769',
          icon: 'pi pi-fw pi-calendar',
          type: 'simple',
          command: (event: any) => { if (event && event.item) this.onSelectPreset('lastYear') }
        },
        {
          label: 'code_17770',
          type: 'calendar'
        },
      ];
    if (this.showCount || this.showOnlyCount) {
      this.items.unshift({
        type: 'count',
        label: 'code_17813',
        command: (event: any) => {
          if (event && event.item) {
            this.onPeriodeUpdate.emit('global')
          }
        }
      })
    }
    this.items.push({
      label: 'clear',
      type: 'clear',
      command: (event: any) => {
        if (event && event.item) {
          this.fromDate = null
          this.toDate = null
          this.N = this.defaultN
          this.sendData()
        }
      }
    })
  }
  onSelectPreset(preset: string) {
    if (preset === 'lastWeek') {
      this.calculateLastWeekDates();
    } else if (preset === 'lastMonth') {
      this.calculateLastMonthDates();
    } else if (preset === 'lastYear') {
      this.calculateLastYearDates();
    }
  }
  applyPersonalize() {
    //
    this.sendData()
  }
  calculateLastWeekDates() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - dayOfWeek + 1);
    this.fromDate = new Date(lastMonday);
    this.fromDate.setDate(lastMonday.getDate() - 7);
    this.toDate = new Date(lastMonday);
    this.toDate.setDate(lastMonday.getDate() - 1);
    this.sendData()
  }
  calculateLastMonthDates() {
    const today = new Date();
    this.fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    this.toDate = new Date(today.getFullYear(), today.getMonth(), 0);
    this.sendData()
  }
  calculateLastYearDates() {
    const today = new Date();
    this.fromDate = new Date(today.getFullYear() - 1, 0, 1);
    this.toDate = new Date(today.getFullYear() - 1, 11, 31);
    this.sendData()
  }
  sendData() {
    if (this.showOnlyCount) {
      this.onPeriodeUpdate.emit({ N: this.N || 5 })
    }
    else if (this.showCount)
      this.onPeriodeUpdate.emit({ from: this.fromDate, to: this.toDate, N: this.N || 5 })
    else
      this.onPeriodeUpdate.emit({ from: this.fromDate, to: this.toDate })
  }
}
