import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Router, ActivatedRoute } from "@angular/router";
import { CategoryService } from "src/app/shared/services/ProductManagement/category.service";
import { Category } from "src/app/shared/models/ProductManagement/Category.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";

@Component({
  selector: "app-list-category",
  templateUrl: "./list-category.component.html",
  styleUrls: ["./list-category.component.scss"],
})
export class ListCategoryComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: Category[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.headers = [
      {
        field: "icon",
        header: "code_2605",
        sort: false,
        filter: false,
        filterType: "file",
        filterData: [],
      },
      {
        field: "translations.name",
        header: "code_18391",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "subCategories",
        header: "code_18407",
        sort: true,
        filter: true,
        filterType: "numeric",
        pipes : [{name : 'length'}],
        suffix: 'code_18',
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
        message: "In total there are {{ data.length }} elements.",
      },
      actions: {
        clone: false,
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
  transformData(data: Category[]) {

    this.data = data;
  }

  changeState(event: OnDeleteEvent) {
    this.categoryService
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
