import { AuthService } from './../../services/defaultServices/auth.service';
import { UndoDeleteDialogService } from 'src/app/shared/services/defaultServices/undo-delete-dialog.service';
import { HelpersService } from 'src/app/shared/services/defaultServices/helpers.service';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ContentChild,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MenuItem } from 'primeng/api';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import {
  ListCaptionConfig,
  ListHeader,
  OnDeleteEvent,
} from 'src/app/shared/models/defaultModels/List.model';
import { SecureStorageService } from '../../services/defaultServices/secureStorage.service';
@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent implements OnInit, OnChanges {
  @Input() data: any = [];
  @Input() cols: ListHeader[] = [];
  @Input() selectedCols: any = [];
  @Input() typeAffichage: 'table' | 'card' = 'table';
  @Input() cartdAffichage: 'top' | 'left' | 'right' = 'top';
  @Input() filterPosition: 'top' | 'left' | 'right' = 'left';
  typeSort = new Map<string, 'noSort' | 'asc' | 'desc'>();
  @Input() rows: any = 10;
  p: number = 1;
  subData: any[] = [];
  @Input() filterConfigurations: any[] = [];
  @Input() grid: boolean = true;
  @Input() captionConfig: ListCaptionConfig = {};
  @Input() prohibitDeletion: string[] = [];
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  @Input() serviceName: string = '';
  @Input() componentName: string = '';
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col: any) => {
      return val.includes(col);
    });
  }
  @Input() mode!: string;
  @ViewChild('dt') dataTable!: Table;
  @ContentChild('expandedRow', { static: false })
  public expandedRow!: TemplateRef<any>;
  showProhibitDelettingMsg: boolean = false;
  @Output() onEditClick: EventEmitter<any> = new EventEmitter();
  @Output() onDetailClick: EventEmitter<any> = new EventEmitter();
  @Output() onCloneClick: EventEmitter<any> = new EventEmitter();
  @Output() onAddClick: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<OnDeleteEvent> = new EventEmitter();
  @Output() onTranslateClick: EventEmitter<any> = new EventEmitter();
  @Output() onValidateClick: EventEmitter<any> = new EventEmitter();
  columns: any[] = [];
  @Input() selectedItems: any = [];
  @Output() selectedItemsChange = new EventEmitter();
  @Input() sortConfig: any = [];
  filteredData: any[] = [];
  fill = '';
  speedDialItems: any[] = [];
  selectedSortOptions: any = null;
  currentSort: any = null;
  initSpeedDialItems: MenuItem[] = [
    {
      id: 'csv',
      icon: 'pi pi-file',
      tooltipOptions: {
        tooltipLabel: 'export CSV',
        tooltipPosition: 'top',
      },
      command: () => {
        this.dataTable.exportCSV();
      },
    },
    {
      id: 'xls',
      icon: 'pi pi-file-excel',
      tooltipOptions: {
        tooltipLabel: 'export XLS',
        tooltipPosition: 'top',
      },
      command: () => {
        this.exportExcel();
      },
    },
    {
      id: 'pdf',
      icon: 'pi pi-file-pdf',
      tooltipOptions: {
        tooltipLabel: 'export PDF',
        tooltipPosition: 'top',
      },
      command: () => {
        this.exportPdf();
      },
    },
    {
      id: 'selection',
      icon: 'pi pi-filter',
      tooltipOptions: {
        tooltipLabel: 'export selection only',
        tooltipPosition: 'top',
      },
      command: () => {
        this.dataTable.exportCSV({ selectionOnly: true });
      },
    },
  ];
  globalFilterFields: string[] = [];
  demiRows = 0;
  _selectedColumns: any[] = [];
  exportColumns: any[] = [];
  changes: any = null;
  regex = /\{\{\s*data\.length\s*\}\}/g;
  initialCaptionConfig: ListCaptionConfig = {
    globalFilter: true,
    csv: false,
    pdf: false,
    xls: false,
    selection: false,
    displayedColumns: false,
    clearTable: true,
    refreshData: false,
    addButton: false,
    sortButton: {},
    validateButton: false,
    expanded: null,
    selectionType: 'single',
    summary: {
      enabled: true,
      message: 'In total there are {{data.length}} elements.',
    },
    buttons: [],
    buttonsCaption: [],
    actions: {
      clone: false,
      delete: false,
      edit: false,
      detail: false,
      translate: false,
    },
  };
  reorderData: boolean = false;
  constructor(
    private undoDialogService: UndoDeleteDialogService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public translateService: TranslateService,
    public helpers: HelpersService,
    private authService: AuthService,
    private secureStorage: SecureStorageService
  ) {
    if (this.config.data?.headers) {
      this.captionConfig = {
        ...this.initialCaptionConfig,
        ...this.config.data.captionConfig,
      };
      if (
        this.captionConfig.actions &&
        this.captionConfig.actions.clone === false &&
        this.captionConfig.actions.edit === false &&
        this.captionConfig.actions.delete === false
      ) {
        if (this.captionConfig.actions.translate) this.mode = 'translate';
        else if (this.captionConfig.actions.detail) this.mode = 'detail';
      } else {
        this.mode = 'add/edit/clone';
      }
      this.serviceName = this.config.data.serviceName;
      this.cols = this.config.data.headers || [];
      this.data = this.config.data.data;
      this.selectedItems = this.data.filter((item: any) => item.selected);
      if (
        this.captionConfig?.selectionType === 'single' &&
        this.selectedItems.length
      )
        this.selectedItems = this.selectedItems[0];
      this.translateService
        .get(this.config.header || '')
        .subscribe((translation) => {
          this.config.header = translation;
        });

      this.cols.map((c) =>
        !c.hasOwnProperty('translate') ? (c.translate = true) : ''
      );
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['cols'] || changes?.['captionConfig']) {
      this.changes = changes;
    }
    if (changes['cols'] && changes['cols'].currentValue) {
      this.filterConfigurations = [];
      changes['cols'].currentValue
        .filter((c: any) => c.filter && c.filterType != 'file')
        .map((c: any) => {
          this.filterConfigurations.push({
            searchby: c.field,
            type: c.customFilter,
            options: c.filterData,
            icon: c.icon,
            titre: c.header,
          });
        });
      changes['cols'].currentValue
        .filter((c: any) => c.sort && c.filterType != 'file')
        .map((c: any) => {
          this.sortConfig.push({
            label: c.header,
            field: c.field,
            type: c.filterType,
          });
        });
    }

  }
  test0(event: any) {

    return true;
  }
  sortData(event: any) {

    const label = event.label;
    const currentSorticon = this.typeSort.get(label) || 'noSort';
    switch (currentSorticon) {
      case 'noSort':
        this.typeSort.set(label, 'asc');
        this.helpers.sortData(this.data, event.field, event.type, 'asc');
        break;
      case 'asc':
        this.typeSort.set(label, 'desc');
        this.helpers.sortData(this.data, event.field, event.type, 'desc');
        break;
      case 'desc':
        this.typeSort.set(label, 'noSort');
        this.data = this.data;
        break;
    }

  }
  toggleSortDirection(event: any) {
    this.typeSort.forEach((value, key) => {
      let newSortDirection = this.typeSort.get(event.label) || 'noSort';
      switch (value) {
        case 'noSort':
          newSortDirection = 'asc';
          break;
        case 'asc':
          newSortDirection = 'desc';
          break;
        default:
          newSortDirection = 'asc';
          break;
      }
      this.typeSort.set(key, newSortDirection);
      this.currentSort = newSortDirection === 'asc' ? 'desc' : 'asc';
      const option = this.sortConfig.find(
        (option: { label: string }) => option.label === key
      );
      if (option) {
        this.helpers.sortData(
          this.data,
          option.field,
          option.type,
          newSortDirection
        );
      }
    });
  }
  onSortChange(event: any) {
    this.sortData(event);
  }
  getSortIconClass() {
    switch (this.currentSort) {
      case 'asc':
        return 'pi pi-sort-amount-up';
      case 'desc':
        return 'pi pi-sort-amount-down';
      default:
        return 'pi pi-sort-amount-up';
    }
  }
  ngDoCheck() {
    if (this.changes) {
      this.cols.map((c) =>
        !c.hasOwnProperty('translate') ? (c.translate = true) : ''
      );
      this.columns = [...this.cols];
      this.columns = [...this._selectedColumns] = this.columns.map(
        (col: any) => {
          let val = { ...col };
          if (typeof val.header === 'object') {
            if (typeof val.header.data === 'object' && val.header.data.length) {
              val.header =
                val.header.data.find(
                  (d: any) => d.language === this.secureStorage.getItem('lang')
                )?.value || val.header.data[0].value;
            } else val.header = val.header.data.value;
          }
          return val;
        }
      );
      if (this.changes.captionConfig) {
        const mergeCaptionConfigs = (
          newCaptionConfig: any,
          initConfig: any
        ) => {
          Object.keys(newCaptionConfig).forEach((key) => {
            if (initConfig[key] !== undefined) {
              if (
                initConfig[key] &&
                typeof initConfig[key] === 'object' &&
                !(initConfig[key] instanceof Array)
              ) {
                if (!Object.keys(initConfig[key]).length) {
                  initConfig[key] = newCaptionConfig[key];
                } else
                  initConfig[key] = mergeCaptionConfigs(
                    newCaptionConfig[key],
                    initConfig[key]
                  );
              } else {
                initConfig[key] = newCaptionConfig[key];
              }
            }
          });
          return initConfig;
        };
        this.captionConfig = mergeCaptionConfigs(
          this.captionConfig,
          this.helpers.newObject(this.initialCaptionConfig)
        );
      } else if (!this.captionConfig) {
        this.captionConfig = this.initialCaptionConfig;
      }
      if (
        this.captionConfig.actions &&
        this.captionConfig.actions.clone === false &&
        this.captionConfig.actions.edit === false &&
        this.captionConfig.actions.delete === false
      ) {
        if (this.captionConfig.actions.translate) this.mode = 'translate';
        else if (this.captionConfig.actions.detail) this.mode = 'detail';
      } else {
        this.mode = 'add/edit/clone';
      }
      this.speedDialItems = this.initSpeedDialItems.filter((item: any) => {
        // @ts-ignore
        return this.captionConfig[item.id];
      });
      let filterFields: any = [];
      this.cols.map((col) => {
        let value: any = col.field;
        if (value.includes('$con'))
          value = value.replace(/[$\s]+con[\w\W]*?cat/g, '');
        if (value.includes('$xor')) value = value.replace(/\$xor/g, '');
        if (value.includes('$or')) value = value.replace(/\$or/g, '');
        value = value.split(' ').filter((v: any) => v);
        filterFields.push(...value);
      });
      this.globalFilterFields = filterFields;
      this.changes = null;
    }
    if (this.dataTable && this.dataTable._columns) {
      this.selectedCols.splice(
        0,
        this.selectedCols.length,
        ...this.dataTable._columns
      );
    }
  }
  onAdd() {
    if (this.authService.isAuthorized({ service: this.serviceName, component: this.componentName, action: 'add' }))
      this.onAddClick.emit();
  }
  onEdit(event: any) {
    if (this.authService.isAuthorized({ service: this.serviceName, component: this.componentName, action: 'edit' }))
      this.onEditClick.emit(event);
  }
  onDetail(event: any) {
    if (this.authService.isAuthorized({ service: this.serviceName, component: this.componentName, action: 'detail' }))
      this.onDetailClick.emit(event);
  }
  onClone(event: any) {
    if (this.authService.isAuthorized({ service: this.serviceName, component: this.componentName, action: 'clone' }))
      this.onCloneClick.emit(event);
  }
  onTranslate(event: any) {
    if (this.authService.isAuthorized({ service: this.serviceName, component: this.componentName, action: 'translate' }))
      this.onTranslateClick.emit(event);
  }
  test(event: any) {
    this._selectedColumns = event.value;
  }
  ngOnInit(): void {
    this.demiRows = Math.floor(this.rows / 2);
    this.columns = [];
    this.cols.map((col: any) => {
      this.columns.push({ ...col });
    });
    this._selectedColumns = [];
    this.columns.map((col: any) => {
      this._selectedColumns.push({ ...col });
    });
    this.exportColumns = this.columns?.map((col: any) => ({
      title: col.header,
      dataKey: col.field,
    }));
    for (let sort of this.sortConfig) {
      this.typeSort.set(sort.label, 'noSort');
    }
    this.subData = this.data;
    this.sortConfig.forEach(
      (option: { label: string; translatedLabel: string }) => {
        this.translateService
          .get(option.label)
          .subscribe((translatedLabel: string) => {
            option.translatedLabel = translatedLabel;
          });
      }
    );
  }
  initialdata(): any[] {
    if (this.filteredData.length) {

      return this.filteredData;
    } else if (this.fill === 'empty') {

      return this.filteredData;
    } else {

      return this.subData;
    }
  }
  handleFilteredData(filteredData: any[]) {
    this.filteredData = filteredData;
    if (!this.filteredData.length) this.fill = 'empty';
    else this.fill = '';
    this.initialdata();
  }
  exportPdf() {
    const doc = new jsPDF();
    //@ts-ignore
    doc.autoTable(this.exportColumns, this.data);
    doc.save('table.pdf');
    //@ts-ignore
    jsPDF.then((jsPDF:any) => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.exportColumns, this.data);
        doc.save('data.pdf');
      })
    })
  }
  exportExcel() {
    import('xlsx').then((xlsx) => {
      let newData = [...this.data];
      newData = newData.map((d) => {
        d.valeurs = d.valeurs
          .map((v: any) => `${v.code} : ${v.translations.valeur}`)
          .join(',\n');
        delete d.classeConcerne;
        delete d.etatObjet;
        delete d.defaultValues;
        delete d.__v;
        delete d.createdAt;
        delete d.updatedAt;
        return d;
      });

      const worksheet = xlsx.utils.json_to_sheet(newData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'data');
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  onValidateDataClick() {
    this.onValidateClick.emit({
      data: this.selectedItems,
      id:
        this.selectedItems instanceof Array
          ? this.selectedItems.map((item: any) => item._id)
          : [this.selectedItems?._id],
      etatValidation: 'code-2',
    });
    this.selectedItems = [];
  }
  changeState() {
    this.onDelete.emit({
      id:
        this.selectedItems instanceof Array
          ? this.selectedItems.map((item: any) => item._id)
          : [this.selectedItems?._id],
      etat: 'code-2',
    });
    this.selectedItems = [];
  }
  showUndoDialog() {
    this.undoDialogService.showDialog((event) => {
      if (event.result === 'timeout') {
        this.changeState();
      }
    }, 2);
  }

  clear(table: Table) {
    this._selectedColumns = this.columns;
    table.clear();
  }
  saveSelectedItems() {
    this.ref.close(this.selectedItems);
  }
  id = '';
  onSelect(event: any) {
    this.showProhibitDelettingMsg = false;
    this.id = '';
    if (event) {
      let data = event instanceof Array ? event : [event];
      if (data.length && this.prohibitDeletion?.length) {
        for (let item of data) {
          for (let key of this.prohibitDeletion) {
            if (item[key] && item[key].length) {
              this.showProhibitDelettingMsg = true;
              this.id = item._id;
            }
            if (this.showProhibitDelettingMsg) {
              break;
            }
          }
          if (this.showProhibitDelettingMsg) {
            break;
          }
        }
        if (this.id) {
          const index = this.dataTable._selection.findIndex(
            (item: any) => item._id === this.id
          );
          if (index !== -1) {
            this.dataTable._selection.splice(index, 1);
            delete this.dataTable.selectionKeys[this.id];
            this.dataTable.updateSelectionKeys();
          }
        } else {
          this.selectedItemsChange.emit(event);
          this.selectedItems = event;
        }
      } else {
        this.selectedItemsChange.emit(event);
        this.selectedItems = event;
      }
    }
  }

  onRowSelect(event: any) {
    if (this.prohibitDeletion?.length) {
      this.showProhibitDelettingMsg = false;
      this.id = '';
      let item = event.data;
      for (let key of this.prohibitDeletion) {
        if (item[key] && item[key].length) {
          this.showProhibitDelettingMsg = true;
          this.id = item._id;
        }
        if (this.showProhibitDelettingMsg) {
          break;
        }
      }
      if (this.id) {
        const index = this.dataTable._selection.findIndex(
          (item: any) => item._id === this.id
        );
        if (index !== -1) {
          this.dataTable._selection[index]['selected'] = false;
          this.dataTable._selection.splice(index, 1);
          delete this.dataTable.selectionKeys[this.id];
          this.dataTable.updateSelectionKeys();
          return;
        }
      }
    }

  }
  close() {
    let item = this.dataTable._value.find((v: any) => v._id === this.id);
    if (item) item['rowSelectable'] = true;
    this.showProhibitDelettingMsg = false;
    delete this.dataTable.selectionKeys[this.id];
    this.id = '';
    this.dataTable.updateSelectionKeys();
    this.dataTable.selectionChange.emit();

  }

  filtereddata: any[] = [];
  filter: 'all' | 'active' | 'inactive' | 'archived' = 'all';
  filterData(status: any) {
    this.filter = status;
    if (status === 'all') {

      this.filteredData = this.data;
    } else {

      this.filteredData = this.data.filter(
        (item: any) => item.status === status
      );
    }
  }
}
