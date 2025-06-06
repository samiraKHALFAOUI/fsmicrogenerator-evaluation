import { Component } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import {
  ListHeader,
  ListCaptionConfig,
  OnDeleteEvent,
} from "src/app/shared/models/defaultModels/List.model";
import { Router, ActivatedRoute } from "@angular/router";
import { EnumerationService } from "src/app/shared/services/TechnicalConfiguration/enumeration.service";
import { Enumeration } from "src/app/shared/models/TechnicalConfiguration/Enumeration.model";
import { MessagesService } from "src/app/shared/services/defaultServices/message.service";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { LangueSiteService } from "src/app/shared/services/TechnicalConfiguration/langueSite.service";
import { HelpersService } from 'src/app/shared/services/defaultServices/helpers.service';

@Component({
  selector: "app-list-enumeration",
  templateUrl: "./list-enumeration.component.html",
  styleUrls: ["./list-enumeration.component.scss"],
})
export class ListEnumerationComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  headers: ListHeader[] = [];
  captionConfig: ListCaptionConfig = {};
  data: Enumeration[] = [];
  missing: any;
  unused: any;
  displayDialog: boolean = false;
  showLoading: boolean = false;
  myForm!: FormGroup
  displayAddMissingValues: boolean = false
  optionLanguage!: any
  unusedValuesToDelete: string[] = []
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private enumerationService: EnumerationService,
    private messagesService: MessagesService,
    private langueSiteService: LangueSiteService,
    private helpers: HelpersService
  ) {
    this.optionLanguage = this.langueSiteService.languages;


  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      items: this.fb.array([])  // FormArray pour les objets de la liste
    });
    this.headers = [
      {
        field: "code",
        header: "code_559",
        sort: true,
        filter: true,
        filterType: "text",
        translate: false,
        filterData: [],
      },
      {
        field: "translations.valeur",
        header: "code_564",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
      // {
      //   field: "translations.commentaire",
      //   header: "code_775",
      //   sort: true,
      //   filter: true,
      //   filterType: "text",
      //   filterData: [],
      // },
      {
        field: "etatValidation",
        header: "code_25",
        sort: true,
        filter: true,
        filterType: "text",
        filterData: [],
      },
    ];
    this.captionConfig = {
      globalFilter: true,
      csv: true,
      pdf: true,
      xls: true,
      selection: true,
      displayedColumns: true,
      clearTable: true,
      refreshData: true,
      addButton: false,
      selectionType: "multiple",
      summary: { enabled: true, message: "" },
      actions: {
        clone: false,
        delete: false,
        edit: true,
        detail: true,
        translate: true,
      },
      buttonsCaption: [
        {
          showButton: true,
          icon: 'pi pi-language',
          tooltip: 'code_17602',
          class: 'p-button-secondary',
          command: () => {
            this.translateI18nValues()
          }
        }, {
          showButton: true,
          icon: 'pi pi-filter',
          tooltip: 'code_12953',
          // class: 'p-button-success',
          command: () => {
            this.filtrerI18nValues()
          }
        },
        {
          showButton: false,
          icon: 'pi pi-check',
          tooltip: 'code_3517',
          class: 'p-button-success',
          command: (index: number, selectedItems: any) => {
            this.validateI18nValues(selectedItems)
          }
        }, {
          showButton: true,
          icon: 'pi pi-upload',
          tooltip: 'code_17584',
          class: 'p-button-warning',
          command: () => {
            this.loadI18nValues()
          }
        },
        {
          showButton: true,
          icon: 'pi pi-download',
          tooltip: 'code_17601',
          class: 'p-button-success',
          command: () => {
            this.generateI18nFiles()
          }
        },
      ]
    };
    this.activatedRoute.data
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        if (response.dataR.error) {
          this.messagesService.showMessage(
            "error",
            "error accrued while getting data"
          );
        } else {
          this.transformData(response.dataR);
        }
      });
  }

  transformData(data: Enumeration[]) {

    this.data = data;
  }

  loadI18nValues() {
    this.enumerationService.loadEnumeration().pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          if (result.length) {
            this.data = [...result, ...this.data]
            let index = this.headers.findIndex((h) => h.field === 'translations.valeur')
            if (index != -1) {
              this.headers[index].filterType = 'chips'
              this.headers = this.headers
            }
            this.messagesService.showMessage("success", "code_17583");
          } else {
            this.messagesService.showMessage('info', 'code_4225')
          }
        },
        error: (error: any) => {
          this.messagesService.showMessage("deleteError");
        },
      });
  }

  generateI18nFiles() {
    this.enumerationService.generateEnumeration().pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {

          this.messagesService.showMessage("success", "code_17613", '', result.data.length ? result.data.toString() : '');

        },
        error: (error: any) => {
          console.error(error)
          this.messagesService.showMessage("deleteError");
        },
      });
  }
  filtrerI18nValues() {
    this.showLoading = true
    this.enumerationService.filterEnumeration().pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.data = result.data
          this.missing = result.missing
          this.unused = result.unused
          this.showLoading = false
          this.displayDialog = true

          // this.messagesService.showMessage("success", "code_17613", '', result.data.length ? result.data.toString() : '');

        },
        error: (error: any) => {
          console.error(error)
          this.messagesService.showMessage("deleteError");
        },
      });
  }
  translateI18nValues() {
    this.router.navigate([`${this.router.url}/translateMany`]);

  }

  validateI18nValues(data: any[]) {
    let ids = data.map((d) => d._id)
    this.enumerationService
      .updateManyEnumeration({ ids, data: { $set: { etatValidation: 'code_4268' } } })
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {

          this.data = this.data.map((item) => {
            item.etatValidation = ids.includes(item._id) ? 'code_4268' : item.etatValidation
            return item
          })

          this.messagesService.showMessage("validationSuccess");
        },
        error: (error: any) => {
          this.messagesService.showMessage("validationError");
        },
      });
  }

  changeState(event: OnDeleteEvent) {
    this.enumerationService
      .changeState(event)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.data = this.data.filter((d: any) => !event.id.includes(d._id));

          this.messagesService.showMessage("deleteSuccess");
        },
        error: (error: any) => {
          this.messagesService.showMessage("deleteError");
        },
      });
  }

  onEditClick(event: any) {
    this.router.navigate([`${this.router.url}/edit`, event._id]);
  }

  onDetailClick(event: any) {
    this.router.navigate([`${this.router.url}/detail`, event._id]);
  }

  onAddClick() {
    this.router.navigate([`${this.router.url}/add`]);
  }

  onTranslateClick(event: any) {
    this.router.navigate([`${this.router.url}/translate`, event._id]);
  }
  deleteUnusedValues() {
    this.enumerationService.deleteUnusedValue(this.unusedValuesToDelete).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (result) => {
        this.unused = this.unused.filter((v: string) => !this.unusedValuesToDelete.includes(v))
        this.unusedValuesToDelete = []
        this.messagesService.showMessage('deleteSuccess')
      }, error: (error) => {
        this.messagesService.showMessage('deleteError')
      }
    })
  }
  //#region add missing enumeration values
  addMissingValues() {
    this.showLoading = true
    while (this.items.length) {
      this.items.removeAt(0)
    }
    let index = 0
    let batchSize = this.missing.length > 10 ? this.missing.length / 10 : this.missing.length
    const interval = setInterval(() => {
      const batch = this.missing.slice(index, index + batchSize)
      batch.forEach((item: string) => this.addItem({ code: item }));
      index += batchSize
      if (index >= this.missing.length) {
        clearInterval(interval)
        this.displayAddMissingValues = true
        this.showLoading = false
      }
    }, 10)

  }
  get items(): FormArray {
    return this.myForm.get('items') as FormArray;
  }

  addItem(data?: any): void {
    this.items.push(this.fb.group({
      code: [data?.code || null, Validators.required],
      etatValidation: [data?.etatValidation || 'code_4268', Validators.required],
      translations: this.fb.array(
        this.optionLanguage.map((t: any) => this.createTranslation({ language: t.code })) || []
      )
    }));
  }
  getTranslations(index: number) {
    return this.items.at(index).get('translations') as FormArray
  }

  createTranslation(data?: any): FormGroup {
    return this.fb.group({
      language: [this.optionLanguage.find((l: any) => l.code === data?.language) || null, Validators.required],
      valeur: [data?.valeur || null, Validators.required],
      commentaire: [data?.commentaire || null]
    });
  }

  addTranslation(index: number): void {
    const translations = this.items.at(index).get('translations') as FormArray;
    translations.push(this.createTranslation());
  }
  removeTranslation(itemIndex: number, translationsIndex: number) {
    this.getTranslations(itemIndex).removeAt(translationsIndex)
  }
  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onSubmit(): void {
    let dataToSave = []
    for (let item of this.items.controls)
      if (item.valid)
        dataToSave.push(item.value)

    if (dataToSave.length) {
      this.helpers.setValuesByPaths(dataToSave, [
        ["translations.language", "code"],
      ]);
      this.enumerationService.addMissingValues(dataToSave).pipe(takeUntil(this.destroyed$)).subscribe({
        next: (result: Enumeration[]) => {
          let codes = result.map((r: any) => r.code)
          this.missing = this.missing.filter((v: string) => !codes.includes(v))
          this.messagesService.showMessage('addSuccess')
          this.displayAddMissingValues = false
        }, error: () => {

        }
      })

    } else {
      this.myForm.markAllAsTouched()
      this.messagesService.showMessage('validationError')
    }
  }


  //#endregion

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
