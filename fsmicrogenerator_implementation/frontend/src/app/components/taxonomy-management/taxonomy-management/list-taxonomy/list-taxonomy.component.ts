import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Router, ActivatedRoute } from "@angular/router";
import { TaxonomyService } from "src/app/shared/services/TaxonomyManagement/taxonomy.service";
import { Taxonomy } from "src/app/shared/models/TaxonomyManagement/Taxonomy.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";

@Component({
  selector: "app-list-taxonomy",
  templateUrl: "./list-taxonomy.component.html",
  styleUrls: ["./list-taxonomy.component.scss"],
})
export class ListTaxonomyComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: Taxonomy[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private taxonomyService: TaxonomyService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.headers = [
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
  transformData(data: Taxonomy[]) {

    this.data = data;
  }

  changeState(event: OnDeleteEvent) {
    this.taxonomyService
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
