import { pipe } from 'src/app/shared/pipes/generic.pipe';

// #region Types

type ColorType = string | string[] | { inc: string | string[] };

type Colors =
  | 'blue'
  | 'brown'
  | 'gray'
  | 'green'
  | 'indigo'
  | 'lime'
  | 'orange'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow';

type FilterType =
  | 'icon'
  | 'file'
  | 'chips'
  | 'text'
  | 'date'
  | 'numeric'
  | 'boolean'
  | 'template'
  | 'taxonomie';

// #endregion Types

// #region Interfaces

export interface OnDeleteEvent {
  id: string[];
  etat: 'code-2';
  data?: any[];
}

export interface ListHeader {
  field: string;
  header: string;
  editable?:boolean;
  sort?: boolean;
  length?:boolean;
  render?: boolean;
  filter?: boolean;
  filterType?: FilterType;
  display?:string;
  filterData?: any[];
  translate?:boolean;
  pipes?: pipe[];
  prefix?: string;
  suffix?: string;
  colorize?: Partial<Record<Colors, ColorType>>;
  colorizeStyle?: {
    match: ColorType;
    backgroundColor: string;
    color: string;
  }[];
  dataType?:string;
  serviceName ?:string;
}

export interface expanded extends Partial<List> {
  dataField?: string;
}

export interface Button {
  showButton ?:boolean;
  label?: string;
  tooltip?:string;
  toolTipPosition?:string;
  icon?: string;
  class?: string;
  style?: { [key: string]: any };
  disable ?: boolean;
  hide ?:{attribut :string , values : any}
  condition?: any;
  command?: (rowIndex: number, rowData: any) => void;
}

export interface ListCaptionConfig {
  globalFilter?: boolean;
  csv?: boolean;
  pdf?: boolean;
  xls?: boolean;
  selection?: boolean;
  displayedColumns?: boolean;
  clearTable?: boolean;
  refreshData?: boolean;
  expanded?: expanded | null;
  addButton?: any;
  sortButton?:Button;
  validateButton?:any;
  selectionType?: 'single' | 'multiple';
  summary?: {
    enabled: boolean;
    message: string;
  };
  buttons?: Button[];
  buttonsCaption?: Button[];
  actions?: {
    clone?: boolean;
    delete?: boolean;
    edit?: boolean;
    detail?: boolean;
    close?: boolean;
    translate?: boolean;
    add?: () => void;
  };
  typeTable?: string;
  rowGroup?: {
    sortField?: string;
    groupMode?: "subheader" | "rowspan" | undefined;
    groupBy?: string;

  } | null
}

export interface List {
  _id?: string;
  headers: ListHeader[];
  captionConfig: ListCaptionConfig | null;
  etatObjet?: 'code-1' | 'code-2';
  etatCreation?: string;
}

// #endregion Interfaces
