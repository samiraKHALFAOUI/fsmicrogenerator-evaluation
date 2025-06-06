import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Menu } from 'src/app/shared/models/TechnicalConfiguration/Menu.model';
import { HelpersService } from 'src/app/shared/services/defaultServices/helpers.service';
import { MessagesService } from 'src/app/shared/services/defaultServices/message.service';
import { MenuService } from 'src/app/shared/services/TechnicalConfiguration/menu.service';
import { GenericService } from 'src/app/shared/services/generic.service';
import { SecureStorageService } from 'src/app/shared/services/defaultServices/secureStorage.service';
@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss'],
})
export class AddMenuComponent {
  typeComponent: any = null;
  optionsTypeAffichage: any[] = [];
  optionsTypeActivation: any[] = [];
  optionsTypeSelect: any[] = []
  maxDateDateDebut: Date[] = [new Date()];
  minDateDateDebut: Date[] = [new Date()];
  defaultDateDateDebut: Date = new Date();
  maxDateDateFin: Date = new Date('+099999-12-31T00:00:00.000Z');
  minDateDateFin: Date = new Date();
  defaultDateDateFin: Date = new Date();
  optionsPeriodiciteActivation: any[] = [];
  optionsElementAffiche: any[] = [];
  optionsMenuParent: any[] = [];
  optionsType: any[] = [];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @Input() current!: Menu | undefined;
  @Input() mode: 'clone' | 'add/edit' | 'detail' | 'translate' = 'add/edit';
  @Input() independentComponent: boolean = true;
  @Input() relation: any = null;
  @Input() menuParentId: string = '';
  @Input() pagesId: string = '';
  @Output() onAddItem: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;
  id: any = '';
  selectedTab = 0;
  prevTabIcon = 'pi pi-chevron-left';
  nextTabIcon = 'pi pi-chevron-right';

  optionsEtatDePublication: any[] = [];
  taxonomiesOptions: any[][] = [];
  @Input() parentOptions: any = [];
  taxonomie1Options: any = [];
  checked: boolean = false;
  espaces: any = [];
  type: string = '';
  @Input() ordre: number = 1;
  prevOrdre!: number;
  checked2: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private helpers: HelpersService,
    public config: DynamicDialogConfig,
    private refConfig: DynamicDialogRef,
    private menuService: MenuService,
    private genericService: GenericService,
    private secureStorage: SecureStorageService
  ) {
    let url = this.router.url;
    if (url.includes('Admin')) {
      this.type = 'code_13934';
    } else if (url.includes('Client')) {
      this.type = 'code_5041';
    } else if (this.independentComponent) {
      this.type = 'code_13994';
    }
    this.optionsEtatDePublication = this.menuService.etatDePublication;
    this.optionsTypeSelect = this.menuService.typeSelect
    this.optionsTypeAffichage = this.menuService.typeAffichage;
    this.optionsTypeActivation = this.menuService.typeActivation;
    this.optionsType = this.menuService.type;
    if (this.config?.data && Object.keys(this.config.data).includes('idMenu')) {
      this.id = this.config.data.idMenu;
      this.menuParentId = this.config.data.menuParentId;
      this.pagesId = this.config.data.pagesId;
      this.independentComponent = false;
      if (this.id) {
        this.getMenu();
      } else {
      }
    }
    this.form = this.fb.group({
      etatDePublication: ['code_541', [Validators.required]],
      translations: this.fb.group({
        language: [null, []],
        titre: [null, [Validators.required]],
      }),
      planPrincipale: [true, [Validators.required]],
      megaMenu: [true, [Validators.required]],
      icon: [null, []],
      ordre: [this.ordre || 1, [Validators.required]],
      priorite: [1, [Validators.required]],
      path: [
        {
          value: null,
          disabled: true,
        },
        [],
      ],
      typeAffichage: ['code_13884', [Validators.required]],
      typeActivation: [null, [Validators.required]],
      periodeActivation: this.fb.array(
        [
          this.fb.group({
            dateDebut: [null, []],
            dateFin: [null, []],
          }),
        ],
        []
      ),
      periodiciteActivation: [null, []],
      typeSelect: [null, []],
      showAll: [null, []],
      nbrElement: [0, [Validators.required]],
      elementAffiche: [[], []],
      menuParent: [this.menuParentId || null, []],
      menuAssocies: [[], []],
      menuPrincipal: [false, [Validators.required]],
      actif: [true, [Validators.required]],
      type: [
        {
          value: this.type,
          disabled: true,
        },
        [Validators.required],
      ],
    });
  }
  ngOnInit(): void {
    this.form.get('planPrincipale')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.form.get('menuParent')?.addValidators(Validators.required);
      } else {
        this.form.get('menuParent')?.setValue(null);
        this.form.get('menuParent')?.setValidators([]);
      }
      this.form.get('menuParent')?.updateValueAndValidity();
    });
    this.form.get('megaMenu')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.form.addControl(
          'taxonomies',
          new FormArray([new FormControl(null, [Validators.required])])
        );
        this.form.get('taxonomies')?.updateValueAndValidity();
        this.taxonomiesOptions[0] = this.taxonomie1Options;
      } else {
        this.form.removeControl('taxonomies');
        this.form.get('path')?.setValue(null);
        this.updateControls()
      }
    });
    this.form.get('taxonomies')?.valueChanges.subscribe((value: any) => {
      if (value.children?.length)
        this.taxonomies.push(new FormControl(null, [Validators.required]));
      this.taxonomies.updateValueAndValidity();
    });
    this.form.get('nbrElement')?.valueChanges.subscribe((value: any) => {
      if (value) {
        this.form.get('typeSelect')?.addValidators(Validators.required)
      } else {
        this.form.get('typeSelect')?.clearValidators()
      }
      this.form.get('typeSelect')?.updateValueAndValidity();
    });

    this.form.get('showAll')?.valueChanges.subscribe((value: any) => {
      if (value) {

        this.form.get('nbrElement')?.setValue(0)
        this.form.get('nbrElement')?.clearValidators()
        this.form.get('nbrElement')?.updateValueAndValidity( )

      } else {
        this.form.get('nbrElement')?.setValidators(Validators.required)
        this.form.get('nbrElement')?.updateValueAndValidity( )
      }


    });
    this.form.get('typeSelect')?.valueChanges.subscribe((value: any) => {
      if (value === 'code_13900') {
        this.form.get('elementAffiche')?.addValidators(Validators.required)
      } else {
        this.form.get('elementAffiche')?.clearValidators()
      }
      this.form.get('elementAffiche')?.updateValueAndValidity();
    });
    this.form.get('typeActivation')?.valueChanges.subscribe((value) => {
      //"code_1960": "permanante",
      if (value === 'code_1960') {
        this.clearPeriodeActivation();
        this.form.get('periodiciteActivation')?.setValue(null);
        this.form.get('periodiciteActivation')?.clearValidators();


      }
      //"code_1963": "ponctuelle",
      else if (value === 'code_1963') {
        this.clearPeriodeActivation();
        this.form.get('periodiciteActivation')?.setValue(null);
        this.form
          .get('periodiciteActivation')
          ?.addValidators([Validators.required]);
      }
      //"code_1962": "occasionnelle",
      else if (value === 'code_1962') {
        this.form.get('periodiciteActivation')?.setValue(null);
        this.form.get('periodiciteActivation')?.clearValidators();
        this.form.get('periodeActivation')?.setValidators(Validators.required)
        this.addPeriodeActivation();
      }
    });
    this.form.get('typeActivation')?.setValue('code_1960');
    if (this.independentComponent) {
      //if(!(menuParentId||pagesId )) {
      this.activatedRoute.data.pipe(takeUntil(this.destroyed$)).subscribe({
        next: (response) => {
          this.independentComponent = response['service'] === 'menu';
          if (this.independentComponent) {
            if (response['dataR']['data']) {
              this.patchValueIntoForm(response['dataR']['data']);
              this.id = response['dataR']['data']._id;
            }
          } else {
            this.activatedRoute.params
              .pipe(takeUntil(this.destroyed$))
              .subscribe({
                next: (params: any) => {
                  this.id = params['id'];
                  if (this.id) this.getMenu();
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
        this.getMenu();
      } else if (!Object.keys(this.config?.data || []).includes('idMenu')) {
      }
    }
    if (this.secureStorage.getItem('lang') === 'ar') {
      [this.prevTabIcon, this.nextTabIcon] = [
        this.nextTabIcon,
        this.prevTabIcon,
      ];
    }
  }
  translateTaxonomies(data: any[]) {
    data.forEach((taxo) => {
      taxo.espace = this.helpers.translateTitle(taxo.espace);
      if (taxo.children && taxo.children.length) {
        this.translateTaxonomies(taxo.children);
      }
    });
  }
  ngDoCheck(): void {
    const global_espace = this.secureStorage.getItem('global_espace',true)
    if (!this.checked && global_espace) {
      this.espaces = global_espace || []
      this.taxonomie1Options = global_espace || []
      this.translateTaxonomies(this.taxonomie1Options);
      this.checked = true;
    }
  }
  clearPeriodeActivation(removeValidator: boolean = true) {
    while (this.getPeriodeActivation().length) {
      this.getPeriodeActivation().removeAt(0);
    }
    if (removeValidator) {
      this.form.get('periodeActivation')?.clearValidators()
      this.form.get('periodeActivation')?.updateValueAndValidity()
    }
  }
  getPeriodeActivation() {
    return this.form.get(`periodeActivation`) as FormArray;
  }
  validerPeriodeActivation() {
    let periodes = this.getPeriodeActivation().value;
    for (let [index, periode] of periodes.entries()) {
      if (periode.dateFin === null) {
        this.messagesService.showMessage(
          'error',
          "date de fin est obligatoire avant d'ajouter un autre element"
        );
        return false;
      }
    }
    return true;
  }
  addPeriodeActivation(periodeActivation?: any) {
    if (this.validerPeriodeActivation()) {
      const PeriodeActivationItem: any = this.fb.group({
        dateDebut: [null, []],
        dateFin: [null, []],
      });
      if (periodeActivation) {
        periodeActivation.dateDebut = new Date(periodeActivation.dateDebut);
        if (periodeActivation.dateFin)
          periodeActivation.dateFin = new Date(periodeActivation.dateFin);
        PeriodeActivationItem.patchValue(periodeActivation);
      }
      this.getPeriodeActivation().push(PeriodeActivationItem);
    }
  }
  deletePeriodeActivation(index: number) {
    this.getPeriodeActivation().removeAt(index);
  }
  getOrdre() {
    this.ordre =
      this.helpers.getMax(
        this.parentOptions.map((d: any) => d.data),
        'ordre'
      ) + 1;
    this.form.get('ordre')?.setValue(this.ordre);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['parentOptions'] &&
      changes['parentOptions'].currentValue?.length
    ) {
      this.helpers
        .flatDeep(this.parentOptions, 'children')
        .map((o: any) => (o.label = o.data.translations.titre));
      this.getOrdre();
    }
    //@ts-ignore
    this.id = this.current?._id || this.current;
    if (changes['current'] && changes['current'].currentValue) {
      if (this.current) {
        this.patchValueIntoForm(this.current);
        this.prevOrdre = this.current.ordre;
      }
    }
  }
  onMenuParentChange(event: any) {
    this.form.get('ordre')?.setValue(
      this.helpers.getMax(
        event.node.children.map((c: any) => c.data),
        'ordre'
      ) + 1 || 1
    );
  }
  onPlanPrincipalChange(event: any) {
    if ((this.checked = true)) {
      let newVal =
        this.helpers.getMax(
          this.parentOptions.map((c: any) => c.data),
          'ordre'
        ) + 1 || 1;
      this.form.get('ordre')?.setValue(this.prevOrdre || newVal);
    }
  }
  getMenu() {
    let getData = () => {
      return this.helpers.resolve<Menu>((res, rej) => {
        this.menuService
          .getMenuById(this.id)
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
    Promise.all([getData()])
      .then((result) => {
        this.patchValueIntoForm(result[0]);
      })
      .catch((error) => {
        console.error('error', error);
        this.messagesService.showMessage('error');
      });
  }
  patchValueIntoForm(data: Menu) {
    if (this.form) this.resetForm();
    if (data._id) {
      this.id = data._id;
    } else {
      this.id = null;
      data.menuAssocies = [];
    }
    let result = <Partial<Menu>>this.helpers.newObject(data);
    result.periodeActivation = result.periodeActivation?.map(
      (periodeAcitivation) => {
        if (periodeAcitivation.dateDebut)
          periodeAcitivation.dateDebut = new Date(periodeAcitivation.dateDebut);
        if (periodeAcitivation.dateFin)
          periodeAcitivation.dateFin = new Date(periodeAcitivation.dateFin);
        return periodeAcitivation;
      }
    );
    if (result.menuParent)
      result.menuParent = this.helpers
        .flatDeep(this.parentOptions, 'children')
        .find(
          (c: any) =>
            c.data._id === (result.menuParent?._id || result.menuParent)
        );
    this.form.patchValue(result);
    this.clearPeriodeActivation();
    if (data.periodeActivation.length) {
      data.periodeActivation.map((item) => {
        this.addPeriodeActivation(item);
      });
      this.form.get('periodeActivation')?.setValidators(Validators.required)
    }
    let item = data;
    let path = item.path?.split('/');
    const recF = (taxonomie: any, index: number = 0) => {

      if (taxonomie.children.length || taxonomie.path.includes('/:id') || ['list', 'detail'].includes(taxonomie.type) || taxonomie.isdetail) {
        this.getOptions(
          { value: taxonomie },
          index,
          taxonomie.path.includes('/:id') ? item.path : null,
          false
        );
        let tax: any;
        if (taxonomie.children.length) {
          tax = taxonomie.children.find((t: any) =>
            t.path.includes(path[index + 1])
          );
          this.taxonomies.at(index + 1).patchValue(tax);
        }
        if (tax && (tax.children.length || tax.path.includes('/:id') || ['list', 'detail'].includes(tax.type)))
          recF(tax, index + 1);
      }
    };
    let tax1 = this.taxonomie1Options.find((t: any) =>
      item.path?.includes(t.path)
    );
    if (tax1) {
      if (this.taxonomies) {
        this.taxonomies.setValue([tax1]);
        recF(tax1, 0);
      }
    }
    if (data.elementAffiche && data.elementAffiche.length) {
      //@ts-ignore
      data.elementAffiche = data.elementAffiche.map((e:any)=>e={_id : e._id|| e }  )
      this.form.get('elementAffiche')?.setValue(data.elementAffiche);
    }
  }
  prevTab() {
    this.selectedTab--;
  }
  nextTab() {
    this.selectedTab++;
  }
  addData() {
    let message = this.validationPeriodeActivation();
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

    } else if (message) {
      this.messagesService.showMessage('error', message);
    } else {
      let newForm = this.helpers.newObject(this.form.getRawValue());
      this.helpers.setValuesByPaths(newForm, [
        ['menuAssocies', '_id'],
        ['elementAffiche', '_id'],
      ]);
      if (!this.form.value.megaMenu) {
        if (
          !this.taxonomies.value[this.taxonomies.length - 1]._id
            .toString()
            .match(/^\d+$/)
        ) {
          newForm['path'] = this.taxonomies.value[
            this.taxonomies.length - 2
          ].path.replace(
            ':id',
            this.taxonomies.value[this.taxonomies.length - 1]._id
          );
        } else {
          newForm['path'] =
            this.taxonomies.value[this.taxonomies.length - 1].path;
        }
      }
      if (this.form.value.menuParent)
        newForm['menuParent'] = newForm.menuParent.data._id;
      else newForm['menuParent'] = null;
      if (this.form.value.icon) newForm.icon = this.form.value.icon;

      delete newForm?.taxonomies;
      if(this.taxonomies && this.taxonomies.length)
        newForm.serviceConfig = this.taxonomies.at(this.taxonomies.length-1)?.value?.serviceConfig||  this.taxonomies.at(this.taxonomies.length-2)?.value?.serviceConfig
      if (this.id) {
        this.menuService
          .updateMenu(this.id, newForm)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.onAddItem.emit(result.data);
              this.current = result.data;
              this.messagesService.showMessage('updateSuccess');
              this.resetForm();
            },
            error: (error: any) => {
              this.messagesService.showMessage('updateError');
            },
          });
      } else {
        this.menuService
          .addMenu(newForm)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (result) => {
              this.id = result._id;
              this.onAddItem.emit(result);
              this.current = result;
              this.messagesService.showMessage('addSuccess');
              this.resetForm();
            },
            error: (error: any) => {
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
  get taxonomies() {
    return this.form.get('taxonomies') as FormArray;
  }
  getOptions(event: any, index: number, path: any = null, clear: boolean = true) {
    const valueToKeep = this.taxonomies.value.slice(0, index + 1);
    this.taxonomies.clear();
    this.optionsElementAffiche = [];
    for (let value of valueToKeep) {
      this.taxonomies.push(new FormControl(value, [Validators.required]));
    }
    if (event.value.children?.length) {
      this.taxonomies.push(new FormControl(null, [Validators.required]));
      this.taxonomiesOptions[index + 1] = event.value.children;
    }
    if (event.value.type) {
      this.typeComponent = event.value.type
    }
    if (!['list', 'detail'].includes(this.typeComponent) && clear) {
      this.updateControls()
    }
    if (['list', 'detail'].includes(event.value.type)) {
      this.genericService.get(event.value.service).subscribe({
        next: (result: any) => {

          result = result.map((r: any) => {
            if (r.translations) {
              r.translations.titre = r.translations.designation ||
                r.translations.title ||
                r.translations.titre ||
                r.translations.name ||
                r.translations.nom || r.translations.titreRubrique
            }
            return r
          })
          this.optionsElementAffiche = result;
          if (event.value.type === 'detail' &&
            event.value.path?.includes(':id')) {
            let componentType = this.taxonomies.at(index - 1).value.type
            this.taxonomies.push(new FormControl(null, [Validators.required]));
            this.taxonomiesOptions[index + 1] = result.map((r: any) => r = { _id: r._id, isdetail: true, value: r, espace: r.translations.titre })
            if (path) {
              let tax = this.taxonomiesOptions[index + 1].find((t: any) =>
                path.includes(t._id)
              );
              this.taxonomies.at(index + 1).patchValue(tax);
              if (componentType === 'rubrique') {
                this.optionsElementAffiche = this.taxonomies.at(index + 1).value.value.postArticle.map((article: any) => { article.translations.titre = article.translations.titreArticle; return article })

              }
            }
            if(this.form.get('showAll')?.value === null)
              this.form.get('showAll')?.setValue(true)


          }
        },
      });
    }

  }
  updateControls() {
    this.form.get('showAll')?.setValue(null)
    this.form.get('nbrElement')?.setValue(0)
    this.form.get('nbrElement')?.clearValidators()
    this.form.get('nbrElement')?.updateValueAndValidity()
    this.form.get('typeSelect')?.setValue(null)
    this.form.get('typeSelect')?.clearValidators()
    this.form.get('typeSelect')?.updateValueAndValidity()
    this.form.get('typeAffichage')?.setValue(null)
    this.form.get('typeAffichage')?.clearValidators()
    this.form.get('typeAffichage')?.updateValueAndValidity()
    this.form.get('elementAffiche')?.setValue([]);
    this.form.get('elementAffiche')?.clearValidators();
    this.form.get('elementAffiche')?.updateValueAndValidity();
  }
  onChangeDateFin(index: number) {
    if (this.getPeriodeActivation().length > index) {
      if (
        this.getPeriodeActivation().value[index]?.dateFin >=
        this.getPeriodeActivation().value[index + 1]?.dateDebut
      ) {
        this.getPeriodeActivation()
          .at(index + 1)
          .get('dateDebut')
          ?.setValue(null);
      }
    }
  }
  onChangeDateDebut(index: number) {
    if (
      this.getPeriodeActivation().value[index].dateDebut <=
      this.getPeriodeActivation().value[index].dateFin
    ) {
      this.getPeriodeActivation().at(index).get('dateFin')?.setValue(null);
    }
    if (this.getPeriodeActivation().length > index) {
      if (
        this.getPeriodeActivation().value[index]?.dateDebut >=
        this.getPeriodeActivation().value[index + 1]?.dateDebut
      ) {
        this.getPeriodeActivation()
          .at(index + 1)
          .get('dateDebut')
          ?.setValue(null);
      }
      if (
        this.getPeriodeActivation().value[index]?.dateDebut >=
        this.getPeriodeActivation().value[index + 1]?.dateFin
      ) {
        this.getPeriodeActivation()
          .at(index + 1)
          .get('dateFin')
          ?.setValue(null);
      }
    }
  }
  resetForm() {
    this.id = '';
    this.form.reset();
    this.form.removeControl('taxonomies');
    this.form.get('planPrincipale')?.setValue(true);
    this.form.get('megaMenu')?.setValue(true);
    this.getOrdre();
    this.form.get('priorite')?.setValue(1);
    this.form.get('actif')?.setValue(true);
    this.form.get('typeActivation')?.setValue('code_1960');
    this.form.get('menuPrincipal')?.setValue(false);
    this.form.get('menuAssocies')?.setValue([]);
    this.form.get('type')?.setValue(this.type);
    this.form.get('etatDePublication')?.setValue('code_541');
    this.updateControls()
  }
  validationPeriodeActivation() {
    let periodes = this.form.get('periodeActivation')?.value;
    for (let [index, periode] of periodes.entries()) {
      if (index < periodes.length) {
        if (periode.dateFin === null) {
          return 'date fin required in all elements exept last one ';
        }
      }
    }
    return '';
  }
}
