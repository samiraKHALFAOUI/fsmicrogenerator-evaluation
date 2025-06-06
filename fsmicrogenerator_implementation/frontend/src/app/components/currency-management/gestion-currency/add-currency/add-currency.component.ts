import { Component } from '@angular/core';
import { Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessagesService } from 'src/app/shared/services/defaultServices/message.service';
import { HelpersService } from 'src/app/shared/services/defaultServices/helpers.service';
import { CurrencyService } from 'src/app/shared/services/CurrencyManagement/currency.service';
import { Currency } from 'src/app/shared/models/CurrencyManagement/Currency.model';
import { SecureStorageService } from 'src/app/shared/services/defaultServices/secureStorage.service';

@Component({
  selector: 'app-add-currency',
  templateUrl: './add-currency.component.html',
  styleUrls: ['./add-currency.component.scss'],
})
export class AddCurrencyComponent {
  optionsTypeCurrency: any[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current!: Currency | undefined;
  @Input() mode: 'clone' | 'add/edit' | 'detail' | 'translate' = 'add/edit';
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  id: any = '';
  selectedTab = 0;
  prevTabIcon = 'pi pi-chevron-left';
  nextTabIcon = 'pi pi-chevron-right';


  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private currencyService: CurrencyService,
    private secureStorage: SecureStorageService,
  ) {
    this.optionsTypeCurrency = this.currencyService.typeCurrency;
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes('idCurrency')
    ) {
      this.id = this.config.data.idCurrency;
      this.independentComponent = false;
      if (this.id) {
        this.getCurrency();
      }
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      typeCurrency: [null, [Validators.required]],
      currency: [
        null,
        [Validators.required],
      ],
      symbolCurrency: [null, []],
      exchangeRates: [[], []],

    });
    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response['service'] === 'currency';
          if (this.independentComponent) {
            if (response['dataR']['data']) {
              this.patchValueIntoForm(response['dataR']['data']);
              this.id = response['dataR']['data']._id;
            }

          } else {
            this.activatedRoute.params
              .pipe(takeUntil(this.destroyed$))
              .subscribe({
                next: (params: any) => {
                  this.id = params['id'];
                  if (this.id) this.getCurrency();
                },
                error: (error) => {
                  this.messagesService.showMessage('error');
                },
              });
          }
        },
        error: (error) => {
          this.messagesService.showMessage('error');
        },
      });
    } else {
      if (this.current) {
        this.id = this.current._id || this.current;
        this.getCurrency();
      } else if (!Object.keys(this.config?.data || []).includes('idCurrency')) {
      }
    }

    if (this.secureStorage.getItem('lang') === 'ar') {
      [this.prevTabIcon, this.nextTabIcon] = [
        this.nextTabIcon,
        this.prevTabIcon,
      ];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.id &&
      this.relation?.includes('ToOne') &&
      changes['current'] &&
      changes['current'].currentValue
    ) {
      //@ts-ignore
      this.id = this.current?._id || this.current;
      this.getCurrency();
    } else if (
      this.id &&
      this.relation?.includes('ToOne') &&
      changes['current'] &&
      changes['current'].currentValue &&
      changes['current'].previousValue
    ) {
      this.patchValueIntoForm(changes['current'].currentValue);
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
              console.error('error', error);
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
        console.error('error', error);
        this.messagesService.showMessage('error');
      });
  }

  patchValueIntoForm(data: Currency) {
    let result = <Partial<Currency>>this.helpers.newObject(data);
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
      this.messagesService.showMessage('error', 'invalid form');

      // #region invalids controls

      let invalidControls = [];
      for (let key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].status === 'INVALID')
          invalidControls.push(key);
      }

      console.error('invalid controls -->', invalidControls);

      // #endregion invalids controls


    } else {
      let newForm = this.helpers.newObject(this.form.getRawValue());
      this.helpers.setValuesByPaths(newForm, [
        'exchangeRates'      ]);


      if (this.id) {
        this.currencyService
          .updateCurrency(
            this.id,
            newForm
          )
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.current = result.data;
              this.messagesService.showMessage('updateSuccess');
            },
            error: (error: any) => {
              this.messagesService.showMessage('updateError');
            },
          });
      } else {
        this.currencyService
          .addCurrency(
            newForm
          )
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.id = result._id;

              this.current = result;

              this.messagesService.showMessage('addSuccess');
            },
            error: (error: any) => {
              this.messagesService.showMessage('addError');
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
