import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "src/app/shared/services/AccountManagement/user.service";
import { User } from "src/app/shared/models/AccountManagement/User.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";

@Component({
  selector: "app-list-user",
  templateUrl: "./list-user.component.html",
  styleUrls: ["./list-user.component.scss"],
})
export class ListUserComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: User[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.headers = [
      {
        field: "photo",
        header: "code_46",
        sort: false,
        filter: false,
        filterType: "file",
        filterData: [],
      },
      {
        field: "reference",
        header: "code_10547",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "pseudo",
        header: "code_196",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "email",
        header: "code_45",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "salutation",
        header: "code_10538",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "translations.nom",
        header: "code_2263",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "translations.prenom",
        header: "code_40",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "fonction.translations.designation",
        header: "code_42",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "telephone",
        header: "code_44",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "fixe",
        header: "code_352",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "nbreConnection",
        header: "code_10550",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "dateDerniereConnexion",
        header: "code_10551",
        sort: true,
        filter: true,
        filterType: "date",
        filterData: [],
        pipes: [{ name: "date", arguments: "dd/MM/yyyy HH:mm" }],
      },
      {
        field: "etatCompte",
        header: "code_10557",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "groupe.translations.designation",
        header: "code_581",
        sort: true,
        filter: true,
        filterType: "template",
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
      selectionType: "multiple",
      addButton: true,
      summary: { enabled: true, message: "" },
      actions: {
        clone: true,
        delete: true,
        edit: true,
        detail: true,
        translate: false,
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
  transformData(data: User[]) {
    for (let d of data) {
      if (d.dateDerniereConnexion)
        d.dateDerniereConnexion = new Date(d.dateDerniereConnexion);
    }
    this.data = data;
  }

  changeState(event: OnDeleteEvent) {
    this.userService
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
    this.router.navigate([`${this.router.url}/edit`, event._id]);
  }

  onDetailClick(event: any) {
    this.router.navigate([`${this.router.url}/detail`, event._id]);
  }

  onCloneClick(event: any) {
    this.router.navigate([`${this.router.url}/clone`, event._id]);
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
