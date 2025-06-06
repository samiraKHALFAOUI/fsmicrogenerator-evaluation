import { Component, Input, Output, SimpleChanges, EventEmitter } from "@angular/core";
import { DomainService } from "src/app/shared/services/TaxonomyManagement/domain.service";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { ReplaySubject, takeUntil } from "rxjs";
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { HelpersService } from "src/app/shared/services/defaultServices/helpers.service";
import { UserService } from "src/app/shared/services/AccountManagement/user.service";
import { User } from "src/app/shared/models/AccountManagement/User.model";
import { GroupService } from "src/app/shared/services/AccountManagement/group.service";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"],
})
export class AddUserComponent {
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
  @Input() current!: User | undefined;
  @Input() mode: "clone" | "add/edit" | "detail" | "translate" = "add/edit";
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  id: any = "";
  domains: any = ["fonction"];
  optionsGroupe:any = []
  @Input() groupeId: string = '';

  constructor(
    private domainService: DomainService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private groupService: GroupService,
    private userService: UserService
  ) {
    this.optionsSalutation = this.userService.salutation;
    this.optionsEtatCompte = this.userService.etatCompte;
    if (this.config?.data && Object.keys(this.config.data).includes("idUser")) {
      this.id = this.config.data.idUser;
      this.groupeId = this.config.data.groupeId;
      this.independentComponent = false;
      if (this.id) {
        this.getUser();
      } else {
        this.getDomains();
        this.getGroupes();
      }
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      reference: [{ value: this.helpers.generateReference('CU'), disabled: true }, [Validators.required]],
      pseudo: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      pwCrypte: [null, [Validators.required]],
      pwConfirmation: [null, [Validators.required]],
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
      etatCompte: ['code_10577', [Validators.required]],
      groupe: [
        {
          value: this.groupeId || null,
          disabled: this.groupeId ? true : false,
        },
        [Validators.required],
      ],
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
            if (response['dataR']['groups']) {
              response['dataR']['groups'].map((m: any) => {
                this.optionsGroupe.push({
                  value: m._id,
                  label: `${m.translations.designation}`,
                });
              });
            }
          } else {
            this.activatedRoute.params
              .pipe(takeUntil(this.destroyed$))
              .subscribe({
                next: (params: any) => {
                  this.id = params["id"];
                  if (this.id) this.getUser();
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
        this.getUser();
      } else if (!Object.keys(this.config?.data || []).includes("idUser")) {
        this.getDomains();
        this.getGroupes();
      }
    }
    if (!this.id) {
      this.form
        .get('pwCrypte')
        ?.setValidators([
          Validators.required,
          Validators.pattern(
            '(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,20}'
          ),
        ]);
      this.form.get('pwCrypte')?.updateValueAndValidity();
      this.form
        .get('pwConfirmation')
        ?.setValidators(
          Validators.compose([
            Validators.required,
            (control: AbstractControl) => this.passwordMatch(control),
          ])
        );

      this.form.get('pwConfirmation')?.updateValueAndValidity();
    }else{
      this.form.removeControl('pwConfirmation')
      this.form.removeControl('pwCrypte')
    }
  }

  passwordMatch(control: AbstractControl): { [key: string]: boolean } | null {
    return this.form.get('pwCrypte')?.value === control.value
      ? null
      : { mismatch: true };
  }

  getGroupes() {
    return this.helpers.resolve((res, rej) => {
      this.groupService
        .getGroups()
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (result) => {
            this.optionsGroupe = result.map(
              (m: any) =>
                (m = { value: m._id, label: `${m.translations.designation}` })
            );
            res(result);
          },
          error: ({ error }: any) => {
            console.error('error', error);
            res(error);
          },
        });
    });
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

    Promise.all([getData(), this.getDomains() ,this.getGroupes()])
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
      this.helpers.setValuesByPaths(newForm, ["fonction","groupe"]);
      delete newForm.pwConfirmation;

      if (this.id) {
        this.userService
          .updateUser(
            this.id,
            this.helpers.convert(newForm, [
              { file: this.selectedPhoto, title: "photo" },
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
        this.userService
          .addUser(
            this.helpers.convert(newForm, [
              { file: this.selectedPhoto, title: "photo" },
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
