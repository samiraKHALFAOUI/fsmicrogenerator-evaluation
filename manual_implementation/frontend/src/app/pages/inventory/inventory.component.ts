import { Inventory } from '../../core/models/inventory.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';
@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <header class="page-header slide-in">
        <h1>Inventory Movement</h1>
      </header>
      <div class="inventory-list fade-in">
        <div class="table-responsive">
          <table class="inventory-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Raison</th>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of data" class="inventory-row">
                <td>{{ item.reference }}</td>
                <td>
                  <span class="badge" [ngClass]="getBadge(item.type)">
                    {{ item.type }}
                  </span>
                </td>
                <td>{{ item.raison }}</td>
                <td>{{ item.date | date : 'short' }}</td>
                <td>
                  {{ item.quantity }}
                </td>
                <td>
                  {{ item.product.name }}
                </td>
                <td>
                  {{ item.price }}
                </td>
              </tr>
              <tr *ngIf="data.length === 0">
                <td colspan="6" class="empty-state">No Inventory found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: var(--space-4);
    }
    .page-header h1 {
      font-size: 2rem;
      margin-bottom: var(--space-2);
    }
    .inventory-table {
      width: 100%;
      border-collapse: collapse;
    }
    .inventory-table th, .inventory-table td {
      padding: var(--space-2) var(--space-3);
      text-align: left;
      border-bottom: 1px solid var(--neutral-200);
    }
    .inventory-table th {
      background-color: var(--neutral-100);
      font-weight: 600;
    }
    .inventory-row {
      transition: background-color 0.2s ease;
    }
    .inventory-row:hover {
      background-color: var(--neutral-50);
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .badge-entry {
      background-color: var(--primary-100);
      color: var(--primary-700);
    }
    .badge-exit {
      background-color: var(--accent-100);
      color: var(--accent-700);
    }
    .empty-state {
      text-align: center;
      padding: var(--space-4);
      color: var(--neutral-600);
    }
    .table-responsive {
      overflow-x: auto;
    }
  `]
})
export class InventoryComponent implements OnInit {
  data: Inventory[] = [];
  constructor(private InventoryService: InventoryService) {
    console.log('InventoryComponent initialized');
  }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.InventoryService.getData().subscribe(data => {
      this.data = data;
    });
  }
  getBadge(role: string): string {
    switch (role) {
      case 'ENTRY': return 'badge-entry';
      case 'EXIT': return 'badge-exit';
      default: return '';}
  }
}