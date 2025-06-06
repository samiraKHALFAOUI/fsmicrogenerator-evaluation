import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Customer } from '../../../../shared/models/customer';
import { Footer, LazyLoadEvent } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { CustomerService } from '../../../../shared/services/customer.service';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageUrlPipe } from '../../../../shared/pipess/image-url.pipe';

@Component({
  selector: 'app-customer-list',
  imports: [
    TableModule,
    ButtonModule,
    ToastModule,
    ConfirmPopupModule,
    DynamicDialogModule,
    ImageUrlPipe,
  ],
  providers: [
    ConfirmationService,
    MessageService,
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  @Input() customers: Customer[] = [];
  @Input() totalItems = 0;
  @Input() loading = false;
  @Input() rows = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 25, 50];
  
  @Output() view = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() loadData = new EventEmitter<LazyLoadEvent>();
  
  first = 0;
  currentPage = 1;
  totalPages = 1;
  sortDirection: 'asc' | 'desc' = 'asc';
  sortedColumn: string = '';
    ref: DynamicDialogRef | undefined;
  
  constructor(
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    // Initial data load will happen from parent
    this.calculateTotalPages();
  }

  // Emit the lazy load event when table is paginated
  onLazyLoad(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadData.emit(event);
  }

  // View customer
  onView(id: string | undefined) {
    if (id) this.view.emit(id);
  }

  // Edit customer
  onEdit(id: string | undefined) {
    this.ref = this.dialogService.open(CustomerFormComponent, {
      header: 'Add Customer',
      width: '50vw',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
      },
      data: {
        mode: 'edit',
        id: id,
      },
      templates: {
          footer: Footer
      }
    });
    
    this.ref.onClose.subscribe((data: any) => {
        if (data) {
            this.loadData.emit();
        }
        this.messageService.add({ severity: 'info', life: 3000 });
    });

    this.ref.onMaximize.subscribe((value) => {
        this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  // Delete customer
  onDelete(id: string | undefined) {
    if (id) this.delete.emit(id);
  }

  // Sort the table by column
  sortTable(column: string): void {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }

    this.customers.sort((a, b) => {
      if (a[column] < b[column]) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (a[column] > b[column]) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  // Handle previous page click
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.first = (this.currentPage - 1) * this.rows;
      this.loadData.emit({ first: this.first, rows: this.rows });
    }
  }

  // Handle next page click
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.first = (this.currentPage - 1) * this.rows;
      this.loadData.emit({ first: this.first, rows: this.rows });
    }
  }

  // Calculate total pages based on total items and rows per page
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.rows);
  }

  // Pagination controls logic
  onPageChange(event: any): void {
    this.currentPage = Math.ceil(event.first / event.rows) + 1;
    this.first = event.first;
    this.rows = event.rows;
    this.calculateTotalPages();
    this.loadData.emit(event);
  }

  ngOnDestroy() {
    if (this.ref) {
        this.ref.close();
    }
  }
}
