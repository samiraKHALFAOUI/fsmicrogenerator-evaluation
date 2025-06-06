import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { TransactionLineService } from "src/app/shared/services/TransactionManagement/transactionLine.service";
import { TransactionLine } from "src/app/shared/models/TransactionManagement/TransactionLine.model";

@Component({
  selector: "app-add-transaction-line",
  templateUrl: "./add-transaction-line.component.html",
  styleUrls: ["./add-transaction-line.component.scss"],
})
export class AddTransactionLineComponent {
  optionsProduct: any[] = [];
  optionsCurrency: any[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current!: TransactionLine | undefined;
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Input() transactionId: string = "";
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  id: any = "";

  @Input() transactionType: any = ''
  quantityMax !: number

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private transactionLineService: TransactionLineService
  ) {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idTransactionLine")
    ) {
      this.id = this.config.data.idTransactionLine;
      this.optionsProduct = this.config.data.products
      this.optionsCurrency = this.config.data.currencies
      this.transactionId = this.config.data.transactionId;
      this.independentComponent = false;
      if (this.id) {
        this.getTransactionLine();
      } else {
      }
    }
  }
  ngOnInit(): void {


    this.form = this.fb.group({
      product: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0)]],
      currency: [null, [Validators.required]],
      transaction: [this.transactionId || null, [Validators.required]],
      inventoryMovement: [[], []]
    });

    this.form.get('product')?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (value) => {
        if (this.transactionType === 'sales')
          this.quantityMax = value.stockQuantity
        if (!this.form.get('price')?.value)
          this.form.get('price')?.setValue(value.salePrice)
        if (!this.form.get('currency')?.value)
          this.form.get('currency')?.setValue(value.currency._id)
      },
      error: () => {

      }
    })
    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "transactionLine";
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
                  if (this.id) this.getTransactionLine();
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
        this.getTransactionLine();
      } else if (
        !Object.keys(this.config?.data || []).includes("idTransactionLine")
      ) {
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue
    ) {
      this.id = this.current?._id || this.current;
      this.getTransactionLine();
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

  getTransactionLine() {
    let getData = () => {
      return this.helpers.resolve<TransactionLine>((res, rej) => {
        this.transactionLineService
          .getTransactionLineById(this.id)
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

  patchValueIntoForm(data: TransactionLine) {
    let result = <Partial<TransactionLine>>this.helpers.newObject(data);
    result.product = this.optionsProduct.find((p) => p._id === result.product?._id)
    //@ts-ignore
    result.currency = result.currency._id
    this.form.patchValue(result , {emitEvent :false});
    this.form.get('product')?.disable()
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
      this.helpers.setValuesByPaths(newForm, ["transaction", "product"]);

      if (this.id) {
        this.transactionLineService
          .updateTransactionLine(this.id, newForm)
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
        this.transactionLineService
          .addTransactionLine(newForm)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.id = result._id;

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
