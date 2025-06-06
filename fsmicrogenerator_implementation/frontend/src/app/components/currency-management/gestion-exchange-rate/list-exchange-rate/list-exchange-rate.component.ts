import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Router, ActivatedRoute } from "@angular/router";
import { ExchangeRateService } from "src/app/shared/services/CurrencyManagement/exchangeRate.service";
import { ExchangeRate } from "src/app/shared/models/CurrencyManagement/ExchangeRate.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";

@Component({
  selector: "app-list-exchange-rate",
  templateUrl: "./list-exchange-rate.component.html",
  styleUrls: ["./list-exchange-rate.component.scss"],
})
export class ListExchangeRateComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: ExchangeRate[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private exchangeRateService: ExchangeRateService,
    private messagesService: MessagesService
  ) {}


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
        field: "refCurrencyBase",
        header: "code_13160",
        sort: true,
        filter: true,
        filterType: "template",
        filterData: [],
      },
      {
        field: "refCurrencyEtrangere",
        header: "code_13161",
        sort: true,
        filter: true,
        filterType: "template",
        filterData: [],
      },
      {
        field: "valeurAchat",
        header: "code_13162",
        sort: true,
        filter: true,
        filterType: "numeric",
        filterData: [],
      },
      {
        field: "valeurVente",
        header: "code_13163",
        sort: true,
        filter: true,
        filterType: "numeric",
        filterData: [],
      },
      {
        field: "actif",
        header: "code_4316",
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
      addButton: true,
      selectionType: "multiple",
      summary: {
        enabled: true,
        message: "",
      },
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
  transformData(data: ExchangeRate[]) {
    for (let d of data) {
      if (d.date) d.date = new Date(d.date);
    }
    this.data = data;
  }

  changeState(event: OnDeleteEvent) {
    this.exchangeRateService
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

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
