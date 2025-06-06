import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { CategoryService } from "src/app/shared/services/ProductManagement/category.service";
import { Category } from "src/app/shared/models/ProductManagement/Category.model";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-add-category",
  templateUrl: "./add-category.component.html",
  styleUrls: ["./add-category.component.scss"],
})
export class AddCategoryComponent {
  iconDropZoneConfig: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
    maxFilesize: 1,
    addRemoveLinks: true,
    resizeHeight: 300,
    resizeQuality: 2,
    dictFileTooBig: "Image trop grande, Merci d'en choisir une autre",
    dictRemoveFile: "Supprimer",
    dictCancelUpload: "Annuler",
    dictCancelUploadConfirmation: "Voulez-vous vraiment annuler l'upload ?",
    dictRemoveFileConfirmation: "Voulez-vous vraiment Supprimer ce fichier?",
    acceptedFiles: "image/*",
  };
  selectedIcon: any = null;
  optionsParentCategory: any[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current!: Category | undefined;
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Input() parentCategoryId: string = "";
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  id: any = "";
  selectedTab = 0;
  prevTabIcon = "pi pi-chevron-left";
  nextTabIcon = "pi pi-chevron-right";


  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private categoryService: CategoryService,
    private secureStorage: SecureStorageService
  ) {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idCategory")
    ) {
      this.id = this.config.data.idCategory;
      this.parentCategoryId = this.config.data.parentCategoryId;
      this.independentComponent = false;
      if (this.id) {
        this.getCategory();
      } else {
        this.getAllCategories()
      }
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      icon: [null, []],
      translations: this.fb.group({
        language: [null, []],
        name: [null, [Validators.required]],
      }),
      products: [[], []],
      parentCategory: [this.parentCategoryId || null, []],
      subCategories: [[], []],
    });
    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "category";
          if (this.independentComponent) {
            if (response["dataR"]["categories"]) {
              this.transformCategoriesToTree(response["dataR"]["categories"]);
            }
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
                  if (this.id) this.getCategory();
                  else this.getAllCategories()
                },
                error: () => {
                  this.messagesService.showMessage("error");
                },
              });
          }
        },
        error: () => {
          this.messagesService.showMessage("error");
        },
      });

    } else {
      if (this.current) {
        this.id = this.current._id || this.current;
        this.getCategory();
      } else if (!Object.keys(this.config?.data || []).includes("idCategory")) {
      }
    }

    if (this.secureStorage.getItem('lang') === "ar") {
      [this.prevTabIcon, this.nextTabIcon] = [
        this.nextTabIcon,
        this.prevTabIcon,
      ];
    }
  }
  onUploadIconError(event: any) {
    this.messagesService.showMessage("uploadError");
  }

  onUploadIconSuccess(event: any) {
    this.selectedIcon = event[0];
  }

  onDeleteIconSuccess(event: any) {
    this.selectedIcon = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue
    ) {
      this.id = this.current?._id || this.current;
      this.getCategory();
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
  getAllCategories() {
    let condition: any = { $or: [{ parentCategory: null }, { parentCategory: { $exists: false } }] }
    if (this.id)
      condition['_id'] = { $ne: this.id }
    return this.helpers.resolve<Category[]>((res, rej) => {
      this.categoryService
        .getCategorys({ condition, options : {queryOptions: { select: '-products' } }})
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (result) => {
            this.transformCategoriesToTree(result)
            res(result);
          },
          error: ({ error }: any) => {
            console.error("error", error);
            rej(error);
          },
        });
    });
  }

  transformCategoriesToTree(categories: Category[]) {
    this.optionsParentCategory.splice(0, this.optionsParentCategory.length, ...this.helpers.dataToTreeNodes(categories, 'subCategories', 'icon', true, 'productManagement'))

  }
  getCategory() {
    let getData = () => {
      return this.helpers.resolve<Category>((res, rej) => {
        this.categoryService
          .getCategoryById(this.id)
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

    Promise.all([getData(), this.getAllCategories()])
      .then((result) => {
        this.patchValueIntoForm(result[0]);
      })
      .catch((error) => {
        console.error("error", error);
        this.messagesService.showMessage("error");
      });
  }

  patchValueIntoForm(data: Category) {
    let result = <Partial<Category>>this.helpers.newObject(data);
    if (result.parentCategory && this.optionsParentCategory.length)
      result.parentCategory = this.helpers.flatDeep(this.optionsParentCategory, 'children').find((item: any) => item.key === result.parentCategory?._id)
    this.form.patchValue(result);
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
        "products",
        "subCategories",
        ["parentCategory", "data._id"],
      ]);

      if (this.id) {
        this.categoryService
          .updateCategory(
            this.id,
            this.helpers.convert(newForm, [
              { file: this.selectedIcon, title: "icon" },
            ])
          )
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {

              this.current = result.data;
              this.messagesService.showMessage("updateSuccess");
            },
            error: () => {
              this.messagesService.showMessage("updateError");
            },
          });
      } else {
        this.categoryService
          .addCategory(
            this.helpers.convert(newForm, [
              { file: this.selectedIcon, title: "icon" },
            ])
          )
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.id = result._id;

              this.current = result;

              this.messagesService.showMessage("addSuccess");
            },
            error: () => {
              this.messagesService.showMessage("addError");
            },
          });
      }
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
