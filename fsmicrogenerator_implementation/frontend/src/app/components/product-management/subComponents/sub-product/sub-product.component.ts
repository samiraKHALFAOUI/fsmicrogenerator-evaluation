import { Component } from "@angular/core";
import { Input } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup } from "@angular/forms";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { BreadcrumbsService } from "src/app/shared/services/defaultServices/breadcrumbs.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng/dynamicdialog";
import { DynamicTableComponent } from "src/app/shared/components/dynamic-table/dynamic-table.component";
import { ProductService } from "src/app/shared/services/ProductManagement/product.service";
import { Product } from "src/app/shared/models/ProductManagement/Product.model";
import { CloneProductComponent } from "../../gestion-product/clone-product/clone-product.component";
import { AddProductComponent } from "../../gestion-product/add-product/add-product.component";
import { DetailProductComponent } from "../../gestion-product/detail-product/detail-product.component";
import { TranslateProductComponent } from "../../gestion-product/translate-product/translate-product.component";

@Component({
  selector: "app-sub-product",
  templateUrl: "./sub-product.component.html",
  styleUrls: ["./sub-product.component.scss"],
})
export class SubProductComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() categoryId: string = "";
  @Input() form!: FormGroup;
  @Input() destination: string = "";
  @Input() relation: string = "";
  @Input() data: Product[] = [];
  @Input() currentProduct!: Product | undefined;
  key: string = "";
  listHeaders: ListHeader[] = [];
  listCaptionConfig: ListCaptionConfig = {};
  listPrincipaleHeaders: ListHeader[] = [];
  listPrincipaleCaptionConfig: ListCaptionConfig = {};
  ref!: DynamicDialogRef;
  items: Product[] = [];
  operationPhase: "list" | "add/edit" | "detail" | "clone" | "translate" =
    "list";
  dir = document.body.style.direction;
  @Input() supplierId: string = "";
  @Input() transactionLinesId: string = "";

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private productService: ProductService,
    private helpers: HelpersService,
    private messagesService: MessagesService,
    private breadcrumbsService: BreadcrumbsService
  ) { }
  ngOnInit(): void {
    if (this.relation === "OneToMany") {
      this.listPrincipaleHeaders = [
        {
          field: "image",
          header: "code_204",
          sort: false,
          filter: false,
          filterType: "file",
          filterData: [],
        },
        {
          field: "reference",
          header: "code_2665",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "category.translations.name",
          header: "code_18390",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "translations.name",
          header: "code_18391",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "salePrice $concat currency.symbolCurrency",
          header: "code_18394",
          sort: true,
          filter: true,
          filterType: "numeric",
          filterData: [],
        },
        {
          field: "stockQuantity $concat unit.translations.designation",
          header: "code_18396",
          sort: true,
          filter: true,
          filterType: "numeric",
          filterData: [],
        },
        {
          field: "status",
          header: "code_8706",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
          colorize: {
            green: 'code_18398',
            red: 'code_18399',
            orange: 'code_18400'
          }
        },
      ];
      this.listPrincipaleCaptionConfig = {
        globalFilter: true,
        csv: true,
        pdf: true,
        xls: true,
        selection: true,
        displayedColumns: true,
        clearTable: true,
        refreshData: true,
        addButton: true,
        selectionType: "multiple",
        summary: {
          enabled: true,
          message: "In total there are {{ data.length }} elements.",
        },
        actions: {
          clone: true,
          delete: true,
          edit: true,
          detail: true,
          translate: true,
        },
      };

      this.listHeaders = [
        {
          field: "image",
          header: "code_204",
          sort: false,
          filter: false,
          filterType: "file",
          filterData: [],
        },
        {
          field: "reference",
          header: "code_2665",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "category.translations.name",
          header: "code_18390",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "translations.name",
          header: "code_18391",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "supplier.translations.name",
          header: "code_18426",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "salePrice $concat currency.symbolCurrency",
          header: "code_18394",
          sort: true,
          filter: true,
          filterType: "numeric",
          filterData: [],
        },
        {
          field: "stockQuantity $concat unit.translations.designation",
          header: "code_18396",
          sort: true,
          filter: true,
          filterType: "numeric",
          filterData: [],
        },
        {
          field: "status",
          header: "code_8706",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
          colorize: {
            green: 'code_18398',
            red: 'code_18399',
            orange: 'code_18400'
          }
        },
      ];
      this.listCaptionConfig = {
        globalFilter: true,
        csv: true,
        pdf: true,
        xls: true,
        selection: true,
        displayedColumns: true,
        clearTable: true,
        refreshData: true,
        addButton: false,
        selectionType: "multiple",
        summary: {
          enabled: true,
          message: "In total there are {{ data.length }} elements.",
        },
        actions: {
          clone: false,
          delete: false,
          detail: false,
          edit: false,
          translate: false,
        },
      };
    }
    if (this.destination != 'supplier') {
      this.listPrincipaleHeaders.push({
        field: "supplier.translations.name",
        header: "code_18426",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      })
    }
    if (this.mode === "clone") {
      this.listPrincipaleCaptionConfig.actions = { clone: true, close: true };
      this.listPrincipaleCaptionConfig.addButton = false;
    } else if (this.mode === "detail") {
      this.listPrincipaleCaptionConfig.addButton = false;
      this.listPrincipaleCaptionConfig.actions = {
        clone: false,
        delete: false,
        edit: false,
        detail: true,
      };
      this.listPrincipaleCaptionConfig.selectionType = "single";
    } else if (this.mode === "translate") {
      this.listPrincipaleCaptionConfig.addButton = false;
      this.listPrincipaleCaptionConfig.actions = {
        translate: true,
      };
      this.listPrincipaleCaptionConfig.selectionType = "single";
    }
  }
  getItems(cb?: () => void) {
    if (this.destination === "supplier" && this.relation === "OneToMany") {
      this.key = "supplier";
    } else if (
      this.destination === "transactionLine" &&
      this.relation === "ManyToOne"
    ) {
      this.key = "transactionLines";
    }
    else if (this.destination === "category" && this.relation === "OneToMany") {
      this.key = "category";
    }

    this.productService
      .getProducts({
        condition: this.relation?.includes("ToOne")
          ? {}
          : { _id: { $nin: this.data?.map((d: any) => d._id) } },
        options: {
          projection: {
            "translations._id": 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      })
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result) => {
          this.items = result;
          typeof cb === "function" && cb();
        },
        error: ({ error }: any) => {
          console.error("error", error);
          this.messagesService.showMessage("error");
        },
      });
  }

  openListDialog() {
    this.getItems(() => {
      this.ref = this.dialogService.open(DynamicTableComponent, {
        header: "Select Item(s)", // if you want you can change this to a i18n value
        width: "90vw",
        maximizable: true,
        contentStyle: {
          "max-height": "fit-content",
          overflow: "auto",
          height: "100vh",
        },
        duplicate: true,
        baseZIndex: 1,
        data: {
          data: this.items,
          serviceName: "productManagement",
          headers: this.listHeaders,
          captionConfig: {
            ...this.listCaptionConfig,
            actions: {
              ...this.listCaptionConfig.actions,
              close: true,
            },
          },
        },
      });

      this.ref.onClose
        .pipe(takeUntil(this.destroyed$))
        .subscribe((clonedData?: Product | Product[]) => {
          if (clonedData != undefined) {
            if (this.relation === "OneToMany" && clonedData.length) {
              let tempClonedData = <Partial<Product>[]>clonedData;
              if (this.key === 'supplier')
                this.productService
                  .addManyProduct(
                    tempClonedData.map((d) => {
                      delete d._id;
                      // delete the attributes that have a oneToMany relation
                      delete d.inventoryMovements
                      delete d.transactionLines
                      d.stockQuantity = 0
                      d.status = 'code_18399'
                      d[this.key] = this.supplierId;
                      this.helpers.setValuesByPaths(d, [
                        "unit",
                        "category",
                        "supplier",
                        "inventoryMovements",
                      ]);

                      return d;
                    })
                  )
                  .pipe(takeUntil(this.destroyed$))
                  .subscribe({
                    next: (result) => {
                      if (this.mode === "clone") {
                        for (let r of result) r["cloned"] = true;
                        this.data.push(...result);
                      }
                      if (this.form)
                        this.form?.setValue([...result, ...this.data]);
                      this.messagesService.showMessage("cloneSuccess");
                    },
                    error: ({ error }: any) => {
                      console.error("error", error);
                      this.messagesService.showMessage("cloneError");
                    },
                  });
            } else if (this.relation === "OneToOne") {
              let tempClonedData = <Partial<Product>>clonedData;

              delete tempClonedData._id;
              // delete the attributes that have a oneToMany relation
              delete tempClonedData.category;
              tempClonedData[this.key] = this.categoryId;
              this.helpers.setValuesByPaths(tempClonedData, [
                "unit",
                "category",
                "supplier",
                "inventoryMovements",
              ]);

              this.productService
                .addProduct(tempClonedData)
                .pipe(takeUntil(this.destroyed$))
                .subscribe({
                  next: (result) => {
                    this.form?.setValue(result);
                    this.messagesService.showMessage("cloneSuccess");
                  },
                  error: ({ error }: any) => {
                    console.error("error", error);
                    this.messagesService.showMessage("cloneError");
                  },
                });
            } else if (this.relation === "ManyToMany" && clonedData.length) {
              let tempClonedData = <Product[]>clonedData;

              this.productService
                .updateManyProduct({
                  ids: tempClonedData.map((d) => d._id),
                  data: {
                    $addToSet: (() => {
                      switch (this.destination) {
                        default:
                          return {};
                      }
                    })(),
                  },
                })
                .pipe(takeUntil(this.destroyed$))
                .subscribe({
                  next: (result) => {
                    this.data.push(...tempClonedData);
                    this.form?.setValue(this.data);
                    this.messagesService.showMessage("cloneSuccess");
                  },
                  error: ({ error }: any) => {
                    console.error("error", error);
                    this.messagesService.showMessage("cloneError");
                  },
                });
            }
          }
        });
    });
  }

  changeState(event: OnDeleteEvent) {
    this.productService
      .changeState(event)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result) => {
          for (let id of event.id) {
            this.data.splice(
              this.data.findIndex((d: any) => d._id === id),
              1
            );
          }
          if (this.form) {
            this.form.setValue(this.data);
          }
          this.messagesService.showMessage("deleteSuccess");
        },
        error: (error: any) => {
          this.messagesService.showMessage("deleteError");
        },
      });
  }

  onTranslateClick(event: any) {
    this.ref = this.dialogService.open(TranslateProductComponent, {
      width: "90vw",
      maximizable: true,
      contentStyle: {
        "max-height": "fit-content",
        overflow: "auto",
        height: "100vh",
      },
      duplicate: true,
      baseZIndex: 1,
      data: {
        idProduct: event._id,
        independentComponent: false,
        supplierId: this.supplierId,
        transactionLinesId: this.transactionLinesId,
      },
    });
    this.ref.onClose.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data != undefined) {
        if (data?.item) {
          const i = this.data.findIndex((x) => x._id === data.item._id);
          this.data[i] = data?.item;
        }
      }
      delete this.config.data;
      this.breadcrumbsService.removeBreadcrumb();
    });
  }

  onAddClick() {
    this.ref = this.dialogService.open(AddProductComponent, {
      width: "90vw",
      maximizable: true,
      contentStyle: {
        "max-height": "fit-content",
        overflow: "auto",
        height: "100vh",
      },
      duplicate: true,
      baseZIndex: 1,
      data: {
        idProduct: null,
        independentComponent: false,
        supplierId: this.supplierId,
        transactionLinesId: this.transactionLinesId,
        categoryId: this.categoryId,
      },
    });
    this.ref.onClose.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data != undefined) {
        if (data?.item) {
          this.data.push(data.item);
          if (this.form) this.form.setValue(this.data);
        }
      }
      delete this.config.data;
      this.breadcrumbsService.removeBreadcrumb();
    });
  }

  onAddItem(data: Product) {
    this.form.setValue(data);
  }

  onEditClick(event: any) {
    this.ref = this.dialogService.open(AddProductComponent, {
      width: "90vw",
      maximizable: true,
      contentStyle: {
        "max-height": "fit-content",
        overflow: "auto",
        height: "100vh",
      },
      duplicate: true,
      baseZIndex: 1,
      data: {
        idProduct: event._id,
        independentComponent: false,
        supplierId: this.supplierId,
        transactionLinesId: this.transactionLinesId,
        categoryId: this.categoryId,
      },
    });
    this.ref.onClose.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data != undefined) {
        if (data?.item) {
          const i = this.data.findIndex((x) => x._id === data.item._id);
          this.data[i] = data?.item;

          if (this.form) this.form.setValue(this.data);
        }
      }
      delete this.config.data;
      this.breadcrumbsService.removeBreadcrumb();
    });
  }

  onDetailClick(event: any) {
    this.ref = this.dialogService.open(DetailProductComponent, {
      width: "90vw",
      maximizable: true,
      contentStyle: {
        "max-height": "fit-content",
        overflow: "auto",
        height: "100vh",
      },
      duplicate: true,
      baseZIndex: 1,
      data: {
        idProduct: event._id,
        independentComponent: false,
        supplierId: this.supplierId,
        transactionLinesId: this.transactionLinesId,
      },
    });
    this.ref.onClose.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data != undefined) {
        if (data?.clonedElement) {
        }
      }
      delete this.config.data;
      this.breadcrumbsService.removeBreadcrumb();
    });
  }

  onDetailFinish() {
    this.operationPhase = "list";
  }

  onCloneClick(event: any) {
    this.ref = this.dialogService.open(CloneProductComponent, {
      width: "90vw",
      maximizable: true,
      contentStyle: {
        "max-height": "fit-content",
        overflow: "auto",
        height: "100vh",
      },
      duplicate: true,
      baseZIndex: 1,
      data: {
        idProduct: event._id,
        independentComponent: false,
        supplierId: this.supplierId,
        transactionLinesId: this.transactionLinesId,
        categoryId: this.categoryId,
      },
    });
    this.ref.onClose.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data != undefined) {
        if (data?.clonedElement) {
          this.form.setValue([...this.form.value, data.clonedElement]);
          this.data.push({ ...data.clonedElement, cloned: true });
        }
      }
      delete this.config.data;
      this.breadcrumbsService.removeBreadcrumb();
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
