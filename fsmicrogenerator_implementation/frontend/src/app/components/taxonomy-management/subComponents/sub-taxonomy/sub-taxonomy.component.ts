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
import { TaxonomyService } from "src/app/shared/services/TaxonomyManagement/taxonomy.service";
import { Taxonomy } from "src/app/shared/models/TaxonomyManagement/Taxonomy.model";
import { AddTaxonomyComponent } from "../../taxonomy-management/add-taxonomy/add-taxonomy.component";
import { DetailTaxonomyComponent } from "../../taxonomy-management/detail-taxonomy/detail-taxonomy.component";
import { TranslateTaxonomyComponent } from "../../taxonomy-management/translate-taxonomy/translate-taxonomy.component";

@Component({
  selector: "app-sub-taxonomy",
  templateUrl: "./sub-taxonomy.component.html",
  styleUrls: ["./sub-taxonomy.component.scss"],
})
export class SubTaxonomyComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() domainId: string = "";
  @Input() parentId: string = "";
  @Input() form!: FormGroup;
  @Input() destination: string = "";
  @Input() relation: string = "";
  @Input() data: Taxonomy[] = [];
  @Input() currentTaxonomies!: Taxonomy | undefined;
  key: string = "";
  listHeaders: ListHeader[] = [];
  listCaptionConfig: ListCaptionConfig = {};
  listPrincipaleHeaders: ListHeader[] = [];
  listPrincipaleCaptionConfig: ListCaptionConfig = {};
  ref!: DynamicDialogRef;
  items: Taxonomy[] = [];
  operationPhase: "list" | "add/edit" | "detail" | "clone" | "translate" =
    "list";
  dir = document.body.style.direction;

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private taxonomyService: TaxonomyService,
    private helpers: HelpersService,
    private messagesService: MessagesService,
    private breadcrumbsService: BreadcrumbsService
  ) {}
  ngOnInit(): void {
    if (this.destination === "domain" && this.relation === "OneToMany") {
      this.listPrincipaleHeaders = [
        {
          field: "logo",
          header: "code_49",
          sort: true,
          filter: true,
          filterType: "file",
          filterData: [],
        },
        {
          field: "translations.designation",
          header: "code_4544",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "translations.description",
          header: "code_3691",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "domain",
          header: "code_18456",
          sort: true,
          filter: true,
          filterType: "template",
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
        summary: { enabled: true, message: "" },
        actions: {
          clone: false,
          delete: true,
          edit: true,
          detail: true,
          translate: false,
        },
      };

      this.listHeaders = [
        {
          field: "logo",
          header: "code_49",
          sort: true,
          filter: true,
          filterType: "file",
          filterData: [],
        },
        {
          field: "translations.designation",
          header: "code_4544",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "translations.description",
          header: "code_3691",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "domain",
          header: "code_18456",
          sort: true,
          filter: true,
          filterType: "template",
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
        summary: { enabled: true, message: "" },
        actions: { clone: false, delete: false, detail: false, edit: false },
      };
    } else if (
      this.destination === "taxonomies" &&
      this.relation === "OneToMany"
    ) {
      this.listPrincipaleHeaders = [
        {
          field: "logo",
          header: "code_49",
          sort: true,
          filter: true,
          filterType: "file",
          filterData: [],
        },
        {
          field: "translations.designation",
          header: "code_4544",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "translations.description",
          header: "code_3691",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "domain",
          header: "code_18456",
          sort: true,
          filter: true,
          filterType: "template",
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
        summary: { enabled: true, message: "" },
        actions: {
          clone: false,
          delete: true,
          edit: true,
          detail: true,
          translate: false,
        },
      };

      this.listHeaders = [
        {
          field: "logo",
          header: "code_49",
          sort: true,
          filter: true,
          filterType: "file",
          filterData: [],
        },
        {
          field: "translations.designation",
          header: "code_4544",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "translations.description",
          header: "code_3691",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "domain",
          header: "code_18456",
          sort: true,
          filter: true,
          filterType: "template",
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
        summary: { enabled: true, message: "" },
        actions: { clone: false, delete: false, detail: false, edit: false },
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
    if (this.destination === "domain" && this.relation === "OneToMany") {
      this.key = "domain";
    }

    if (this.destination === "taxonomies" && this.relation === "OneToMany") {
      this.key = "parent";
    }

    this.taxonomyService
      .getTaxonomies({
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
          serviceName: "taxonomyManagement",
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
        .subscribe((clonedData?: Taxonomy | Taxonomy[]) => {
          if (clonedData != undefined) {
            if (this.relation === "OneToMany" && clonedData.length) {
              let tempClonedData = <Partial<Taxonomy>[]>clonedData;

              this.taxonomyService
                .addManyTaxonomies(
                  tempClonedData.map((d) => {
                    delete d._id;
                    // delete the attributes that have a oneToMany relation
                    delete d.children;
                    delete d.domain;
                    delete d.parent;
                    delete d.children;
                    d[this.key] = this.domainId || this.parentId;
                    this.helpers.setValuesByPaths(d, [
                      "children",
                      "domain",
                      "parent",
                      "children",
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
              let tempClonedData = <Partial<Taxonomy>>clonedData;

              delete tempClonedData._id;
              // delete the attributes that have a oneToMany relation
              delete tempClonedData.children;
              delete tempClonedData.domain;
              delete tempClonedData.parent;
              delete tempClonedData.children;
              tempClonedData[this.key] = this.domainId || this.parentId;
              this.helpers.setValuesByPaths(tempClonedData, [
                "children",
                "domain",
                "parent",
                "children",
              ]);

              this.taxonomyService
                .addTaxonomy(tempClonedData)
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
              let tempClonedData = <Taxonomy[]>clonedData;

              this.taxonomyService
                .updateManyTaxonomies({
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
    this.taxonomyService
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
    this.ref = this.dialogService.open(TranslateTaxonomyComponent, {
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
        idTaxonomies: event._id,
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
    this.ref = this.dialogService.open(AddTaxonomyComponent, {
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
        idTaxonomies: null,
        independentComponent: false,
        domainId: this.domainId,
        parentId: this.parentId,
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

  onAddItem(data: Taxonomy) {
    this.form.setValue(data);
  }

  onEditClick(event: any) {
    this.ref = this.dialogService.open(AddTaxonomyComponent, {
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
        idTaxonomies: event._id,
        independentComponent: false,
        domainId: this.domainId,
        parentId: this.parentId,
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
    this.ref = this.dialogService.open(DetailTaxonomyComponent, {
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
        idTaxonomies: event._id,
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
