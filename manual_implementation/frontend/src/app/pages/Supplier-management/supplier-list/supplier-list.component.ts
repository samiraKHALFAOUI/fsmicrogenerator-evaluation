import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Supplier } from '../../../shared/models/supplierModel/supplier.model';
import { SupplierService } from '../../../shared/services/SupplierService/supplier.service';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    TableModule,
    TagModule,
    ButtonModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];
  loading = false;

  constructor(
    private supplierService: SupplierService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load suppliers'
        });
        this.loading = false;
      }
    });
  }

  confirmDelete(supplier: Supplier): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${supplier.name}?`,
      accept: () => {
        this.deleteSupplier(supplier._id!);
      }
    });
  }

  deleteSupplier(id: string): void {
    this.supplierService.deleteSupplier(id).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'Supplier deleted successfully'
        });
        this.loadSuppliers();
      },
      error: (error) => {
        console.error('Error deleting supplier:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to delete supplier'
        });
      }
    });
  }
} 