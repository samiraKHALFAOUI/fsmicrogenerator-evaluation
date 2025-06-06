import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { LangueSiteService } from "src/app/shared/services/TechnicalConfiguration/langueSite.service";
import { LangueSite } from "src/app/shared/models/TechnicalConfiguration/LangueSite.model";

@Component({
  selector: "app-detail-langue-site",
  templateUrl: "./detail-langue-site.component.html",
  styleUrls: ["./detail-langue-site.component.scss"],
})
export class DetailLangueSiteComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current: LangueSite | undefined;
  @Output() onDetailFinish: EventEmitter<any> = new EventEmitter();
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  data!: LangueSite | undefined;
  id: any = "";
  cloneMode: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private langueSiteService: LangueSiteService
  ) {}
  ngOnInit(): void {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idLangue")
    ) {
      this.id = this.config.data.idLangue;
      this.independentComponent = false;
      if (this.id) {
        this.getLangue();
      }
    } else if (this.current) {
      this.data = this.current;
      this.id = this.current._id;
      this.independentComponent = false;
      if (this.id) {
        this.getLangue();
      }
    } else {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "langueSite";
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
      this.getLangue();
    }
  }

  getLangue() {
    this.langueSiteService
      .getLangueSiteById(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.transformData(result);
        },
        error: (err: any) => {},
      });
  }

  transformData(result: LangueSite) {
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
