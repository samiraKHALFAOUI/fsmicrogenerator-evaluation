import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { TagModule } from 'primeng/tag';
import { SupplierService } from '../../../shared/services/SupplierService/supplier.service';
import { Supplier } from '../../../shared/models/supplierModel/supplier.model';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss'],
  providers: [MessageService],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ToastModule,
    CardModule,
    InputTextModule,
    InputTextarea,
    InputSwitchModule,
    ButtonModule,
    FileUploadModule,
    TagModule
  ]
})
export class SupplierDetailComponent implements OnInit {
  supplier: Supplier = {
    _id: '',
    name: '',
    email: '',
    officePhoneNumber: '',
    address: '',
    logo: '',
    isAct: true,
    products: [],
    transactions: []
  };
  
  isEditMode = false;
  isViewMode = false;
  logoPreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const mode = this.route.snapshot.paramMap.get('mode');

    this.isEditMode = mode === 'edit';
    this.isViewMode = mode === 'view';
    
    if (id) {
      this.loadSupplier(id);
    }
  }

  loadSupplier(id: string): void {
    this.supplierService.getSupplier(id).subscribe({
      next: (data: Supplier) => {
        this.supplier = data;
        if (this.supplier.logo) {
          this.logoPreview = this.supplier.logo;
        }
      },
      error: (error: any) => {
        console.error('Error loading supplier:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load supplier details'
        });
      }
    });
  }

  onUpload(event: any): void {
    console.log('Upload event:', event);
    const file = event.files[0];
    if (file) {
      console.log('Selected file:', file);
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File size must be less than 5MB'
        });
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Only image files are allowed'
        });
        return;
      }
      
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveSupplier(): void {
    if (!this.validateForm()) {
      return;
    }

    console.log('Selected file:', this.selectedFile);
    console.log('Supplier data:', this.supplier);

    const supplierToSave: Supplier = {
      _id: this.supplier._id,
      name: this.supplier.name,
      email: this.supplier.email,
      officePhoneNumber: this.supplier.officePhoneNumber,
      address: this.supplier.address,
      logo: this.supplier.logo,
      isAct: this.supplier.isAct,
      products: this.supplier.products,
      transactions: this.supplier.transactions
    };
    
    if (this.isEditMode && this.supplier._id) {
      this.supplierService.updateSupplier(this.supplier._id, supplierToSave, this.selectedFile || undefined).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Supplier updated successfully'
          });
          this.router.navigate(['/suppliers']);
        },
        error: (error: any) => {
          console.error('Error updating supplier:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update supplier'
          });
        }
      });
    } else {
      this.supplierService.createSupplier(supplierToSave, this.selectedFile || undefined).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Supplier created successfully'
          });
          this.router.navigate(['/suppliers']);
        },
        error: (error: any) => {
          console.error('Error creating supplier:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create supplier'
          });
        }
      });
    }
  }

  private validateForm(): boolean {
    if (!this.supplier.name?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Name is required'
      });
      return false;
    }

    if (!this.supplier.email?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Email is required'
      });
      return false;
    }

    if (!this.supplier.officePhoneNumber?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Office phone number is required'
      });
      return false;
    }

    if (!this.supplier.address?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Address is required'
      });
      return false;
    }

    return true;
  }
} 