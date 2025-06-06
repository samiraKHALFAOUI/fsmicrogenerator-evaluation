import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { TransactionService } from "src/app/shared/services/TransactionManagement/transaction.service";
import { Transaction } from "src/app/shared/models/TransactionManagement/Transaction.model";
import { User } from "src/app/shared/models/AccountManagement/User.model";
import { UserService } from "src/app/shared/services/AccountManagement/user.service";
import { CurrencyService } from "src/app/shared/services/CurrencyManagement/currency.service";
import { ExchangeRateService } from "src/app/shared/services/CurrencyManagement/exchangeRate.service";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-add-transaction",
  templateUrl: "./add-transaction.component.html",
  styleUrls: ["./add-transaction.component.scss"],
})
export class AddTransactionComponent {
  optionsType: any[] = [];
  maxDateRegistrationDate!: Date
  optionsStatus: any[] = [];
  optionsSavedBy: any[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current!: Transaction | undefined;
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  id: any = "";
  totalAmount: number = 0
  nationalCurrency: any
  products: any = []
  @Input() supplierId: string = "";
  @Input() customerId: string = "";
  currentUSer !: any
  currencies: any = []
  options: any = []
  transactionType !:string
  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private transactionService: TransactionService,
    private userService: UserService,
    public currencyService: CurrencyService,
    private exchangeRateService: ExchangeRateService,
    private secureStorage: SecureStorageService,
  ) {
    this.optionsType = this.transactionService.type;
    this.optionsStatus = this.transactionService.status;
    this.currentUSer = this.secureStorage.getItem('user',true)?._id
    this.nationalCurrency = this.currencyService.nationalCurrency
    this.currencies = this.currencyService.currencies
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idTransaction")
    ) {
      this.id = this.config.data.idTransaction;
      this.supplierId = this.config.data.supplierId;
      this.customerId = this.config.data.customerId;
      this.products = this.config.data.products
      this.independentComponent = false;

      if (this.id) {
        this.getTransaction();
      } else {
        this.getUsers()
      }
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      reference: [{ value: null, disabled: true }, [Validators.required]],
      type: [{ value: null, disabled: true }, [Validators.required]],
      registrationDate: [new Date(), [Validators.required]],
      status: ['code_1166', [Validators.required]],
      savedBy: [this.currentUSer, [Validators.required]],
      transactionLines: [[], []],
      supplier: [this.supplierId || null, []],
      customer: [this.customerId || null, []],
    });
    this.maxDateRegistrationDate = new Date()
    this.setupTransaction(this.supplierId ? 'purchases' : 'sales')
    this.form.get('transactionLines')?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (value) => {
        this.totalAmount = 0
        if (value.length) {
          value.map((v: any) => this.totalAmount += this.exchangeRateService.transformToCurrency(v.currency?._id, this.currencyService.nationalCurrency?._id, v.totalAmount || (v.quantity * v.price)))

        }
        this.manageTransactionStatus()
      },
      error: (error) => {

      }
    })
    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "transaction";
          if (this.independentComponent) {
            this.setupTransaction(response["option"])
            if (response["dataR"]["users"]) {
              this.optionsSavedBy = response["dataR"]["users"];
            }
            if (response["dataR"]["actors"]) {
              this.options = response["dataR"]["actors"];
            }
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
                  if (this.id) this.getTransaction();
                },
                error: () => {
                  this.messagesService.showMessage("error");
                },
              });
          }
        },
        error: () => {
          this.messagesService.showMessage("error");
        },
      });

    } else {
      if (this.current) {
        this.id = this.current._id || this.current;
        this.getTransaction();
      } else if (
        !Object.keys(this.config?.data || []).includes("idTransaction")
      ) {
      }
    }

    this.manageTransactionStatus()


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue
    ) {
      this.id = this.current?._id || this.current;
      this.getTransaction();
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

  manageTransactionStatus() {
    const currentStatus = this.form.get('status')?.value
    //"code_1166",
    //"code_1167",  PROCESSING
    //"code_18436",  SHIPPED
    //"code_18437",  DELIVERED
    //"code_18439",  RETURNED
    //"code_18438",  CANCELLED
    if (!this.id || !currentStatus || ! this.form.get('transactionLines')?.value?.length) {
      this.optionsStatus = this.transactionService.status.filter((item: any) => ['code_1166'].includes(item.value))
    } else if (this.form.get('transactionLines')?.value.length) {
      switch(currentStatus) {
        case 'code_1166' /**en attente */: this.optionsStatus = this.transactionService.status.filter((item: any) => ['code_1166','code_1167','code_18438'].includes(item.value))
        break;
        case "code_1167"/*PROCESSING*/ : this.optionsStatus = this.transactionService.status.filter((item: any) => ['code_1167','code_18436','code_18438'].includes(item.value))
        break;
        case "code_18436"/*SHIPPED*/ : this.optionsStatus = this.transactionService.status.filter((item: any) => ['code_18436','code_18437','code_18438'].includes(item.value))
        break;
        case "code_18437"/*DELIVERED*/ : this.optionsStatus = this.transactionService.status.filter((item: any) => ['code_18437','code_18439'].includes(item.value))
        break;
        default :this.optionsStatus = this.transactionService.status.filter((item: any) => [currentStatus].includes(item.value))

      }


    }
  }

  setupTransaction(option: string) {
    this.transactionType = option
    switch (option) {
      case 'sales':
        this.form.get('type')?.setValue('code_18440');
        this.form.get('customer')?.addValidators(Validators.required);
        this.form.get('reference')?.setValue(this.helpers.generateReference('S'))
        break;
      case 'purchases':
        this.form.get('type')?.setValue('code_18441');
        this.form.get('supplier')?.addValidators(Validators.required);
        this.form.get('reference')?.setValue(this.helpers.generateReference('P'))
        break;

    }
  }
  getUsers() {
    return this.helpers.resolve<User[]>((res, rej) => {
      this.userService
        .getUsers({ options: { queryOptions: { select: 'translations photo -groupe' } } })
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (result) => {
            const user = result.find((item: any) => item._id === (this.form.get('savedBy')?.value?._id || this.currentUSer))
            this.form.get('savedBy')?.setValue(user)
            this.optionsSavedBy.splice(0, this.optionsSavedBy.length, ...result)
            res(result);
          },
          error: ({ error }: any) => {
            console.error("error", error);
            rej(error);
          },
        });
    });
  }

  getTransaction() {
    let getData = () => {
      return this.helpers.resolve<Transaction>((res, rej) => {
        this.transactionService
          .getTransactionById(this.id)
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

    Promise.all([getData(), this.getUsers()])
      .then((result) => {
        this.patchValueIntoForm(result[0]);
      })
      .catch((error) => {
        console.error("error", error);
        this.messagesService.showMessage("error");
      });
  }

  patchValueIntoForm(data: Transaction) {
    let result = <Partial<Transaction>>this.helpers.newObject(data);

    if (result.registrationDate)
      result.registrationDate = new Date(result.registrationDate);
    if (result.supplier) {
      this.products = result.supplier.products
      this.options = [result.supplier]
      this.form.get('supplier')?.disable()
      this.transactionType  = 'purchases'
    } else {
      this.options = [result.customer]
      this.form.get('customer')?.disable()
      this.transactionType  = 'sales'
    }
    this.form.get('savedBy')?.disable()
    this.form.patchValue(result);
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
      this.helpers.setValuesByPaths(newForm, ["transactionLines", "savedBy", "supplier", "customer"]);

      if (this.id) {
        this.transactionService
          .updateTransaction(this.id, newForm)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {

              this.current = result.data;
              this.messagesService.showMessage("updateSuccess");
            },
            error: () => {
              this.messagesService.showMessage("updateError");
            },
          });
      } else {
        this.transactionService
          .addTransaction(newForm)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.id = result._id;
              if (result.supplier) {
                this.products = this.form.get('supplier')?.value.products
              }

              this.current = result;

              this.messagesService.showMessage("addSuccess");
            },
            error: () => {
              this.messagesService.showMessage("addError");
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
