import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { Input, SimpleChanges } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { SupplierService } from "src/app/shared/services/SupplierManagement/supplier.service";
import { Supplier } from "src/app/shared/models/SupplierManagement/Supplier.model";
import { TabView } from "primeng/tabview";
import { AuthService } from "src/app/shared/services/defaultServices/auth.service";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-clone-supplier",
  templateUrl: "./clone-supplier.component.html",
  styleUrls: ["./clone-supplier.component.scss"],
})
export class CloneSupplierComponent {
  logoDropZoneConfig: DropzoneConfigInterface = {
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
  selectedLogo: any = null;
  pKeyFilter: RegExp = /^.*$/;
  optionsPurchases: any[] = [];
  dataProducts: any = [];
  dataPurchases: any = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @ViewChild('tabView') tabView !: TabView

  form!: FormGroup;
  id: any = "";
  newID: string = "";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Input() current!: Supplier | undefined;
  clonedElement!: Supplier | undefined;
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
    private supplierService: SupplierService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private secureStorage: SecureStorageService
  ) {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idSupplier")
    ) {
      this.id = this.config.data.idSupplier;
      this.independentComponent = false;
      this.getSupplier();
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      logo: [null, []],
      translations: this.fb.group({
        language: [null, []],
        name: [null, [Validators.required]],
        address: [null, [Validators.required]],
      }),
      email: [null, [Validators.required]],
      officePhoneNumber: [null, [Validators.required]],
      isActif: [null, []],
      purchases: [[], []],
      products: [[], []]
    });

    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "supplier";
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
  onUploadLogoError(event: any) {
    this.messagesService.showMessage("uploadError");
  }

  onUploadLogoSuccess(event: any) {
    this.selectedLogo = event[0];
  }

  onDeleteLogoSuccess(event: any) {
    this.selectedLogo = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue
    ) {
      this.id = this.current?._id || this.current;
      this.getSupplier();
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

  getSupplier() {
    let getData = () => {
      return this.helpers.resolve<Supplier>((res, rej) => {
        this.supplierService
          .getSupplierById(this.id)
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

  patchValueIntoForm(data: Supplier) {
    let result = <Partial<Supplier>>this.helpers.newObject(data);
    this.dataProducts = data.products;
    delete result.products;
    this.dataPurchases = data.purchases;
    delete result.purchases;
    delete result.email
    delete result.officePhoneNumber
    result.isActif =true
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

      this.helpers.setValuesByPaths(newForm, ["products", "purchases"]);
      this.supplierService
        .addSupplier(
          this.helpers.convert(newForm, [
            { file: this.selectedLogo, title: "logo" },
          ])
        )
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (result) => {
            this.newID = result._id;
            this.clonedElement = result;
            this.messagesService.showMessage("cloneSuccess");
          },
          error: (error: any) => {
            if (error.error.detail && error.error.detail.includes('E11000')) {
              if (error.error.detail.includes('officePhoneNumber')) {
                this.form.get('officePhoneNumber')?.setErrors({ odup: true });
              }

              if (error.error.detail.includes('email')) {
                this.form.get('email')?.setErrors({ edup: true });
              }
            }
            this.form.markAllAsTouched()
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
      this.location.back();
    }
  }

  prevTab() {
    if (this.checkAccess({ index: this.selectedTab - 1 }))
      this.selectedTab--;
  }
  nextTab() {
    if (this.checkAccess({ index: this.selectedTab + 1 }))
      this.selectedTab++;
  }
  checkAccess(event: any) {
    if (event.index === 0)
      return true
    let config: any = {}
    switch (event.index) {
      case 1: config = { service: 'productManagement', component: 'product', action: 'list' }; break
    }
    const canAccess = this.authService.isAuthorized(config)
    if (!canAccess && event.originalEvent) {
      this.cd.detectChanges();
      this.tabView.activeIndex = 0;
      this.selectedTab = 0
    }else if(event.originalEvent){
      this.selectedTab = event.index
    }
    return canAccess
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
