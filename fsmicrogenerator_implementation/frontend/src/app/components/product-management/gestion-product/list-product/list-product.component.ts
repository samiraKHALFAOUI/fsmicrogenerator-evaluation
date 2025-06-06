import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Router, ActivatedRoute } from "@angular/router";
import { ProductService } from "src/app/shared/services/ProductManagement/product.service";
import { Product } from "src/app/shared/models/ProductManagement/Product.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";

@Component({
  selector: "app-list-product",
  templateUrl: "./list-product.component.html",
  styleUrls: ["./list-product.component.scss"],
})
export class ListProductComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: Product[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.headers = [
      {
        field: "image",
        header: "code_204",
        sort: false,
        filter: false,
        filterType: "file",
        filterData: [],
      },
      {
        field: "reference",
        header: "code_2665",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "category.translations.name",
        header: "code_18390",
        sort: true,
        filter: true,
        filterType: "text",
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
        field: "supplier.translations.name",
        header: "code_18426",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      {
        field: "salePrice $concat currency.symbolCurrency",
        header: "code_18394",
        sort: true,
        filter: true,
        filterType: "numeric",
        filterData: [],
      },
      {
        field: "stockQuantity $concat unit.translations.designation",
        header: "code_18396",
        sort: true,
        filter: true,
        filterType: "numeric",
        filterData: [],
      },
      {
        field: "status",
        header: "code_8706",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
        colorize: {
          green: 'code_18398',
          red: 'code_18399',
          orange: 'code_18400'
        }
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
  transformData(data: Product[]) {

    this.data = data;
  }

  changeState(event: OnDeleteEvent) {
    this.productService
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
