import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from "rxjs";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  activeIndex: number = 0;
  tabs: any[] = [];
  constructor() { }
  ngOnInit(): void {
    this.tabs = [
      { id: 'customerManagement', title: 'code_18425', icon: 'pi pi-user', color: '', disabled: true },
      { id: 'inventoryManagement', title: 'code_18421', icon: 'bi bi-tools', color: '', disabled: true },
      { id: 'productManagement', title: 'code_10690', icon: 'pi pi-box', color: '', disabled: true },
      { id: 'supplierManagement', title: 'code_18433', icon: 'pi pi-user', color: '', disabled: true },
      { id: 'transactionManagement', title: 'code_5288', icon: 'pi pi-money-bill', color: '', disabled: true },
    ].filter((t) => t.disabled);
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
