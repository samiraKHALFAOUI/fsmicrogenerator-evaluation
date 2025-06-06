import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { EnumerationService } from "src/app/shared/services/TechnicalConfiguration/enumeration.service";
import { Enumeration } from "src/app/shared/models/TechnicalConfiguration/Enumeration.model";

@Component({
  selector: "app-detail-enumeration",
  templateUrl: "./detail-enumeration.component.html",
  styleUrls: ["./detail-enumeration.component.scss"],
})
export class DetailEnumerationComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current: Enumeration | undefined;
  @Output() onDetailFinish: EventEmitter<any> = new EventEmitter();
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  data!: Enumeration | undefined;
  id: any = "";
  cloneMode: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private enumerationService: EnumerationService
  ) {}
  ngOnInit(): void {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idEnumeration")
    ) {
      this.id = this.config.data.idEnumeration;
      this.independentComponent = false;
      if (this.id) {
        this.getEnumeration();
      }
    } else if (this.current) {
      this.data = this.current;
      this.id = this.current._id;
      this.independentComponent = false;
      if (this.id) {
        this.getEnumeration();
      }
    } else {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "enumeration";
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
      this.getEnumeration();
    }
  }

  getEnumeration() {
    this.enumerationService
      .getEnumerationById(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.transformData(result);
        },
        error: (err: any) => {},
      });
  }

  transformData(result: Enumeration) {
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
