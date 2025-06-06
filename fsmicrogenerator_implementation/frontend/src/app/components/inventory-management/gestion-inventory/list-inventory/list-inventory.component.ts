import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
} from "src/app/shared/models/defaultModels/List.model";
import { ActivatedRoute } from "@angular/router";
import { Inventory } from "src/app/shared/models/InventoryManagement/Inventory.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { DetailInventoryComponent } from "../detail-inventory/detail-inventory.component";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { BreadcrumbsService } from "src/app/shared/services/defaultServices/breadcrumbs.service";

@Component({
  selector: "app-list-inventory",
  templateUrl: "./list-inventory.component.html",
  styleUrls: ["./list-inventory.component.scss"],
})
export class ListInventoryComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: Inventory[] = [];
  ref!: DynamicDialogRef;


  constructor(
    private activatedRoute: ActivatedRoute,
    private messagesService: MessagesService,
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private breadcrumbsService: BreadcrumbsService
  ) { }

  ngOnInit(): void {
    this.headers = [
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
        filterData: ["code_18416","code_18417"],
      },
      {
        field: "raison",
        header: "code_1949",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: ["code_18482","code_18483","code_18484","code_18485","code_18486","code_18487"],
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
    this.captionConfig = {
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
      summary: { enabled: true, message: "" },
      actions: {
        clone: false,
        delete: false,
        edit: false,
        detail: true,
        translate: false,
      },
    };
    this.activatedRoute.data
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        if (response.dataR.error) {
          this.messagesService.showMessage(
            "error",
            "error accrued while getting data"
          );
        } else {
          this.transformData(response.dataR);
        }
      });
  }
  transformData(data: Inventory[]) {
    for (let d of data) {
      if (d.date) d.date = new Date(d.date);
    }
    this.data = data;
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
        inventory : event,
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



  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
