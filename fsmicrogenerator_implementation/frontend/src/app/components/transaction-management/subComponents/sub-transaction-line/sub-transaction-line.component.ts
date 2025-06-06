import { Component, SimpleChanges } from "@angular/core";
import { Input } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup } from "@angular/forms";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { BreadcrumbsService } from "src/app/shared/services/defaultServices/breadcrumbs.service";
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
import { TransactionLineService } from "src/app/shared/services/TransactionManagement/transactionLine.service";
import { TransactionLine } from "src/app/shared/models/TransactionManagement/TransactionLine.model";
import { AddTransactionLineComponent } from "../../gestion-transaction-line/add-transaction-line/add-transaction-line.component";
import { DetailTransactionLineComponent } from "../../gestion-transaction-line/detail-transaction-line/detail-transaction-line.component";
import { ProductService } from "src/app/shared/services/ProductManagement/product.service";

@Component({
  selector: "app-sub-transaction-line",
  templateUrl: "./sub-transaction-line.component.html",
  styleUrls: ["./sub-transaction-line.component.scss"],
})
export class SubTransactionLineComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() transactionId: string = "";
  @Input() form!: FormGroup;
  @Input() destination: string = "";
  @Input() relation: string = "";
  @Input() data: TransactionLine[] = [];
  @Input() currentTransactionLine!: TransactionLine | undefined;
  key: string = "";
  listHeaders: ListHeader[] = [];
  listCaptionConfig: ListCaptionConfig = {};
  listPrincipaleHeaders: ListHeader[] = [];
  listPrincipaleCaptionConfig: ListCaptionConfig = {};
  ref!: DynamicDialogRef;
  items: TransactionLine[] = [];
  operationPhase: "list" | "add/edit" | "detail" | "clone" | "translate" =
    "list";
  dir = document.body.style.direction;
  @Input() productId: string = "";
  @Input() inventoryMovementId: string = "";
  @Input() products: any[] = []
  @Input() currencies: any = []
  @Input() transactionType: any = []
  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private transactionLineService: TransactionLineService,
    private messagesService: MessagesService,
    private breadcrumbsService: BreadcrumbsService,
    private productService : ProductService
  ) { }
  ngOnInit(): void {

    if (this.destination === "transaction" && this.relation === "OneToMany") {
      this.listPrincipaleHeaders = [
        {
          field: "product.image",
          header: "code_204",
          sort: false,
          filter: false,
          filterType: "file",
          filterData: [],
          serviceName: 'productManagement'
        },
        {
          field: "product.translations.name",
          header: "code_18393",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },

        {
          field: "product.category.translations.name",
          header: "code_18390",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "quantity $concat product.unit.translations.designation",
          header: "code_18418",
          sort: true,
          filter: true,
          filterType: "numeric",
          filterData: [],
        },
        {
          field: "price",
          header: "code_18445",
          sort: true,
          filter: true,
          filterType: "numeric",
          filterData: [],
        },
        {
          field: "totalAmount $concat currency.symbolCurrency",
          header: "code_18479",
          sort: true,
          filter: true,
          filterType: "numeric",
          filterData: [],
        },
      ];
      this.listPrincipaleCaptionConfig = {
        globalFilter: true,
        csv: false,
        pdf: false,
        xls: false,
        selection: false,
        displayedColumns: false,
        clearTable: true,
        refreshData: true,
        addButton: true,
        selectionType: "multiple",
        summary: { enabled: true, message: "" },
        actions: {
          clone: false,
          delete: true,
          edit: true,
          detail: true,
          translate: false,
        },
      };

    }

    if (this.mode === "detail") {
      this.listPrincipaleCaptionConfig.addButton = false;
      this.listPrincipaleCaptionConfig.actions = {
        clone: false,
        delete: false,
        edit: false,
        detail: true,
      };
      this.listPrincipaleCaptionConfig.selectionType = "single";
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data'] && changes['data'].currentValue){
      this.data.map((d)=>d['totalAmount'] = d.quantity*d.price)
    }

  }


  changeState(event: OnDeleteEvent) {
    this.transactionLineService
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

  getProducts(cb?: () => void) {
    if (this.transactionType === 'sales' && !this.products?.length ) {
      this.productService
        .getProducts({
          condition: { stockQuantity: { $gt: 0 } },
          options: { queryOptions: { select: '-category' } }
        })
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (result) => {
            this.products = result;
            typeof cb === "function" && cb();
          },
          error: ({ error }: any) => {
            console.error("error", error);
            this.messagesService.showMessage("error");
          },
        });
    }else{
      typeof cb === "function" && cb();
    }


  }
  onAddClick() {
    this.getProducts(() => {
    this.ref = this.dialogService.open(AddTransactionLineComponent, {
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
        idTransactionLine: null,
        independentComponent: false,
        transactionId: this.transactionId,
        products: this.products,
        currencies: this.currencies
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
  })
  }

  onAddItem(data: TransactionLine) {
    this.form.setValue(data);
  }

  onEditClick(event: any) {
    this.ref = this.dialogService.open(AddTransactionLineComponent, {
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
        idTransactionLine: event._id,
        independentComponent: false,
        transactionId: this.transactionId,
        products: this.products,
        currencies: this.currencies
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
    this.ref = this.dialogService.open(DetailTransactionLineComponent, {
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
        idTransactionLine: event._id,
        independentComponent: false,
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

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
