import { IConfigurableActionConfiguration } from 'interfaces/configurableAction';
import { ProperyDataType } from 'interfaces/metadata';
import { Moment } from 'moment';
import { IDataColumnsProps, IEditableColumnProps } from '../datatableColumnsConfigurator/models';
export type ColumnFilter = string[] | number[] | Moment[] | Date[] | string | number | Moment | Date | boolean;

export type IndexColumnFilterOption =
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'equals'
  | 'lessThan'
  | 'greaterThan'
  | 'between'
  | 'before'
  | 'after';

export type DatatableColumnType = 'data' | 'action' | 'calculated' | 'crud-operations';

export type SortDirection = 0 /*asc*/ | 1 /*desc*/;
export type ColumnSorting = 'asc' | 'desc';

export interface ITableColumn {
  columnType: DatatableColumnType;

  id?: string;
  columnId?: string;
  accessor: string;
  header: string;
  caption?: string;
  
  isVisible: boolean; // is visible in the table (including columns selector, filter etc.)
  show?: boolean; // is visible on client
  isFilterable: boolean;
  isSortable: boolean;

  minWidth?: number;
  maxWidth?: number;

  filterOption?: IndexColumnFilterOption;
  filter?: any;
  
  defaultSorting?: SortDirection;
  name?: string;
  allowShowHide?: boolean;
}

export interface ITableDataColumn extends ITableColumn, IEditableColumnProps {
  propertyName?: string;
  dataType?: ProperyDataType;
  dataFormat?: string;
  
  referenceListName?: string;
  referenceListModule?: string;
  entityReferenceTypeShortAlias?: string;
  allowInherited?: boolean;
}

export interface ITableActionColumn extends ITableColumn, IActionColumnProps {

}

export interface ITableCrudOperationsColumn extends ITableColumn {

}

export interface ICustomFilterOptions {
  readonly id: string;
  readonly name: string;
  readonly isApplied?: boolean;
}

export interface IFilterItem {
  readonly columnId: string;
  readonly filterOption: IndexColumnFilterOption;
  filter: ColumnFilter;
}

export interface IColumnSorting {
  readonly id: string;
  readonly desc: boolean;
}

export interface IGetDataFromUrlPayload {
  readonly maxResultCount: number;
  readonly skipCount: number;
  readonly properties: string;
  readonly sorting?: string;
  readonly filter?: string;
  readonly quickSearch?: string;
}

export interface IGetDataFromBackendPayload {
  readonly entityType: string;
  readonly maxResultCount: number;
  readonly skipCount: number;
  readonly properties: string;
  readonly sorting?: string;
  readonly filter?: string;
  readonly quickSearch?: string;
}

export interface IExcelColumn {
  readonly propertyName: string;
  readonly label: string;
}

export interface IExportExcelPayload extends IGetDataFromBackendPayload {
  columns: IExcelColumn[];
}

export interface IGetListDataPayload {
  readonly pageSize: number;
  readonly currentPage: number;
  readonly columns: ITableDataColumn[];
  readonly sorting?: IColumnSorting[];
  readonly filter?: string;
  readonly quickSearch?: string;
}

export interface ITableConfigResponse {
  readonly columns?: any[];
  readonly storedFilters?: any[];
}

export interface ITableFilter {
  readonly columnId: string;
  readonly filterOption: IndexColumnFilterOption;
  readonly filter: any;
}

export interface IQuickFilter {
  readonly id: string;
  readonly name: string;
  readonly selected?: boolean;
}

export type FilterType = 'predefined' | 'user-defined' | 'quick';
export interface IStoredFilter {
  id: string;

  name: string;

  tooltip?: string;
  // Exclusive filters cannot be applied on top of other filters. Only one can be selected

  expression?: string | object;

  selected?: boolean;

  defaultSelected?: boolean;

  //#region dynamic expressions
  hasDynamicExpression?: boolean;

  allFieldsEvaluatedSuccessfully?: boolean;

  unevaluatedExpressions?: string[];
  //#endregion
}

export interface ITableDataResponse {
  readonly totalCount: number;
  readonly items: object[];
}

export interface ITableDataInternalResponse {
  readonly totalPages: number;
  readonly totalRows: number;
  readonly totalRowsBeforeFilter: number;
  readonly rows: object[];
}

export interface IPublicDataTableActions {
  refreshTable: () => void;
  exportToExcel?: () => void;
}

export interface IDataTableInstance extends IPublicDataTableActions { }

export type ListSortDirection = 0 | 1;

export interface DataTableColumnDto {
  propertyName?: string | null;
  name?: string | null;
  caption?: string | null;
  description?: string | null;
  dataType?: string | null;
  dataFormat?: string | null;
  referenceListName?: string | null;
  referenceListModule?: string | null;
  entityReferenceTypeShortAlias?: string | null;
  allowInherited?: boolean;
  isFilterable?: boolean;
  isSortable?: boolean;
}

//#region todo: remove
export interface GetColumnsInput {
  entityType: string;
  properties?: string[] | null;
}

export interface DataTableColumnDtoListAjaxResponse {
  targetUrl?: string | null;
  success?: boolean;
  error?: ErrorInfo;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
  result?: DataTableColumnDto[] | null;
}

export interface ValidationErrorInfo {
  message?: string | null;
  members?: string[] | null;
}

export interface ErrorInfo {
  code?: number;
  message?: string | null;
  details?: string | null;
  validationErrors?: ValidationErrorInfo[] | null;
}
//#endregion

export interface ITableColumnsBuilder {
  columns: IDataColumnsProps[];
  addProperty: (name: string, caption: string) => ITableColumnsBuilder;
}

export type TableColumnsFluentSyntax = (builder: ITableColumnsBuilder) => void;

export interface IActionColumnProps {
  /**
   * Icon, is used for action columns
   */
   icon?: string;

   /**
    * Configurable action configuration
    */
   actionConfiguration?: IConfigurableActionConfiguration;  
}