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
import { EnumerationService } from "src/app/shared/services/TechnicalConfiguration/enumeration.service";
import { Enumeration } from "src/app/shared/models/TechnicalConfiguration/Enumeration.model";
import { AddEnumerationComponent } from "../../gestion-enumeration/add-enumeration/add-enumeration.component";
import { DetailEnumerationComponent } from "../../gestion-enumeration/detail-enumeration/detail-enumeration.component";
import { TranslateEnumerationComponent } from "../../gestion-enumeration/translate-enumeration/translate-enumeration.component";

@Component({
  selector: "app-sub-enumeration",
  templateUrl: "./sub-enumeration.component.html",
  styleUrls: ["./sub-enumeration.component.scss"],
})
export class SubEnumerationComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() form!: FormGroup;
  @Input() destination: string = "";
  @Input() relation: string = "";
  @Input() data: Enumeration[] = [];
  @Input() currentEnumeration!: Enumeration | undefined;
  key: string = "";
  listHeaders: ListHeader[] = [];
  listCaptionConfig: ListCaptionConfig = {};
  listPrincipaleHeaders: ListHeader[] = [];
  listPrincipaleCaptionConfig: ListCaptionConfig = {};
  ref!: DynamicDialogRef;
  items: Enumeration[] = [];
  operationPhase: "list" | "add/edit" | "detail" | "clone" | "translate" =
    "list";
  dir = document.body.style.direction;

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private enumerationService: EnumerationService,
    private helpers: HelpersService,
    private messagesService: MessagesService,
    private breadcrumbsService: BreadcrumbsService
  ) {}
  ngOnInit(): void {
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
    this.enumerationService
      .getEnumerations({
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
          serviceName: "technicalConfiguration",
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
        .subscribe((clonedData?: Enumeration | Enumeration[]) => {
          if (clonedData != undefined) {
            if (this.relation === "OneToMany" && clonedData.length) {
              let tempClonedData = <Partial<Enumeration>[]>clonedData;

              this.enumerationService
                .addManyEnumeration(
                  tempClonedData.map((d) => {
                    delete d._id;
                    // delete the attributes that have a oneToMany relation

                    //d[this.key]=;

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
              let tempClonedData = <Partial<Enumeration>>clonedData;

              delete tempClonedData._id;
              // delete the attributes that have a oneToMany relation

              //tempClonedData[this.key] =;

              this.enumerationService
                .addEnumeration(tempClonedData)
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
              let tempClonedData = <Enumeration[]>clonedData;

              this.enumerationService
                .updateManyEnumeration({
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
    this.enumerationService
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

  onTranslateClick(event: any) {
    this.ref = this.dialogService.open(TranslateEnumerationComponent, {
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
        idEnumeration: event._id,
        independentComponent: false,
      },
    });
    this.ref.onClose.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
      if (data != undefined) {
        if (data?.item) {
          const i = this.data.findIndex((x) => x._id === data.item._id);
          this.data[i] = data?.item;
        }
      }
      delete this.config.data;
      this.breadcrumbsService.removeBreadcrumb();
    });
  }

  onAddClick() {
    this.ref = this.dialogService.open(AddEnumerationComponent, {
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
        idEnumeration: null,
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

  onAddItem(data: Enumeration) {
    this.form.setValue(data);
  }

  onEditClick(event: any) {
    this.ref = this.dialogService.open(AddEnumerationComponent, {
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
        idEnumeration: event._id,
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
    this.ref = this.dialogService.open(DetailEnumerationComponent, {
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
        idEnumeration: event._id,
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
