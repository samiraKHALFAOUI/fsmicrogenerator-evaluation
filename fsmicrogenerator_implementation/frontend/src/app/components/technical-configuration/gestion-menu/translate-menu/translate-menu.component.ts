import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { LangueSiteService } from "src/app/shared/services/TechnicalConfiguration/langueSite.service";
import { LangueSite } from "src/app/shared/models/TechnicalConfiguration/LangueSite.model";
import { MenuService } from "src/app/shared/services/TechnicalConfiguration/menu.service";
import { Menu } from "src/app/shared/models/TechnicalConfiguration/Menu.model";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-translate-menu",
  templateUrl: "./translate-menu.component.html",
  styleUrls: ["./translate-menu.component.scss"],
})
export class TranslateMenuComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current!: Menu | undefined;
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  id: any = "";
  initialLanguage: LangueSite[];
  optionLanguage: LangueSite[][] = [];
  selectedTab = 0;
  prevTabIcon = "pi pi-chevron-left";
  nextTabIcon = "pi pi-chevron-right";

  dataToTranslate!:Menu;
  checked: boolean = false;
	constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private langueSiteService: LangueSiteService,
    private menuService: MenuService,
    private secureStorage: SecureStorageService
  ) {
    this.initialLanguage = this.langueSiteService.languages;
    if (this.config?.data && Object.keys(this.config.data).includes("idMenu")) {
      this.id = this.config.data.idMenu;

      this.independentComponent = false;
      if (this.id) {
        this.getMenu();
      }
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      translations: this.fb.array([]),
    });
    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "menu";
          if (this.independentComponent) {
            if (response["dataR"]["data"]) {
              this.patchValueIntoForm(response["dataR"]["data"]);
              this.id = response["dataR"]["data"]._id;
            }
          } else {
            this.activatedRoute.params
              .pipe(takeUntil(this.destroyed$))
              .subscribe({
                next: (params: any) => {
                  this.id = params["id"];
                  if (this.id) this.getMenu();
                },
                error: (error) => {
                  this.messagesService.showMessage("error");
                },
              });
          }
        },
        error: (error) => {
          this.messagesService.showMessage("error");
        },
      });
    } else {
      if (this.current) {
        this.id = this.current._id || this.current;
        this.getMenu();
      }
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

  ngDoCheck(): void {
    if (!this.checked && this.initialLanguage.length && this.dataToTranslate) {
      this.checked = true
      this.patchValueIntoForm(this.dataToTranslate)
    }
  }
	get translations(): FormArray {
    return this.form.get("translations") as FormArray;
  }

  newTranslation(data: any = null): FormGroup {
    let form = this.fb.group({
      _id: [null, []],
      language: [null, [Validators.required]],
      titre: [null, [Validators.required]],
    });
    if (data) {
      form.patchValue({
        ...data,
        language: this.initialLanguage.find((l) => l.code === data.language),
      });
    }
    return form;
  }

  addTranslation(data: any = null) {
    this.translations.push(this.newTranslation(data));
    this.optionLanguage[this.translations.length - 1] =
      this.translations.length > 1
        ? this.helpers.newObject(
            this.optionLanguage[this.translations.length - 2].filter(
              (l) =>
                l.code !=
                this.translations
                  .at(this.translations.length - 2)
                  ?.get("language")?.value?.code
            )
          )
        : this.helpers.newObject(this.initialLanguage);
  }

  removeTranslation(i: number) {
    let removedLanguage = this.helpers.newObject(
      this.translations.at(i).get("language")?.value
    );
    this.translations.removeAt(i);
    this.optionLanguage.splice(i, 1);
    for (let op of this.optionLanguage) op.push(removedLanguage);
  }

  onLanguageChange(event: any, index: number) {
    for (let [i, option] of this.optionLanguage.entries()) {
      if (i != index)
        option.splice(
          0,
          option.length,
          ...this.helpers.newObject(
            option.filter((l) => l.code != event.value.code)
          )
        );
    }
  }

  getMenu() {
    let getData = () => {
      return this.helpers.resolve<Menu>((res, rej) => {
        this.menuService
          .getMenuForTranslation(this.id)
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

  patchValueIntoForm(data: Menu) {
	if (data) {
      this.dataToTranslate = data
    }
    if (this.checked) {
    this.current = this.helpers.newObject(data);
    if (this.current.translations instanceof Array)
      for (let t of this.current.translations) this.addTranslation(t);
    else this.addTranslation(this.current.translations);
  }

  }
	prevTab() {
    this.selectedTab--;
  }

  nextTab() {
    this.selectedTab++;
  }

  addData() {

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
      this.helpers.setValuesByPaths(newForm, [
        ["translations.language", "code"],
      ]);
      for (let t of newForm.translations) if (!t._id) delete t._id;

      this.menuService
        .translateMenu(this.id, newForm)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (result) => {

            this.current = result.data;
            this.messagesService.showMessage("updateSuccess");
          },
          error: (error: any) => {
            this.messagesService.showMessage("updateError");
          },
        });
    }
  }

  finish() {
    if (this.config?.data || !this.independentComponent) {
      this.refConfig.close({
        data: this.config.data,
        item: this.current,
      });
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
