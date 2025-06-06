import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ProductsService } from '../../../../core/services/productManagment-service/products.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AddCategorieComponent } from '../../categorie-gestion/add-categorie/add-categorie.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategorieService } from '../../../../core/services/productManagment-service/categorie.service';
import { FormDataService } from '../../../../core/services/form-data.service';
import { SupplierService } from '../../../../shared/services/SupplierService/supplier.service';
@Component({
  selector: 'app-add-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterLink],
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.scss',
})
export class AddProductsComponent {


  form!: FormGroup
  id: any
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  categories: any[] = [];
  suppliers: any[] = [];
  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private modal: NgbModal,
    private categorieService: CategorieService,
    private formDataService : FormDataService, 
    private supplierService: SupplierService
  ) { }
  ngOnInit() {

    this.form = this.fb.group({
      reference: [{ value: this.gererateReference(), disabled: true }, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      image: [null],
      salePrice: [null, [Validators.required]],
      currency: [null, [Validators.required]],
      stockQuantity: [{ value: 0, disabled: true }, [Validators.required]],
      unit: [null, [Validators.required]],
      status: [null, [Validators.required]],
      category: [null, []],
      supplier: [null, []],
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productsService.getProductById(params['id']).subscribe(res => {
          this.id = res._id;
          const { image, ...rest } = res;
          
          // Patch all values except image
          this.form.patchValue(rest);
          // Set category ID separately
          this.form.get('category')?.setValue(res.category._id);
          // Handle image preview
          if (res.image) {
            this.imagePreview = res.image;
            this.form.get('image')?.setValue(res.image);
          }
        });
      }
    });
    this.getCategories();
    this.getSuppliers();
  }

  onFileSelect(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  addProduct() {
    console.log("🚀 ~ AddProductsComponent ~ addProduct ~ this.form:", this.form)
    let formValue = this.form.getRawValue();
    if (this.id) {
      this.productsService.updateProduct(this.id, this.formDataService.transformToFormData(formValue, 'image', this.selectedFile)).subscribe({
        next: (res) => {
          console.log('Product updated successfully:', res);
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    } else {
      this.productsService.createProduct(this.formDataService.transformToFormData(formValue, 'image', this.selectedFile)).subscribe({
        next: (res) => {
          this.id = res._id;
          console.log('Product created successfully:', res);
        },
        error: (error) => {
          console.error('Error creating product:', error);
        }
      });
    }
  }

  gererateReference() {
    return Math.random().toString(36).substring(2, 15)
  }
  openCategoryModal() {
    const modalRef = this.modal.open(AddCategorieComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.title = 'Add New Category';

    modalRef.result.then(
      (result) => {
        if (result) {
          this.form.get('category')?.setValue(result._id);
        }
      },
      (reason) => {
        console.log('Modal closed');
      }
    );
  }

  getCategories() {
    return this.categorieService.getAllCategories().subscribe((res) => {
      this.categories = res;
    });
  }
  getSuppliers() {
    return this.supplierService.getSuppliers().subscribe((res) => {
      console.log("🚀 ~ AddProductsComponent ~ returnthis.supplierService.getSuppliers ~ res:", res)
      this.suppliers = res;
    });
  }



}
