import moment from 'moment';
import React from 'react';
import { IDataCellProps } from '../interfaces';
import { asNumber } from '../utils';

export interface ITimeCellProps<D extends object = {}, V = any> extends IDataCellProps<D, V> {}

export const TimeCell = <D extends object = {}, V = number>(props: ITimeCellProps<D, V>) => {
  const numberValue = asNumber(props.value);
  return numberValue ? <>{moment.utc(numberValue * 1000).format(props.propertyMeta?.dataFormat || 'HH:mm')}</> : null;
};

export default TimeCell;
