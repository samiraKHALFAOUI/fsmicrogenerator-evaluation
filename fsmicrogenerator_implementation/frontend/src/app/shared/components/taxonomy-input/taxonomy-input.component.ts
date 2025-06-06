import { DomainService } from 'src/app/shared/services/TaxonomyManagement/domain.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { HelpersService } from 'src/app/shared/services/defaultServices/helpers.service';
import { TaxonomyService } from 'src/app/shared/services/TaxonomyManagement/taxonomy.service';
import { MessagesService } from 'src/app/shared/services/defaultServices/message.service';
import { Taxonomy } from 'src/app/shared/models/TaxonomyManagement/Taxonomy.model';
@Component({
  selector: 'app-taxonomy-input',
  templateUrl: './taxonomy-input.component.html',
  styleUrls: ['./taxonomy-input.component.scss'],
})
export class TaxonomyInputComponent implements OnInit {
  private destroyed$ = new ReplaySubject<boolean>();
  @Input() label = 'select taxonomy';
  @Input() scrollHeight = '400px';
  @Input() panelClass = '';
  @Input() emptyMessage = 'code_4227';
  @Input() filterPlaceholder = '';
  @Input() taxonomie: any;
  @Input() selectionMode: 'single' | 'checkbox' | 'multiple' = 'single';
  @Input() control!: FormControl;
  @Input() domain!: any;
  @Input() taxonomieType: 'single' | 'multiple' = 'single';
  @Output() onChange: any = new EventEmitter();
  @Input() inputStyle: { [key: string]: string } = {};
  @Input() readOnly: boolean = false;
  parentDomain: any;
  options: any[] = [];
  options2: any[] = [];
  form!: FormGroup;
  selectedLogo: any = null;
  checked = false;
  showAddDialog = false;
  dropZoneConfig: DropzoneConfigInterface = {
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
  parentTaxonomies: any = [];
  constructor(
    private taxonomyService: TaxonomyService,
    private helpers: HelpersService,
    private fb: FormBuilder,
    private domainService: DomainService,
    private messagesService: MessagesService
  ) { }
  ngOnInit(): void {
    this.initOptions();
  }
  initOptions() {
    if (this.taxonomie instanceof Array) {
      this.taxonomie.map((tax: Taxonomy) => {
        this.options.push(tax);
      });
      this.options.push({
        translations: {
          designation: 'ajouter',
        },
        icon: 'pi pi-plus',
      });
    }
  }
  setOptions(data: any[]) {
    this.options = [...data]
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!changes['taxonomie']?.firstChange) {
      if (changes['taxonomie']?.currentValue) {
        this.checked = false;
        if (this.control.value) {
          this.options = [];
        }
        else {
          this.setOptions(this.options)
        }
      } else {
        this.control?.setValue(null);
        this.setOptions(this.options)
      }
    }
  }
  ngDoCheck() {
    if (this.taxonomie && !this.checked) {
      this.checked = true;
      let data = this.helpers
        .newObject(
          this.taxonomie?.children ? this.taxonomie.children : this.taxonomie
        )
      data.push({
        translations: {
          designation: 'ajouter',
        },
        icon: 'pi pi-plus',
      });
      this.setOptions(data)
      if (this.domain?.parent) {
        this.domainService
          .getDomainById(this.domain.parent)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (parent: any) => {
              this.parentDomain = parent;
            },
          });
      }
    }
    if (
      this.control.value &&
      typeof this.control.value === 'string' &&
      this.options.length
    ) {
      let item = this.options.find((o) => o._id === this.control.value);
      this.control.setValue(item);
    }
  }
  onTaxonomieSelect(event: any) {
    this.parentTaxonomies = []
    if (event?.value?.icon) {
      this.control?.setValue(null);
      this.form = this.fb.group({
        translations: this.fb.group({
          designation: ['', Validators.required],
          description: [''],
        }),
        logo: [''],
        domain: [this.domain._id],
      });
      if (this.parentDomain && this.parentDomain.taxonomies?.length) {
        this.parentTaxonomies = this.parentDomain.taxonomies;
        this.form.addControl(
          'parent',
          new FormControl(null, Validators.required)
        );
        if (this.taxonomie && !(this.taxonomie instanceof Array)/*!this.taxonomie?.length*/) {
          this.form.get('parent')?.setValue(this.taxonomie);
          this.parentTaxonomies = [this.taxonomie];
        }
      }
      this.showAddDialog = true;
    } else {
      this.onChange.emit(event.value);
    }
  }
  addTaxonomie() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messagesService.showMessage('error', 'invalid form');
      let invalidControls = [];
      for (let key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].status === 'INVALID')
          invalidControls.push(key);
      }
      console.info('invalid controls -->', invalidControls);
    } else {
      this.taxonomyService
        .addTaxonomy(
          this.helpers.convert(this.form.value, [
            { file: this.selectedLogo, title: 'logo' },
          ]),
        )
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (taxonomie: any) => {
            this.control.setValue(taxonomie);
            this.taxonomie?.children
              ? this.taxonomie.children.push(taxonomie)
              : this.taxonomie.push(taxonomie);
            this.options.splice(this.options.length - 1, 0, taxonomie);
            this.options = [...this.options];
            this.messagesService.showMessage('addSuccess');
            this.showAddDialog = false;
          },
          error: (err: any) => {
            console.error(err);
          },
        });
    }
  }
  onUploadSuccess(event: any) {
    this.selectedLogo = event[0];
  }
  onDeleteSuccess(event: any) {
    this.selectedLogo = null;
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
