import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { CurrencyService } from "src/app/shared/services/CurrencyManagement/currency.service";
import { Currency } from "src/app/shared/models/CurrencyManagement/Currency.model";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";


@Component({
  selector: "app-detail-currency",
  templateUrl: "./detail-currency.component.html",
  styleUrls: ["./detail-currency.component.scss"],
})
export class DetailCurrencyComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current: Currency | undefined;
  @Output() onDetailFinish: EventEmitter<any> = new EventEmitter();
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  data!: Currency | undefined;
  id: any = "";
  cloneMode: boolean = false;
  selectedTab = 0;
  prevTabIcon = "pi pi-chevron-left";
  nextTabIcon = "pi pi-chevron-right";

  constructor(
    private activatedRoute: ActivatedRoute,
    private messagesService: MessagesService,
    private location: Location,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private currencyService: CurrencyService,
    private secureStorage: SecureStorageService
  ) {}
  ngOnInit(): void {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idCurrency")
    ) {
      this.id = this.config.data.idCurrency;
      this.independentComponent = false;
      if (this.id) {
        this.getCurrency();
      }
    } else if (this.current) {
      this.data = this.current;
      this.id = this.current._id;
      this.independentComponent = false;
      if (this.id) {
        this.getCurrency();
      }
    } else {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "currency";
          if (this.independentComponent)
            this.transformData(response["dataR"]["data"]);
        },
      });
    }

    if (this.secureStorage.getItem('lang') === "ar") {
      [this.prevTabIcon, this.nextTabIcon] = [
        this.nextTabIcon,
        this.prevTabIcon,
      ];
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue
    ) {
      //@ts-ignore
      this.id = this.current?._id || this.current;
      this.getCurrency();
    }
  }

  getCurrency() {
    let getData = () => {
      return this.helpers.resolve<Currency>((res, rej) => {
        this.currencyService
          .getCurrencyById(this.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              res(result);
            },
            error: ({ error }: any) => {
              console.error("error", error);
              rej(error);
            },
          });
      });
    };

    Promise.all([getData()])
      .then((result) => {
        this.transformData(result[0]);
      })
      .catch((error) => {
        console.error("error", error);
        this.messagesService.showMessage("error");
      });
  }
  transformData(result: Currency) {
    this.data = result;
  }

  prevTab() {
    this.selectedTab--;
  }

  nextTab() {
    this.selectedTab++;
  }

  goBack() {
    if (!this.independentComponent) {
      if (this.config?.data) {
        this.refConfig.close({ data: this.config.data });
      } else this.onDetailFinish.emit();
    } else {
      this.location.back();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
