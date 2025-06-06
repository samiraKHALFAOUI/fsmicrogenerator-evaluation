import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Router, ActivatedRoute } from "@angular/router";
import { TransactionService } from "src/app/shared/services/TransactionManagement/transaction.service";
import { Transaction } from "src/app/shared/models/TransactionManagement/Transaction.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";

@Component({
  selector: "app-list-transaction",
  templateUrl: "./list-transaction.component.html",
  styleUrls: ["./list-transaction.component.scss"],
})
export class ListTransactionComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: Transaction[] = [];
  componentName : string =''

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private transactionService: TransactionService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.headers = [
      {
        field: "reference",
        header: "code_4545",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "savedBy.translations.nom $concat savedBy.translations.prenom",
        header: "code_18443",
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
          this.componentName = response['option']
          this.transformData(response.dataR);
        }
      });
  }
  transformData(data: Transaction[]) {
    for (let d of data) {
      if (d.registrationDate) d.registrationDate = new Date(d.registrationDate);
    }
    this.data = data;
  }

  changeState(event: OnDeleteEvent) {
    this.transactionService
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
