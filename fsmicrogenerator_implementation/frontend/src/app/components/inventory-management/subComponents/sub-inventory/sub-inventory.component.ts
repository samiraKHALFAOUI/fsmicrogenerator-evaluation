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
import { Inventory } from "src/app/shared/models/InventoryManagement/Inventory.model";
import { DetailInventoryComponent } from "../../gestion-inventory/detail-inventory/detail-inventory.component";

@Component({
  selector: "app-sub-inventory",
  templateUrl: "./sub-inventory.component.html",
  styleUrls: ["./sub-inventory.component.scss"],
})
export class SubInventoryComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() form!: FormGroup;
  @Input() destination: string = "";
  @Input() relation: string = "";
  @Input() data: Inventory[] = [];
  @Input() currentInventory!: Inventory | undefined;
  key: string = "";

  listPrincipaleHeaders: ListHeader[] = [];
  listPrincipaleCaptionConfig: ListCaptionConfig = {};
  ref!: DynamicDialogRef;
  items: Inventory[] = [];
  operationPhase: "list" | "add/edit" | "detail" | "clone" | "translate" =
    "list";
  dir = document.body.style.direction;
  @Input() productId: string = "";

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private breadcrumbsService: BreadcrumbsService
  ) {}
  ngOnInit(): void {
    if (this.destination === "product" && this.relation === "OneToMany") {
      this.listPrincipaleHeaders = [
        {
          field: "date",
          header: "code_1307",
          sort: true,
          filter: true,
          filterType: "date",
          filterData: [],
          pipes: [{ name: "date", arguments: "dd/MM/yyyy HH:mm" }],
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
          field: "raison",
          header: "code_1949",
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
          field: "price $concat transactionLine.currency.symbolCurrency",
          header: "code_18445",
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
        displayedColumns: true,
        clearTable: true,
        refreshData: true,
        addButton: false,
        selectionType: "single",
        summary: { enabled: true, message: "" },
        actions: {
          clone: false,
          delete: false,
          edit: false,
          detail: false,
          translate: false,
        },
      };
    }

  }

  onDetailClick(event: any) {
    this.ref = this.dialogService.open(DetailInventoryComponent, {
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
        idInventory: event._id,
        independentComponent: false,
        productId: this.productId,
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
