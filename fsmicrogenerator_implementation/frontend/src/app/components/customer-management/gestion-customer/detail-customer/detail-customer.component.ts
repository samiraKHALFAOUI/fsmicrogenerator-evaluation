import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomerService } from "src/app/shared/services/CustomerManagement/customer.service";
import { Customer } from "src/app/shared/models/CustomerManagement/Customer.model";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-detail-customer",
  templateUrl: "./detail-customer.component.html",
  styleUrls: ["./detail-customer.component.scss"],
})
export class DetailCustomerComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current: Customer | undefined;
  @Output() onDetailFinish: EventEmitter<any> = new EventEmitter();
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  data!: Customer | undefined;
  id: any = "";
  cloneMode: boolean = false;

  selectedTab = 0;
  prevTabIcon = "pi pi-chevron-left";
  nextTabIcon = "pi pi-chevron-right";
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private customerService: CustomerService,
    private secureStorage: SecureStorageService
  ) {}
  ngOnInit(): void {
    if (this.secureStorage.getItem('lang') === "ar") {
      [this.prevTabIcon, this.nextTabIcon] = [
        this.nextTabIcon,
        this.prevTabIcon,
      ];
    }

    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idCustomer")
    ) {
      this.id = this.config.data.idCustomer;
      this.independentComponent = false;
      if (this.id) {
        this.getCustomer();
      }
    } else if (this.current) {
      this.data = this.current;
      this.id = this.current._id;
      this.independentComponent = false;
      if (this.id) {
        this.getCustomer();
      }
    } else {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "customer";
          if (this.independentComponent)
            this.transformData(response["dataR"]["data"]);
        },
      });
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue
    ) {
      this.id = this.current?._id || this.current;
      this.getCustomer();
    }
  }

  getCustomer() {
    this.customerService
      .getCustomerById(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.transformData(result);
        },
        error: (err: any) => {},
      });
  }

  transformData(result: Customer) {
    this.data = result;
  }

  goBack() {
    if (!this.independentComponent) {
      if (this.config?.data) {
        this.refConfig.close({ data: this.config.data });
      } else this.onDetailFinish.emit();
    } else {
      this.location.back();
    }
  }

  prevTab() {
    this.selectedTab--;
  }
  nextTab() {
    this.selectedTab++;
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
