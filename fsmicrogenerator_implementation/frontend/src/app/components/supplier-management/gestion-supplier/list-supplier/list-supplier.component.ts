import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Router, ActivatedRoute } from "@angular/router";
import { SupplierService } from "src/app/shared/services/SupplierManagement/supplier.service";
import { Supplier } from "src/app/shared/models/SupplierManagement/Supplier.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";

@Component({
  selector: "app-list-supplier",
  templateUrl: "./list-supplier.component.html",
  styleUrls: ["./list-supplier.component.scss"],
})
export class ListSupplierComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: Supplier[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private supplierService: SupplierService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.headers = [
      {
        field: "logo",
        header: "code_49",
        sort: false,
        filter: false,
        filterType: "file",
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
        field: "email",
        header: "code_45",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "officePhoneNumber",
        header: "code_18427",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "isActif",
        header: "code_18428",
        sort: true,
        filter: true,
        filterType: "boolean",
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
      selectionType: "multiple",
      addButton: true,
      summary: { enabled: true, message: "" },
      actions: {
        clone: true,
        delete: true,
        edit: true,
        detail: true,
        translate: true,
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
  transformData(data: Supplier[]) {

    this.data = data;
  }

  changeState(event: OnDeleteEvent) {
    this.supplierService
      .changeState(event)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.data = this.data.filter((d: any) => !event.id.includes(d._id));

          this.messagesService.showMessage("deleteSuccess");
        },
        error: (error: any) => {
          this.messagesService.showMessage("deleteError");
        },
      });
  }

  onEditClick(event: any) {
    this.router.navigate([`${this.router.url}/edit`, event._id]);
  }

  onDetailClick(event: any) {
    this.router.navigate([`${this.router.url}/detail`, event._id]);
  }

  onCloneClick(event: any) {
    this.router.navigate([`${this.router.url}/clone`, event._id]);
  }

  onAddClick() {
    this.router.navigate([`${this.router.url}/add`]);
  }

  onTranslateClick(event: any) {
    this.router.navigate([`${this.router.url}/translate`, event._id]);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
