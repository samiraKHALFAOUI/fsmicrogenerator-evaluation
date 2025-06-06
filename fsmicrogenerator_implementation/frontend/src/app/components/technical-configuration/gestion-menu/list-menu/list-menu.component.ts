import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListCaptionConfig,
  ListHeader,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Menu } from "src/app/shared/models/TechnicalConfiguration/Menu.model";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { MenuService } from "src/app/shared/services/TechnicalConfiguration/menu.service";

@Component({
  selector: "app-list-menu",
  templateUrl: "./list-menu.component.html",
  styleUrls: ["./list-menu.component.scss"],
})
export class ListMenuComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: Menu[] = [];
  @Input() currentMenu!: Menu | undefined;
  optionParent: Menu[] = [];
  optionsNodeData: any = [];
  showAdd: boolean = true;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService,
    private messagesService: MessagesService,
    private helperService: HelpersService,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {

    this.headers = [
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
    this.captionConfig = {
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
    this.activatedRoute.data
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        if (response.dataR.error) {
          this.messagesService.showMessage(
            "error",
            "error accrued while getting data"
          );
        } else {
          this.transformData(response.dataR);
        }
      });
  }
  transformData(data: Menu[]) {
    this.optionParent = this.helperService.newObject(data);
    this.updateNodeData();
    for (let d of data) {
      d.periodeActivation = d.periodeActivation?.map((periodeAcitivation) => {
        if (periodeAcitivation.dateDebut)
          periodeAcitivation.dateDebut = new Date(periodeAcitivation.dateDebut);
        if (periodeAcitivation.dateFin)
          periodeAcitivation.dateFin = new Date(periodeAcitivation.dateFin);

        return periodeAcitivation;
      });
    }
    this.data = this.menuService.menuItemsToTree(
      data
        .filter((d: any) => d.planPrincipale)
        .sort((a: any, b: any) => a.ordre - b.ordre || a.priorite - b.priorite)
    );

  }

  changeState(event: OnDeleteEvent) {
    this.menuService
      .changeState(event)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.data = this.data.filter((d: any) => !event.id.includes(d._id));

          this.messagesService.showMessage("deleteSuccess");
        },
        error: (error: any) => {
          this.messagesService.showMessage("deleteError");
        },
      });
  }

  onEditClick(event: any) {
    this.currentMenu = event;
  }

  onDetailClick(event: any) {
    this.router.navigate([`${this.router.url}/detail`, event._id]);
  }


  onAddClick() {
    this.router.navigate([`${this.router.url}/add`]);
  }

  onTranslateClick(event: any) {
    this.router.navigate([`${this.router.url}/translate`, event._id]);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onAddItem(data: Menu) {
    this.showAdd = false;


    this.recursifUpdateElement(this.optionParent, data);

    let newData = this.helperService.newObject(this.optionParent);


    this.data = this.menuService.menuItemsToTree(
      newData
        .filter((d: any) => d.planPrincipale)
        .sort((a: any, b: any) => a.ordre - b.ordre || a.priorite - b.priorite)
    );
    this.optionsNodeData = this.helperService.newObject(this.data);



    setTimeout(() => {
      this.currentMenu = undefined
      this.showAdd = true;
    }, 100);
  }

  changeState2(data: any, state: string) {
    this.menuService.changeState({ id: [data._id], etat: state }).subscribe({
      next: (result: any) => {
        this.helperService.flatDeep(this.data, "children").map((item: any) => {
          if (data._id === item.data._id) {
            item.data.etatObjet = state;

          }
          return item;
        });




        this.messagesService.showMessage(
          state.includes("code-1") ? "restoreSuccess" : "deleteSuccess"
        );
      },
      error: (error: any) => {
        console.error(error);
        this.messagesService.showMessage("deleteError");
      },
    });
  }

  getMenuItems() {
    let type = "";
    let url = this.router.url;
    if (url.includes("Admin")) {
      type = "code_13934";
    } else if (url.includes("Client")) {
      type = "code_5041";
    } else if (url.includes("Page")) {
      type = "code_13994";
    }

    this.currentMenu = undefined;
    this.menuService
      .getMenus({
        condition: {
          type: type,
        },
      })
      .subscribe((data: any) => {
        this.optionParent = data;

        this.updateNodeData();

        this.data = this.menuService.menuItemsToTree(
          data
            .filter((d: any) => d.planPrincipale)
            .sort(
              (a: any, b: any) => a.ordre - b.ordre || a.priorite - b.priorite
            )
        );

      });
  }

  editItem(data: Menu) {
    let newData = this.helperService.newObject(data);

    this.currentMenu = newData;
  }
  clone(data: Menu) {
    let newData = this.helperService.newObject(data);
    if (newData._id) newData._id = "";
    this.currentMenu = newData;
  }
  activerElement(data: any, etat: boolean) {

    let id = data._id;

    let newForm = this.helperService.newObject(data);
    delete newForm._id;
    delete newForm.createdAt;
    delete newForm.updatedAt;
    delete newForm.__v;
    delete newForm.translations._id;
    delete newForm.translations._id;
    delete newForm.periodeActivation;

    this.helperService.setValuesByPaths(newForm, [
      "pages",
      "menuParent",
      ["menuAssocies", "_id"],
      ["elementAffiche", "_id"],
    ]);
    newForm.actif = etat;
    delete newForm?.taxonomies;
    if (id) {
      this.menuService
        .updateMenu(id, newForm)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (result) => {


            let index = this.optionParent.findIndex(
              (item) => item._id === result.data._id
            );
            if (index === -1) {
              this.optionParent.push(result.data);
            } else {
              this.optionParent[index] = result.data;
            }

            this.recursifUpdateElement(this.optionParent, result.data);

            this.updateNodeData();


            let newData = this.helperService.newObject(this.optionParent);
            this.data = this.menuService.menuItemsToTree(
              newData
                .filter((d: any) => d.planPrincipale)
                .sort(
                  (a: any, b: any) =>
                    a.ordre - b.ordre || a.priorite - b.priorite
                )
            );

            this.messagesService.showMessage("updateSuccess");
          },
          error: (error: any) => {
            this.messagesService.showMessage("updateError");
          },
        });
    }
  }

  form!: FormGroup;

  patchValueIntoForm(data: Menu) {
    this.form = this.fb.group({
      etatDePublication: [null, [Validators.required]],
      translations: this.fb.group({
        language: [null, []],
        titre: [null, [Validators.required]],
      }),
      planPrincipale: [true, [Validators.required]],
      megaMenu: [true, [Validators.required]],
      icon: [null, []],
      ordre: [1, [Validators.required]],
      priorite: [1, [Validators.required]],
      path: [null, []],
      typeAffichage: [null, [Validators.required]],
      typeActivation: [null, [Validators.required]],
      periodeActivation: this.fb.array(
        [
          this.fb.group({
            dateDebut: [null, [Validators.required]],
            dateFin: [null, []],
          }),
        ],
        []
      ),
      periodiciteActivation: [null, []],
      elementAffiche: [[], []],
      pages: [[], []],
      menuParent: [null, []],
      menuAssocies: [[], []],
      menuPrincipal: [null, [Validators.required]],
      actif: [null, [Validators.required]],
      type: [null, [Validators.required]],
    });

    let result = <Partial<Menu>>this.helperService.newObject(data);

    result.periodeActivation = result.periodeActivation?.map(
      (periodeAcitivation) => {
        if (periodeAcitivation.dateDebut)
          periodeAcitivation.dateDebut = new Date(periodeAcitivation.dateDebut);
        if (periodeAcitivation.dateFin)
          periodeAcitivation.dateFin = new Date(periodeAcitivation.dateFin);

        return periodeAcitivation;
      }
    );

    this.form.patchValue(result);
  }

  updateNodeData() {
    this.optionsNodeData = this.helperService.dataToTreeNodes(
      this.helperService.newObject(this.optionParent),
      "menuAssocies",
      "icon"
    );
  }

  recursifUpdateElement = (optionsMenu: Menu[], newElement: Menu) => {
    if (
      this.helperService
        .flatDeep(optionsMenu, "menuAssocies")
        .find((m: any) => m._id === newElement._id)
    ) {
      optionsMenu = this.helperService.removeNode(
        optionsMenu,
        newElement._id,
        "_id",
        "menuAssocies"
      );
    }




    let data = this.helperService.insertNode(
      optionsMenu.filter((p) => p.planPrincipale),
      newElement,
      {
        keySearch: "menuParent",
        keyMap: "_id",
        childrenPath: "menuAssocies",
      }
    );
    this.optionParent.splice(0, this.optionParent.length, ...data);




  };

}
