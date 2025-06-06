import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { UserService } from "src/app/shared/services/AccountManagement/user.service";
import { User } from "src/app/shared/models/AccountManagement/User.model";

@Component({
  selector: "app-detail-user",
  templateUrl: "./detail-user.component.html",
  styleUrls: ["./detail-user.component.scss"],
})
export class DetailUserComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current: User | undefined;
  @Output() onDetailFinish: EventEmitter<any> = new EventEmitter();
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  data!: User | undefined;
  id: any = "";
  cloneMode: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    if (this.config?.data && Object.keys(this.config.data).includes("idUser")) {
      this.id = this.config.data.idUser;
      this.independentComponent = false;
      if (this.id) {
        this.getUser();
      }
    } else if (this.current) {
      this.data = this.current;
      this.id = this.current._id;
      this.independentComponent = false;
      if (this.id) {
        this.getUser();
      }
    } else {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "user";
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
      this.getUser();
    }
  }

  getUser() {
    this.userService
      .getUserById(this.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.transformData(result);
        },
        error: (err: any) => {},
      });
  }

  transformData(result: User) {
    if (result.dateDerniereConnexion)
      result.dateDerniereConnexion = new Date(result.dateDerniereConnexion);
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
