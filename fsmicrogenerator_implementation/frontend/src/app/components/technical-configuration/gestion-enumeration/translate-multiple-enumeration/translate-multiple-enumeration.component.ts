import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Enumeration } from 'src/app/shared/models/TechnicalConfiguration/Enumeration.model';
import { LangueSite } from 'src/app/shared/models/TechnicalConfiguration/LangueSite.model';
import { EnumerationService } from 'src/app/shared/services/TechnicalConfiguration/enumeration.service';
import { MessagesService } from 'src/app/shared/services/defaultServices/message.service';
import { LangueSiteService } from '../../../../shared/services/TechnicalConfiguration/langueSite.service';
import { HelpersService } from 'src/app/shared/services/defaultServices/helpers.service';
@Component({
  selector: 'app-translate-multiple-enumeration',
  templateUrl: './translate-multiple-enumeration.component.html',
  styleUrl: './translate-multiple-enumeration.component.scss'
})
export class TranslateMultipleEnumerationComponent {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  @ViewChild('dt', { static: true }) table !: Table
  data: Enumeration[] = [];
  clonedItems: { [s: string]: any } = {};
  languages !: LangueSite[]
  checked: boolean = false;
  initialData: any[] = [];
  rows: number = 20;
  selectedColumns: any[] = [];
  globalFilterFields: any[] = []
  globalCols : any[]  =[]
  constructor(private messageService: MessagesService, private langueSiteService: LangueSiteService,
    private helpers : HelpersService,
    private activatedRoute: ActivatedRoute,
    private enumerationService: EnumerationService,
    private messagesService: MessagesService) {
    this.languages = this.langueSiteService.languages
  }
  ngOnInit() {
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
  ngDoCheck(): void {
    if (!this.selectedColumns.length && this.languages.length) {
      let data: any = []
      this.languages.map((l) => {
        data.push({
          field: `translate.${l.code}.valeur`,
          header: l.translations.value,
          code: l.code,
          flag: l.flag,
          sort: true,
          filter: true,
          filterType: "text",
          filterData: [],
        },)
      })
      this.selectedColumns = data
      this.globalCols = [...data]
      this.globalFilterFields = data.map((d: any) => d.field)
    }
    if (!this.checked && this.languages.length && this.initialData.length) {

      this.checked = true
      this.transformData(this.initialData)
    }
  }
  clear(table: Table) {
    this.selectedColumns = this.helpers.newObject(this.globalCols)
    table.clear();
  }
  test(event: any) {
    this.selectedColumns = event.value;
  }
  transformData(data: Enumeration[]) {
    this.initialData = data
    if (this.initialData.length && this.languages.length && this.checked) {
      let lang = this.languages.map((l) => l.code)
      for (let d of data) {
        let translations: any = {}
        lang.map((l) => {
          //@ts-ignore
          translations[l] = d.translations.find((t: any) => t.language === l) || { valeur: null, commentaire: null }
        })
        d['translate'] = translations
      }
      this.data = data;
    }
  }
  onRowEditInit(item: any) {
    this.clonedItems[item._id as string] = { ...item };
  }
  onRowEditSave(item: any, index: number, rowElement: HTMLTableRowElement) {

    let invalidValue = false
    Object.keys(item.translate).map((t) => {
      if (!item.translate[t].valeur) {

        invalidValue = true;
        return
      }
    })
    if (invalidValue) {
      this.data[index]['invalid'] = true
      this.messageService.showMessage('validationError');
    }
    else {
      delete this.clonedItems[item._id as string];
      delete this.data[index]['invalid']
      Object.keys(item.translate).map((t) => {
        //@ts-ignore
        let j = this.data[index].translations.findIndex((v) => v.language === t)
        if (j === -1) {
          //@ts-ignore
          this.data[index].translations.push({ language: t, ...item.translate[t] })
        }
        else {
          //@ts-ignore
          this.data[index].translations[j] = { ...this.data[index].translations[j], ...item.translate[t] }
        }
      })
      this.translateData(this.data[index], rowElement)
    }
  }
  onRowEditCancel(item: any, index: number) {
    this.data[index] = this.clonedItems[item._id as string];
    delete this.clonedItems[item._id as string];
  }
  translateData(data: any, rowElement: HTMLTableRowElement) {
    this.enumerationService.translateEnumeration(data._id, { translations: data.translations }).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (result) => {
        data = { ...data, ...result.data }
        this.table.saveRowEdit(data, rowElement)
        this.messageService.showMessage('success');
      }, error: (error) => {
      }
    })
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
