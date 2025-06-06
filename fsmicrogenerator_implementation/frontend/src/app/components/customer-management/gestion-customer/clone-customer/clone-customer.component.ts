import { Component } from "@angular/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { Input, SimpleChanges } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { CustomerService } from "src/app/shared/services/CustomerManagement/customer.service";
import { Customer } from "src/app/shared/models/CustomerManagement/Customer.model";

@Component({
  selector: "app-clone-customer",
  templateUrl: "./clone-customer.component.html",
  styleUrls: ["./clone-customer.component.scss"],
})
export class CloneCustomerComponent {
  photoDropZoneConfig: DropzoneConfigInterface = {
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
  selectedPhoto: any = null;
  pKeyFilter: RegExp = /^.*$/;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  form!: FormGroup;
  id: any = "";
  newID: string = "";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Input() current!: Customer | undefined;
  clonedElement!: Customer | undefined;



  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private customerService: CustomerService
  ) {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idCustomer")
    ) {
      this.id = this.config.data.idCustomer;
      this.independentComponent = false;
      this.getCustomer();
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      photo: [null, []],
      translations: this.fb.group({
        language: [null, []],
        name: [null, [Validators.required]],
        address: [null, []],
      }),
      email: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      orders: [[], []],
    });

    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "customer";
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

  }
  onUploadPhotoError(event: any) {
    this.messagesService.showMessage("uploadError");
  }

  onUploadPhotoSuccess(event: any) {
    this.selectedPhoto = event[0];
  }

  onDeletePhotoSuccess(event: any) {
    this.selectedPhoto = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.id &&
      this.relation?.includes("ToOne") &&
      changes["current"] &&
      changes["current"].currentValue
    ) {
      this.id = this.current?._id || this.current;
      this.getCustomer();
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

  getCustomer() {
    let getData = () => {
      return this.helpers.resolve<Customer>((res, rej) => {
        this.customerService
          .getCustomerById(this.id)
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

  patchValueIntoForm(data: Customer) {
    let result = <Partial<Customer>>this.helpers.newObject(data);
    delete result.orders;
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

      this.helpers.setValuesByPaths(newForm, ["orders"]);
      this.customerService
        .addCustomer(
          this.helpers.convert(newForm, [
            { file: this.selectedPhoto, title: "photo" },
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
              if (error.error.detail.includes('phoneNumber')) {
                this.form.get('phoneNumber')?.setErrors({ odup: true });
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

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
