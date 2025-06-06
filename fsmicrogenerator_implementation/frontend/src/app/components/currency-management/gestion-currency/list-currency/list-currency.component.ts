import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Router, ActivatedRoute } from "@angular/router";
import { CurrencyService } from "src/app/shared/services/CurrencyManagement/currency.service";
import { Currency } from "src/app/shared/models/CurrencyManagement/Currency.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";

@Component({
  selector: "app-list-currency",
  templateUrl: "./list-currency.component.html",
  styleUrls: ["./list-currency.component.scss"],
})
export class ListCurrencyComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: Currency[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private currencyService: CurrencyService,
    private messagesService: MessagesService
  ) {}


ngOnInit(): void {
    this.headers = [
      {
        field: "typeCurrency",
        header: "code_13198",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "currency",
        header: "code_18446",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "symbolCurrency",
        header: "code_562",
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
      selectionType: "multiple",
      addButton: true,
      summary: { enabled: true, message: "" },
      actions: {
        clone: false,
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
  transformData(data: Currency[]) {

    this.data = data;
  }

  changeState(event: OnDeleteEvent) {
    this.currencyService
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
