import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { ReplaySubject, takeUntil } from "rxjs";
import { DynamicTableComponent } from "src/app/shared/components/dynamic-table/dynamic-table.component";
import {
  ListCaptionConfig,
  ListHeader,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Menu } from "src/app/shared/models/TechnicalConfiguration/Menu.model";
import { BreadcrumbsService } from "src/app/shared/services/defaultServices/breadcrumbs.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { MenuService } from "src/app/shared/services/TechnicalConfiguration/menu.service";
import { AddMenuComponent } from "../../gestion-menu/add-menu/add-menu.component";
import { DetailMenuComponent } from "../../gestion-menu/detail-menu/detail-menu.component";
import { TranslateMenuComponent } from "../../gestion-menu/translate-menu/translate-menu.component";

@Component({
  selector: "app-sub-menu",
  templateUrl: "./sub-menu.component.html",
  styleUrls: ["./sub-menu.component.scss"],
})
export class SubMenuComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() menuParentId: string = "";
  @Input() pagesId: string = "";
  @Input() form!: FormGroup;
  @Input() destination: string = "";
  @Input() relation: string = "";
  @Input() data: Menu[] = [];
  @Input() currentMenu!: Menu | undefined;
  key: string = "";
  listHeaders: ListHeader[] = [];
  listCaptionConfig: ListCaptionConfig = {};
  listPrincipaleHeaders: ListHeader[] = [];
  listPrincipaleCaptionConfig: ListCaptionConfig = {};
  ref!: DynamicDialogRef;
  items: Menu[] = [];
  operationPhase: "list" | "add/edit" | "detail" | "clone" | "translate" =
    "list";
  dir = document.body.style.direction;

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private menuService: MenuService,
    private helpers: HelpersService,
    private messagesService: MessagesService,
    private breadcrumbsService: BreadcrumbsService
  ) {}
  ngOnInit(): void {
    if (this.relation === "OneToMany") {
      this.listPrincipaleHeaders = [
        {
          field: "translations.titre",
          header: "code_33",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "planPrincipale",
          header: "code_13881",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "megaMenu",
          header: "code_13882",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "icon",
          header: "code_2605",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "ordre",
          header: "code_570",
          sort: true,
          filter: true,
          filterType: "numeric",
          filterData: [],
        },
        {
          field: "priorite",
          header: "code_11514",
          sort: true,
          filter: true,
          filterType: "numeric",
          filterData: [],
        },
        {
          field: "path",
          header: "code_12036",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "typeAffichage",
          header: "code_10945",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "typeActivation",
          header: "code_13886",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "periodiciteActivation",
          header: "code_13889",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "pages",
          header: "code_11339",
          sort: true,
          filter: true,
          filterType: "chips",
          filterData: [],
        },
        {
          field: "menuParent",
          header: "code_13903",
          sort: true,
          filter: true,
          filterType: "template",
          filterData: [],
        },
        {
          field: "menuAssocies",
          header: "code_13904",
          sort: true,
          filter: true,
          filterType: "chips",
          filterData: [],
        },
        {
          field: "menuPrincipal",
          header: "code_13932",
          sort: true,
          filter: true,
          filterType: "boolean",
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
        {
          field: "type",
          header: "code_135",
          sort: true,
          filter: true,
          filterType: "text",
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
          translate: true,
        },
      };

      this.listHeaders = [
        {
          field: "translations.titre",
          header: "code_33",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "planPrincipale",
          header: "code_13881",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "megaMenu",
          header: "code_13882",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "icon",
          header: "code_2605",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "ordre",
          header: "code_570",
          sort: true,
          filter: true,
          filterType: "numeric",
          filterData: [],
        },
        {
          field: "priorite",
          header: "code_11514",
          sort: true,
          filter: true,
          filterType: "numeric",
          filterData: [],
        },
        {
          field: "path",
          header: "code_12036",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "typeAffichage",
          header: "code_10945",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "typeActivation",
          header: "code_13886",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "periodiciteActivation",
          header: "code_13889",
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },
        {
          field: "pages",
          header: "code_11339",
          sort: true,
          filter: true,
          filterType: "chips",
          filterData: [],
        },
        {
          field: "menuParent",
          header: "code_13903",
          sort: true,
          filter: true,
          filterType: "template",
          filterData: [],
        },
        {
          field: "menuAssocies",
          header: "code_13904",
          sort: true,
          filter: true,
          filterType: "chips",
          filterData: [],
        },
        {
          field: "menuPrincipal",
          header: "code_13932",
          sort: true,
          filter: true,
          filterType: "boolean",
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
        {
          field: "type",
          header: "code_135",
          sort: true,
          filter: true,
          filterType: "text",
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
    if (this.destination === "menu" && this.relation === "OneToMany") {
      this.key = "menuParent";
    }

    if (this.destination === "page" && this.relation === "ManyToMany") {
      this.key = "pages";
    }

    this.menuService
      .getMenus({
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
          serviceName: "elementProjet",
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
        .subscribe((clonedData?: Menu | Menu[]) => {
          if (clonedData != undefined) {
            if (this.relation === "OneToMany" && clonedData.length) {
              let tempClonedData = <Partial<Menu>[]>clonedData;

              this.menuService
                .addManyMenu(
                  tempClonedData.map((d) => {
                    delete d._id;
                    // delete the attributes that have a oneToMany relation
                    delete d.menuAssocies;
                    delete d.menuParent;
                    delete d.menuAssocies;
                    d[this.key] = this.menuParentId || this.pagesId;
                    this.helpers.setValuesByPaths(d, [
                      "pages",
                      "menuAssocies",
                      "menuParent",
                      "pages",
                      "menuAssocies",
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
              let tempClonedData = <Partial<Menu>>clonedData;

              delete tempClonedData._id;
              // delete the attributes that have a oneToMany relation
              delete tempClonedData.menuAssocies;
              delete tempClonedData.menuParent;
              delete tempClonedData.menuAssocies;
              tempClonedData[this.key] = this.menuParentId || this.pagesId;
              this.helpers.setValuesByPaths(tempClonedData, [
                "pages",
                "menuAssocies",
                "menuParent",
                "pages",
                "menuAssocies",
              ]);

              this.menuService
                .addMenu(tempClonedData)
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
              let tempClonedData = <Menu[]>clonedData;

              this.menuService
                .updateManyMenu({
                  ids: tempClonedData.map((d) => d._id),
                  data: {
                    $addToSet: (() => {
                      switch (this.destination) {
                        case "page":
                          return { pages: this.pagesId };

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
    this.menuService
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
    this.ref = this.dialogService.open(TranslateMenuComponent, {
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
        idMenu: event._id,
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
    this.ref = this.dialogService.open(AddMenuComponent, {
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
        idMenu: null,
        independentComponent: false,
        menuParentId: this.menuParentId,
        pagesId: this.pagesId,
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

  onAddItem(data: Menu) {
    this.form.setValue(data);
  }

  onEditClick(event: any) {
    this.ref = this.dialogService.open(AddMenuComponent, {
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
        idMenu: event._id,
        independentComponent: false,
        menuParentId: this.menuParentId,
        pagesId: this.pagesId,
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
    this.ref = this.dialogService.open(DetailMenuComponent, {
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
        idMenu: event._id,
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
