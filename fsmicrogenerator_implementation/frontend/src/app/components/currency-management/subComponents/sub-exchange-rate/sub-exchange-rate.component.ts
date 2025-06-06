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
import { ExchangeRateService } from "src/app/shared/services/CurrencyManagement/exchangeRate.service";
import { ExchangeRate } from "src/app/shared/models/CurrencyManagement/ExchangeRate.model";
import { CloneExchangeRateComponent } from "../../gestion-exchange-rate/clone-exchange-rate/clone-exchange-rate.component";
import { AddExchangeRateComponent } from "../../gestion-exchange-rate/add-exchange-rate/add-exchange-rate.component";
import { DetailExchangeRateComponent } from "../../gestion-exchange-rate/detail-exchange-rate/detail-exchange-rate.component";

@Component({
  selector: "app-sub-exchange-rate",
  templateUrl: "./sub-exchange-rate.component.html",
  styleUrls: ["./sub-exchange-rate.component.scss"],
})
export class SubExchangeRateComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() currencyId: string = "";
  @Input() form!: FormGroup;
  @Input() destination: string = "";
  @Input() relation: string = "";
  @Input() data: ExchangeRate[] = [];
  @Input() currentExchangeRate!: ExchangeRate | undefined;
  key: string = "";
  listHeaders: ListHeader[] = [];
  listCaptionConfig: ListCaptionConfig = {};
  listPrincipaleHeaders: ListHeader[] = [];
  listPrincipaleCaptionConfig: ListCaptionConfig = {};
  ref!: DynamicDialogRef;
  items: ExchangeRate[] = [];
  operationPhase: "list" | "add/edit" | "detail" | "clone" | "translate" =
    "list";
  dir = document.body.style.direction;

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private exchangeRateService: ExchangeRateService,
    private helpers: HelpersService,
    private messagesService: MessagesService,
    private breadcrumbsService: BreadcrumbsService
  ) {}
  ngOnInit(): void {
    if (this.destination === "currency" && this.relation === "ManyToMany") {
      this.listPrincipaleHeaders = [
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
          field: "refCurrencyBase.translations.designation",
          header: "code_13160",
          sort: true,
          filter: true,
          filterType: "template",
          filterData: [],
        },
        {
          field: "refCurrencyEtrangere.translations.designation",
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
      this.listPrincipaleCaptionConfig = {
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

      this.listHeaders = [
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
          field: "refCurrencyBase.translations.designation",
          header: "code_13160",
          sort: true,
          filter: true,
          filterType: "template",
          filterData: [],
        },
        {
          field: "refCurrencyEtrangere.translations.designation",
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
      this.listCaptionConfig = {
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
        summary: {
          enabled: true,
          message: "",
        },
        actions: { clone: false, delete: false, detail: false, edit: false },
      };
    }

    if (this.mode === "clone") {
      this.listPrincipaleCaptionConfig.actions = { clone: true, close: true };
      this.listPrincipaleCaptionConfig.addButton = false;
    } else if (this.mode === "detail") {
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
    if (this.destination === "currency" && this.relation === "ManyToMany") {
      this.key = "currency";
    }

    this.exchangeRateService
      .getExchangeRates({
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
        .subscribe((clonedData?: ExchangeRate | ExchangeRate[]) => {
          if (clonedData != undefined) {
            if (this.relation === "OneToMany" && clonedData.length) {
              let tempClonedData = <Partial<ExchangeRate>[]>clonedData;

              this.exchangeRateService
                .addManyExchangeRate(
                  tempClonedData.map((d) => {
                    delete d._id;
                    // delete the attributes that have a oneToMany relation
                    delete d.refCurrencyBase;
                    delete d.refCurrencyEtrangere;
                    delete d.currency;
                    d[this.key] = this.currencyId;
                    this.helpers.setValuesByPaths(d, [
                      "refCurrencyBase",
                      "refCurrencyEtrangere",
                      "currency",
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
              let tempClonedData = <Partial<ExchangeRate>>clonedData;

              delete tempClonedData._id;
              // delete the attributes that have a oneToMany relation
              delete tempClonedData.refCurrencyBase;
              delete tempClonedData.refCurrencyEtrangere;
              delete tempClonedData.currency;
              tempClonedData[this.key] = this.currencyId;
              this.helpers.setValuesByPaths(tempClonedData, [
                "refCurrencyBase",
                "refCurrencyEtrangere",
                "currency",
              ]);

              this.exchangeRateService
                .addExchangeRate(tempClonedData)
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
              let tempClonedData = <ExchangeRate[]>clonedData;

              this.exchangeRateService
                .updateManyExchangeRate({
                  ids: tempClonedData.map((d) => d._id),
                  data: {
                    $addToSet: (() => {
                      switch (this.destination) {
                        case "currency":
                          return { currency: this.currencyId };

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
    this.exchangeRateService
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
    this.ref = this.dialogService.open(AddExchangeRateComponent, {
      width: "90vw",
      maximizable: true,
      contentStyle: {
        "max-height": "fit-content",
        overflow: "auto",
        height: "100vh",
      },
      baseZIndex: 1,
      data: {
        idExchangeRate: null,
        independentComponent: false,
        currencyId: this.currencyId,
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

  onAddItem(data: ExchangeRate) {
    this.form.setValue(data);
  }

  onEditClick(event: any) {
    this.ref = this.dialogService.open(AddExchangeRateComponent, {
      width: "90vw",
      maximizable: true,
      contentStyle: {
        "max-height": "fit-content",
        overflow: "auto",
        height: "100vh",
      },
      baseZIndex: 1,
      data: {
        idExchangeRate: event._id,
        independentComponent: false,
        currencyId: this.currencyId,
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
    this.ref = this.dialogService.open(DetailExchangeRateComponent, {
      width: "90vw",
      maximizable: true,
      contentStyle: {
        "max-height": "fit-content",
        overflow: "auto",
        height: "100vh",
      },
      baseZIndex: 1,
      data: {
        idExchangeRate: event._id,
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

  onCloneClick(event: any) {
    this.ref = this.dialogService.open(CloneExchangeRateComponent, {
      width: "90vw",
      maximizable: true,
      contentStyle: {
        "max-height": "fit-content",
        overflow: "auto",
        height: "100vh",
      },
      baseZIndex: 1,
      data: {
        idExchangeRate: event._id,
        independentComponent: false,
        currencyId: this.currencyId,
      },
    });
    this.ref.onClose.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data != undefined) {
        if (data?.clonedElement) {
          this.form.setValue([...this.form.value, data.clonedElement]);
          this.data.push({ ...data.clonedElement, cloned: true });
        }
      }
      delete this.config.data;
      this.breadcrumbsService.removeBreadcrumb();
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
