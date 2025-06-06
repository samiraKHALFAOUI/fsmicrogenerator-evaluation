import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Router, ActivatedRoute } from "@angular/router";
import { DomainService } from "src/app/shared/services/TaxonomyManagement/domain.service";
import { Domain } from "src/app/shared/models/TaxonomyManagement/Domain.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";

@Component({
  selector: "app-list-domain",
  templateUrl: "./list-domain.component.html",
  styleUrls: ["./list-domain.component.scss"],
})
export class ListDomainComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: Domain[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private domainService: DomainService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.headers = [
      {
        field: "code",
        header: "code_559",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "logo",
        header: "code_49",
        sort: false,
        filter: false,
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
        field: "hasTaxonomies",
        header: "code_18459",
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
  transformData(data: Domain[]) {

    this.data = data;
  }

  changeState(event: OnDeleteEvent) {
    this.domainService
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
