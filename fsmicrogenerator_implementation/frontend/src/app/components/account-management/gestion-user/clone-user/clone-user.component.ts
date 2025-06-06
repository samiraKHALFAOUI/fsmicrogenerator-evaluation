import { Component } from "@angular/core";
import { DomainService } from "src/app/shared/services/TaxonomyManagement/domain.service";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { Input, SimpleChanges } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Location } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { UserService } from "src/app/shared/services/AccountManagement/user.service";
import { User } from "src/app/shared/models/AccountManagement/User.model";
import { SecureStorageService } from "src/app/shared/services/defaultServices/secureStorage.service";

@Component({
  selector: "app-clone-user",
  templateUrl: "./clone-user.component.html",
  styleUrls: ["./clone-user.component.scss"],
})
export class CloneUserComponent {
  pKeyFilter: RegExp = /^.*$/;
  optionsSalutation: any[] = [];
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
  maxDateDateDerniereConnexion: Date = new Date();
  minDateDateDerniereConnexion: Date = new Date("0000-02-01T00:00:00.000Z");
  defaultDateDateDerniereConnexion: Date = new Date("2023-12-27T13:59:35.206Z");
  optionsEtatCompte: any[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  form!: FormGroup;
  id: any = "";
  newID: string = "";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Input() current!: User | undefined;
  clonedElement!: User | undefined;
  selectedTab = 0;
  prevTabIcon = "pi pi-chevron-left";
  nextTabIcon = "pi pi-chevron-right";
  domains: any = ["fonction"];

  constructor(
    private domainService: DomainService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private userService: UserService,
    private secureStorage: SecureStorageService
  ) {
    this.optionsSalutation = this.userService.salutation;
    this.optionsEtatCompte = this.userService.etatCompte;
    if (this.config?.data && Object.keys(this.config.data).includes("idUser")) {
      this.id = this.config.data.idUser;
      this.independentComponent = false;
      this.getUser();
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      reference: [null, [Validators.required]],
      pseudo: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      pwCrypte: [null, [Validators.required]],
      salutation: [null, [Validators.required]],
      translations: this.fb.group({
        language: [null, []],
        nom: [null, [Validators.required]],
        prenom: [null, [Validators.required]],
      }),
      fonction: [null, [Validators.required]],
      photo: [null, []],
      telephone: [null, [Validators.required]],
      fixe: [null, []],
      nbreConnection: [null, []],
      dateDerniereConnexion: [null, []],
      etatCompte: [null, [Validators.required]],
      groupe: [null, [Validators.required]],
    });

    if (this.independentComponent) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response["service"] === "user";
          if (this.independentComponent) {
            if (response["dataR"]["data"]) {
              this.patchValueIntoForm(response["dataR"]["data"]);
              this.id = response["dataR"]["data"]._id;
            }
            if (response["dataR"]["domaines"]) {
              this.domains = response["dataR"]["domaines"];
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
  getDomains() {
    return this.helpers.resolve((res, rej) => {
      this.domainService
        .getDomainsByCode(this.domains)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (domains: any) => {
            this.domains = domains;
            res(domains);
          },
          error: ({ error }: any) => {
            console.error("error", error);
            rej(error);
          },
        });
    });
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
      this.getUser();
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

  getUser() {
    let getData = () => {
      return this.helpers.resolve<User>((res, rej) => {
        this.userService
          .getUserById(this.id)
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

    Promise.all([getData(), this.getDomains()])
      .then((result) => {
        this.patchValueIntoForm(result[0]);
      })
      .catch((error) => {
        console.error("error", error);
        this.messagesService.showMessage("error");
      });
  }

  patchValueIntoForm(data: User) {
    let result = <Partial<User>>this.helpers.newObject(data);

    if (result.dateDerniereConnexion)
      result.dateDerniereConnexion = new Date(result.dateDerniereConnexion);
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
      this.helpers.setValuesByPaths(newForm, ["fonction"]);

      this.userService
        .addUser(
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
