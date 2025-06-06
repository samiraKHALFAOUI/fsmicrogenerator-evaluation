import { Component } from '@angular/core';
import { DomainService } from 'src/app/shared/services/TaxonomyManagement/domain.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessagesService } from 'src/app/shared/services/defaultServices/message.service';
import { HelpersService } from 'src/app/shared/services/defaultServices/helpers.service';
import { UserService } from 'src/app/shared/services/AccountManagement/user.service';
import { User } from 'src/app/shared/models/AccountManagement/User.model';
import { GroupService } from 'src/app/shared/services/AccountManagement/group.service';
import { SecureStorageService } from 'src/app/shared/services/defaultServices/secureStorage.service';

@Component({
  selector: 'app-update-my-profile',
  templateUrl: './update-my-profile.component.html',
  styleUrls: ['./update-my-profile.component.scss'],
})
export class UpdateMyProfileComponent {
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
    dictRemoveFile: 'Supprimer',
    dictCancelUpload: 'Annuler',
    dictCancelUploadConfirmation: "Voulez-vous vraiment annuler l'upload ?",
    dictRemoveFileConfirmation: 'Voulez-vous vraiment Supprimer ce fichier?',
    acceptedFiles: 'image/*',
  };
  selectedPhoto: any = null;
  optionsMembre: any[] = [];
  optionsGroupe: any[] = [];
  optionsEtatCompte: any[] = [];
  optionsEtats: any[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current!: User | undefined;
  @Input() mode: 'clone' | 'add/edit' | 'detail' = 'add/edit';
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Input() membreId: string = '';
  @Input() groupeId: string = '';
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  id: any = '';
  MDP: any;
  selectedTab = 0;
  prevTabIcon = 'pi pi-chevron-left';
  nextTabIcon = 'pi pi-chevron-right';
  domains: any = ['fonction'];
  constructor(
    private domainService: DomainService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private compteUserService: UserService,
    private groupService: GroupService,
    private secureStorage: SecureStorageService
  ) {
    this.optionsSalutation = this.compteUserService.salutation;
    this.optionsEtatCompte = this.compteUserService.etatCompte;
    if (
      this.config?.data &&
      Object.keys(this.config.data).includes('idCompteUser')
    ) {
      this.id = this.config.data.idCompteUser;
      this.MDP = this.config.data.MDP;
      this.membreId = this.config.data.membreId;
      this.groupeId = this.config.data.groupeId;
      this.independentComponent = false;
      if (this.id) {
        this.getCompteUser();
      } else {
        this.getDomains();
        this.getGroupes();
      }
    }
  }
  ngOnInit(): void {
    (this.form = this.fb.group(
      {
        reference: [
          { value: this.helpers.generateReference('CU'), disabled: true },
          [Validators.required],
        ],
        pseudo: [null, [Validators.required, Validators.maxLength(20)]],
        email: [null, [Validators.required, Validators.email]],
        pwCrypte: [
          null,
          [
            Validators.required,
            Validators.pattern(
              '(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,20}'
            ),
          ],
        ],
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
        nbreConnection: [0, []],
        dateDerniereConnexion: [null, []],
        notation: [{ value: null, disabled: true }, []],
        blackList: [{ value: false, disabled: true }, []],
        annonceDepose: [[], []],
        motsDepassOublies: [[], []],
        rechercheSpecifique: [[], []],
        anomalieSignalie: [[], []],
        wishList: [[], []],
        membre: [
          {
            value: this.membreId || null,
            disabled: this.membreId ? true : false,
          },
          [Validators.required],
        ],
        etatCompte: ['code_10577', [Validators.required]],
        etats: [[], []],
        groupe: [
          {
            value: this.groupeId || null,
            disabled: this.groupeId ? true : false,
          },
          [Validators.required],
        ],
        relations: [[], []],
      },
      {
        validator: [this.passwordMatch],
      }
    )),
      this.form
        .get('blackList')
        ?.valueChanges.pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (value) => {
            let blacklisted = this.form.get('blackList')?.value;
            if (blacklisted) {
              this.messagesService.showMessage(
                'error',
                "Votre compte a ete blackliste, veuillez contacter le support pour plus d'informations"
              );
            }
          },
        });

    if (this.independentComponent) {
      //if(!(membreId||groupeId )) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response['service'] === 'compteUser';
          if (this.independentComponent) {
            if (response['dataR']['data']) {
              this.patchValueIntoForm(response['dataR']['data']);
              this.id = response['dataR']['data']._id;
            }
            if (response['dataR']['domaines']) {
              this.domains = response['dataR']['domaines'];
            }
            if (response['dataR']['membres']) {
              response['dataR']['membres'].map((m: any) => {
                if (m.typeMembre === 'code_338') {
                  this.optionsMembre.push({
                    value: m._id,
                    label: `${m.translations.nom}  ${m.translations.prenom}`,
                  });
                } else {
                  this.optionsMembre.push({
                    value: m._id,
                    label: `${m.translations.nom}`,
                  });
                }
              });
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
                  this.id = params['id'];
                  if (this.id) this.getCompteUser();
                },
                error: (error) => {
                  this.messagesService.showMessage('error');
                },
              });
          }
        },
        error: (error) => {
          this.messagesService.showMessage('error');
        },
      });

    } else {
      if (this.current) {
        this.id = this.current._id || this.current;
        this.getCompteUser();
      } else if (
        !Object.keys(this.config?.data || []).includes('idCompteUser')
      ) {
        this.getDomains();
        this.getGroupes();
      }
    }

    if (this.secureStorage.getItem('lang') === 'ar') {
      [this.prevTabIcon, this.nextTabIcon] = [
        this.nextTabIcon,
        this.prevTabIcon,
      ];
    }
  }
  passwordMatch(form: FormGroup) {
    if (form) {
      let password = form.get('pwCrypte')?.value;
      let passwordConfirmation = form.get('pwConfirmation')?.value;
      if (password !== passwordConfirmation) {
        form.get('pwConfirmation')?.setErrors({ mismatch: true });
      } else {
        form.get('pwConfirmation')?.setErrors(null);
      }
    }
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
    if (!(this.domains instanceof Array))
      this.domains = Object.keys(this.domains);
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
            console.error('error', error);
            rej(error);
          },
        });
    });
  }
  onUploadPhotoError(event: any) {
    this.messagesService.showMessage('uploadError');
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
      this.relation?.includes('ToOne') &&
      changes['current'] &&
      changes['current'].currentValue
    ) {
      //@ts-ignore
      this.id = this.current?._id || this.current;
      this.getCompteUser();
    }
  }

  getCompteUser() {
    let getData = () => {
      return this.helpers.resolve<User>((res, rej) => {
        this.compteUserService
          .getUserById(this.id)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              res(result);
            },
            error: ({ error }: any) => {
              console.error('error', error);
              rej(error);
            },
          });
      });
    };

    Promise.all([
      getData(),
      this.getDomains(),
      this.getGroupes(),
    ])
      .then((result) => {
        this.patchValueIntoForm(result[0]);
      })
      .catch((error) => {
        console.error('error', error);
        this.messagesService.showMessage('error');
      });
  }

  patchValueIntoForm(data: User) {
    let result = <Partial<User>>this.helpers.newObject(data);

    if (result.dateDerniereConnexion)
      result.dateDerniereConnexion = new Date(result.dateDerniereConnexion);
    //@ts-ignore
    result.membre = result.membre?._id;
    //@ts-ignore
    result.groupe = result.groupe?._id;
    this.form.patchValue(result);
  }

  prevTab() {
    this.selectedTab--;
  }

  nextTab() {
    this.selectedTab++;
  }

  addData() {
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messagesService.showMessage('error', 'invalid form');

      // #region invalids controls

      let invalidControls = [];
      for (let key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].status === 'INVALID')
          invalidControls.push(key);
      }


      // #endregion invalids controls


    } else {
      let newForm = this.helpers.newObject(this.form.getRawValue());
      this.helpers.setValuesByPaths(newForm, [
        'fonction',
        'motsDepassOublies',
        'rechercheSpecifique',
        'anomalieSignalie',
        'wishList',
        'relations',
        'membre',
        'groupe',
      ]);
      delete newForm.pwConfirmation;
      if (this.id) {
        this.compteUserService
          .updateUser(
            this.id,
            this.helpers.convert(newForm, [
              { file: this.selectedPhoto, title: 'photo' },
            ])
          )
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {

              this.current = result.data;
              this.messagesService.showMessage('updateSuccess');
            },
            error: (error: any) => {
              this.messagesService.showMessage('updateError');
            },
          });
      } else {
        this.compteUserService
          .addUser(
            this.helpers.convert(newForm, [
              { file: this.selectedPhoto, title: 'photo' },
            ])
          )
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.id = result._id;

              this.current = result;

              this.messagesService.showMessage('addSuccess');
            },
            error: (error: any) => {
              console.error(error);

              if (error.error.detail && error.error.detail.includes('E11000')) {
                if (error.error.detail.includes('pseudo')) {
                  this.form.get('pseudo')?.setErrors({ pdup: true });
                }

                if (error.error.detail.includes('email')) {
                  this.form.get('email')?.setErrors({ edup: true });
                }
              }

              this.messagesService.showMessage('addError');
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
