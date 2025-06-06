import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Router, ActivatedRoute } from "@angular/router";
import { TransactionLineService } from "src/app/shared/services/TransactionManagement/transactionLine.service";
import { TransactionLine } from "src/app/shared/models/TransactionManagement/TransactionLine.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";

@Component({
  selector: "app-list-transaction-line",
  templateUrl: "./list-transaction-line.component.html",
  styleUrls: ["./list-transaction-line.component.scss"],
})
export class ListTransactionLineComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: TransactionLine[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private transactionLineService: TransactionLineService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.headers = [
      {
        field: "quantity",
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
      addButton: true,
      selectionType: "multiple",
      summary: { enabled: true, message: "" },
      actions: {
        clone: true,
        delete: true,
        edit: true,
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
  transformData(data: TransactionLine[]) {

    this.data = data;
  }

  changeState(event: OnDeleteEvent) {
    this.transactionLineService
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

  onAddClick() {
    this.router.navigate([`${this.router.url}/add`]);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
