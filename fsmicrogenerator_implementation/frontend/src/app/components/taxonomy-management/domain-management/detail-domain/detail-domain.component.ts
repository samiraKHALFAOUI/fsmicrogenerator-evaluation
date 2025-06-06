import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { DomainService } from "src/app/shared/services/TaxonomyManagement/domain.service";
import { Domain } from "src/app/shared/models/TaxonomyManagement/Domain.model";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-detail-domain",
  templateUrl: "./detail-domain.component.html",
  styleUrls: ["./detail-domain.component.scss"],
})
export class DetailDomainComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current: Domain | undefined;
  @Output() onDetailFinish: EventEmitter<any> = new EventEmitter();
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  data!: Domain | undefined;
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
    private domainService: DomainService,
    private secureStorage: SecureStorageService
  ) {}
  ngOnInit(): void {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idDomain")
    ) {
      this.id = this.config.data.idDomain;
      this.independentComponent = false;
      if (this.id) {
        this.getDomain();
      }
    } else if (this.current) {
      this.data = this.current;
      this.id = this.current._id;
      this.independentComponent = false;
      if (this.id) {
        this.getDomain();
      }
    } else {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "domain";
          if (this.independentComponent)
            this.transformData(response["dataR"]["data"]);
        },
      });
    }

    if (this.secureStorage.getItem('lang') === "ar") {
      [this.prevTabIcon, this.nextTabIcon] = [
        this.nextTabIcon,
        this.prevTabIcon,
      ];
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
      this.getDomain();
    }
  }

  getDomain() {
    this.domainService
      .getDomainById(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.transformData(result);
        },
        error: (err: any) => {},
      });
  }

  transformData(result: Domain) {
    this.data = result;
  }

  prevTab() {
    this.selectedTab--;
  }

  nextTab() {
    this.selectedTab++;
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
