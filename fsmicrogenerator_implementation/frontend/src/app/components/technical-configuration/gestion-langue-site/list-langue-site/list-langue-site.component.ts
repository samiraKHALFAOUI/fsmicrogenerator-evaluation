import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Router, ActivatedRoute } from "@angular/router";
import { LangueSiteService } from "src/app/shared/services/TechnicalConfiguration/langueSite.service";
import { LangueSite } from "src/app/shared/models/TechnicalConfiguration/LangueSite.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";

@Component({
  selector: "app-list-langue-site",
  templateUrl: "./list-langue-site.component.html",
  styleUrls: ["./list-langue-site.component.scss"],
})
export class ListLangueSiteComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: LangueSite[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private langueSiteService: LangueSiteService,
    private messagesService: MessagesService,
    private helpers: HelpersService
  ) { }

  ngOnInit(): void {
    this.headers = [
      {
        field: "ordreAffichage",
        header: "code_4964",
        sort: true,
        filter: true,
        filterType: "numeric",
        filterData: [],
      },
      {
        field: "flag",
        header: "code_17565",
        sort: true,
        filter: true,
        filterType: "icon",
        filterData: [],
      },
      {
        field: "code",
        header: "code_559",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "translations.value",
        header: "code_181",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "langueParDefault",
        header: "code_6946",
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
      sortButton: {
        showButton: true,
        icon: 'pi pi-list',
        command: (index, selectedItems) => {
          this.changeOrdreAffichage()
        }
      },
      selectionType: "multiple",
      buttonsCaption: [{
        icon: 'pi pi-times',
        command: (index, selectedItems) => {
          this.changeEtatActivation(selectedItems.map((s: any) => s._id), false)
        }
      },
      {
        icon: 'pi pi-check',
        command: (index, selectedItems) => {
          this.changeEtatActivation(selectedItems.map((s: any) => s._id), true)
        }
      },

      ],
      summary: { enabled: true, message: "" },
      actions: {
        clone: false,
        delete: false,
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
  transformData(data: LangueSite[]) {

    this.data = data;
    this.setOrdreAffichage()
  }
  changeOrdreAffichage() {
    this.langueSiteService.updateOrdre({ ids: this.data.map((d) => d._id), attributName: 'ordreAffichage' }).pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.data.map((d, index) => result.length ? d.ordreAffichage = (index + 1) :'')
          this.setOrdreAffichage()
          this.messagesService.showMessage("ordreSuccess");
        },
        error: (error: any) => {
          this.messagesService.showMessage("ordreError");
        },
      });
  }
  setOrdreAffichage() {
    this.langueSiteService.setOrdre(this.helpers.getMax(this.data.filter((d) => d.actif), 'ordreAffichage') + 1)
  }
  changeEtatActivation(ids: string[], actif: boolean) {
    this.langueSiteService.updateManyLangueSite({ ids, data: { $set: { actif } } }).pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.data.map((d) => ids.includes(d._id) ? d.actif = actif : '')
          this.setOrdreAffichage()
          this.messagesService.showMessage("deleteSuccess");
        },
        error: (error: any) => {
          this.messagesService.showMessage("deleteError");
        },
      });
  }
  changeState(event: OnDeleteEvent) {
    this.langueSiteService
      .changeState(event)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.data = this.data.filter((d: any) => !event.id.includes(d._id));
          this.setOrdreAffichage()
          this.messagesService.showMessage("deleteSuccess");
        },
        error: (error: any) => {
          this.messagesService.showMessage("deleteError");
        },
      });
  }

  onEditClick(event: any) {
    this.router.navigate([`${this.router.url}/edit`, event._id]);
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
}
