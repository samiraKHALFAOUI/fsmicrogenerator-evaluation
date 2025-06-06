import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { DomainService } from "src/app/shared/services/TaxonomyManagement/domain.service";
import { Domain } from "src/app/shared/models/TaxonomyManagement/Domain.model";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-add-domain",
  templateUrl: "./add-domain.component.html",
  styleUrls: ["./add-domain.component.scss"],
})
export class AddDomainComponent {
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
  optionsParent: any[] = [];
  optionsChildren: any[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current!: Domain | undefined;
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
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
    private domainService: DomainService,
    private secureStorage: SecureStorageService
  ) {
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes("idDomain")
    ) {
      this.id = this.config.data.idDomain;
      this.independentComponent = false;
      if (this.id) {
        this.getDomain();
      } else {
      }
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      code: [null, [Validators.required]],
      logo: [null, []],
      translations: this.fb.group({
        language: [null, []],
        designation: [null, [Validators.required]],
        description: [null, []],
      }),
      hasTaxonomies: [null, []],
      parent: [null, []],
      children: [[], []],
      taxonomies: [[], []],
    });
    if (this.independentComponent) {

      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "domain";
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
                  if (this.id) this.getDomain();
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
        this.getDomain();
      } else if (!Object.keys(this.config?.data || []).includes("idDomain")) {
      }
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
      this.getDomain();
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

  getDomain() {
    let getData = () => {
      return this.helpers.resolve<Domain>((res, rej) => {
        this.domainService
          .getDomainById(this.id)
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

  patchValueIntoForm(data: Domain) {
    let result = <Partial<Domain>>this.helpers.newObject(data);

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



      let invalidControls = [];
      for (let key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].status === "INVALID")
          invalidControls.push(key);
      }

      console.error("invalid controls -->", invalidControls);




    } else {
      let newForm = this.helpers.newObject(this.form.getRawValue());
      this.helpers.setValuesByPaths(newForm, ["taxonomies"]);

      if (this.id) {
        this.domainService
          .updateDomain(
            this.id,
            this.helpers.convert(newForm, [
              { file: this.selectedLogo, title: "logo" },
            ])
          )
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
      } else {
        this.domainService
          .addDomain(
            this.helpers.convert(newForm, [
              { file: this.selectedLogo, title: "logo" },
            ])
          )
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.id = result._id;

              this.current = result;

              this.messagesService.showMessage("addSuccess");
            },
            error: (error: any) => {
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
