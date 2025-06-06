import { Component } from "@angular/core";
import { Input, SimpleChanges } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { GroupService } from "src/app/shared/services/AccountManagement/group.service";
import { Group } from "src/app/shared/models/AccountManagement/Group.model";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-clone-group",
  templateUrl: "./clone-group.component.html",
  styleUrls: ["./clone-group.component.scss"],
})
export class CloneGroupComponent {
  optionsEtatUtilisation: any[] = [];
  pKeyFilter: RegExp = /^.*$/;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  form!: FormGroup;
  id: any = "";
  newID: string = "";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Input() current!: Group | undefined;
  clonedElement!: Group | undefined;
  selectedTab = 0;
  prevTabIcon = "pi pi-chevron-left";
  nextTabIcon = "pi pi-chevron-right";


  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private groupService: GroupService,
    private secureStorage: SecureStorageService,
  ) {
    this.optionsEtatUtilisation = this.groupService.etatUtilisation;
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idGroup")
    ) {
      this.id = this.config.data.idGroup;
      this.independentComponent = false;
      this.getGroup();
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      etatUtilisation: [null, [Validators.required]],
      translations: this.fb.group({
        language: [null, []],
        designation: [null, [Validators.required]],
      }),
      espaces: [[], []],
      users: [[], []],
    });

    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "group";
          if (this.independentComponent) {
            if (response["dataR"]["data"]) {
              this.patchValueIntoForm(response["dataR"]["data"]);
              this.id = response["dataR"]["data"]._id;
            }
          }
        },
        error: (error) => {
          this.messagesService.showMessage("error");
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
      this.getGroup();
    } else if (
      this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue &&
      changes["current"].previousValue
    ) {
      this.patchValueIntoForm(changes["current"].currentValue);
    }
  }

  getGroup() {
    let getData = () => {
      return this.helpers.resolve<Group>((res, rej) => {
        this.groupService
          .getGroupById(this.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              res(result);
            },
            error: ({ error }: any) => {
              console.error("error", error);
              rej(error);
            },
          });
      });
    };

    Promise.all([getData()])
      .then((result) => {
        this.patchValueIntoForm(result[0]);
      })
      .catch((error) => {
        console.error("error", error);
        this.messagesService.showMessage("error");
      });
  }

  patchValueIntoForm(data: Group) {
    let result = <Partial<Group>>this.helpers.newObject(data);

    this.form.patchValue(result);
  }

  cloneData() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messagesService.showMessage("error", "invalid form");

      // #region invalids controls

      let invalidControls = [];
      for (let key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].status === "INVALID")
          invalidControls.push(key);
      }

      console.error("invalid controls -->", invalidControls);

      // #endregion invalids controls


    } else {
      let newForm = this.helpers.newObject(this.form.getRawValue());

      this.groupService
        .addGroup(newForm)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (result) => {
            this.newID = result._id;
            this.clonedElement = result;
            this.messagesService.showMessage("cloneSuccess");
          },
          error: (error: any) => {
            this.messagesService.showMessage("cloneError");
          },
        });
    }
  }

  finish() {
    if (this.config?.data || !this.independentComponent) {
      this.refConfig.close({
        data: this.config.data,
        clonedElement: this.clonedElement,
      });
    } else {
      //back to prev page
      this.location.back();
      //or call router link
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
