import { Location } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { ReplaySubject, takeUntil } from "rxjs";
import { Menu } from "src/app/shared/models/TechnicalConfiguration/Menu.model";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";
import { MenuService } from "src/app/shared/services/TechnicalConfiguration/menu.service";

@Component({
  selector: "app-detail-menu",
  templateUrl: "./detail-menu.component.html",
  styleUrls: ["./detail-menu.component.scss"],
})
export class DetailMenuComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current: Menu | undefined;
  @Output() onDetailFinish: EventEmitter<any> = new EventEmitter();
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  data!: Menu | undefined;
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
    private menuService: MenuService,
    private secureStorage: SecureStorageService
  ) {}
  ngOnInit(): void {
    if (this.config?.data && Object.keys(this.config.data).includes("idMenu")) {
      this.id = this.config.data.idMenu;
      this.independentComponent = false;
      if (this.id) {
        this.getMenu();
      }
    } else if (this.current) {
      this.data = this.current;
      this.id = this.current._id;
      this.independentComponent = false;
      if (this.id) {
        this.getMenu();
      }
    } else {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "menu";
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
      //@ts-ignore
      this.id = this.current?._id || this.current;
      this.getMenu();
    }
  }

  getMenu() {
    this.menuService
      .getMenuById(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.transformData(result);
        },
        error: (err: any) => {},
      });
  }

  transformData(result: Menu) {
    result.periodeActivation = result.periodeActivation?.map(
      (periodeAcitivation) => {
        if (periodeAcitivation.dateDebut)
          periodeAcitivation.dateDebut = new Date(periodeAcitivation.dateDebut);
        if (periodeAcitivation.dateFin)
          periodeAcitivation.dateFin = new Date(periodeAcitivation.dateFin);

        return periodeAcitivation;
      }
    );
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
