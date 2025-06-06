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
import { TransactionService } from "src/app/shared/services/TransactionManagement/transaction.service";
import { Transaction } from "src/app/shared/models/TransactionManagement/Transaction.model";
import { AddTransactionComponent } from "../../gestion-transaction/add-transaction/add-transaction.component";
import { DetailTransactionComponent } from "../../gestion-transaction/detail-transaction/detail-transaction.component";

@Component({
  selector: "app-sub-transaction",
  templateUrl: "./sub-transaction.component.html",
  styleUrls: ["./sub-transaction.component.scss"],
})
export class SubTransactionComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() form!: FormGroup;
  @Input() destination: string = "";
  @Input() relation: string = "";
  @Input() data: Transaction[] = [];
  @Input() currentTransaction!: Transaction | undefined;
  @Input() products: any = []
  key: string = "";
  listHeaders: ListHeader[] = [];
  listCaptionConfig: ListCaptionConfig = {};
  listPrincipaleHeaders: ListHeader[] = [];
  listPrincipaleCaptionConfig: ListCaptionConfig = {};
  ref!: DynamicDialogRef;
  items: Transaction[] = [];
  operationPhase: "list" | "add/edit" | "detail" | "clone" | "translate" =
    "list";
  dir = document.body.style.direction;
  @Input() supplierId: string = "";
  @Input() customerId: string = "";

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private transactionService: TransactionService,
    private helpers: HelpersService,
    private messagesService: MessagesService,
    private breadcrumbsService: BreadcrumbsService
  ) { }
  ngOnInit(): void {
      this.listPrincipaleHeaders = [
        {
          field: "reference",
          header: "code_4545",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "type",
          header: "code_135",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "registrationDate",
          header: "code_18442",
          sort: true,
          filter: true,
          filterType: "date",
          filterData: [],
          pipes: [{ name: "date", arguments: "dd/MM/yyyy HH:mm" }],
        },
        {
          field: "status",
          header: "code_8706",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
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
        summary: { enabled: true, message: "" },
        actions: {
          clone: false,
          delete: true,
          edit: true,
          detail: true,
          translate: false,
        },
      };

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


  changeState(event: OnDeleteEvent) {
    this.transactionService
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

  onAddClick() {
      this.ref = this.dialogService.open(AddTransactionComponent, {
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
          idTransaction: null,
          independentComponent: false,
          supplierId: this.supplierId,
          customerId: this.customerId,
          products: this.products
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

  onAddItem(data: Transaction) {
    this.form.setValue(data);
  }

  onEditClick(event: any) {
    this.ref = this.dialogService.open(AddTransactionComponent, {
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
        idTransaction: event._id,
        independentComponent: false,
        supplierId: this.supplierId,
        customerId: this.customerId,
        products: this.products
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
    this.ref = this.dialogService.open(DetailTransactionComponent, {
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
        idTransaction: event._id,
        independentComponent: false,
        supplierId: this.supplierId,
        customerId: this.customerId,
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
