import { Component } from "@angular/core";
import { Input } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup } from "@angular/forms";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { BreadcrumbsService } from "src/app/shared/services/defaultServices/breadcrumbs.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from "primeng/dynamicdialog";
import { DynamicTableComponent } from "src/app/shared/components/dynamic-table/dynamic-table.component";
import { CurrencyService } from "src/app/shared/services/CurrencyManagement/currency.service";
import { Currency } from "src/app/shared/models/CurrencyManagement/Currency.model";
import { AddCurrencyComponent } from "../../gestion-currency/add-currency/add-currency.component";
import { DetailCurrencyComponent } from "../../gestion-currency/detail-currency/detail-currency.component";

@Component({
  selector: "app-sub-currency",
  templateUrl: "./sub-currency.component.html",
  styleUrls: ["./sub-currency.component.scss"],
})
export class SubCurrencyComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() form!: FormGroup;
  @Input() destination: string = "";
  @Input() relation: string = "";
  @Input() data: Currency[] = [];
  @Input() currentCurrency!: Currency | undefined;
  key: string = "";
  listHeaders: ListHeader[] = [];
  listCaptionConfig: ListCaptionConfig = {};
  listPrincipaleHeaders: ListHeader[] = [];
  listPrincipaleCaptionConfig: ListCaptionConfig = {};
  ref!: DynamicDialogRef;
  items: Currency[] = [];
  operationPhase: "list" | "add/edit" | "detail" | "clone" | "translate" =
    "list";
  dir = document.body.style.direction;

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private currencyService: CurrencyService,
    private helpers: HelpersService,
    private messagesService: MessagesService,
    private breadcrumbsService: BreadcrumbsService
  ) { }
  ngOnInit(): void {

    if (this.destination === "exchangeRate" && this.relation === "OneToOne") {
      this.operationPhase = "add/edit";

      this.listHeaders = [
        {
          field: "currency",
          header: "code_18446",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "typeCurrency",
          header: "code_13198",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "iconeCurrency",
          header: "code_562",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "translations.designation",
          header: "code_3756",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "translations.symbolCurrency",
          header: "code_562",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "imageRepresentative",
          header: "code_20",
          sort: true,
          filter: true,
          filterType: "file",
          filterData: [],
        },
      ];
      this.listCaptionConfig = {
        summary: { enabled: true, message: "" },
        actions: { clone: false, delete: false, detail: false, edit: false },
        globalFilter: true,
        csv: true,
        pdf: true,
        xls: true,
        selection: true,
        displayedColumns: true,
        clearTable: true,
        refreshData: true,
        addButton: false,
        selectionType: "multiple",
      };
    }

    if (this.mode === "detail") {
      this.listPrincipaleCaptionConfig.addButton = false;
      this.listPrincipaleCaptionConfig.actions = {
        clone: false,
        delete: false,
        edit: false,
        detail: true,
      };
      this.listPrincipaleCaptionConfig.selectionType = "single";
    } else if (this.mode === "translate") {
      this.listPrincipaleCaptionConfig.addButton = false;
      this.listPrincipaleCaptionConfig.actions = {
        translate: true,
      };
      this.listPrincipaleCaptionConfig.selectionType = "single";
    }
  }
  getItems(cb?: () => void) {


    if (this.destination === "exchangeRate" && this.relation === "OneToOne") {
      this.key = "";
    }

    this.currencyService
      .getCurrencies({
        condition: this.relation?.includes("ToOne")
          ? {}
          : { _id: { $nin: this.data?.map((d: any) => d._id) } },
        options: {
          projection: {
            "translations._id": 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      })
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result) => {
          this.items = result;
          typeof cb === "function" && cb();
        },
        error: ({ error }: any) => {
          console.error("error", error);
          this.messagesService.showMessage("error");
        },
      });
  }

  openListDialog() {
    this.getItems(() => {
      this.ref = this.dialogService.open(DynamicTableComponent, {
        header: "Select Item(s)", // if you want you can change this to a i18n value
        width: "90vw",
        maximizable: true,
        contentStyle: {
          "max-height": "fit-content",
          overflow: "auto",
          height: "100vh",
        },
        duplicate: true,
        baseZIndex: 1,
        data: {
          data: this.items,
          serviceName: "currencyManagement",
          headers: this.listHeaders,
          captionConfig: {
            ...this.listCaptionConfig,
            actions: {
              ...this.listCaptionConfig.actions,
              close: true,
            },
          },
        },
      });

      this.ref.onClose
        .pipe(takeUntil(this.destroyed$))
        .subscribe((clonedData?: Currency | Currency[]) => {
          if (clonedData != undefined) {
            if (this.relation === "OneToMany" && clonedData.length) {
              let tempClonedData = <Partial<Currency>[]>clonedData;

              this.currencyService
                .addManyCurrency(
                  tempClonedData.map((d) => {
                    delete d._id;
                    // delete the attributes that have a oneToMany relation
                    delete d.exchangeRates;
                    delete d.exchangeRates;
                    //d[this.key]=;
                    this.helpers.setValuesByPaths(d, [
                      "exchangeRates",
                    ]);

                    return d;
                  })
                )
                .pipe(takeUntil(this.destroyed$))
                .subscribe({
                  next: (result) => {
                    if (this.mode === "clone") {
                      for (let r of result) r["cloned"] = true;
                      this.data.push(...result);
                    }
                    if (this.form)
                      this.form?.setValue([...result, ...this.data]);
                    this.messagesService.showMessage("cloneSuccess");
                  },
                  error: ({ error }: any) => {
                    console.error("error", error);
                    this.messagesService.showMessage("cloneError");
                  },
                });
            } else if (this.relation === "OneToOne") {
              let tempClonedData = <Partial<Currency>>clonedData;

              delete tempClonedData._id;
              // delete the attributes that have a oneToMany relation
              delete tempClonedData.exchangeRates;
              delete tempClonedData.exchangeRates;
              //tempClonedData[this.key] =;
              this.helpers.setValuesByPaths(tempClonedData, [
                "exchangeRates",

              ]);

              this.currencyService
                .addCurrency(tempClonedData)
                .pipe(takeUntil(this.destroyed$))
                .subscribe({
                  next: (result) => {
                    this.form?.setValue(result);
                    this.messagesService.showMessage("cloneSuccess");
                  },
                  error: ({ error }: any) => {
                    console.error("error", error);
                    this.messagesService.showMessage("cloneError");
                  },
                });
            } else if (this.relation === "ManyToMany" && clonedData.length) {
              let tempClonedData = <Currency[]>clonedData;

              this.currencyService
                .updateManyCurrency({
                  ids: tempClonedData.map((d) => d._id),
                  data: {
                    $addToSet: (() => {
                      switch (this.destination) {
                        default:
                          return {};
                      }
                    })(),
                  },
                })
                .pipe(takeUntil(this.destroyed$))
                .subscribe({
                  next: (result) => {
                    this.data.push(...tempClonedData);
                    this.form?.setValue(this.data);
                    this.messagesService.showMessage("cloneSuccess");
                  },
                  error: ({ error }: any) => {
                    console.error("error", error);
                    this.messagesService.showMessage("cloneError");
                  },
                });
            }
          }
        });
    });
  }

  changeState(event: OnDeleteEvent) {
    this.currencyService
      .changeState(event)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result) => {
          for (let id of event.id) {
            this.data.splice(
              this.data.findIndex((d: any) => d._id === id),
              1
            );
          }
          if (this.form) {
            this.form.setValue(this.data);
          }
          this.messagesService.showMessage("deleteSuccess");
        },
        error: (error: any) => {
          this.messagesService.showMessage("deleteError");
        },
      });
  }

  onAddClick() {
    this.ref = this.dialogService.open(AddCurrencyComponent, {
      width: "90vw",
      maximizable: true,
      contentStyle: {
        "max-height": "fit-content",
        overflow: "auto",
        height: "100vh",
      },
      duplicate: true,
      baseZIndex: 1,
      data: {
        idCurrency: null,
        independentComponent: false,


      },
    });
    this.ref.onClose.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data != undefined) {
        if (data?.item) {
          this.data.push(data.item);
          if (this.form) this.form.setValue(this.data);
        }
      }
      delete this.config.data;
      this.breadcrumbsService.removeBreadcrumb();
    });
  }

  onAddItem(data: Currency) {
    this.form.setValue(data);
  }

  onEditClick(event: any) {
    this.ref = this.dialogService.open(AddCurrencyComponent, {
      width: "90vw",
      maximizable: true,
      contentStyle: {
        "max-height": "fit-content",
        overflow: "auto",
        height: "100vh",
      },
      duplicate: true,
      baseZIndex: 1,
      data: {
        idCurrency: event._id,
        independentComponent: false,

      },
    });
    this.ref.onClose.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data != undefined) {
        if (data?.item) {
          const i = this.data.findIndex((x) => x._id === data.item._id);
          this.data[i] = data?.item;

          if (this.form) this.form.setValue(this.data);
        }
      }
      delete this.config.data;
      this.breadcrumbsService.removeBreadcrumb();
    });
  }

  onDetailClick(event: any) {
    this.ref = this.dialogService.open(DetailCurrencyComponent, {
      width: "90vw",
      maximizable: true,
      contentStyle: {
        "max-height": "fit-content",
        overflow: "auto",
        height: "100vh",
      },
      duplicate: true,
      baseZIndex: 1,
      data: {
        idCurrency: event._id,
        independentComponent: false,

      },
    });
    this.ref.onClose.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data != undefined) {
        if (data?.clonedElement) {
        }
      }
      delete this.config.data;
      this.breadcrumbsService.removeBreadcrumb();
    });
  }

  onDetailFinish() {
    this.operationPhase = "list";
  }



  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
