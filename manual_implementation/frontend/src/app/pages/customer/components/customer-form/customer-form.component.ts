import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer } from '../../../../shared/models/customer';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CustomerService } from '../../../../shared/services/customer.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    ImageModule,
    TextareaModule,
    FloatLabelModule,
    DynamicDialogModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  @Input() customer: Customer | null = null;
  @Input() loading = false;
  
  @Output() submitForm = new EventEmitter<{customer: Customer, photoFile?: File}>();
  @Output() cancel = new EventEmitter<void>();
  
  customerForm!: FormGroup;
  selectedPhotoFile: File | null = null;
  previewPhotoUrl: string | ArrayBuffer | null = null;
  mode!: string;
  customerId?: string;
  
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) { }
  
  ngOnInit(): void {
    this.mode = this.config?.data?.mode;
    this.customerId = this.config?.data?.id;

    if (this.mode == 'edit' && this.customerId) {
      this.customerService.getCustomer(this.customerId).pipe(
        map(response => response.data),
        catchError(() => {
          this.router.navigate(['/customers']);
          return of(null);
        })
      ).subscribe(customer => {
        if (customer) {
          this.customerForm.patchValue(customer); // populate the form
          console.log('Customer loaded:', customer);
        }
      });
      
      // fetch the customer using the ID and populate the form
    } else if (this.route.snapshot.params['id']) {
      // fallback for route-based usage
      this.customerId = this.route.snapshot.params['id'];
      this.customer = this.route.snapshot.data['customer'];
    }
    
    this.initForm();
    // Set preview if customer has a photo
    if (this.customer?.photo) {
      this.previewPhotoUrl = this.customer.photo;
    }
  }
  
  private initForm(): void {
    this.customerForm = this.fb.group({
      name: [this.customer?.name || '', [Validators.required, Validators.minLength(2)]],
      email: [this.customer?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [this.customer?.phoneNumber || '', [Validators.required, Validators.pattern('^[0-9+ -]*$')]],
      address: [this.customer?.address || '', [Validators.required]],
      transactions: [[], []],
    });
  }
  
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length) {
      this.selectedPhotoFile = input.files[0];
      
      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewPhotoUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedPhotoFile);
    }
  }
  
  removePhoto(): void {
    this.selectedPhotoFile = null;
    this.previewPhotoUrl = null;
  }
  
  onSubmit(): void {
    if (this.customerForm.valid) {
      const formData = this.customerForm.value;
      console.log('Form Data:', formData); 
      // Create customer object with explicit properties to ensure correct typing
      const customer: Customer = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber || null,
        address: formData.address || null
      };
      
      // Add ID if updating existing customer
      if (this.customer?._id) {
        customer._id = this.customer._id;
      }
      
      // Handle photo state
      if (this.customer?.photo && !this.selectedPhotoFile && this.previewPhotoUrl) {
        // Keep existing photo
        customer.photo = this.customer.photo;
      } else if (!this.previewPhotoUrl) {
        // Explicitly set photo to null to remove it
        customer.photo = null;
      }

      // Emit the form data
      this.saveCustomer({
        customer,
        photoFile: this.selectedPhotoFile || undefined
      })
      // this.submitForm.emit({
      //   customer,
      //   photoFile: this.selectedPhotoFile || undefined
      // });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.customerForm.controls).forEach(key => {
        const control = this.customerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  saveCustomer(customer: any): void {
    this.loading = true;

    if (!this.customerId) {
      this.customerService.createCustomer(customer.customer, customer?.photoFile).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Customer created successfully'
          });
          
          this.loading = false;
          this.router.navigate(['/customers']);
          this.onCancel(response.data);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.customerService.updateCustomer(this.customerId, customer?.customer, customer?.photoFile).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Customer updated successfully'
          });
          
          this.loading = false;
          this.router.navigate(['/customers']);
          this.onCancel(response.data);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }
  
  onCancel(result :any=null): void {
    if (this.config)
      this.ref.close({data :result});
    else
      this.router.navigate(['/customers']);
  }
  
  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const control = this.customerForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  
  getErrorMessage(fieldName: string): string {
    const control = this.customerForm.get(fieldName);
    
    if (!control) return '';
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('email')) return 'Please enter a valid email address';
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    if (control.hasError('pattern')) return 'Please enter a valid phone number';
    
    return 'Invalid input';
  }
}
