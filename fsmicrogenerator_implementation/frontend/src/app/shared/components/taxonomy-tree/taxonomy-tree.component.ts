import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { TreeNode } from 'primeng/api';
import { TreeSelect } from 'primeng/treeselect';
import { Taxonomy } from 'src/app/shared/models/TaxonomyManagement/Taxonomy.model';
import { HelpersService } from 'src/app/shared/services/defaultServices/helpers.service';
import { TaxonomyService } from 'src/app/shared/services/TaxonomyManagement/taxonomy.service';
import { DomainService } from 'src/app/shared/services/TaxonomyManagement/domain.service';
import { MessagesService } from 'src/app/shared/services/defaultServices/message.service';
import { ReplaySubject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-taxonomy-tree',
  templateUrl: './taxonomy-tree.component.html',
  styleUrls: ['./taxonomy-tree.component.scss'],
})
export class TaxonomyTreeComponent implements OnInit {
  private destroyed$ = new ReplaySubject<boolean>();
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  @ViewChild('treeSelect') treeSelect!: TreeSelect;
  @Input() label = 'select taxonomie';
  @Input() scrollHeight = '400px';
  @Input() panelClass = '';
  @Input() emptyMessage = 'No results found.';
  @Input() filterPlaceholder = '';
  @Input() taxonomie: any[] = [];
  @Input() selectionMode: 'single' | 'checkbox' | 'multiple' = 'single';
  @Input() control!: FormControl;
  @Input() domain!: any;
  @Input() taxonomieType: 'single' | 'multiple' = 'single';
  @Input() errorsMessage = new Map<string, string>();
  @Input() itemsToShow!: string[];
  @Input() itemsToNotShow!: string[];
  @Input() transform: boolean = false;
  @Input() gridCol: number = 1;
  @Input() gridRow: number = 1;
  @Output() onChange = new EventEmitter();
  parentDomain: any;
  options: any[] = [];
  options2: any[] = [];
  form!: FormGroup;
  selectedLogo: any = null;
  checked = false;
  valueChecked = false;
  displayAddTaxonomieDialog = false;
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
  domainOptions: any = [];
  parentTaxonomies: any = [];
  domainSuggestion: any = [];
  parent = null;
  errorsKeys: string[] = [];
  constructor(
    private taxonomyService: TaxonomyService,
    private helpers: HelpersService,
    private fb: FormBuilder,
    private domainService: DomainService,
    private messagesService: MessagesService
  ) {}
  ngOnInit(): void {
    this.control.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (data: any) => {
        if (data) {
          if (this.selectionMode === 'single') {
            if (data && data.key?.includes('ajouter')) {
              this.control.setValue(null);
            }
          } else if (data?.some((n: any) => n.key?.includes('ajouter'))) {
            this.control.setValue(
              this.control.value?.filter(
                (n: any) => !n.key?.includes('ajouter')
              )
            );
          }
        }
      },
    });
    this.errorsKeys = Array.from(this.errorsMessage.keys());
  }
  async test() {
    if (!this.transform) {
      this.options =
        await this.taxonomyService.taxonomiesToTreeNodesForSelection(
          this.domain,
          this.taxonomieType
        );
    } else {
      this.options =
        (await this.taxonomyService.transformDomain(this.domain)?.children) ||
        [];
      if (this.control.value) {
        let item = this.helpers
          .flatDeep(this.options, 'children')
          .find((c: any) => c.key === this.control.value._id);
        if (item) this.control.setValue(item);
      }
    }
  }
  refillOptions() {
    const filterTaxonomiesToShow = (taxonomies: Taxonomy[]): any[] => {
      return taxonomies
        .map((item) => {
          const filteredChildren = filterTaxonomiesToShow(item.children);
          if (
            this.itemsToShow.includes(item._id || '') ||
            filteredChildren.length
          ) {
            return {
              ...item,
              children: filteredChildren,
            };
          }
          return null;
        })
        .filter((item) => item !== null);
    };
    const filterTaxonomiesToNotShow = (taxonomies: Taxonomy[]): any[] => {
      return taxonomies
        .map((item) => {
          if (this.itemsToNotShow.includes(item._id || '')) {
            return null;
          }
          const filteredChildren = filterTaxonomiesToNotShow(item.children);
          return {
            ...item,
            children: filteredChildren,
          };
        })
        .filter((item) => item !== null);
    };
    let tempDemain = this.helpers.newObject(this.domain);
    if (this.itemsToShow?.length) {
      tempDemain.taxonomies = filterTaxonomiesToShow(tempDemain.taxonomies);
      for (let domain of tempDemain.children)
        domain.taxonomies = filterTaxonomiesToShow(domain.taxonomies);
    }
    if (this.itemsToNotShow?.length) {
      tempDemain.taxonomies = filterTaxonomiesToNotShow(tempDemain.taxonomies);
      for (let domain of tempDemain.children)
        domain.taxonomies = filterTaxonomiesToNotShow(domain.taxonomies);
    }
    if (!this.transform) {
      this.options = this.taxonomyService.taxonomiesToTreeNodesForSelection(
        tempDemain,
        this.taxonomieType,
        !this.itemsToShow
      );
    } else {
      this.options =
        this.taxonomyService.transformDomain(tempDemain)?.children || [];
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['domain']) this.checked = false;
    if (changes['itemsToShow']) this.checked = false;
    if (changes['itemsToNotShow']) this.checked = false;
    if (changes['errorsMessage'])
      this.errorsKeys = Array.from(this.errorsMessage.keys());
  }
  ngDoCheck() {
    if (
      (this.domain?.taxonomies?.length || this.taxonomie?.length) &&
      !this.checked
    ) {
      this.checked = true;
      this.refillOptions();
      if (this.domain.parent && !this.options.length) {
        this.domainService
          .getDomainById(this.domain.parent)
          .pipe(takeUntil(this.destroyed$))
          .subscribe({
            next: (parent: any) => {
              this.parentDomain = parent;
            },
          });
      }
    } else if (!this.options.length && this.domain) {
      this.refillOptions();
      if (this.domain.parent) {
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
      (this.control.value instanceof Array
        ? this.control.value.length
        : this.control.value) &&
      !this.valueChecked
    ) {
      if (this.options.length) {
        if (typeof this.control.value === 'string') {
          this.control.setValue(
            this.helpers
              .flatDeep(this.options, 'children')
              .find(
                (o: any) =>
                  o.key === (this.control.value._id || this.control.value)
              )
          );
        } else if (this.control.value instanceof Array) {
          if (this.control.value.length) {
            let items = this.helpers.flatDeep(this.options, 'children');
            this.control.setValue(
              this.control.value.map((item: any) => {
                let nodeItem = items.find(
                  (o: any) => o.key === (item._id || item)
                );
                return nodeItem;
              })
            );
          }
        } else {
          this.control.setValue(
            this.taxonomyService.taxonomieToTreeNodeForSelection(
              this.control.value,
              this.taxonomieType
            )
            );
        }
        this.control.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe({
          next: (data: any) => {
            if (this.selectionMode === 'single') {
              if (data && data.key?.includes('ajouter')) {
                this.control.setValue(null, { emitEvent: false });
              }
            } else {
              if (data?.some((d: any) => !d.data)) {
                this.control.setValue(
                  this.control.value.map((item: any) => {
                    let nodeItem: any;
                    if (typeof item === 'string') {
                      nodeItem = this.helpers
                        .flatDeep(this.options, 'children')
                        .find((o: any) => o.key === item);
                    } else {
                      nodeItem =
                        this.taxonomyService.taxonomieToTreeNodeForSelection(
                          item,
                          this.taxonomieType
                        );
                    }
                    return nodeItem;
                  }),
                  { emitEvent: false }
                );
              }
              if (data?.some((n: any) => n.key?.includes('ajouter'))) {
                this.control.setValue(
                  this.control.value?.filter(
                    (n: any) => !n.key.includes('ajouter')
                  ),
                  { emitEvent: false }
                );
              }
            }
          },
        });
        this.valueChecked = true;
      }
    }
  }
  autoCompleteFilter(event: any) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.domainOptions.length; i++) {
      let item = this.domainOptions[i];
      if (
        item.translations.designation
          .toLowerCase()
          .indexOf(query.toLowerCase()) === 0
      ) {
        filtered.push(item);
      }
    }
    this.domainSuggestion = filtered;
  }
  onNodeSelect({ node }: any) {
    this.valueChecked = true;
    if (node.key.match(/^ajouter-[0-f]{24}$/)) {
      this.treeSelect.hide();
      this.form = this.fb.group({
        translations: this.fb.group({
          designation: ['', Validators.required],
          description: [''],
        }),
        logo: [''],
        domain: [null, Validators.required],
      });
      if (node.data.code) {
        if (node.data._id != this.domain._id) {
          this.domainOptions = this.domain.children;
        } else {
          this.domainOptions = [this.domain];
          this.form.get('domain')?.setValue(this.domain._id);
        }
      } else {
        this.parent = node?.parent?.key;
        this.parentTaxonomies = [node.data];
        this.form.addControl(
          'parent',
          new FormControl(node.data, Validators.required)
        );
        let domainChildren = this.flatDeep(this.domain.children);
        let subDomain = domainChildren.find(
          (d: any) =>
            d._id ==
            node.data.children.find((c: any) => c.etatObjet.includes('code-1'))
              ?.domain
        );
        this.domainOptions = subDomain ? [subDomain] : [];
        if (this.domainOptions.length) {
          this.form.get('domain')?.setValue(this.domainOptions[0]._id);
        } else {
          if (!node.data.children.length) {
            this.domainOptions = domainChildren.filter(
              (d: any) => d.parent === node.data.domain
            );
            this.domainSuggestion = this.domainOptions;
          }
        }
      }
      this.displayAddTaxonomieDialog = true;
      this.control.setValue([]);
    } else {
      this.emitChange(node);
    }
    if (this.selectionMode === 'single') {
      if (this.control?.value?.key?.includes('ajouter')) {
        this.control.setValue(null);
      }
    } else {
      this.control.setValue(
        this.control?.value?.filter((n: any) => !n.key.includes('ajouter'))
      );
    }
    this.control.updateValueAndValidity();
  }
  emitChange(event: any) {
    if (this.selectionMode === 'single') {
      this.control.setValue(event, { emitEvent: false });
    }
    this.onChange.emit(event);
  }
  addTaxonomie() {
    console.info('form value', this.form.value);
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
      let newForm = this.helpers.newObject(this.form.value);
      this.taxonomyService
        .addTaxonomy(
          this.helpers.convert(newForm, [
            { file: this.selectedLogo, title: 'logo' },
          ]),
        )
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (taxonomie: any) => {
            this.domainService
              .getDomainById(this.domain._id)
              .pipe(takeUntil(this.destroyed$))
              .subscribe({
                next: (domain: any) => {
                  this.domain = domain;
                  this.options2 =
                    this.taxonomyService.taxonomiesToTreeNodesForSelection(
                      this.domain,
                      this.taxonomieType
                    );
                  this.control.setValue(
                    this.flatDeep(this.options2).filter(
                      (n: any) => n.key === taxonomie._id
                    )
                  );
                  this.treeSelect._options = [];
                  this.options = [];
                  setTimeout(() => {
                    this.options = [...this.options2];
                    this.displayAddTaxonomieDialog = false;
                    this.messagesService.showMessage('addSuccess');
                  }, 100);
                },
              });
          },
        });
    }
  }
  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode: any) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
  onUploadError(event: any) {}
  onUploadSuccess(event: any) {
    this.selectedLogo = event[0];
  }
  onDeleteSuccess(event: any) {
    this.selectedLogo = null;
  }
  flatDeep(arr: any) {
    return arr.reduce(
      (acc: any, val: any) =>
        acc.concat(
          val.children && val.children.length
            ? [val].concat(this.flatDeep(val.children))
            : val
        ),
      []
    );
  }
}
