import moment, { Moment } from 'moment';
import { IPropertyMetadata } from '../../interfaces/metadata';
import { getDataFormat } from 'utils/metadata';
import { getMoment } from '../../utils/date';
import { IDateFieldProps, RangeValue } from './interfaces';

export const DATE_TIME_FORMATS = {
  time: 'HH:mm:ss',
  week: 'YYYY-wo',
  date: 'DD/MM/YYYY',
  quarter: 'YYYY-\\QQ',
  month: 'YYYY-MM',
  year: 'YYYY',
};

export const getDatePickerValue = (props: IDateFieldProps, pickerFormat: string) => {
  const { value, injectedDefaultValue } = props;

  /** Used to changed value/defaultValue based on whether it's rendered on the table **/
  if (injectedDefaultValue) {
    return { defaultValue: getMoment(value, pickerFormat) };
  }

  /** Used to handle the value based on default date-picker implementation **/
  return { value: getMoment(value, pickerFormat) };
};

export function disabledDate(props: IDateFieldProps, current: Moment, data: object, globalState: object) {
  const { disabledDateMode, disabledDateTemplate, disabledDateFunc } = props;

  if (disabledDateMode === 'none') return false;

  const disabledTimeExpression = disabledDateMode === 'functionTemplate' ? disabledDateTemplate : disabledDateFunc;

  // tslint:disable-next-line:function-constructor
  const disabledFunc = new Function('current', 'moment', 'data', 'globalState', disabledTimeExpression);

  return disabledFunc(current, moment, data, globalState);
}

export const getDefaultFormat = ({ dateOnly, resolveToUTC }: IDateFieldProps) => {
  if (dateOnly) {
    return 'YYYY-MM-DD';
  }

  if (!resolveToUTC) {
    return 'YYYY-MM-DDTHH:mm:ss';
  }

  return null;
};

export const getFormat = (props: IDateFieldProps, properties: IPropertyMetadata[]) => {
  const { propertyName, picker, showTime } = props || {};

  const dateFormat = props?.dateFormat || getDataFormat(properties, propertyName) || DATE_TIME_FORMATS.date;
  const timeFormat = props?.timeFormat || DATE_TIME_FORMATS.time;
  const yearFormat = props?.yearFormat || DATE_TIME_FORMATS.year;
  const quarterFormat = props?.quarterFormat || DATE_TIME_FORMATS.quarter;
  const monthFormat = props?.monthFormat || DATE_TIME_FORMATS.month;
  const weekFormat = props?.weekFormat || DATE_TIME_FORMATS.week;

  switch (picker) {
    case 'date':
      return showTime ? `${dateFormat} ${timeFormat}` : dateFormat;
    case 'year':
      return yearFormat;
    case 'month':
      return monthFormat;
    case 'quarter':
      return quarterFormat;
    case 'time':
      return timeFormat;
    case 'week':
      return weekFormat;
    default:
      return dateFormat;
  }
};

export const getRangePickerValues = (valueToUse: any, pickerFormat: string) =>
  (Array.isArray(valueToUse) && valueToUse?.length === 2
    ? valueToUse?.map((v) => moment(new Date(v), pickerFormat))
    : [null, null]) as RangeValue;
