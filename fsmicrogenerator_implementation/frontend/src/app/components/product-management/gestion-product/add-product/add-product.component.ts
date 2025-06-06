import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { DomainService } from "src/app/shared/services/TaxonomyManagement/domain.service";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { ProductService } from "src/app/shared/services/ProductManagement/product.service";
import { Product } from "src/app/shared/models/ProductManagement/Product.model";
import { CurrencyService } from "src/app/shared/services/CurrencyManagement/currency.service";
import { SupplierService } from "src/app/shared/services/SupplierManagement/supplier.service";
import { CategoryService } from "src/app/shared/services/ProductManagement/category.service";
import { Category } from "src/app/shared/models/ProductManagement/Category.model";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"],
})
export class AddProductComponent {
  imageDropZoneConfig: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
    maxFilesize: 1,
    addRemoveLinks: true,
    resizeHeight: 300,
    resizeQuality: 2,
    dictFileTooBig: "Image trop grande, Merci d'en choisir une autre",
    dictRemoveFile: "Supprimer",
    dictCancelUpload: "Annuler",
    dictCancelUploadConfirmation: "Voulez-vous vraiment annuler l'upload ?",
    dictRemoveFileConfirmation: "Voulez-vous vraiment Supprimer ce fichier?",
    acceptedFiles: "image/*",
  };
  selectedImage: any = null;
  optionsCurrency: any[] = [];
  optionsStatus: any[] = [];
  optionsSupplier: any[] = [];
  optionsCategory: any[] = []
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current!: Product | undefined;
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Input() categoryId: string = "";
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  id: any = "";
  domains: any = ["units"];


  @Input() supplierId: string = "";
  @Input() transactionLinesId: string = "";
  constructor(
    private domainService: DomainService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private productService: ProductService,
    private currencyService: CurrencyService,
    private supplierService: SupplierService) {
    this.optionsStatus = this.productService.status;
    this.optionsCurrency = this.currencyService.currencies

    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idProduct")
    ) {
      this.id = this.config.data.idProduct;
      this.supplierId = this.config.data.supplierId;
      this.transactionLinesId = this.config.data.transactionLinesId;
      this.categoryId = this.config.data.categoryId;
      this.independentComponent = false;
      if (this.id) {
        this.getProduct();
      } else {
        this.getDomains();
        this.getSuppliers();
      }
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      reference: [{ value: this.helpers.generateReference('P'), disabled: true }, [Validators.required]],
      category: [this.categoryId ? { value: this.categoryId, disabled: true } : null, [Validators.required]],
      image: [null, []],
      translations: this.fb.group({
        language: [null, []],
        name: [null, [Validators.required]],
        description: [null, []],
      }),
      salePrice: [null, [Validators.required]],
      currency: [this.currencyService.nationalCurrency?._id, [Validators.required]],
      stockQuantity: [{ value: 0, disabled: true }, [Validators.min(0)]],
      unit: [null, []],
      status: [{ value: 'code_18399', disabled: true }, [Validators.required]],
      supplier: [this.supplierId ? { value: this.supplierId, disabled: true } : null, [Validators.required]],
    });
    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "product";
          if (this.independentComponent) {
            if (response["dataR"]["suppliers"]) {
              this.optionsSupplier = response["dataR"]["suppliers"];
            }
            if (response["dataR"]["categories"]) {
              this.transformCategoriesToTree(response["dataR"]["categories"]);
            }
            if (response["dataR"]["domaines"]) {
              this.domains = response["dataR"]["domaines"];
            }
            if (response["dataR"]["data"]) {
              this.patchValueIntoForm(response["dataR"]["data"]);
              this.id = response["dataR"]["data"]._id;
            }

          } else {
            this.activatedRoute.params
              .pipe(takeUntil(this.destroyed$))
              .subscribe({
                next: (params: any) => {
                  this.id = params["id"];
                  if (this.id) this.getProduct();
                },
                error: () => {
                  this.messagesService.showMessage("error");
                },
              });
          }
        },
        error: () => {
          this.messagesService.showMessage("error");
        },
      });

    } else {
      if (this.current) {
        this.id = this.current._id || this.current;
        this.getProduct();
      } else if (!Object.keys(this.config?.data || []).includes("idProduct")) {
        this.getDomains();
      }
    }
  }
  onUploadImageError(event :any) {
    this.messagesService.showMessage("uploadError");
  }

  onUploadImageSuccess(event: any) {
    this.selectedImage = event[0];
  }

  onDeleteImageSuccess(event:any) {
    this.selectedImage = null;
  }

  getDomains() {
    return this.helpers.resolve((res, rej) => {
      this.domainService
        .getDomainsByCode(this.domains)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (domains: any) => {
            this.domains = domains;
            res(domains);
          },
          error: ({ error }: any) => {
            console.error("error", error);
            rej(error);
          },
        });
    });
  }

  getSuppliers() {
    return this.helpers.resolve((res, rej) => {
      this.supplierService
        .getSuppliers({ condition: { isActif: true }, options : {queryOptions: { select: '-purchases -products' } }})
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (results) => {
            this.optionsSupplier = results
            if (this.supplierId) {
              this.form.get('supplier')?.setValue(this.optionsSupplier.find((s) => s._id === this.supplierId) || this.supplierId)
            }
            res(this.optionsSupplier);
          },
          error: ({ error }: any) => {
            console.error("error", error);
            rej(error);
          },
        });
    });
  }



  transformCategoriesToTree(categories: Category[]) {
    this.optionsCategory.splice(0, this.optionsCategory.length, ...this.helpers.dataToTreeNodes(categories, 'subCategories', 'icon', true, 'productManagement'))

  }



  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue
    ) {
      this.id = this.current?._id || this.current;
      this.getProduct();
    } else if (
      this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue &&
      changes["current"].previousValue
    ) {
      this.patchValueIntoForm(changes["current"].currentValue);
    }
  }


  getProduct() {
    let getData = () => {
      return this.helpers.resolve<Product>((res, rej) => {
        this.productService
          .getProductById(this.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              res(result);
            },
            error: ({ error }: any) => {
              console.error("error", error);
              rej(error);
            },
          });
      });
    };

    Promise.all([getData(), this.getDomains()])
      .then((result) => {
        this.patchValueIntoForm(result[0]);
      })
      .catch((error) => {
        console.error("error", error);
        this.messagesService.showMessage("error");
      });
  }

  patchValueIntoForm(data: Product) {
    let result = <Partial<Product>>this.helpers.newObject(data);
    this.optionsSupplier = [result.supplier]
    this.form.get('supplier')?.disable()
    result.category = this.helpers.flatDeep(this.optionsCategory,'children').find((c:any)=>c.key === result.category?._id)
    this.form.patchValue({...result, currency : result.currency?._id});
  }

  addData() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messagesService.showMessage("error", "invalid form");

      // #region invalids controls

      let invalidControls = [];
      for (let key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].status === "INVALID")
          invalidControls.push(key);
      }

      console.error("invalid controls -->", invalidControls);

      // #endregion invalids controls


    } else {
      let newForm = this.helpers.newObject(this.form.getRawValue());
      this.helpers.setValuesByPaths(newForm, [
        ["unit", "data._id"],
        ["category", "data._id"],
        "currency",
        "supplier",
        "inventoryMovements",
      ]);

      if (this.id) {
        this.productService
          .updateProduct(
            this.id,
            this.helpers.convert(newForm, [
              { file: this.selectedImage, title: "image" },
            ])
          )
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {

              this.current = result.data;
              this.messagesService.showMessage("updateSuccess");
            },
            error: () => {
              this.messagesService.showMessage("updateError");
            },
          });
      } else {
        this.productService
          .addProduct(
            this.helpers.convert(newForm, [
              { file: this.selectedImage, title: "image" },
            ])
          )
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.id = result._id;

              this.current = result;

              this.messagesService.showMessage("addSuccess");
            },
            error: () => {
              this.messagesService.showMessage("addError");
            },
          });
      }
    }
  }

  finish() {
    if (this.config?.data || !this.independentComponent) {
      this.refConfig.close({
        data: this.config.data,
        item: this.current,
      });
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
