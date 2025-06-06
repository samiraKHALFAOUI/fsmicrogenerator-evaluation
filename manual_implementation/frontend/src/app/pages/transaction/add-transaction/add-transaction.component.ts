import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { ReplaySubject, takeUntil } from "rxjs";

import { SupplierService } from "../../../shared/services/SupplierService/supplier.service";
import { ProductsService } from "../../../core/services/productManagment-service/products.service";
import { TransactionService } from "../../../core/services/transaction.service";
import { CustomerService } from "../../../shared/services/customer.service";

import { Product } from "../../../core/models/product-managment/product.model";
import { Supplier } from "../../../shared/models/supplierModel/supplier.model";
import { Customer } from "../../../shared/models/customer";
import { Transaction } from "../../../core/models/transaction/transaction.model";

@Component({
  selector: "app-add-transaction",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: "./add-transaction.component.html",
  styleUrls: ["./add-transaction.component.css"],
})
export class AddTransactionComponent implements OnInit, OnDestroy {
  transactionForm!: FormGroup;
  filteredStatusOptions: string[] = [];

  statusOptions = [
    "pending",

    "processing",
    "shiped",
    "delivred",
    "cancelled",
    "returned",
  ];

  typeOptions = ["purchase", "sale"];

  id = "";
  productOptions: Product[] = [];
  optionsSuppliers: Supplier[] = [];
  optionsCustomers: Customer[] = [];

  private destroyed$ = new ReplaySubject<boolean>(1);

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private activatedRoute: ActivatedRoute,
    private supplierService: SupplierService,
    private productService: ProductsService,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split("T")[0];

    this.transactionForm = this.fb.group({
      reference: [{ value: this.generateReference(), disabled: true }],
      type: ["sale", Validators.required],
      date: [{ value: today, disabled: true }],
      status: ["pending"],
      savedBy: [null, Validators.required],
      transactionLigne: this.fb.array([]),
      supplier: [null],
      customer: [null],
    });

    this.filteredStatusOptions = ["pending"];

    this.getSuppliers();
    this.getCustomers();

    this.addLigneTransaction();
    this.handleTypeChange();

    this.activatedRoute.params.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (params: any) => {
        this.id = params["id"];
        if (this.id) this.loadTransaction();
      },
      error: (err) => console.error("Error fetching route params:", err),
    });

    this.transactionForm
      .get("type")
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.handleTypeChange();
      });

    this.transactionForm
      .get("supplier")
      ?.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((event) => {
        console.log(
          "🚀 ~ AddTransactionComponent ~ .subscribe ~ event:",
          event
        );

        this.fetchProducts();
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  get ligneTransaction(): FormArray {
    return this.transactionForm.get("transactionLigne") as FormArray;
  }

  generateReference(): string {
    return `RT-${Date.now()}`;
  }

  addLigneTransaction(item?: any): void {
    if (this.ligneTransaction?.valid) {
      const ligne = this.fb.group({
        _id: [null],
        quantity: [1, [Validators.required, Validators.min(1)]],
        price: [
          { disabled: true, value: 0 },
          [Validators.required, Validators.min(0)],
        ],
        currency: [{ disabled: true, value: null }, [Validators.required]],
        product: [null, [Validators.required]],
      });
      if (item) {
        item.product = item.product?._id || item.product;

        ligne.patchValue(item);
      }

      this.ligneTransaction.push(ligne);
    }
  }

  removeLigneTransaction(index: number): void {
    this.ligneTransaction.removeAt(index);
  }

  onSelectProduct(product: any, index: number): void {
    const productSelected: any = this.productOptions.find(
      (prd) => prd._id == product
    );

    this.ligneTransaction
      .at(index)
      .get("price")
      ?.setValue(productSelected.salePrice);
    this.ligneTransaction
      .at(index)
      .get("currency")
      ?.setValue(productSelected.currency);
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) return;

    const transaction: Transaction = this.transactionForm.getRawValue();

    this.transactionService.getNestedObjectId(transaction, [
      "supplier",
      "customer",
    ]);

    transaction.transactionLigne = transaction.transactionLigne.map((line) =>
      this.transactionService.getNestedObjectId(line, ["product"])
    );

    if (this.id) {
      this.transactionService
        .updateTransactionById(this.id, transaction)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (res) => {
            console.log("🚀 ~ UPDATED ~ onSubmit ~ res:", res);
            this.id = res._id;
            this.patchForm(res);
          },
          error: (err) => console.error("Failed to update transaction:", err),
        });
    } else {
      this.transactionService
        .addTransaction(transaction)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (res) => {
            this.id = res._id;
            this.router.navigate(["/transaction"]);
            this.patchForm(res);
          },
          error: (err) => console.error("Failed to add transaction:", err),
        });
    }
  }

  patchForm(transaction: Partial<Transaction>): void {
    console.log(
      "🚀 ~ AddTransactionComponent ~ patchForm ~ transaction:",
      transaction
    );
    const { transactionLigne, ...rest } = transaction;
    rest.date = new Date(rest.date || "").toISOString().split("T")[0];

    if (rest.supplier) rest.supplier = rest.supplier?._id || rest.supplier;

    if (rest.customer) rest.customer = rest.customer?._id || rest.customer;
    this.transactionForm.patchValue(rest);
    this.transactionForm.get("type")?.disable();
    this.transactionForm.get("date")?.disable();

    this.fetchProducts();

    this.ligneTransaction.clear();
    transactionLigne?.forEach((line) => this.addLigneTransaction(line));

    this.updateStatusOptions(rest.type ?? "", rest.status ?? "");
    if (rest.status) this.filteredStatusOptions.unshift(rest.status);
  }

  updateStatusOptions(type: string, status: string): void {
    const map: any = {
      sale: {
        pending: ["processing", "cancelled"],
        processing: ["cancelled", "shiped"],
        shiped: ["delivred"],
        delivred: ["returned"],
      },
      purchase: {
        pending: ["processing"],
        processing: ["shiped"],
        shiped: ["delivred", "returned"],
      },
    };

    this.filteredStatusOptions = map[type]?.[status] || [];
  }

  loadTransaction(): void {
    this.transactionService
      .getTransactionById(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (transaction) => this.patchForm(transaction),
        error: (err) => console.error("Failed to fetch transaction:", err),
      });
  }

  handleTypeChange(): void {
    const type = this.transactionForm.get("type")?.value;

    const supplierControl = this.transactionForm.get("supplier");
    const customerControl = this.transactionForm.get("customer");

    if (type === "purchase") {
      supplierControl?.setValidators([Validators.required]);
      customerControl?.clearValidators();
      customerControl?.setValue(null);
    } else {
      customerControl?.setValidators([Validators.required]);
      supplierControl?.clearValidators();
      supplierControl?.setValue(null);
    }

    supplierControl?.updateValueAndValidity();
    customerControl?.updateValueAndValidity();

    this.fetchProducts();
  }

  fetchProducts(): void {
    const type = this.transactionForm.get("type")?.value;
    console.log("🚀 ~ AddTransactionComponent ~ fetchProducts ~ type:", type);

    if (type === "sale") {
      this.productService
        .getProducts({ condition: { stockQuantity: { $gt: 0 } } })
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (products) => (this.productOptions = products),
          error: (err) => console.error("Failed to fetch products:", err),
        });
    } else if (type === "purchase") {
      const supplier = this.transactionForm.get("supplier")?.value;
      console.log(
        "🚀 ~ AddTransactionComponent ~ fetchProducts ~ supplier:",
        supplier
      );
      if (supplier) {
        this.productService
          .getProducts({
            condition: { supplier: supplier },
          })
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (products) => (this.productOptions = products),
            error: (err) => console.error("Failed to fetch products:", err),
          });
      }
    }
  }

  getSuppliers(): void {
    this.supplierService
      .getSuppliers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (suppliers) => (this.optionsSuppliers = suppliers),
        error: (err) => console.error("Failed to get suppliers:", err),
      });
  }

  getCustomers(): void {
    this.customerService
      .getCustomers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res) => (this.optionsCustomers = res.data),
        error: (err) => console.error("Failed to get customers:", err),
      });
  }

  getMaxQuantite(product: any) {
    const productSelected: any = this.productOptions.find(
      (prd) => prd._id == product
    );

    return productSelected?.stockQuantity || 1;
  }

  // getFilteredProductOptions(index: number): Product[] {
  //   const selectedProductIds = this.ligneTransaction.controls
  //     .map((ctrl, i) => (i !== index ? ctrl.get("product")?.value : null))
  //     .filter((val) => val !== null);

  //   return this.productOptions.filter(
  //     (product) => !selectedProductIds.includes(product._id)
  //   );
  // }

  // getFilteredProductOptions(index: number) {
  //   let idsToPull = [];

  //   for (const [i, ligneT] of this.ligneTransaction.value.entries()) {
  //     if (i != index) {
  //       idsToPull.push(ligneT.product);
  //     }
  //   }

  //   return this.productOptions.filter(
  //         (product) => prodduct  exist in idsToPull
  //       )
  // }

  getFilteredProductOptions(index: number) {
    const selectedIds = this.ligneTransaction.controls
      .map((ctrl, i) => (i !== index ? ctrl.get("product")?.value : null))
      .filter((id) => id); // filter out null/undefined

    return this.productOptions.filter(
      (product) => !selectedIds.includes(product._id)
    );
  }
}
