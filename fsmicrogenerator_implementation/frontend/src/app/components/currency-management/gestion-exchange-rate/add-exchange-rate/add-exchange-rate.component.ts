import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { ExchangeRateService } from "src/app/shared/services/CurrencyManagement/exchangeRate.service";
import { ExchangeRate } from "src/app/shared/models/CurrencyManagement/ExchangeRate.model";
import { CurrencyService } from "src/app/shared/services/CurrencyManagement/currency.service";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-add-exchange-rate",
  templateUrl: "./add-exchange-rate.component.html",
  styleUrls: ["./add-exchange-rate.component.scss"],
})
export class AddExchangeRateComponent {
  optionsRefCurrencyBase: any[] = [];
  optionsRefCurrencyEtrangere: any[] = [];
  defaultDateDate: Date = new Date();
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current!: ExchangeRate | undefined;
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Input() currencyId: string = "";
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  id: any = "";
  selectedTab = 0;
  prevTabIcon = "pi pi-chevron-left";
  nextTabIcon = "pi pi-chevron-right";


  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private exchangeRateService: ExchangeRateService,
    private currencySercive: CurrencyService,
    private secureStorage: SecureStorageService
  ) {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idExchangeRate")
    ) {
      this.id = this.config.data.idExchangeRate;
      this.currencyId = this.config.data.currencyId;
      this.independentComponent = false;
      this.optionsRefCurrencyBase = this.currencySercive.currencies
      this.optionsRefCurrencyEtrangere = this.currencySercive.currencies
      if (this.id) {
        this.getExchangeRate();
      } else {
      }
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      date: [null, []],
      refCurrencyBase: [{ value: this.currencyId, disabled: true }, [Validators.required]],
      refCurrencyEtrangere: [null, [Validators.required]],
      valeurAchat: [null, []],
      valeurVente: [null, []],
      actif: [false, []],
      currency: [[], []],
    });
    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "exchangeRate";
          if (this.independentComponent) {
            if (response["dataR"]["data"]) {
              this.patchValueIntoForm(response["dataR"]["data"]);
              this.id = response["dataR"]["data"]._id;
            }
          } else {
            this.activatedRoute.params
              .pipe(takeUntil(this.destroyed$))
              .subscribe({
                next: (params: any) => {
                  this.id = params["id"];
                  if (this.id) this.getExchangeRate();
                },
                error: (error) => {
                  this.messagesService.showMessage("error");
                },
              });
          }
        },
        error: (error) => {
          this.messagesService.showMessage("error");
        },
      });

    } else {
      if (this.current) {
        this.id = this.current._id || this.current;
        this.getExchangeRate();
      } else if (
        !Object.keys(this.config?.data || []).includes("idExchangeRate")
      ) {
      }
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
      this.getExchangeRate();
    } else if (
      this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue &&
      changes["current"].previousValue
    ) {
      this.patchValueIntoForm(changes["current"].currentValue);
    }
  }

  getExchangeRate() {
    let getData = () => {
      return this.helpers.resolve<ExchangeRate>((res, rej) => {
        this.exchangeRateService
          .getExchangeRateById(this.id)
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
        this.patchValueIntoForm(result[0]);
      })
      .catch((error) => {
        console.error("error", error);
        this.messagesService.showMessage("error");
      });
  }

  patchValueIntoForm(data: ExchangeRate) {
    let result = <Partial<ExchangeRate>>this.helpers.newObject(data);

    if (result.date) result.date = new Date(result.date);
    if (result.refCurrencyBase)
      //@ts-ignore
      result.refCurrencyBase = result.refCurrencyBase._id;
    if (result.refCurrencyEtrangere)
      //@ts-ignore
      result.refCurrencyEtrangere = result.refCurrencyEtrangere._id;

    this.form.patchValue(result);
  }

  prevTab() {
    this.selectedTab--;
  }

  nextTab() {
    this.selectedTab++;
  }

  addData() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messagesService.showMessage("error", "invalid form");

      // #region invalids controls

      let invalidControls = [];
      for (let key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].status === "INVALID")
          invalidControls.push(key);
      }

      console.error("invalid controls -->", invalidControls);

      // #endregion invalids controls


    } else {
      let newForm = this.helpers.newObject(this.form.getRawValue());

      if (this.currencyId) newForm.currency.push(this.currencyId);

      this.helpers.setValuesByPaths(newForm, [
        "refCurrencyBase",
        "refCurrencyEtrangere",
        "currency",
      ]);

      if (this.id) {
        this.exchangeRateService
          .updateExchangeRate(this.id, newForm)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {

              this.current = result.data;
              this.messagesService.showMessage("updateSuccess");
            },
            error: (error: any) => {
              this.messagesService.showMessage(
                "updateError",
                "taux change exist"
              );
            },
          });
      } else {
        this.exchangeRateService
          .addExchangeRate(newForm)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.id = result._id;

              this.current = result;

              this.messagesService.showMessage("addSuccess");
            },
            error: (error: any) => {
              this.messagesService.showMessage("addError", "taux change exist");
            },
          });
      }
    }
  }

  finish() {
    if (this.config?.data || !this.independentComponent) {
      this.refConfig.close({
        data: this.config.data,
        item: this.current,
      });
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
