import { Component, Input, SimpleChanges } from '@angular/core';
import { ListHeader } from 'src/app/shared/models/defaultModels/List.model';
@Component({
  selector: 'app-chart-table',
  templateUrl: './chart-table.component.html',
  styleUrl: './chart-table.component.scss'
})
export class ChartTableComponent {
  @Input() data!: any[];
  @Input() cols!: ListHeader[];
  @Input() captionConfig!: any
  @Input() rows: number = 5
  selectedColumns: any[] = [];
  @Input() serviceName: string = '';
  @Input() tableId: String = ''
  selectedCustomers!: any[];
  representatives!: any[];
  statuses!: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  searchValue: any
  globalFilterFields: any = []
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cols'] && changes['cols'].currentValue?.length)
      this.selectedColumns = [...this.cols]
    if (changes['data'] && changes['data'].currentValue)
      this.loading = false
  }
  ngOnInit() {
    this.representatives = [
      { name: 'Amy Elsner', image: 'amyelsner.png' },
      { name: 'Anna Fali', image: 'annafali.png' },
      { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
      { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
      { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
      { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
      { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
      { name: 'Onyama Limba', image: 'onyamalimba.png' },
      { name: 'Stephen Shaw', image: 'stephenshaw.png' },
      { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
    ];
    this.statuses = [
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' }
    ];
  }
  getSeverity(status: string) {
    switch (status) {
      case 'unqualified':
        return 'danger';
      case 'qualified':
        return 'success';
      case 'new':
        return 'info';
      case 'negotiation':
        return 'warning';
      case 'renewal':
        return undefined;
      default: return undefined
    }
  }
  clear(event: any) {
  }
}
