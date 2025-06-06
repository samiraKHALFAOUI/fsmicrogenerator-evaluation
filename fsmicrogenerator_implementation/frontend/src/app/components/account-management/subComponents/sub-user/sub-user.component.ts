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
import { UserService } from "src/app/shared/services/AccountManagement/user.service";
import { User } from "src/app/shared/models/AccountManagement/User.model";
import { CloneUserComponent } from "../../gestion-user/clone-user/clone-user.component";
import { AddUserComponent } from "../../gestion-user/add-user/add-user.component";
import { DetailUserComponent } from "../../gestion-user/detail-user/detail-user.component";
import { TranslateUserComponent } from "../../gestion-user/translate-user/translate-user.component";

@Component({
  selector: "app-sub-user",
  templateUrl: "./sub-user.component.html",
  styleUrls: ["./sub-user.component.scss"],
})
export class SubUserComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() form!: FormGroup;
  @Input() destination: string = "";
  @Input() relation: string = "";
  @Input() data: User[] = [];
  @Input() currentUser!: User | undefined;
  @Input() groupeId : any;
  key: string = "";
  listHeaders: ListHeader[] = [];
  listCaptionConfig: ListCaptionConfig = {};
  listPrincipaleHeaders: ListHeader[] = [];
  listPrincipaleCaptionConfig: ListCaptionConfig = {};
  ref!: DynamicDialogRef;
  items: User[] = [];
  operationPhase: "list" | "add/edit" | "detail" | "clone" | "translate" =
    "list";
  dir = document.body.style.direction;

  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private helpers: HelpersService,
    private messagesService: MessagesService,
    private breadcrumbsService: BreadcrumbsService
  ) {}
  ngOnInit(): void {
    if (this.destination === 'group' && this.relation === 'OneToMany') {
      this.listPrincipaleHeaders = [
        {
          field: 'photo',
          header: 'code_46',
          sort: true,
          filter: true,
          filterType: 'file',
          filterData: [],
        },
        {
          field: 'reference',
          header: 'code_10547',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'salutation',
          header: 'code_10538',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'pseudo',
          header: 'code_196',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'translations.nom $concat translations.prenom',
          header: 'code_2263',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },

        {
          field: 'email',
          header: 'code_45',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },

        {
          field: 'fonction.translations.designation',
          header: 'code_42',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'telephone',
          header: 'code_44',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'fixe',
          header: 'code_352',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'nbreConnection',
          header: 'code_10550',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'dateDerniereConnexion',
          header: 'code_10551',
          sort: true,
          filter: true,
          filterType: 'date',
          filterData: [],
          pipes: [{ name: 'date', arguments: 'dd/MM/yyyy HH:mm' }],
        },
        {
          field: 'etatCompte',
          header: 'code_10557',
          sort: true,
          filter: true,
          filterType: 'text',
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
        selectionType: 'multiple',
        summary: { enabled: true, message: '' },
        actions: { clone: true, delete: true, edit: true, detail: true },
      };

      this.listHeaders = [
        {
          field: 'photo',
          header: 'code_46',
          sort: true,
          filter: true,
          filterType: 'file',
          filterData: [],
        },
        {
          field: 'reference',
          header: 'code_10547',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'salutation',
          header: 'code_10538',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'pseudo',
          header: 'code_196',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'translations.nom $concat translations.prenom',
          header: 'code_2263',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },

        {
          field: 'email',
          header: 'code_45',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },

        {
          field: 'fonction.translations.designation',
          header: 'code_42',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'telephone',
          header: 'code_44',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'fixe',
          header: 'code_352',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'nbreConnection',
          header: 'code_10550',
          sort: true,
          filter: true,
          filterType: 'text',
          filterData: [],
        },
        {
          field: 'dateDerniereConnexion',
          header: 'code_10551',
          sort: true,
          filter: true,
          filterType: 'date',
          filterData: [],
          pipes: [{ name: 'date', arguments: 'dd/MM/yyyy HH:mm' }],
        },
        {
          field: 'etatCompte',
          header: 'code_10557',
          sort: true,
          filter: true,
          filterType: 'text',
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
        selectionType: 'multiple',
        summary: { enabled: true, message: '' },
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
    this.userService
      .getUsers({
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
          serviceName: "accountManagement",
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
        .subscribe((clonedData?: User | User[]) => {
          if (clonedData != undefined) {
            if (this.relation === "OneToMany" && clonedData.length) {
              let tempClonedData = <Partial<User>[]>clonedData;

              this.userService
                .addManyUser(
                  tempClonedData.map((d) => {
                    delete d._id;
                    // delete the attributes that have a oneToMany relation

                    //d[this.key]=;
                    this.helpers.setValuesByPaths(d, ["fonction"]);

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
              let tempClonedData = <Partial<User>>clonedData;

              delete tempClonedData._id;
              // delete the attributes that have a oneToMany relation

              //tempClonedData[this.key] =;
              this.helpers.setValuesByPaths(tempClonedData, ["fonction"]);

              this.userService
                .addUser(tempClonedData)
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
              let tempClonedData = <User[]>clonedData;

              this.userService
                .updateManyUser({
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
    this.userService
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
    this.ref = this.dialogService.open(TranslateUserComponent, {
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
        idUser: event._id,
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
    this.ref = this.dialogService.open(AddUserComponent, {
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
        idUser: null,
        independentComponent: false,
        groupeId : this.groupeId
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

  onAddItem(data: User) {
    this.form.setValue(data);
  }

  onEditClick(event: any) {
    this.ref = this.dialogService.open(AddUserComponent, {
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
        idUser: event._id,
        independentComponent: false,
        groupeId : this.groupeId
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
    this.ref = this.dialogService.open(DetailUserComponent, {
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
        idUser: event._id,
        independentComponent: false,
        groupeId : this.groupeId
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
    this.ref = this.dialogService.open(CloneUserComponent, {
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
        idUser: event._id,
        independentComponent: false,
        groupeId : this.groupeId
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
