import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InventoryService } from "src/app/shared/services/InventoryManagement/inventory.service";
import { Inventory } from "src/app/shared/models/InventoryManagement/Inventory.model";

@Component({
  selector: "app-detail-inventory",
  templateUrl: "./detail-inventory.component.html",
  styleUrls: ["./detail-inventory.component.scss"],
})
export class DetailInventoryComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current: Inventory | undefined;
  @Output() onDetailFinish: EventEmitter<any> = new EventEmitter();
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  data!: Inventory | undefined;
  id: any = "";
  cloneMode: boolean = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private inventoryService: InventoryService
  ) { }
  ngOnInit(): void {

    if (this.config?.data &&
      Object.keys(this.config.data).includes("inventory")) {
      this.independentComponent = false;

      this.transformData(this.config.data.inventory)
    }
    else if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idInventory")
    ) {
      this.id = this.config.data.idInventory;
      this.independentComponent = false;
      if (this.id) {
        this.getInventory();
      }
    } else if (this.current) {
      this.data = this.current;
      this.id = this.current._id;
      this.independentComponent = false;
      if (this.id) {
        this.getInventory();
      }
    } else {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "inventory";
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
      this.getInventory();
    }
  }

  getInventory() {
    this.inventoryService
      .getInventoryById(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.transformData(result);
        },
        error: (err: any) => { },
      });
  }

  transformData(result: Inventory) {
    if (result.date) result.date = new Date(result.date);
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

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
