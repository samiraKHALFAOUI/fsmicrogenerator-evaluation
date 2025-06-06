import { Component } from "@angular/core";
import { Input, SimpleChanges } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { ExchangeRateService } from "src/app/shared/services/CurrencyManagement/exchangeRate.service";
import { ExchangeRate } from "src/app/shared/models/CurrencyManagement/ExchangeRate.model";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-clone-exchange-rate",
  templateUrl: "./clone-exchange-rate.component.html",
  styleUrls: ["./clone-exchange-rate.component.scss"],
})
export class CloneExchangeRateComponent {
  optionsRefCurrencyBase: any[] = [];
  optionsRefCurrencyEtrangere: any[] = [];
  defaultDateDate: Date = new Date("2024-04-06T09:22:04.454Z");
  dataRefCurrencyBase: any = [];
  dataRefCurrencyEtrangere: any = [];
  dataCurrency: any = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  form!: FormGroup;
  id: any = "";
  newID: string = "";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Input() current!: ExchangeRate | undefined;
  @Input() currencyId: string = "";

  clonedElement!: ExchangeRate | undefined;
  selectedTab = 0;
  prevTabIcon = "pi pi-chevron-left";
  nextTabIcon = "pi pi-chevron-right";


  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private exchangeRateService: ExchangeRateService,
    private secureStorage: SecureStorageService,
  ) {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idExchangeRate")
    ) {
      this.id = this.config.data.idExchangeRate;
      this.currencyId = this.config.data.currencyId;
      this.independentComponent = false;
      this.getExchangeRate();
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      date: [null, []],
      refCurrencyBase: [{ value: null, disabled: true }, [Validators.required]],
      refCurrencyEtrangere: [null, [Validators.required]],
      valeurAchat: [null, []],
      valeurVente: [null, []],
      actif: [null, []],
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
          }
        },
        error: (error) => {
          this.messagesService.showMessage("error");
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
    // this.dataRefCurrencyBase = data.refCurrencyBase;
    // delete result.refCurrencyBase;
    // this.dataRefCurrencyEtrangere = data.refCurrencyEtrangere;
    // delete result.refCurrencyEtrangere;
    this.dataCurrency = result.currency;
    delete result.currency;
    if (result.refCurrencyBase)
      //@ts-ignore
      result.refCurrencyBase = this.currencyId;
    if (result.refCurrencyEtrangere)
      //@ts-ignore
      result.refCurrencyEtrangere = result.refCurrencyEtrangere._id;

    if (result.date) result.date = new Date(result.date);
    this.form.patchValue(result);
  }

  cloneData() {

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

      this.exchangeRateService
        .addExchangeRate(newForm)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (result) => {
            this.newID = result._id;
            this.clonedElement = result;
            this.messagesService.showMessage("cloneSuccess");
          },
          error: (error: any) => {
            this.messagesService.showMessage("cloneError", "taux change exist");
          },
        });
    }
  }

  finish() {
    if (this.config?.data || !this.independentComponent) {
      this.refConfig.close({
        data: this.config.data,
        clonedElement: this.clonedElement,
      });
    } else {

      //back to prev page
      this.location.back();
      //or call router link
    }
  }

  prevTab() {
    this.selectedTab--;
  }

  nextTab() {
    this.selectedTab++;
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
